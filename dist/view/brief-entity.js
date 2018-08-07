'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = require('../utils');

var briefEntityView = function briefEntityView(schemaRegistry) {
  return (0, _utils.liftToArray)(function (data) {
    return _extends({}, data.body, {
      id: data.id,
      type: data.type
    });
  });
};

exports.default = briefEntityView;