/**
 * vvgl library namespace.
 *
 * @namespace VVGL
 */
VVGL = {};

/**
 * @private
 */
gl = null;
/**
 * KeyCode used by event listeners.
 * 
 * @enum {number}
 */
VVGL.KeyCode = {
	BACKSPACE:	0x08,
	TAB:		0x09,
	ENTER:		0x0D,
	SHIFT:		0x10,
	CTRL:		0x11,
	ALT:		0x12,
	PAUSE:		0x13,
	CAPS_LOCK:	0x14,
	ESCAPE:		0x1B,
	SPACE:		0x20,
	
	LEFT_ARROW:	0x25,
	UP_ARROW:	0x26,
	RIGHT_ARROW:0x27,
	DOWN_ARROW:	0x28,
	
	A:			0x41,
	B:			0x42,
	C:			0x43,
	D:			0x44,
	E:			0x45,
	F:			0x46,
	G:			0x47,
	H:			0x48,
	I:			0x49,
	J:			0x4A,
	K:			0x4B,
	L:			0x4C,
	M:			0x4D,
	N:			0x4E,
	O:			0x4F,
	P:			0x50,
	Q:			0x51,
	R:			0x52,
	S:			0x53,
	T:			0x54,
	U:			0x55,
	V:			0x56,
	W:			0x57,
	X:			0x58,
	Y:			0x59,
	Z:			0x5A,
	
	F1:			0x70,
	F2:			0x71,
	F3:			0x72,
	F4:			0x73,
	F5:			0x74,
	F6:			0x75,
	F7:			0x76,
	F8:			0x77,
	F9:			0x78,
	F10:		0x79,
	F11:		0x7A,
	F12:		0x7B,
	MAX:		0x7C
};
/**
 * MouseButton used by event listeners.
 * 
 * @enum {number}
 */
VVGL.MouseButton = {
	LEFT:	0,
	MIDDLE:	1,
	RIGHT:	2,
	MAX: 	3
};
/**
 * Create event manager for canvas.
 * 
 * @private
 * @class
 * @classdesc Manage input events, calling listeners.
 * @param {HTMLElement} canvas
 */
VVGL.EventsManager = function (canvas) {
	this.eventsHandlers = [];
	
	this.canvas = canvas;
	this.mouseLocked = false;
	this.wantMouseLocked = false;
	canvas.requestPointerLock = canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
	
	var me = this;
	
	// Keyboard events
	document.addEventListener("keydown", function (event) {me.onKeyDown(event.keyCode); }, false);
	document.addEventListener("keyup", function (event) {me.onKeyUp(event.keyCode);}, false);

	// Mouse events
	canvas.addEventListener("mousemove", function (event) {me.onMouseMove(event);}, false);
	canvas.addEventListener("mousedown", function (event) {me.onMouseDown(event);}, false);
	canvas.addEventListener("mouseup", function (event) {me.onMouseUp(event);}, false);
    canvas.addEventListener("wheel", function (event) {me.onWheel(event);}, false);

    // Forbid context menu on right-click
    canvas.addEventListener("contextmenu", function (event) {event.preventDefault(); }, false);
	
	// Lock events
	document.addEventListener('pointerlockerror', me.onLockError, false);
	document.addEventListener('mozpointerlockerror', me.onLockError, false);
	document.addEventListener('webkitpointerlockerror', me.onLockError, false);
};

/**
 * Prevent default keys actions (Reload for F5, quit on Ctrl+Q or Ctrl+W, etc)
 */
VVGL.EventsManager.prototype.preventKeyActions = function () {
    document.addEventListener("keydown", function (event) {event.preventDefault(); }, false);
    document.addEventListener("keyup", function (event) {event.preventDefault(); }, false);
};

/**
 * Add listener to listeners list.
 * 
 * @param {VVGL.EventsHandler} handler
 */
VVGL.EventsManager.prototype.addHandler = function (handler) {
	this.eventsHandlers.push(handler);
};

/**
 * Called on any key release.
 * 
 * @private
 * @param {VVGL.KeyCode} keyCode
 */
VVGL.EventsManager.prototype.onKeyDown = function (keyCode) {
	if (!VVGL.Keyboard.keyIsPressed(keyCode)) {
		VVGL.Keyboard.pressKey(keyCode);
	}
	
	for (var i in this.eventsHandlers) {
		this.eventsHandlers[i].onKeyPress(keyCode);
	}
};

/**
 * Called on any key pression.
 * 
 * @private
 * @param {VVGL.KeyCode} keyCode
 */
VVGL.EventsManager.prototype.onKeyUp = function (keyCode) {
	VVGL.Keyboard.releaseKey(keyCode);
	
	for (var i in this.eventsHandlers) {
		this.eventsHandlers[i].onKeyRelease(keyCode);
	}
};

/**
 * Called on mouse movement.
 * 
 * @private
 * @param {Object} event New mouse position.
 */
VVGL.EventsManager.prototype.onMouseMove = function (event) {
	var x = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
	var y = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
	
	for (var i in this.eventsHandlers) {
		this.eventsHandlers[i].onMouseMovement(-x, -y);
	}
};

/**
 * Called on mouse click.
 * 
 * @private
 * @param {Object} event Click details.
 */
VVGL.EventsManager.prototype.onMouseDown = function (event) {
	if (!VVGL.Mouse.buttonIsPressed(event.button)) {
		VVGL.Mouse.pressButton(event.button);
	}
	
	if (this.wantMouseLocked && !this.mouseLocked) {
		this.canvas.requestPointerLock();
		this.mouseLocked = true;
		VVGL.Mouse.isLocked = true;
	}

    for (var i in this.eventsHandlers) {
        this.eventsHandlers[i].onButtonPress(event.button, event.clientX, event.clientY);
    }
};

/**
 * Called on mouse release.
 * 
 * @private
 * @param {Object} event Click details.
 */
VVGL.EventsManager.prototype.onMouseUp = function (event) {
	VVGL.Mouse.releaseButton(event.button);

    for (var i in this.eventsHandlers) {
        this.eventsHandlers[i].onButtonRelease(event.button, event.clientX, event.clientY);
    }
};

/**
 * Called on mouse wheel.
 *
 * @private
 * @param {Object} event Wheel movement details.
 * @todo handle firefox different values for delta.
 */
VVGL.EventsManager.prototype.onWheel = function (event) {
    for (var i in this.eventsHandlers) {
        this.eventsHandlers[i].onWheelMovement(event.clientX, event.clientY, event.deltaX, event.deltaY, event.deltaZ);
    }
};

/**
 * Called on mouse lock error.
 */
VVGL.EventsManager.prototype.onLockError = function () {
	alert("Couldn't lock mouse pointer.");
};

/**
 * Call key handlers for keys actually pressed.
 */
VVGL.EventsManager.prototype.callKeyListeners = function () {
	for (var i in VVGL.Keyboard.keysActuallyPressed) {
		for (var j in this.eventsHandlers) {
			this.eventsHandlers[j].onKey(VVGL.Keyboard.keysActuallyPressed[i]);
		}
	}
};

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
/**
 * Static object regrouping keyboard functions.
 * 
 * @class
 */
VVGL.Keyboard = {};

VVGL.Keyboard.keysActuallyPressed = new Array(VVGL.KeyCode.MAX);


/**
 * To know if a key is actually pressed.
 * 
 * @static
 * @param {VVGL.KeyCode} key
 * @return {boolean}
 */
VVGL.Keyboard.keyIsPressed = function (key) {
	return (this.keysActuallyPressed.indexOf(key) !== -1);
};

/**
 * Add key from pressed list.
 * 
 * @private
 * @static
 * @param {VVGL.KeyCode} key
 */
VVGL.Keyboard.pressKey = function (key) {
	this.keysActuallyPressed.push(key);
};

/**
 * Remove key from pressed list.
 * 
 * @private
 * @static
 * @param {VVGL.KeyCode} key
 */
