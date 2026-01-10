import Navbar from "./components/Navbar";

class HomePage {
  readonly navbar: Navbar;

  constructor() {
    this.navbar = new Navbar();
  }

  get yourFeedLink() {
    return cy.get("a.nav-link").contains("Your Feed");
  }

  get globalFeedLink() {
    return cy.get("a.nav-link").contains("Global Feed");
  }

  get articlePreviewList() {
    return cy.get(".article-preview");
  }

  get popularTagList() {
    return cy.get(".sidebar .tag-list .tag-pill");
  }

  visit() {
    cy.visit("/");
  }

  clickYourFeedLink() {
    this.yourFeedLink.click();
  }

  clickGlobalFeedLink() {
    this.globalFeedLink.click();
  }

  getArticlePreviewItem(title: string) {
    return this.articlePreviewList
      .filter(`:contains("${title}")`)
      .should("be.visible");
  }

  getArticleSlug(title: string) {
    return this.getArticlePreviewItem(title)
      .find("a")
      .invoke("attr", "href")
      .then((href) => {
        return href.replace("/article/", "");
      });
  }

  openArticle(title: string) {
    this.getArticlePreviewItem(title).find(".preview-link").click();
  }

  getAuthor(title: string) {
    this.getArticlePreviewItem(title).find(".author");
  }

  clickAuthor(title: string) {
    this.getArticlePreviewItem(title).find(".author").click();
  }

  getFavoriteCount(title: string) {
    return this.getArticlePreviewItem(title)
      .find("app-favorite-button button")
      .invoke("text");
  }

  toggleFavorite(title: string) {
    this.getArticlePreviewItem(title)
      .find("app-favorite-button button")
      .click();
  }

  getTags(title: string) {
    return this.getArticlePreviewItem(title).find(".tag-list li");
  }

  clickPopularTag(tagName: string) {
    this.popularTagList.filter(`:contains("${tagName}")`).click();
  }
}

export default HomePage;
