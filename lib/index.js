'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.configure = configure;
exports.reset = reset;
exports.createRequestMiddleware = createRequestMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var defaults = _objectWithoutProperties(_config2['default'], []);

function configure() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (options.method && !options.methods) {
    options.methods = [options.method];
  }
  _lodash2['default'].extend(_config2['default'], options);
}

function reset() {
  _lodash2['default'].extend(_config2['default'], defaults);
}

function createRequestMiddleware(options) {
  configure(options);
  return _middleware2['default'];
}

exports['default'] = { requestMiddleware: _middleware2['default'] };