/**
 * Create node for a renderable data.
 * 
 * @param {VVGL.Renderable} data
 */
VVGL.SceneNode = function (data) {
	this.data = data;
	this.parent = null;
	this.children = [];
	
	this.position = new VVGL.Vec2();
	this.scale = new VVGL.Vec2(1, 1, 1);
};

/**
 * @type {VVGL.SceneNode}
 * @default
 */
VVGL.SceneNode.prototype.parent = null;

/**
 * @type {VVGL.Drawable}
 * @default
 */
VVGL.SceneNode.prototype.data = null;

/**
 * @type {VVGL.Vec2}
 */
VVGL.SceneNode.prototype.position = null;

/**
 * @type {number}
 * @default
 */
VVGL.SceneNode.prototype.rotation = 0;

/**
 * @type {VVGL.Vec2}
 */
VVGL.SceneNode.prototype.scale = null;


/**
 * Add child to children list.
 * 
 * @param {VVGL.SceneNode} child
 */
VVGL.SceneNode.prototype.addChild = function (child) {
	child.parent = this;
	this.children.push(child);
};

/**
 * Draw this node and its children.
 * 
 * @param {HTMLContext} context
 */
VVGL.SceneNode.prototype.draw = function (context) {
	context.save();
	{
		context.translate(this.position.x, this.position.y);
		context.scale(this.scale.x, this.scale.y);
		context.rotate(this.rotation);
		
		if (this.data) {
			this.data.render(context);
		}
		for (var i in this.children) {
			this.children[i].draw(context);
		}
	}
	context.restore();
};
