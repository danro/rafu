'use strict';

/**
 * rafu - requestAnimationFrame utils
 * @license MIT
 */

/**
 * rafu.frame - basic animation frame request method
 * @param {Function} callback
 */
var frame = exports.frame = (function(win) {
  var raf = win.requestAnimationFrame ||
    win.webkitRequestAnimationFrame ||
    win.mozRequestAnimationFrame ||
    win.oRequestAnimationFrame ||
    win.msRequestAnimationFrame;
  if (raf) return raf.bind(win);
  return function (callback) {
    win.setTimeout(callback, 16);
  };
}(window));

/**
 * rafu.throttle - returns a function, that, when invoked, will only be triggered
 * once every browser animation frame
 * @param {Function} func  Funciton to wrap
 * @return {Funciton}
 */
exports.throttle = function(func) {
  var wait;
  var args;
  var context;

  return function() {
    args = arguments;
    if (wait) return;
    wait = true;
    context = this;
    frame(function() {
      wait = false;
      func.apply(context, args);
    });
  };
};
