import _ from 'lodash'
import retry from 'retry-unless'

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
  retry: {
    times: 20,
    interval: retryCount => Math.min(50 * Math.pow(2, retryCount), 1000),
  },
  check: (err, count) => {
    const status = err.status
    if (status && status.toString()[0] === '4' || status === 500) return true
    if (err.toString().match(/status (4|500)/)) return true
    return false
  },
}

// Wrap the end function to place the error status code on it if not present
const wrapEnd = endFn => callback => {
  endFn((err, res) => {
    if (err && res && !err.status) {
      err.status = res.status
    }
    callback(err, res)
  })
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

      const done = (err, res) => {
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
      }

      if (options.retry) {
        return retry(options.retry, wrapEnd(end), options.check, done)
      }

      return end(done)
    }
  }
}
