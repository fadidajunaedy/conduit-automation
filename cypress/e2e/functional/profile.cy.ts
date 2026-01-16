import ProfilePage from "../../pages/ProfilePage";

const profilePage: ProfilePage = new ProfilePage();

describe("Profile Page - My Profile View", () => {
  beforeEach(() => {
    cy.login("fadidajunaedy@mail.com", "qq332211");
    cy.getCurrentUser().then((responseBody) => {
      profilePage.visit(responseBody.user.username);
    });
  });

  it("Should display correct user information (Username, Bio, Image)", () => {
    cy.getCurrentUser().then((responseBody) => {
      profilePage.username.should("contain.text", responseBody.user.username);
      profilePage.bio.should("contain.text", responseBody.user.bio);
      profilePage
        .getImageUrl()
        .then((url) => expect(url).to.be.equal(responseBody.user.image));
    });
  });
});
