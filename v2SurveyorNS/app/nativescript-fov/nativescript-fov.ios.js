"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require('./nativescript-fov-common');

exports.degrees2Pixels = common.degrees2Pixels;
exports.getVerticalFOV = common.getVerticalFOV;
exports.getHorizontalFOV = common.getHorizontalFOV;

exports.setVars = function (maxWidth, maxHeight) {
  common.setVarsHelper(maxWidth, maxHeight);
}

exports.initialize = function () {
  setFOV();
}
