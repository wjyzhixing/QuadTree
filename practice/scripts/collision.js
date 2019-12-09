
var stage;
var quadStage;
var circles;
var tree;

var CIRCLE_COUNT = 100;		//初始化显示小球个数
var bounds;
var shape;
var fps;
var showOverlay = true;		//是否显示四叉树分割图


function init()
{
	
	//判断是否能进行页面显示
	if(!(!!document.createElement('canvas').getContext))
	{
		var d = document.getElementById("canvasContainer");
		d.innerHTML = "This example requires a browser that supports the HTML5 Canvas element."
		return;
	}
	
	circles = [];
	
	//获取用户输入参数
	var check = document.getElementById("showQuadCheck");

	check.onclick = function(e)
	{
		if(e.target.checked)
		{
			showOverlay = true;
		}
		else
		{
			shape.graphics.clear();
			quadStage.update();
			showOverlay = false;
		}
	};
	
	var stop = document.getElementById("stop");
	stop.onclick = function()
	{
		Ticker.setPaused(true);
	}

	var start = document.getElementById("start");
	start.onclick = function()
	{
		Ticker.setPaused(false);
	}

	//创建四叉树
	var canvas = document.getElementById("canvas");
	var quadCanvas = document.getElementById("quadCanvas");
	quadStage = new Stage(quadCanvas);
	
	bounds = new Rectangle(0,0, quadCanvas.width, quadCanvas.height);
	
	stage = new Stage(canvas);
	shape = new Shape();
	tree = new QuadTree(bounds, false, 7);
	
	fps = new Text();
	fps.x = 10;
	fps.y = 15;
	
	stage.addChild(fps);
	
	quadStage.addChild(shape);
	
	var params = parseGetParams();
	
	var circlesParam = params.circleCount;
	if(circlesParam)
	{
		circleCount = parseInt(circlesParam);
		
		if(circleCount)
		{
			CIRCLE_COUNT = circleCount;
		}
	}	
	

	//设置小球移动属性
	initCircles();
	
	stage.update();
	quadStage.update();
	
	this.tick = tick_quad;

	Ticker.setFPS(50);
	//Ticker.setPaused(true);
	Ticker.addListener(stage);
	Ticker.addListener(window);
}

//进行圆绘制
function initCircles()
{
	var c;
	var g;
	
	var x, y;
	
	var radius;
	for(var i = 0; i < CIRCLE_COUNT; i++)
	{
		//设置小球规格
		radius = Math.ceil(Math.random() * 10) + 1;
		//********************************
		c = new Circle(bounds, radius);
		//***********************************

		x = Math.random() * bounds.width;
		y = Math.random() * bounds.height;
		
		if(x + c.width > bounds.width)
		{
			x = bounds.width - c.width - 1;
		}
		
		if(y + c.height > bounds.height)
		{
			y = bounds.height - c.height - 1;
		}
		
		c.x = x;
		c.y = y;
		
		stage.addChild(c);
		circles.push(c);
		tree.insert(c);
	}
}

function updateTree()
{
	//todo: call clear
	
	tree = new QuadTree(bounds);
	tree.insert(circles);
	
	tree.clear();
	tree.insert(circles);
}

//设置四叉树的延时时间+碰撞检测
//更新四叉树
function tick_quad()
{	
	fps.text = "Balls : " + CIRCLE_COUNT + " / " + Math.round(Ticker.getMeasuredFPS()) + " fps";
	console.log(fps.text);
	for(var k = 0; k < CIRCLE_COUNT; k++)
	{
		circles[k].update();	
	}
	updateTree();
	
	
	if(showOverlay)
	{
		renderQuad();
	}
	
	var items;
	var c;
	var len;
	var item;
	var dx, dy, radii;
	var colliding = false;
	

	for(var i = 0; i < CIRCLE_COUNT; i++)
	{
		c = circles[i];

		items = tree.retrieve(c);
		len = items.length;
		for(var j = 0; j < len; j++)
		{
			item = items[j];
			
			if(c == item)
			{
				continue;
			}
			
			if(c.isColliding && item.isColliding)
			{
				continue;
			}
			
			dx = c.x - item.x;
			dy = c.y - item.y;
			radii = c.radius + item.radius;		
			
			colliding = (( dx * dx )  + ( dy * dy )) < (radii * radii);
			
			if(!c.isColliding)
			{
				c.setIsColliding(colliding);
			}
			
			if(!item.isColliding)
			{
				item.setIsColliding(colliding);
			}
		}
	}
	stage.update();
	
	if(showOverlay)
	{
		quadStage.update();
	}
}


//另一种FPS方式，不进行运行，只做测试用
function tick_brute()
{	
	fps.text = Math.round(Ticker.getMeasuredFPS());
	for(var k = 0; k < CIRCLE_COUNT; k++)
	{
		circles[k].update();	
	}
	updateTree();
	
	
	if(showOverlay)
	{
		renderQuad();
	}
	
	var items;
	var c;
	var len;
	var item;
	var dx, dy, radii;
	var colliding = false;
	

	for(var i = 0; i < CIRCLE_COUNT; i++)
	{
		c = circles[i];

		for(var j = i + 1; j < CIRCLE_COUNT; j++)
		{
			item = circles[j];
			
			if(c == item)
			{
				continue;
			}
			
			if(c.isColliding && item.isColliding)
			{
				continue;
			}
			/**********************************/
			dx = c.x - item.x;
			dy = c.y - item.y;
			radii = c.radius + item.radius;		
			
			colliding = (( dx * dx )  + ( dy * dy )) < (radii * radii);
			/**********************************/
			if(!c.isColliding)
			{
				c.setIsColliding(colliding);
			}
			
			if(!item.isColliding)
			{
				item.setIsColliding(colliding);
			}
		}
	}
	stage.update();
	
	if(showOverlay)
	{
		quadStage.update();
	}
}


//进行四叉树线框的显示
function renderQuad()
{
	var g = shape.graphics;
	g.clear();
	g.setStrokeStyle(1);
	g.beginStroke("yellow");
	
	drawNode(tree.root);
}

//进行四叉树线框的图形设计
function drawNode(node)
{
	var bounds = node._bounds;
	var g = shape.graphics;

	g.drawRect(
			abs(bounds.x)  + 0.5,
			abs(bounds.y) + 0.5,
			bounds.width,
			bounds.height
		);
	
	var len = node.nodes.length;
	
	for(var i = 0; i < len; i++)
	{
		drawNode(node.nodes[i]);
	}
	
}

//fast Math.abs
function abs(x)
{
	return (x < 0 ? -x : x);
}

//对于数组进行字符串处理
function parseGetParams()
{
	var getData = new Array();
	var sGet = window.location.search;
	if (sGet)
	{
	    sGet = sGet.substr(1);

	    var sNVPairs = sGet.split("&");

	    for (var i = 0; i < sNVPairs.length; i++)
	    {

	        var sNV = sNVPairs[i].split("=");
	        
	        var sName = sNV[0];
	        var sValue = sNV[1];
	        getData[sName] = sValue;
	    }
	}
	
	return getData;
}

window.onload = init;