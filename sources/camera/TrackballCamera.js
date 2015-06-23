/**
 * @class
 * @classdesc Camera with target fixed to a point, with position turning around with mouse movements.
 * @extends VVGL.Camera
 */
VVGL.TrackballCamera = function () {
	VVGL.Camera.call(this);

    this.move = new VVGL.Vec2();

    this.addMouseButtonPressListener(VVGL.MouseButton.LEFT, new VVGL.MouseButtonEventListener(VVGL.TrackballCamera.stop));
    this.addMouseMovementListener(new VVGL.MouseMovementListener(VVGL.TrackballCamera.turn));
    this.addWheelMovementListener(new VVGL.WheelMovementListener(VVGL.TrackballCamera.zoom));

    this.recalcVectors();
};

VVGL.TrackballCamera.prototype = Object.create(VVGL.Camera.prototype);

/**
 * Distance between center and position.
 * Or radius of camera's sphere.
 *
 * @type {number}
 * @default
 */
VVGL.TrackballCamera.prototype.distance = 10;

/**
 * Horizontal and vertical rotation speeds.
 *
 * @type {number}
 * @default
 */
VVGL.TrackballCamera.prototype.rotationSpeed = 0.0001;

/**
 * Zoom speed.
 *
 * @type {number}
 * @default
 */
VVGL.TrackballCamera.prototype.zoomSpeed = 0.1;

/**
 * Coefficient between 1 and 0 proportional to movement inertia.
 *
 * @type {number}
 * @default
 */
VVGL.TrackballCamera.prototype.inertiaCoef = 0.95;

/**
 * Horizontal angle.
 * Defined in radians.
 *
 * @type {number}
 * @default
 */
VVGL.TrackballCamera.prototype.angleX = 0;

/**
 * Vertical angle.
 * Defined in radians.
 *
 * @type {number}
 * @default
 */
VVGL.TrackballCamera.prototype.angleY = 0;

/**
 * Recalc camera position from target and angles.
 *
 * @private
 * @todo Use math helper to trigonometry.
 */
VVGL.TrackballCamera.prototype.recalcVectors = function () {
    this.position.x = Math.cos(this.angleY) * Math.cos(this.angleX);
    this.position.y = Math.cos(this.angleY) * Math.sin(this.angleX);
    this.position.z = Math.sin(this.angleY);
    this.position.scale(this.distance);
    this.position.add(this.target);

    this.move.scale(this.inertiaCoef);
};

/**
 * Update camera data.
 * Move position if camera was turning,
 * update movement with inertia,
 * and recalculate other vectors.
 *
 * @override
 * @param {number} elapsedTime
 */
VVGL.TrackballCamera.prototype.update = function (elapsedTime) {
    var yMax = VVGL.Maths.PI / 2 - 0.01;
    this.angleX += this.move.x * elapsedTime;
    this.angleY += this.move.y * elapsedTime;

    if (this.angleY > yMax) {
        this.angleY = yMax;
    } else if (this.angleY < -yMax) {
        this.angleY = -yMax;
    }

    this.recalcVectors();
};

/**
 * Copy camera parameters to another one.
 *
 * @override
 * @param {VVGL.Camera} copy
 */
VVGL.TrackballCamera.prototype.copyTo = function (copy) {
    VVGL.Camera.prototype.copyTo.call(this, copy);

    copy.angleX = this.angleX;
    copy.angleY = this.angleY;
};

/**
 * Set camera zoom distance to current distance between position and target.
 */
VVGL.TrackballCamera.prototype.fixDistanceToCurrent = function () {
    this.distance = VVGL.Vec3.distance(this.position, this.target);
};


/**
 * Turn camera mouse movement listener.
 *
 * @private
 * @static
 * @param {VVGL.TrackballCamera} camera
 * @param {number} x
 * @param {number} y
 */
VVGL.TrackballCamera.turn = function (camera, x, y) {
    if (VVGL.Mouse.isLocked || VVGL.Mouse.buttonIsPressed(VVGL.MouseButton.LEFT)) {
        camera.move.x += x * camera.rotationSpeed;
        camera.move.y -= y * camera.rotationSpeed;
    }
};

/**
 * Stop camera mouse pressure listener.
 *
 * @private
 * @static
 * @param {VVGL.TrackballCamera} camera
 * @param {number} x X mouse position
 * @param {number} y Y mouse position
 */
VVGL.TrackballCamera.stop = function (camera, x, y) {
    camera.move.x = 0;
    camera.move.y = 0;
};

/**
 * Zoom camera wheel movement listener.
 *
 * @private
 * @static
 * @param {VVGL.TrackballCamera} camera
 * @param {number} x X mouse position
 * @param {number} y Y mouse position
 * @param {number} deltaX Horizontal scroll
 * @param {number} deltaY Vertical scroll
 * @param {number} deltaZ No idea
 */
VVGL.TrackballCamera.zoom = function (camera, x, y, deltaX, deltaY, deltaZ) {
    while (deltaY > 0) {
        camera.distance += camera.distance * camera.zoomSpeed;
        --deltaY;
    }
    while (deltaY < 0) {
        camera.distance -= camera.distance * camera.zoomSpeed;
        ++deltaY;
    }
};

/**
 * Create a new trackball camera with position, target and parameters from another.
 *
 * @static
 * @param {VVGL.Camera} camera Reference camera
 * @return {VVGL.TrackballCamera}
 */
VVGL.TrackballCamera.copy = function (camera) {
    var copy = new VVGL.TrackballCamera();

    camera.copyTo(copy);
    copy.fixDistanceToCurrent();
    copy.recalcVectors();

    return (copy);
};
