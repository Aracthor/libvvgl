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
 * Enum for render modes of {@link VVGL.Mesh}
 * 
 * @readonly
 * @enum {number}
 */
VVGL.RenderMode = {
	POINTS: 0,
	LINES: 1,
	LINES_STRIP: 2,
	LINES_FAN: 3,
	TRIANGLES: 4,
	TRIANGLES_STRIP: 5,
	TRIANGLES_FAN: 6
};
/**
 * Something that you can select or unselect.
 * 
 * @interface
 */
VVGL.IBindable = function () {};

VVGL.IBindable.prototype.bind = function () {
	throw new VVGL.ImplementationException(this, "bind", "IBindable");
};

VVGL.IBindable.prototype.unbind = function () {
	throw new VVGL.ImplementationException(this, "unbind", "IBindable");
};
/**
 * Renderable data linkable to {@link VVGL.SceneNode}
 * 
 * @abstract
 * @class
 * @classdesc Renderable data.
 * @param {string} type
 */
VVGL.SceneData = function (type) {
	this.type = type;
};

/**
 * Return data type name.
 * 
 * @return {string} Data type.
 */
VVGL.SceneData.prototype.getType = function () {
	return (this.type);
};

/**
 * Render function to override.
 */
VVGL.SceneData.prototype.render = function () {
	throw new VVGL.ImplementationException(this, "render", "SceneData");
};

/**
 * Update node data.
 * 
 * @param {number} elapsedTime Elapsed miliseconds from last frame.
 */
VVGL.SceneData.prototype.update = function (elapsedTime) {
	throw new VVGL.ImplementationException(this, "update", "SceneData");
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
	document.addEventListener("keydown", function (event) {me.onKeyDown(event.keyCode); event.preventDefault();}, false);
	document.addEventListener("keyup", function (event) {me.onKeyUp(event.keyCode);}, false);
	
	// Mouse events
	canvas.addEventListener("mousemove", function (event) {me.onMouseMove(event);}, false);
	canvas.addEventListener("mousedown", function (event) {me.onMouseDown(event);}, false);
	canvas.addEventListener("mouseup", function (event) {me.onMouseUp(event);}, false);
	
	// Lock events
	document.addEventListener('pointerlockerror', me.onLockError, false);
	document.addEventListener('mozpointerlockerror', me.onLockError, false);
	document.addEventListener('webkitpointerlockerror', me.onLockError, false);
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
};

/**
 * Called on mouse release.
 * 
 * @private
 * @param {Object} event Click details.
 */
