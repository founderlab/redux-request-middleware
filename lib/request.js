'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.extractRequest = extractRequest;
exports.getEndFn = getEndFn;
exports['default'] = createRequestMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _retryUnless = require('retry-unless');

var _retryUnless2 = _interopRequireDefault(_retryUnless);

function extractRequest(action) {
  var request = action.request;
  var callback = action.callback;
  var parseResponse = action.parseResponse;

  var rest = _objectWithoutProperties(action, ['request', 'callback', 'parseResponse']);

  return { request: request, callback: callback, parseResponse: parseResponse, action: rest };
}

function getEndFn(request) {
  if (!request) return null;
  var end = undefined;
  var _arr = ['toJSON', 'end'];
  for (var _i = 0; _i < _arr.length; _i++) {
    var methodName = _arr[_i];
    end = request[methodName];
    if (_lodash2['default'].isFunction(end)) return end.bind(request);
  }
  if (_lodash2['default'].isFunction(request)) return request;
  return null;
}

var defaults = {
  extractRequest: extractRequest,
  getEndFn: getEndFn,
  getError: function getError(res) {
    if (_lodash2['default'].isUndefined(res)) return '[redux-request-middleware] No response received';
    if (!res) return null;
    if (res.body && res.body.error) return res.body.error;
    if (res.ok === false) return res.body || res.status || '[redux-request-middleware] Unknown error: res.ok was false';
    return null;
  },
  suffixes: {
    START: '_START',
    ERROR: '_ERROR',
    SUCCESS: '_SUCCESS'
  },
  retry: {
    times: 20,
    interval: function interval(retryCount) {
      return Math.min(50 * Math.pow(2, retryCount), 1000);
    }
  },
  check: function check(err, count) {
    return false;
  } };

// eslint-disable-line

function createRequestMiddleware() {
  var _options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var options = _lodash2['default'].merge({}, defaults, _options);

  return function requestMiddleware() {
    return function (next) {
      return function (_action) {
        var _options$extractRequest = options.extractRequest(_action);

        var request = _options$extractRequest.request;
        var callback = _options$extractRequest.callback;
        var parseResponse = _options$extractRequest.parseResponse;
        var action = _options$extractRequest.action;

        var end = options.getEndFn(request);

        if (!end) return next(action);

        var type = action.type;

        var rest = _objectWithoutProperties(action, ['type']);

        var START = type + options.suffixes.START;
        var ERROR = type + options.suffixes.ERROR;
        var SUCCESS = type + options.suffixes.SUCCESS;

        next(_extends({ type: START }, rest));

        var done = function done(err, res) {
          var error = err || options.getError(res);
          var finalAction = {};
          if (error) {
            finalAction = _extends({ res: res, error: error, type: ERROR }, rest);
          } else {
            finalAction = _extends({ res: res, type: SUCCESS }, rest);
            if (parseResponse) finalAction = parseResponse(finalAction);
          }
          next(finalAction);
          if (callback) callback(error, finalAction);
        };

        if (options.retry) {
          return _retryUnless2['default'](options.retry, end, options.check, done);
        }

        return end(done);
      };
    };
  };
}