VVGL.Keyboard.releaseKey = function (key) {
	this.keysActuallyPressed.splice(this.keysActuallyPressed.indexOf(key), 1);
};
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
/**
 * Static object regrouping mouse functions.
 * 
 * @class
 */
VVGL.Mouse = {};

VVGL.Mouse.buttonsActuallyPressed = new Array(VVGL.MouseButton.MAX);


/**
 * To know if a mouse button is actually pressed.
 * 
 * @static
 * @param {VVGL.MouseButton} button
 * @return {boolean}
 */
VVGL.Mouse.buttonIsPressed = function (button) {
	return (this.buttonsActuallyPressed.indexOf(button) !== -1);
};

/**
 * To know if the mouse cursor is locked.
 * 
 * @type {boolean}
 * @static
 * @readonly
 */
VVGL.Mouse.isLocked = false;

/**
 * Add button from pressed list.
 * 
 * @private
 * @static
 * @param {VVGL.MouseButton} button
 */
VVGL.Mouse.pressButton = function (button) {
	this.buttonsActuallyPressed.push(button);
};

/**
 * Remove button from pressed list.
 * 
 * @private
 * @static
 * @param {VVGL.MouseButton} button
 */
VVGL.Mouse.releaseButton = function (button) {
	this.buttonsActuallyPressed.splice(this.buttonsActuallyPressed.indexOf(button), 1);
};
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
/**
 * Super singleton manager of canvas, graphic and physic engine.
 * This class has to be instanciate only once in your program.
 * You can then access your instance with {@link VVGL.Application.access}
 * 
 * @class
 * @classdesc Super singleton manager of canvas, graphic and physic engine.
 * @extends VVGL.EventsHandler
 * @param {string} canvasId Id of your HTML canvas.
 */
VVGL.Application = function (canvasId) {
	VVGL.Application.instance = this;
	this.canvas = document.getElementById(canvasId);

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.initAPI();
};

VVGL.Application.prototype = Object.create(VVGL.EventsHandler.prototype);

/**
 * Initialize other VVGL classes
 *
 * @private
 */
VVGL.Application.prototype.initAPI = function () {
	this.eventsManager = new VVGL.EventsManager(this.canvas);
	this.sceneManager = new VVGL.SceneManager();
	VVGL.EventsHandler.call(this, this.eventsManager);
	this.clock = new VVGL.Clock();
};

/**
 * Resize canvas resolution to specific width and height.
 *
 * @param {number} width
 * @param {number} height
 */
VVGL.Application.prototype.resize = function (width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
};

/**
 * Start the application loop.
 */
VVGL.Application.prototype.start = function () {
	this.running = true;
	
	try {
    	VVGL.Application.loop();
	} catch (exception) {
		this.running = false;
		throw exception;
	}
};

/**
 * Manage all application data.
 * 
 * @private
 */
VVGL.Application.prototype.manageData = function () {
	this.elapsedTime = this.clock.reset();
	this.sceneManager.getCurrentScene().getRoot().update(this.elapsedTime);
};

/**
 * Draw scene.
 * 
 * @private
 */
VVGL.Application.prototype.manageDisplay = function () {
	this.renderer.prepareFrame();
	this.renderer.drawScene(this.sceneManager.getCurrentScene());
};

/**
 * Manage all input events.
 * 
 * @private
 */
VVGL.Application.prototype.manageEvents = function () {
	this.eventsManager.callKeyListeners();
};

/**
 * Get application scene manager.
 * 
 * @return {VVGL.SceneManager} Application scene manager.
 */
VVGL.Application.prototype.getSceneManager = function () {
	return (this.sceneManager);
};
/**
 * Lock mouse pointer once user will have clicked.
 */
VVGL.Application.prototype.lockPointer = function () {
	this.eventsManager.wantMouseLocked = true;
};

/**
 * Disable mouse lock.
 * 
 * @todo unlock pointer for real.
 */
VVGL.Application.prototype.unlockPointer = function () {
	this.eventsManager.wantMouseLocked = false;
};

/**
 * Prevent default keys actions (Reload for F5, quit on Ctrl+Q or Ctrl+W, etc)
 */
VVGL.Application.prototype.preventKeyActions = function () {
    this.eventsManager.preventKeyActions();
};

/**
 * Window will reload on F5.
 */
VVGL.Application.prototype.acceptReload = function () {
	var listener = new VVGL.KeyEventListener(function () {
		window.location.reload(false);
	});
	this.addKeyPressListener(VVGL.KeyCode.F5, listener);
};


/**
 * Static instance of the application.
 *
 * @private
 * @static
 * @type {VVGL.Application}
 */
VVGL.Application.instance = null;

/**
 * Access application instance
 *
 * @static
 * @return {VVGL.Application}
 */
VVGL.Application.access = function () {
    return (VVGL.Application.instance);
};

/**
 * Recursive loop function called by {@see VVGL.Application.prototype.start}.
 * 
 * @private
 */
VVGL.Application.loop = function () {
	var app = VVGL.Application.instance;
	
	if (app.running) {
		window.requestAnimationFrame(VVGL.Application.loop);
		app.manageEvents();
		app.manageData();
		app.manageDisplay();
	}
};

/**
 * Allow multi-inheritance.
 * Return a prototype that concatenate both arguments.
 * 
 * @param {Object.prototype} prototype1
 * @param {Object.prototype} prototype2
 * @return {Object.prototype} Fusion of both.
 */
VVGL.fusionClasses = function (prototype1, prototype2) {
	var fusion = {};
	var property;
	
	for (property in prototype1) {
		if (prototype1.hasOwnProperty(property)) {
			fusion[property] = prototype1[property];
		}
	}
	
	for (property in prototype2) {
		if (prototype2.hasOwnProperty(property)) {
			if (prototype1.hasOwnProperty(property)) {
				throw new VVGL.Exception("FUSION ERROR: " + property + " present in two classes !");
			}
			fusion[property] = prototype2[property];
		}
	}
	
	return (fusion);
};
/**
 * Create color from arguments, or black color if none.
 *
 * @class
 * @classdesc Functions for color-number manipulation.
 * @param {number} [r=0] Red value (between 0 and 1)
 * @param {number} [g=0] Green value (between 0 and 1)
 * @param {number} [b=0] Blue value (between 0 and 1)
 * @param {number} [a=1] Alpha value (between 0 and 1)
 */
VVGL.Color = function (r, g, b, a) {
    this.r = r ? r : 0.0;
    this.g = g ? g : 0.0;
    this.b = b ? b : 0.0;
    this.a = a !== undefined ? a : 1.0;
};

/**
 * Red color data
 * 
 * @type {number}
 */
VVGL.Color.prototype.r = 0.0;

/**
 * Green color data
 * 
 * @type {number}
 */
VVGL.Color.prototype.g = 0.0;

/**
 * Blue color data
 * 
 * @type {number}
 */
VVGL.Color.prototype.b = 0.0;

/**
 * Alpha (transparency) color data
 * 
 * @type {number}
 */
VVGL.Color.prototype.a = 1.0;

/**
 * Replace color data by a new one.
 * 
 * @param {number} number New data.
 */
VVGL.Color.prototype.setFromInteger = function (number) {
	this.r = (number & 0xFF000000) >> 24;
	this.g = (number & 0x00FF0000) >> 16;
	this.b = (number & 0x0000FF00) >> 8;
	this.a = (number & 0x000000FF) >> 0;
};

/**
 * Replace color data by a new one.
 * Each param must be between 0x00 and 0xFF.
 * 
 * @param {number} r Red value.
 * @param {number} g Green value.
 * @param {number} b Blue value.
 * @param {number} a Alpha value.
 */
VVGL.Color.prototype.setFromIntNumbers = function (r, g, b, a) {
	a = a !== undefined ? a : 0xFF;
	this.setFromInteger((r << 24) + (g << 16) + (b << 8) + a);
};

/**
 * Replace color data by a new one.
 * Each param must be between 0.0 and 1.0.
 * 
 * @param {number} r Red value.
 * @param {number} g Green value.
 * @param {number} b Blue value.
 * @param {number} a Alpha value.
 */
