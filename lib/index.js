'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _requestLogger = require('./requestLogger');

var _requestLogger2 = _interopRequireDefault(_requestLogger);

var _responseParser = require('./responseParser');

var _responseParser2 = _interopRequireDefault(_responseParser);

exports.createRequestMiddleware = _request2['default'];
exports.createResponseParserMiddleware = _responseParser2['default'];
exports.createRequestLoggerMiddleware = _requestLogger2['default'];
var requestMiddleware = _request2['default']();
exports.requestMiddleware = requestMiddleware;
var responseParserMiddleware = _responseParser2['default']();
exports.responseParserMiddleware = responseParserMiddleware;
var requestLoggerMiddleware = _requestLogger2['default']();
exports.requestLoggerMiddleware = requestLoggerMiddleware;