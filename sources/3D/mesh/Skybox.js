/**
 * Create a new skybox from texture resource.
 *
 * @class
 * @classdesc Textured scene skybox.
 * @extends {VVGL.Mesh}
 * @param {VVGL.GLTexture} texture Skybox-format texture.
 */
VVGL.Skybox = function (texture) {
    VVGL.Mesh.call(this, VVGL.RenderMode.TRIANGLES);
    this.modelMatrix = new VVGL.Mat4();
    this.type = "skybox";
    this.texture = texture;
    this.shader = VVGL.ShaderProgram.basicShader;
    this.addPositions(this.cubePositions());
    this.addTextureCoords(this.skyboxTextureCoords());
    this.addIndices(this.cubeIndices());
};

VVGL.Skybox.prototype = Object.create(VVGL.Mesh.prototype);

/**
 * Center skybox to camera's position.
 *
 * @param {VVGL.Camera} camera
 */
VVGL.Skybox.prototype.centerToCamera = function (camera) {
    this.modelMatrix.identity();
    this.modelMatrix.translate(camera.position);
};

/**
 * Get skybox model matrix.
 *
 * @return {VVGL.Mat4}
 */
VVGL.Skybox.prototype.getModelMatrix = function () {
    return (this.modelMatrix);
};

/**
 * Return positions vertices array.
 *
 * @private
 * @return {Array} Positions
 */
VVGL.Skybox.prototype.cubePositions = function () {
    return [
        // Front face
        -10.0,  10.0, -10.0,
        10.0,  10.0, -10.0,
        10.0,  10.0,  10.0,
        -10.0,  10.0,  10.0,

        // Back face
        -10.0, -10.0, -10.0,
        -10.0, -10.0,  10.0,
        10.0, -10.0, 10.0,
        10.0, -10.0, -10.0,

        // Top face
        -10.0, -10.0,  10.0,
        -10.0,  10.0,  10.0,
        10.0,  10.0,  10.0,
        10.0, -10.0,  10.0,

        // Bottom face
        -10.0, -10.0, -10.0,
        10.0, -10.0, -10.0,
        10.0,  10.0, -10.0,
        -10.0,  10.0, -10.0,

        // Right face
        10.0, -10.0, -10.0,
        10.0, -10.0,  10.0,
        10.0,  10.0,  10.0,
        10.0,  10.0, -10.0,

        // Left face
        -10.0, -10.0, -10.0,
        -10.0,  10.0, -10.0,
        -10.0,  10.0,  10.0,
        -10.0, -10.0,  10.0
    ];
};

/**
 * Return texture coords vertices array.
 *
 * @private
 * @return {Array} Texture coords
 */
VVGL.Skybox.prototype.skyboxTextureCoords = function () {
    return [
        // Front face
        1/4, 2/4,
        2/4, 2/4,
        2/4, 3/4,
        1/4, 3/4,

        // Back face
        4/4, 2/4,
        4/4, 3/4,
        3/4, 3/4,
        3/4, 2/4,

        // Top face
        1/4, 4/4,
        1/4, 3/4,
        2/4, 3/4,
        2/4, 4/4,

        // Bottom face
        1/4, 1/4,
        2/4, 1/4,
        2/4, 2/4,
        1/4, 2/4,

        // Right face
        3/4, 2/4,
        3/4, 3/4,
        2/4, 3/4,
        2/4, 2/4,

        // Left face
        0/4, 2/4,
        1/4, 2/4,
        1/4, 3/4,
        0/4, 3/4
    ];
};

/**
 * Return indices array.
 *
 * @private
 * @return {Array} Indices
 */
VVGL.Skybox.prototype.cubeIndices = function () {
    return [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23    // left
    ];
};
