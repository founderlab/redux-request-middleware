'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = requestMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function requestMiddleware() {
  return function (next) {
    return function (action) {
      var type = action.type;

      var rest = _objectWithoutProperties(action, ['type']);

      var request = action[_config2['default'].request_name];
      if (!request) return next(action);

      var end_method = undefined;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _config2['default'].methods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var method_name = _step.value;

          end_method = request[method_name];
          if (_lodash2['default'].isFunction(end_method)) break;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!end_method) return next(action);

      var START = type + _config2['default'].suffixes.start;
      var ERROR = type + _config2['default'].suffixes.error;
      var SUCCESS = type + _config2['default'].suffixes.success;
      delete rest[_config2['default'].request_name];

      next(_extends({ type: START }, rest));

      return end_method(function (err, res) {
        if (err) {
          return next(_extends({ res: res, error: err, type: ERROR }, rest));
        }
        next(_extends({ res: res, type: SUCCESS }, rest));
      });
    };
  };
}

module.exports = exports['default'];