const HttpResponse = require("../helpers/http-response");

module.exports = class LoginRouter {
  route(httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError();
    }
    const { email, password } = httpRequest.body;
    if (!email) {
      return HttpResponse.badResquest("email");
    }
    if (!password) {
      return HttpResponse.badResquest("password");
    }
  }
};
