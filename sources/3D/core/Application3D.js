/**
 * Super singleton manager of canvas, graphic and physic engine.
 * This class has to be instanciate only once in your program.
 * You can then access your instance with {@link VVGL.Application3D.access}
 *
 * @class
 * @classdesc Super singleton manager of canvas, graphic and physic engine.
 * @extends VVGL.Application
 * @param {string} canvasId Id of your HTML canvas.
 */
VVGL.Application3D = function (canvasId) {
    VVGL.Application.call(this, canvasId);

    this.initContext();
    this.init3DAPI();
    this.renderer = new VVGL.Renderer();
};

VVGL.Application3D.prototype = Object.create(VVGL.Application.prototype);

/**
 * Initialize WebGL context.
 *
 * @private
 */
VVGL.Application3D.prototype.initContext = function () {
    try {
        this.context = this.canvas.getContext("experimental-webgl");
    } catch (exception) {
        throw new VVGL.Exception("Cannot initialize WebGL. Sorry for that.");
    }

    this.context.viewportWidth = this.canvas.width;
    this.context.viewportHeight = this.canvas.height;
    this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl = this.context; // Singleton for easier use.
};

/**
 * Initialize lib data linked to 3D and WebGL stuff.
 *
 * @private
 */
VVGL.Application3D.prototype.init3DAPI = function () {
    VVGL.ShaderProgram.initStaticShaders();
};

/**
 * Get application WebGL renderer.
 *
 * @return {VVGL.Renderer} Application renderer.
 */
VVGL.Application3D.prototype.getRenderer = function () {
    return (this.renderer);
};


/**
 * Access application instance
 *
 * @static
 * @return {VVGL.Application3D}
 */
VVGL.Application3D.access = function () {
    return (VVGL.Application.access());
};
