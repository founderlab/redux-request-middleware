import _ from 'lodash'

export function extractRequest(action) {
  const {request, callback, parseResponse, ...rest} = action
  return {request, callback, parseResponse, action: rest}
}

export function getEndFn(request) {
  if (!request) return null
  let end
  for (const methodName of ['toJSON', 'end']) {
    end = request[methodName]
    if (_.isFunction(end)) return end.bind(request)
  }
  if (_.isFunction(request)) return request
  return null
}

const defaults = {
  extractRequest,
  getEndFn,
  getError: res => {
    if (_.isUndefined(res)) return '[redux-request-middleware] No response received'
    if (!res) return null
    if (res.body && res.body.error) return res.body.error
    if (res.ok === false) return res.body || res.status || '[redux-request-middleware] Unknown error: res.ok was false'
    return null
  },
  suffixes: {
    START: '_START',
    ERROR: '_ERROR',
    SUCCESS: '_SUCCESS',
  },
}

export default function createRequestMiddleware(_options={}) {
  const options = _.merge({}, defaults, _options)

  return function requestMiddleware() {
    return next => _action => {

      const {request, callback, parseResponse, action} = options.extractRequest(_action)
      const end = options.getEndFn(request)

      if (!end) return next(action)

      const {type, ...rest} = action
      const START = type + options.suffixes.START
      const ERROR = type + options.suffixes.ERROR
      const SUCCESS = type + options.suffixes.SUCCESS

      next({type: START, ...rest})
      return end((err, res) => {
        const error = err || options.getError(res)
        let finalAction = {}
        if (error) {
          finalAction = {res, error, type: ERROR, ...rest}
        }
        else {
          finalAction = {res, type: SUCCESS, ...rest}
          if (parseResponse) finalAction = parseResponse(finalAction)
        }
        next(finalAction)
        if (callback) callback(error, finalAction)
      })
    }
  }
}
