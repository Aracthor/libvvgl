/**
 * @class
 * @classdesc Handle a mouse button event.
 * @see {@link VVGL.EventsHandler}
 * @param {function} onEvent Function to call on event.
 */
VVGL.MouseButtonEventListener = function (onEvent) {
    this.onEvent = onEvent;
};

/**
 * Called on matching mouse button event.
 *
 * @param {VVGL.EventsHandler} data Object that was listening.
 */
VVGL.MouseButtonEventListener.prototype.onEvent = function (data, x, y) {
    this.onEvent(data, x, y);
};
