const bcrypt = require('bcrypt')
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
})