VVGL.Color.prototype.setFromFloatNumbers = function (r, g, b, a) {
	a = a !== undefined ? a : 1.0;
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
};

/**
 * Return a copy of the instance.
 * 
 * @return {VVGL.Color} Copy of the instance.
 */
VVGL.Color.prototype.clone = function () {
	var copy = new VVGL.Color();
	
	copy.setFromFloatNumbers(this.r, this.g, this.b, this.a);
	
	return (copy);
};


/**
 * Black color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.black = new VVGL.Color(0, 0, 0);

/**
 * Red color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.red = new VVGL.Color(1, 0, 0);

/**
 * Green color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.green = new VVGL.Color(0, 1, 0);

/**
 * Blue color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.blue = new VVGL.Color(0, 0, 1);

/**
 * Yellow color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.yellow = new VVGL.Color(1, 1, 0);

/**
 * Magenta color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.magenta = new VVGL.Color(1, 0, 1);

/**
 * Cyan color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.cyan = new VVGL.Color(0, 1, 1);

/**
 * White color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.white = new VVGL.Color(1, 1, 1);

/**
 * Convert color to hexa string format.
 *
 * @return {string}
 */
VVGL.Color.prototype.toString = function () {
    var colors = [this.r, this.g, this.b];
    var string = "#";

    for (var i in colors) {
        var color = colors[i] * 0x100;
        var elem = color.toString(16);
        if (elem.length === 1) {
            elem = "0" + elem;
        }
        string += elem;
    }

    return (string);
};
/**
 * Create an exception with associated message.
 * The second argument should not be used, except from another exception constructor.
 *
 * @class
 * @classdesc Exception base for all exception classes.
 * @param {string} message
 * @param {string} [name="Error"]
 */
VVGL.Exception = function (message, name) {
	Error.prototype.call(this);
	this.name = name ? name : "Error"
	this.message = message;
};

VVGL.Exception.prototype = Object.create(Error.prototype);

/**
 * Exception custom message.
 *
 * @type {string}
 */
VVGL.Exception.prototype.message = "";

/**
 * Convert Exception to a {string}.
 * 
 * @return {string} Exception details.
 */
VVGL.Exception.prototype.toString = function () {
	return (this.name + ": " + this.message);
};
/**
 * Exception throwed on abstract function use.
 * 
 * @class
 * @extends {VVGL.Exception}
 * @param {Object} object Abstract instance responsable (usually called as this).
 * @param {string} functionName Name of the missing function.
 * @param {string} className Name of the abstract class.
 */
VVGL.ImplementationException = function (linkedObject, functionName, className) {
	VVGL.Exception.call(this, "Missing implementation of " + functionName + " in object " + className + ".", "MissingImplementationError");
	this.linkedObject = linkedObject;
};

VVGL.ImplementationException.prototype = Object.create(VVGL.Exception.prototype);

/**
 * Print error message.
 * 
 * @override
 * @return {string} Error message
 */
VVGL.ImplementationException.prototype.toString = function () {
	console.log("Missing implementation object:");
	console.log(this.linkedObject);
	return (VVGL.Exception.prototype.what.call(this));
};
/**
 * Created as an identity matrix.
 * 
 * @class
 * @classdesc A 3x3 float matrix.
 */
VVGL.Mat3 = function () {
	this.data = new Float32Array(3 * 3);
	
	this.identity();
};

/**
 * Set a Mat3 to the identity matrix.
 */
VVGL.Mat3.prototype.identity = function () {
	var data = this.data;
	
	data[0] = 1; data[1] = 0; data[2] = 0;
	data[3] = 0; data[4] = 1; data[5] = 0;
	data[6] = 0; data[7] = 0; data[8] = 1;
};

/**
 * Copy matrix data to another preallocated matrix object.
 * 
 * @param {VVGL.Mat3} destination
 */
VVGL.Mat3.prototype.copyTo = function (destination) {
	for (var i = 0; i < 9; ++i) {
		destination.data[i] = this.data[i];
	}
};

/**
 * Return a copy of this matrix.
 * 
 * @return {VVGL.Mat3} Copy.
 */
VVGL.Mat3.prototype.clone = function () {
	var clone = new VVGL.Mat3();
	
	this.copyTo(clone);
	
	return (clone);
};

/**
 * Copy 4x4 matrix content to 3x3 matrix.
 * 
 * @param {VVGL.Mat4} matrix
 */
VVGL.Mat3.prototype.fromMat4 = function (matrix) {
	var dest = this.data;
	var src = matrix.data;
	
	dest[0] = src[ 0];
	dest[1] = src[ 1];
	dest[2] = src[ 2];
	dest[3] = src[ 4];
	dest[4] = src[ 5];
	dest[5] = src[ 6];
	dest[6] = src[ 8];
	dest[7] = src[ 9];
	dest[8] = src[10];
};

/**
 * Convert 4x4 matrix to 3x3 normal matrix.
 * 
 * @param {VVGL.Mat4} matrix Model matrix.
 */
