import { IHttpRequest, IHttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missingParamError'

import { badRequest } from '../helpers/httpHelpers'

export class SignUpController {
    constructor(public test: string = 'Avoiding Eslint') {
        this.test = test
    }

    handle(httpRequest: IHttpRequest): IHttpResponse {
        console.log(this.test, httpRequest)
        if (!httpRequest.body.name) {
            return badRequest(new MissingParamError('name'))
        }

        return badRequest(new MissingParamError('email'))
    }
}
