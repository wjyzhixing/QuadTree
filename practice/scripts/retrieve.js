/*进行点所在象限的检测*/

var quad;
var canvas;
var stage;
var shape;
var drawColor;
var pointShape;

function init()
{
	if(!(!!document.createElement('canvas').getContext))
	{
		var d = document.getElementById("canvasContainer");
		d.innerHTML = "This example requires a browser that supports the HTML5 Canvas element."
		return;
	}	
	
	canvas = document.getElementById("canvas");

	canvas.onselectstart = function () { return false; }
	
	stage = new Stage(canvas);
	shape = new Shape();
	pointShape = new Shape();
	stage.addChild(shape);
	stage.addChild(pointShape);

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
	
	initPoints();
	renderQuad();
	stage.update();
}

//初始化1000个小球
function initPoints()
{
	for(var i = 0; i < 1000; i++)
	{
		quad.insert({x:Math.random() * canvas.width, y:Math.random() * canvas.height});
	}
}

//设置鼠标点击区域设定
function onMouseUp(e)
{
	var points = quad.retrieve({x:e.stageX, y:e.stageY});
	
	renderPoints(points);
	stage.update();
}

//设置对于点的点击划分区域
function renderPoints(points)
{
	var len = points.length;
	var g = pointShape.graphics;
	g.clear();
	var point;
	for(var i = 0; i < len; i++)
	{
		point = points[i];
		g.beginStroke(drawColor);
		g.beginFill("#FFFFFF");
		g.drawCircle(point.x, point.y,3);
	}
}

//进行四叉树设置
function renderQuad()
{
	var g = shape.graphics;
	g.clear();
	g.setStrokeStyle(1);
	g.beginStroke(drawColor);
	
	drawNode(quad.root);
	
	stage.update();
}

//绘制节点
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
			g.drawCircle(childNode.x, childNode.y,5);
		}
	}
	
	var len = node.nodes.length;
	
	for(var i = 0; i < len; i++)
	{
		drawNode(node.nodes[i]);
	}
	
}



window.onload = init;