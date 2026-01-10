declare namespace Cypress {
  interface Chainable {
    addFavoriteArticle(slug: string): Chainable<void>;
    removeFavoriteArticle(slug: string): Chainable<void>;
  }
}

Cypress.Commands.add("addFavoriteArticle", (slug) => {
  cy.window().then((window) => {
    const authToken = window.localStorage.getItem("jwtToken");
    cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/articles/${slug}/favorite`,
      headers: { Authorization: `Token ${authToken}` },
      failOnStatusCode: false,
    });
  });
});

Cypress.Commands.add("removeFavoriteArticle", (slug) => {
  cy.window().then((window) => {
    const authToken = window.localStorage.getItem("jwtToken");
    cy.request({
      method: "DELETE",
      url: `${Cypress.env("apiUrl")}/articles/${slug}/favorite`,
      headers: { Authorization: `Token ${authToken}` },
      failOnStatusCode: false,
    });
  });
});
