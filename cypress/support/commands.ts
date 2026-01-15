declare namespace Cypress {
  interface UserSettings {
    image?: string;
    username?: string;
    bio?: string;
    email?: string;
    password?: string;
  }

  interface CommentResponseBody {
    comment: {
      id: number;
      createdAt: string;
      updatedAt: string;
      body: string;
      author: {
        username: string;
        bio: string;
        image: string;
        following: boolean;
      };
    };
  }

  interface ArticleRequestBody {
    title: string;
    description: string;
    body: string;
    tagList: string[];
  }

  interface ArticleResponseBody {
    article: {
      slug: string;
      title: string;
      description: string;
      body: string;
      tagList: string[];
      createdAt: string;
      updatedAt: string;
      favorited: false;
      favoritesCount: number;
      author: {
        username: string;
        bio: string;
        image: string;
        following: boolean;
      };
    };
  }

  interface Chainable {
    login(email: string, password: string): Chainable<void>;
    addFavoriteArticle(slug: string): Chainable<void>;
    removeFavoriteArticle(slug: string): Chainable<void>;
    removeArticle(slug: string): Chainable<void>;
    updateUser(userSettingsObj: UserSettings): Chainable<void>;
    followProfile(username: string): Chainable<void>;
    unfollowProfile(username: string): Chainable<void>;
    addFavoriteArticle(slug: string): Chainable<void>;
    removeFavoriteArticle(slug: string): Chainable<void>;
    addCommentArticle(
      slug: string,
      body: string
    ): Chainable<CommentResponseBody>;
    removeCommentArticle(slug: string, commentId: number): Chainable<void>;
    addArticle(body: ArticleRequestBody): Chainable<ArticleResponseBody>;
    removeArticle(slug: string): Chainable<void>;
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
