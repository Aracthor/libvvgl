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

