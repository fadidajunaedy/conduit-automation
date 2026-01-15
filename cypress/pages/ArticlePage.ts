import Navbar from "./components/Navbar";

class ArticlePage {
  readonly navbar: Navbar;

  constructor() {
    this.navbar = new Navbar();
  }

  get title() {
    return cy
      .get(".article-page")
      .find("h1")
      .invoke("text")
      .then((text) => {
        return text.trim();
      });
  }

  get author() {
    return cy.get(".author").first();
  }

  get authorName() {
    return this.author.invoke("text").then((text) => {
      return text.trim();
    });
  }

  get followAuthorButton() {
    return cy.get("app-follow-button:first button");
  }

  get favoriteArticleButton() {
    return cy.get("app-favorite-button:first button");
  }

  get editArticleButton() {
    return cy.get("a[href*='/editor/']:first");
  }

  get deleteArticleButton() {
    return cy.get("button.btn-outline-danger:first");
  }

  get favoriteArticleCounter() {
    return this.favoriteArticleButton
      .find(".counter")
      .invoke("text")
      .then((text: string) => {
        return parseInt(text.replace("(", "").replace(")", "").trim());
      });
  }

  get commentTextarea() {
    return cy.get("textarea[placeholder*='comment']");
  }

  get postCommentButton() {
    return cy.get("button[type='submit']").contains("Post Comment");
  }

  get commentList() {
    return cy.get("app-article-comment .card");
  }

  visit(slug: string) {
    cy.visit(`/article/${slug}`);
  }

  clickAuthor() {
    this.author.click();
  }

  toggleFollowAuthor() {
    this.followAuthorButton.click();
  }

  toggleFavoriteArticle() {
    this.favoriteArticleButton.click();
  }

  clickEditArticle() {
    this.editArticleButton.click();
  }

  clickDeleteArticle() {
    this.deleteArticleButton.click();
  }

  fillComment(comment: string) {
    this.commentTextarea.type(comment);
  }

  submitComment() {
    this.postCommentButton.click();
  }

  getComment(comment: string) {
    return this.commentList.filter(`:contains("${comment}")`);
  }

  getCommentText(comment: string) {
    return this.getComment(comment)
      .find(".card-text")
      .invoke("text")
      .then((text) => {
        return text.trim();
      });
  }

  deleteComment(comment: string) {
    return this.getComment(comment)
      .find(".mod-options i[class*='trash']")
      .click();
  }
}

export default ArticlePage;
