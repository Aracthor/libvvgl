/**
 * Return first param, or defaultValue if param is undefined.
 * 
 * @param {Object} param undefined or not to check.
 * @param {Object} defaultValue Value to return if param is undefined.
 * @returns {Object} param if not undefined, else defaultValue.
 */
VVGL.setIfUndefined = function (param, defaultValue) {
	return (param !== undefined ? param : defaultValue);
};

/**
 * Allow multi-inheritance.
 * Return a prototype that concatenate both arguments.
 * 
 * @param {Object.prototype} prototype1
 * @param {Object.prototype} prototype2
 * @return {Object.prototype} Fusion of both.
 */
VVGL.fusionClasses = function (prototype1, prototype2) {
	var fusion = {};
	var property;
	
	for (property in prototype1) {
		if (prototype1.hasOwnProperty(property)) {
			fusion[property] = prototype1[property];
		}
	}
	
	for (property in prototype2) {
		if (prototype2.hasOwnProperty(property)) {
			if (prototype1.hasOwnProperty(property)) {
				throw new VVGL.Exception("FUSION ERROR: " + property + " present in two classes !");
			}
			fusion[property] = prototype2[property];
		}
	}
	
	return (fusion);
};
