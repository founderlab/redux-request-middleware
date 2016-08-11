'use strict';

exports.__esModule = true;
exports['default'] = createRequestLoggerMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var defaults = {
  getRequest: function getRequest(action) {
    return action.request;
  },
  logRequest: function logRequest(request) {
    return console.log('[request]', request.method, request.url, request);
  },
  getResponse: function getResponse(action) {
    return action.res;
  },
  logResponse: function logResponse(response) {
    return console.log('[response]', response);
  },
  getError: function getError(action) {
    return action.error;
  },
  logError: function logError(response) {
    return console.log('[error]', error);
  }
};

function createRequestLoggerMiddleware() {
  var _options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var options = _lodash2['default'].merge(defaults, _options);

  return function requestLoggerMiddleware() {
    return function (next) {
      return function (action) {
        var request = options.getRequest(action);
        if (request) options.logRequest(request);
        var response = options.getResponse(action);
        if (response) options.logResponse(response);
        var error = options.getError(action);
        if (error) options.logError(error);
        next(action);
      };
    };
  };
}

module.exports = exports['default'];