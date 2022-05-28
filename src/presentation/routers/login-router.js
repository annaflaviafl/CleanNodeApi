const HttpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (!httpRequest || !httpRequest.body || !this.authUseCase || !this.authUseCase.auth) {
      return HttpResponse.serverError()
    }
    const { email, password } = httpRequest.body
    if (!email) {
      return HttpResponse.badResquest('email')
    }
    if (!password) {
      return HttpResponse.badResquest('password')
    }

    const acessToken = this.authUseCase.auth(email, password)

    if (!acessToken) {
      return HttpResponse.unauthorizedError()
    }
    return HttpResponse.ok({ acessToken })
  }
}
