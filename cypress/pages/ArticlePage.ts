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
    return cy.get("app-follow-button button").first();
  }

  get favortiteArticleButton() {
    return cy.get("app-favorite-button button").first();
  }

  get editArticeButton() {
    return cy.get("button").contains("Edit Article").first();
  }

  get deleteArticeButton() {
    return cy.get("button").contains("Delete Article").first();
  }

  get favoriteArticleCounter() {
    return this.favoriteArticleCounter
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
    this.favortiteArticleButton.click();
  }

  clickEditArticle() {
    this.editArticeButton.click();
  }

  clickDeleteArticle() {
    this.deleteArticeButton.click();
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
