/**
 * Inherit from this class allow to listen input events.
 * 
 * @abstract
 * @class
 * @classdesc May react to input events like keyboard, mouse etc.
 */
VVGL.EventsHandler = function (manager) {
    this.keyListeners = [];
    this.keyPressListeners = [];
    this.keyReleaseListeners = [];
    this.buttonListeners = [];
    this.buttonPressListeners = [];
    this.buttonReleaseListeners = [];
    this.mouseMovementListener = null;
    this.wheelMovementListener = null;

	if (!manager) {
		var manager = VVGL.Application.instance.eventsManager;
	}
	
	manager.addHandler(this);
};

/**
 * Add event listener to each frame during key is pressed.
 * 
 * @param {VVGL.KeyCode} key
 * @param {VVGL.KeyEventListener} listener
 */
VVGL.EventsHandler.prototype.addKeyListener = function (key, listener) {
	this.keyListeners[key] = listener;
};

/**
 * Add event listener to each time key start is pressed.
 * 
 * @param {VVGL.KeyCode} key
 * @param {VVGL.KeyEventListener} listener
 */
VVGL.EventsHandler.prototype.addKeyPressListener = function (key, listener) {
	this.keyPressListeners[key] = listener;
};

/**
 * Add event listener to each time key is released.
 * 
 * @param {VVGL.KeyCode} key
 * @param {VVGL.KeyEventListener} listener
 */
VVGL.EventsHandler.prototype.addKeyReleaseListener = function (key, listener) {
	this.keyReleaseListeners[key] = listener;
};

/**
 * Add event listener to each frame during button is pressed.
 *
 * @param {VVGL.MouseButton} button
 * @param {VVGL.MouseButtonEventListener} listener

 */
VVGL.EventsHandler.prototype.addMouseButtonListener = function (button, listener) {
    this.buttonListeners[button] = listener;
};

/**
 * Add event listener to each time button is pressed.
 *
 * @param {VVGL.MouseButton} button
 * @param {VVGL.MouseButtonEventListener} listener

 */
VVGL.EventsHandler.prototype.addMouseButtonPressListener = function (button, listener) {
    this.buttonPressListeners[button] = listener;
};

/**
 * Add event listener to each time button is released.
 *
 * @param {VVGL.MouseButton} button
 * @param {VVGL.MouseButtonEventListener} listener

 */
VVGL.EventsHandler.prototype.addMouseButtonReleaseListener = function (button, listener) {
    this.buttonReleaseListeners[button] = listener;
};

/**
 * Add mouse movement listener.
 * 
 * @param {VVGL.MouseMovementListener} listener
 */
VVGL.EventsHandler.prototype.addMouseMovementListener = function (listener) {
	this.mouseMovementListener = listener;	
};

/**
 * Add wheel movement listener.
 *
 * @param {VVGL.WheelMovementListener} listener
 */
VVGL.EventsHandler.prototype.addWheelMovementListener = function (listener) {
    this.wheelMovementListener = listener;
};


/**
 * Used to search a specific key listener, and execute it if exists.
 *
 * @private
 * @param {Array} listeners
 * @param {VVGL.KeyCode} keyCode
 */
VVGL.EventsHandler.prototype.onKeyEvent = function (listeners, keyCode) {
    var listener = listeners[keyCode];

    if (listener) {
        listener.onEvent(this);
    };
};

/**
 * Used to search a specific button listener, and execute it if exists.
 *
 * @private
 * @param {Array} listeners
 * @param {VVGL.MouseButton} button
 * @param {number} x X mouse position
 * @param {number} y Y mouse position
 */
VVGL.EventsHandler.prototype.onButtonEvent = function (listeners, button, x, y) {
    var listener = listeners[button];

    if (listener) {
        listener.onEvent(this, x, y);
    };
};

/**
 * Called by {VVGL.EventsManager} on frame where key is pressed.
 *
 * @param {VVGL.KeyCode} keyCode
 */
VVGL.EventsHandler.prototype.onKey = function (keyCode) {
	this.onKeyEvent(this.keyListeners, keyCode);
};

/**
 * Called by {VVGL.EventsManager} on key pressure.
 *
 * @param {VVGL.KeyCode} keyCode
 */
VVGL.EventsHandler.prototype.onKeyPress = function (keyCode) {
	this.onKeyEvent(this.keyPressListeners, keyCode);
};

/**
 * Called by {VVGL.EventsManager} on key release.
 *
 * @param {VVGL.KeyCode} keyCode
 */
VVGL.EventsHandler.prototype.onKeyRelease = function (keyCode) {
	this.onKeyEvent(this.keyReleaseListeners, keyCode);
};

/**
 * Called by {VVGL.EventsManager} on frame where button is pressed.
 *
 * @param {VVGL.MouseButton} button
 * @param {number} x
 * @param {number} y
 */
VVGL.EventsHandler.prototype.onButton = function (button, x, y) {
    this.onButtonEvent(this.buttonListeners, button, x, y);
};

/**
 * Called by {VVGL.EventsManager} on mouse button pressure.
 *
 * @param {VVGL.MouseButton} button
 * @param {number} x
 * @param {number} y
 */
VVGL.EventsHandler.prototype.onButtonPress = function (button, x, y) {
    this.onButtonEvent(this.buttonPressListeners, button, x, y);
};

/**
 * Called by {VVGL.EventsManager} on mouse button release.
 *
 * @param {VVGL.MouseButton} button
 * @param {number} x
 * @param {number} y
 */
VVGL.EventsHandler.prototype.onButtonRelease = function (button, x, y) {
    this.onButtonEvent(this.buttonReleaseListeners, button, x, y);
};

/**
 * Called by {VVGL.EventsManager} on mouse movement.
 * Call its own mouseMovementListener.
 * 
 * @param {number} x X movement.
 * @param {number} y Y movement.
 */
VVGL.EventsHandler.prototype.onMouseMovement = function (x, y) {
	if (this.mouseMovementListener !== null) {
		this.mouseMovementListener.onEvent(this, x, y);
	}
};

/**
 * Called by {VVGL.EventsManager} on mouse movement.
 * Call its own wheelMovementListener.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} deltaX
 * @param {number} deltaY
 * @param {number} deltaZ
 */
VVGL.EventsHandler.prototype.onWheelMovement = function (x, y, deltaX, deltaY, deltaZ) {
    if (this.wheelMovementListener !== null) {
        this.wheelMovementListener.onEvent(this, x, y, deltaX, deltaY, deltaZ);
    }
};
