import ProfilePage from "../../pages/ProfilePage";
import { generateArticle } from "../../factories/article-factory";

const profilePage: ProfilePage = new ProfilePage();

describe("Profile Page - My Profile View", function () {
  beforeEach(function () {
    cy.fixture("target-article.json").as("targetArticle");
    cy.fixture("user.json").as("userData");
  });

  beforeEach(function () {
    cy.login(this.userData.email, this.userData.password);
    cy.getCurrentUser().then((responseBody) => {
      profilePage.visit(responseBody.user.username);
    });
  });

  it("Should display correct user information (Username, Bio, Image)", function () {
    cy.getCurrentUser().then((responseBody) => {
      profilePage.username.should("contain.text", responseBody.user.username);
      profilePage.bio.should("contain.text", responseBody.user.bio);
      profilePage
        .getImageUrl()
        .then((url) => expect(url).to.be.equal(responseBody.user.image));
    });
  });

  it('Should display "Edit Profile Settings" button', function () {
    cy.getCurrentUser().then(function () {
      profilePage.editProfileSettingsButton.should("be.visible");
      profilePage.followAuthorButton.should("not.exist");
    });
  });

  it('Should navigate to Settings page when clicking "Edit Profile Settings"', function () {
    cy.getCurrentUser().then(function () {
      profilePage.editProfileSettingsButton.should("be.visible");
      profilePage.goToProfileSettings();
      cy.url().should("contain", "/settings");
    });
  });

  it('Should default to "My Articles" tab and display created articles', function () {
    const articleData = generateArticle();
    cy.addArticle(articleData).then((responseBody) => {
      const slug = responseBody.article.slug;
      const title = responseBody.article.title;

      cy.reload();
      profilePage.myPostsTabLink.should("have.class", "active");
      profilePage.getArticlePreviewItem(title).should("exist");

      cy.removeArticle(slug);
    });
  });

  it('Should switch to "Favorited Articles" tab and display liked articles', function () {
    cy.intercept("GET", "**/articles?favorited=**").as("getArticleFavorited");

    cy.addFavoriteArticle(this.targetArticle.slug);

    cy.reload();
    profilePage.favoritedPostsTabLink.should("not.have.class", "active");
    profilePage.openTabFavoritedPosts();

    cy.wait("@getArticleFavorited");
    profilePage.getArticlePreviewItem(this.targetArticle.title).should("exist");

    cy.removeFavoriteArticle(this.targetArticle.slug);
  });
});

describe("Profile Page - Other Author View", function () {
  beforeEach(function () {
    cy.fixture("target-article.json").as("targetArticle");
    cy.fixture("user.json").as("userData");
  });

  beforeEach(function () {
    cy.login(this.userData.email, this.userData.password);
    profilePage.visit("Artem Bondar");
  });

  it("Should display 'Follow' button instead of 'Edit Profile'", function () {
    profilePage.followAuthorButton.should("be.visible");
    profilePage.editProfileSettingsButton.should("not.exist");
  });

  it("Should allow user to Follow an author", function () {
    cy.intercept("POST", "**/profiles/**/follow").as("followAuthor");

    cy.unfollowProfile("Artem Bondar");

    profilePage.followAuthorButton.should("be.visible");
    profilePage.followAuthor();

    cy.wait("@followAuthor");
    cy.reload();

    profilePage.followAuthorButton.invoke("text").then((text) => {
      const cleanText = text.trim();

      expect(cleanText).to.contain("Unfollow");
      expect(cleanText).not.to.contain("Follow");
    });
  });

  it("Should allow user to Unfollow an author", function () {
    cy.intercept("DELETE", "**/profiles/**/follow").as("unfollowAuthor");

    cy.followProfile("Artem Bondar");
    profilePage.followAuthorButton.should("be.visible");
    profilePage.followAuthor();

    cy.wait("@unfollowAuthor");
    cy.reload();

    profilePage.followAuthorButton.invoke("text").then((text) => {
      const cleanText = text.trim();

      expect(cleanText).to.contain("Follow");
      expect(cleanText).not.to.contain("Unfollow");
    });
  });
});
