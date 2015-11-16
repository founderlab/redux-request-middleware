import merge from 'lodash/object/merge'
import isFunction from 'lodash/lang/isFunction'

export function extractRequest(action) {
  const {request, callback, parseResponse, ...rest} = action
  return {request, callback, parseResponse, action: rest}
}

export function getEndFn(request) {
  if (!request) return null
  let end
  for (const method_name of ['toJSON', 'end']) {
    end = request[method_name]
    if (isFunction(end)) return end.bind(request)
  }
  if (isFunction(request)) return request
  return null
}

const defaults = {
  extractRequest,
  getEndFn,
  getError: res => res && res.body ? res.body.error || (!res.ok ? res.body : null) : null,
  suffixes: {
    START: '_START',
    ERROR: '_ERROR',
    SUCCESS: '_SUCCESS',
  },
}

export function createRequestMiddleware(options_={}) {
  const options = merge({}, defaults, options_)

  return function requestMiddleware() {
    return next => action_ => {

      const {request, callback, parseResponse, action} = options.extractRequest(action_)
      const end = options.getEndFn(request)
      if (!end) return next(action)

      const {type, ...rest} = action
      const START = type + options.suffixes.START
      const ERROR = type + options.suffixes.ERROR
      const SUCCESS = type + options.suffixes.SUCCESS

      next({type: START, ...rest})

      return end((err, res) => {
        const error = err || options.getError(res)
        if (error) {
          next({res, error, type: ERROR, ...rest})
        }
        else {
          let final_res = res
          if (parseResponse) console.log('parseResponse', parseResponse, parseResponse(res))
          if (parseResponse) final_res = parseResponse(res)
          next({res: final_res, type: SUCCESS, ...rest})
        }
        if (callback) callback(error)
      })
    }
  }
}

const requestMiddleware = createRequestMiddleware()
export default requestMiddleware
