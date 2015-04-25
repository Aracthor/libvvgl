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
