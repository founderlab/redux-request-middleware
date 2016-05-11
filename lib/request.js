'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports.extractRequest = extractRequest;
exports.getEndFn = getEndFn;
exports['default'] = createRequestMiddleware;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

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
  }
};

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
        return end(function (err, res) {
          var error = err || options.getError(res);
          var final_action = {};
          if (error) {
            final_action = _extends({ res: res, error: error, type: ERROR }, rest);
          } else {
            final_action = _extends({ res: res, type: SUCCESS }, rest);
            if (parseResponse) final_action = parseResponse(final_action);
          }
          next(final_action);
          if (callback) callback(error, final_action);
        });
      };
    };
  };
}