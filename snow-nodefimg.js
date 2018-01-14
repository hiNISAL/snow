/*
 * @CreateTime: Jan 14, 2018 4:16 PM
 * @Author: NISAL
 * @Contact: 535964903@qq.com
 * @Last Modified By: NISAL
 * @Last Modified Time: Jan 14, 2018 5:05 PM
 * @Description: Modify Here, Please 
 */
function Snow(option) {
  this.wrap = document.createElement('div');    // 容器
  this.offset = 0;                              // 偏移量
  this.createSnowOffset = 0;                    // 生产雪花的时候左右偏移量
  this.clientWidth = document.body.clientWidth; // 页面宽度
  this.clientHeight = document.documentElement.clientHeight; // 页面高度
  this.count = 0;                               // 雪花总数
  this.isStop = false;                          // 标志是否要停止下雪
  this.pause = false;                           // 标志是否暂停

  this.color = '#fff';                          // 雪花颜色 默认白色
  this.opacity = 1;                             // 雪花不透明度 默认不透明
  this.randombase = 1500;                       // 生产雪花的时间间隔随值 默认1.5秒
  this.num = 8;                                 // 每次生产雪花的随机数量 默认8
  this.limit = 150;                             // 每个页面的雪花上限 默认150
  this.isOffset = true;                         // 标志是否随着鼠标产生雪花偏移 默认是
  this.stay = false;                            // 雪花是否会在底部停留 默认不停留
  this.stayTime = 1500;                         // 雪花在底部停留的时间 默认1.5秒
  this.speed = 10;                              // 雪花的下坠随机速度 默认10
  this.maxSize = 4;                             // 雪花的最大宽度 默认4
  this.maxImgSize = 30;                         // 图片雪花的最大宽度 默认30
  this.hideType = 'scale';                      // 雪花留底后消失的方式 默认缩小隐藏
  this.hideDuration = 300;                      // 雪花从开始消失到消失的持续时间 默认0.3秒
  this.isOffsetOnTouch = true;                  // 移动端是否根据手势产生偏移 默认是
  this.isPause = true;                          // 当页面失去焦点的时候是否暂停下雪 默认是

  // 进行配置判断 如果存在用户自定义的配置 则覆盖默认配置
  if (option) {
    this.color = option.color || this.color;
    this.opacity = option.opacity || this.opacity;
    this.num = option.num || this.num;
    this.limit = option.limit || this.limit;
    this.maxSize = option.maxSize || this.maxSize;
    this.maxImgSize = option.maxImgSize || this.maxImgSize;
    this.hideType = option.hideType || this.hideType;

    if (typeof option.speed === 'number') this.speed = option.speed;
    if (typeof option.offset === 'boolean') this.isOffset = option.offset;
    if (typeof option.isOffsetOnTouch === 'boolean') this.isOffsetOnTouch = option.isOffsetOnTouch;
    if (typeof option.stay === 'boolean') this.stay = option.stay;
    if (typeof option.isPause === 'boolean') this.isPause = option.isPause;
    if (typeof option.randombase === 'number') this.randombase = option.randombase;
    if (typeof option.stayTime === 'number') this.stayTime = option.stayTime;
    if (typeof option.hideDuration === 'number') this.hideDuration = option.hideDuration;

    if (option.imgurl) this.img = option.imgurl;
  }

  // 将容器插入到body末尾
  document.body.appendChild(this.wrap);

  // 保留this
  var _this = this;

  // resize事件 页面尺寸发生变化后刷新页面宽度和高度
  window.addEventListener('resize', function () {
    _this.clientWidth = document.body.clientWidth;
    _this.clientHeight = document.documentElement.clientHeight;
  });

  // 判断是否偏移
  if (this.isOffset) {
    // 如果偏移 则获取鼠标所在的页面位置 然后将位置传给setOffset方法
    window.addEventListener('mousemove', function (e) {
      var xPos = e.clientX / _this.clientWidth;
      _this.setOffset(xPos);
    });
  }

  // 判断移动端是否偏移
  if (this.isOffsetOnTouch) {
    // 如果偏移 则获取手指所在的页面位置 然后将位置传给setOffset方法
    window.addEventListener('touchmove', function(e) {
      var touch = e.touches[0];
      var xPos = touch.pageX / _this.clientWidth;
      _this.setOffset(xPos);
    });
  }
  
  // 页面获取焦点的时候开始下雪
  window.addEventListener('focus', function() {
    _this.pause = false;
  });

  // 页面失去焦点的时候暂停下雪
  window.addEventListener('blur', function() {
    _this.pause = true;
  });

  // 开始下雪
  this.createSnow();
}

