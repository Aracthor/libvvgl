/**
 * Exception throwed on abstract function use.
 * 
 * @class
 * @extends {VVGL.Exception}
 * @param {Object} object Abstract instance responsable (usually called as this).
 * @param {string} functionName Name of the missing function.
 * @param {string} className Name of the abstract class.
 */
VVGL.ImplementationException = function (linkedObject, functionName, className) {
	VVGL.Exception.call(this, "Missing implementation of " + functionName + " in object " + className + ".", "MissingImplementationError");
	this.linkedObject = linkedObject;
};

VVGL.ImplementationException.prototype = Object.create(VVGL.Exception.prototype);

/**
 * Print error message.
 * 
 * @override
 * @return {string} Error message
 */
VVGL.ImplementationException.prototype.toString = function () {
	console.log("Missing implementation object:");
	console.log(this.linkedObject);
	return (VVGL.Exception.prototype.what.call(this));
};
