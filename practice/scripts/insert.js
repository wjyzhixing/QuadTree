/*插入点的测试*/

var quad;
var canvas;
var stage;
var shape;
var drawColor;

function init()
{
	if(!(!!document.createElement('canvas').getContext))
	{
		var d = document.getElementById("canvasContainer");
		d.innerHTML = "This example requires a browser that supports the HTML5 Canvas element."
		return;
	}	
	
	canvas = document.getElementById("canvas");
	
	//防止双击文本
	canvas.onselectstart = function () { return false; }
	
	stage = new Stage(canvas);
	shape = new Shape();
	stage.addChild(shape);

	drawColor = Graphics.getRGB(255,255,0);

	stage.onMouseUp = onMouseUp;
	
	var isPointQuad = true;
	quad = new QuadTree({
		x:0,
		y:0,
		width:canvas.width,
		height:canvas.height
	}, 
	isPointQuad);
}

function onMouseUp(e)
{
	quad.insert({x:e.stageX, y:e.stageY});
	renderQuad();
	stage.update();
}

function renderQuad()
{
	var g = shape.graphics;
	g.clear();
	g.setStrokeStyle(1);
	g.beginStroke(drawColor);
	
	drawNode(quad.root);
}

function drawNode(node)
{
	var bounds = node._bounds;
	var g = shape.graphics;

	g.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
	
	var cLen = node.children.length;
	var childNode;
	if(cLen)
	{
		for(var j = 0; j < cLen; j++)
		{
			childNode = node.children[j];
			g.beginStroke(drawColor);
			g.drawCircle(childNode.x, childNode.y,3);
		}
	}
	
	var len = node.nodes.length;
	
	for(var i = 0; i < len; i++)
	{
		drawNode(node.nodes[i]);
	}	
}

window.onload = init;