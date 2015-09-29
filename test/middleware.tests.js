import assert from 'assert'
import {reset, createRequestMiddleware} from '../index'

import {spy} from 'sinon'

import config from '../config'

const TYPE = 'ACTIONTYPE'

function createSpy() {
  return spy(action => {
    assert.ok(action)
    assert.ok(action.type === TYPE)
  })
}

function createMiddlewareSpy() {
  const spy_fn = spy(action => {
    assert.ok(action)

    if (spy_fn.calledOnce) {
      assert.ok(action.type === TYPE+'_START')
    }
    else if (spy_fn.calledTwice) {
      if (action.error) {
        assert.ok(action.type === TYPE+'_ERROR')
      }
      else {
        assert.ok(action.res)
        assert.ok(action.type === TYPE+'_SUCCESS')
      }
    }
  })
  return spy_fn
}

describe('requestMiddleware', () => {

  beforeEach(() => reset())

  it('Passes through an action without a request', () => {
    let done = createSpy()
    let action = {type: TYPE}
    let middleware = createRequestMiddleware()
    middleware()(done)(action)
    assert.ok(done.called)
  })

  it('Passes through an action with a request field that isnt a function', () => {
    let done = createSpy()
    let action = {type: TYPE, request: 'lol'}
    let middleware = createRequestMiddleware()
    middleware()(done)(action)
    assert.ok(done.called)
  })

  it('Passes through an action with a configured request field that isnt a function', () => {
    let done = createSpy()
    let action = {type: TYPE, req: 'lol'}
    let middleware = createRequestMiddleware({request_name: 'req'})
    middleware()(done)(action)
    assert.ok(done.called)
  })

  it('Calls a request', () => {
    let req = {
      end: spy((callback) => {
        callback(null, {success: true})
      })
    }
    let done = createMiddlewareSpy()
    let action = {type: TYPE, request: req}

    let middleware = createRequestMiddleware()
    middleware()(done)(action)

    assert.ok(done.calledTwice)
    assert.ok(req.end.called)
  })

  it('Calls a request with config', () => {
    let req = {
      done: spy((callback) => {
        callback(null, {success: true})
      })
    }
    let done = createMiddlewareSpy()
    let action = {type: TYPE, a_request: req}

    let middleware = createRequestMiddleware({request_name: 'a_request', method: 'done'})
    middleware()(done)(action)

    assert.ok(done.calledTwice)
    assert.ok(req.done.called)
  })

  it('Errors correctly', () => {
    let req = {
      done: spy((callback) => {
        callback(new Error('failed'))
      })
    }
    let done = createMiddlewareSpy()
    let action = {type: TYPE, a_request: req}

    let middleware = createRequestMiddleware({request_name: 'a_request', method: 'done'})
    middleware()(done)(action)

    assert.ok(done.calledTwice)
    assert.ok(req.done.called)
  })

})
