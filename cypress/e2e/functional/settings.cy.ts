import SettingsPage from "../../pages/SettingsPage";

const settingsPage: SettingsPage = new SettingsPage();

describe.only("Settings Page - Functional Update", () => {
  beforeEach(() => {
    cy.login("fadidajunaedy@mail.com", "qq332211");
    settingsPage.visit();
  });

  it("Verify user can update Profile Picture", () => {
    cy.intercept("PUT", "**/user").as("updateUser");
    cy.intercept("GET", "**/profiles/*").as("getProfileUser");

    const newProfileImageUrl = "https://placehold.co/400x400/000000/FFFFFF/png";
    settingsPage.navbar.profileImageUrl.then((initialUrl) => {
      cy.log("initial URL: " + initialUrl);
      cy.log("new URL: " + newProfileImageUrl);

      settingsPage.fillProfileImageUrl(newProfileImageUrl);
      settingsPage.submit();

      cy.wait("@updateUser");

      cy.url().should("contain", "/profile/");
      cy.get("img[class='user-img']")
        .invoke("attr", "src")
        .then((src) => {
          expect(src).to.be.not.equal(initialUrl);
          expect(src).to.be.equal(newProfileImageUrl);

          cy.wait("@getProfileUser");
          cy.updateUser({ image: initialUrl });
        });
    });
  });

  it("Verify user can update Username", () => {
    cy.intercept("PUT", "**/user").as("updateUser");
    cy.intercept("GET", "**/profiles/*").as("getProfileUser");

    const newUsername = "newfadidajunaedy";
    settingsPage.navbar.profileUsername.then((text) => {
      const initialUsername = text.trim();
      cy.log("Initial Username: " + initialUsername);
      cy.log("New Username: " + newUsername);

      settingsPage.fillUsername(newUsername);
      settingsPage.submit();

      cy.wait("@updateUser");

      cy.url().should("contain", "/profile/");
      cy.get(".profile-page")
        .find("h4")
        .invoke("text")
        .then((newText) => {
          const appearingNewUsername = newText.trim();

          expect(appearingNewUsername).to.be.not.equal(initialUsername);
          expect(appearingNewUsername).to.be.equal(newUsername);

          cy.wait("@getProfileUser");
          cy.updateUser({ username: initialUsername });
        });
    });
  });
});
