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

var _lodashObjectMerge = require('lodash/object/merge');

var _lodashObjectMerge2 = _interopRequireDefault(_lodashObjectMerge);

var _lodashLangIsArray = require('lodash/lang/isArray');

var _lodashLangIsArray2 = _interopRequireDefault(_lodashLangIsArray);

function isModel(action) {
  return action.res && !!action.res.protype.sync;
}

function parseModel(action) {
  var model_json = action.res ? action.res.toJSON() : {};
  var by_id = model_json.id ? _defineProperty({}, model_json.id, model_json) : {};
  return _extends({ by_id: by_id }, action);
}

function parseJSON(action) {
  var models = action.res ? action.res.body || action.res : [];
  if (!(0, _lodashLangIsArray2['default'])(models)) models = [models];
  var by_id = {};
  _.forEach(models, function (model) {
    return by_id[model.id] = model;
  });
  return _extends({ by_id: by_id }, action);
}

var defaults = {
  isModel: isModel,
  parseModel: parseModel,
  parseJSON: parseJSON
};

function createResponseParserMiddleware() {
  var _options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var options = (0, _lodashObjectMerge2['default'])({}, defaults, _options);

  return function responseParserMiddleware() {
    return function (next) {
      return function (action) {
        return next(options.isModel(action) ? options.parseModel(action) : options.parseJSON(action));
      };
    };
  };
}