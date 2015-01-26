/*
 * 
 * Find more about this plugin by visiting
 * http://miniapps.co.uk/
 *
 * Copyright (c) 2010 - 2012 Alex Gibson, http://miniapps.co.uk/
 * Released under MIT license 
 * http://miniapps.co.uk/license/
 * 
 */
 
(function() {

	function WKSlider(el) {

		this.element = typeof el === 'object' ? el : document.getElementById(el);
		
		//detect support for Webkit CSS 3d transforms
		this.supportsWebkit3dTransform = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());

		//get knob width	
		this.knob = this.element.getElementsByClassName('knob')[0];
		this.knobWidth = this.knob.offsetWidth - 2;
	
		//get track width
		this.track = this.element.getElementsByClassName('track')[0];
		this.trackWidth = this.track.offsetWidth;
		this.trackOffset = this.track.offsetLeft;
	
		this.element.addEventListener('touchstart', this, false);
		this.element.addEventListener('mousedown', this, false);
	}

	WKSlider.prototype.touchstart = function(e) {
		e.preventDefault();
		this.moveKnobTo(e.targetTouches[0].pageX);
		this.element.addEventListener('touchmove', this, false);
		this.element.addEventListener('touchend', this, false);
		this.element.addEventListener('touchcancel', this, false);
	};

	WKSlider.prototype.touchmove = function(e) {
		e.preventDefault();
		this.moveKnobTo(e.targetTouches[0].pageX);
	};

	WKSlider.prototype.touchend = function(e) {
		e.preventDefault();
		this.moveKnobTo(e.changedTouches[0].pageX);
		this.element.removeEventListener('touchmove', this, false);
		this.element.removeEventListener('touchend', this, false);
		this.element.removeEventListener('touchcancel', this, false);
	};

	WKSlider.prototype.touchcancel = function(e) {
		e.preventDefault();
		this.moveKnobTo(e.changedTouches[0].pageX);
		this.element.removeEventListener('touchmove', this, false);
		this.element.removeEventListener('touchend', this, false);
		this.element.removeEventListener('touchcancel', this, false);
	};

	WKSlider.prototype.mousedown = function(e) {
		e.preventDefault();
		this.moveKnobTo(e.clientX);
		this.element.addEventListener('mousemove', this, false);
		this.element.addEventListener('mouseup', this, false);
	};

	WKSlider.prototype.mousemove = function(e) {
		e.preventDefault();
		this.moveKnobTo(e.pageX);
	};

	WKSlider.prototype.mouseup = function(e) {
		e.preventDefault();
		this.moveKnobTo(e.pageX);
		this.element.removeEventListener('mousemove', this, false);
		this.element.removeEventListener('mouseup', this, false);
	};

	//moves the slider
	WKSlider.prototype.moveKnobTo = function(x) {

		var percentage = 0,
			pos = 0;

		pos = (x - this.trackOffset + this.knobWidth / 2);
		pos = Math.min(pos, this.trackWidth);
		pos = Math.max(pos - this.knobWidth, 0);
	
		//use Webkit CSS 3d transforms for hardware acceleration if available 
		if (this.supportsWebkit3dTransform) {
			this.knob.style.webkitTransform = 'translate3d(' + pos + 'px, 0, 0)';
		}
		else {
			this.knob.style.webkitTransform = this.knob.style.MozTransform = this.knob.style.msTransform = this.knob.style.OTransform = this.knob.style.transform = 'translateX(' + pos + 'px)';
		}
	
		//return value change as a percentage
		percentage = Math.round(pos  / (this.trackWidth - this.knobWidth) * 100);
		this.callback(percentage);
	};

	//callback method will be implemented by user
	WKSlider.prototype.callback = function() {

	};

	//event handler
	WKSlider.prototype.handleEvent = function(e) {

		if (typeof(this[e.type]) === 'function' ) {
			return this[e.type](e);
		}
	};

	//public function
	window.WKSlider = WKSlider;
	
})();