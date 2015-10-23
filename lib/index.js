'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createRequestMiddleware = createRequestMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function createRequestMiddleware() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (options.method && !(options.methods || []).length) options.methods = [options.method];
  _lodash2['default'].defaults(options, _config2['default']);

  return function requestMiddleware() {
    return function (next) {
      return function (action) {
        var type = action.type;

        var rest = _objectWithoutProperties(action, ['type']);

        var request = action[options.request_name];
        if (!request) return next(action);

        var end_method = undefined;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = options.methods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
        end_method = end_method.bind(request);

        var START = type + options.suffixes.START;
        var ERROR = type + options.suffixes.ERROR;
        var SUCCESS = type + options.suffixes.SUCCESS;
        delete rest[options.request_name];

        next(_extends({ type: START }, rest));

        return end_method(function (err, res) {
          var error = err || (res && res.body ? res.body.error : null);
          if (error) return next(_extends({ res: res, error: error, type: ERROR }, rest));

          next(_extends({ res: res, type: SUCCESS }, rest));
        });
      };
    };
  };
}

var requestMiddleware = createRequestMiddleware();
exports['default'] = requestMiddleware;