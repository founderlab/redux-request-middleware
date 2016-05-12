'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _responseParser = require('./responseParser');

var _responseParser2 = _interopRequireDefault(_responseParser);

exports.createRequestMiddleware = _request2['default'];
exports.createResponseParserMiddleware = _responseParser2['default'];
var requestMiddleware = _request2['default']();
exports.requestMiddleware = requestMiddleware;
var responseParserMiddleware = _responseParser2['default']();
exports.responseParserMiddleware = responseParserMiddleware;