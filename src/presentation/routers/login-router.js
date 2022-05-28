const HttpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badResquest('email')
      }
      if (!password) {
        return HttpResponse.badResquest('password')
      }
      const acessToken = await this.authUseCase.auth(email, password)
      if (!acessToken) {
        return HttpResponse.unauthorizedError()
      }
      return HttpResponse.ok({ acessToken })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
