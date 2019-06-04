'use strict';

/**
 * rafu - requestAnimationFrame utils
 * @license MIT
 */

var raf = (function(win) {
  return (
    win.requestAnimationFrame ||
    win.webkitRequestAnimationFrame ||
    win.mozRequestAnimationFrame ||
    win.oRequestAnimationFrame ||
    win.msRequestAnimationFrame ||
    null
  );
})(typeof window === 'undefined' ? {} : window);

var cancelRaf = (function(win) {
  return (
    win.cancelAnimationFrame ||
    win.webkitCancelAnimationFrame ||
    win.mozCancelAnimationFrame ||
    win.oCancelAnimationFrame ||
    win.msCancelAnimationFrame ||
    null
  );
})(typeof window === 'undefined' ? {} : window);

/**
 * rafu.frame - basic animation frame request method
 * @param {Function} callback
 * @return {Number} requestAnimationFrame or setTimeout id for cancelling
 */
var frame = exports.frame = (function(win) {
  // Check that both are supported, so that the identifier for `cancel` will be consistent
  if (raf && cancelRaf) {
    return raf.bind(win);
  }
  return function (callback) {
    return setTimeout(callback, 16);
  };
}(typeof window === 'undefined' ? {} : window));

/**
 * rafu.cancelFrame - cancels a frame via id returned by rafu.frame
 * @param {Number} requestAnimationFrame or setTimeout id for cancelling
 */
var cancelFrame = exports.cancelFrame = (function(win) {
  if (raf && cancelRaf) {
    return cancelRaf.bind(win);
  }
  return function (timeoutId) {
    return win.clearTimeout(timeoutId);
  };
}(typeof window === 'undefined' ? {} : window));

/**
 * rafu.throttle - returns a function, that, when invoked, will only be triggered
 * once every browser animation frame
 * @param {Function} func  Funciton to wrap
 * @return {Function} throttled func with cancel property added  
 */
exports.throttle = function(func) {
  var wait;
  var args;
  var context;
  var rafOrTimeoutId;

  var throttled = function() {
    args = arguments;
    if (wait) return;
    wait = true;
    context = this;
    rafOrTimeoutId = frame(function() {
      wait = false;
      func.apply(context, args);
    });
  };

  throttled.cancel = function() {
    cancelFrame(rafOrTimeoutId);
  };

  return throttled;
};
