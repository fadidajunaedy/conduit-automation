declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>;
    addFavoriteArticle(slug: string): Chainable<void>;
    removeFavoriteArticle(slug: string): Chainable<void>;
  }
}

Cypress.Commands.add("login", (email, password) => {
  cy.window().then((window) => {
    cy.request({
      method: "POST",
      url: "https://conduit-api.bondaracademy.com/api/users/login",
      body: {
        user: {
          email,
          password,
        },
      },
    }).then((response) => {
      window.localStorage.setItem("jwtToken", response.body.user.token);
    });
  });
});

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
