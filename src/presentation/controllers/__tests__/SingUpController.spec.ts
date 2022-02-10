import { SignUpController } from '../SignUpController'
import { MissingParamError } from '../../errors/MissingParamError'
import { InvalidParamError } from '../../errors/InvalidParamError'

import { IEmailValidator } from '../../protocols/IEmailValidator'

type TypesSut = {
    emailValidator: IEmailValidator
    sut: SignUpController
}

const makeSut = (): TypesSut => {
    class EmailValidatorStub implements IEmailValidator {
        // Stub "dublê de teste"
        isValid(email: string): boolean {
            return true
        }
    }

    const emailValidatorStub = new EmailValidatorStub()

    return {
        sut: new SignUpController(emailValidatorStub),
        emailValidator: emailValidatorStub,
    }
}

describe('SignUpController', () => {
    test('Should return 400 if no name is provided', () => {
        const { sut } = makeSut() // system under test

        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is provided', () => {
        const { sut } = makeSut() // system under test

        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provided', () => {
        const { sut } = makeSut() // system under test

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                passwordConfirmation: 'any_password',
            },
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 400 if no passwordConfirmation is provided', () => {
        const { sut } = makeSut() // system under test

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
            },
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(
            new MissingParamError('passwordConfirmation')
        )
    })

    test('Should return 400 if an invalid email is provided', () => {
        const { sut, emailValidator } = makeSut() // system under test

        jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('Should call EmailValidator with correct email', () => {
        const { sut, emailValidator } = makeSut() // system under test

        const isValidSpy = jest.spyOn(emailValidator, 'isValid')

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        }

        sut.handle(httpRequest)

        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })
})
