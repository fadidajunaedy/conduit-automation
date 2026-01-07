import HomePage from "../../pages/HomePage";
import RequestManager from "../../utils/requestManager";

// describe("Home Page Feed Integration", () => {
//   let authToken: string;
//   const homePage: HomePage = new HomePage();
//   const targetArticle =
//     "Mastering Knowledge with Self-Assessments: Identifying and Bridging Learning Gaps in Education";

//   before(() => {
//     const requestManager = new RequestManager();
//     requestManager.getAuthToken("email@test.com", "password").then((token) => {
//       cy.log("Token received:", token);
//       authToken = token;
//     });
//   });

//   it("Should allows user to open specific article", () => {
//     window.localStorage.setItem("jwtToken", authToken);

//     cy.visit("/");
//     homePage.openArticle(targetArticle);
//     cy.get("h1").should("contain", targetArticle);
//   });

//   it("Should allow user to toggle favorite spesific article", () => {});
// });

describe("Home Page - Guest State", () => {
  const homePage: HomePage = new HomePage();
  it("Should display 'Sign in' and 'Sign up' buttons in Navbar", () => {
    homePage.visit();
    homePage.navbar.profileLink.should("not.exist");
    homePage.navbar.SignInLink.should("exist");
    homePage.navbar.SignUpLink.should("exist");
  });
  it("Should display 'Global Feed' tab by default", () => {});
  it("Should redirect to Registration page when clicking 'Favorite' (Heart) button", () => {});
  it("Should redirect to Login page when clicking 'Sign in' link", () => {});
});

describe("Home Page - Authenticated State", () => {
  it("Should display User Profile and 'New Article' buttons in Navbar", () => {});
  it("Should display 'Your Feed' tab by default upon load", () => {});
  it("Should allow user to toggle 'Favorite' on an article", () => {});
  it("Should navigate to Article Detail page when clicking an article title", () => {});
  it("Should display 'No articles are here... yet.' when feed is empty", () => {});
  it("", () => {});
});

describe("Home Page - Functional Logic", () => {
  it("Should filter article list by Popular Tags", () => {});
  it("Should display pagination when article count exceeds the limit (10 items)", () => {});
  it("Should load the next set of articles when clicking pagination numbers", () => {});
  it("Should clear tag filter when clicking 'Global Feed' tab again", () => {});
  it("Should highlight the current page number in pagination.", () => {});
  it("", () => {});
});
