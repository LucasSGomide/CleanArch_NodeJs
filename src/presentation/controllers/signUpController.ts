import { IHttpRequest, IHttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missingParamError'

import { badRequest } from '../helpers/httpHelpers'

export class SignUpController {
    constructor(public test: string = 'Avoiding Eslint') {
        this.test = test
    }

    handle(httpRequest: IHttpRequest): IHttpResponse {
        console.log(this.test)

        const requiredAttributes = ['name', 'email', 'password']

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
