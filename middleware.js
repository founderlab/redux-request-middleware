import _ from 'lodash'
import config from './config'

export default function requestMiddleware() {
  return next => action => {
    const {type, ...rest} = action
    const request = action[config.request_name]
    if (!request) return next(action)

    let end_method
    for (let method_name of config.methods) {
      end_method = request[method_name]
      if (_.isFunction(end_method)) break
    }
    if (!end_method) return next(action)

    const START = type + config.suffixes.start
    const ERROR = type + config.suffixes.error
    const SUCCESS = type + config.suffixes.success
    delete rest[config.request_name]

    next({type: START, ...rest})

    return end_method((err, res) => {
      if (err) {
        return next({res, error: err, type: ERROR, ...rest})
      }
      next({res, type: SUCCESS, ...rest})
    })
  }
}
