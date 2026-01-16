import EditorPage from "../../pages/EditorPage";

const editorPage: EditorPage = new EditorPage();

describe("Editor Page - Positive Cases", function () {
  beforeEach(function () {
    cy.login("fadidajunaedy@mail.com", "qq332211");
    editorPage.visit();
  });

  it("Verify user can publish article with complete valid data", function () {
    cy.intercept("POST", "**/articles").as("addArticle");

    const nowString = new Date().toString();
    editorPage.fillTitle(`dummy article ${nowString}`);
    editorPage.fillDescription(`this is dummy article ${nowString}`);
    editorPage.fillBody("Lorem ipsum dolor si amet");
    editorPage.fillTags("test");
    editorPage.fillTags("dummy");
    editorPage.submit();

    cy.wait("@addArticle");
    cy.url().should("contain", "/article/");
    cy.get("h1").should("contain", nowString);

    cy.url().then(function (textUrl) {
      const slug = textUrl.split("/article/")[1];
      cy.removeArticle(slug);
    });
  });

  it("Verify user can publish article without Tags (Optional field)", function () {
    cy.intercept("POST", "**/articles").as("addArticle");

    const nowString = new Date().toString();
    editorPage.fillTitle(`dummy article ${nowString}`);
    editorPage.fillDescription(`this is dummy article ${nowString}`);
    editorPage.fillBody("Lorem ipsum dolor si amet");
    editorPage.fillTags("test");
    editorPage.removeTags("test");
    editorPage.submit();

    cy.wait("@addArticle");
    cy.url().should("contain", "/article/");
    cy.get("h1").should("contain", nowString);

    cy.url().then(function (textUrl) {
      const slug = textUrl.split("/article/")[1];
      cy.removeArticle(slug);
    });
  });
});

describe("Editor Page - Negative Cases (Validation)", function () {
  beforeEach(function () {
    cy.login("fadidajunaedy@mail.com", "qq332211");
    editorPage.visit();
  });

  it("Verify system rejects submission when Title is empty", function () {
    cy.intercept("POST", "**/articles").as("addArticle");

    const nowString = new Date().toString();
    editorPage.fillDescription(`this is dummy article ${nowString}`);
    editorPage.fillBody("Lorem ipsum dolor si amet");
    editorPage.fillTags("test");
    editorPage.submit();

    cy.wait("@addArticle");
    cy.get(".error-messages")
      .find("li")
      .should("contain.text", "title can't be blank");
  });

  it("Verify system rejects submission when Description is empty", function () {
    cy.intercept("POST", "**/articles").as("addArticle");

    const nowString = new Date().toString();
    editorPage.fillTitle(`dummy article ${nowString}`);
    editorPage.fillBody("Lorem ipsum dolor si amet");
    editorPage.fillTags("test");
    editorPage.submit();

    cy.wait("@addArticle");
    cy.get(".error-messages")
      .find("li")
      .should("contain.text", "description can't be blank");
  });

  it("Verify system rejects submission when Body is empty", function () {
    cy.intercept("POST", "**/articles").as("addArticle");

    const nowString = new Date().toString();
    editorPage.fillTitle(`dummy article ${nowString}`);
    editorPage.fillDescription(`this is dummy article ${nowString}`);
    editorPage.fillTags("test");
    editorPage.submit();

    cy.wait("@addArticle");
    cy.get(".error-messages")
      .find("li")
      .should("contain.text", "body can't be blank");
  });

  it("Verify article creation behavior with duplicate Title", function () {
    cy.intercept("POST", "**/articles").as("addArticle");

    const dummyTitle = `dummy article ${new Date().toString()}`;
    editorPage.fillTitle(dummyTitle);
    editorPage.fillDescription("this is dummy article");
    editorPage.fillBody("Lorem ipsum dolor si amet");
    editorPage.fillTags("test");
    editorPage.fillTags("dummy");
    editorPage.submit();

    cy.wait("@addArticle");
    cy.url().should("contain", "/article/");
    cy.get("h1").should("contain", dummyTitle);

    cy.url().then(function (url) {
      const slug = url.split("/article/")[1];
      cy.wrap(slug).as("slugArticle");
    });

    editorPage.visit();

    editorPage.fillTitle(dummyTitle);
    editorPage.fillDescription("this is dummy article");
    editorPage.fillBody("Lorem ipsum dolor si amet");
    editorPage.fillTags("test");
    editorPage.fillTags("dummy");
    editorPage.submit();

    cy.wait("@addArticle");
    cy.get(".error-messages")
      .find("li")
      .should("contain.text", "title must be unique");
    cy.get<string>("@slugArticle").then(function (slug) {
      cy.removeArticle(slug);
    });
  });
});
