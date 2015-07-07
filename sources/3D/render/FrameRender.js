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
 * @param {VVGL.ShaderProgram} shader
 * @param {VVGL.Camera} camera
 */
VVGL.FrameRender.prototype.configureFromCamera = function (shader, activeCamera) {
	shader.setMatrix4Uniform("uPerspectiveMatrix", activeCamera.getPerspective());
	shader.setMatrix4Uniform("uViewMatrix", activeCamera.getView());
};

/**
 * Render skybox to screen.
 *
 * @private
 * @param {VVGL.Camera} camera
 * @param {VVGL.Skybox} skybox
 */
VVGL.FrameRender.prototype.renderSkybox = function (camera, skybox) {
    var shader = skybox.getShader();
    var renderer = VVGL.Application3D.access().getRenderer();
    var backfaceCulling = renderer.isBackfaceCullingEnabled();

    shader.bind();

    skybox.centerToCamera(camera);
    this.configureFromCamera(shader, camera);
    shader.setMatrix4Uniform("uModelMatrix", skybox.getModelMatrix());

    if (backfaceCulling) {
        renderer.disableBackfaceCulling();
    }
    skybox.render();
    if (backfaceCulling) {
        renderer.enableBackfaceCulling();
    }
};

/**
 * Render everything.
 *
 * @param {VVGL.Camera} camera Active camera
 * @param {VVGL.Skybox} skybox Scene skybox (can be null if none)
 */
VVGL.FrameRender.prototype.render = function (camera, skybox) {
	var normalMatrix = new VVGL.Mat3();

    if (skybox) {
        this.renderSkybox(camera, skybox);
        gl.clear(gl.DEPTH_BUFFER_BIT);
    }

	for (var i in this.datas["mesh"]) {
		var meshes = this.datas["mesh"][i];
		var shader = meshes.shader;
		var list = meshes.list;
		shader.bind();
        this.configureFromCamera(shader, camera);

		this.addLights(shader);
		
		for (var i in list) {
			var mesh = list[i];
			
			normalMatrix.normalFromMat4(mesh.matrix);
			normalMatrix.transpose();
			
			shader.setMatrix4Uniform("uModelMatrix", mesh.matrix);
			shader.setMatrix3Uniform("uNormalMatrix", normalMatrix);
			mesh.data.render();
		}
	}
};
