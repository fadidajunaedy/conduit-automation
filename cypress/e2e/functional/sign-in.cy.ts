import SignInPage from "../../pages/SignInPage";

describe("Sign In Page", () => {
  const signInPage: SignInPage = new SignInPage();

  beforeEach(() => {
    cy.fixture("user").as("userData");
  });

  it("Should be able to Sign In with valid credentials", function () {
    signInPage.visit();
    signInPage.fillLoginForm(this.userData.email, this.userData.password);
    signInPage.submit();
    cy.url().should("equal", "https://conduit.bondaracademy.com/");
    cy.window()
      .its("localStorage")
      .invoke("getItem", "jwtToken")
      .should("exist");
  });

  it("Should not be able to Sign In with Email or Password invalid", () => {
    signInPage.visit();
    signInPage.fillLoginForm("random_email@mail.com", "random_password");
    signInPage.submit();

    cy.get(".error-messages").should(
      "contain.text",
      "email or password is invalid"
    );
  });

  // Not using arrow function because they don't have .this binding
  it("Should not be able to click Sign In button when email is blank", function () {
    signInPage.visit();
    signInPage.fillPassword(this.userData.password);
    signInPage.signInButton.should("be.disabled");
  });

  it("Should not be able to click Sign In button when password is blank", function () {
    signInPage.visit();
    signInPage.fillEmail(this.userData.email);
    signInPage.signInButton.should("be.disabled");
  });
});
