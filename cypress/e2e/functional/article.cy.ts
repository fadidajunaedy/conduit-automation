import ArticlePage from "../../pages/ArticlePage";

const articlePage: ArticlePage = new ArticlePage();

describe("Reader Perspective (Interaction)", function () {
  beforeEach(function () {
    cy.fixture("target-article.json").as("targetArticle");
    cy.fixture("user.json").as("userData");
  });

  beforeEach(function () {
    cy.login(this.userData.email, this.userData.password);
    articlePage.visit(this.targetArticle.slug);
  });

  it("Verify navigation to author profile when clicking Author Name", function () {
    cy.intercept("GET", "**/profiles/*").as("getProfile");

    articlePage.authorName.then(function (authorName) {
      articlePage.clickAuthor();

      cy.wait("@getProfile");
      cy.url().should("contain", "/profile/");

      cy.log(authorName);
      cy.get(".user-info h4").should("contain", authorName);
    });
  });

  it("Verify user can Follow/Unfollow author", function () {
    cy.intercept("POST", "**/profiles/**/follow").as("followAuthor");

    articlePage.authorName.then(function (authorName) {
      cy.unfollowProfile(authorName);
    });

    cy.reload();

    articlePage.followAuthorButton
      .invoke("text")
      .then(function (initialTextButton) {
        const cleanText = initialTextButton.trim();

        expect(cleanText).to.contain("Follow");
        expect(cleanText).not.to.contain("Unfollow");

        articlePage.toggleFollowAuthor();

        // cy.wait("@followAuthor");
        cy.reload();

        articlePage.followAuthorButton
          .invoke("text")
          .then(function (currentTextButton) {
            expect(currentTextButton).to.contain("Unfollow");
            articlePage.toggleFollowAuthor();
          });
      });
  });

  it("Verify user can Favorite/Unfavorite article", function () {
    cy.intercept("POST", "**/articles/**/favorite").as("addArticleFavorite");
    cy.removeFavoriteArticle(this.targetArticle.slug);

    articlePage.favoriteArticleCounter.then(function (initialNumber: number) {
      articlePage.favoriteArticleButton.should("not.have.class", "btn-primary");
      articlePage.toggleFavoriteArticle();
      cy.wait("@addArticleFavorite");
      cy.reload();

      articlePage.favoriteArticleCounter.then(function (newNumber) {
        cy.log("Initial Number: " + initialNumber);
        cy.log("New Number: " + newNumber);

        expect(newNumber).to.be.greaterThan(initialNumber);
        articlePage.favoriteArticleButton.should("have.class", "btn-primary");
      });
    });
  });

  it("Verify user can post a comment", function () {
    cy.intercept("POST", "**/articles/**/comments").as("postingComment");

    const bodyComment = `Lorem ipsum ${Date.now().toString()}`;
    articlePage.fillComment(bodyComment);
    articlePage.submitComment();

    cy.wait("@postingComment").then(function (interception) {
      const commentId = interception.response.body.comment.id;

      cy.reload();
      articlePage.commentList
        .find(".card-text")
        .filter(`:contains('${bodyComment}')`)
        .should("exist");

      cy.removeCommentArticle(this.targetArticle.slug, commentId);
    });
  });

  it("Verify user can delete their own comment", function () {
    cy.intercept("DELETE", "**/articles/**/comments/**").as("deleteComment");

    cy.addCommentArticle(
      this.targetArticle.slug,
      `Lorem ipsum ${Date.now().toString()}`
    ).then(function (responseBody) {
      articlePage.getComment(responseBody.comment.body).should("exist");
      articlePage.deleteComment(responseBody.comment.body);

      cy.wait("@deleteComment");

      articlePage.getComment(responseBody.comment.body).should("not.exist");
    });
  });
});

describe("Author Perspective (Ownership)", function () {
  beforeEach(function () {
    cy.fixture("target-article.json").as("targetArticle");
    cy.fixture("user.json").as("userData");
  });

  beforeEach(function () {
    cy.login(this.userData.email, this.userData.password);
  });

  it("Verify 'Edit' and 'Delete' article buttons are VISIBLE for the author", function () {
    cy.intercept("GET", "**/articles/*").as("getArticle");

    const uniqueSlug = Date.now().toString();
    const articleData = {
      title: `Test Article ${uniqueSlug}`,
      description: "dummy description",
      body: "dummy body",
      tagList: ["Dummy Tag 1", "Dummy Tag 2"],
    };

    cy.addArticle(articleData).then(function (responseBody) {
      const slug = responseBody.article.slug;

      articlePage.visit(slug);

      cy.wait("@getArticle");
      articlePage.followAuthorButton.should("not.exist");
      articlePage.favoriteArticleButton.should("not.exist");

      articlePage.editArticleButton.should("be.visible");
      articlePage.deleteArticleButton.should("be.visible");

      cy.removeArticle(slug);
    });
  });

  it("Verify 'Edit' and 'Delete' article buttons are HIDDEN for non-authors", function () {
    cy.intercept("GET", "**/articles/*").as("getArticle");

    articlePage.visit(this.targetArticle.slug);

    cy.wait("@getArticle");
    articlePage.followAuthorButton.should("be.visible");
    articlePage.favoriteArticleButton.should("be.visible");

    articlePage.editArticleButton.should("not.exist");
    articlePage.deleteArticleButton.should("not.exist");
  });
});
