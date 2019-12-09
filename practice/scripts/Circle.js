

function Circle(bounds, radius)
{
	Shape.call(this);
	
	this.snapToPixel = true;
	
	this._bounds = bounds;
	//****************
	this.radius = radius;
	//*****************
	this.height = this.width = this.radius * 2;
	
	
	this._vx = Circle.MAX_SPEED * Math.random() + 1;
	
	//y方向和速度
	this._vy = Circle.MAX_SPEED * Math.random() + 1;				
	
	//在x轴选取随机方向
	if(Math.random() > .5)
	{
		this._vx *= -1;
	}
	
	//在y轴选取一个随机方向
	if(Math.random() > .5)
	{
		this._vy *= -1;
	}
	
	this._draw();
}

Circle.prototype = new Shape();

Circle.prototype._bounds = null;
Circle.prototype._vx = 0;
Circle.prototype._vy = 0;
Circle.MAX_SPEED = 0;

Circle.prototype.height = 0;
Circle.prototype.width = 0;
Circle.prototype.radius = 0;
Circle.prototype.isColliding = false;

Circle.prototype._collidingCacheCanvas = null;
Circle.prototype._normalCacheCanvas = null;

Circle.prototype.update = function()
{
	this.isColliding = false;
	
	this.x += this._vx;
	this.y += this._vy;
	
	if(this.x + this.width > this._bounds.width)
	{
		this.x = this._bounds.width - this.width - 1;
		this._vx *= -1;
	}
	else if(this.x < this._bounds.x)
	{
		this.x = this._bounds.x + 1;
		this._vx *= -1;
	}
	
	if(this.y + this.height > this._bounds.height)
	{
		this.y = this._bounds.height - this.height - 1;
		this._vy *= - 1;
	}
	else if(this.y < this._bounds.y)
	{
		this.y = this._bounds.y + 1;
		this._vy *= -1;
	}
}


//在一个特定的游戏里，开始创建四叉树，并将屏幕尺寸作为参数传入（Rectangle的构造函数）
//在每一帧里，我们都先清除四叉树再用inset方法将对象插入其中。
//所有的对象都插入后，就可以遍历每个对象，得到一个可能会发生碰撞对象的list.
//然后你就可以在list里的每一个对象间用任何一种碰撞检测的算法检查碰撞，和初始化对象。
//证明碰撞
Circle.prototype.setIsColliding = function(isColliding)
{
	this.isColliding = isColliding;
	this._draw();
}

Circle.prototype._draw = function()
{
	if(this.isColliding)
	{
		if(this._collidingCacheCanvas)
		{
			this.cacheCanvas = this._collidingCacheCanvas;
			return;
		}
	}
	else
	{
		if(this._normalCacheCanvas)
		{
			this.cacheCanvas = this._normalCacheCanvas;
			return;
		}
	}
	
	var g = this.graphics;
	
	g.clear();
      //g.setStrokeStyle(10);
	g.setStrokeStyle(3);
	g.beginStroke(Graphics.getRGB(0,0,255, 0.4));
	
	if(this.isColliding)
	{
		g.beginFill("rgba(255,255,0,0.7)");
	}
	else
	{
		g.beginFill("rgb(0,255,255)");
	}
	
	g.drawCircle(this.radius, this.radius, this.radius);
	
	this.uncache();
	this.cache(-1,-1, this.width + 2, this.height + 2);

	if(this.isColliding)
	{
		this._collidingCacheCanvas = this.cacheCanvas;
	}
	else
	{
		this._normalCacheCanvas = this.cacheCanvas;
	}
}

