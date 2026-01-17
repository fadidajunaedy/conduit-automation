import SettingsPage from "../../pages/SettingsPage";

const settingsPage: SettingsPage = new SettingsPage();

describe("Settings Page - Functional Update", function () {
  beforeEach(function () {
    cy.login("fadidajunaedy@mail.com", "qq332211");
    settingsPage.visit();
  });

  it("Verify user can update Profile Picture", function () {
    cy.intercept("PUT", "**/user").as("updateUser");
    cy.intercept("GET", "**/profiles/*").as("getProfileUser");

    const newProfileImageUrl = "https://placehold.co/400x400/000000/FFFFFF/png";
    settingsPage.navbar.profileImageUrl.then(function (initialUrl) {
      cy.log("initial URL: " + initialUrl);
      cy.log("new URL: " + newProfileImageUrl);

      settingsPage.fillProfileImageUrl(newProfileImageUrl);
      settingsPage.submit();

      cy.wait("@updateUser");

      cy.url().should("contain", "/profile/");
      cy.get("img[class='user-img']")
        .invoke("attr", "src")
        .then(function (src) {
          expect(src).to.be.not.equal(initialUrl);
          expect(src).to.be.equal(newProfileImageUrl);

          cy.wait("@getProfileUser");
          cy.updateUser({ image: initialUrl });
        });
    });
  });

  it("Verify user can update Username", function () {
    cy.intercept("PUT", "**/user").as("updateUser");
    cy.intercept("GET", "**/profiles/*").as("getProfileUser");

    const newUsername = "newfadidajunaedy";
    settingsPage.navbar.profileUsername.then(function (text) {
      const initialUsername = text.trim();
      cy.log("Initial Username: " + initialUsername);
      cy.log("New Username: " + newUsername);

      settingsPage.fillUsername(newUsername);
      settingsPage.submit();

      cy.wait("@updateUser");

      cy.url().should("contain", `/profile/${newUsername}`);
      cy.get(".profile-page")
        .find("h4")
        .invoke("text")
        .then(function (newText) {
          const appearingNewUsername = newText.trim();

          expect(appearingNewUsername).to.be.not.equal(initialUsername);
          expect(appearingNewUsername).to.be.equal(newUsername);

          cy.wait("@getProfileUser");
          cy.updateUser({ username: initialUsername });
        });
    });
  });

  it("Verify user can update Bio", function () {
    cy.intercept("PUT", "**/user").as("updateUser");
    cy.intercept("GET", "**/profiles/*").as("getProfileUser");

    const initialBio = "Lorem ipsum dolor si amet";
    const newBio = `Bio ${new Date().toString()}`;

    cy.updateUser({ bio: initialBio });

    settingsPage.fillBio(newBio);
    settingsPage.submit();

    cy.wait("@updateUser");

    cy.url().should("contain", "/profile");
    cy.get(".profile-page")
      .find("p")
      .invoke("text")
      .then(function (newText) {
        const appearingNewbio = newText.trim();
        expect(appearingNewbio).to.be.not.equal(initialBio);
        expect(appearingNewbio).to.be.equal(newBio);

        cy.wait("@getProfileUser");
        cy.updateUser({ bio: initialBio });
      });
  });
});

describe("Settings Page - Session Management", function () {
  beforeEach(function () {
    cy.login("fadidajunaedy@mail.com", "qq332211");
    settingsPage.visit();
  });

  it("Verify user is redirected to Home page after Logout", function () {
    settingsPage.logout();
    cy.url().should("equal", "https://conduit.bondaracademy.com/");

    cy.window().then(function (window) {
      const authToken = window.localStorage.getItem("jwtToken");
      expect(authToken).to.be.not.exist;
    });
  });
});
