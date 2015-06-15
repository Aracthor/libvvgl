/**
 * @class
 * @classdesc Handle a mouse movement.
 * @param {function} onEvent Function to call on event.
 */
VVGL.MouseMovementListener = function (onEvent) {
	this.onEvent = onEvent;
};

/**
 * Called on mouse movement.
 * 
 * @param {VVGL.EventsHandler} data Object that was listening.
 * @param {number} x X movement.
 * @param {number} y Y movement.
 */
VVGL.MouseMovementListener.prototype.onEvent = function (data, x, y) {
	throw new VVGL.ImplementationException(this, "onEvent", "MouseMovementListener");
};
