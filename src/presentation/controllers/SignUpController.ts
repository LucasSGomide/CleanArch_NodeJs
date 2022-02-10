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
            const requiredAttributes = [
                'name',
                'email',
                'password',
                'passwordConfirmation',
            ]

            const missingAttribute = requiredAttributes
                .map((attribute) => {
                    if (!httpRequest.body[attribute]) {
                        return badRequest(new MissingParamError(attribute))
                    }

                    return {
                        statusCode: 200,
                        body: {},
                    }
                })
                .find((attribute) => attribute.statusCode === 400)

            if (missingAttribute) {
                return missingAttribute
            }

            const isEmailValid = this.emailValidator.isValid(
                httpRequest.body.email
            )
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
}
