import merge from 'lodash/object/merge'
import isArray from 'lodash/lang/isArray'

export function isModel(action) { return action.res && !!action.res.protype.sync }

export function parseModel(action) {
  const model_json = action.res ? action.res.toJSON() : {}
  const by_id = model_json.id ? {[model_json.id]: model_json} : {}
  return {by_id, ...action}
}

export function parseJSON(action) {
  let models = action.res ? action.res.body || action.res : []
  if (!isArray(models)) models = [models]
  const by_id = {}
  _.forEach(models, model => by_id[model.id] = model)
  return {by_id, ...action}
}

const defaults = {
  isModel,
  parseModel,
  parseJSON,
}

export default function createResponseParserMiddleware(_options={}) {
  const options = merge({}, defaults, _options)

  return function responseParserMiddleware() {
    return next => action => {
      return next(options.isModel(action) ? options.parseModel(action) : options.parseJSON(action))
    }
  }
}
