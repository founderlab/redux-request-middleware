import _ from 'lodash'
import expect from 'expect'
import {spy} from 'sinon'
import {createResponseParserMiddleware} from '../src'

function createJSONSpy(input) {
  return spy(action => {
    const input_list = _.isArray(input) ? input : [input]
    _.forEach(input_list, model_json => {
      expect(action.by_id[model_json.id]).toEqual(model_json)
      expect(action.models).toInclude(model_json)
      expect(action.ids).toInclude(model_json.id)
    })
  })
}

function createModelSpy(model) {
  return spy(action => {
    expect(action.by_id[model.attributes.id]).toEqual(model.attributes)
  })
}

class Model {
  constructor(attrs) {
    this.attributes = attrs
  }
  toJSON() { return this.attributes }
}

describe('responseParserMiddleware', () => {

  it('Parses a single model as json', () => {
    const action = {
      res: {
        id: 'model1id',
        name: 'model1',
      },
    }
    const next = createJSONSpy(action.res)
    const middleware = createResponseParserMiddleware()
    middleware()(next)(action)
    expect(next.calledOnce).toExist()
  })

  it('Parses a list of json', () => {
    const action = {
      res: [
        {
          id: 'model1id',
          name: 'model1',
        },
        {
          id: 'model22222id',
          name: 'model22222',
        },
      ],
    }
    const next = createJSONSpy(action.res)
    const middleware = createResponseParserMiddleware()
    middleware()(next)(action)
    expect(next.calledOnce).toExist()
  })

  it('Parses a model-like thing', () => {
    const action = {
      res: new Model({
        id: 'model1id',
        name: 'model1',
      }),
    }
    const next = createModelSpy(action.res)
    const middleware = createResponseParserMiddleware()
    middleware()(next)(action)
    expect(next.calledOnce).toExist()
  })

})
