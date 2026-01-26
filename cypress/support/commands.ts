import { UserSettings, CurrentUser } from "./types/user";
import { Article, ArticleResponseBody } from "./types/articles";
import { CommentResponseBody } from "./types/comment";

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      addFavoriteArticle(slug: string): Chainable<void>;
      removeFavoriteArticle(slug: string): Chainable<void>;
      updateUser(userSettings: UserSettings): Chainable<void>;
      followProfile(username: string): Chainable<void>;
      unfollowProfile(username: string): Chainable<void>;
      addFavoriteArticle(slug: string): Chainable<void>;
      removeFavoriteArticle(slug: string): Chainable<void>;
      addCommentArticle(
        slug: string,
        body: string,
      ): Chainable<CommentResponseBody>;
      removeCommentArticle(slug: string, commentId: number): Chainable<void>;
      addArticle(body: Article): Chainable<ArticleResponseBody>;
      removeArticle(slug: string): Chainable<void>;
      getCurrentUser(): Chainable<CurrentUser>;
    }
  }
}

Cypress.Commands.add("login", (email, password) => {
  cy.window().then((window) => {
    cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/users/login`,
      body: {
        user: {
          email,
          password,
        },
      },
      failOnStatusCode: false,
    }).then((response) => {
      window.localStorage.setItem("jwtToken", response.body.user.token);
      return response.body.user.token;
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

Cypress.Commands.add("updateUser", (userSettings) => {
  cy.window().then((window) => {
    const authToken = window.localStorage.getItem("jwtToken");
    cy.request({
      method: "PUT",
      url: `${Cypress.env("apiUrl")}/user`,
      headers: { Authorization: `Token ${authToken}` },
      body: {
        user: userSettings,
      },
      failOnStatusCode: false,
    });
  });
});

Cypress.Commands.add("followProfile", (username) => {
  cy.window().then((window) => {
    const authToken = window.localStorage.getItem("jwtToken");
    cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/profiles/${username}/follow`,
      headers: { Authorization: `Token ${authToken}` },
      failOnStatusCode: false,
    });
  });
});

Cypress.Commands.add("unfollowProfile", (username) => {
  cy.window().then((window) => {
    const authToken = window.localStorage.getItem("jwtToken");
    cy.request({
      method: "DELETE",
      url: `${Cypress.env("apiUrl")}/profiles/${username}/follow`,
      headers: { Authorization: `Token ${authToken}` },
      failOnStatusCode: false,
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

Cypress.Commands.add("addCommentArticle", (slug, body) => {
  cy.window().then((window) => {
    const authToken = window.localStorage.getItem("jwtToken");
    cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/articles/${slug}/comments`,
      headers: { Authorization: `Token ${authToken}` },
      body: {
        comment: {
          body: body,
        },
      },
      failOnStatusCode: false,
    }).then((response) => {
      return response.body;
    });
  });
});

Cypress.Commands.add("removeCommentArticle", (slug, commentId) => {
  cy.window().then((window) => {
    const authToken = window.localStorage.getItem("jwtToken");
    cy.request({
      method: "DELETE",
      url: `${Cypress.env("apiUrl")}/articles/${slug}/comments/${commentId}`,
      headers: { Authorization: `Token ${authToken}` },
      failOnStatusCode: false,
    });
  });
});

Cypress.Commands.add("addArticle", (body) => {
  cy.window().then((window) => {
    const authToken = window.localStorage.getItem("jwtToken");
    cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/articles`,
      headers: { Authorization: `Token ${authToken}` },
      body: {
        article: body,
      },
      failOnStatusCode: false,
    }).then((response) => {
      return response.body;
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

Cypress.Commands.add("getCurrentUser", () => {
  cy.window().then((window) => {
    const authToken = window.localStorage.getItem("jwtToken");
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/user`,
      headers: { Authorization: `Token ${authToken}` },
      failOnStatusCode: false,
    }).then((response) => {
      return response.body;
    });
  });
});
