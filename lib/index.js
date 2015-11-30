'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _request = require('./request');

var _response_parser = require('./response_parser');

exports.createRequestMiddleware = _request.createRequestMiddleware;
exports.createResponseParserMiddleware = _response_parser.createResponseParserMiddleware;
var requestMiddleware = (0, _request.createRequestMiddleware)();
exports.requestMiddleware = requestMiddleware;
var responseParserMiddleware = (0, _response_parser.createResponseParserMiddleware)();
exports.responseParserMiddleware = responseParserMiddleware;