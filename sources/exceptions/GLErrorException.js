/**
 * @class
 * @classdesc Handle interns OpenGL errors.
 * @extends VVGL.Exception
 * @private
 */
VVGL.GLErrorException = function (func, error) {
	var message = "OpenGL error after " + func + ": " + this.interpreteError(error);
	VVGL.Exception.call(this, message);
};

VVGL.GLErrorException.prototype = Object.create(VVGL.Exception.prototype);

/**
 * Get appropriate error message from error enum.
 * 
 * @private
 * @param {number} error GLenum error id.
 */
VVGL.GLErrorException.prototype.interpreteError = function (error) {
	var errors = [];
	errors[gl.INVALID_ENUM]						= "Invalid enum";
	errors[gl.INVALID_VALUE]					= "Invalid value";
	errors[gl.INVALID_OPERATION]				= "Invalid operation";
	errors[gl.INVALID_FRAMEBUFFER_OPERATION]	= "Invalid framebuffer operation";
	errors[gl.OUT_OF_MEMORY]					= "Out of memory";
	errors[gl.STACK_UNDERFLOW]					= "Stack underflow";
	errors[gl.STACK_OVERFLOW]					= "Stack overflow";
	
	return (errors[error]);
};


/**
 * Check if something bad happened.
 * If yes, throw an exception with corresponding error message.
 * 
 * @static
 * @throws {VVGL.GLErrorException}
 */
VVGL.GLErrorException.checkError = function (func) {
	var error = gl.getError();
	if (error !== gl.NO_ERROR) {
		throw new VVGL.GLErrorException(func, error);
	}
};
