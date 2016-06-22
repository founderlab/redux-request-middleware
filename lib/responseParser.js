'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.isModel = isModel;
exports.parseJSON = parseJSON;
exports.parseModel = parseModel;
exports['default'] = createResponseParserMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function isModel(action) {
  return action.res && _lodash2['default'].isFunction(action.res.toJSON);
}

function parseJSON(action) {
  var modelList = action.res ? action.res.body || action.res : null;
  if (!_lodash2['default'].isArray(modelList)) modelList = [modelList];
  var model = modelList[0];
  var status = action.res && action.res.status || (model ? 200 : 404);
  var models = {};
  var ids = [];
  _lodash2['default'].forEach(modelList, function (model) {
    if (_lodash2['default'].isNil(model && model.id)) return;
    model.id = model.id.toString();
    models[model.id] = model;
    ids.push(model.id);
  });
  return _extends({ model: model, models: models, modelList: modelList, ids: ids, status: status }, action);
}

function parseModel(action) {
  action.res = action.res ? action.res.toJSON() : null;
  return parseJSON(action);
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