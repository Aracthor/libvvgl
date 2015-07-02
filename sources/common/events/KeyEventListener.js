/**
 * @class
 * @classdesc Handle a key event.
 * @see {@link VVGL.EventsHandler}
 * @param {function} onEvent Function to call on event.
 */
VVGL.KeyEventListener = function (onEvent) {
	this.onEvent = onEvent;
};

/**
 * Called on matching key event.
 * 
 * @param {VVGL.EventsHandler} data Object that was listening.
 */
VVGL.KeyEventListener.prototype.onEvent = function (data) {
	throw new VVGL.ImplementationException(this, "onEvent", "KeyEventListener");
};
