class Navbar {
  get navbar() {
    return cy.get(".navbar");
  }

  get brandLink() {
    return this.navbar.find(".navbar-brand");
  }

  get SignInLink() {
    return this.navbar.find("a").contains("Sign in");
  }

  get SignUpLink() {
    return this.navbar.find("a").contains("Sign up");
  }

  get homeLink() {
    return this.navbar.find("a").contains("Home");
  }

  get newArtcileLink() {
    return this.navbar.find("a").contains("New Article");
  }

  get settingsLink() {
    return this.navbar.find("a").contains("Settings");
  }

  get profileLink() {
    return this.navbar.find("a[href*='/profile/']");
  }

  clickBrandLink() {
    this.brandLink.click();
  }

  clickSignInLink() {
    this.SignInLink.click();
  }

  clickSignUpLink() {
    this.SignUpLink.click();
  }

  clickHomeLink() {
    this.homeLink.click();
  }

  clickNewArticleLink() {
    this.newArtcileLink.click();
  }

  clickSettingsLink() {
    this.settingsLink.click();
  }

  clickProfileLink() {
    this.profileLink.click();
  }
}

export default Navbar;
