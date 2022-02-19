import validator from 'validator'
import { EmailValidatorAdapter } from '../EmailValidatorAdapter'

describe('EmailValidatorAdapter', () => {
    jest.mock('validator', () => ({
        isEmail(): boolean {
            return true
        },
    }))

    test('Should return false if validator returns false', () => {
        // O que importa para esse teste é saber que se a lib do validator retornar falso, o método isValid do EmailValidatorAdapter vai retornar falso também.
        // Não importa como a lib valida as entradas, o que é importante é o retorno estar correto dentro do método do SUT.
        // Não é a lib do validator que está sendo testada. O teste é da implementação da minha classe que recebe o retorno de uma lib já testada.

        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

        const sut = new EmailValidatorAdapter()

        const isValid = sut.isValid('invalid_email@mail.com')

        expect(isValid).toBe(false)
    })

    test('Should return true if validator returns true', () => {
        const sut = new EmailValidatorAdapter()

        const isValid = sut.isValid('valid_email@mail.com')

        expect(isValid).toBe(true)
    })

    test('Should call validator with correct email', () => {
        const sut = new EmailValidatorAdapter()

        const isEmailSpy = jest.spyOn(validator, 'isEmail')

        sut.isValid('any_email@mail.com')

        expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
})
