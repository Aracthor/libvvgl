/**
 * Renderable data linkable to {@link VVGL.SceneNode}
 * 
 * @abstract
 * @class
 * @classdesc Renderable data.
 * @param {string} type
 */
VVGL.SceneData = function (type) {
	this.type = type;
};

/**
 * Return data type name.
 * 
 * @return {string} Data type.
 */
VVGL.SceneData.prototype.getType = function () {
	return (this.type);
};

/**
 * Update node data.
 * 
 * @param {number} elapsedTime Elapsed miliseconds from last frame.
 */
VVGL.SceneData.prototype.update = function (elapsedTime) {
	throw new VVGL.ImplementationException(this, "update", "SceneData");
};
