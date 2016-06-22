'use strict';

exports.__esModule = true;
exports.setValue = setValue;
exports['default'] = createRequestModifierMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function setValue(request, value) {
  if (_lodash2['default'].isObject(request._cursor)) {
    _lodash2['default'].merge(request._cursor, value);
  }
  if (_lodash2['default'].isFunction(request.query)) {
    request.query(value);
  }
  return request;
}

var defaults = {
  getRequest: function getRequest(action) {
    return action.request;
  },
  setValue: setValue
};

function createRequestModifierMiddleware() {
  var _options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var options = _lodash2['default'].merge(defaults, _options);
  if (!options.getValue) return console.error('[fl-react-utils] createQueryMiddleware requires a getValue option');

  return function requestModifierMiddleware(store) {
    return function (next) {
      return function (action) {

        var request = options.getRequest(action);
        var value = options.getValue(store);
        if (request && value) options.setValue(request, value);

        next(action);
      };
    };
  };
}