Cypress.Commands.add("addFavoriteArticle", (slug) => {
  cy.window().then((window) => {
    const authToken = window.localStorage("get", "jtwToken");
    cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/articles/${slug}/favorite`,
      headers: { Authorization: `Token ${authToken}` },
      failOnStatusCode: false,
    });
  });
});
