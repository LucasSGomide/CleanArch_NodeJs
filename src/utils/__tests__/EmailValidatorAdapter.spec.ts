import { EmailValidatorAdapter } from '../EmailValidatorAdapter'

describe('EmailValidatorAdapter', () => {
    test('Should return false if validator returns false', () => {
        const sut = new EmailValidatorAdapter()

        const isValid = sut.isValid('invalid_email')

        expect(isValid).toBe(false)
    })

    test('Should return true if validator returns true', () => {
        const sut = new EmailValidatorAdapter()

        const isValid = sut.isValid('valid_email@mail.com')

        expect(isValid).toBe(true)
    })
})
