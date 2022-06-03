const LoginRouter = require("../../presentation/routers/login-router");
const AuthUseCase = require("../../domain/use-cases/auth-usecase");
const EmailValidator = require("../../utils/helpers/email-validator");
const LoadUserByEmailRepository = require("../../infra/repositories/load-user-by-email-repository");
const UpdateAcessTokenRepository = require("../../infra/repositories/update-acess-token-repository");
const Encrypter = require("../../utils/helpers/encripter");
const TokenGenerator = require("../../utils/helpers/token-generator");
const env = require("../config/env");

module.exports = class LoginRouterComposer {
  static compose() {
    const tokenGenerator = new TokenGenerator(env.tokenSecret);
    const encrypter = new Encrypter();
    const loadUserByEmailRepository = new LoadUserByEmailRepository();
    const updateAcessTokenRepository = new UpdateAcessTokenRepository();
    const emailValidator = new EmailValidator();
    const authUseCase = new AuthUseCase({
      loadUserByEmailRepository,
      updateAcessTokenRepository,
      encrypter,
      tokenGenerator,
    });
    return new LoginRouter({
      authUseCase,
      emailValidator,
    });
  }
};
