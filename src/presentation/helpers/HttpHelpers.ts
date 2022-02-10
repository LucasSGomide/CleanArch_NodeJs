import { IHttpResponse } from '../protocols/IHttpResponse'

export const badRequest = (error: Error): IHttpResponse => ({
    statusCode: 400,
    body: error,
})
