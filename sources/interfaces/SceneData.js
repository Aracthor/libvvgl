/**
 * Renderable data linkable to {@link VVGL.SceneNode}
 * 
 * @interface
 */
VVGL.SceneData = function () {};

/**
 * Render function to override.
 * 
 * @param {VVGL.Renderer} renderer
 */
VVGL.SceneData.prototype.render = function (renderer) {
	throw new VVGL.ImplementationException(this, "render", "SceneData");
};

/**
 * Update node data.
 * 
 * @param {number} elapsedTime Elapsed miliseconds from last frame.
 */
VVGL.SceneData.prototype.update = function (elapsedTime) {
	throw new VVGL.ImplementationException(this, "update", "SceneData");
};
