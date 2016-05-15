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
	throw new VVGL.ImplementationException(this, "unbind", "IBindable");
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

