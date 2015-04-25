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
	VVGL.Exception.call(this, "Missing implementation of " + functionName + " in object " + className + ".");
	this.linkedObject = linkedObject;
	this.type = "implementation";
};

VVGL.ImplementationException.prototype = Object.create(VVGL.Exception.prototype);

/**
 * Print error message.
 * 
 * @override
 */
VVGL.ImplementationException.prototype.what = function () {
	console.log("Missing implementation object:");
	console.log(this.linkedObject);
	return (VVGL.Exception.prototype.what.call(this));
};
