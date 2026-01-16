import Navbar from "./components/Navbar";

class ProfilePage {
  readonly navbar: Navbar;

  constructor() {
    this.navbar = new Navbar();
  }

  get image() {
    return cy.get(".user-img");
  }

  get username() {
    return cy.get(".user-info h4");
  }

  get bio() {
    return cy.get(".user-info p");
  }

  get editProfileSettingsButton() {
    return cy.get(".user-info a[href='/settings']");
  }

  get myPostsTabLink() {
    return cy.get(".nav-link").contains("My Posts");
  }

  get favoritedPostsTabLink() {
    return cy.get(".nav-link").contains("Favorited Posts");
  }

  get articlePreviewList() {
    return cy.get(".article-preview");
  }

  visit(username: string) {
    cy.visit(`profile/${username}`);
  }

  getImageUrl() {
    return this.image.invoke("attr", "src");
  }

  goToProfileSettings() {
    this.editProfileSettingsButton.click();
  }

  openTabMyPosts() {
    this.myPostsTabLink.click();
  }

  openTabFavoritedPosts() {
    this.favoritedPostsTabLink.click();
  }

  getArticlePreviewItem(title: string) {
    return this.articlePreviewList.filter(`:contains("${title}")`);
  }
}

export default ProfilePage;
