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
