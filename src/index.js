import createRequestMiddleware from './request'
import createResponseParserMiddleware from './response_parser'

export {createRequestMiddleware, createResponseParserMiddleware}
export const requestMiddleware = createRequestMiddleware()
export const responseParserMiddleware = createResponseParserMiddleware()