VVGL.EventsManager.prototype.onMouseUp = function (event) {
	VVGL.Mouse.releaseButton(event.button);
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
	this.mouseMovementListener = null;
	
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
 * Add event listener to each time key start to be pressed.
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
 * Add mouse movement listener.
 * 
 * @param {VVGL.MouseMovementListener} listener
 */
VVGL.EventsHandler.prototype.addMouseMovementListener = function (listener) {
	this.mouseMovementListener = listener;	
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
 * Called by {VVGL.EventsManager} on frame where key is pressed.
 *
 * @param {VVGL.KeyCode} keyCode
 */
VVGL.EventsHandler.prototype.onKey = function (keyCode) {
	this.onKeyEvent(this.keyListeners, keyCode);
};

/**
 * Called by {VVGL.EventsManager} on key pression.
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
VVGL.KeyEventListener.prototype.onEvent = function (data, x, y) {
	throw new VVGL.ImplementationException(this, "onEvent", "MouseMovementListener");
};
/**
 * Super singleton manager of canvas, graphic and physic engine.
 * This class has to be instanciate only once in your program.
 * You can then access your instance with {@link VVGL.Application.instance}
 * 
 * @class
 * @extends VVGL.EventsHandler
 * @classdesc Super singleton manager of canvas, graphic and physic engine.
 * @param {string} canvasId Id of your HTML canvas.
 */
VVGL.Application = function (canvasId) {
	VVGL.Application.instance = this;
	this.canvas = document.getElementById(canvasId);
	
	this.initAPI();
	this.initContext();
	this.renderer = new VVGL.Renderer();
};

VVGL.Application.prototype = Object.create(VVGL.EventsHandler.prototype);

/**
 * Initialize other VVGL classes
 *
 * @private
 */
VVGL.Application.prototype.initAPI = function () {
	VVGL.Color.initStaticValues();
	this.eventsManager = new VVGL.EventsManager(this.canvas);
	this.sceneManager = new VVGL.SceneManager();
	VVGL.EventsHandler.call(this, this.eventsManager);
	this.clock = new VVGL.Clock();
};

/**
 * Initialize Context
 * 
 * @private
 */
VVGL.Application.prototype.initContext = function () {
	try {
		this.context = this.canvas.getContext("experimental-webgl");
	} catch (exception) {
		throw new VVGL.Exception("Cannot initalize WebGL. Sorry for that.");
	}
	
	this.context.viewportWidth = this.canvas.width;
	this.context.viewportHeight = this.canvas.height;
	this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
	gl = this.context;
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
 * @todo todo.
 */
VVGL.Application.prototype.unlockPointer = function () {
	this.eventsManager.wantMouseLocked = false;
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
 * @type {VVGL.Application}
 */
VVGL.Application.instance = null;

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
 * Return first param, or defaultValue if param is undefined.
 * 
 * @param {Object} param undefined or not to check.
 * @param {Object} defaultValue Value to return if param is undefined.
 * @returns {Object} param if not undefined, else defaultValue.
 */
VVGL.setIfUndefined = function (param, defaultValue) {
	return (param !== undefined ? param : defaultValue);
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
 * Base camera class.
 * 
 * @class
 * @extends VVGL.EventsHandler
 * @extends VVGL.SceneData
 */
VVGL.Camera = function () {
	VVGL.SceneData.call(this, "camera");
	VVGL.EventsHandler.call(this);
	
	this.perspective = new VVGL.Mat4();
	this.view = new VVGL.Mat4();
	
	this.position = new VVGL.Vec3(-10, 0, 0);
	this.target = new VVGL.Vec3(0, 0, 0);
	this.up = new VVGL.Vec3(0, 0, 1);
	
	this.elapsedTime = 0;
};

VVGL.Camera.prototype = VVGL.fusionClasses(VVGL.SceneData.prototype, VVGL.EventsHandler.prototype);

/**
 * Eye position.
 * 
 * @type {VVGL.Vec3}
 */
VVGL.Camera.prototype.position = null;

/**
 * Eye point looked.
 * 
 * @type {VVGL.Vec3}
 */
VVGL.Camera.prototype.target = null;

/**
 * Up vector.
 * Define scene axis.
 * 
 * @type {VVGL.Vec3}
 */
VVGL.Camera.prototype.up = null;

/**
 * Camera angle, in degrees.
 * 
 * @type {number}
 * @default
 */
VVGL.Camera.prototype.angle = 60.0;

/**
 * Camera aspect ratio.
 * Typically canvas width / canvas height.
 * 
 * @type {number}
 * @default
 */
VVGL.Camera.prototype.aspectRatio = 4.0 / 3.0;

/**
 * Camera minimum display range.
 * 
 * @type {number}
 * @default
 */
VVGL.Camera.prototype.minRange = 0.1;

/**
 * Camera maximum display range.
 * 
 * @type {number}
 * @default
 */
VVGL.Camera.prototype.maxRange = 100.0;


/**
 * Return persepctive matrix.
 * 
 * @return {VVGL.Mat4}
 */
VVGL.Camera.prototype.getPerspective = function () {
	this.perspective.perspective(this.angle, this.aspectRatio, this.minRange, this.maxRange);
	return (this.perspective);
};

/**
 * Return view matrix.
 * 
 * @return {VVGL.Mat4}
 */
VVGL.Camera.prototype.getView = function () {
	this.view.lookAt(this.position, this.target, this.up);
	return (this.view);
};


/**
 * Render object to scene.
 * No effect for camera.
 * 
 * @override
 */
VVGL.Camera.prototype.render = function () {};
/**
 * Camera with target fixed to a point,
 * With position turning around with mouse movements.
 * 
 * @class
 * @extends VVGL.Camera
 */
VVGL.FreeFlyCamera = function () {
	VVGL.Camera.call(this);
	
	this.forward = new VVGL.Vec3();
	this.left = new VVGL.Vec3();
	this.move = new VVGL.Vec3();
	
	this.angleX = 0;
	this.angleY = 0;
	
	this.recalcVectors();
	
	this.addKeyListener(VVGL.KeyCode.W, new VVGL.KeyEventListener(VVGL.FreeFlyCamera.advanceFront));
	this.addKeyListener(VVGL.KeyCode.S, new VVGL.KeyEventListener(VVGL.FreeFlyCamera.advanceBack));
	this.addKeyListener(VVGL.KeyCode.D, new VVGL.KeyEventListener(VVGL.FreeFlyCamera.advanceRight));
	this.addKeyListener(VVGL.KeyCode.A, new VVGL.KeyEventListener(VVGL.FreeFlyCamera.advanceLeft));
	
	this.addMouseMovementListener(new VVGL.MouseMovementListener(VVGL.FreeFlyCamera.turnCamera));
};

VVGL.FreeFlyCamera.prototype = Object.create(VVGL.Camera.prototype);

/**
 * Coeficient between 1 and 0 proportional to movement inertia.
 * 
 * @type {number}
 * @default
 */
VVGL.FreeFlyCamera.prototype.inertiaCoef = 0.95;

/**
 * Movements speed.
 * 
 * @type {number}
 * @default
 */
VVGL.FreeFlyCamera.prototype.speed = 0.01;

/**
 * Rotation speed.
 * 
 * @type {number}
 * @default
 */
VVGL.FreeFlyCamera.prototype.sensitivity = 0.005;


/**
 * Recalc forward and left vectors.
 * 
 * @private
 * @todo Use math helper to trigonometry.
 */
VVGL.FreeFlyCamera.prototype.recalcVectors = function () {
	this.forward.x = Math.cos(this.angleY) * Math.cos(this.angleX);
	this.forward.y = Math.cos(this.angleY) * Math.sin(this.angleX);
	this.forward.z = Math.sin(this.angleY);
	
	this.forward.copyTo(this.left);
	this.left.crossProduct(this.up);
	this.left.normalize();
	
	this.position.copyTo(this.target);
	this.target.add(this.forward);
};

/**
 * Update camera data.
 * Move position if camera was moving,
 * update movement with inertia,
 * and recalc other vectors.
 * 
 * @override
 * @param {number} elapsedTime
 */
VVGL.FreeFlyCamera.prototype.update = function (elapsedTime) {
	var movementScale = this.speed * elapsedTime;
	
	this.move.scale(movementScale);
	{
		this.position.add(this.move);
	}
	this.move.scale(1.0 / movementScale);
	
	this.move.scale(this.inertiaCoef);
	
	this.recalcVectors();
};


/**
 * Advance to front event listener.
 * 
 * @private
 * @static
 * @param {VVGL.FreeFlyCamera} camera
 */
VVGL.FreeFlyCamera.advanceFront = function (camera) {
	camera.move.add(camera.forward);
};

/**
 * Advance to back event listener.
 * 
 * @private
 * @static
 * @param {VVGL.FreeFlyCamera} camera
 */
VVGL.FreeFlyCamera.advanceBack = function (camera) {
	camera.move.sub(camera.forward);
};

/**
 * Advance to right event listener.
 * 
 * @private
 * @static
 * @param {VVGL.FreeFlyCamera} camera
 */
VVGL.FreeFlyCamera.advanceRight = function (camera) {
	camera.move.add(camera.left);
};

/**
 * Advance to left event listener.
 * 
 * @private
 * @static
 * @param {VVGL.FreeFlyCamera} camera
 */
VVGL.FreeFlyCamera.advanceLeft = function (camera) {
	camera.move.sub(camera.left);
};

/**
 * Turn camera mouse movement listener.
 * 
 * @private
 * @static
 * @param {VVGL.FreeFlyCamera} camera
 * @param {number} x
 * @param {number} y
 */
VVGL.FreeFlyCamera.turnCamera = function (camera, x, y) {
	if (VVGL.Mouse.isLocked || VVGL.Mouse.buttonIsPressed(VVGL.MouseButton.LEFT)) {
		var yMax = VVGL.Maths.PI / 2 - 0.01;
		
		camera.angleX += x * camera.sensitivity;
		camera.angleY += y * camera.sensitivity;
		if (camera.angleY > yMax) {
			camera.angleY = yMax;
		} else if (camera.angleY < -yMax) {
			camera.angleY = -yMax;
		}
	}
};
/**
 * Camera with target fixed to a point,
 * With position turning around with mouse movements.
 * 
 * @class
 * @extends VVGL.Camera
 */
VVGL.TrackballCamera = function () {
	VVGL.Camera.call(this);
	
	this.position.x = -10;
};

VVGL.TrackballCamera.prototype = Object.create(VVGL.Camera.prototype);
/**
 * Functions for color-integer manipulation.
 * 
 * @class Functions for color-number manipulation.
 * @constructor
 */
VVGL.Color = function () {};

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
	a = VVGL.setIfUndefined(a, 0xFF);
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
	a = VVGL.setIfUndefined(a, 1.0);
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
 * Initialize const color values.
 * 
 * @private
 */
VVGL.Color.initStaticValues = function () {
	VVGL.Color.black.setFromFloatNumbers(0.0, 0.0, 0.0);
	VVGL.Color.red.setFromFloatNumbers(1.0, 0.0, 0.0);
	VVGL.Color.green.setFromFloatNumbers(0.0, 1.0, 0.0);
	VVGL.Color.blue.setFromFloatNumbers(0.0, 0.0, 1.0);
	VVGL.Color.yellow.setFromFloatNumbers(1.0, 1.0, 0.0);
	VVGL.Color.magenta.setFromFloatNumbers(1.0, 0.0, 1.0);
	VVGL.Color.cyan.setFromFloatNumbers(0.0, 1.0, 1.0);
	VVGL.Color.white.setFromFloatNumbers(1.0, 1.0, 1.0);
};

/**
 * Black color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.black = new VVGL.Color();

/**
 * Red color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.red = new VVGL.Color();

/**
 * Green color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.green = new VVGL.Color();

/**
 * Blue color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.blue = new VVGL.Color();

/**
 * Yellow color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.yellow = new VVGL.Color();

/**
 * Magenta color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.magenta = new VVGL.Color();

/**
 * Cyan color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.cyan = new VVGL.Color();

/**
 * White color instance.
 * 
 * @type {VVGL.Color}
 * @const
 */
VVGL.Color.white = new VVGL.Color();
/**
 * Associative array.
 * 
 * @class Associative array.
 * @constructor
 */
VVGL.Map = function () {};

/**
 * Key list
 * 
 * @type {Array}
 */
VVGL.Map.prototype.keys = [];

/**
 * Values list
 * 
 * @type {Array}
 */
VVGL.Map.prototype.values = [];

/**
 * Add new set of key/value.
 * 
 * @param {Object} key The element's key
 * @param {Object} value The element's value
 */
VVGL.Map.prototype.add = function (key, value) {
	this.keys.push(key);
	this.values.push(value);
};

/**
 * Return a value associated with a key.
 * 
 * @param {Object} key The key to search.
 * @return {Object} The associated value, or null if there is no associated value.
 */
VVGL.Map.prototype.getFromKey = function (key) {
	var index = 0;
	var value = null;
	
	while (index < this.keys.length && this.keys[index] != key) {
		++index;
	}
	
	if (index < this.keys.length) {
		value = this.values[index];
	}
	
	return (value);
};

/**
 * Return a key associated with a value.
 * 
 * @param {Object} value The value to search.
 * @return {Object} The associated key, or null if there is no key value.
 */
VVGL.Map.prototype.getFromValue = function (value) {
	var index = 0;
	var key = null;
	
	while (index < this.values.length && this.values[index] != value) {
		++index;
	}
	
	if (index < this.values.length) {
		key = this.keys[index];
	}
	
	return (key);
};

VVGL.Map.prototype.getLength = function () {
	return (this.keys.length);
};
/**
 * Exception base for all exception classes.
 * Every exception contains at least a message and sometimes more, depending of the type.
 * @class Exception base for all exception classes.
 * @constructor
 * @param {Object} message
 */
VVGL.Exception = function (message) {
	this.message = message;
};

/**
 * @type {string} message Error message.
 */
VVGL.Exception.prototype.message = "";

/**
 * @type {string} type Exception type.
 */
VVGL.Exception.prototype.type = "none";

/**
 * Convert Exception to a {string}.
 * 
 * @return {string} Exception details.
 */
VVGL.Exception.prototype.what = function () {
	return (this.message);
};
/**
 * @class
 * @classdesc Handle interns OpenGL errors.
 * @extends VVGL.Exception
 * @private
 */
VVGL.GLErrorException = function (func, error) {
	var message = "OpenGL error after " + func + ": " + this.interpreteError(error);
	VVGL.Exception.call(this, message);
};

VVGL.GLErrorException.prototype = Object.create(VVGL.Exception.prototype);

/**
 * Get appropriate error message from error enum.
 * 
 * @private
 * @param {number} error GLenum error id.
 */
VVGL.GLErrorException.prototype.interpreteError = function (error) {
	var errors = [];
	errors[gl.INVALID_ENUM]						= "Invalid enum";
	errors[gl.INVALID_VALUE]					= "Invalid value";
	errors[gl.INVALID_OPERATION]				= "Invalid operation";
	errors[gl.INVALID_FRAMEBUFFER_OPERATION]	= "Invalid framebuffer operation";
	errors[gl.OUT_OF_MEMORY]					= "Out of memory";
	errors[gl.STACK_UNDERFLOW]					= "Stack underflow";
	errors[gl.STACK_OVERFLOW]					= "Stack overflow";
	
	return (errors[error]);
};


/**
 * Check if something bad happened.
 * If yes, throw an exception with corresponding error message.
 * 
 * @static
 * @throws {VVGL.GLErrorException}
 */
VVGL.GLErrorException.checkError = function (func) {
	var error = gl.getError();
	if (error !== gl.NO_ERROR) {
		throw new VVGL.GLErrorException(func, error);
	}
};
/**
 * @class
 * @classdesc Exception throwed on ressource initialisation fail.
 * @extends VVGL.Exception
 * @param {Object} object Ressource linked to problem.
 * @param {string} message Problem resume.
 */
VVGL.GLRessourceException = function (ressource, message) {
	VVGL.Exception.call(this, message);
	this.ressource = ressource;
};

VVGL.GLRessourceException.prototype = Object.create(VVGL.Exception.prototype);

/**
 * Ressource linked to problem.
 * 
 * @type {Object}
 */
VVGL.GLRessourceException.prototype.ressource = null;
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
	VVGL.Exception.call(this, "Missing implementation of " + functionName + " in object " + className + ".");
	this.linkedObject = linkedObject;
	this.type = "implementation";
};

VVGL.ImplementationException.prototype = Object.create(VVGL.Exception.prototype);

/**
 * Print error message.
 * 
 * @override
 */
VVGL.ImplementationException.prototype.what = function () {
	console.log("Missing implementation object:");
	console.log(this.linkedObject);
	return (VVGL.Exception.prototype.what.call(this));
};
/**
 * A 4x4 float matrix.
 * Created as an identity matrix.
 * 
 * @class
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
 * Return a copy of this matrix.
 * 
 * @return {VVGL.Mat4} Copy.
 */
VVGL.Mat4.prototype.clone = function () {
	var clone = new VVGL.Mat4();
	
	clone.data = this.data.slice();
	
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
 * Maths help functions and numbers.
 * 
 * @class Maths help functions and numbers.
 */
VVGL.Maths = {};

VVGL.Maths.PI = 3.14159265359;
/**
 * A 3-dimensional vector.
 * 
 * @class A 3-dimensional vector.
 * @constructor
 * @param {number} x X-axis value.
 * @param {number} y Y-axis value.
 * @param {number} z Z-axis value.
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
 * Substract another vector to this one.
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
 * OpenGL buffer to store mesh data.
 * Can be a vertice feature (position, color, textureCoord or normal) or Element indices.
 * 
 * @class
 * @implements {VVGL.IBindable}
 * @param {number} type GL enum : gl.ARRAY_BUFFER or gl.ELEMENT_BUFFER.
 * @param {Array} data Array containing data.
 * @param {number} itemSize Number of data used by each item, for exemple 3 for a 3-dimentional position.
 */
VVGL.ArrayBuffer = function (type, data, itemSize) {
	this.type = type;
	this.buffer = gl.createBuffer();
	this.data = data;
	this.itemSize = itemSize;
	this.attribute = null;
	
	this.bind();
	{
		gl.bufferData(this.type, data, gl.STATIC_DRAW);
	}
	this.unbind();
};

VVGL.ArrayBuffer.prototype = Object.create(VVGL.IBindable.prototype);

/**
 * Link to a shader attribute from name.
 * 
 * @param {string} attribute
 */
VVGL.ArrayBuffer.prototype.linkToAttribute = function (attribute) {
	this.attribute = attribute;
};

/**
 * Return points number by element.
 * 
 * @return {number}
 */
VVGL.ArrayBuffer.prototype.getItemSize = function () {
	return (this.itemSize);
};

/**
 * Bind buffer, selecting this one for next OpenGL calls.
 */
VVGL.ArrayBuffer.prototype.bind = function () {
	gl.bindBuffer(this.type, this.buffer);
	if (this.attribute !== null) {
		VVGL.ShaderProgram.currentProgram.setAttribute(this.attribute, this);
	}
};

/**
 * Unbind buffer, selecting none.
 */
VVGL.ArrayBuffer.prototype.unbind = function () {
	gl.bindBuffer(this.type, null);
	if (this.attribute !== null) {
		VVGL.ShaderProgram.currentProgram.unsetAttribute(this.attribute);
	}
};
/**
 * Represent a model.
 * 
 * @class
 * @extends VVGL.SceneData
 * @param {VVGL.RenderMode} renderMode
 */
VVGL.Mesh = function (renderMode) {
	VVGL.SceneData.call(this, "mesh");
	renderMode = VVGL.setIfUndefined(renderMode, VVGL.RenderMode.TRIANGLES);
	
	this.verticesBuffers = [];
	this.useColor = false;
	this.useTextureCoord = false;
	this.texture = null;
	this.indices = null;
	
	this.renderMode = renderMode;
};

VVGL.Mesh.prototype = Object.create(VVGL.SceneData.prototype);

/**
 * Create an array buffer from a data array.
 * 
 * @private
 * @param {Array} data
 * @param {number} itemSize
 * @return {VVGL.ArrayBuffer} Ready-to-use array buffer.
 */
VVGL.Mesh.prototype.createFloatData = function (array, itemSize) {
	var data = new Float32Array(array);
	var arrayBuffer = new VVGL.ArrayBuffer(gl.ARRAY_BUFFER, data, itemSize);
	
	return (arrayBuffer);
};

/**
 * Create an element buffer from a data array.
 * 
 * @private
 * @param {Array} data
 * @param {number} itemSize
 * @return {VVGL.ArrayBuffer} Ready-to-use array buffer.
 */
VVGL.Mesh.prototype.createIntData = function (array) {
	var data = new Uint16Array(array);
	var elemBuffer = new VVGL.ArrayBuffer(gl.ELEMENT_ARRAY_BUFFER, data, 1);
	
	return (elemBuffer);
};

/**
 * Bind ArrayBuffers of mesh.
 * Link to attributes of current shader program.
 */
VVGL.Mesh.prototype.bindArrays = function () {
	for (var i in this.verticesBuffers) {
		this.verticesBuffers[i].bind();
	}
	if (this.indices) {
		this.indices.bind();
	}
	
	var shader = VVGL.ShaderProgram.currentProgram;
	shader.setBoolUniform("uUseColor", this.useColor);
	shader.setBoolUniform("uUseTexture", this.useTextureCoord);
	
	if (this.useTextureCoord) {
		if (this.texture === null) {
			throw new VVGL.Exception("Trying to render a textured mesh without texture.");
		}
		this.texture.activate();
	}
};

/**
 * Unbind ArrayBuffers of mesh.
 */
VVGL.Mesh.prototype.unbindArrays = function () {
	for (var i in this.verticesBuffers) {
		this.verticesBuffers[i].unbind();
	}
	if (this.indices) {
		this.indices.unbind();
	}
};

/**
 * Create positions array buffer from positions data.
 * 
 * @param {Array} positions Float array.
 */
VVGL.Mesh.prototype.addPositions = function (positions) {
	var buffer = this.createFloatData(positions, 3);
	buffer.linkToAttribute("aPosition");
	if (this.indices === null) {
		this.itemsNumber = positions.length / 3;
	}
	
	this.verticesBuffers.push(buffer);
};

/**
 * Create colors array buffer from colors data.
 * 
 * @param {Array} colors Float array.
 */
VVGL.Mesh.prototype.addColors = function (colors) {
	buffer = this.createFloatData(colors, 4);
	buffer.linkToAttribute("aColor");
	
	this.useColor = true;
	this.verticesBuffers.push(buffer);
};

/**
 * Create texture coords array buffer from texture coords data.
 * 
 * @param {Array} positions Float array.
 */
VVGL.Mesh.prototype.addTextureCoords = function (textureCoords) {
	buffer = this.createFloatData(textureCoords, 2);
	buffer.linkToAttribute("aTextureCoord");
	
	this.useTextureCoord = true;
	this.verticesBuffers.push(buffer);
};

/**
 * Create indices buffer from indices data.
 * 
 * @param {Array} indices Integer array.
 */
VVGL.Mesh.prototype.addIndices = function (indices) {
	this.indices = this.createIntData(indices);
	this.itemsNumber = indices.length;
};

/**
 * Set mesh texture. Necessary if textureCoords are used.
 * 
 * @param {VVGL.Texture} texture
 */
VVGL.Mesh.prototype.setTexture = function (texture) {
	this.texture = texture;
};

/**
 * Render mesh to scene, drawing parts.
 * 
 * @override
 */
VVGL.Mesh.prototype.render = function () {
	this.bindArrays();
	{
		if (this.indices === null) {
			gl.drawArrays(this.renderMode, 0, this.itemsNumber);
			VVGL.GLErrorException.checkError("drawArrays");
		} else {
			gl.drawElements(this.renderMode, this.itemsNumber, gl.UNSIGNED_SHORT, 0);
			VVGL.GLErrorException.checkError("drawElements");
		}
	}
	this.unbindArrays();
};

/**
 * Update mesh data.
 * In fact... Do nothing.
 * 
 * @override
 * @param {number} elapsedTime
 */
VVGL.Mesh.prototype.update = function (elapsedTime) {};
/**
 * Represent a frame rendering.
 * Used by {@link VVGL.Renderer} to create a scene frame.
 */
VVGL.FrameRender = function () {
	this.datas = [];
	this.reset();
};

/**
 * Reset frame render for new frame.
 */
VVGL.FrameRender.prototype.reset = function () {
	this.datas["camera"]	= [];
	this.datas["mesh"]		= [];
};

/**
 * Add an {@link VVGL.SceneData} to render list.
 * 
 * @param {VVGL.SceneData} data
 * @param {VVGL.Mat4} matrix Model matrix
 */
VVGL.FrameRender.prototype.addData = function (data, matrix) {
	this.datas[data.getType()].push({
		data: data,
		matrix: matrix
	});
};

/**
 * Configure perspective and view matrices from active camera.
 * 
 * @private
 * @param {VVGL.Camera} camera
 * @todo alter camera view position from its model matrix.
 */
VVGL.FrameRender.prototype.configureFromCamera = function (activeCamera) {
	for (var i in this.datas["camera"]) {
		var camera = this.datas["camera"][i];
		
		if (camera.data === activeCamera) {
			var program = VVGL.ShaderProgram.currentProgram;
			program.setMatrix4Uniform("uPerspectiveMatrix", activeCamera.getPerspective());
			program.setMatrix4Uniform("uViewMatrix", activeCamera.getView());
		};
	}
};

/**
 * Render everything.
 * 
 * @param {VVGL.Camera} camera Active camera
 */
VVGL.FrameRender.prototype.render = function (camera) {
	this.configureFromCamera(camera);
	
	for (var i in this.datas["mesh"]) {
		var program = VVGL.ShaderProgram.currentProgram; // TODO one program by mesh possible.
		var mesh = this.datas["mesh"][i];
		program.setMatrix4Uniform("uModelMatrix", mesh.matrix);
		
		mesh.data.render();
	}
};
/**
 * Webgl Renderer.
 * Graphics control panel.
 * Accessible directly from {@link VVGL.Application}.
 * 
 * @class
 */
VVGL.Renderer = function () {
	gl.enable(gl.DEPTH_TEST);
	this.backgroundColor = new VVGL.Color();
	this.setBackgroundColor(VVGL.Color.black);
	
	this.frameRender = new VVGL.FrameRender();
};

/**
 * Change canvas background color.
 * 
 * @param {VVGL.Color} color New background color.
 */
VVGL.Renderer.prototype.setBackgroundColor = function (color) {
	gl.clearColor(color.r, color.g, color.b, color.a);
	this.backgroundColor = color.clone();
};

/**
 * Prepare next frame rendering.
 * 
 * @private
 */
VVGL.Renderer.prototype.prepareFrame = function () {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

/**
 * Render a complete scene.
 * 
 * @param {VVGL.Scene} scene
 * @private
 */
VVGL.Renderer.prototype.drawScene = function (scene) {
	this.frameRender.reset();
	
	var camera = scene.getActiveCamera();
	if (camera === null) {
		throw new VVGL.Exception("No active camera for scene rendering.");
	}
	
	scene.getRoot().render(this);
	
	this.frameRender.render(camera);
};

VVGL.Renderer.prototype.addToRenderList = function (data, matrix) {
	this.frameRender.addData(data, matrix);
};
/**
 * World scene.
 * 
 * @class
 */
VVGL.Scene = function () {
	this.root = new VVGL.SceneNode(null, null);
	this.activeCamera = null;
};


/**
 * Set active camera for view and perspective matrices.
 * 
 * @param {VVGL.Camera} camera
 */
VVGL.Scene.prototype.setActiveCamera = function (camera) {
	this.activeCamera = camera;
};

/**
 * Return active camera.
 * Return null if none camera is setted.
 * 
 * @return {VVGL.Camera}
 */
VVGL.Scene.prototype.getActiveCamera = function () {
	return (this.activeCamera);
};

/**
 * Return root scene node.
 * 
 * @return {VVGL.SceneNode} Scene root node.
 */
VVGL.Scene.prototype.getRoot = function () {
	return (this.root);
};
/**
 * Manager of scenes selection.
 * 
 * @class Manager of scenes selection.
 * @constructor
 * @private
 */
VVGL.SceneManager = function () {
	this.scenes = new VVGL.Map();
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
	select = VVGL.setIfUndefined(select, false);
	
	this.scenes.add(name, scene);
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
 * @class
 * @classdesc Transformable element (base for {@link VVGL.SceneNode})
 */
VVGL.Transformable = function () {
	this.position = VVGL.Transformable.prototype.position.clone();
	this.rotation = VVGL.Transformable.prototype.rotation.clone();
	this.scaleVector = VVGL.Transformable.prototype.scaleVector.clone();
	this.matrix = new VVGL.Mat4();
	this.upToDate = true;
};

/**
 * Element position
 * 
 * @type {VVGL.Vec3}
 * @default
 */
VVGL.Transformable.prototype.position = new VVGL.Vec3(0, 0, 0);

/**
 * Element rotation angles in radians.
 * 
 * @type {VVGL.Vec3}
 * @default
 */
VVGL.Transformable.prototype.rotation = new VVGL.Vec3(0, 0, 0);

/**
 * Element scale ratios.
 * 
 * @type {VVGL.Vec3}
 * @default
 */
VVGL.Transformable.prototype.scaleVector = new VVGL.Vec3(1, 1, 1);

/**
 * Translate element.
 * 
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
VVGL.Transformable.prototype.translate = function (x, y, z) {
	this.upToDate = false;
	this.position.x += x;
	this.position.y += y;
	this.position.z += z;
};

/**
 * Translate element by vector.
 * 
 * @param {VVGL.Vec3} vector
 */
VVGL.Transformable.prototype.translateByVector = function (vector) {
	this.upToDate = false;
	this.position.add(vector);
};

/**
 * Rotate element on X axis.
 * 
 * @param {number} angle Angle in radians.
 */
VVGL.Transformable.prototype.rotateX = function (angle) {
	this.upToDate = false;
	this.rotation.x += angle;
};

/**
 * Rotate element on Y axis.
 * 
 * @param {number} angle Angle in radians.
 */
VVGL.Transformable.prototype.rotateY = function (angle) {
	this.upToDate = false;
	this.rotation.y += angle;
};

/**
 * Rotate element on Z axis.
 * 
 * @param {number} angle Angle in radians.
 */
VVGL.Transformable.prototype.rotateZ = function (angle) {
	this.upToDate = false;
	this.rotation.z += angle;
};

/**
 * Scale element size by number.
 * 
 * @param {number} n
 */
VVGL.Transformable.prototype.scaleByNumber = function (n) {
	this.upToDate = false;
	this.scaleVector.scale(n);
};

/**
 * Scale element size by vector.
 * 
 * @param {VVGL.Vec3} vector
 */
VVGL.Transformable.prototype.scaleByVector = function (vector) {
	this.upToDate = false;
	this.scaleVector.x *= vector.x;
	this.scaleVector.y *= vector.y;
	this.scaleVector.z *= vector.z;
};

/**
 * Calc model matrix from vectors.
 * 
 * @private
 */
VVGL.Transformable.prototype.calcMatrix = function () {
	this.matrix.identity();
	
	this.matrix.translate(this.position);
	this.matrix.scale(this.scaleVector);
	this.matrix.rotateX(this.rotation.x);
	this.matrix.rotateY(this.rotation.y);
	this.matrix.rotateZ(this.rotation.z);
};

/**
 * Calc if updated and return model matrix from vectors values.
 * 
 * @return {VVGL.Mat4} Model matrix.
 */
VVGL.Transformable.prototype.getMatrix = function () {
	if (!this.upToDate) {
		this.calcMatrix();
		this.upToDate = true;
	}
	
	return (this.matrix);
};
/**
 * The mother class for all node scene classes, including the scene root.
 * 
 * @class
 * @classdesc The mother class for all node scene classes.
 * @extends VVGL.Transformable
 * @param {VVGL.SceneData} data Renderable data.
 * @param {VVGL.SceneNode} parent Node parent.
 */
VVGL.SceneNode = function (data, parent) {
	VVGL.Transformable.call(this);
	data = VVGL.setIfUndefined(data, null);
	parent = VVGL.setIfUndefined(parent, null);
	this.data = data;
	this.parent = parent;
	this.children = [];
};

VVGL.SceneNode.prototype = Object.create(VVGL.Transformable.prototype);

/**
 * Node data. Must be renderable (implementing a render function).
 * 
 * @type {Object}
 */
VVGL.SceneNode.prototype.data = null;

/**
 * Scene node parent to this one.
 * Is null for and only for the root node.
 * 
 * @type {VVGL.SceneNode}
 */
VVGL.SceneNode.prototype.parent = null;

/**
 * Render node and these children to display.
 * 
 * @param {VVGL.Renderer} renderer
 */
VVGL.SceneNode.prototype.render = function (renderer) {
	if (this.data !== null) {
		renderer.addToRenderList(this.data, this.getMatrix()); // TODO matrix
	}
	
	for (var i in this.children) {
		this.children[i].render(renderer);
	}
};

/**
 * Update node data and these children's datas.
 * 
 * @param {number} elapsedTime Elapsed miliseconds from last frame.
 */
VVGL.SceneNode.prototype.update = function (elapsedTime) {
	if (this.data !== null) {
		this.data.update(elapsedTime);
	}
	
	for (var i in this.children) {
		this.children[i].update(elapsedTime);
	}
};

/**
 * Add a new child to this node.
 * 
 * @param {VVGL.SceneNode} node New child node. 
 */
VVGL.SceneNode.prototype.addChild = function (node) {
	this.children.push(node);
	node.parent = this;
};

/**
 * Return node parent.
 * 
 * @return {VVGL.SceneNode} Parent node.
 */
VVGL.SceneNode.prototype.getParent = function () {
	return (this.parent);
};

/**
 * Return node children.
 * 
 * @return {Array} Children.
 */
VVGL.SceneNode.prototype.getChildren = function () {
	return (this.children);
};
/**
 * @class
 * @classdesc Represent a shader attribute.
 * @param {VVGL.ShaderProgram} shader
 * @param {string} name
 */
VVGL.Attribute = function (shader, name) {
	this.shader = shader;
	this.name = name;
	this.location = gl.getAttribLocation(shader.program, name);
	if (this.location === -1) {
		throw new VVGL.GLRessourceException(this.shader, "Cannot reach location of attribute " + name);
	}
};

/**
 * Enable attribute.
 */
VVGL.Attribute.prototype.enable = function () {
	gl.enableVertexAttribArray(this.location);
};

/**
 * Disable attribute.
 */
VVGL.Attribute.prototype.disable = function () {
	gl.disableVertexAttribArray(this.location);
};
/**
 * Compiled vertex or fragment shader.
 * Do not try to create instances yourself.
 * Just do not.
 * 
 * @class Compiled vertex or fragment shader.
 * @constructor
 * @private
 * @param {string} code GLSL code to compile.
 * @param {number} type GL maccro corresponding to shader type (vertex or fragment).
 * @param {string} elementId Optional element id to indicate which is this shader in case of compilation failure.
 */
VVGL.Shader = function (code, type, elementId) {
	this.type = VVGL.Shader.getStringType(type);
	this.shader = gl.createShader(type);
	gl.shaderSource(this.shader, code);
	gl.compileShader(this.shader);
	
    if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
    	var message;
    	
    	if (elementId === undefined) {
    		message = "Couldn't compile " + this.type + " shader: ";
    	} else {
    		message = "Couldn't compile " + elementId + ": ";
    	}
    	throw new VVGL.GLRessourceException(this, message + gl.getShaderInfoLog(this.shader));
    }
};

/**
 * Return a shader type in a string from gl shader type enum.
 * 
 * @param {number} type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 * @return {string} Shader type name.
 */
VVGL.Shader.getStringType = function (type) {
	var name = "undefined";
	
	if (type == gl.VERTEX_SHADER) {
		name = "vertex";
	} else if (type == gl.FRAGMENT_SHADER) {
		name = "fragment";
	}
	
	return (name);
};

/**
 * Send an HTTP request for a shader file.
 * 
 * @private
 * @param {string} elementId Element id linked to file.
 * @return {Promise} Future HTTP request result.
 */
VVGL.Shader.getShaderFromHTTP = function (elementId) {
   return new Promise(function(resolve, reject){ // return a future

   });
};

/**
 * Create a shader from an element id linked to shader file.
 * 
 * @param {string} elementId Element id linked to file.
 * @param {number} type GL maccro corresponding to shader type (vertex or fragment).
 * @return {VVGL.Shader} Created shader.
 */
VVGL.Shader.createFromFile = function(elementId, type) {
	var shader;
	var code;
    var file = document.getElementById(elementId).src;
    var xhr = new XMLHttpRequest;
    xhr.open("GET", file, false);
    xhr.send(null); 

	if (xhr.status == 200) {
		shader = new VVGL.Shader(xhr.responseText, type, elementId);
	} else {
    	throw new Exception("Http request fail with error code " + xhr.status);
	}
	
	return (shader);
};

VVGL.Shader.createFronString = function (code, type) {
	return (new VVGL.Shader(code, type));
};
/**
 * Shader program containing both vertex and fragment shader.
 * Do not try to create instances from the constructor. Call static functions to create it.
 *
 * @class
 * @private
 * @param {VVGL.Shader} vertexShader Compiled vertex part of shader program.
 * @param {VVGL.Shader} fragmentShader Compiled fragment part of shader program.
 */
VVGL.ShaderProgram = function (vertexShader, fragmentShader) {
	this.attributes = [];
	this.uniforms = [];
	
	this.program = gl.createProgram();
	gl.attachShader(this.program, vertexShader.shader);
	gl.attachShader(this.program, fragmentShader.shader);
	gl.linkProgram(this.program);
	
	if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
		throw new VVGL.GLRessourceException(this, "Could not initliase shader program.");
	}
	
	this.bind();
	this.addAttribute("aPosition");
	this.addAttribute("aColor");
	this.addAttribute("aTextureCoord");

	this.addUniform("uModelMatrix");
	this.addUniform("uPerspectiveMatrix");
	this.addUniform("uViewMatrix");
	this.addUniform("uUseColor");
	this.addUniform("uUseTexture");
	this.addUniform("uTexture");
};

/**
 * Vertex part of shader program.
 * 
 * @type {VVGL.Shader}
 */
VVGL.ShaderProgram.prototype.vertexShader = null;

/**
 * Fragment part of shader program.
 * 
 * @type {VVGL.Shader}
 */
VVGL.ShaderProgram.prototype.fragmentShader = null;


/**
 * Init Attribute location.
 * 
 * @param {string} name Attribute name.
 */
VVGL.ShaderProgram.prototype.addAttribute = function (name) {
	this.attributes[name] = new VVGL.Attribute(this, name);
};

/**
 * Init Uniform location.
 * 
 * @param {string} name Uniform name.
 */
VVGL.ShaderProgram.prototype.addUniform = function (name) {
	var location = gl.getUniformLocation(this.program, name);
	if (location === -1) {
		throw new VVGL.GLRessourceException(this, "Cannot reach location of uniform " + name);
	}
	this.uniforms[name] = location;
};

/**
 * Set this shader to use.
 */
VVGL.ShaderProgram.prototype.bind = function () {
	gl.useProgram(this.program);
	VVGL.ShaderProgram.currentProgram = this;
};

/**
 * Set none shader to use.
 */
VVGL.ShaderProgram.prototype.unbind = function () {
	gl.useProgram(0);
	VVGL.ShaderProgram.currentProgram = null;
};

/**
 * Set attribute buffer.
 * 
 * @param {string} name
 * @param {VVGL.ArrayBuffer} buffer
 */
VVGL.ShaderProgram.prototype.setAttribute = function (name, buffer) {
	var attribute = this.attributes[name];
	
	if (!attribute) {
		throw new VVGL.Exception("Trying to get undefined attribute: " + name);
	}
	
	attribute.enable();
	gl.vertexAttribPointer(attribute.location, buffer.getItemSize(), gl.FLOAT, false, 0, 0);
};

/**
 * Unset attribute buffer.
 * 
 * @param {string} name
 */
VVGL.ShaderProgram.prototype.unsetAttribute = function (name) {
	var attribute = this.attributes[name];
	
	if (!attribute) {
		throw new VVGL.Exception("Trying to get undefined attribute: " + name);
	}
	
	attribute.disable();
};

/**
 * Return uniform location.
 * 
 * @private
 * @param {string} name Uniform name
 */
VVGL.ShaderProgram.prototype.getUniform = function (name) {
	var uniform = this.uniforms[name];
	
	if (uniform === undefined) {
		throw new VVGL.Exception("Trying to get undefined uniform: " + name);
	}
	
	return (uniform);
};

/**
 * Set Int or Bool uniform.
 * 
 * @param {string} name Uniform variable name.
 * @param {number} value Uniform variable value.
 */
VVGL.ShaderProgram.prototype.setIntUniform = function (name, value) {
	gl.uniform1i(this.getUniform(name), value);
};

/**
 * @see {@link VVGL.ShaderProgram.prototype.setIntUniform}
 */
VVGL.ShaderProgram.prototype.setBoolUniform = VVGL.ShaderProgram.prototype.setIntUniform;

/**
 * Set Mat4 uniform.
 * 
 * @param {string} name Uniform variable name.
 * @param {VVGL.Mat4} matrix Uniform variable value.
 */
VVGL.ShaderProgram.prototype.setMatrix4Uniform = function (name, matrix) {
	var uniform = this.getUniform(name);
	gl.uniformMatrix4fv(uniform, false, matrix.toArray());
};


/**
 * Currently used shader program.
 * 
 * @static
 * @type {VVGL.ShaderProgram}
 */
VVGL.ShaderProgram.currentProgram = null;

/**
 * Create a shader program from two element ids linked to shaders files.
 * 
 * @static
 * @param {string} vertexId Element id of vertex shader file.
 * @param {string} fragmentId Element id of fragment shader file.
 * @return {VVGL.ShaderProgram} Created program.
 */
VVGL.ShaderProgram.createFromFiles = function (vertexId, fragmentId) {
	var vertexShader = VVGL.Shader.createFromFile(vertexId, gl.VERTEX_SHADER);
	var fragmentShader = VVGL.Shader.createFromFile(fragmentId, gl.FRAGMENT_SHADER);
	
	return (new VVGL.ShaderProgram(vertexShader, fragmentShader));
};

/**
 * Create a shader program from two element ids linked to shaders scripts.
 * 
 * @static
 * @param {string} vertexId Element id of vertex shader script.
 * @param {string} fragmentId Element id of fragment shader script.
 * @return {VVGL.ShaderProgram} Program created.
 */
VVGL.ShaderProgram.createFromScripts = function (vertexId, fragmentId) {
	var vertexShader = VVGL.Shader.createFromScript(vertexId, gl.VERTEX_SHADER);
	var fragmentShader = VVGL.Shader.createFromScript(fragmentId, gl.FRAGMENT_SHADER);
	
	return (new VVGL.ShaderProgram(vertexShader, fragmentShader));
};

/**
 * Create a shader program from two strings containing shaders's codes.
 * 
 * @static
 * @param {string} vertexString Vertex shader code.
 * @param {string} fragmentString Fragment shader code.
 * @return {VVGL.ShaderProgram} Program created.
 */
VVGL.ShaderProgram.createFromStrings = function (vertexString, fragmentString) {
	var vertexShader = VVGL.Shader.createFromString(vertexString, gl.VERTEX_SHADER);
	var fragmentShader = VVGL.Shader.createFromString(fragmentString, gl.FRAGMENT_SHADER);
	
	return (new VVGL.ShaderProgram(vertexShader, fragmentShader));
};
/**
 * Create new texture from image file.
 * 
 * @class
 * @classdesc Bindable texture.
 * @implements {VVGL.IBindable}
 * @param {string} source Image file path.
 * @todo Add texture manager.
 */
VVGL.Texture = function (source) {
	var me = this;
	
	this.texture = gl.createTexture();
	this.image = new Image();
	this.image.onload = function () {me.onLoad();};
	this.image.onerror = function () {me.onError();};
	this.image.src = source;
};

VVGL.Texture.prototype = Object.create(VVGL.IBindable.prototype);

/**
 * Define this texture as used.
 */
VVGL.Texture.prototype.bind = function () {
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
};

/**
 * Define no texture as used.
 */
VVGL.Texture.prototype.unbind = function () {
	gl.bindTexture(gl.TEXTURE_2D, null);
};

/**
 * Use this texture in shader.
 * 
 * @todo Use multiple textures.
 */
VVGL.Texture.prototype.activate = function () {
	var shader = VVGL.ShaderProgram.currentProgram;
	
    gl.activeTexture(gl.TEXTURE0);
    this.bind();
    shader.setIntUniform("uTexture", 0);
};

/**
 * Called if image loading failed.
 * 
 * @private
 */
VVGL.Texture.prototype.onError = function () {
	alert("Failed to load texture " + this.image.src);
};

/**
 * Called once image finished to load.
 * 
 * @private
 */
VVGL.Texture.prototype.onLoad = function () {
	this.bind();
	{
	    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	}
    this.unbind();
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
