/**
 * The mother class for all node scene classes, including the scene root.
 * 
 * @class
 * @classdesc The mother class for all node scene classes.
 * @extends VVGL.Transformable
 * @param {VVGL.SceneData} data Renderable data.
 * @param {VVGL.SceneNode} parent Node parent.
 */
VVGL.SceneNode = function (data, parent) {
	VVGL.Transformable.call(this);
	data = VVGL.setIfUndefined(data, null);
	parent = VVGL.setIfUndefined(parent, null);
	this.data = data;
	this.parent = parent;
	this.children = [];
};

VVGL.SceneNode.prototype = Object.create(VVGL.Transformable.prototype);

/**
 * Node data. Must be renderable (implementing a render function).
 * 
 * @type {Object}
 */
VVGL.SceneNode.prototype.data = null;

/**
 * Scene node parent to this one.
 * Is null for and only for the root node.
 * 
 * @type {VVGL.SceneNode}
 */
VVGL.SceneNode.prototype.parent = null;

/**
 * Update node model matrix and its children model matrices.
 * 
 * @private
 */
VVGL.SceneNode.prototype.updateMatrix = function () {
	var matrixMother = null;
	if (this.parent !== null) {
		matrixMother = this.parent.matrix;
	}
	this.calcMatrix(matrixMother);
	
	for (var i in this.children) {
		this.children[i].updateMatrix();
	}
};

/**
 * Render node and these children to display.
 * 
 * @param {VVGL.Renderer} renderer
 */
VVGL.SceneNode.prototype.render = function (renderer) {
	if (this.data !== null) {
		renderer.addToRenderList(this.data, this.matrix);
	}
	
	for (var i in this.children) {
		this.children[i].render(renderer);
	}
};

/**
 * Update node data and these children's datas.
 * 
 * @param {number} elapsedTime Elapsed miliseconds from last frame.
 */
VVGL.SceneNode.prototype.update = function (elapsedTime) {
	if (!this.upToDate) {
		this.updateMatrix();
	}
	
	if (this.data !== null) {
		this.data.update(elapsedTime);
	}
	
	for (var i in this.children) {
		this.children[i].update(elapsedTime);
	}
};

/**
 * Add a new child to this node.
 * 
 * @param {VVGL.SceneNode} node New child node. 
 */
VVGL.SceneNode.prototype.addChild = function (node) {
	this.children.push(node);
	node.parent = this;
};

/**
 * Remove child from this node
 *
 * @param {VVGL.SceneNode} node Node to remove
 */
VVGL.SceneNode.prototype.removeChild = function (node) {
    var index = this.children.indexOf(node);
    if (index === -1) {
        throw new VVGL.Exception("Trying to remove unexisting child from node.");
    }
    this.children.slice(index, 1);
};

/**
 * Return node parent.
 * 
 * @return {VVGL.SceneNode} Parent node.
 */
VVGL.SceneNode.prototype.getParent = function () {
	return (this.parent);
};

/**
 * Return node children.
 * 
 * @return {Array} Children.
 */
VVGL.SceneNode.prototype.getChildren = function () {
	return (this.children);
};
