import { IHttpRequest, IHttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missingParamError'

export class SignUpController {
    constructor(public test: string = 'Avoiding Eslint') {
        this.test = test
    }

    handle(httpRequest: IHttpRequest): IHttpResponse {
        console.log(this.test, httpRequest)
        if (!httpRequest.body.name) {
            return {
                statusCode: 400,
                body: new MissingParamError('name'),
            }
        }

        return {
            statusCode: 400,
            body: new MissingParamError('email'),
        }
    }
}
