/**
 * @class
 * @classdesc Exception throwed on ressource initialisation fail.
 * @extends VVGL.Exception
 * @param {Object} object Ressource linked to problem.
 * @param {string} message Problem resume.
 */
VVGL.GLRessourceException = function (ressource, message) {
	VVGL.Exception.call(this, message, "GLRessourceError");
	this.ressource = ressource;
};

VVGL.GLRessourceException.prototype = Object.create(VVGL.Exception.prototype);

/**
 * Ressource linked to problem.
 * 
 * @type {Object}
 */
VVGL.GLRessourceException.prototype.ressource = null;
