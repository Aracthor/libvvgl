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
 * Draw scene.
 *
 * @private
 * @override
 */
VVGL.Application2D.prototype.manageDisplay = function () {
	this.context.fillStyle = this.clearColor.toString();
	this.context.fillRect(0, 0, this.width, this.height);
	this.sceneManager.getCurrentScene().getRoot().draw(this.context);
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
