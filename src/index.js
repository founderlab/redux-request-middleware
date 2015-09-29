import _ from 'lodash'
import requestMiddleware from './middleware'
import config from './config'

const {...defaults} = config

export function configure(options={}) {
  if (options.method && !options.methods) {
    options.methods = [options.method]
  }
  _.extend(config, options)
}

export function reset () {
  _.extend(config, defaults)
}

export function createRequestMiddleware(options) {
  configure(options)
  return requestMiddleware
}

export default {requestMiddleware}
