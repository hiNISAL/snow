/*
 * @CreateTime: Jan 14, 2018 4:15 PM
 * @Author: NISAL
 * @Contact: 535964903@qq.com
 * @Last Modified By: NISAL
 * @Last Modified Time: Jan 14, 2018 4:19 PM
 * @Description: Modify Here, Please 
 */
function Snow(option) {
  this.wrap = document.createElement('div');
  this.offset = 0;
  this.createSnowOffset = 0;
  this.clientWidth = document.body.clientWidth;
  this.clientHeight = document.documentElement.clientHeight;
  this.count = 0;
  this.isStop = false;

  this.color = '#fff';
  this.opacity = 1;
  this.randombase = 1500;
  this.num = 8;
  this.limit = 150;
  this.isOffset = true;
  this.stay = false;
  this.stayTime = 1500;
  this.speed = 10;
  this.maxSize = 4;
  this.maxImgSize = 30;
  this.hideType = 'scale';  // scale  fadeout
  this.hideDuration = 300;
  this.isOffsetOnTouch = true;

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
    if (typeof option.randombase === 'number') this.randombase = option.randombase;
    if (typeof option.stayTime === 'number') this.stayTime = option.stayTime;
    if (typeof option.hideDuration === 'number') this.hideDuration = option.hideDuration;

    if (option.imgurl) this.img = option.imgurl;
  }

  document.body.appendChild(this.wrap);

  var _this = this;

  window.addEventListener('resize', function () {
    _this.clientWidth = document.body.clientWidth;
    _this.clientHeight = document.documentElement.clientHeight;
  });

  if (this.isOffset) {
    window.addEventListener('mousemove', function (e) {
      var xPos = e.clientX / _this.clientWidth;
      _this.setOffset(xPos);
    });
  }

  if (this.isOffsetOnTouch) {
    window.addEventListener('touchmove', function(e) {
      var touch = e.touches[0];
      var xPos = touch.pageX / _this.clientWidth;
      _this.setOffset(xPos);
    });
  }

  this.createSnow();
}

Snow.prototype.setOffset = function(xPos) {
  this.offset = (xPos - 0.5) * (xPos > 0.35 && xPos < 0.65 ? 6 : 4);

  if (xPos > 0.3 && xPos < 0.7) {
    this.createSnowOffset = 0;
    return;
  }

  this.createSnowOffset = xPos - 0.5 > 0 ? -this.clientWidth * 0.5 : this.clientWidth * 0.5;
}

Snow.prototype.createSnow = function () {

  var _this = this;

  var timer = setInterval(function () {
    if (_this.isStop) clearInterval(timer);

    for (var i = 0; i < (parseInt(Math.random() * _this.num) + 1); i++) {
      if (_this.count > _this.limit) return;

      var snowFlake = document.createElement(_this.img ? 'img' : 'div');
      var size = parseInt(Math.random() * (_this.img ? _this.maxImgSize : _this.maxSize)) + 6;

      if (_this.img) {
        snowFlake.setAttribute('src', _this.img);
      }
      snowFlake.style.position = 'fixed';
      snowFlake.style.top = -size + 'px';
      snowFlake.style.left = parseInt(Math.random() * _this.clientWidth) + _this.createSnowOffset + 'px';
      snowFlake.style.width = size + 'px';
      snowFlake.style.height = size + 'px';
      _this.img ? '' : snowFlake.style.borderRadius = '100%';
      _this.img ? '' : snowFlake.style.backgroundColor = _this.color;
      snowFlake.style.zIndex = '99999';
      snowFlake.style.opacity = _this.opacity;

      _this.count++;

      _this.wrap.appendChild(snowFlake);
      _this.move(snowFlake, Math.random() * 1.5 - 1);
    }
  }, parseInt(Math.random() * 300) + _this.randombase);
}

Snow.prototype.move = function (ele, thisOffset) {
  var _this = this;
  var timer = setInterval(function () {
    if (_this.isStop) clearInterval(timer);
    
    ele.style.top = parseFloat(ele.style.top) + 1 + 'px';

    ele.style.left = parseFloat(ele.style.left) + _this.offset + thisOffset + 'px';

    var destoryDistence = _this.stay ? _this.clientHeight - parseInt(ele.style.height) : _this.clientHeight;
    if (parseInt(ele.style.top) > destoryDistence) {

      if (_this.stay) {
        clearInterval(timer);
        ele.style.transition = 'all ' + (_this.hideDuration / 1000.0) + 's';
        setTimeout(function () {
          _this.hideType === 'scale' ? ele.style.transform = 'scale(0, 0) rotate(360deg)' : ele.style.opacity = '0';
          setTimeout(function () {
            _this.wrap.removeChild(ele);
            _this.count--;
          }, _this.hideDuration);
        }, _this.stayTime);
        return;
      }

      _this.wrap.removeChild(ele);
      _this.count--;
      clearInterval(timer);
    }
  }, parseInt(Math.random() * 10) + _this.speed);
}

Snow.prototype.stop = function() {
  this.isStop = true;
  this.wrap.parentNode.removeChild(this.wrap);
}
