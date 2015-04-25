/**
 * Matrix calculator.
 * Linked to a matrix, making calculs only if something in parameters changed.
 * Used for avoid useless calculs for perspective, view and model matrices.
 * 
 * @class
 */
VVGL.MatrixSupervisor = function () {
	this.matrix = new VVGL.Mat4();
	this.updated = true;
};

/**
 * Get the supervised matrix.
 * Re-make all calculations if data were updated.
 * 
 * @return {VVGL.Mat4} The supervised matrix.
 */
VVGL.MatrixSupervisor.prototype.getMatrix = function () {
	if (this.updated) {
		this.calcMatrix();
		this.updated = false;
	}
	
	return (this.matrix);
};

/**
 * Re-calc supervised matrix.
 * 
 * @abstract
 */
VVGL.MatrixSupervisor.prototype.calcMatrix = function () {
	throw new VVGL.ImplementationException(this, "calcMatrix", "MatrixSupervisor");
};
