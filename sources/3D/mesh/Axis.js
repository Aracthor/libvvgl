/**
 * @class
 * @classdesc Mesh representing axis in 3 Dimentions.
 * @extends VVGL.Mesh
 * @param {number} length Lines length.
 */
VVGL.Axis = function (length) {
	VVGL.Mesh.call(this, VVGL.RenderMode.LINES);
	
	this.addPositions([
		0.0, 0.0, 0.0,
		length, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, length, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, length
	]);
	this.addColors([
		1.0, 0.0, 0.0, 1.0,
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		0.0, 0.0, 1.0, 1.0
	]);
};

VVGL.Axis.prototype = Object.create(VVGL.Mesh.prototype);
