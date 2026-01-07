class SignInPage {
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

  fillEmail(email: string) {
    this.emailInput.type(email);
  }

  fillPassword(password: string) {
    this.passwordInput.type(password);
  }

  fillLoginForm(email: string, password: string) {
    this.emailInput.type(email);
    this.passwordInput.type(password);
  }

  submit() {
    this.signInButton.click();
  }
}

export default SignInPage;
