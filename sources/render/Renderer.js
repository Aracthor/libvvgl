/**
 * Webgl Renderer.
 * Graphics control panel.
 * Accessible directly from {@link VVGL.Application}.
 * 
 * @class
 */
VVGL.Renderer = function () {
	gl.enable(gl.DEPTH_TEST);
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
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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

VVGL.Renderer.prototype.addToRenderList = function (data, matrix) {
	this.frameRender.addData(data, matrix);
};
