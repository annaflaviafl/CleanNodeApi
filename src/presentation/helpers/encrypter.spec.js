const bcrypt = require('bcrypt')
const { MissingParamError } = require('../../utils/errors')
const Encrypter = require('./encripter')

const makeSut = () => {
  const sut = new Encrypter()
  return { sut }
}
describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const { sut } = makeSut()
    const isValid = await sut.compare('any_value', 'hashed_value')

    expect(isValid).toBeTruthy()
  })

  test('Should return true if bcrypt returns true', async () => {
    const { sut } = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'hashed_value')

    expect(isValid).toBeFalsy()
  })

  test('Should cally bcrypt with correct value', async () => {
    const { sut } = makeSut()
    await sut.compare('any_value', 'hashed_value')

    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('hashed_value')
  })

  test('Should throw if no params are provided', async () => {
    const { sut } = makeSut()

    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
    expect(sut.compare('any_value')).rejects.toThrow(new MissingParamError('hash'))
  })
})
