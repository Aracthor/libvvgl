/**
 * Exception base for all exception classes.
 * Every exception contains at least a message and sometimes more, depending of the type.
 * @class Exception base for all exception classes.
 * @constructor
 * @param {Object} message
 */
VVGL.Exception = function (message) {
	this.message = message;
};

/**
 * @type {string} message Error message.
 */
VVGL.Exception.prototype.message = "";

/**
 * @type {string} type Exception type.
 */
VVGL.Exception.prototype.type = "none";

/**
 * Convert Exception to a {string}.
 * 
 * @return {string} Exception details.
 */
VVGL.Exception.prototype.what = function () {
	return (this.message);
};
