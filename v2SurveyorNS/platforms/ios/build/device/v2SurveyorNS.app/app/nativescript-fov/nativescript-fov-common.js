"use strict";
Object.defineProperty(exports, "__esModule", {value : true});

const platformModule = require("tns-core-modules/platform"); //needed for screen size
/*The export keyword is used to make the variables accessible to other files that import it*/
exports.verticalFOV; // assumes of the largest resolution w/o discrimination to ratio
exports.horizontalFOV; // assumes of the largest resolution w/o discrimination to ratio
exports.z; // constant value of the camera
exports.maxPictureWidth; // constant value of the phone
exports.maxPictureHeight; // not used

exports.degrees2Pixels= function(angle) {
  let x = 2 * exports.z * Math.tan(angle * Math.PI / 180 / 2);
  return x * platformModule.screen.mainScreen.heightPixels/exports.maxPictureWidth; // height pixels because screen is vertical (I think)
}

exports.degrees2Scale= function(angle, length) {
  return exports.degrees2Pixels(angle) / length;
}

exports.dp2Pixels = function(dp) {
  return dp * platformModule.screen.mainScreen.scale;
}

exports.pixels2Dp = function(pixels) {
  return pixels / platformModule.screen.mainScreen.scale;
}

exports.setVarsHelper = function (maxWidth, maxHeight) { // exports for private use, rather than public
  exports.maxPictureHeight = maxHeight;
  exports.maxPictureWidth = maxWidth;
  exports.z = maxWidth/2/Math.tan(exports.horizontalFOV * Math.PI / 180 / 2);
}

exports.getVerticalFOV = function () {
  return exports.verticalFOV;
}

exports.getHorizontalFOV = function() {
  return exports.horizontalFOV;
}
