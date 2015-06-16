/**
 * @class
 * @classdesc Handle a wheel movement.
 * @param {function} onEvent Function to call on event.
 */
VVGL.WheelMovementListener = function (onEvent) {
    this.onEvent = onEvent;
};

/**
 * Called on wheel movement.
 *
 * @param {VVGL.EventsHandler} data Object that was listening.
 * @param {number} x X movement.
 * @param {number} y Y movement.
 * @param {number} deltaX horizontal scrolling.
 * @param {number} deltaY vertical scrolling.
 * @param {number} deltaZ I have no idea.
 * @todo Understand what a hell could be deltaZ
 */
VVGL.WheelMovementListener.prototype.onEvent = function (data, x, y, deltaX, deltaY, deltaZ) {
    throw new VVGL.ImplementationException(this, "onEvent", "WheelMovementListener");
};
