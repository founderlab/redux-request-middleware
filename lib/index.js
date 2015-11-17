'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.extractRequest = extractRequest;
exports.getEndFn = getEndFn;
exports.createRequestMiddleware = createRequestMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _lodashObjectMerge = require('lodash/object/merge');

var _lodashObjectMerge2 = _interopRequireDefault(_lodashObjectMerge);

var _lodashLangIsFunction = require('lodash/lang/isFunction');

var _lodashLangIsFunction2 = _interopRequireDefault(_lodashLangIsFunction);

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
    var method_name = _arr[_i];
    end = request[method_name];
    if ((0, _lodashLangIsFunction2['default'])(end)) return end.bind(request);
  }
  if ((0, _lodashLangIsFunction2['default'])(request)) return request;
  return null;
}

var defaults = {
  extractRequest: extractRequest,
  getEndFn: getEndFn,
  getError: function getError(res) {
    return res && res.body ? res.body.error || (!res.ok ? res.body : null) : null;
  },
  suffixes: {
    START: '_START',
    ERROR: '_ERROR',
    SUCCESS: '_SUCCESS'
  }
};

function createRequestMiddleware() {
  var options_ = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var options = (0, _lodashObjectMerge2['default'])({}, defaults, options_);

  return function requestMiddleware() {
    return function (next) {
      return function (action_) {
        var _options$extractRequest = options.extractRequest(action_);

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
          if (error) {
            next(_extends({ res: res, error: error, type: ERROR }, rest));
          } else {
            var success_action = _extends({ res: res, type: SUCCESS }, rest);
            if (parseResponse) success_action = parseResponse(success_action);
            next(success_action);
          }
          if (callback) callback(error);
        });
      };
    };
  };
}

var requestMiddleware = createRequestMiddleware();
exports['default'] = requestMiddleware;