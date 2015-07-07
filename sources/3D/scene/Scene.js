/**
 * @class
 * @classdesc World scene.
 */
VVGL.Scene = function () {
	this.root = new VVGL.SceneNode(null);
	this.activeCamera = null;
    this.skybox = null;
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
 * Set scene skybox.
 * Can be null to cancel skybox.
 *
 * @param {VVGL.Skybox} skybox Skybox object or null to cancel it.
 */
VVGL.Scene.prototype.setSkybox = function (skybox) {
    this.skybox = skybox;
};

/**
 * Return root scene node.
 *
 * @return {VVGL.SceneNode} Scene root node.
 */
VVGL.Scene.prototype.getRoot = function () {
    return (this.root);
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
 * Return scene skybox or null if none.
 *
 * @return {VVGL.Skybox} Scene skybox.
 */
VVGL.Scene.prototype.getSkybox = function () {
    return (this.skybox);
};
