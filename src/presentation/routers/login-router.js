const HttpResponse = require('../helpers/http-response')
const { MissingParamError, InvalidParamError } = require('../errors')
module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badResquest(new MissingParamError('email'))
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badResquest(new InvalidParamError('email'))
      }
      if (!password) {
        return HttpResponse.badResquest(new MissingParamError('password'))
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
