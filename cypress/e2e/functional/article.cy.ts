import ArticlePage from "../../pages/ArticlePage";
import SettingsPage from "../../pages/SettingsPage";

const articlePage: ArticlePage = new ArticlePage();
const targetArticleSlug =
  "Mastering-Knowledge-with-Self-Assessments:-Identifying-and-Bridging-Learning-Gaps-in-Education-1";

describe("Reader Perspective (Interaction)", () => {
  beforeEach(() => {
    cy.login("fadidajunaedy@mail.com", "qq332211");
    articlePage.visit(targetArticleSlug);
  });

  it("Verify navigation to author profile when clicking Author Name", () => {
    cy.intercept("GET", "**/profiles/*").as("getProfile");

    articlePage.authorName.then((authorName) => {
      articlePage.clickAuthor();

      cy.wait("@getProfile");
      cy.url().should("contain", "/profile/");

      cy.log(authorName);
      cy.get(".user-info h4").should("contain", authorName);
    });
  });

  it.only("Verify user can Follow/Unfollow author", () => {
    cy.intercept("POST", "**/profiles/**/follow").as("followProfile");

    articlePage.authorName.then((authorName) => {
      cy.unfollowProfile(authorName);
      cy.reload();

      articlePage.followAuthorButton
        .invoke("text")
        .then((initialTextButton) => {
          const cleanText = initialTextButton.trim();

          expect(cleanText).to.contain("Follow");
          expect(cleanText).not.to.contain("Unfollow");

          articlePage.toggleFollowAuthor();
          cy.wait("@followProfile");

          articlePage.followAuthorButton
            .invoke("text")
            .then((currentTextButton) => {
              expect(currentTextButton).to.contain("Unfollow");
            });
        });
    });
  });
});
