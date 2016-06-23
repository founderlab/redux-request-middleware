'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _requestLogger = require('./requestLogger');

var _requestLogger2 = _interopRequireDefault(_requestLogger);

var _responseParser = require('./responseParser');

var _responseParser2 = _interopRequireDefault(_responseParser);

var _requestModifier = require('./requestModifier');

var _requestModifier2 = _interopRequireDefault(_requestModifier);

exports.createRequestMiddleware = _request2['default'];
exports.createResponseParserMiddleware = _responseParser2['default'];
exports.createRequestLoggerMiddleware = _requestLogger2['default'];
exports.createRequestModifierMiddleware = _requestModifier2['default'];
var requestMiddleware = (0, _request2['default'])();
exports.requestMiddleware = requestMiddleware;
var responseParserMiddleware = (0, _responseParser2['default'])();
exports.responseParserMiddleware = responseParserMiddleware;
var requestLoggerMiddleware = (0, _requestLogger2['default'])();
exports.requestLoggerMiddleware = requestLoggerMiddleware;