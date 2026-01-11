declare namespace Cypress {
  interface UserSettings {
    image?: string;
    username?: string;
    bio?: string;
    email?: string;
    password?: string;
  }

  interface Chainable {
    login(email: string, password: string): Chainable<void>;
    addFavoriteArticle(slug: string): Chainable<void>;
    removeFavoriteArticle(slug: string): Chainable<void>;
    removeArticle(slug: string): Chainable<void>;
    updateUser(userSettingsObj: UserSettings): Chainable<void>;
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

Cypress.Commands.add("removeArticle", (slug) => {
  cy.window().then((window) => {
    const authToken = window.localStorage.getItem("jwtToken");
    cy.request({
      method: "DELETE",
      url: `${Cypress.env("apiUrl")}/articles/${slug}`,
      headers: { Authorization: `Token ${authToken}` },
      failOnStatusCode: false,
    });
  });
});

Cypress.Commands.add("updateUser", (userSettingsObj) => {
  cy.window().then((window) => {
    const authToken = window.localStorage.getItem("jwtToken");
    cy.request({
      method: "PUT",
      url: `${Cypress.env("apiUrl")}/user`,
      headers: { Authorization: `Token ${authToken}` },
      body: {
        user: userSettingsObj,
      },
      failOnStatusCode: false,
    });
  });
});
