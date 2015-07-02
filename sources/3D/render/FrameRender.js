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
	this.datas["light"]		= [];
	this.datas["mesh"]		= [];
};

/**
 * Add lights datas to shader program.
 * 
 * @private
 * @param {VVGL.ShaderProgram} shader
 */
VVGL.FrameRender.prototype.addLights = function (shader) {
	for (var i in this.datas["light"]) {
		var light = this.datas["light"][i];
		
		light.sendToShader(shader);
	}
};

/**
 * Get mesh list linked to shader.
 * Create list and add it to meshes list if it doesn't exist.
 * 
 * @private
 * @param {VVGL.ShaderProgram} shader
 * @return {Object} Meshes list.
 */
VVGL.FrameRender.prototype.findShaderMeshList = function (shader) {
	for (var i in this.datas["mesh"]) {
		var meshes = this.datas["mesh"][i];
		if (meshes.shader === shader) {
			return (meshes);
		}
	}
	
	var meshes = {
		shader: shader,
		list: []
	};
	this.datas["mesh"].push(meshes);
	return (meshes);
};

/**
 * Add an {@link VVGL.SceneData} to render list.
 * 
 * @param {VVGL.SceneData} data
 * @param {VVGL.Mat4} matrix Model matrix
 */
VVGL.FrameRender.prototype.addData = function (data, matrix) {
	if (data.getType() == "mesh") {
		var datas = this.findShaderMeshList(data.getShader());
		
		datas.list.push({
			matrix: matrix,
			data: data
		});
	} else {
		this.datas[data.getType()].push(data);
	}
};

/**
 * Configure perspective and view matrices from active camera.
 * 
 * @private
 * @param {VVGL.Camera} camera
 * @return {VVGL.Mat4} View matrix
 */
VVGL.FrameRender.prototype.configureFromCamera = function (activeCamera) {
	var program = VVGL.ShaderProgram.currentProgram;
	program.setMatrix4Uniform("uPerspectiveMatrix", activeCamera.getPerspective());
	program.setMatrix4Uniform("uViewMatrix", activeCamera.getView());
	
	return (activeCamera.getView());
};

/**
 * Render everything.
 * 
 * @param {VVGL.Camera} camera Active camera
 */
VVGL.FrameRender.prototype.render = function (camera) {
	var viewMatrix = this.configureFromCamera(camera);
	var modelViewMatrix = new VVGL.Mat4();
	var normalMatrix = new VVGL.Mat3();
	
	for (var i in this.datas["mesh"]) {
		var meshes = this.datas["mesh"][i];
		var program = meshes.shader;
		var list = meshes.list;
		program.bind();
		
		this.addLights(program);
		
		for (var i in list) {
			var mesh = list[i];
			
			normalMatrix.normalFromMat4(mesh.matrix);
			normalMatrix.transpose();
			
			program.setMatrix4Uniform("uModelMatrix", mesh.matrix);
			program.setMatrix3Uniform("uNormalMatrix", normalMatrix);
			mesh.data.render();
		}
	}
};
