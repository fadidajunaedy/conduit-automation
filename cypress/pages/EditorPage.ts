import Navbar from "./components/Navbar";

class EditorPage {
  readonly navbar: Navbar;

  constructor() {
    this.navbar = new Navbar();
  }

  get titleInput() {
    return cy.get("input[formcontrolname='title']");
  }

  get descriptionInput() {
    return cy.get("input[formcontrolname='description']");
  }

  get bodyInput() {
    return cy.get("input[formcontrolname='body']");
  }

  get tagsInput() {
    return cy.get("input[placeholder='Enter tags']");
  }

  get publishButton() {
    return cy.get("button").contains("Publish Article");
  }

  visit() {
    cy.visit("/editor");
  }

  fillTitle(title: string) {
    this.titleInput.type(title);
  }

  fillDescription(description: string) {
    this.descriptionInput.type(description);
  }

  fillBody(body: string) {
    this.bodyInput.type(body);
  }

  fillTags(tagName: string) {
    this.tagsInput.type(tagName);
    cy.press("Enter");
  }

  removeTags(tagName: string) {
    cy.get(".tag-list .tag-pill").find(`:contains('${tagName}')`).click();
  }

  submit() {
    this.publishButton.click();
  }
}

export default EditorPage;
