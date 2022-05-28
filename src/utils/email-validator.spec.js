const validator = require('validator')
class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

describe('Email validator', () => {
  test('Shold return true if validator returns true', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('valid_email@mail.com')

    expect(isEmailValid).toBe(true)
  })

  test('Shold return false if validator returns false', () => {
    validator.isEmailValid = false
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('invalid_email@mail.com')

    expect(isEmailValid).toBe(false)
  })
})
