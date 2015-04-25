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
	this.elapsedTime = 42; // TODO : No cheat.
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
	var listener = new VVGL.KeyEventListener();
	listener.onClick = function () {
		window.location.reload(false);
	};
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

