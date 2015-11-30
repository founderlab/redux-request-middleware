'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _response_parser = require('./response_parser');

var _response_parser2 = _interopRequireDefault(_response_parser);

exports.createRequestMiddleware = _request2['default'];
exports.createResponseParserMiddleware = _response_parser2['default'];
var requestMiddleware = (0, _request2['default'])();
exports.requestMiddleware = requestMiddleware;
var responseParserMiddleware = (0, _response_parser2['default'])();
exports.responseParserMiddleware = responseParserMiddleware;