// 设置偏移
Snow.prototype.setOffset = function(xPos) {
  // 判断位置 根据位置赋值给偏移量不同的值
  this.offset = (xPos - 0.5) * (xPos > 0.35 && xPos < 0.65 ? 6 : 4);

  // 判断位置 如果处于相对中间的位置 则修改生成雪花时候的位置偏移量为0
  if (xPos > 0.3 && xPos < 0.7) {
    this.createSnowOffset = 0;
    return;
  }

  // 如果处于相对两边的位置 则修改生成雪花时候的位置偏移量为为屏幕宽的一半
  this.createSnowOffset = xPos - 0.5 > 0 ? -this.clientWidth * 0.5 : this.clientWidth * 0.5;
}

// 开始下雪并持续创建雪花
Snow.prototype.createSnow = function () {

  // 保留this
  var _this = this;

  // 设置定时器
  var timer = setInterval(function () {
    // 判断是否要停止 如果是则清空定时器
    if (_this.isStop) clearInterval(timer);
    // 判断是否满足暂停条件
    if (_this.pause && _this.isPause) return;

    // 根据每次要创建的随机雪花数量进行循环创建多个雪花
    for (var i = 0; i < (parseInt(Math.random() * _this.num) + 1); i++) {
      // 如果当前的雪花数量比限制的数量要多了 则不继续创建
      if (_this.count > _this.limit) return;

      // 定义一个雪花 根据是否显示图片雪花来决定要生成的元素类型
      var snowFlake = document.createElement(_this.img ? 'img' : 'div');
      // 根据尺寸来随机生成雪花的大小
      var size = parseInt(Math.random() * (_this.img ? _this.maxImgSize : _this.maxSize)) + 6;

      // 如果是图片雪花 则给图片的src赋值
      if (_this.img) {
        snowFlake.setAttribute('src', _this.img);
      }
      // css设置
      snowFlake.style.position = 'fixed';
      snowFlake.style.top = -size + 'px';
      snowFlake.style.left = parseInt(Math.random() * _this.clientWidth) + _this.createSnowOffset + 'px';
      snowFlake.style.width = size + 'px';
      snowFlake.style.height = size + 'px';
      _this.img ? '' : snowFlake.style.borderRadius = '100%';
      _this.img ? '' : snowFlake.style.backgroundColor = _this.color;
      snowFlake.style.zIndex = '99999';
      snowFlake.style.opacity = _this.opacity;

      // 生成雪花后给总数递增
      _this.count++;

      // 添加到页面上
      _this.wrap.appendChild(snowFlake);
      // 开始移动
      _this.move(snowFlake, Math.random() * 1.5 - 1);
    }
  }, parseInt(Math.random() * 300) + _this.randombase);
}

/**
 * 移动单个雪花
 * @param {*} ele 雪花元素
 * @param {*} thisOffset 雪花移动偏移量
 */
Snow.prototype.move = function (ele, thisOffset) {
  // 保留this
  var _this = this;

  // 设置移动雪花的定时器
  var timer = setInterval(function () {
    // 判断是否要停止 如果是则停止定植期
    if (_this.isStop) clearInterval(timer);
    // 判断是否满足暂停条件
    if (_this.pause && _this.isPause) return;
    
    // 雪花下坠每次移动1个像素
    ele.style.top = parseFloat(ele.style.top) + 1 + 'px';

    // 雪花的左右偏移计算
    ele.style.left = parseFloat(ele.style.left) + _this.offset + thisOffset + 'px';

    // 计算雪花停止移动的位置
    var destoryDistence = _this.stay ? _this.clientHeight - parseInt(ele.style.height) : _this.clientHeight;
    // 如果雪花的位置大于要停止移动的位置
    if (parseInt(ele.style.top) > destoryDistence) {

      // 如果雪花要留底
      if (_this.stay) {
        // 停止定时器运行 让雪花停止运动
        clearInterval(timer);
        // 加上css3的过度动画
        ele.style.transition = 'all ' + (_this.hideDuration / 1000.0) + 's';
        // 设置定时器 多少秒后开始隐藏雪花
        setTimeout(function () {
          // 根据hidetype来决定以什么形式隐藏雪花
          _this.hideType === 'scale' ? ele.style.transform = 'scale(0, 0) rotate(360deg)' : ele.style.opacity = '0';
          // 隐藏完后对雪花进行删除 并递减雪花总量
          setTimeout(function () {
            _this.wrap.removeChild(ele);
            _this.count--;
          }, _this.hideDuration);
        }, _this.stayTime);
        return;
      }

      // 停止移动 删除元素后雪花总数递减
      _this.wrap.removeChild(ele);
      _this.count--;
      clearInterval(timer);
    }
  }, parseInt(Math.random() * 10) + _this.speed);
}

// 停止操作
Snow.prototype.stop = function() {
  // 标志停止
  this.isStop = true;
  // 移除雪花容器
  this.wrap.parentNode.removeChild(this.wrap);
}
