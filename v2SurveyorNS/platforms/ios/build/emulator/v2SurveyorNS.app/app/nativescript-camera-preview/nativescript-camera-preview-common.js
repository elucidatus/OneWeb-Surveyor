"use strict";
Object.defineProperty(exports, "__esModule", {value : true});

exports.page;

const app = require('application');
function onLoaded(args, idName) {
  exports.page = args.object;
  exports.cameraView = exports.page.getViewById(idName);
}
exports.onLoaded = onLoaded;
