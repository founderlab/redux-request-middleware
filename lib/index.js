'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestLoggerMiddleware = exports.responseParserMiddleware = exports.requestMiddleware = exports.createRequestLoggerMiddleware = exports.createResponseParserMiddleware = exports.createRequestMiddleware = undefined;

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _requestLogger = require('./requestLogger');

var _requestLogger2 = _interopRequireDefault(_requestLogger);

var _responseParser = require('./responseParser');

var _responseParser2 = _interopRequireDefault(_responseParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createRequestMiddleware = _request2.default;
exports.createResponseParserMiddleware = _responseParser2.default;
exports.createRequestLoggerMiddleware = _requestLogger2.default;
var requestMiddleware = exports.requestMiddleware = (0, _request2.default)();
var responseParserMiddleware = exports.responseParserMiddleware = (0, _responseParser2.default)();
var requestLoggerMiddleware = exports.requestLoggerMiddleware = (0, _requestLogger2.default)();