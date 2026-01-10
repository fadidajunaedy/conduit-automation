import EditorPage from "../../pages/EditorPage";

const editorPage: EditorPage = new EditorPage();

describe("Editor Page - Positive Cases", () => {
  beforeEach(() => {
    cy.login("email@test.com", "password");
    editorPage.visit();
  });

  it.only("Verify user can publish article with complete valid data", () => {
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
  });
});
