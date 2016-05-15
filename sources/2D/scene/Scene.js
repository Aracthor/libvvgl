/**
 * @class
 * @classdesc World scene.
 */
VVGL.Scene = function () {
    this.root = new VVGL.SceneNode(null);
};

/**
 * Return root scene node.
 *
 * @return {VVGL.SceneNode} Scene root node.
 */
VVGL.Scene.prototype.getRoot = function () {
    return (this.root);
};
