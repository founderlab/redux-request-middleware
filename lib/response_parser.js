'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.isModel = isModel;
exports.parseModel = parseModel;
exports.parseJSON = parseJSON;
exports['default'] = createResponseParserMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function isModel(action) {
  return action.res && _lodash2['default'].isFunction(action.res.toJSON);
}

function parseModel(action) {
  var model = action.res ? action.res.toJSON() : {};
  var by_id = model.id ? _defineProperty({}, model.id, model) : {};
  return _extends({ by_id: by_id, model: model, models: [model], ids: [model.id] }, action);
}

function parseJSON(action) {
  var models = action.res ? action.res.body || action.res : [];
  if (!_lodash2['default'].isArray(models)) models = [models];
  var by_id = {};
  var ids = [];
  _lodash2['default'].forEach(models, function (model) {
    by_id[model.id] = model;
    ids.push(model.id);
  });
  return _extends({ by_id: by_id, models: models, ids: ids }, action);
}

var defaults = {
  isModel: isModel,
  parseModel: parseModel,
  parseJSON: parseJSON
};

function createResponseParserMiddleware() {
  var _options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var options = _lodash2['default'].merge({}, defaults, _options);

  return function responseParserMiddleware() {
    return function (next) {
      return function (action) {
        return next(options.isModel(action) ? options.parseModel(action) : options.parseJSON(action));
      };
    };
  };
}