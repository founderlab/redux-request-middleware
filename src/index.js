import createRequestMiddleware from './request'
import createRequestLoggerMiddleware from './requestLogger'
import createResponseParserMiddleware from './responseParser'

export {createRequestMiddleware, createResponseParserMiddleware, createRequestLoggerMiddleware}
export const requestMiddleware = createRequestMiddleware()
export const responseParserMiddleware = createResponseParserMiddleware()
export const requestLoggerMiddleware = createRequestLoggerMiddleware()
