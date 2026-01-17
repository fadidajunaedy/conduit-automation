import SignInPage from "../pages/SignInPage";
import HomePage from "../pages/HomePage";
import EditorPage from "../pages/EditorPage";
import ArticlePage from "../pages/ArticlePage";
import SettingsPage from "../pages/SettingsPage";
import { generateArticle } from "../factories/article-factory";
import ProfilePage from "../pages/ProfilePage";

const signInPage: SignInPage = new SignInPage();
const homePage: HomePage = new HomePage();
const editorPage: EditorPage = new EditorPage();
const articlePage: ArticlePage = new ArticlePage();
const settingsPage: SettingsPage = new SettingsPage();
const profilePage: ProfilePage = new ProfilePage();

describe("User Journeys", function () {
  beforeEach(function () {
    cy.fixture("target-article.json").as("targetArticle");
    cy.fixture("user.json").as("userData");
  });

  beforeEach(function () {
    cy.intercept("POST", "**/users/login").as("login");

    signInPage.visit();

    signInPage.fillLoginForm(this.userData.email, this.userData.password);
    signInPage.submit();

    cy.wait("@login");

    cy.url().should("equal", `${Cypress.config("baseUrl")}/`);
  });

  it("The Author's Lifecycle (Create > Verify in Feed > Edit > Delete)", function () {
    cy.intercept("POST", "**/articles").as("addArticle");
    cy.intercept("PUT", "**/articles/**").as("editArticle");
    cy.intercept("DELETE", "**/articles/**").as("removeArticle");

    cy.log("Create");
    editorPage.visit();

    const articleData = generateArticle();
    editorPage.fillTitle(articleData.title);
    editorPage.fillDescription(articleData.description);
    editorPage.fillBody(articleData.body);
    editorPage.fillTags(articleData.tagList[0]);
    editorPage.fillTags(articleData.tagList[1]);
    editorPage.submit();

    cy.wait("@addArticle").then(function (interception) {
      const slug = interception.response.body.article.slug;
      const title = interception.response.body.article.title;

      cy.url().should("contain", slug);
      cy.get("h1").should("contain", title);

      cy.log("Verify in Feed");
      homePage.visit();
      homePage.getArticlePreviewItem(title).should("be.visible");

      cy.log("Edit");
      homePage.openArticle(title);
      cy.url().should("contain", `/article/${slug}`);
      cy.get("h1").should("contain", title);

      articlePage.clickEditArticle();
      const newArticleData = generateArticle();
      editorPage.clearTitle();
      editorPage.fillTitle(newArticleData.title);
      editorPage.clearDescription();
      editorPage.fillDescription(newArticleData.description);
      editorPage.submit();

      cy.wait("@editArticle").then(function (editInterception) {
        const newSlug = editInterception.response.body.article.slug;
        const newTitle = editInterception.response.body.article.title;

        cy.url().should("contain", newSlug);
        articlePage.title.should("have.text", newTitle);

        cy.log("Delete");
        articlePage.clickDeleteArticle();

        cy.wait("@removeArticle").then(function () {
          homePage.getArticlePreviewItem(newTitle).should("not.exist");
        });
      });
    });
  });

  it("The Fan Interaction", function () {
    cy.intercept("POST", "**/users/login").as("login");
    cy.intercept("POST", "**/articles/**/favorite").as("addArticleFavorite");
    cy.intercept("POST", "**/profiles/**/follow").as("followAuthor");

    cy.removeFavoriteArticle(this.targetArticle.slug);
    cy.unfollowProfile(this.targetArticle.author);

    cy.log("Discovery");
    homePage.openArticle(this.targetArticle.title);
    cy.url().should("contain", `/article/${this.targetArticle.slug}`);
    cy.get("h1").should("contain", this.targetArticle.title);

    cy.log("Interaction (Like)");
    articlePage.favoriteArticleCounter.then(function (initialCount: number) {
      articlePage.favoriteArticleButton.should("not.have.class", "btn-primary");
      articlePage.toggleFavoriteArticle();
      cy.wait("@addArticleFavorite");
      cy.reload();

      articlePage.favoriteArticleCounter.then(function (newCount: number) {
        cy.log("Initial Count: " + initialCount);
        cy.log("New Count: " + newCount);

        expect(newCount).to.be.greaterThan(initialCount);
        articlePage.favoriteArticleButton.should("have.class", "btn-primary");
      });
    });

    cy.log("Interaction (Follow)");
    articlePage.followAuthorButton
      .invoke("text")
      .then(function (initialTextButton) {
        const cleanText = initialTextButton.trim();

        expect(cleanText).to.contain("Follow");
        expect(cleanText).not.to.contain("Unfollow");

        articlePage.toggleFollowAuthor();

        cy.wait("@followAuthor");
        cy.reload();

        articlePage.followAuthorButton
          .invoke("text")
          .then(function (currentTextButton) {
            expect(currentTextButton).to.contain("Unfollow");
          });
      });

    cy.log("Verification (Personalized Feed)");
    homePage.visit();
    homePage.clickYourFeedLink();
    homePage
      .getArticlePreviewItem(this.targetArticle.title)
      .should("be.visible");
  });

  it("Identity & Security Update", function () {
    cy.intercept("POST", "**/users/login").as("login");
    cy.intercept("PUT", "**/user").as("updateUser");
    cy.intercept("GET", "**/profiles/*").as("getProfileUser");

    cy.log("Update Bio & Image");
    settingsPage.visit();

    const newProfileImageUrl = "https://placehold.co/400x400/000000/FFFFFF/png";
    const newBio = `New bio ${Date.now().toString()}`;

    settingsPage.navbar.profileImageUrl.then(function (initialUrl) {
      cy.log("Initial URL: " + initialUrl);
      cy.log("New URL: " + newProfileImageUrl);

      settingsPage.fillProfileImageUrl(newProfileImageUrl);
      settingsPage.fillBio(newBio);
      settingsPage.submit();

      cy.wait("@updateUser");
      cy.url().should("contain", "/profile/");
      profilePage.getImageUrl().then(function (url) {
        expect(url).to.be.not.equal(initialUrl);
        expect(url).to.be.equal(newProfileImageUrl);

        cy.updateUser({ image: initialUrl });
      });
      profilePage.bio.should("contain.text", newBio);
    });

    cy.log("Update Credential (Critical)");
    const newEmail: string = "new_fadidajunaedy@test.com";
    const newPassword: string = "new_password";

    settingsPage.visit();
    settingsPage.fillEmail(newEmail);
    settingsPage.fillPassword(newPassword);
    settingsPage.submit();

    cy.wait("@updateUser");
    cy.url().should("contain", "/profile/");

    cy.log("Validation (Re-Auth)");
    settingsPage.visit();
    settingsPage.logout();
    signInPage.visit();

    signInPage.fillLoginForm(this.userData.email, this.userData.password);
    signInPage.submit();

    cy.wait("@login");
    cy.get(".error-messages").should(
      "contain.text",
      "email or password is invalid"
    );

    signInPage.fillLoginForm(newEmail, newPassword);
    signInPage.submit();

    cy.wait("@login");
    cy.url().should("equal", `${Cypress.config("baseUrl")}/`);
    cy.window()
      .its("localStorage")
      .invoke("getItem", "jwtToken")
      .should("exist");

    cy.updateUser({
      email: this.userData.email,
      password: this.userData.password,
    });
  });
});
