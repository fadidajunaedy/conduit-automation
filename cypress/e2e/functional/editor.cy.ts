import EditorPage from "../../pages/EditorPage";
import { generateArticle } from "../../factories/article-factory";

const editorPage: EditorPage = new EditorPage();

describe("Editor Page - Positive Cases", function () {
  beforeEach(function () {
    cy.fixture("user.json").as("userData");
  });

  beforeEach(function () {
    cy.login(this.userData.email, this.userData.password);
    editorPage.visit();
  });

  it("Verify user can publish article with complete valid data", function () {
    cy.intercept("POST", "**/articles").as("addArticle");

    const articleData = generateArticle();
    editorPage.fillTitle(articleData.title);
    editorPage.fillDescription(articleData.description);
    editorPage.fillBody(articleData.body);
    editorPage.fillTags(articleData.tagList[0]);
    editorPage.fillTags(articleData.tagList[1]);
    editorPage.submit();

    cy.wait("@addArticle").then(function (interception) {
      const slug = interception.response.body.article.slug;
      cy.url().should("contain", slug);
      cy.get("h1").should("contain", articleData.title);
      cy.removeArticle(slug);
    });
  });

  it("Verify user can publish article without Tags (Optional field)", function () {
    cy.intercept("POST", "**/articles").as("addArticle");

    const articleData = generateArticle();
    editorPage.fillTitle(articleData.title);
    editorPage.fillDescription(articleData.description);
    editorPage.fillBody(articleData.body);
    editorPage.fillTags(articleData.tagList[0]);
    editorPage.removeTags(articleData.tagList[0]);
    editorPage.submit();

    cy.wait("@addArticle").then(function (interception) {
      const slug = interception.response.body.article.slug;
      cy.url().should("contain", slug);
      cy.get("h1").should("contain", articleData.title);
      cy.removeArticle(slug);
    });
  });
});

describe("Editor Page - Negative Cases (Validation)", function () {
  beforeEach(function () {
    cy.fixture("user.json").as("userData");
  });

  beforeEach(function () {
    cy.login(this.userData.email, this.userData.password);
    editorPage.visit();
  });

  it("Verify system rejects submission when Title is empty", function () {
    cy.intercept("POST", "**/articles").as("addArticle");

    const articleData = generateArticle();
    editorPage.fillDescription(articleData.description);
    editorPage.fillBody(articleData.body);
    editorPage.fillTags(articleData.tagList[0]);
    editorPage.submit();

    cy.wait("@addArticle");
    cy.get(".error-messages")
      .find("li")
      .should("contain.text", "title can't be blank");
  });

  it("Verify system rejects submission when Description is empty", function () {
    cy.intercept("POST", "**/articles").as("addArticle");

    const articleData = generateArticle();
    editorPage.fillTitle(articleData.title);
    editorPage.fillBody(articleData.body);
    editorPage.fillTags(articleData.tagList[0]);
    editorPage.submit();

    cy.wait("@addArticle");
    cy.get(".error-messages")
      .find("li")
      .should("contain.text", "description can't be blank");
  });

  it("Verify system rejects submission when Body is empty", function () {
    cy.intercept("POST", "**/articles").as("addArticle");

    const articleData = generateArticle();
    editorPage.fillTitle(articleData.title);
    editorPage.fillDescription(articleData.description);
    editorPage.fillTags(articleData.tagList[0]);
    editorPage.submit();

    cy.wait("@addArticle");
    cy.get(".error-messages")
      .find("li")
      .should("contain.text", "body can't be blank");
  });

  it("Verify article creation behavior with duplicate Title", function () {
    cy.intercept("POST", "**/articles").as("addArticle");

    const articleData = generateArticle();

    cy.addArticle(articleData).then(function (responseBody) {
      editorPage.fillTitle(articleData.title);
      editorPage.fillDescription(articleData.description);
      editorPage.fillBody(articleData.body);
      editorPage.fillTags(articleData.tagList[0]);
      editorPage.fillTags(articleData.tagList[1]);
      editorPage.submit();

      cy.wait("@addArticle");
      cy.get(".error-messages")
        .find("li")
        .should("contain.text", "title must be unique");
      cy.removeArticle(responseBody.article.slug);
    });
  });
});
