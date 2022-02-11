import {
    IHttpResponse,
    IHttpRequest,
    IController,
    IEmailValidator,
    ICreateAccountUseCase,
} from './SignUpProtocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, success } from '../../helpers/HttpHelpers'

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

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
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

            const createdAccount = await this.createAccountUseCase.create({
                name,
                email,
                password,
            })

            return success(createdAccount)
        } catch (error) {
            return serverError()
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
