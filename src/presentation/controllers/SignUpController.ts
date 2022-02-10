import { IHttpResponse } from '../protocols/IHttpResponse'
import { IHttpRequest } from '../protocols/IHttpRequest'
import { IController } from '../protocols/IController'
import { IEmailValidator } from '../protocols/IEmailValidator'

import { MissingParamError } from '../errors/MissingParamError'
import { InvalidParamError } from '../errors/InvalidParamError'
import { badRequest } from '../helpers/HttpHelpers'

export class SignUpController implements IController {
    private readonly emailValidator: IEmailValidator

    constructor(emailValidator: IEmailValidator) {
        this.emailValidator = emailValidator
    }

    handle(httpRequest: IHttpRequest): IHttpResponse {
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

        const isEmailValid = this.emailValidator.isValid(httpRequest.body.email)

        if (!isEmailValid) {
            return badRequest(new InvalidParamError('email'))
        }

        return {
            statusCode: 200,
            body: {},
        }
    }
}
