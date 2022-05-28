const validator = require('validator')
class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

const makeSut = () => {
  return new EmailValidator()
}
describe('Email validator', () => {
  test('Shold return true if validator returns true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@mail.com')

    expect(isEmailValid).toBe(true)
  })

  test('Shold return false if validator returns false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValid = sut.isValid('invalid_email@mail.com')

    expect(isEmailValid).toBe(false)
  })

  test('Shold call validator with correct email', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('any_email@mail.com')

    expect(validator.email).toBe('any_email@mail.com')
  })
})
