import assert from 'assert'
import {spy} from 'sinon'
import {createRequestMiddleware} from '../src'
import config from '../src/config'

const suffixes = config.suffixes
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
      assert.ok(action.type === TYPE + suffixes.START)
    }
    else if (spy_fn.calledTwice) {
      if (action.error) {
        assert.ok(action.type === TYPE + suffixes.ERROR)
      }
      else {
        assert.ok(action.res)
        assert.ok(action.type === TYPE + suffixes.SUCCESS)
      }
    }
  })
  return spy_fn
}

describe('requestMiddleware', () => {

  it('Passes through an action without a request', () => {
    const done = createSpy()
    const action = {type: TYPE}
    const middleware = createRequestMiddleware()
    middleware()(done)(action)
    assert.ok(done.calledOnce)
  })

  it('Passes through an action with a request field that isnt a function', () => {
    const done = createSpy()
    const action = {type: TYPE, request: 'lol'}
    const middleware = createRequestMiddleware()
    middleware()(done)(action)
    assert.ok(done.calledOnce)
  })

  it('Passes through an action with a configured request field that isnt a function', () => {
    const done = createSpy()
    const action = {type: TYPE, req: 'lol'}
    const middleware = createRequestMiddleware({request_name: 'req'})
    middleware()(done)(action)
    assert.ok(done.calledOnce)
  })

  it('Calls a request', () => {
    const req = {end: spy(callback => callback(null, {success: true}))}
    const done = createMiddlewareSpy()
    const action = {type: TYPE, request: req}

    const middleware = createRequestMiddleware()
    middleware()(done)(action)

    assert.ok(done.calledTwice)
    assert.ok(req.end.calledOnce)
  })

  it('Calls a request with config', () => {
    const req = {done: spy(callback => callback(null, {success: true}))}
    const done = createMiddlewareSpy()
    const action = {type: TYPE, a_request: req}

    const middleware = createRequestMiddleware({request_name: 'a_request', method: 'done'})
    middleware()(done)(action)

    assert.ok(done.calledTwice)
    assert.ok(req.done.calledOnce)
  })

  it('Errors from an error callback', () => {
    const req = {done: spy(callback => callback(new Error('failed')))}
    const done = createMiddlewareSpy()
    const action = {type: TYPE, a_request: req}

    const middleware = createRequestMiddleware({request_name: 'a_request', method: 'done'})
    middleware()(done)(action)

    assert.ok(done.calledTwice)
    assert.ok(req.done.calledOnce)
  })

  it('Errors from an error body property', () => {
    const req = {done: spy(callback => callback(null, {body: {error: 'failed'}}))}
    const done = createMiddlewareSpy()
    const action = {type: TYPE, a_request: req}

    const middleware = createRequestMiddleware({request_name: 'a_request', method: 'done'})
    middleware()(done)(action)

    assert.ok(done.calledTwice)
    assert.ok(req.done.calledOnce)
  })

})
