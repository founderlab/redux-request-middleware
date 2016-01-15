import _ from 'lodash'

export function isModel(action) { return action.res && _.isFunction(action.res.toJSON) }

export function parseModel(action) {
  const model = action.res ? action.res.toJSON() : {}
  const by_id = model.id ? {[model.id]: model} : {}
  return {by_id, model, models: [model], ids: [model.id], ...action}
}

export function parseJSON(action) {
  let models = action.res ? action.res.body || action.res : []
  if (!_.isArray(models)) models = [models]
  const by_id = {}
  const ids = []
  _.forEach(models, model => {
    by_id[model.id] = model
    ids.push(model.id)
  })
  return {by_id, models, ids, ...action}
}

const defaults = {
  isModel,
  parseModel,
  parseJSON,
}

export default function createResponseParserMiddleware(_options={}) {
  const options = _.merge({}, defaults, _options)

  return function responseParserMiddleware() {
    return next => action => {
      return next(options.isModel(action) ? options.parseModel(action) : options.parseJSON(action))
    }
  }
}
