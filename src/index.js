import _ from 'lodash'
import defaults from './config'

export function createRequestMiddleware(options={}) {
  if (options.method && !(options.methods || []).length) options.methods = [options.method]
  _.defaults(options, defaults)

  return function requestMiddleware() {
    return next => action => {
      const {type, ...rest} = action
      const request = action[options.request_name]
      if (!request) return next(action)

      let end_method
      for (let method_name of options.methods) {
        end_method = request[method_name]
        if (_.isFunction(end_method)) break
      }
      if (!end_method) return next(action)
      end_method = end_method.bind(request)

      const START = type + options.suffixes.start
      const ERROR = type + options.suffixes.error
      const SUCCESS = type + options.suffixes.success
      delete rest[options.request_name]

      next({type: START, ...rest})

      return end_method((err, res) => {
        let error = err
        if (!error && res && res.body) error = res.body.error

        if (error) return next({res, error, type: ERROR, ...rest})
        next({res, type: SUCCESS, ...rest})
      })
    }
  }
}

let requestMiddleware = createRequestMiddleware()
export default requestMiddleware
