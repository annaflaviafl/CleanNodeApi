const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }

  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true

  return encrypterSpy
}

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare () {
      throw new Error()
    }
  }

  return new EncrypterSpy()
}
const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = { id: 'any_id', password: 'hashed_password' }

  return loadUserByEmailRepositorySpy
}

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositorySpy {
    async load () {
      return new Error()
    }
  }
  return new LoadUserByEmailRepositorySpy()
}

const makeUpdateAcessToken = () => {
  class UpdateAcessTokenSpy {
    async update (userId, acessToken) {
      this.userId = userId
      this.acessToken = acessToken
    }
  }

  return new UpdateAcessTokenSpy()
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.acessToken
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.acessToken = 'any_token'
  return tokenGeneratorSpy
}

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate () {
      throw new Error()
    }
  }
  return new TokenGeneratorSpy()
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const tokenGeneratorSpy = makeTokenGenerator()
  const updateAcessTokenRepositorySpy = makeUpdateAcessToken()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAcessTokenRepository: updateAcessTokenRepositorySpy
  })

  return { sut, loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy, updateAcessTokenRepositorySpy }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@mail.com')

    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')

    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })

  test('Should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const acessToken = await sut.auth('invalid_email@mail.com', 'any_password')

    expect(acessToken).toBe(null)
  })

  test('Should return null if an invalid password is provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const acessToken = await sut.auth('valid_email@mail.com', 'invalid_password')

    expect(acessToken).toBe(null)
  })

  test('Should call Encrypter with correct value', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'any_password')

    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  test('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'valid_password')

    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  test('Should return an acessToke if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const acessToken = await sut.auth('valid_email@mail.com', 'valid_password')

    expect(acessToken).toBe(tokenGeneratorSpy.acessToken)
    expect(acessToken).toBeTruthy()
  })
  test('Should call UpdateAcessTokenRepository with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy, updateAcessTokenRepositorySpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'valid_password')

    expect(updateAcessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
    expect(updateAcessTokenRepositorySpy.acessToken).toBe(tokenGeneratorSpy.acessToken)
  })

  test('Should throw if invalid dependecies are provided', async () => {
    const invalid = {}
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const encrypter = makeEncrypter()

    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({ }),
      new AuthUseCase({ loadUserByEmailRepository: invalid }),
      new AuthUseCase({
        loadUserByEmailRepository
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: invalid
      })
    )

    for (const sut of suts) {
      const promise = sut.auth('any_email@mail.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if any dependecies throws', async () => {
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const encrypter = makeEncrypter()

    const suts = [].concat(
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError() }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter: makeEncrypterWithError() }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator: makeTokenGeneratorWithError() })
    )

    for (const sut of suts) {
      const promise = sut.auth('any_email@mail.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })
})
