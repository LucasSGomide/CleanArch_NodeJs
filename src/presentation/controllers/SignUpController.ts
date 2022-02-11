import {
    IHttpResponse,
    IHttpRequest,
    IController,
    IEmailValidator,
} from '../protocols'
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/HttpHelpers'

export class SignUpController implements IController {
    private readonly emailValidator: IEmailValidator

    constructor(emailValidator: IEmailValidator) {
        this.emailValidator = emailValidator
    }

    handle(httpRequest: IHttpRequest): IHttpResponse {
        try {
            const { body } = httpRequest

            const invalidField = this.findMissingFields(httpRequest)

            if (invalidField) {
                return badRequest(new MissingParamError(invalidField))
            }

            const isEmailValid = this.emailValidator.isValid(body.email)

            if (!isEmailValid) {
                return badRequest(new InvalidParamError('email'))
            }
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
