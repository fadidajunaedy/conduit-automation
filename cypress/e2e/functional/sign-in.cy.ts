import SignInPage from "../../pages/SignInPage";

describe("Sign In Page", function () {
  const signInPage: SignInPage = new SignInPage();

  beforeEach(function () {
    cy.fixture("user").as("userData");
    signInPage.visit();
  });

  it("Should be able to Sign In with valid credentials", function () {
    cy.intercept("POST", "**/users/login").as("login");

    signInPage.fillLoginForm(this.userData.email, this.userData.password);
    signInPage.submit();

    cy.wait("@login");

    cy.url().should("equal", `${Cypress.config("baseUrl")}/`);
    cy.window()
      .its("localStorage")
      .invoke("getItem", "jwtToken")
      .should("exist");
  });

  it("Should not be able to Sign In with Email or Password invalid", function () {
    cy.intercept("POST", "**/users/login").as("login");

    signInPage.fillLoginForm("random_email@mail.com", "random_password");
    signInPage.submit();

    cy.wait("@login");

    cy.get(".error-messages").should(
      "contain.text",
      "email or password is invalid"
    );
  });

  it("Should not be able to click Sign In button when email is blank", function () {
    signInPage.fillPassword(this.userData.password);
    signInPage.signInButton.should("be.disabled");
  });

  it("Should not be able to click Sign In button when password is blank", function () {
    signInPage.fillEmail(this.userData.email);
    signInPage.signInButton.should("be.disabled");
  });
});
