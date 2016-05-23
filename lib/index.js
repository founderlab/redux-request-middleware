'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.responseParserMiddleware = exports.requestMiddleware = exports.createResponseParserMiddleware = exports.createRequestMiddleware = undefined;

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _responseParser = require('./responseParser');

var _responseParser2 = _interopRequireDefault(_responseParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createRequestMiddleware = _request2.default;
exports.createResponseParserMiddleware = _responseParser2.default;
var requestMiddleware = exports.requestMiddleware = (0, _request2.default)();
var responseParserMiddleware = exports.responseParserMiddleware = (0, _responseParser2.default)();