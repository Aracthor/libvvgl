/**
 * A 4x4 float matrix.
 * Created as an identity matrix.
 * 
 * @class
 */
VVGL.Mat3 = function () {
	this.data = new Float32Array(3 * 3);
	
	this.identity();
};

/**
 * Set a Mat3 to the identity matrix.
 */
VVGL.Mat3.prototype.identity = function () {
	var data = this.data;
	
	data[0] = 1; data[1] = 0; data[2] = 0;
	data[3] = 0; data[4] = 1; data[5] = 0;
	data[6] = 0; data[7] = 0; data[8] = 1;
};

/**
 * Copy matrix data to another preallocated matrix object.
 * 
 * @param {VVGL.Mat3} destination
 */
VVGL.Mat3.prototype.copyTo = function (destination) {
	for (var i = 0; i < 9; ++i) {
		destination.data[i] = this.data[i];
	}
};

/**
 * Return a copy of this matrix.
 * 
 * @return {VVGL.Mat3} Copy.
 */
VVGL.Mat3.prototype.clone = function () {
	var clone = new VVGL.Mat3();
	
	this.copyTo(clone);
	
	return (clone);
};

/**
 * Copy 4x4 matrix content to 3x3 matrix.
 * 
 * @param {VVGL.Mat4} matrix
 */
VVGL.Mat3.prototype.fromMat4 = function (matrix) {
	var dest = this.data;
	var src = matrix.data;
	
	dest[0] = src[ 0];
	dest[1] = src[ 1];
	dest[2] = src[ 2];
	dest[3] = src[ 4];
	dest[4] = src[ 5];
	dest[5] = src[ 6];
	dest[6] = src[ 8];
	dest[7] = src[ 9];
	dest[8] = src[10];
};

/**
 * Convert 4x4 matrix to 3x3 normal matrix.
 * 
 * @param {VVGL.Mat4} matrix Model matrix.
 */
VVGL.Mat3.prototype.normalFromMat4 = function (matrix) {
    var dest = this.data,
    	src = matrix.data,
    	a00 = src[0], a01 = src[1], a02 = src[2], a03 = src[3],
        a10 = src[4], a11 = src[5], a12 = src[6], a13 = src[7],
        a20 = src[8], a21 = src[9], a22 = src[10], a23 = src[11],
        a30 = src[12], a31 = src[13], a32 = src[14], a33 = src[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        delta = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (delta === 0) { 
        throw new VVGL.Exception("MATHS ERROR: Null determinant calculing normal matrix."); 
    }
    delta = 1.0 / delta;

    dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * delta;
    dest[1] = (a12 * b08 - a10 * b11 - a13 * b07) * delta;
    dest[2] = (a10 * b10 - a11 * b08 + a13 * b06) * delta;

    dest[3] = (a02 * b10 - a01 * b11 - a03 * b09) * delta;
    dest[4] = (a00 * b11 - a02 * b08 + a03 * b07) * delta;
    dest[5] = (a01 * b08 - a00 * b10 - a03 * b06) * delta;

    dest[6] = (a31 * b05 - a32 * b04 + a33 * b03) * delta;
    dest[7] = (a32 * b02 - a30 * b05 - a33 * b01) * delta;
    dest[8] = (a30 * b04 - a31 * b02 + a33 * b00) * delta;
};

/**
 * Transpose matrix data.
 * (Vertical become horizontal).
 */
VVGL.Mat3.prototype.transpose = function () {
	var data = this.data,
		data01 = data[1],
		data02 = data[2],
		data12 = data[5];
		
	data[1] = data[3];
	data[2] = data[6];
	data[3] = data01;
	data[5] = data[7];
	data[6] = data02;
	data[7] = data12;
};

/**
 * Invert matrix data.
 */
VVGL.Mat3.prototype.invert = function () {
	var data = this.data,
		a00 = data[0], a01 = data[1], a02 = data[2],
        a10 = data[3], a11 = data[4], a12 = data[5],
        a20 = data[6], a21 = data[7], a22 = data[8],
        
        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,
        
        delta = a00 * b01 + a01 * b11 + a02 * b21;
        
    if (delta === 0) {
    	throw new VVGL.Exception("MATHS ERROR: Error inversing Mat3: null deteminent");
    }
    
    delta = 1.0 / delta;
    
    data[0] = b01 * delta;
    data[1] = (-a22 * a01 + a02 * a21) * delta;
    data[2] = (a12 * a01 - a02 * a11) * delta;
    data[3] = b11 * delta;
    data[4] = (a22 * a00 - a02 * a20) * delta;
    data[5] = (-a12 * a00 + a02 * a10) * delta;
    data[6] = b21 * delta;
    data[7] = (-a21 * a00 + a01 * a20) * delta;
    data[8] = (a11 * a00 - a01 * a10) * delta;
};

/**
 * Return matrix data as float array.
 * 
 * @return {Array} data as float array.
 */
VVGL.Mat3.prototype.toArray = function () {
	return (this.data);
};

/**
 * Convert matrix data to a readable string.
 * 
 * @return {string}
 */
VVGL.Mat3.prototype.toString = function () {
	var data = this.data;
	
	return ("(" + data[0] + "," + data[1] + "," + data[2] + ")\n" +
			"(" + data[3] + "," + data[4] + "," + data[5] + ")\n" +
			"(" + data[6] + "," + data[7] + "," + data[8] + ")\n");
};
