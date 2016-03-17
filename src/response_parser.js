import _ from 'lodash'

export function isModel(action) { return action.res && _.isFunction(action.res.toJSON) }

export function parseJSON(action) {
  let models = action.res ? action.res.body || action.res : null
  if (!_.isArray(models)) models = [models]
  const model = models[0]
  const status = (action.res && action.res.status) || (model ? 200 : 404)
  const by_id = {}
  const ids = []
  _.forEach(models, model => {
    if (_.isNil(model && model.id)) return
    model.id = model.id.toString()
    by_id[model.id] = model
    ids.push(model.id)
  })
  return {by_id, model, models, ids, status, ...action}
}

export function parseModel(action) {
  action.res = action.res ? action.res.toJSON() : null
  return parseJSON(action)
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
