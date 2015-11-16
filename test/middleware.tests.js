import assert from 'assert'
import {spy} from 'sinon'
import {createRequestMiddleware} from '../src'

const suffixes = {
  START: '_START',
  ERROR: '_ERROR',
  SUCCESS: '_SUCCESS',
}
const TYPE = 'ACTIONTYPE'

function createSpy() {
  return spy(action => {
    assert.ok(action)
    assert.ok(action.type === TYPE)
  })
}

function createMiddlewareSpy() {
  const next_fn = spy(action => {
    assert.ok(action)

    if (next_fn.calledOnce) {
      assert.ok(action.type === TYPE + suffixes.START)
    }
    else if (next_fn.calledTwice) {
      if (action.error || !action.res || !action.res.ok) {
        assert.ok(action.type === TYPE + suffixes.ERROR)
      }
      else {
        assert.ok(action.res)
        assert.ok(action.type === TYPE + suffixes.SUCCESS)
      }
    }
  })
  return next_fn
}

describe('requestMiddleware', () => {

  it('Passes through an action without a request', () => {
    const next = createSpy()
    const action = {type: TYPE}
    const middleware = createRequestMiddleware()
    middleware()(next)(action)
    assert.ok(next.calledOnce)
  })

  it('Passes through an action with a request field that isnt a function', () => {
    const next = createSpy()
    const action = {type: TYPE, request: 'lol'}
    const middleware = createRequestMiddleware()
    middleware()(next)(action)
    assert.ok(next.calledOnce)
  })

  it('Passes through an action with a custom extractRequest method that isnt a function', () => {
    const next = createSpy()
    const action = {type: TYPE, req: 'lol', request: function() {} }
    const middleware = createRequestMiddleware({
      extractRequest: action => {
        const {req, callback, ...rest} = action
        return {request: req, callback, action: rest}
      }
    })
    middleware()(next)(action)
    assert.ok(next.calledOnce)
  })

  it('Calls a request', () => {
    const req = {end: spy(callback => callback(null, {ok: true}))}
    const next = createMiddlewareSpy()
    const action = {type: TYPE, request: req}

    const middleware = createRequestMiddleware()
    middleware()(next)(action)

    assert.ok(next.calledTwice)
    assert.ok(req.end.calledOnce)
  })

  it('Calls a pure function request', () => {
    const req = spy(callback => callback(null, {ok: true}))
    const next = createMiddlewareSpy()
    const action = {type: TYPE, request: req}

    const middleware = createRequestMiddleware()
    middleware()(next)(action)

    assert.ok(next.calledTwice)
    assert.ok(req.calledOnce)
  })

  it('Custom parses a response', () => {
    const req = {end: spy(callback => callback(null, {ok: true}))}
    const next = createMiddlewareSpy()
    const wrapper = action => {
      if (action.type === TYPE + suffixes.SUCCESS) assert.equal(action.res.changed, 'yup')
      next(action)
    }
    const action = {type: TYPE, request: req, parseResponse: res => ({changed: 'yup', ...res})}

    const middleware = createRequestMiddleware()
    middleware()(wrapper)(action)

    assert.ok(next.calledTwice)
    assert.ok(req.end.calledOnce)
  })

  it('Calls a request then calls a callback', () => {
    const req = {end: spy(callback => callback(null, {ok: true}))}
    const next = createMiddlewareSpy()
    const callback = spy(err => {assert.ok(!err)})
    const action = {callback, type: TYPE, request: req}

    const middleware = createRequestMiddleware()
    middleware()(next)(action)

    assert.ok(next.calledTwice)
    assert.ok(callback.calledOnce)
    assert.ok(req.end.calledOnce)
  })

  it('Calls a request with config', () => {
    const req = {next: spy(callback => callback(null, {ok: true}))}
    const next = createMiddlewareSpy()
    const action = {type: TYPE, a_request: req}

    const extractRequest = (action) => {
      const {a_request, ...rest} = action
      return {request: a_request, action: rest}
    }
    const getEndFn = request => request.next.bind(request)

    const middleware = createRequestMiddleware({extractRequest, getEndFn})
    middleware()(next)(action)

    assert.ok(next.calledTwice)
    assert.ok(req.next.calledOnce)
  })

  it('Errors from an error callback', () => {
    const req = {end: spy(callback => callback(new Error('failed')))}
    const next = createMiddlewareSpy()
    const action = {type: TYPE, request: req}

    const middleware = createRequestMiddleware()
    middleware()(next)(action)

    assert.ok(next.calledTwice)
    assert.ok(req.end.calledOnce)
  })

  it('Errors from an error body property', () => {
    const req = {end: spy(callback => callback(null, {body: {error: 'failed'}}))}
    const next = createMiddlewareSpy()
    const action = {type: TYPE, request: req}

    const middleware = createRequestMiddleware()
    middleware()(next)(action)

    assert.ok(next.calledTwice)
    assert.ok(req.end.calledOnce)
  })

  it('Errors from a bad status', () => {
    const req = {end: spy(callback => callback(null, {ok: false, body: 'some stack trace'}))}
    const next = createMiddlewareSpy()
    const action = {type: TYPE, request: req}

    let middleware = createRequestMiddleware()
    middleware()(next)(action)

    assert.ok(next.calledTwice)
    assert.ok(req.end.calledOnce)
  })

})
