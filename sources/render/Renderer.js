/**
 * Webgl Renderer.
 * Graphics control panel.
 * Accessible directly from {@link VVGL.Application}.
 * 
 * @class
 */
VVGL.Renderer = function () {
	this.enableDepth();
	this.enableBackfaceCulling();
	gl.enable(gl.CULL_FACE);
	this.backgroundColor = new VVGL.Color();
	this.setBackgroundColor(VVGL.Color.black);
	
	this.frameRender = new VVGL.FrameRender();
};

/**
 * Change canvas background color.
 * 
 * @param {VVGL.Color} color New background color.
 */
VVGL.Renderer.prototype.setBackgroundColor = function (color) {
	gl.clearColor(color.r, color.g, color.b, color.a);
	this.backgroundColor = color.clone();
};

/**
 * Prepare next frame rendering.
 * 
 * @private
 */
VVGL.Renderer.prototype.prepareFrame = function () {
	var clearMask = gl.COLOR_BUFFER_BIT;
	
	if (this.depthTest) {
		clearMask |= gl.DEPTH_BUFFER_BIT;
	}
	gl.clear(clearMask);
};

/**
 * Render a complete scene.
 * 
 * @param {VVGL.Scene} scene
 * @private
 */
VVGL.Renderer.prototype.drawScene = function (scene) {
	this.frameRender.reset();
	
	var camera = scene.getActiveCamera();
	if (camera === null) {
		throw new VVGL.Exception("No active camera for scene rendering.");
	}
	
	scene.getRoot().render(this);
	
	this.frameRender.render(camera);
};

/**
 * Add renderable object to render list for next frame.
 * 
 * @param {VVGL.IRenderable} data Renderable node data.
 * @param {VVGL.Mat4} matrix Element's model matrix.
 */
VVGL.Renderer.prototype.addToRenderList = function (data, matrix) {
	this.frameRender.addData(data, matrix);
};

/**
 * Active depth mode.
 * Enabled by default.
 */
VVGL.Renderer.prototype.enableDepth = function () {
	this.depthTest = true;
	gl.enable(gl.DEPTH_TEST);
};

/**
 * Check if depth mode is enabled.
 * 
 * @return {boolean}
 */
VVGL.Renderer.prototype.isDepthEnabled = function () {
	return (this.depthTest);
};

/**
 * Disable depth mode.
 */
VVGL.Renderer.prototype.disableDepth = function () {
	this.depthTest = false;
	gl.disable(gl.DEPTH_TEST);
};

/**
 * Check if backface culling is enabled.
 * 
 * @return {boolean}
 */
VVGL.Renderer.prototype.isDepthEnabled = function () {
	return (this.depthTest);
};

/**
 * Active backface culling.
 * Enabled by default.
 */
VVGL.Renderer.prototype.enableBackfaceCulling = function () {
	this.backfaceCulling = true;
	gl.enable(gl.CULL_FACE);
};

/**
 * Disable backface culling.
 */
VVGL.Renderer.prototype.disableBackfaceCulling = function () {
	this.depthTest = false;
	gl.disable(gl.CULL_FACE);
};
