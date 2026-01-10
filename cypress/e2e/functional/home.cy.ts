import HomePage from "../../pages/HomePage";

const homePage: HomePage = new HomePage();
const targetArticle =
  "Mastering Knowledge with Self-Assessments: Identifying and Bridging Learning Gaps in Education";

describe("Home Page - Guest State", () => {
  beforeEach(() => {
    homePage.visit();
  });

  it("Should display 'Sign in' and 'Sign up' buttons in Navbar", () => {
    homePage.navbar.profileLink.should("not.exist");
    homePage.navbar.SignInLink.should("exist");
    homePage.navbar.SignUpLink.should("exist");
  });

  it("Should display 'Global Feed' tab by default", () => {
    homePage.globalFeedLink.should("have.class", "active");
  });

  it("Should redirect to Registration page when clicking 'Favorite' (Heart) button", () => {
    homePage.toggleFavorite(targetArticle);
    cy.url().should("contain", "/register");
    cy.get("h1").should("contain", "Sign up");
  });

  it("Should redirect to Login page when clicking 'Sign in' link", () => {
    homePage.navbar.clickSignInLink();
    cy.url().should("contain", "/login");
    cy.get("h1").should("contain", "Sign in");
  });

  it("Should clear tag filter when clicking 'Global Feed' tab again", () => {
    cy.intercept("GET", "**/articles?tag=*").as("getArticlesByTag");
    cy.intercept("GET", "**/articles?limit=*").as("getGlobalArticlesFeed");

    homePage.clickPopularTag("Bondar Academy");
    cy.wait("@getArticlesByTag");
    cy.get("a.nav-link.active").contains("Bondar Academy").should("exist");
    homePage.clickGlobalFeedLink();

    cy.wait("@getGlobalArticlesFeed");
    homePage.globalFeedLink.should("have.class", "active");
    cy.get("a.nav-link").contains("Bondar Academy").should("not.exist");
  });
});

describe("Home Page - Authenticated State", function () {
  beforeEach(() => {
    cy.login("email@test.com", "password");
    homePage.visit();
  });

  it("Should display User Profile and 'New Article' buttons in Navbar", () => {
    homePage.navbar.SignInLink.should("not.exist");
    homePage.navbar.SignUpLink.should("not.exist");
    homePage.navbar.profileLink.should("exist");
    homePage.navbar.newArtcileLink.should("exist");
  });

  it("Should display 'Your Feed' tab by default upon load", () => {
    homePage.yourFeedLink.should("exist");
  });

  it("Should allow user to toggle 'Favorite' (Add Favorite)", () => {
    cy.intercept("POST", "**/favorite").as("addFavorite");

    homePage.getArticleSlug(targetArticle).then((slug) => {
      cy.removeFavoriteArticle(slug);
    });

    cy.reload();

    homePage
      .getFavoriteButton(targetArticle)
      .should("not.have.class", "btn-primary");
    homePage.getFavoriteCount(targetArticle).then((initialNumber) => {
      homePage.toggleFavorite(targetArticle);

      cy.wait("@addFavorite");
      homePage.getFavoriteCount(targetArticle).then((newNumber) => {
        expect(newNumber).to.be.greaterThan(initialNumber);
        expect(newNumber).to.equal(initialNumber + 1);
      });
    });
  });

  it("Should allow user to toggle 'Favorite' (Remove Favorite)", () => {
    cy.intercept("DELETE", "**/favorite").as("removeFavorite");

    homePage.getArticleSlug(targetArticle).then((slug) => {
      cy.addFavoriteArticle(slug);
    });

    cy.reload();

    homePage
      .getFavoriteButton(targetArticle)
      .should("have.class", "btn-primary");
    homePage.getFavoriteCount(targetArticle).then((initialNumber) => {
      homePage.toggleFavorite(targetArticle);

      cy.wait("@removeFavorite");
      homePage.getFavoriteCount(targetArticle).then((newNumber) => {
        expect(newNumber).to.be.lessThan(initialNumber);
        expect(newNumber).to.equal(initialNumber - 1);
      });
    });
  });

  it("Should navigate to Article Detail page when clicking an article title", () => {
    homePage.openArticle(targetArticle);
    cy.url().should("contain", "/article/");
    cy.get("h1").should("contain", targetArticle);
  });

  it("Should display 'No articles are here... yet.' when feed is empty", () => {
    homePage.clickYourFeedLink();
    homePage.yourFeedLink.should("have.class", "active");
  });
});

describe("Home Page - Functional Logic", () => {
  beforeEach(() => {
    cy.login("email@test.com", "password");
    homePage.visit();
  });

  it("Should filter article list by Popular Tags", () => {
    cy.intercept("GET", "**/articles?tag=*").as("tagRequest");
    homePage.clickPopularTag("Bondar Academy");
    cy.wait("@tagRequest");
    cy.get(".nav-link.active").should("contain", "Bondar Academy");
    cy.get(".article-preview")
      .should("have.length.greaterThan", 0)
      .each(($article) => {
        cy.wrap($article)
          .find(".tag-list")
          .scrollIntoView()
          .should("contain.text", "Bondar Academy");
      });
  });

  it("Should display pagination when article count exceeds the limit (10 items)", function () {
    cy.intercept("GET", "**/articles?*", {
      statusCode: 200,
      fixture: "mock-articles.json",
    }).as("getMockArticles");

    cy.reload();

    cy.wait("@getMockArticles");
    cy.get(".pagination").should("be.visible");
    cy.get(".pagination .page-item").should("have.length", 2);
  });

  it("Should load the next set of articles when clicking pagination numbers", function () {
    cy.intercept("GET", "**/articles?*", {
      statusCode: 200,
      fixture: "mock-articles.json",
    }).as("getMockArticles");

    cy.reload();

    cy.wait("@getMockArticles");
    homePage
      .getPaginationButton("1")
      .parents(".page-item")
      .should("have.class", "active");
    homePage.clickPagination("2");

    cy.wait("@getMockArticles");
    homePage
      .getPaginationButton("2")
      .parents(".page-item")
      .should("have.class", "active");
  });
});
