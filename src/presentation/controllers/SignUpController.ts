import { IHttpResponse } from '../protocols/IHttpResponse'
import { IHttpRequest } from '../protocols/IHttpRequest'
import { IController } from '../protocols/IController'

import { MissingParamError } from '../errors/MissingParamError'
import { badRequest } from '../helpers/HttpHelpers'

export class SignUpController implements IController {
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

        return {
            statusCode: 200,
            body: {},
        }
    }
}
