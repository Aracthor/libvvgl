/**
 * @class
 * @classdesc Camera free to move everywhere, moving with keyboard, turning with mouse.
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
 * Coefficient between 1 and 0 proportional to movement inertia.
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
	this.target.sub(this.forward);
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

    this.position.x += this.move.x * movementScale;
    this.position.y += this.move.y * movementScale;
    this.position.z += this.move.z * movementScale;

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
	camera.move.sub(camera.forward);
};

/**
 * Advance to back event listener.
 * 
 * @private
 * @static
 * @param {VVGL.FreeFlyCamera} camera
 */
VVGL.FreeFlyCamera.advanceBack = function (camera) {
	camera.move.add(camera.forward);
};

/**
 * Advance to right event listener.
 * 
 * @private
 * @static
 * @param {VVGL.FreeFlyCamera} camera
 */
VVGL.FreeFlyCamera.advanceRight = function (camera) {
	camera.move.sub(camera.left);
};

/**
 * Advance to left event listener.
 * 
 * @private
 * @static
 * @param {VVGL.FreeFlyCamera} camera
 */
VVGL.FreeFlyCamera.advanceLeft = function (camera) {
	camera.move.add(camera.left);
};

/**
 * Copy camera parameters to another one.
 *
 * @override
 * @param {VVGL.Camera} copy
 */
VVGL.FreeFlyCamera.prototype.copyTo = function (copy) {
    VVGL.Camera.prototype.copyTo.call(this, copy);

    copy.angleX = this.angleX;
    copy.angleY = this.angleY;
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
		camera.angleY -= y * camera.sensitivity;
		if (camera.angleY > yMax) {
			camera.angleY = yMax;
		} else if (camera.angleY < -yMax) {
			camera.angleY = -yMax;
		}
	}
};

/**
 * Create a new freefly camera with position, target and parameters from another.
 *
 * @static
 * @param {VVGL.Camera} camera Reference camera
 * @return {VVGL.FreeFlyCamera}
 */
VVGL.FreeFlyCamera.copy = function (camera) {
    var copy = new VVGL.FreeFlyCamera();

    camera.copyTo(copy);
    copy.recalcVectors();

    return (copy);
};
