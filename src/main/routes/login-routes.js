const LoginRouter = require("../../presentation/routers/login-router");
const AuthUseCase = require("../../domain/use-cases/auth-usecase");
const EmailValidator = require("../../utils/email-validator");
const LoadUserByEmailRepository = require("../../infra/repositories/load-user-by-email-repository");
const UpdateAcessTokenRepository = require("../../infra/repositories/update-acess-token-repository");
const Encrypter = require("../../presentation/helpers/encripter");
const TokenGenerator = require("../../presentation/helpers/token-generator");
const env = require("../config/env");

module.exports = (router) => {};