VVGL.Mat3.prototype.normalFromMat4 = function (matrix) {
    var dest = this.data,
    	src = matrix.data,
    	a00 = src[0], a01 = src[1], a02 = src[2], a03 = src[3],
        a10 = src[4], a11 = src[5], a12 = src[6], a13 = src[7],
        a20 = src[8], a21 = src[9], a22 = src[10], a23 = src[11],
        a30 = src[12], a31 = src[13], a32 = src[14], a33 = src[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        delta = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (delta === 0) { 
        throw new VVGL.Exception("MATHS ERROR: Null determinant calculing normal matrix."); 
    }
    delta = 1.0 / delta;

    dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * delta;
    dest[1] = (a12 * b08 - a10 * b11 - a13 * b07) * delta;
    dest[2] = (a10 * b10 - a11 * b08 + a13 * b06) * delta;

    dest[3] = (a02 * b10 - a01 * b11 - a03 * b09) * delta;
    dest[4] = (a00 * b11 - a02 * b08 + a03 * b07) * delta;
    dest[5] = (a01 * b08 - a00 * b10 - a03 * b06) * delta;

    dest[6] = (a31 * b05 - a32 * b04 + a33 * b03) * delta;
    dest[7] = (a32 * b02 - a30 * b05 - a33 * b01) * delta;
    dest[8] = (a30 * b04 - a31 * b02 + a33 * b00) * delta;
};

/**
 * Transpose matrix data.
 * (Vertical become horizontal).
 */
VVGL.Mat3.prototype.transpose = function () {
	var data = this.data,
		data01 = data[1],
		data02 = data[2],
		data12 = data[5];
		
	data[1] = data[3];
	data[2] = data[6];
	data[3] = data01;
	data[5] = data[7];
	data[6] = data02;
	data[7] = data12;
};

/**
 * Invert matrix data.
 */
VVGL.Mat3.prototype.invert = function () {
	var data = this.data,
		a00 = data[0], a01 = data[1], a02 = data[2],
        a10 = data[3], a11 = data[4], a12 = data[5],
        a20 = data[6], a21 = data[7], a22 = data[8],
        
        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,
        
        delta = a00 * b01 + a01 * b11 + a02 * b21;
        
    if (delta === 0) {
    	throw new VVGL.Exception("MATHS ERROR: Error inversing Mat3: null deteminent");
    }
    
    delta = 1.0 / delta;
    
    data[0] = b01 * delta;
    data[1] = (-a22 * a01 + a02 * a21) * delta;
    data[2] = (a12 * a01 - a02 * a11) * delta;
    data[3] = b11 * delta;
    data[4] = (a22 * a00 - a02 * a20) * delta;
    data[5] = (-a12 * a00 + a02 * a10) * delta;
    data[6] = b21 * delta;
    data[7] = (-a21 * a00 + a01 * a20) * delta;
    data[8] = (a11 * a00 - a01 * a10) * delta;
};

/**
 * Return matrix data as float array.
 * 
 * @return {Array} data as float array.
 */
VVGL.Mat3.prototype.toArray = function () {
	return (this.data);
};

/**
 * Convert matrix data to a readable string.
 * 
 * @return {string}
 */
VVGL.Mat3.prototype.toString = function () {
	var data = this.data;
	
	return ("(" + data[0] + "," + data[1] + "," + data[2] + ")\n" +
			"(" + data[3] + "," + data[4] + "," + data[5] + ")\n" +
			"(" + data[6] + "," + data[7] + "," + data[8] + ")\n");
};
/**
 * Created as an identity matrix.
 * 
 * @class
 * @classdesc A 4x4 float matrix.
 */
VVGL.Mat4 = function () {
	this.data = new Float32Array(4 * 4);
	
	this.identity();
};

/**
 * Set a Mat4 to the identity matrix.
 */
VVGL.Mat4.prototype.identity = function () {
	var data = this.data;
	
	data[ 0] = 1; data[ 1] = 0; data[ 2] = 0; data[ 3] = 0;
	data[ 4] = 0; data[ 5] = 1; data[ 6] = 0; data[ 7] = 0;
	data[ 8] = 0; data[ 9] = 0; data[10] = 1; data[11] = 0;
	data[12] = 0; data[13] = 0; data[14] = 0; data[15] = 1;
};

/**
 * Translate by a 3D-vector.
 * 
 * @param {VVGL.Vec3} vector Translation vector.
 */
VVGL.Mat4.prototype.translate = function (vector) {
    var x = vector.x,
    	y = vector.y,
    	z = vector.z,
    	data = this.data;

    data[12] = data[0] * x + data[4] * y + data[8] * z + data[12];
    data[13] = data[1] * x + data[5] * y + data[9] * z + data[13];
    data[14] = data[2] * x + data[6] * y + data[10] * z + data[14];
    data[15] = data[3] * x + data[7] * y + data[11] * z + data[15];
};

/**
 * Rotate on X axis by an angle.
 * 
 * @param {number} angle Angle in radians.
 * @todo precalc angles.
 */
VVGL.Mat4.prototype.rotateX = function (angle) {
	var sinus = Math.sin(angle),
		cosinus = Math.cos(angle),
		data = this.data,
        a10 = data[4],
        a11 = data[5],
        a12 = data[6],
        a13 = data[7],
        a20 = data[8],
        a21 = data[9],
        a22 = data[10],
        a23 = data[11];

    data[4] = a10 * cosinus + a20 * sinus;
    data[5] = a11 * cosinus + a21 * sinus;
    data[6] = a12 * cosinus + a22 * sinus;
    data[7] = a13 * cosinus + a23 * sinus;
    data[8] = a20 * cosinus - a10 * sinus;
    data[9] = a21 * cosinus - a11 * sinus;
    data[10] = a22 * cosinus - a12 * sinus;
    data[11] = a23 * cosinus - a13 * sinus;
};

/**
 * Rotate on Y axis by an angle.
 * 
 * @param {number} angle Angle in radians.
 * @todo precalc angles.
 */
VVGL.Mat4.prototype.rotateY = function (angle) {
    var sinus = Math.sin(angle),
        cosinus = Math.cos(angle),
        data = this.data,
        a00 = data[0],
        a01 = data[1],
        a02 = data[2],
        a03 = data[3],
        a20 = data[8],
        a21 = data[9],
        a22 = data[10],
        a23 = data[11];

    data[0] = a00 * cosinus - a20 * sinus;
    data[1] = a01 * cosinus - a21 * sinus;
    data[2] = a02 * cosinus - a22 * sinus;
    data[3] = a03 * cosinus - a23 * sinus;
    data[8] = a00 * sinus + a20 * cosinus;
    data[9] = a01 * sinus + a21 * cosinus;
    data[10] = a02 * sinus + a22 * cosinus;
    data[11] = a03 * sinus + a23 * cosinus;
};

/**
 * Rotate on Z axis by an angle.
 * 
 * @param {number} angle Angle in radians.
 * @todo precalc angles.
 */
VVGL.Mat4.prototype.rotateZ = function (angle) {
    var sinus = Math.sin(angle),
        cosinus = Math.cos(angle),
        data = this.data,
        a00 = data[0],
        a01 = data[1],
        a02 = data[2],
        a03 = data[3],
        a10 = data[4],
        a11 = data[5],
        a12 = data[6],
        a13 = data[7];

    data[0] = a00 * cosinus + a10 * sinus;
    data[1] = a01 * cosinus + a11 * sinus;
    data[2] = a02 * cosinus + a12 * sinus;
    data[3] = a03 * cosinus + a13 * sinus;
    data[4] = a10 * cosinus - a00 * sinus;
    data[5] = a11 * cosinus - a01 * sinus;
    data[6] = a12 * cosinus - a02 * sinus;
    data[7] = a13 * cosinus - a03 * sinus;
};

/**
 * Scale by a vector.
 * 
 * @param {VVGL.Vec3} vector
 */
VVGL.Mat4.prototype.scale = function (vector) {
    var x = vector.x,
    	y = vector.y,
    	z = vector.z,
    	data = this.data;

    data[0] *= x;
    data[1] *= x;
    data[2] *= x;
    data[3] *= x;
    data[4] *= y;
    data[5] *= y;
    data[6] *= y;
    data[7] *= y;
    data[8] *= z;
    data[9] *= z;
    data[10] *= z;
    data[11] *= z;
};

/**
 * Multiply matrix by another.
 * 
 * @param {VVGL.Mat4} matrix
 */
VVGL.Mat4.prototype.multiply = function (matrix) {
    var data = this.data,
    	b = matrix.data,
    	a00 =  data[0], a01 =  data[1], a02 =  data[2], a03 =  data[3],
        a10 =  data[4], a11 =  data[5], a12 =  data[6], a13 =  data[7],
        a20 =  data[8], a21 =  data[9], a22 =  data[10], a23 =  data[11],
        a30 =  data[12], a31 =  data[13], a32 =  data[14], a33 =  data[15];

    // Cache only the current line of the second matrix
    var b0  =  b[0], b1 =  b[1], b2 =  b[2], b3 =  b[3];  
     data[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
     data[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
     data[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
     data[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 =  b[4]; b1 =  b[5]; b2 =  b[6]; b3 =  b[7];
     data[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
     data[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
     data[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
     data[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 =  b[8]; b1 =  b[9]; b2 =  b[10]; b3 =  b[11];
     data[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
     data[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
     data[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
     data[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 =  b[12]; b1 =  b[13]; b2 =  b[14]; b3 =  b[15];
     data[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
     data[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
     data[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
     data[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
};

/**
 * Create a perspective projection matrix.
 * 
 * @param {number} angle Vertical field of view in radians.
 * @param {number} aspectRatio Aspect ratio. Usually viewport width / viewport height.
 * @param {number} min Minimum field of view. Usually Low.
 * @param {number} max Maximum field of view. Usually High.
 */
VVGL.Mat4.prototype.perspective = function (angle, aspectRatio, min, max) {
	var data = this.data;
	var f = 1.0 / Math.tan(aspectRatio / 2);
	var nf = 1.0 / (min - max);
	var mm = min + max;
	
	data[ 0] = f / aspectRatio;
	data[ 1] = 0;
	data[ 2] = 0;
	data[ 3] = 0;
	data[ 4] = 0;
	data[ 5] = f;
	data[ 6] = 0;
	data[ 6] = 0;
	data[ 7] = 0;
	data[ 8] = 0;
	data[ 9] = 0;
	data[10] = mm * nf;
	data[11] = -1;
	data[12] = 0;
	data[13] = 0;
	data[14] = (2 * mm) * nf;
	data[15] = 0;
};

/**
 * Create a view matrix.
 * 
 * @param {VVGL.Vec3} position
 * @param {VVGL.Vec3} target
 * @param {VVGL.Vec3} up
 */
VVGL.Mat4.prototype.lookAt = function (position, target, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        positionx = position.x,
        positiony = position.y,
        positionz = position.z,
        upx = up.x,
        upy = up.y,
        upz = up.z,
        targetx = target.x,
        targety = target.y,
        targetz = target.z;

    if (Math.abs(positionx - targetx) < 0.000001 &&
        Math.abs(positiony - targety) < 0.000001 &&
        Math.abs(positionz - targetz) < 0.000001) {
        throw new VVGL.Exception("LookAt with same position and target.");
    }

    z0 = positionx - targetx;
    z1 = positiony - targety;
    z2 = positionz - targetz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }
    
    var data = this.data;

    data[0] = x0;
    data[1] = y0;
    data[2] = z0;
    data[3] = 0;
    data[4] = x1;
    data[5] = y1;
    data[6] = z1;
    data[7] = 0;
    data[8] = x2;
    data[9] = y2;
    data[10] = z2;
    data[11] = 0;
    data[12] = -(x0 * positionx + x1 * positiony + x2 * positionz);
    data[13] = -(y0 * positionx + y1 * positiony + y2 * positionz);
    data[14] = -(z0 * positionx + z1 * positiony + z2 * positionz);
    data[15] = 1;
};

/**
 * Copy matrix data to another preallocated matrix object.
 * 
 * @param {VVGL.Mat4} destination
 */
VVGL.Mat4.prototype.copyTo = function (destination) {
	for (var i = 0; i < 16; ++i) {
		destination.data[i] = this.data[i];
	}
};

/**
 * Return a copy of this matrix.
 * 
 * @return {VVGL.Mat4} Copy.
 */
VVGL.Mat4.prototype.clone = function () {
	var clone = new VVGL.Mat4();
	
	this.copyTo(clone);
	
	return (clone);
};

/**
 * Return matrix data as float array.
 * 
 * @return {Array} data as float array.
 */
VVGL.Mat4.prototype.toArray = function () {
	return (this.data);
};

/**
 * Convert matrix data to a readable string.
 * 
 * @return {string}
 */
VVGL.Mat4.prototype.toString = function () {
	var data = this.data;
	
	return ("(" + data[0] + "," + data[1] + "," + data[2] + "," + data[3] + ")\n" +
			"(" + data[4] + "," + data[5] + "," + data[6] + "," + data[7] + ")\n" +
			"(" + data[8] + "," + data[9] + "," + data[10] + "," + data[11] + ")\n" +
			"(" + data[12] + "," + data[13] + "," + data[14] + "," + data[15] + ")\n");
};
/**
 * @class
 * @classdesc Maths help functions and numbers.
 */
VVGL.Maths = {};

VVGL.Maths.PI = 3.14159265359;
/**
 * @class
 * @classdesc Random number generator
 * @param {number} [seed] Generation seed
 */
VVGL.Random = function (seed) {
    if (seed === undefined) {
        seed = new Date().getTime();
    }

    this.seed = [
        (seed >> 10) & 0xFFFF,
        seed & 0xFFFF
    ];
    this.mult = [
        0xE66D,
        0xDEEC
    ];

    for (var i = 0; i < 10; ++i) {
        this.randomInt();
    }
};

/**
 * Generate a random 16-bit Integer
 *
 * @return {number} Random number
 */
VVGL.Random.prototype.randomInt = function () {
    var accu = (this.mult[0] * this.seed[0]) & 0xFFFF;
    var temp = accu;

    accu = (accu << 0x10) >>> 0;
    accu += this.mult[0] * this.seed[1] +
            this.mult[1] * this.seed[0];
    this.seed[0] = temp;
    this.seed[1] = accu & 0xFFFF;

    return (this.seed[1]);
};

/**
 * Generate a random float number between 0 and 1.
 *
 * @return {number} Random number
 */
VVGL.Random.prototype.randomFloat = function () {
    return (this.randomInt() / 0xFFFF);
};
/**
 * Create a vector null or from numbers.
 *
 * @class
 * @classdesc A 4-dimensional vector.
 * @param {number} [x=0] X-axis value.
 * @param {number} [y=0] Y-axis value.
 */
VVGL.Vec2 = function (x, y) {
    if (x !== undefined) {
        this.x = x;
        this.y = y;
    }

};

/**
 * X-axis value.
 *
 * @type {number}
 */
VVGL.Vec2.prototype.x = 0.0;

/**
 * Y-axis value.
 *
 * @type {number}
 */
VVGL.Vec2.prototype.y = 0.0;


/**
 * Set new vector values.
 *
 * @param {number} x
 * @param {number} y
 */
VVGL.Vec2.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Add another vector to this one.
 *
 * @param {VVGL.Vec2} vector
 */
VVGL.Vec2.prototype.add = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
};

/**
 * Substract another vector to this one.
 *
 * @param {VVGL.Vec2} vector
 */
VVGL.Vec2.prototype.sub = function (vector) {
    this.x -= vector.x;
    this.y -= vector.y;
};

/**
 * Scale vector by a number.
 *
 * @param {number} n
 */
VVGL.Vec2.prototype.scale = function (n) {
    this.x *= n;
    this.y *= n;
};

/**
 * Copy vector data to another.
 *
 * @param {VVGL.Vec2} vector
 */
VVGL.Vec2.prototype.copyTo = function (vector) {
    vector.x = this.x;
    vector.y = this.y;
};

/**
 * Calc and return vector's norm.
 *
 * @return {number} Vector's norm.
 */
VVGL.Vec2.prototype.getNorm = function () {
    return (Math.sqrt(this.x * this.x + this.y * this.y));
};

/**
 * Normalize vector, making its norm to 1.
 */
VVGL.Vec2.prototype.normalize = function () {
    var norm = this.getNorm();
    this.scale(1 / norm);
};

/**
 * Create copy of this vector.
 *
 * @return {VVGL.Vec2} Copy.
 */
VVGL.Vec2.prototype.clone = function () {
    return (new VVGL.Vec2(this.x, this.y));
};

/**
 * Convert vector to a data array.
 *
 * @return {Array} A float array containing the three vector's values.
 */
VVGL.Vec2.prototype.toArray = function () {
    return ([this.x, this.y]);
};

/**
 * Create a vector null or from numbers.
 * 
 * @class
 * @classdesc A 3-dimensional vector.
 * @param {number} [x=0] X-axis value.
 * @param {number} [y=0] Y-axis value.
 * @param {number} [z=0] Z-axis value.
 */
VVGL.Vec3 = function (x, y, z) {
	if (x !== undefined) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
};

/**
 * X-axis value.
 * 
 * @type {number}
 */
VVGL.Vec3.prototype.x = 0.0;

/**
 * Y-axis value.
 * 
 * @type {number}
 */
VVGL.Vec3.prototype.y = 0.0;

/**
 * Z-axis value.
 * 
 * @type {number}
 */
VVGL.Vec3.prototype.z = 0.0;


/**
 * Set new vector values.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
VVGL.Vec3.prototype.set = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

/**
 * Add another vector to this one.
 * 
 * @param {VVGL.Vec3} vector
 */
VVGL.Vec3.prototype.add = function (vector) {
	this.x += vector.x;
	this.y += vector.y;
	this.z += vector.z;
};

/**
 * subtract another vector to this one.
 * 
 * @param {VVGL.Vec3} vector
 */
VVGL.Vec3.prototype.sub = function (vector) {
	this.x -= vector.x;
	this.y -= vector.y;
	this.z -= vector.z;
};

/**
 * Scale vector by a number.
 * 
 * @param {number} n
 */
VVGL.Vec3.prototype.scale = function (n) {
	this.x *= n;
	this.y *= n;
	this.z *= n;
};

/**
 * Copy vector data to another.
 * 
 * @param {VVGL.Vec3} vector
 */
VVGL.Vec3.prototype.copyTo = function (vector) {
	vector.x = this.x;
	vector.y = this.y;
	vector.z = this.z;
};

/**
 * Calc and return vector's norm.
 * 
 * @return {number} Vector's norm.
 */
VVGL.Vec3.prototype.getNorm = function () {
	return (Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z));
};

/**
 * Normalize vector, making its norm to 1.
 */
VVGL.Vec3.prototype.normalize = function () {
	var norm = this.getNorm();
	this.scale(1 / norm);
};

/**
 * Store cross product between this and parameter.
 * 
 * @param {VVGL.Vec3} vector
 */
VVGL.Vec3.prototype.crossProduct = function (vector) {
	var x, y, z;
	
	x = this.y * vector.z - this.z * vector.y;
	y = this.z * vector.x - this.x * vector.z;
	z = this.x * vector.y - this.y * vector.x;
	
	this.x = x;
	this.y = y;
	this.z = z;
};

/**
 * Create copy of this vector.
 * 
 * @return {VVGL.Vec3} Copy.
 */
VVGL.Vec3.prototype.clone = function () {
	return (new VVGL.Vec3(this.x, this.y, this.z));
};

/**
 * Convert vector to a data array.
 * 
 * @return {Array} A float array containing the three vector's values.
 */
VVGL.Vec3.prototype.toArray = function () {
	return ([this.x, this.y, this.z]);
};

/**
 * Adds two Vectors
 *
 * @static
 * @param {VVGL.Vec3} u
 * @param {VVGL.Vec3} v
 * @return {VVGL.Vec3} addition between them
 */
VVGL.Vec3.add = function (u, v) {
    return (
        new VVGL.Vec3(
            u.x + v.x,
            u.y + v.y,
            u.z + v.z));
};

/**
 * Subtracts two Vectors
 *
 * @static
 * @param {VVGL.Vec3} u
 * @param {VVGL.Vec3} v
 * @return {VVGL.Vec3} subtraction between them
 */
VVGL.Vec3.sub = function (u, v) {
    return (
        new VVGL.Vec3(
            u.x - v.x,
            u.y - v.y,
            u.z - v.z));
};

/**
 * Get center of two vectors
 *
 * @static
 * @param {VVGL.Vec3} u
 * @param {VVGL.Vec3} v
 * @return {VVGL.Vec3} center between them
 */
VVGL.Vec3.center = function (u, v) {
    return (
        new VVGL.Vec3(
            (u.x + v.x) / 2,
            (u.y + v.y) / 2,
            (u.z + v.z) / 2));
}

/**
 * Get distance between two vectors
 *
 * @static
 * @param {VVGL.Vec3} u
 * @param {VVGL.Vec3} v
 * @return {number} distance between them
 */
VVGL.Vec3.distance = function (u, v) {
    return (VVGL.Vec3.sub(u, v).getNorm());
};

/**
 * Return a new vector storing cross product between parameters.
 * 
 * @static
 * @param {VVGL.Vec3} u
 * @param {VVGL.Vec3} v
 * @return {VVGL.Vec3} Cross product.
 */
VVGL.Vec3.crossProduct = function (u, v) {
	return (new VVGL.Vec3(u.y * v.z - u.z * v.y,
						  u.z * v.x - u.x * v.z,
						  u.x * v.y - u.y * v.x));
};
/**
 * Create a vector null or from numbers.
 * 
 * @class
 * @classdesc A 4-dimensional vector.
 * @param {number} [x=0] X-axis value.
 * @param {number} [y=0] Y-axis value.
 * @param {number} [z=0] Z-axis value.
 * @param {number} [w=0] W-axis value.
 */
VVGL.Vec4 = function (x, y, z, w) {
	if (x !== undefined) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
};

/**
 * X-axis value.
 * 
 * @type {number}
 */
VVGL.Vec4.prototype.x = 0.0;

/**
 * Y-axis value.
 * 
 * @type {number}
 */
VVGL.Vec4.prototype.y = 0.0;

/**
 * Z-axis value.
 * 
 * @type {number}
 */
VVGL.Vec4.prototype.z = 0.0;

/**
 * W-axis value.
 * 
 * @type {number}
 */
VVGL.Vec4.prototype.w = 0.0;


/**
 * Set new vector values.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} w
 */
VVGL.Vec3.prototype.set = function (x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
};

/**
 * Add another vector to this one.
 * 
 * @param {VVGL.Vec4} vector
 */
VVGL.Vec4.prototype.add = function (vector) {
	this.x += vector.x;
	this.y += vector.y;
	this.z += vector.z;
	this.w += vector.w;
};

/**
 * Substract another vector to this one.
 * 
 * @param {VVGL.Vec4} vector
 */
VVGL.Vec4.prototype.sub = function (vector) {
	this.x -= vector.x;
	this.y -= vector.y;
	this.z -= vector.z;
	this.w -= vector.w;
};

/**
 * Scale vector by a number.
 * 
 * @param {number} n
 */
VVGL.Vec4.prototype.scale = function (n) {
	this.x *= n;
	this.y *= n;
	this.z *= n;
	this.w *= w;
};

/**
 * Copy vector data to another.
 * 
 * @param {VVGL.Vec4} vector
 */
VVGL.Vec4.prototype.copyTo = function (vector) {
	vector.x = this.x;
	vector.y = this.y;
	vector.z = this.z;
	vector.w = this.w;
};

/**
 * Calc and return vector's norm.
 * 
 * @return {number} Vector's norm.
 */
VVGL.Vec4.prototype.getNorm = function () {
	return (Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w));
};

/**
 * Normalize vector, making its norm to 1.
 */
VVGL.Vec4.prototype.normalize = function () {
	var norm = this.getNorm();
	this.scale(1 / norm);
};

/**
 * Create copy of this vector.
 * 
 * @return {VVGL.Vec4} Copy.
 */
VVGL.Vec4.prototype.clone = function () {
	return (new VVGL.Vec4(this.x, this.y, this.z, this.w));
};

/**
 * Convert vector to a data array.
 * 
 * @return {Array} A float array containing the three vector's values.
 */
VVGL.Vec4.prototype.toArray = function () {
	return ([this.x, this.y, this.z, this.w]);
};

/**
 * @class
 * @classdesc Manager of scenes selection.
 * @private
 */
VVGL.SceneManager = function () {
	this.scenes = [];
	this.currentScene = null;
};

/**
 * Add a new scene to list.
 * 
 * @param {string} scene Scene name.
 * @param {VVGL.Scene} scene New scene to add to list.
 * @param {Boolean} select The new scene is now the current one if this param is true. Set to false if undefined.
 */
VVGL.SceneManager.prototype.addScene = function(name, scene, select) {
    select = select ? select : false;

	this.scenes[name] = scene;
	if (select) {
		this.currentScene = scene;
	}
};

/**
 * Return last selectioned scene, or null if no scene is selectioned.
 * 
 * @return {VVGL.Scene} Last selectioned scene, or null if no scene is selectioned.
 */
VVGL.SceneManager.prototype.getCurrentScene = function () {
	return (this.currentScene);
};
/**
 * Create texture from image file.
 *
 * @class
 * @classdesc Graphic 2D texture.
 * @todo Texture manager.
 * @param {string} source
 */
VVGL.Texture = function (source, loadCallback) {
	var me = this;

	this.ready = false;
	this.source = source;
	this.image = new Image();
    this.image.onload = function () { me.onLoad();};
    this.image.onerror = function () { me.onError();};
	this.image.src = source;
};

/**
 * Check if texture is ready to be used or not.
 *
 * @return {boolean}
 */
VVGL.Texture.prototype.isReady = function () {
	return (this.ready);
};

/**
 * Called on texture file loading end.
 *
 * @private
 */
VVGL.Texture.prototype.onLoad = function () {
    this.ready = true;
};

/**
 * Called on texture file loading error.
 *
 * @private
 */
VVGL.Texture.prototype.onError = function () {
    throw new VVGL.Exception("Could not load texture: " + this.image.src);
};
/**
 * @class
 * @classdesc Time lord.
 */
VVGL.Clock = function () {
	this.reset();
};

/**
 * Return elapsed time (in miliseconds) from last reset.
 * 
 * @return {number} Elapsed time since last reset.
 */
VVGL.Clock.prototype.getElapsedTime = function () {
	return (new Date().getTime() - this.lastTime);
};

/**
 * Reset clock counter.
 * Called on creation.
 * 
 * @return {number} Elapsed time since last reset.
 */
VVGL.Clock.prototype.reset = function () {
	var newTime = new Date().getTime();
	var elapsedTime = newTime - this.lastTime;
	
	this.lastTime = newTime;
	
	return (elapsedTime);
};
/**
 * Super singleton manager of canvas, graphic and physic engine.
 * This class has to be instanciate only once in your program.
 * You can then access your instance with {@link VVGL.Application2D.access}
 *
 * @class
 * @classdesc Super singleton manager of canvas, graphic and physic engine.
 * @extends VVGL.Application
 * @param {string} canvasId Id of your HTML canvas.
 */
VVGL.Application2D = function (canvasId) {
	VVGL.Application.call(this, canvasId);

    this.initContext();
};

VVGL.Application2D.prototype = Object.create(VVGL.Application.prototype);

/**
 * @type {VVGL.Color}
 * @default
 */
VVGL.Application2D.prototype.clearColor = VVGL.Color.white;


/**
 * Initialize 2D context.
 *
 * @private
 */
VVGL.Application2D.prototype.initContext = function () {
    this.context = this.canvas.getContext("2d");
    this.clearColor = VVGL.Color.white.clone();
};

/**
 * Resize canvas resolution to navigator's window resolution.
 */
VVGL.Application2D.prototype.resizeToWindow = function () {
	this.resize(window.innerWidth, window.innerHeight);
};

/**
 * Clear application screen.
 * 
 * @private
 */
VVGL.Application2D.prototype.clear = function () {
	this.context.rect(0, 0, this.width, this.height);
	this.context.fillStyle = this.clearColor.toString();
	this.context.fill();
};
/**
 * Represent a drawable object.
 * 
 * @interface
 */
VVGL.Drawable = function () {};

/**
 * Render object to context.
 * 
 * @abstract
 * @param {HTMLContext} context
 */
VVGL.Drawable.prototype.render = function (context) {
	throw new Error("Missing draw implementation of Drawable object.");
};
/**
 * @class
 * @classdesc Pixel arc.
 * @implements VVGL.Drawable
 */
VVGL.Arc = function () {
	this.position = new VVGL.Vec2();
	this.color = VVGL.Color.black.clone();
};

VVGL.Arc.prototype = Object.create(VVGL.Drawable.prototype);

/**
 * @type {VVGL.Vec2}
 */
VVGL.Arc.prototype.position = null;

/**
 * @type {VVGL.Color}
 * @default
 */
VVGL.Arc.prototype.color = VVGL.Color.black;

/**
 * @type {number}
 * @default
 */
VVGL.Arc.prototype.lineWidth = 1;

/**
 * @type {number}
 * @default
 */
VVGL.Arc.prototype.radius = 0;

/**
 * @type {number}
 * @default
 */
VVGL.Arc.prototype.startAngle = 0;

/**
 * @type {number}
 * @default
 */
VVGL.Arc.prototype.endAngle = 2 * Math.PI;


/**
 * Render arc to context.
 * 
 * @override
 * @param {HTMLContext} context
 */
VVGL.Arc.prototype.render = function (context) {
	context.beginPath();
	context.arc(this.position.x, this.position.y, this.radius, this.startAngle, this.endAngle, false);
	context.lineWidth = this.lineWidth;
	
	context.strokeStyle = this.color.toString();
	context.stroke();
};
/**
 * @class
 * @classdesc Pixel frame. Must be updated after each modification.
 * @implements VVGL.Drawable
 */
VVGL.Frame = function () {
	this.start = new VVGL.Vec2();
	this.end = new VVGL.Vec2();
	this.color = VVGL.Color.black.clone();
	
	this.borders = [new VVGL.Line(), new VVGL.Line(), new VVGL.Line(), new VVGL.Line()];

	this.angles = [new VVGL.Arc(), new VVGL.Arc(), new VVGL.Arc(), new VVGL.Arc()];
	this.angles[0].startAngle = Math.PI;
	this.angles[0].endAngle = 3 * Math.PI / 2;
	this.angles[1].startAngle = 3 * Math.PI / 2;
	this.angles[1].endAngle = Math.PI * 2;
	this.angles[2].startAngle = 0;
	this.angles[2].endAngle = Math.PI / 2;
	this.angles[3].startAngle = Math.PI / 2;
	this.angles[3].endAngle = Math.PI;
	
	this.update();
};

VVGL.Frame.prototype = Object.create(VVGL.Drawable.prototype);

/**
 * @type {VVGL.Vec2}
 */
VVGL.Frame.prototype.start = null;

/**
 * @type {VVGL.Vec2}
 */
VVGL.Frame.prototype.end = null;

/**
 * @type {VVGL.Color}
 * @default
 */
VVGL.Frame.prototype.color = VVGL.Color.black;

/**
 * @type {number}
 * @default
 */
VVGL.Frame.prototype.lineWidth = 1;

/**
 * @type {number}
 * @default
 */
VVGL.Frame.prototype.anglesRadius = 1;

/**
 * Update frame internal data from public members.
 */
VVGL.Frame.prototype.update = function () {
	for (var i in this.borders) {
		var border = this.borders[i];
		border.color = this.color;
		border.width = this.lineWidth;
	}
	
	this.borders[0].start.x = this.start.x + this.anglesRadius - 1;
	this.borders[0].start.y = this.start.y;
	this.borders[0].end.x = this.end.x - this.anglesRadius + 1;
	this.borders[0].end.y = this.start.y;
	this.borders[1].start.x = this.end.x;
	this.borders[1].start.y = this.start.y + this.anglesRadius - 1;
	this.borders[1].end.x = this.end.x;
	this.borders[1].end.y = this.end.y - this.anglesRadius + 1;
	this.borders[2].start.x = this.end.x - this.anglesRadius + 1;
	this.borders[2].start.y = this.end.y;
	this.borders[2].end.x = this.start.x + this.anglesRadius - 1;
	this.borders[2].end.y = this.end.y;
	this.borders[3].start.x = this.start.x;
	this.borders[3].start.y = this.end.y - this.anglesRadius + 1;
	this.borders[3].end.x = this.start.x;
	this.borders[3].end.y = this.start.y + this.anglesRadius - 1;

	for (var i in this.angles) {
		var angle = this.angles[i];
		angle.radius = this.anglesRadius;
		angle.color = this.color;
		angle.lineWidth = this.lineWidth;
	}
	
	this.angles[0].position.x = this.start.x + this.anglesRadius;
	this.angles[0].position.y = this.start.y + this.anglesRadius;
	this.angles[1].position.x = this.end.x - this.anglesRadius;
	this.angles[1].position.y = this.start.y + this.anglesRadius;
	this.angles[2].position.x = this.end.x - this.anglesRadius;
	this.angles[2].position.y = this.end.y - this.anglesRadius;
	this.angles[3].position.x = this.start.x + this.anglesRadius;
	this.angles[3].position.y = this.end.y - this.anglesRadius;
};

/**
 * Render intern data to 2D context.
 * 
 * @override
 * @param {HTMLContext} context
 */
VVGL.Frame.prototype.render = function (context) {
	this.borders[0].render(context);
	this.borders[1].render(context);
	this.borders[2].render(context);
	this.borders[3].render(context);
	this.angles[0].render(context);
	this.angles[1].render(context);
	this.angles[2].render(context);
	this.angles[3].render(context);
};
/**
 * Enum for line drawing style.
 * 
 * @readonly
 * @enum {string}
 */
VVGL.LineCap = {
	BUTT: "butt",
	ROUND: "round",
	SQUARE: "square"
};
/**
 * @class
 * @classdesc Pixel line.
 * @implements VVGL.Drawable
 */
VVGL.Line = function () {
	this.start = new VVGL.Vec2();
	this.end = new VVGL.Vec2();
	this.color = VVGL.Color.black.clone();
};

VVGL.Line.prototype = Object.create(VVGL.Drawable.prototype);

/**
 * @type {VVGL.Vec2}
 */
VVGL.Line.prototype.start = null;

/**
 * @type {VVGL.Vec2}
 */
VVGL.Line.prototype.end = null;

/**
 * @type {number}
 * @default
 */
VVGL.Line.prototype.width = 1;

/**
 * @type {VVGL.Color}
 * @default
 */
VVGL.Line.prototype.color = VVGL.Color.black;

/**
 * @type {VVGL.LineCap}
 * @default
 */
VVGL.Line.prototype.lineCap = VVGL.LineCap.BUTT;

/**
 * Render line to 2D context.
 * 
 * @override
 * @param {HTMLContext} context
 */
VVGL.Line.prototype.render = function (context) {
	context.beginPath();
	context.moveTo(this.start.x, this.start.y);
	context.lineTo(this.end.x, this.end.y);
	context.lineWidth = this.width;
	context.strokeStyle = this.color.toString();
	context.lineCap = this.lineCap;
	context.stroke();
};
/**
 * @class
 * @classdesc Colored rectangle.
 * @implements VVGL.Drawable
 */
VVGL.Rectangle = function () {
	this.position = new VVGL.Vec2();
	this.fillColor = VVGL.Color.white.clone();
	this.borderColor = VVGL.Color.black.clone();
};

VVGL.Rectangle.prototype = Object.create(VVGL.Drawable.prototype);

/**
 * @type {VVGL.Vec2}
 */
VVGL.Rectangle.prototype.position = null;

/**
 * @type {number}
 * @default
 */
VVGL.Rectangle.prototype.width = 0;

/**
 * @type {number}
 * @default
 */
VVGL.Rectangle.prototype.height = 0;

/**
 * @type {boolean}
 * @default
 */
VVGL.Rectangle.prototype.fill = true;

/**
 * @type {VVGL.Color}
 * @default
 */
VVGL.Rectangle.prototype.fillColor = VVGL.Color.white;

/**
 * @type {boolean}
 * @default
 */
VVGL.Rectangle.prototype.border = false;

/**
 * @type {number}
 * @default
 */
VVGL.Rectangle.prototype.borderWidth = 1;

/**
 * @type {VVGL.LineCap}
 * @default
 */
VVGL.Rectangle.prototype.borderCap = VVGL.LineCap.BUTT;

/**
 * @type {VVGL.Color}
 * @default
 */
VVGL.Rectangle.prototype.borderColor = VVGL.Color.black;

/**
 * Render line to 2D context.
 * 
 * @param {HTMLContext} context
 */
VVGL.Rectangle.prototype.render = function (context) {
	context.beginPath();
	context.rect(this.position.x, this.position.y, this.width, this.height);
	if (this.fill) {
		context.fillStyle = this.fillColor.toString();
		context.fill();
	}
	if (this.border) {
		context.lineWidth = this.borderWidth;
		context.lineCap = this.borderCap; // useless...
		context.strokeStyle = this.borderColor.toString();
		context.stroke();
	}
};
/**
 * @class
 * @classdesc Sprite linked to texture.
 * @implements VVGL.Drawable
 * @todo add texture rect
 */
VVGL.Sprite = function () {
	this.position = new VVGL.Vec2();
};

VVGL.Sprite.prototype = Object.create(VVGL.Drawable.prototype);

/**
 * @type {VVGL.Vec2}
 */
VVGL.Sprite.prototype.position = null;

/**
 * @type {number}
 * @default
 */
VVGL.Sprite.prototype.width = 0;

/**
 * @type {number}
 * @default
 */
VVGL.Sprite.prototype.height = 0;

/**
 * @type {VVGL.Texture}
 */
VVGL.Sprite.prototype.texture = null;

/**
 * Render sprite to 2D context.
 * 
 * @param {HTMLContext} context
 */
VVGL.Sprite.prototype.render = function (context) {
	if (this.texture === null) {
		console.error("Missing texture for sprite.");
	} else if (this.texture.isReady()) {
		context.drawImage(this.texture.image, this.position.x, this.position.y, this.width, this.height);
	}
};


VVGL.Sprite.fromFile = function (file) {
	var sprite = new VVGL.Sprite();
	sprite.texture = new VVGL.Texture(file, function () {
		sprite.width = sprite.texture.image.width;
		sprite.height = sprite.texture.image.height;
	});
	
	return (sprite);
};
/**
 * @class
 * @classdesc Renderable text.
 * @implements VVGL.Drawable
 * @param {string} string
 */
VVGL.Text = function (string) {
	this.string = string;
	this.position = new VVGL.Vec2();
	this.color = VVGL.Color.black.clone();
};

VVGL.Text.prototype = Object.create(VVGL.Drawable.prototype);

/**
 * @type {VVGL.Vec2}
 */
VVGL.Text.prototype.position = null;

/**
 * @type {boolean}
 * @default
 */
VVGL.Text.prototype.lined = false;

/**
 * @type {boolean}
 * @default
 */
VVGL.Text.prototype.horizontalAligned = false;

/**
 * @type {boolean}
 * @default
 */
VVGL.Text.prototype.verticalAligned = false;


/**
 * @type {number}
 * @default
 */
VVGL.Text.prototype.lineWidth = 2;

/**
 * @type {number}
 * @default
 */
VVGL.Text.prototype.size = 10;

/**
 * @type {VVGL.Color}
 * @default
 */
VVGL.Text.prototype.color = VVGL.Color.black;

/**
 * @type {string}
 * @default
 */
VVGL.Text.prototype.font = "Arial";

/**
 * Render text to 2D context.
 * 
 * @param {HTMLContext} context
 */
VVGL.Text.prototype.render = function (context) {
	context.font = this.size + "pt " + this.font;
	context.textAlign = this.horizontalAligned ? "center" : "";
	context.textBaseline = this.verticalAligned ? "middle" : "";
	
	if (this.lined) {
		context.lineWidth = this.lineWidth;
		context.strokeStyle = this.color.toString();
		context.strokeText(this.string, this.position.x, this.position.y);
	} else {
		context.fillStyle = this.color.toString();
		context.fillText(this.string, this.position.x, this.position.y);
	}
};
/**
 * Create node for a renderable data.
 * 
 * @param {VVGL.Renderable} data
 */
VVGL.SceneNode = function (data) {
	this.data = data;
	this.parent = null;
	this.children = [];
	
	this.position = new VVGL.Vec2();
	this.scale = new VVGL.Vec2(1, 1, 1);
};

/**
 * @type {VVGL.SceneNode}
 * @default
 */
VVGL.SceneNode.prototype.parent = null;

/**
 * @type {VVGL.Drawable}
 * @default
 */
VVGL.SceneNode.prototype.data = null;

/**
 * @type {VVGL.Vec2}
 */
VVGL.SceneNode.prototype.position = null;

/**
 * @type {number}
 * @default
 */
VVGL.SceneNode.prototype.rotation = 0;

/**
 * @type {VVGL.Vec2}
 */
VVGL.SceneNode.prototype.scale = null;


/**
 * Add child to children list.
 * 
 * @param {VVGL.SceneNode} child
 */
VVGL.SceneNode.prototype.addChild = function (child) {
	child.parent = this;
	this.children.push(child);
};

/**
 * Draw this node and its children.
 * 
 * @param {HTMLContext} context
 */
VVGL.SceneNode.prototype.draw = function (context) {
	context.save();
	{
		context.translate(this.position.x, this.position.y);
		context.scale(this.scale.x, this.scale.y);
		context.rotate(this.rotation);
		
		if (this.data) {
			this.data.render(context);
		}
		for (var i in this.children) {
			this.children[i].draw(context);
		}
	}
	context.restore();
};
