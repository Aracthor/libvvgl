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
