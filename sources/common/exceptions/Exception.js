/**
 * Create an exception with associated message.
 * The second argument should not be used, except from another exception constructor.
 *
 * @class
 * @classdesc Exception base for all exception classes.
 * @param {string} message
 * @param {string} [name="Error"]
 */
VVGL.Exception = function (message, name) {
	Error.call(this);
	this.name = name ? name : "Error"
	this.message = message;
};

VVGL.Exception.prototype = Object.create(Error.prototype);

/**
 * Exception custom message.
 *
 * @type {string}
 */
VVGL.Exception.prototype.message = "";

/**
 * Convert Exception to a {string}.
 * 
 * @return {string} Exception details.
 */
VVGL.Exception.prototype.toString = function () {
	return (this.name + ": " + this.message);
};
