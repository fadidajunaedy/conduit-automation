import Navbar from "./components/Navbar";

class SettingsPage {
  readonly navbar: Navbar;

  constructor() {
    this.navbar = new Navbar();
  }

  get profileImageUrlInput() {
    return cy.get("input[formcontrolname='image']");
  }

  get usernameInput() {
    return cy.get("input[formcontrolname='username']");
  }

  get bioTextarea() {
    return cy.get("textarea[formcontrolname='bio']");
  }

  get emailInput() {
    return cy.get("input[formcontrolname='email']");
  }

  get passwordInput() {
    return cy.get("input[formcontrolname='password']");
  }

  get updateSettingsButton() {
    return cy.get("button").contains("Update Settings");
  }

  get logoutButton() {
    return cy.get("button").contains("Or click here to logout");
  }

  visit() {
    cy.visit("/settings");
  }

  fillProfileImageUrl(url: string) {
    this.profileImageUrlInput.type(url);
  }

  fillUsername(username: string) {
    this.usernameInput.type(username);
  }

  fillBio(bio: string) {
    this.bioTextarea.type(bio);
  }

  fillEmail(email: string) {
    this.emailInput.type(email);
  }

  fillPassword(password: string) {
    this.passwordInput.type(password);
  }

  submit() {
    this.updateSettingsButton.click();
  }

  logout() {
    this.logoutButton.click();
  }
}

export default SettingsPage;
