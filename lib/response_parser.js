'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports.isModel = isModel;
exports.parseModel = parseModel;
exports.parseJSON = parseJSON;
exports['default'] = createResponseParserMiddleware;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodashObjectMerge = require('lodash/object/merge');

var _lodashObjectMerge2 = _interopRequireDefault(_lodashObjectMerge);

var _lodashLangIsFunction = require('lodash/lang/isFunction');

var _lodashLangIsFunction2 = _interopRequireDefault(_lodashLangIsFunction);

var _lodashLangIsArray = require('lodash/lang/isArray');

var _lodashLangIsArray2 = _interopRequireDefault(_lodashLangIsArray);

function isModel(action) {
  return action.res && _lodashLangIsFunction2['default'](action.res.toJSON);
}

function parseModel(action) {
  var _ref;

  var model = action.res ? action.res.toJSON() : {};
  var by_id = model.id ? (_ref = {}, _ref[model.id] = model, _ref) : {};
  return _extends({ by_id: by_id, model: model, models: [model], ids: [model.id] }, action);
}

function parseJSON(action) {
  var models = action.res ? action.res.body || action.res : [];
  if (!_lodashLangIsArray2['default'](models)) models = [models];
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

  var options = _lodashObjectMerge2['default']({}, defaults, _options);

  return function responseParserMiddleware() {
    return function (next) {
      return function (action) {
        return next(options.isModel(action) ? options.parseModel(action) : options.parseJSON(action));
      };
    };
  };
}