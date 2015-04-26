/**
 * Represent a frame rendering.
 * Used by {@link VVGL.Renderer} to create a scene frame.
 */
VVGL.FrameRender = function () {
	this.datas = [];
	this.reset();
};

/**
 * Reset frame render for new frame.
 */
VVGL.FrameRender.prototype.reset = function () {
	this.datas["camera"]	= [];
	this.datas["mesh"]		= [];
};

/**
 * Add an {@link VVGL.SceneData} to render list.
 * 
 * @param {VVGL.SceneData} data
 * @param {VVGL.Mat4} matrix Model matrix
 */
VVGL.FrameRender.prototype.addData = function (data, matrix) {
	this.datas[data.getType()].push({
		data: data,
		matrix: matrix
	});
};

/**
 * Configure perspective and view matrices from active camera.
 * 
 * @private
 * @param {VVGL.Camera} camera
 * @todo alter camera view position from its model matrix.
 */
VVGL.FrameRender.prototype.configureFromCamera = function (activeCamera) {
	for (var i in this.datas["camera"]) {
		var camera = this.datas["camera"][i];
		
		if (camera.data === activeCamera) {
			var program = VVGL.ShaderProgram.currentProgram;
			program.setMatrix4Uniform("uPerspectiveMatrix", activeCamera.getPerspective());
			program.setMatrix4Uniform("uViewMatrix", activeCamera.getView());
		};
	}
};

/**
 * Render everything.
 * 
 * @param {VVGL.Camera} camera Active camera
 */
VVGL.FrameRender.prototype.render = function (camera) {
	this.configureFromCamera(camera);
	
	for (var i in this.datas["mesh"]) {
		var program = VVGL.ShaderProgram.currentProgram; // TODO one program by mesh possible.
		var mesh = this.datas["mesh"][i];
		program.setMatrix4Uniform("uModelMatrix", mesh.matrix);
		
		mesh.data.render();
	}
};
