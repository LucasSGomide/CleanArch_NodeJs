import {
    IHttpResponse,
    IHttpRequest,
    IController,
    IEmailValidator,
    ICreateAccountUseCase,
} from './SignUpProtocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/HttpHelpers'

export class SignUpController implements IController {
    private readonly emailValidator: IEmailValidator

    private readonly createAccountUseCase: ICreateAccountUseCase

    constructor(
        emailValidator: IEmailValidator,
        createAccountUseCase: ICreateAccountUseCase
    ) {
        this.emailValidator = emailValidator
        this.createAccountUseCase = createAccountUseCase
    }

    handle(httpRequest: IHttpRequest): IHttpResponse {
        try {
            const invalidField = this.findMissingFields(httpRequest)

            if (invalidField) {
                return badRequest(new MissingParamError(invalidField))
            }

            const { name, email, password, passwordConfirmation } =
                httpRequest.body

            const isEmailValid = this.emailValidator.isValid(email)

            if (!isEmailValid) {
                return badRequest(new InvalidParamError('email'))
            }

            const isValidPassword = password === passwordConfirmation

            if (!isValidPassword) {
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }

            this.createAccountUseCase.create({
                name,
                email,
                password,
            })
        } catch (error) {
            return serverError()
        }

        return {
            statusCode: 200,
            body: {},
        }
    }

    private findMissingFields(httpRequest: IHttpRequest): string | undefined {
        const requiredAttributes = [
            'name',
            'email',
            'password',
            'passwordConfirmation',
        ]

        return requiredAttributes
            .map((attribute) => {
                if (!httpRequest.body[attribute]) {
                    return attribute
                }

                return ''
            })
            .find((attribute) => requiredAttributes.includes(attribute))
    }
}
