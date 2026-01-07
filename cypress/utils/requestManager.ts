class RequestManager {
  getAuthToken(email: string, password: string) {
    return cy
      .request({
        method: "POST",
        url: "https://conduit-api.bondaracademy.com/api/users/login",
        body: {
          user: {
            email,
            password,
          },
        },
      })
      .then((response) => {
        return response.body.user.token;
      });
  }
}

export default RequestManager;
