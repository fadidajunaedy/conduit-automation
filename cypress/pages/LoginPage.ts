class LoginPage {
  get emailInput() {
    return cy.get("input[placeholder='Email']");
  }

  get passwordInput() {
    return cy.get("input[placeholder='Pasword']");
  }

  get signInButton() {
    return cy.contains("button", "Sign in");
  }

  visit() {
    cy.visit("/login");
  }

  fillLoginForm() {
    this.emailInput.type("fadidajunaedy@gmail.com");
    this.passwordInput.type("qq332211");
  }

  submit() {
    this.signInButton.click();
  }
}

export default LoginPage;
