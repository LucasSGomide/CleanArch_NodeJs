export class SignUpController {
    constructor(public test: string = 'Avoiding Eslint') {
        this.test = test
    }

    handle(httpRequest: any): any {
        console.log(this.test, httpRequest)
        if (!httpRequest.body.name) {
            return {
                statusCode: 400,
                body: new Error('Missing param: name'),
            }
        }

        return {
            statusCode: 400,
            body: new Error('Missing param: email'),
        }
    }
}
