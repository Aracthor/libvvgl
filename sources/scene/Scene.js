/**
 * World scene.
 * 
 * @class
 */
VVGL.Scene = function () {
	this.root = new VVGL.SceneNode(null, null);
	this.activeCamera = null;
};


/**
 * Set active camera for view and perspective matrices.
 * 
 * @param {VVGL.Camera} camera
 */
VVGL.Scene.prototype.setActiveCamera = function (camera) {
	this.activeCamera = camera;
};

/**
 * Return active camera.
 * Return null if none camera is setted.
 * 
 * @return {VVGL.Camera}
 */
VVGL.Scene.prototype.getActiveCamera = function () {
	return (this.activeCamera);
};

/**
 * Return root scene node.
 * 
 * @return {VVGL.SceneNode} Scene root node.
 */
VVGL.Scene.prototype.getRoot = function () {
	return (this.root);
};
