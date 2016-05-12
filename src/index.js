import createRequestMiddleware from './request'
import createResponseParserMiddleware from './responseParser'

export {createRequestMiddleware, createResponseParserMiddleware}
export const requestMiddleware = createRequestMiddleware()
export const responseParserMiddleware = createResponseParserMiddleware()
