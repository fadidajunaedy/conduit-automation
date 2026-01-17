import HomePage from "../../pages/HomePage";

const homePage: HomePage = new HomePage();

describe("Home Page - Guest State", function () {
  beforeEach(function () {
    cy.fixture("target-article.json").as("targetArticle");
    homePage.visit();
  });

  it("Should display 'Sign in' and 'Sign up' buttons in Navbar", function () {
    homePage.navbar.profileLink.should("not.exist");
    homePage.navbar.SignInLink.should("exist");
    homePage.navbar.SignUpLink.should("exist");
  });

  it("Should display 'Global Feed' tab by default", function () {
    homePage.globalFeedLink.should("have.class", "active");
  });

  it("Should redirect to Registration page when clicking 'Favorite' (Heart) button", function () {
    homePage.toggleFavorite(this.targetArticle.title);
    cy.url().should("contain", "/register");
    cy.get("h1").should("contain", "Sign up");
  });

  it("Should redirect to Login page when clicking 'Sign in' link", function () {
    homePage.navbar.clickSignInLink();
    cy.url().should("contain", "/login");
    cy.get("h1").should("contain", "Sign in");
  });

  it("Should clear tag filter when clicking 'Global Feed' tab again", function () {
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
  beforeEach(function () {
    cy.fixture("target-article.json").as("targetArticle");
    cy.fixture("user.json").as("userData");
  });

  beforeEach(function () {
    cy.login(this.userData.email, this.userData.password);
    homePage.visit();
  });

  it("Should display User Profile and 'New Article' buttons in Navbar", function () {
    homePage.navbar.SignInLink.should("not.exist");
    homePage.navbar.SignUpLink.should("not.exist");
    homePage.navbar.profileLink.should("exist");
    homePage.navbar.newArtcileLink.should("exist");
  });

  it("Should allow user to toggle 'Favorite' (Add Favorite)", function () {
    cy.intercept("POST", "**/articles/**/favorite").as("addFavoriteArticle");

    cy.removeFavoriteArticle(this.targetArticle.slug);
    cy.reload();

    homePage
      .getFavoriteButton(this.targetArticle.title)
      .should("not.have.class", "btn-primary");
    homePage
      .getFavoriteCount(this.targetArticle.title)
      .then(function (initialCount) {
        cy.log("Initial count: " + initialCount);
        homePage.toggleFavorite(this.targetArticle.title);

        cy.wait("@addFavoriteArticle");
        cy.reload();

        homePage
          .getFavoriteCount(this.targetArticle.title)
          .then(function (newCount) {
            cy.log("New count: " + newCount);

            expect(newCount).to.be.greaterThan(initialCount);
            expect(newCount).to.equal(initialCount + 1);
          });
      });
  });

  it("Should allow user to toggle 'Favorite' (Remove Favorite)", function () {
    cy.intercept("DELETE", "**/articles/**/favorite").as(
      "removeFavoriteArticle"
    );

    cy.addFavoriteArticle(this.targetArticle.slug);
    cy.reload();

    homePage
      .getFavoriteButton(this.targetArticle.title)
      .should("have.class", "btn-primary");
    homePage
      .getFavoriteCount(this.targetArticle.title)
      .then(function (initialCount) {
        cy.log("Initial count: " + initialCount);
        homePage.toggleFavorite(this.targetArticle.title);

        cy.wait("@removeFavoriteArticle");
        cy.reload();

        homePage
          .getFavoriteCount(this.targetArticle.title)
          .then(function (newCount) {
            cy.log("New count: " + newCount);

            expect(newCount).to.be.lessThan(initialCount);
            expect(newCount).to.equal(initialCount - 1);
          });
      });
  });

  it("Should navigate to Article Detail page when clicking an article title", function () {
    homePage.openArticle(this.targetArticle.title);
    cy.url().should("contain", "/article/");
    cy.get("h1").should("contain", this.targetArticle.title);
  });

  it("Should display 'No articles are here... yet.' when feed is empty", function () {
    homePage.clickYourFeedLink();
    homePage.yourFeedLink.should("have.class", "active");
  });
});

describe("Home Page - Functional Logic", function () {
  beforeEach(function () {
    cy.fixture("target-article.json").as("targetArticle");
    cy.fixture("user.json").as("userData");
  });

  beforeEach(function () {
    cy.login(this.userData.email, this.userData.password);
    homePage.visit();
  });

  it("Should filter article list by Popular Tags", function () {
    cy.intercept("GET", "**/articles?tag=*").as("tagRequest");
    homePage.clickPopularTag("Bondar Academy");
    cy.wait("@tagRequest");
    cy.get(".nav-link.active").should("contain", "Bondar Academy");
    cy.get(".article-preview")
      .should("have.length.greaterThan", 0)
      .each(function ($article) {
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
