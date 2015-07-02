/**
 * Created as an identity matrix.
 * 
 * @class
 * @classdesc A 4x4 float matrix.
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
 * Multiply matrix by another.
 * 
 * @param {VVGL.Mat4} matrix
 */
VVGL.Mat4.prototype.multiply = function (matrix) {
    var data = this.data,
    	b = matrix.data,
    	a00 =  data[0], a01 =  data[1], a02 =  data[2], a03 =  data[3],
        a10 =  data[4], a11 =  data[5], a12 =  data[6], a13 =  data[7],
        a20 =  data[8], a21 =  data[9], a22 =  data[10], a23 =  data[11],
        a30 =  data[12], a31 =  data[13], a32 =  data[14], a33 =  data[15];

    // Cache only the current line of the second matrix
    var b0  =  b[0], b1 =  b[1], b2 =  b[2], b3 =  b[3];  
     data[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
     data[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
     data[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
     data[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 =  b[4]; b1 =  b[5]; b2 =  b[6]; b3 =  b[7];
     data[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
     data[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
     data[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
     data[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 =  b[8]; b1 =  b[9]; b2 =  b[10]; b3 =  b[11];
     data[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
     data[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
     data[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
     data[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 =  b[12]; b1 =  b[13]; b2 =  b[14]; b3 =  b[15];
     data[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
     data[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
     data[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
     data[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
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
 * Copy matrix data to another preallocated matrix object.
 * 
 * @param {VVGL.Mat4} destination
 */
VVGL.Mat4.prototype.copyTo = function (destination) {
	for (var i = 0; i < 16; ++i) {
		destination.data[i] = this.data[i];
	}
};

/**
 * Return a copy of this matrix.
 * 
 * @return {VVGL.Mat4} Copy.
 */
VVGL.Mat4.prototype.clone = function () {
	var clone = new VVGL.Mat4();
	
	this.copyTo(clone);
	
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
