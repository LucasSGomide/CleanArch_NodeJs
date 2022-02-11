import { SignUpController } from '../SignUpController'

import {
    IEmailValidator,
    ICreateAccountUseCase,
    CreateAccountModel,
    AccountModel,
} from '../SignUpProtocols'

import {
    MissingParamError,
    InvalidParamError,
    ServerError,
} from '../../../errors'

const makeCreateAccount = (): ICreateAccountUseCase => {
    class CreateAccountStub implements ICreateAccountUseCase {
        create(account: CreateAccountModel): AccountModel {
            return {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: 'valid_password',
            }
        }
    }

    return new CreateAccountStub()
}

// factory
const makeEmailValidator = (): IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator {
        // Stub "dublê de teste"
        isValid(email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

type TypesSut = {
    emailValidator: IEmailValidator
    createAccount: ICreateAccountUseCase
    sut: SignUpController
}

// factory
const makeSut = (): TypesSut => {
    const emailValidatorStub = makeEmailValidator()
    const createAccountStub = makeCreateAccount()

    return {
        sut: new SignUpController(emailValidatorStub, createAccountStub),
        emailValidator: emailValidatorStub,
        createAccount: createAccountStub,
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

    test('Should return 400 if password confirmation fails', () => {
        const { sut } = makeSut() // system under test

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'invalid_password',
            },
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(
            new InvalidParamError('passwordConfirmation')
        )
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

    test('Should return 500 if email validator throws', () => {
        const { sut, emailValidator } = makeSut()

        jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should call CreateAccount with correct values', () => {
        const { sut, createAccount } = makeSut() // system under test

        const createSpy = jest.spyOn(createAccount, 'create')

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        }

        sut.handle(httpRequest)

        expect(createSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
        })
    })

    test('Should return 500 if create account throws', () => {
        const { sut, createAccount } = makeSut()

        jest.spyOn(createAccount, 'create').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 200 if valid data is provided', () => {
        const { sut } = makeSut() // system under test

        const httpRequest = {
            body: {
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: 'valid_password',
                passwordConfirmation: 'valid_password',
            },
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password',
        })
    })
})
