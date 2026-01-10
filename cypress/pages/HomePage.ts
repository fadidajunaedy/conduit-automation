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

  get paginationButtonList() {
    return cy.get(".pagination .page-item button");
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
      .find(".preview-link")
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

  getFavoriteButton(title: string) {
    return this.getArticlePreviewItem(title).find("app-favorite-button button");
  }

  getFavoriteCount(title: string) {
    return this.getFavoriteButton(title)
      .invoke("text")
      .then((text) => {
        return parseInt(text.trim());
      });
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

  getPaginationButton(pageNumber: string | number) {
    return this.paginationButtonList.contains(pageNumber);
  }

  clickPagination(pageNumber: string | number) {
    this.getPaginationButton(pageNumber).click();
  }
}

export default HomePage;
