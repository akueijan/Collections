/**
 * jQuery Ripples plugin v0.2.0 / http://github.com/sirxemic/jquery.ripples
 * MIT License
 * @author sirxemic / http://sirxemic.com/
 */

+function ($) {

	var gl;
	var $window = $(window); // There is only one window, so why not cache the jQuery-wrapped window?
	
	function isPercentage(str) {
		return str[str.length - 1] == '%';
	}
	
	function hasWebGLSupport() {
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		var result = context && context.getExtension('OES_texture_float') && context.getExtension('OES_texture_float_linear');
		return result;
	}
	
	var supportsWebGL = hasWebGLSupport();

	function createProgram(vertexSource, fragmentSource, uniformValues) 
	{
		function compileSource(type, source) {
			var shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw new Error('compile error: ' + gl.getShaderInfoLog(shader));
			}
			return shader;
		}
		
		var program = {};
		
		program.id = gl.createProgram();
		gl.attachShader(program.id, compileSource(gl.VERTEX_SHADER, vertexSource));
		gl.attachShader(program.id, compileSource(gl.FRAGMENT_SHADER, fragmentSource));
		gl.linkProgram(program.id);
		if (!gl.getProgramParameter(program.id, gl.LINK_STATUS)) {
			throw new Error('link error: ' + gl.getProgramInfoLog(program.id));
		}

		// Fetch the uniform and attribute locations
		program.uniforms = {};
		program.locations = {};
		gl.useProgram(program.id);
		gl.enableVertexAttribArray(0);
		var name, type, regex = /uniform (\w+) (\w+)/g, shaderCode = vertexSource + fragmentSource;
		while ((match = regex.exec(shaderCode)) != null) {
			name = match[2];
			program.locations[name] = gl.getUniformLocation(program.id, name);
		}
		
		return program;
	}
	
	function bindTexture(texture, unit) {
		gl.activeTexture(gl.TEXTURE0 + (unit || 0));
		gl.bindTexture(gl.TEXTURE_2D, texture);
	}
	
	// Extend the css
	$('head').prepend('<style>.jquery-ripples { position: relative; z-index: 0; }</style>');

	// RIPPLES CLASS DEFINITION
	// =========================

	var Ripples = function (el, options) {
		var that = this;
		
		this.$el = $(el);
		this.$el.addClass('jquery-ripples');
		
		// If this element doesn't have a background image, don't apply this effect to it
		var backgroundUrl = (/url\(["']?([^"']*)["']?\)/.exec(this.$el.css('background-image')));
		if (backgroundUrl == null) return;
		backgroundUrl = backgroundUrl[1];
		
		this.interactive = options.interactive;
		this.resolution = options.resolution || 256;
		this.textureDelta = new Float32Array([1 / this.resolution, 1 / this.resolution]);
		
		this.perturbance = options.perturbance;
		this.dropRadius = options.dropRadius;
		
		var canvas = document.createElement('canvas');
		canvas.width = this.$el.innerWidth();
		canvas.height = this.$el.innerHeight();
		this.canvas = canvas;
		this.$canvas = $(canvas);
		this.$canvas.css({
			position: 'absolute',
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			zIndex: -1
		});
		
		this.$el.append(canvas);
		this.context = gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		
		// Load extensions
		gl.getExtension('OES_texture_float');
		gl.getExtension('OES_texture_float_linear');
		
		// Init events
		$(window).on('resize', function() {
			if (that.$el.innerWidth() != that.canvas.width || that.$el.innerHeight() != that.canvas.height) {
				canvas.width = that.$el.innerWidth();
				canvas.height = that.$el.innerHeight();
			}
		});

		this.$el.on('mousemove.ripples', function(e) {
			if (that.visible && that.running && that.interactive) that.dropAtMouse(e, that.dropRadius, 0.01);
		}).on('mousedown.ripples', function(e) {
			if (that.visible && that.running && that.interactive) that.dropAtMouse(e, that.dropRadius * 1.5, 0.14);
		});
		
		this.textures = [];
		this.framebuffers = [];

		for (var i = 0; i < 2; i++) {
			var texture = gl.createTexture();
			var framebuffer = gl.createFramebuffer();
			
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
			framebuffer.width = this.resolution;
			framebuffer.height = this.resolution;

			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); 
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.resolution, this.resolution, 0, gl.RGBA, gl.FLOAT, null);

			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
			if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
				throw new Error('Rendering to this texture is not supported (incomplete framebuffer)');
			}
			
			gl.bindTexture(gl.TEXTURE_2D, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			
			this.textures.push(texture);
			this.framebuffers.push(framebuffer);
		}

		this.running = true;

		// Init GL stuff
		this.quad = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-1, -1,
			+1, -1,
			+1, +1,
			-1, +1
		]), gl.STATIC_DRAW);
		
		this.initShaders();
		
		// Init textures
		var image = new Image;
		image.crossOrigin = '';
		image.onload = function() {
			gl = that.context;
			
			function isPowerOfTwo(x) {
				return (x & (x - 1)) == 0;
			}
			
			var wrapping = (isPowerOfTwo(image.width) && isPowerOfTwo(image.height)) ? gl.REPEAT : gl.CLAMP_TO_EDGE;
			
			that.backgroundWidth = image.width;
			that.backgroundHeight = image.height;
			
			var texture = gl.createTexture();
			
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapping);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapping);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			
			that.backgroundTexture = texture;
			
			// Everything loaded successfully - hide the CSS background image
			that.$el.css('backgroundImage', 'none');
		};
		image.src = backgroundUrl;
		
		this.visible = true;
		
		// Init animation
		function step() {
			that.step();
			requestAnimationFrame(step);
		}
		
		requestAnimationFrame(step);
	};

	Ripples.DEFAULTS = {
		resolution: 256,
		dropRadius: 20,
		perturbance: 0.03,
		interactive: true
	};
	
	Ripples.prototype = {

		step: function() {
			gl = this.context;
			
			if (!this.visible || !this.backgroundTexture) return;
			
			this.computeTextureBoundaries();

			if (this.running) {
				this.update();
			}

			this.render();
		},
		
		drawQuad: function() {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
			gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
			gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		},
		
		render: function() {
			gl.viewport(0, 0, this.canvas.width, this.canvas.height);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			gl.useProgram(this.renderProgram.id);
			
			bindTexture(this.backgroundTexture, 0);
			bindTexture(this.textures[0], 1);
			
			gl.uniform2fv(this.renderProgram.locations.topLeft, this.renderProgram.uniforms.topLeft);
			gl.uniform2fv(this.renderProgram.locations.bottomRight, this.renderProgram.uniforms.bottomRight);
			gl.uniform2fv(this.renderProgram.locations.containerRatio, this.renderProgram.uniforms.containerRatio);
			gl.uniform1i(this.renderProgram.locations.samplerBackground, 0);
			gl.uniform1i(this.renderProgram.locations.samplerRipples, 1);
			
			this.drawQuad();
		},

		update: function() {
			gl.viewport(0, 0, this.resolution, this.resolution);
			
			for (var i = 0; i < 2; i++) {
				gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[i]);
				bindTexture(this.textures[1-i]);
				gl.useProgram(this.updateProgram[i].id);
				
				this.drawQuad();
			}

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		},
		
		computeTextureBoundaries: function() {
			var backgroundSize = this.$el.css('background-size');
			var backgroundAttachment = this.$el.css('background-attachment');
			var backgroundPosition = this.$el.css('background-position').split(' ');

			// Here the 'window' is the element which the background adapts to 
			// (either the chrome window or some element, depending on attachment)
			var parElement = backgroundAttachment == 'fixed' ? $window : this.$el;
			var winOffset = parElement.offset() || {left: pageXOffset, top: pageYOffset};
			var winWidth = parElement.innerWidth();
			var winHeight = parElement.innerHeight();

			// TODO: background-clip
			if (backgroundSize == 'cover') {
				var scale = Math.max(winWidth / this.backgroundWidth, winHeight / this.backgroundHeight);
				
				var backgroundWidth = this.backgroundWidth * scale;
				var backgroundHeight = this.backgroundHeight * scale;
			}
			else if (backgroundSize == 'contain') {
				var scale = Math.min(winWidth / this.backgroundWidth, winHeight / this.backgroundHeight);
				
				var backgroundWidth = this.backgroundWidth * scale;
				var backgroundHeight = this.backgroundHeight * scale;
			}
			else {
				backgroundSize = backgroundSize.split(' ');
				var backgroundWidth = backgroundSize[0] || '';
				var backgroundHeight = backgroundSize[1] || backgroundWidth;
				
				if (isPercentage(backgroundWidth)) backgroundWidth = winWidth * parseFloat(backgroundWidth) / 100;
				else if (backgroundWidth != 'auto') backgroundWidth = parseFloat(backgroundWidth);
				
				if (isPercentage(backgroundHeight)) backgroundHeight = winHeight * parseFloat(backgroundHeight) / 100;
				else if (backgroundHeight != 'auto') backgroundHeight = parseFloat(backgroundHeight);
				
				if (backgroundWidth == 'auto' && backgroundHeight == 'auto') {
					backgroundWidth = this.backgroundWidth;
					backgroundHeight = this.backgroundHeight;
				}
				else {
					if (backgroundWidth == 'auto') backgroundWidth = this.backgroundWidth * (backgroundHeight / this.backgroundHeight);
					if (backgroundHeight == 'auto') backgroundHeight = this.backgroundHeight * (backgroundWidth / this.backgroundWidth);
				}
			}
			
			// Compute backgroundX and backgroundY in page coordinates
			var backgroundX = backgroundPosition[0] || '';
			var backgroundY = backgroundPosition[1] || backgroundX;
			
			if (backgroundX == 'left') backgroundX = winOffset.left;
			else if (backgroundX == 'center') backgroundX = winOffset.left + winWidth / 2 - backgroundWidth / 2;
			else if (backgroundX == 'right') backgroundX = winOffset.left + winWidth - backgroundWidth;
			else if (isPercentage(backgroundX)) {
				backgroundX = winOffset.left + (winWidth - backgroundWidth) * parseFloat(backgroundX) / 100;
			}
			else {
				backgroundX = parseFloat(backgroundX);
			}
			
			if (backgroundY == 'top') backgroundY = winOffset.top;
			else if (backgroundY == 'center') backgroundY = winOffset.top + winHeight / 2 - backgroundHeight / 2;
			else if (backgroundY == 'bottom') backgroundY = winOffset.top + winHeight - backgroundHeight;
			else if (isPercentage(backgroundY)) {
				backgroundY = winOffset.top + (winHeight - backgroundHeight) * parseFloat(backgroundY) / 100;
			}
			else {
				backgroundY = parseFloat(backgroundY);
			}

			var elementOffset = this.$el.offset();
			
			this.renderProgram.uniforms.topLeft = new Float32Array([
				(elementOffset.left - backgroundX) / backgroundWidth,
				(elementOffset.top - backgroundY) / backgroundHeight
			]);
			this.renderProgram.uniforms.bottomRight = new Float32Array([
				this.renderProgram.uniforms.topLeft[0] + this.$el.innerWidth() / backgroundWidth,
				this.renderProgram.uniforms.topLeft[1] + this.$el.innerHeight() / backgroundHeight
			]);
			
			var maxSide = Math.max(this.canvas.width, this.canvas.height);
			
			this.renderProgram.uniforms.containerRatio = new Float32Array([
				this.canvas.width / maxSide,
				this.canvas.height / maxSide
			]);
		},
		
		initShaders: function() {
			var vertexShader = [
				'attribute vec2 vertex;',
				'varying vec2 coord;',
				'void main() {',
					'coord = vertex * 0.5 + 0.5;',
					'gl_Position = vec4(vertex, 0.0, 1.0);',
				'}'
			].join('\n');
			
			this.dropProgram = createProgram(vertexShader, [
				'precision highp float;',
				
				'const float PI = 3.141592653589793;',
				'uniform sampler2D texture;',
				'uniform vec2 center;',
				'uniform float radius;',
				'uniform float strength;',
				
				'varying vec2 coord;',
				
				'void main() {',
					'vec4 info = texture2D(texture, coord);',
					
					'float drop = max(0.0, 1.0 - length(center * 0.5 + 0.5 - coord) / radius);',
					'drop = 0.5 - cos(drop * PI) * 0.5;',
					
					'info.r += drop * strength;',
					
					'gl_FragColor = info;',
				'}'
			].join('\n'));
			
			this.updateProgram = [0,0];
			this.updateProgram[0] = createProgram(vertexShader, [
				'precision highp float;',
				
				'uniform sampler2D texture;',
				'uniform vec2 delta;',
				
				'varying vec2 coord;',
				
				'void main() {',
					'vec4 info = texture2D(texture, coord);',
					
					'vec2 dx = vec2(delta.x, 0.0);',
					'vec2 dy = vec2(0.0, delta.y);',
					
					'float average = (',
						'texture2D(texture, coord - dx).r +',
						'texture2D(texture, coord - dy).r +',
						'texture2D(texture, coord + dx).r +',
						'texture2D(texture, coord + dy).r',
					') * 0.25;',
					
					'info.g += (average - info.r) * 2.0;',
					'info.g *= 0.995;',
					'info.r += info.g;',
					
					'gl_FragColor = info;',
				'}'
			].join('\n'));
			gl.uniform2fv(this.updateProgram[0].locations.delta, this.textureDelta);
			
			this.updateProgram[1] = createProgram(vertexShader, [
				'precision highp float;',
				
				'uniform sampler2D texture;',
				'uniform vec2 delta;',
				
				'varying vec2 coord;',
				
				'void main() {',
					'vec4 info = texture2D(texture, coord);',
					
					'vec3 dx = vec3(delta.x, texture2D(texture, vec2(coord.x + delta.x, coord.y)).r - info.r, 0.0);',
					'vec3 dy = vec3(0.0, texture2D(texture, vec2(coord.x, coord.y + delta.y)).r - info.r, delta.y);',
					'info.ba = normalize(cross(dy, dx)).xz;',
					
					'gl_FragColor = info;',
				'}'
			].join('\n'));
			gl.uniform2fv(this.updateProgram[1].locations.delta, this.textureDelta);
			
			this.renderProgram = createProgram([
				'precision highp float;',
				
				'attribute vec2 vertex;',
				'uniform vec2 topLeft;',
				'uniform vec2 bottomRight;',
				'uniform vec2 containerRatio;',
				'varying vec2 ripplesCoord;',
				'varying vec2 backgroundCoord;',
				'void main() {',
					'backgroundCoord = mix(topLeft, bottomRight, vertex * 0.5 + 0.5);',
					'backgroundCoord.y = 1.0 - backgroundCoord.y;',
					'ripplesCoord = vec2(vertex.x, -vertex.y) * containerRatio * 0.5 + 0.5;',
					'gl_Position = vec4(vertex.x, -vertex.y, 0.0, 1.0);',
				'}'
			].join('\n'), [
				'precision highp float;',
				
				'uniform sampler2D samplerBackground;',
				'uniform sampler2D samplerRipples;',
				'uniform float perturbance;',
				'varying vec2 ripplesCoord;',
				'varying vec2 backgroundCoord;',
				
				'void main() {',
					'vec2 offset = -texture2D(samplerRipples, ripplesCoord).ba;',
					'float specular = pow(max(0.0, dot(offset, normalize(vec2(-0.6, 1.0)))), 4.0);',
					'gl_FragColor = texture2D(samplerBackground, backgroundCoord + offset * perturbance) + specular;',
				'}'
			].join('\n'));
			gl.uniform1f(this.renderProgram.locations.perturbance, this.perturbance);
		},
		
		dropAtMouse: function(e, radius, strength) {
			this.drop(
				e.pageX - this.$el.offset().left,
				e.pageY - this.$el.offset().top,
				radius, 
				strength
			);
		},
		
		drop: function(x, y, radius, strength) {
			var that = this;

			gl = this.context;

			var elWidth = this.$el.outerWidth();
			var elHeight = this.$el.outerHeight();
			var longestSide = Math.max(elWidth, elHeight);
			
			radius = radius / longestSide;
			
			var dropPosition = new Float32Array([
				(2 * x - elWidth) / longestSide, 
				(elHeight - 2 * y) / longestSide
			]);

			gl.viewport(0, 0, this.resolution, this.resolution);
			
			// Render onto texture/framebuffer 0
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[0]);
			
			// Using texture 1
			bindTexture(this.textures[1]);

			gl.useProgram(this.dropProgram.id);
			gl.uniform2fv(this.dropProgram.locations.center, dropPosition);
			gl.uniform1f(this.dropProgram.locations.radius, radius);
			gl.uniform1f(this.dropProgram.locations.strength, strength);
			
			this.drawQuad();
			
			// Switch textures
			var t = this.framebuffers[0]; this.framebuffers[0] = this.framebuffers[1]; this.framebuffers[1] = t;
			t = this.textures[0]; this.textures[0] = this.textures[1]; this.textures[1] = t;
			
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		},
		
		// Actions
		destroy: function() {
			this.canvas.remove();
			this.$el.off('.ripples');
			this.$el.css('backgroundImage', '');
			this.$el.removeClass('jquery-ripples').removeData('ripples');
		},
		
		show: function() {
			this.$canvas.show();
			this.$el.css('backgroundImage', 'none');
			this.visible = true;
		},
		
		hide: function() {
			this.$canvas.hide();
			this.$el.css('backgroundImage', '');
			this.visible = false;
		},

		pause: function() {
			this.running = false;
		},
		
		play: function() {
			this.running = true;
		},
		
		set: function(property, value)
		{
			switch (property)
			{
				case 'interactive': 
					this.interactive = value;
					break;
			}
		}
	};

	// RIPPLES PLUGIN DEFINITION
	// ==========================

	var old = $.fn.ripples;

	$.fn.ripples = function(option) {
		if (!supportsWebGL) throw new Error('Your browser does not support at least one of the following: WebGL, OES_texture_float extension, OES_texture_float_linear extension.');

		var args = (arguments.length > 1) ? Array.prototype.slice.call(arguments, 1) : undefined;

		return this.each(function() {
			var $this   = $(this);
			var data    = $this.data('ripples');
			var options = $.extend({}, Ripples.DEFAULTS, $this.data(), typeof option == 'object' && option);

			if (!data && typeof option == 'string') return;
			if (!data) $this.data('ripples', (data = new Ripples(this, options)));
			else if (typeof option == 'string') Ripples.prototype[option].apply(data, args);
		});
	}

	$.fn.ripples.Constructor = Ripples;


	// RIPPLES NO CONFLICT
	// ====================

	$.fn.ripples.noConflict = function() {
		$.fn.ripples = old;
		return this;
	}

}(window.jQuery);

/*
Water ripple effect

Original code (Java) by Neil Wallis
Code snipplet adapted to Javascript by Sergey Chikuyonok
Code re-written as jQuery plugin by Niklas Knaack

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

!function(){function a(a,b){function z(){e=new Image,e.onload=function(){B()},e.src=c.image}function A(){y.drawImage(e,0,0),t=y.getImageData(0,0,h,i),s=y.getImageData(0,0,h,i),u=s.data,v=t.data}function B(){A();for(var a=0;a<l;a++)r[a]=q[a]=0;C(),c.auto&&(g=setInterval(function(){E(Math.random()*h,Math.random()*i)},f),E(Math.random()*h,Math.random()*i))}function C(){requestAnimFrame(C),D()}function D(){var a;a=m,m=n,n=a,a=0,o=m;for(var b=0;b<i;b++)for(var c=0;c<h;c++){var d=q[o-h]+q[o+h]+q[o-1]+q[o+1]>>1;d-=q[n+a],d-=d>>5,q[n+a]=d,d=1024-d;var e=r[a];if(r[a]=d,e!=d){var f=((c-j)*d/1024<<0)+j,g=((b-k)*d/1024<<0)+k;f>=h&&(f=h-1),f<0&&(f=0),g>=i&&(g=i-1),g<0&&(g=0);var l=4*(f+g*h),p=4*a;u[p]=v[l],u[p+1]=v[l+1],u[p+2]=v[l+2]}++o,++a}y.putImageData(s,0,0)}function E(a,b){a<<=0,b<<=0;for(var c=b-p,d=b+p;c<d;c++)for(var e=a-p,f=a+p;e<f;e++)q[m+c*h+e]+=512}var c={image:"",rippleRadius:3,width:480,height:480,delay:1,auto:!0};if(void 0!==b)for(var d in b)b.hasOwnProperty(d)&&c.hasOwnProperty(d)&&(c[d]=b[d]);if(!c.image.length)return!1;var e,g,s,t,u,v,f=1e3*c.delay,h=c.width,i=c.height,j=h/2,k=i/2,l=h*(i+2)*2,m=h,n=h*(i+3),o=0,p=c.rippleRadius,q=[],r=[],w=document.createElement("div");w.style.width=h+"px",w.style.height=i+"px",a.appendChild(w);var x=document.createElement("canvas");x.width=h,x.height=i,w.appendChild(x);var y=x.getContext("2d");y.fillStyle=c.bgColor,y.fillRect(0,0,h,i),window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(a){window.setTimeout(a,1e3/60)}}(),this.disturb=function(a,b){E(a,b)},z()}window.WaterRippleEffect=a}(),"undefined"!=typeof jQuery&&!function(a){a.fn.waterRippleEffect=function(b){var c=arguments;return this.each(function(){if(a.data(this,"plugin_WaterRippleEffect")){var d=a.data(this,"plugin_WaterRippleEffect");d[b]?d[b].apply(this,Array.prototype.slice.call(c,1)):a.error("Method "+b+" does not exist on jQuery.waterRippleEffect")}else a.data(this,"plugin_WaterRippleEffect",new WaterRippleEffect(this,b))})}}(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5yaXBwbGVzLmpzIiwianF1ZXJ5LndhdGVycmlwcGxlZWZmZWN0Lm1pbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImxpYi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogalF1ZXJ5IFJpcHBsZXMgcGx1Z2luIHYwLjIuMCAvIGh0dHA6Ly9naXRodWIuY29tL3NpcnhlbWljL2pxdWVyeS5yaXBwbGVzXG4gKiBNSVQgTGljZW5zZVxuICogQGF1dGhvciBzaXJ4ZW1pYyAvIGh0dHA6Ly9zaXJ4ZW1pYy5jb20vXG4gKi9cblxuK2Z1bmN0aW9uICgkKSB7XG5cblx0dmFyIGdsO1xuXHR2YXIgJHdpbmRvdyA9ICQod2luZG93KTsgLy8gVGhlcmUgaXMgb25seSBvbmUgd2luZG93LCBzbyB3aHkgbm90IGNhY2hlIHRoZSBqUXVlcnktd3JhcHBlZCB3aW5kb3c/XG5cdFxuXHRmdW5jdGlvbiBpc1BlcmNlbnRhZ2Uoc3RyKSB7XG5cdFx0cmV0dXJuIHN0cltzdHIubGVuZ3RoIC0gMV0gPT0gJyUnO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBoYXNXZWJHTFN1cHBvcnQoKSB7XG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJykgfHwgY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuXHRcdHZhciByZXN1bHQgPSBjb250ZXh0ICYmIGNvbnRleHQuZ2V0RXh0ZW5zaW9uKCdPRVNfdGV4dHVyZV9mbG9hdCcpICYmIGNvbnRleHQuZ2V0RXh0ZW5zaW9uKCdPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXInKTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cdFxuXHR2YXIgc3VwcG9ydHNXZWJHTCA9IGhhc1dlYkdMU3VwcG9ydCgpO1xuXG5cdGZ1bmN0aW9uIGNyZWF0ZVByb2dyYW0odmVydGV4U291cmNlLCBmcmFnbWVudFNvdXJjZSwgdW5pZm9ybVZhbHVlcykgXG5cdHtcblx0XHRmdW5jdGlvbiBjb21waWxlU291cmNlKHR5cGUsIHNvdXJjZSkge1xuXHRcdFx0dmFyIHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcblx0XHRcdGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XG5cdFx0XHRnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XG5cdFx0XHRpZiAoIWdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2NvbXBpbGUgZXJyb3I6ICcgKyBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHNoYWRlcjtcblx0XHR9XG5cdFx0XG5cdFx0dmFyIHByb2dyYW0gPSB7fTtcblx0XHRcblx0XHRwcm9ncmFtLmlkID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuXHRcdGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLmlkLCBjb21waWxlU291cmNlKGdsLlZFUlRFWF9TSEFERVIsIHZlcnRleFNvdXJjZSkpO1xuXHRcdGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLmlkLCBjb21waWxlU291cmNlKGdsLkZSQUdNRU5UX1NIQURFUiwgZnJhZ21lbnRTb3VyY2UpKTtcblx0XHRnbC5saW5rUHJvZ3JhbShwcm9ncmFtLmlkKTtcblx0XHRpZiAoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbS5pZCwgZ2wuTElOS19TVEFUVVMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2xpbmsgZXJyb3I6ICcgKyBnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtLmlkKSk7XG5cdFx0fVxuXG5cdFx0Ly8gRmV0Y2ggdGhlIHVuaWZvcm0gYW5kIGF0dHJpYnV0ZSBsb2NhdGlvbnNcblx0XHRwcm9ncmFtLnVuaWZvcm1zID0ge307XG5cdFx0cHJvZ3JhbS5sb2NhdGlvbnMgPSB7fTtcblx0XHRnbC51c2VQcm9ncmFtKHByb2dyYW0uaWQpO1xuXHRcdGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KDApO1xuXHRcdHZhciBuYW1lLCB0eXBlLCByZWdleCA9IC91bmlmb3JtIChcXHcrKSAoXFx3KykvZywgc2hhZGVyQ29kZSA9IHZlcnRleFNvdXJjZSArIGZyYWdtZW50U291cmNlO1xuXHRcdHdoaWxlICgobWF0Y2ggPSByZWdleC5leGVjKHNoYWRlckNvZGUpKSAhPSBudWxsKSB7XG5cdFx0XHRuYW1lID0gbWF0Y2hbMl07XG5cdFx0XHRwcm9ncmFtLmxvY2F0aW9uc1tuYW1lXSA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLmlkLCBuYW1lKTtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHByb2dyYW07XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGJpbmRUZXh0dXJlKHRleHR1cmUsIHVuaXQpIHtcblx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgKHVuaXQgfHwgMCkpO1xuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleHR1cmUpO1xuXHR9XG5cdFxuXHQvLyBFeHRlbmQgdGhlIGNzc1xuXHQkKCdoZWFkJykucHJlcGVuZCgnPHN0eWxlPi5qcXVlcnktcmlwcGxlcyB7IHBvc2l0aW9uOiByZWxhdGl2ZTsgei1pbmRleDogMDsgfTwvc3R5bGU+Jyk7XG5cblx0Ly8gUklQUExFUyBDTEFTUyBERUZJTklUSU9OXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHR2YXIgUmlwcGxlcyA9IGZ1bmN0aW9uIChlbCwgb3B0aW9ucykge1xuXHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcblx0XHR0aGlzLiRlbCA9ICQoZWwpO1xuXHRcdHRoaXMuJGVsLmFkZENsYXNzKCdqcXVlcnktcmlwcGxlcycpO1xuXHRcdFxuXHRcdC8vIElmIHRoaXMgZWxlbWVudCBkb2Vzbid0IGhhdmUgYSBiYWNrZ3JvdW5kIGltYWdlLCBkb24ndCBhcHBseSB0aGlzIGVmZmVjdCB0byBpdFxuXHRcdHZhciBiYWNrZ3JvdW5kVXJsID0gKC91cmxcXChbXCInXT8oW15cIiddKilbXCInXT9cXCkvLmV4ZWModGhpcy4kZWwuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJykpKTtcblx0XHRpZiAoYmFja2dyb3VuZFVybCA9PSBudWxsKSByZXR1cm47XG5cdFx0YmFja2dyb3VuZFVybCA9IGJhY2tncm91bmRVcmxbMV07XG5cdFx0XG5cdFx0dGhpcy5pbnRlcmFjdGl2ZSA9IG9wdGlvbnMuaW50ZXJhY3RpdmU7XG5cdFx0dGhpcy5yZXNvbHV0aW9uID0gb3B0aW9ucy5yZXNvbHV0aW9uIHx8IDI1Njtcblx0XHR0aGlzLnRleHR1cmVEZWx0YSA9IG5ldyBGbG9hdDMyQXJyYXkoWzEgLyB0aGlzLnJlc29sdXRpb24sIDEgLyB0aGlzLnJlc29sdXRpb25dKTtcblx0XHRcblx0XHR0aGlzLnBlcnR1cmJhbmNlID0gb3B0aW9ucy5wZXJ0dXJiYW5jZTtcblx0XHR0aGlzLmRyb3BSYWRpdXMgPSBvcHRpb25zLmRyb3BSYWRpdXM7XG5cdFx0XG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdGNhbnZhcy53aWR0aCA9IHRoaXMuJGVsLmlubmVyV2lkdGgoKTtcblx0XHRjYW52YXMuaGVpZ2h0ID0gdGhpcy4kZWwuaW5uZXJIZWlnaHQoKTtcblx0XHR0aGlzLmNhbnZhcyA9IGNhbnZhcztcblx0XHR0aGlzLiRjYW52YXMgPSAkKGNhbnZhcyk7XG5cdFx0dGhpcy4kY2FudmFzLmNzcyh7XG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcblx0XHRcdGxlZnQ6IDAsXG5cdFx0XHR0b3A6IDAsXG5cdFx0XHRyaWdodDogMCxcblx0XHRcdGJvdHRvbTogMCxcblx0XHRcdHpJbmRleDogLTFcblx0XHR9KTtcblx0XHRcblx0XHR0aGlzLiRlbC5hcHBlbmQoY2FudmFzKTtcblx0XHR0aGlzLmNvbnRleHQgPSBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpIHx8IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcblx0XHRcblx0XHQvLyBMb2FkIGV4dGVuc2lvbnNcblx0XHRnbC5nZXRFeHRlbnNpb24oJ09FU190ZXh0dXJlX2Zsb2F0Jyk7XG5cdFx0Z2wuZ2V0RXh0ZW5zaW9uKCdPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXInKTtcblx0XHRcblx0XHQvLyBJbml0IGV2ZW50c1xuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAodGhhdC4kZWwuaW5uZXJXaWR0aCgpICE9IHRoYXQuY2FudmFzLndpZHRoIHx8IHRoYXQuJGVsLmlubmVySGVpZ2h0KCkgIT0gdGhhdC5jYW52YXMuaGVpZ2h0KSB7XG5cdFx0XHRcdGNhbnZhcy53aWR0aCA9IHRoYXQuJGVsLmlubmVyV2lkdGgoKTtcblx0XHRcdFx0Y2FudmFzLmhlaWdodCA9IHRoYXQuJGVsLmlubmVySGVpZ2h0KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLiRlbC5vbignbW91c2Vtb3ZlLnJpcHBsZXMnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRpZiAodGhhdC52aXNpYmxlICYmIHRoYXQucnVubmluZyAmJiB0aGF0LmludGVyYWN0aXZlKSB0aGF0LmRyb3BBdE1vdXNlKGUsIHRoYXQuZHJvcFJhZGl1cywgMC4wMSk7XG5cdFx0fSkub24oJ21vdXNlZG93bi5yaXBwbGVzJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYgKHRoYXQudmlzaWJsZSAmJiB0aGF0LnJ1bm5pbmcgJiYgdGhhdC5pbnRlcmFjdGl2ZSkgdGhhdC5kcm9wQXRNb3VzZShlLCB0aGF0LmRyb3BSYWRpdXMgKiAxLjUsIDAuMTQpO1xuXHRcdH0pO1xuXHRcdFxuXHRcdHRoaXMudGV4dHVyZXMgPSBbXTtcblx0XHR0aGlzLmZyYW1lYnVmZmVycyA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAyOyBpKyspIHtcblx0XHRcdHZhciB0ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHRcdFx0dmFyIGZyYW1lYnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcblx0XHRcdFxuXHRcdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZWJ1ZmZlcik7XG5cdFx0XHRmcmFtZWJ1ZmZlci53aWR0aCA9IHRoaXMucmVzb2x1dGlvbjtcblx0XHRcdGZyYW1lYnVmZmVyLmhlaWdodCA9IHRoaXMucmVzb2x1dGlvbjtcblxuXHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSk7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7IFxuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XG5cdFx0XHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIHRoaXMucmVzb2x1dGlvbiwgdGhpcy5yZXNvbHV0aW9uLCAwLCBnbC5SR0JBLCBnbC5GTE9BVCwgbnVsbCk7XG5cblx0XHRcdGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSwgMCk7XG5cdFx0XHRpZiAoZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUikgIT0gZ2wuRlJBTUVCVUZGRVJfQ09NUExFVEUpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdSZW5kZXJpbmcgdG8gdGhpcyB0ZXh0dXJlIGlzIG5vdCBzdXBwb3J0ZWQgKGluY29tcGxldGUgZnJhbWVidWZmZXIpJyk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xuXHRcdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcblx0XHRcdFxuXHRcdFx0dGhpcy50ZXh0dXJlcy5wdXNoKHRleHR1cmUpO1xuXHRcdFx0dGhpcy5mcmFtZWJ1ZmZlcnMucHVzaChmcmFtZWJ1ZmZlcik7XG5cdFx0fVxuXG5cdFx0dGhpcy5ydW5uaW5nID0gdHJ1ZTtcblxuXHRcdC8vIEluaXQgR0wgc3R1ZmZcblx0XHR0aGlzLnF1YWQgPSBnbC5jcmVhdGVCdWZmZXIoKTtcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5xdWFkKTtcblx0XHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShbXG5cdFx0XHQtMSwgLTEsXG5cdFx0XHQrMSwgLTEsXG5cdFx0XHQrMSwgKzEsXG5cdFx0XHQtMSwgKzFcblx0XHRdKSwgZ2wuU1RBVElDX0RSQVcpO1xuXHRcdFxuXHRcdHRoaXMuaW5pdFNoYWRlcnMoKTtcblx0XHRcblx0XHQvLyBJbml0IHRleHR1cmVzXG5cdFx0dmFyIGltYWdlID0gbmV3IEltYWdlO1xuXHRcdGltYWdlLmNyb3NzT3JpZ2luID0gJyc7XG5cdFx0aW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRnbCA9IHRoYXQuY29udGV4dDtcblx0XHRcdFxuXHRcdFx0ZnVuY3Rpb24gaXNQb3dlck9mVHdvKHgpIHtcblx0XHRcdFx0cmV0dXJuICh4ICYgKHggLSAxKSkgPT0gMDtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0dmFyIHdyYXBwaW5nID0gKGlzUG93ZXJPZlR3byhpbWFnZS53aWR0aCkgJiYgaXNQb3dlck9mVHdvKGltYWdlLmhlaWdodCkpID8gZ2wuUkVQRUFUIDogZ2wuQ0xBTVBfVE9fRURHRTtcblx0XHRcdFxuXHRcdFx0dGhhdC5iYWNrZ3JvdW5kV2lkdGggPSBpbWFnZS53aWR0aDtcblx0XHRcdHRoYXQuYmFja2dyb3VuZEhlaWdodCA9IGltYWdlLmhlaWdodDtcblx0XHRcdFxuXHRcdFx0dmFyIHRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG5cdFx0XHRcblx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleHR1cmUpO1xuXHRcdFx0Z2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgMSk7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgd3JhcHBpbmcpO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgd3JhcHBpbmcpO1xuXHRcdFx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBpbWFnZSk7XG5cdFx0XHRcblx0XHRcdHRoYXQuYmFja2dyb3VuZFRleHR1cmUgPSB0ZXh0dXJlO1xuXHRcdFx0XG5cdFx0XHQvLyBFdmVyeXRoaW5nIGxvYWRlZCBzdWNjZXNzZnVsbHkgLSBoaWRlIHRoZSBDU1MgYmFja2dyb3VuZCBpbWFnZVxuXHRcdFx0dGhhdC4kZWwuY3NzKCdiYWNrZ3JvdW5kSW1hZ2UnLCAnbm9uZScpO1xuXHRcdH07XG5cdFx0aW1hZ2Uuc3JjID0gYmFja2dyb3VuZFVybDtcblx0XHRcblx0XHR0aGlzLnZpc2libGUgPSB0cnVlO1xuXHRcdFxuXHRcdC8vIEluaXQgYW5pbWF0aW9uXG5cdFx0ZnVuY3Rpb24gc3RlcCgpIHtcblx0XHRcdHRoYXQuc3RlcCgpO1xuXHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xuXHRcdH1cblx0XHRcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XG5cdH07XG5cblx0UmlwcGxlcy5ERUZBVUxUUyA9IHtcblx0XHRyZXNvbHV0aW9uOiAyNTYsXG5cdFx0ZHJvcFJhZGl1czogMjAsXG5cdFx0cGVydHVyYmFuY2U6IDAuMDMsXG5cdFx0aW50ZXJhY3RpdmU6IHRydWVcblx0fTtcblx0XG5cdFJpcHBsZXMucHJvdG90eXBlID0ge1xuXG5cdFx0c3RlcDogZnVuY3Rpb24oKSB7XG5cdFx0XHRnbCA9IHRoaXMuY29udGV4dDtcblx0XHRcdFxuXHRcdFx0aWYgKCF0aGlzLnZpc2libGUgfHwgIXRoaXMuYmFja2dyb3VuZFRleHR1cmUpIHJldHVybjtcblx0XHRcdFxuXHRcdFx0dGhpcy5jb21wdXRlVGV4dHVyZUJvdW5kYXJpZXMoKTtcblxuXHRcdFx0aWYgKHRoaXMucnVubmluZykge1xuXHRcdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH0sXG5cdFx0XG5cdFx0ZHJhd1F1YWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMucXVhZCk7XG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKDAsIDIsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cdFx0XHRnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX0ZBTiwgMCwgNCk7XG5cdFx0fSxcblx0XHRcblx0XHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Z2wudmlld3BvcnQoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG5cdFx0XHRnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XG5cblx0XHRcdGdsLnVzZVByb2dyYW0odGhpcy5yZW5kZXJQcm9ncmFtLmlkKTtcblx0XHRcdFxuXHRcdFx0YmluZFRleHR1cmUodGhpcy5iYWNrZ3JvdW5kVGV4dHVyZSwgMCk7XG5cdFx0XHRiaW5kVGV4dHVyZSh0aGlzLnRleHR1cmVzWzBdLCAxKTtcblx0XHRcdFxuXHRcdFx0Z2wudW5pZm9ybTJmdih0aGlzLnJlbmRlclByb2dyYW0ubG9jYXRpb25zLnRvcExlZnQsIHRoaXMucmVuZGVyUHJvZ3JhbS51bmlmb3Jtcy50b3BMZWZ0KTtcblx0XHRcdGdsLnVuaWZvcm0yZnYodGhpcy5yZW5kZXJQcm9ncmFtLmxvY2F0aW9ucy5ib3R0b21SaWdodCwgdGhpcy5yZW5kZXJQcm9ncmFtLnVuaWZvcm1zLmJvdHRvbVJpZ2h0KTtcblx0XHRcdGdsLnVuaWZvcm0yZnYodGhpcy5yZW5kZXJQcm9ncmFtLmxvY2F0aW9ucy5jb250YWluZXJSYXRpbywgdGhpcy5yZW5kZXJQcm9ncmFtLnVuaWZvcm1zLmNvbnRhaW5lclJhdGlvKTtcblx0XHRcdGdsLnVuaWZvcm0xaSh0aGlzLnJlbmRlclByb2dyYW0ubG9jYXRpb25zLnNhbXBsZXJCYWNrZ3JvdW5kLCAwKTtcblx0XHRcdGdsLnVuaWZvcm0xaSh0aGlzLnJlbmRlclByb2dyYW0ubG9jYXRpb25zLnNhbXBsZXJSaXBwbGVzLCAxKTtcblx0XHRcdFxuXHRcdFx0dGhpcy5kcmF3UXVhZCgpO1xuXHRcdH0sXG5cblx0XHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Z2wudmlld3BvcnQoMCwgMCwgdGhpcy5yZXNvbHV0aW9uLCB0aGlzLnJlc29sdXRpb24pO1xuXHRcdFx0XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDI7IGkrKykge1xuXHRcdFx0XHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIHRoaXMuZnJhbWVidWZmZXJzW2ldKTtcblx0XHRcdFx0YmluZFRleHR1cmUodGhpcy50ZXh0dXJlc1sxLWldKTtcblx0XHRcdFx0Z2wudXNlUHJvZ3JhbSh0aGlzLnVwZGF0ZVByb2dyYW1baV0uaWQpO1xuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5kcmF3UXVhZCgpO1xuXHRcdFx0fVxuXG5cdFx0XHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xuXHRcdH0sXG5cdFx0XG5cdFx0Y29tcHV0ZVRleHR1cmVCb3VuZGFyaWVzOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBiYWNrZ3JvdW5kU2l6ZSA9IHRoaXMuJGVsLmNzcygnYmFja2dyb3VuZC1zaXplJyk7XG5cdFx0XHR2YXIgYmFja2dyb3VuZEF0dGFjaG1lbnQgPSB0aGlzLiRlbC5jc3MoJ2JhY2tncm91bmQtYXR0YWNobWVudCcpO1xuXHRcdFx0dmFyIGJhY2tncm91bmRQb3NpdGlvbiA9IHRoaXMuJGVsLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbicpLnNwbGl0KCcgJyk7XG5cblx0XHRcdC8vIEhlcmUgdGhlICd3aW5kb3cnIGlzIHRoZSBlbGVtZW50IHdoaWNoIHRoZSBiYWNrZ3JvdW5kIGFkYXB0cyB0byBcblx0XHRcdC8vIChlaXRoZXIgdGhlIGNocm9tZSB3aW5kb3cgb3Igc29tZSBlbGVtZW50LCBkZXBlbmRpbmcgb24gYXR0YWNobWVudClcblx0XHRcdHZhciBwYXJFbGVtZW50ID0gYmFja2dyb3VuZEF0dGFjaG1lbnQgPT0gJ2ZpeGVkJyA/ICR3aW5kb3cgOiB0aGlzLiRlbDtcblx0XHRcdHZhciB3aW5PZmZzZXQgPSBwYXJFbGVtZW50Lm9mZnNldCgpIHx8IHtsZWZ0OiBwYWdlWE9mZnNldCwgdG9wOiBwYWdlWU9mZnNldH07XG5cdFx0XHR2YXIgd2luV2lkdGggPSBwYXJFbGVtZW50LmlubmVyV2lkdGgoKTtcblx0XHRcdHZhciB3aW5IZWlnaHQgPSBwYXJFbGVtZW50LmlubmVySGVpZ2h0KCk7XG5cblx0XHRcdC8vIFRPRE86IGJhY2tncm91bmQtY2xpcFxuXHRcdFx0aWYgKGJhY2tncm91bmRTaXplID09ICdjb3ZlcicpIHtcblx0XHRcdFx0dmFyIHNjYWxlID0gTWF0aC5tYXgod2luV2lkdGggLyB0aGlzLmJhY2tncm91bmRXaWR0aCwgd2luSGVpZ2h0IC8gdGhpcy5iYWNrZ3JvdW5kSGVpZ2h0KTtcblx0XHRcdFx0XG5cdFx0XHRcdHZhciBiYWNrZ3JvdW5kV2lkdGggPSB0aGlzLmJhY2tncm91bmRXaWR0aCAqIHNjYWxlO1xuXHRcdFx0XHR2YXIgYmFja2dyb3VuZEhlaWdodCA9IHRoaXMuYmFja2dyb3VuZEhlaWdodCAqIHNjYWxlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoYmFja2dyb3VuZFNpemUgPT0gJ2NvbnRhaW4nKSB7XG5cdFx0XHRcdHZhciBzY2FsZSA9IE1hdGgubWluKHdpbldpZHRoIC8gdGhpcy5iYWNrZ3JvdW5kV2lkdGgsIHdpbkhlaWdodCAvIHRoaXMuYmFja2dyb3VuZEhlaWdodCk7XG5cdFx0XHRcdFxuXHRcdFx0XHR2YXIgYmFja2dyb3VuZFdpZHRoID0gdGhpcy5iYWNrZ3JvdW5kV2lkdGggKiBzY2FsZTtcblx0XHRcdFx0dmFyIGJhY2tncm91bmRIZWlnaHQgPSB0aGlzLmJhY2tncm91bmRIZWlnaHQgKiBzY2FsZTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRiYWNrZ3JvdW5kU2l6ZSA9IGJhY2tncm91bmRTaXplLnNwbGl0KCcgJyk7XG5cdFx0XHRcdHZhciBiYWNrZ3JvdW5kV2lkdGggPSBiYWNrZ3JvdW5kU2l6ZVswXSB8fCAnJztcblx0XHRcdFx0dmFyIGJhY2tncm91bmRIZWlnaHQgPSBiYWNrZ3JvdW5kU2l6ZVsxXSB8fCBiYWNrZ3JvdW5kV2lkdGg7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoaXNQZXJjZW50YWdlKGJhY2tncm91bmRXaWR0aCkpIGJhY2tncm91bmRXaWR0aCA9IHdpbldpZHRoICogcGFyc2VGbG9hdChiYWNrZ3JvdW5kV2lkdGgpIC8gMTAwO1xuXHRcdFx0XHRlbHNlIGlmIChiYWNrZ3JvdW5kV2lkdGggIT0gJ2F1dG8nKSBiYWNrZ3JvdW5kV2lkdGggPSBwYXJzZUZsb2F0KGJhY2tncm91bmRXaWR0aCk7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoaXNQZXJjZW50YWdlKGJhY2tncm91bmRIZWlnaHQpKSBiYWNrZ3JvdW5kSGVpZ2h0ID0gd2luSGVpZ2h0ICogcGFyc2VGbG9hdChiYWNrZ3JvdW5kSGVpZ2h0KSAvIDEwMDtcblx0XHRcdFx0ZWxzZSBpZiAoYmFja2dyb3VuZEhlaWdodCAhPSAnYXV0bycpIGJhY2tncm91bmRIZWlnaHQgPSBwYXJzZUZsb2F0KGJhY2tncm91bmRIZWlnaHQpO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYgKGJhY2tncm91bmRXaWR0aCA9PSAnYXV0bycgJiYgYmFja2dyb3VuZEhlaWdodCA9PSAnYXV0bycpIHtcblx0XHRcdFx0XHRiYWNrZ3JvdW5kV2lkdGggPSB0aGlzLmJhY2tncm91bmRXaWR0aDtcblx0XHRcdFx0XHRiYWNrZ3JvdW5kSGVpZ2h0ID0gdGhpcy5iYWNrZ3JvdW5kSGVpZ2h0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGlmIChiYWNrZ3JvdW5kV2lkdGggPT0gJ2F1dG8nKSBiYWNrZ3JvdW5kV2lkdGggPSB0aGlzLmJhY2tncm91bmRXaWR0aCAqIChiYWNrZ3JvdW5kSGVpZ2h0IC8gdGhpcy5iYWNrZ3JvdW5kSGVpZ2h0KTtcblx0XHRcdFx0XHRpZiAoYmFja2dyb3VuZEhlaWdodCA9PSAnYXV0bycpIGJhY2tncm91bmRIZWlnaHQgPSB0aGlzLmJhY2tncm91bmRIZWlnaHQgKiAoYmFja2dyb3VuZFdpZHRoIC8gdGhpcy5iYWNrZ3JvdW5kV2lkdGgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vIENvbXB1dGUgYmFja2dyb3VuZFggYW5kIGJhY2tncm91bmRZIGluIHBhZ2UgY29vcmRpbmF0ZXNcblx0XHRcdHZhciBiYWNrZ3JvdW5kWCA9IGJhY2tncm91bmRQb3NpdGlvblswXSB8fCAnJztcblx0XHRcdHZhciBiYWNrZ3JvdW5kWSA9IGJhY2tncm91bmRQb3NpdGlvblsxXSB8fCBiYWNrZ3JvdW5kWDtcblx0XHRcdFxuXHRcdFx0aWYgKGJhY2tncm91bmRYID09ICdsZWZ0JykgYmFja2dyb3VuZFggPSB3aW5PZmZzZXQubGVmdDtcblx0XHRcdGVsc2UgaWYgKGJhY2tncm91bmRYID09ICdjZW50ZXInKSBiYWNrZ3JvdW5kWCA9IHdpbk9mZnNldC5sZWZ0ICsgd2luV2lkdGggLyAyIC0gYmFja2dyb3VuZFdpZHRoIC8gMjtcblx0XHRcdGVsc2UgaWYgKGJhY2tncm91bmRYID09ICdyaWdodCcpIGJhY2tncm91bmRYID0gd2luT2Zmc2V0LmxlZnQgKyB3aW5XaWR0aCAtIGJhY2tncm91bmRXaWR0aDtcblx0XHRcdGVsc2UgaWYgKGlzUGVyY2VudGFnZShiYWNrZ3JvdW5kWCkpIHtcblx0XHRcdFx0YmFja2dyb3VuZFggPSB3aW5PZmZzZXQubGVmdCArICh3aW5XaWR0aCAtIGJhY2tncm91bmRXaWR0aCkgKiBwYXJzZUZsb2F0KGJhY2tncm91bmRYKSAvIDEwMDtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRiYWNrZ3JvdW5kWCA9IHBhcnNlRmxvYXQoYmFja2dyb3VuZFgpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiAoYmFja2dyb3VuZFkgPT0gJ3RvcCcpIGJhY2tncm91bmRZID0gd2luT2Zmc2V0LnRvcDtcblx0XHRcdGVsc2UgaWYgKGJhY2tncm91bmRZID09ICdjZW50ZXInKSBiYWNrZ3JvdW5kWSA9IHdpbk9mZnNldC50b3AgKyB3aW5IZWlnaHQgLyAyIC0gYmFja2dyb3VuZEhlaWdodCAvIDI7XG5cdFx0XHRlbHNlIGlmIChiYWNrZ3JvdW5kWSA9PSAnYm90dG9tJykgYmFja2dyb3VuZFkgPSB3aW5PZmZzZXQudG9wICsgd2luSGVpZ2h0IC0gYmFja2dyb3VuZEhlaWdodDtcblx0XHRcdGVsc2UgaWYgKGlzUGVyY2VudGFnZShiYWNrZ3JvdW5kWSkpIHtcblx0XHRcdFx0YmFja2dyb3VuZFkgPSB3aW5PZmZzZXQudG9wICsgKHdpbkhlaWdodCAtIGJhY2tncm91bmRIZWlnaHQpICogcGFyc2VGbG9hdChiYWNrZ3JvdW5kWSkgLyAxMDA7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0YmFja2dyb3VuZFkgPSBwYXJzZUZsb2F0KGJhY2tncm91bmRZKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGVsZW1lbnRPZmZzZXQgPSB0aGlzLiRlbC5vZmZzZXQoKTtcblx0XHRcdFxuXHRcdFx0dGhpcy5yZW5kZXJQcm9ncmFtLnVuaWZvcm1zLnRvcExlZnQgPSBuZXcgRmxvYXQzMkFycmF5KFtcblx0XHRcdFx0KGVsZW1lbnRPZmZzZXQubGVmdCAtIGJhY2tncm91bmRYKSAvIGJhY2tncm91bmRXaWR0aCxcblx0XHRcdFx0KGVsZW1lbnRPZmZzZXQudG9wIC0gYmFja2dyb3VuZFkpIC8gYmFja2dyb3VuZEhlaWdodFxuXHRcdFx0XSk7XG5cdFx0XHR0aGlzLnJlbmRlclByb2dyYW0udW5pZm9ybXMuYm90dG9tUmlnaHQgPSBuZXcgRmxvYXQzMkFycmF5KFtcblx0XHRcdFx0dGhpcy5yZW5kZXJQcm9ncmFtLnVuaWZvcm1zLnRvcExlZnRbMF0gKyB0aGlzLiRlbC5pbm5lcldpZHRoKCkgLyBiYWNrZ3JvdW5kV2lkdGgsXG5cdFx0XHRcdHRoaXMucmVuZGVyUHJvZ3JhbS51bmlmb3Jtcy50b3BMZWZ0WzFdICsgdGhpcy4kZWwuaW5uZXJIZWlnaHQoKSAvIGJhY2tncm91bmRIZWlnaHRcblx0XHRcdF0pO1xuXHRcdFx0XG5cdFx0XHR2YXIgbWF4U2lkZSA9IE1hdGgubWF4KHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXHRcdFx0XG5cdFx0XHR0aGlzLnJlbmRlclByb2dyYW0udW5pZm9ybXMuY29udGFpbmVyUmF0aW8gPSBuZXcgRmxvYXQzMkFycmF5KFtcblx0XHRcdFx0dGhpcy5jYW52YXMud2lkdGggLyBtYXhTaWRlLFxuXHRcdFx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgLyBtYXhTaWRlXG5cdFx0XHRdKTtcblx0XHR9LFxuXHRcdFxuXHRcdGluaXRTaGFkZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB2ZXJ0ZXhTaGFkZXIgPSBbXG5cdFx0XHRcdCdhdHRyaWJ1dGUgdmVjMiB2ZXJ0ZXg7Jyxcblx0XHRcdFx0J3ZhcnlpbmcgdmVjMiBjb29yZDsnLFxuXHRcdFx0XHQndm9pZCBtYWluKCkgeycsXG5cdFx0XHRcdFx0J2Nvb3JkID0gdmVydGV4ICogMC41ICsgMC41OycsXG5cdFx0XHRcdFx0J2dsX1Bvc2l0aW9uID0gdmVjNCh2ZXJ0ZXgsIDAuMCwgMS4wKTsnLFxuXHRcdFx0XHQnfSdcblx0XHRcdF0uam9pbignXFxuJyk7XG5cdFx0XHRcblx0XHRcdHRoaXMuZHJvcFByb2dyYW0gPSBjcmVhdGVQcm9ncmFtKHZlcnRleFNoYWRlciwgW1xuXHRcdFx0XHQncHJlY2lzaW9uIGhpZ2hwIGZsb2F0OycsXG5cdFx0XHRcdFxuXHRcdFx0XHQnY29uc3QgZmxvYXQgUEkgPSAzLjE0MTU5MjY1MzU4OTc5MzsnLFxuXHRcdFx0XHQndW5pZm9ybSBzYW1wbGVyMkQgdGV4dHVyZTsnLFxuXHRcdFx0XHQndW5pZm9ybSB2ZWMyIGNlbnRlcjsnLFxuXHRcdFx0XHQndW5pZm9ybSBmbG9hdCByYWRpdXM7Jyxcblx0XHRcdFx0J3VuaWZvcm0gZmxvYXQgc3RyZW5ndGg7Jyxcblx0XHRcdFx0XG5cdFx0XHRcdCd2YXJ5aW5nIHZlYzIgY29vcmQ7Jyxcblx0XHRcdFx0XG5cdFx0XHRcdCd2b2lkIG1haW4oKSB7Jyxcblx0XHRcdFx0XHQndmVjNCBpbmZvID0gdGV4dHVyZTJEKHRleHR1cmUsIGNvb3JkKTsnLFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdCdmbG9hdCBkcm9wID0gbWF4KDAuMCwgMS4wIC0gbGVuZ3RoKGNlbnRlciAqIDAuNSArIDAuNSAtIGNvb3JkKSAvIHJhZGl1cyk7Jyxcblx0XHRcdFx0XHQnZHJvcCA9IDAuNSAtIGNvcyhkcm9wICogUEkpICogMC41OycsXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0J2luZm8uciArPSBkcm9wICogc3RyZW5ndGg7Jyxcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQnZ2xfRnJhZ0NvbG9yID0gaW5mbzsnLFxuXHRcdFx0XHQnfSdcblx0XHRcdF0uam9pbignXFxuJykpO1xuXHRcdFx0XG5cdFx0XHR0aGlzLnVwZGF0ZVByb2dyYW0gPSBbMCwwXTtcblx0XHRcdHRoaXMudXBkYXRlUHJvZ3JhbVswXSA9IGNyZWF0ZVByb2dyYW0odmVydGV4U2hhZGVyLCBbXG5cdFx0XHRcdCdwcmVjaXNpb24gaGlnaHAgZmxvYXQ7Jyxcblx0XHRcdFx0XG5cdFx0XHRcdCd1bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlOycsXG5cdFx0XHRcdCd1bmlmb3JtIHZlYzIgZGVsdGE7Jyxcblx0XHRcdFx0XG5cdFx0XHRcdCd2YXJ5aW5nIHZlYzIgY29vcmQ7Jyxcblx0XHRcdFx0XG5cdFx0XHRcdCd2b2lkIG1haW4oKSB7Jyxcblx0XHRcdFx0XHQndmVjNCBpbmZvID0gdGV4dHVyZTJEKHRleHR1cmUsIGNvb3JkKTsnLFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdCd2ZWMyIGR4ID0gdmVjMihkZWx0YS54LCAwLjApOycsXG5cdFx0XHRcdFx0J3ZlYzIgZHkgPSB2ZWMyKDAuMCwgZGVsdGEueSk7Jyxcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQnZmxvYXQgYXZlcmFnZSA9ICgnLFxuXHRcdFx0XHRcdFx0J3RleHR1cmUyRCh0ZXh0dXJlLCBjb29yZCAtIGR4KS5yICsnLFxuXHRcdFx0XHRcdFx0J3RleHR1cmUyRCh0ZXh0dXJlLCBjb29yZCAtIGR5KS5yICsnLFxuXHRcdFx0XHRcdFx0J3RleHR1cmUyRCh0ZXh0dXJlLCBjb29yZCArIGR4KS5yICsnLFxuXHRcdFx0XHRcdFx0J3RleHR1cmUyRCh0ZXh0dXJlLCBjb29yZCArIGR5KS5yJyxcblx0XHRcdFx0XHQnKSAqIDAuMjU7Jyxcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQnaW5mby5nICs9IChhdmVyYWdlIC0gaW5mby5yKSAqIDIuMDsnLFxuXHRcdFx0XHRcdCdpbmZvLmcgKj0gMC45OTU7Jyxcblx0XHRcdFx0XHQnaW5mby5yICs9IGluZm8uZzsnLFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdCdnbF9GcmFnQ29sb3IgPSBpbmZvOycsXG5cdFx0XHRcdCd9J1xuXHRcdFx0XS5qb2luKCdcXG4nKSk7XG5cdFx0XHRnbC51bmlmb3JtMmZ2KHRoaXMudXBkYXRlUHJvZ3JhbVswXS5sb2NhdGlvbnMuZGVsdGEsIHRoaXMudGV4dHVyZURlbHRhKTtcblx0XHRcdFxuXHRcdFx0dGhpcy51cGRhdGVQcm9ncmFtWzFdID0gY3JlYXRlUHJvZ3JhbSh2ZXJ0ZXhTaGFkZXIsIFtcblx0XHRcdFx0J3ByZWNpc2lvbiBoaWdocCBmbG9hdDsnLFxuXHRcdFx0XHRcblx0XHRcdFx0J3VuaWZvcm0gc2FtcGxlcjJEIHRleHR1cmU7Jyxcblx0XHRcdFx0J3VuaWZvcm0gdmVjMiBkZWx0YTsnLFxuXHRcdFx0XHRcblx0XHRcdFx0J3ZhcnlpbmcgdmVjMiBjb29yZDsnLFxuXHRcdFx0XHRcblx0XHRcdFx0J3ZvaWQgbWFpbigpIHsnLFxuXHRcdFx0XHRcdCd2ZWM0IGluZm8gPSB0ZXh0dXJlMkQodGV4dHVyZSwgY29vcmQpOycsXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0J3ZlYzMgZHggPSB2ZWMzKGRlbHRhLngsIHRleHR1cmUyRCh0ZXh0dXJlLCB2ZWMyKGNvb3JkLnggKyBkZWx0YS54LCBjb29yZC55KSkuciAtIGluZm8uciwgMC4wKTsnLFxuXHRcdFx0XHRcdCd2ZWMzIGR5ID0gdmVjMygwLjAsIHRleHR1cmUyRCh0ZXh0dXJlLCB2ZWMyKGNvb3JkLngsIGNvb3JkLnkgKyBkZWx0YS55KSkuciAtIGluZm8uciwgZGVsdGEueSk7Jyxcblx0XHRcdFx0XHQnaW5mby5iYSA9IG5vcm1hbGl6ZShjcm9zcyhkeSwgZHgpKS54ejsnLFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdCdnbF9GcmFnQ29sb3IgPSBpbmZvOycsXG5cdFx0XHRcdCd9J1xuXHRcdFx0XS5qb2luKCdcXG4nKSk7XG5cdFx0XHRnbC51bmlmb3JtMmZ2KHRoaXMudXBkYXRlUHJvZ3JhbVsxXS5sb2NhdGlvbnMuZGVsdGEsIHRoaXMudGV4dHVyZURlbHRhKTtcblx0XHRcdFxuXHRcdFx0dGhpcy5yZW5kZXJQcm9ncmFtID0gY3JlYXRlUHJvZ3JhbShbXG5cdFx0XHRcdCdwcmVjaXNpb24gaGlnaHAgZmxvYXQ7Jyxcblx0XHRcdFx0XG5cdFx0XHRcdCdhdHRyaWJ1dGUgdmVjMiB2ZXJ0ZXg7Jyxcblx0XHRcdFx0J3VuaWZvcm0gdmVjMiB0b3BMZWZ0OycsXG5cdFx0XHRcdCd1bmlmb3JtIHZlYzIgYm90dG9tUmlnaHQ7Jyxcblx0XHRcdFx0J3VuaWZvcm0gdmVjMiBjb250YWluZXJSYXRpbzsnLFxuXHRcdFx0XHQndmFyeWluZyB2ZWMyIHJpcHBsZXNDb29yZDsnLFxuXHRcdFx0XHQndmFyeWluZyB2ZWMyIGJhY2tncm91bmRDb29yZDsnLFxuXHRcdFx0XHQndm9pZCBtYWluKCkgeycsXG5cdFx0XHRcdFx0J2JhY2tncm91bmRDb29yZCA9IG1peCh0b3BMZWZ0LCBib3R0b21SaWdodCwgdmVydGV4ICogMC41ICsgMC41KTsnLFxuXHRcdFx0XHRcdCdiYWNrZ3JvdW5kQ29vcmQueSA9IDEuMCAtIGJhY2tncm91bmRDb29yZC55OycsXG5cdFx0XHRcdFx0J3JpcHBsZXNDb29yZCA9IHZlYzIodmVydGV4LngsIC12ZXJ0ZXgueSkgKiBjb250YWluZXJSYXRpbyAqIDAuNSArIDAuNTsnLFxuXHRcdFx0XHRcdCdnbF9Qb3NpdGlvbiA9IHZlYzQodmVydGV4LngsIC12ZXJ0ZXgueSwgMC4wLCAxLjApOycsXG5cdFx0XHRcdCd9J1xuXHRcdFx0XS5qb2luKCdcXG4nKSwgW1xuXHRcdFx0XHQncHJlY2lzaW9uIGhpZ2hwIGZsb2F0OycsXG5cdFx0XHRcdFxuXHRcdFx0XHQndW5pZm9ybSBzYW1wbGVyMkQgc2FtcGxlckJhY2tncm91bmQ7Jyxcblx0XHRcdFx0J3VuaWZvcm0gc2FtcGxlcjJEIHNhbXBsZXJSaXBwbGVzOycsXG5cdFx0XHRcdCd1bmlmb3JtIGZsb2F0IHBlcnR1cmJhbmNlOycsXG5cdFx0XHRcdCd2YXJ5aW5nIHZlYzIgcmlwcGxlc0Nvb3JkOycsXG5cdFx0XHRcdCd2YXJ5aW5nIHZlYzIgYmFja2dyb3VuZENvb3JkOycsXG5cdFx0XHRcdFxuXHRcdFx0XHQndm9pZCBtYWluKCkgeycsXG5cdFx0XHRcdFx0J3ZlYzIgb2Zmc2V0ID0gLXRleHR1cmUyRChzYW1wbGVyUmlwcGxlcywgcmlwcGxlc0Nvb3JkKS5iYTsnLFxuXHRcdFx0XHRcdCdmbG9hdCBzcGVjdWxhciA9IHBvdyhtYXgoMC4wLCBkb3Qob2Zmc2V0LCBub3JtYWxpemUodmVjMigtMC42LCAxLjApKSkpLCA0LjApOycsXG5cdFx0XHRcdFx0J2dsX0ZyYWdDb2xvciA9IHRleHR1cmUyRChzYW1wbGVyQmFja2dyb3VuZCwgYmFja2dyb3VuZENvb3JkICsgb2Zmc2V0ICogcGVydHVyYmFuY2UpICsgc3BlY3VsYXI7Jyxcblx0XHRcdFx0J30nXG5cdFx0XHRdLmpvaW4oJ1xcbicpKTtcblx0XHRcdGdsLnVuaWZvcm0xZih0aGlzLnJlbmRlclByb2dyYW0ubG9jYXRpb25zLnBlcnR1cmJhbmNlLCB0aGlzLnBlcnR1cmJhbmNlKTtcblx0XHR9LFxuXHRcdFxuXHRcdGRyb3BBdE1vdXNlOiBmdW5jdGlvbihlLCByYWRpdXMsIHN0cmVuZ3RoKSB7XG5cdFx0XHR0aGlzLmRyb3AoXG5cdFx0XHRcdGUucGFnZVggLSB0aGlzLiRlbC5vZmZzZXQoKS5sZWZ0LFxuXHRcdFx0XHRlLnBhZ2VZIC0gdGhpcy4kZWwub2Zmc2V0KCkudG9wLFxuXHRcdFx0XHRyYWRpdXMsIFxuXHRcdFx0XHRzdHJlbmd0aFxuXHRcdFx0KTtcblx0XHR9LFxuXHRcdFxuXHRcdGRyb3A6IGZ1bmN0aW9uKHgsIHksIHJhZGl1cywgc3RyZW5ndGgpIHtcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0Z2wgPSB0aGlzLmNvbnRleHQ7XG5cblx0XHRcdHZhciBlbFdpZHRoID0gdGhpcy4kZWwub3V0ZXJXaWR0aCgpO1xuXHRcdFx0dmFyIGVsSGVpZ2h0ID0gdGhpcy4kZWwub3V0ZXJIZWlnaHQoKTtcblx0XHRcdHZhciBsb25nZXN0U2lkZSA9IE1hdGgubWF4KGVsV2lkdGgsIGVsSGVpZ2h0KTtcblx0XHRcdFxuXHRcdFx0cmFkaXVzID0gcmFkaXVzIC8gbG9uZ2VzdFNpZGU7XG5cdFx0XHRcblx0XHRcdHZhciBkcm9wUG9zaXRpb24gPSBuZXcgRmxvYXQzMkFycmF5KFtcblx0XHRcdFx0KDIgKiB4IC0gZWxXaWR0aCkgLyBsb25nZXN0U2lkZSwgXG5cdFx0XHRcdChlbEhlaWdodCAtIDIgKiB5KSAvIGxvbmdlc3RTaWRlXG5cdFx0XHRdKTtcblxuXHRcdFx0Z2wudmlld3BvcnQoMCwgMCwgdGhpcy5yZXNvbHV0aW9uLCB0aGlzLnJlc29sdXRpb24pO1xuXHRcdFx0XG5cdFx0XHQvLyBSZW5kZXIgb250byB0ZXh0dXJlL2ZyYW1lYnVmZmVyIDBcblx0XHRcdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgdGhpcy5mcmFtZWJ1ZmZlcnNbMF0pO1xuXHRcdFx0XG5cdFx0XHQvLyBVc2luZyB0ZXh0dXJlIDFcblx0XHRcdGJpbmRUZXh0dXJlKHRoaXMudGV4dHVyZXNbMV0pO1xuXG5cdFx0XHRnbC51c2VQcm9ncmFtKHRoaXMuZHJvcFByb2dyYW0uaWQpO1xuXHRcdFx0Z2wudW5pZm9ybTJmdih0aGlzLmRyb3BQcm9ncmFtLmxvY2F0aW9ucy5jZW50ZXIsIGRyb3BQb3NpdGlvbik7XG5cdFx0XHRnbC51bmlmb3JtMWYodGhpcy5kcm9wUHJvZ3JhbS5sb2NhdGlvbnMucmFkaXVzLCByYWRpdXMpO1xuXHRcdFx0Z2wudW5pZm9ybTFmKHRoaXMuZHJvcFByb2dyYW0ubG9jYXRpb25zLnN0cmVuZ3RoLCBzdHJlbmd0aCk7XG5cdFx0XHRcblx0XHRcdHRoaXMuZHJhd1F1YWQoKTtcblx0XHRcdFxuXHRcdFx0Ly8gU3dpdGNoIHRleHR1cmVzXG5cdFx0XHR2YXIgdCA9IHRoaXMuZnJhbWVidWZmZXJzWzBdOyB0aGlzLmZyYW1lYnVmZmVyc1swXSA9IHRoaXMuZnJhbWVidWZmZXJzWzFdOyB0aGlzLmZyYW1lYnVmZmVyc1sxXSA9IHQ7XG5cdFx0XHR0ID0gdGhpcy50ZXh0dXJlc1swXTsgdGhpcy50ZXh0dXJlc1swXSA9IHRoaXMudGV4dHVyZXNbMV07IHRoaXMudGV4dHVyZXNbMV0gPSB0O1xuXHRcdFx0XG5cdFx0XHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xuXHRcdH0sXG5cdFx0XG5cdFx0Ly8gQWN0aW9uc1xuXHRcdGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5jYW52YXMucmVtb3ZlKCk7XG5cdFx0XHR0aGlzLiRlbC5vZmYoJy5yaXBwbGVzJyk7XG5cdFx0XHR0aGlzLiRlbC5jc3MoJ2JhY2tncm91bmRJbWFnZScsICcnKTtcblx0XHRcdHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdqcXVlcnktcmlwcGxlcycpLnJlbW92ZURhdGEoJ3JpcHBsZXMnKTtcblx0XHR9LFxuXHRcdFxuXHRcdHNob3c6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy4kY2FudmFzLnNob3coKTtcblx0XHRcdHRoaXMuJGVsLmNzcygnYmFja2dyb3VuZEltYWdlJywgJ25vbmUnKTtcblx0XHRcdHRoaXMudmlzaWJsZSA9IHRydWU7XG5cdFx0fSxcblx0XHRcblx0XHRoaWRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuJGNhbnZhcy5oaWRlKCk7XG5cdFx0XHR0aGlzLiRlbC5jc3MoJ2JhY2tncm91bmRJbWFnZScsICcnKTtcblx0XHRcdHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuXHRcdH0sXG5cblx0XHRwYXVzZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcblx0XHR9LFxuXHRcdFxuXHRcdHBsYXk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5ydW5uaW5nID0gdHJ1ZTtcblx0XHR9LFxuXHRcdFxuXHRcdHNldDogZnVuY3Rpb24ocHJvcGVydHksIHZhbHVlKVxuXHRcdHtcblx0XHRcdHN3aXRjaCAocHJvcGVydHkpXG5cdFx0XHR7XG5cdFx0XHRcdGNhc2UgJ2ludGVyYWN0aXZlJzogXG5cdFx0XHRcdFx0dGhpcy5pbnRlcmFjdGl2ZSA9IHZhbHVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBSSVBQTEVTIFBMVUdJTiBERUZJTklUSU9OXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0dmFyIG9sZCA9ICQuZm4ucmlwcGxlcztcblxuXHQkLmZuLnJpcHBsZXMgPSBmdW5jdGlvbihvcHRpb24pIHtcblx0XHRpZiAoIXN1cHBvcnRzV2ViR0wpIHRocm93IG5ldyBFcnJvcignWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYXQgbGVhc3Qgb25lIG9mIHRoZSBmb2xsb3dpbmc6IFdlYkdMLCBPRVNfdGV4dHVyZV9mbG9hdCBleHRlbnNpb24sIE9FU190ZXh0dXJlX2Zsb2F0X2xpbmVhciBleHRlbnNpb24uJyk7XG5cblx0XHR2YXIgYXJncyA9IChhcmd1bWVudHMubGVuZ3RoID4gMSkgPyBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogdW5kZWZpbmVkO1xuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyAgID0gJCh0aGlzKTtcblx0XHRcdHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgncmlwcGxlcycpO1xuXHRcdFx0dmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgUmlwcGxlcy5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbik7XG5cblx0XHRcdGlmICghZGF0YSAmJiB0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSByZXR1cm47XG5cdFx0XHRpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ3JpcHBsZXMnLCAoZGF0YSA9IG5ldyBSaXBwbGVzKHRoaXMsIG9wdGlvbnMpKSk7XG5cdFx0XHRlbHNlIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBSaXBwbGVzLnByb3RvdHlwZVtvcHRpb25dLmFwcGx5KGRhdGEsIGFyZ3MpO1xuXHRcdH0pO1xuXHR9XG5cblx0JC5mbi5yaXBwbGVzLkNvbnN0cnVjdG9yID0gUmlwcGxlcztcblxuXG5cdC8vIFJJUFBMRVMgTk8gQ09ORkxJQ1Rcblx0Ly8gPT09PT09PT09PT09PT09PT09PT1cblxuXHQkLmZuLnJpcHBsZXMubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuXHRcdCQuZm4ucmlwcGxlcyA9IG9sZDtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG59KHdpbmRvdy5qUXVlcnkpO1xuIiwiLypcclxuV2F0ZXIgcmlwcGxlIGVmZmVjdFxyXG5cclxuT3JpZ2luYWwgY29kZSAoSmF2YSkgYnkgTmVpbCBXYWxsaXNcclxuQ29kZSBzbmlwcGxldCBhZGFwdGVkIHRvIEphdmFzY3JpcHQgYnkgU2VyZ2V5IENoaWt1eW9ub2tcclxuQ29kZSByZS13cml0dGVuIGFzIGpRdWVyeSBwbHVnaW4gYnkgTmlrbGFzIEtuYWFja1xyXG5cclxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXHJcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcclxuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuXHJcblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXHJcbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuIWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShhLGIpe2Z1bmN0aW9uIHooKXtlPW5ldyBJbWFnZSxlLm9ubG9hZD1mdW5jdGlvbigpe0IoKX0sZS5zcmM9Yy5pbWFnZX1mdW5jdGlvbiBBKCl7eS5kcmF3SW1hZ2UoZSwwLDApLHQ9eS5nZXRJbWFnZURhdGEoMCwwLGgsaSkscz15LmdldEltYWdlRGF0YSgwLDAsaCxpKSx1PXMuZGF0YSx2PXQuZGF0YX1mdW5jdGlvbiBCKCl7QSgpO2Zvcih2YXIgYT0wO2E8bDthKyspclthXT1xW2FdPTA7QygpLGMuYXV0byYmKGc9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtFKE1hdGgucmFuZG9tKCkqaCxNYXRoLnJhbmRvbSgpKmkpfSxmKSxFKE1hdGgucmFuZG9tKCkqaCxNYXRoLnJhbmRvbSgpKmkpKX1mdW5jdGlvbiBDKCl7cmVxdWVzdEFuaW1GcmFtZShDKSxEKCl9ZnVuY3Rpb24gRCgpe3ZhciBhO2E9bSxtPW4sbj1hLGE9MCxvPW07Zm9yKHZhciBiPTA7YjxpO2IrKylmb3IodmFyIGM9MDtjPGg7YysrKXt2YXIgZD1xW28taF0rcVtvK2hdK3Fbby0xXStxW28rMV0+PjE7ZC09cVtuK2FdLGQtPWQ+PjUscVtuK2FdPWQsZD0xMDI0LWQ7dmFyIGU9clthXTtpZihyW2FdPWQsZSE9ZCl7dmFyIGY9KChjLWopKmQvMTAyNDw8MCkraixnPSgoYi1rKSpkLzEwMjQ8PDApK2s7Zj49aCYmKGY9aC0xKSxmPDAmJihmPTApLGc+PWkmJihnPWktMSksZzwwJiYoZz0wKTt2YXIgbD00KihmK2cqaCkscD00KmE7dVtwXT12W2xdLHVbcCsxXT12W2wrMV0sdVtwKzJdPXZbbCsyXX0rK28sKythfXkucHV0SW1hZ2VEYXRhKHMsMCwwKX1mdW5jdGlvbiBFKGEsYil7YTw8PTAsYjw8PTA7Zm9yKHZhciBjPWItcCxkPWIrcDtjPGQ7YysrKWZvcih2YXIgZT1hLXAsZj1hK3A7ZTxmO2UrKylxW20rYypoK2VdKz01MTJ9dmFyIGM9e2ltYWdlOlwiXCIscmlwcGxlUmFkaXVzOjMsd2lkdGg6NDgwLGhlaWdodDo0ODAsZGVsYXk6MSxhdXRvOiEwfTtpZih2b2lkIDAhPT1iKWZvcih2YXIgZCBpbiBiKWIuaGFzT3duUHJvcGVydHkoZCkmJmMuaGFzT3duUHJvcGVydHkoZCkmJihjW2RdPWJbZF0pO2lmKCFjLmltYWdlLmxlbmd0aClyZXR1cm4hMTt2YXIgZSxnLHMsdCx1LHYsZj0xZTMqYy5kZWxheSxoPWMud2lkdGgsaT1jLmhlaWdodCxqPWgvMixrPWkvMixsPWgqKGkrMikqMixtPWgsbj1oKihpKzMpLG89MCxwPWMucmlwcGxlUmFkaXVzLHE9W10scj1bXSx3PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dy5zdHlsZS53aWR0aD1oK1wicHhcIix3LnN0eWxlLmhlaWdodD1pK1wicHhcIixhLmFwcGVuZENoaWxkKHcpO3ZhciB4PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7eC53aWR0aD1oLHguaGVpZ2h0PWksdy5hcHBlbmRDaGlsZCh4KTt2YXIgeT14LmdldENvbnRleHQoXCIyZFwiKTt5LmZpbGxTdHlsZT1jLmJnQ29sb3IseS5maWxsUmVjdCgwLDAsaCxpKSx3aW5kb3cucmVxdWVzdEFuaW1GcmFtZT1mdW5jdGlvbigpe3JldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHx3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lfHx3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxmdW5jdGlvbihhKXt3aW5kb3cuc2V0VGltZW91dChhLDFlMy82MCl9fSgpLHRoaXMuZGlzdHVyYj1mdW5jdGlvbihhLGIpe0UoYSxiKX0seigpfXdpbmRvdy5XYXRlclJpcHBsZUVmZmVjdD1hfSgpLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBqUXVlcnkmJiFmdW5jdGlvbihhKXthLmZuLndhdGVyUmlwcGxlRWZmZWN0PWZ1bmN0aW9uKGIpe3ZhciBjPWFyZ3VtZW50cztyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7aWYoYS5kYXRhKHRoaXMsXCJwbHVnaW5fV2F0ZXJSaXBwbGVFZmZlY3RcIikpe3ZhciBkPWEuZGF0YSh0aGlzLFwicGx1Z2luX1dhdGVyUmlwcGxlRWZmZWN0XCIpO2RbYl0/ZFtiXS5hcHBseSh0aGlzLEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGMsMSkpOmEuZXJyb3IoXCJNZXRob2QgXCIrYitcIiBkb2VzIG5vdCBleGlzdCBvbiBqUXVlcnkud2F0ZXJSaXBwbGVFZmZlY3RcIil9ZWxzZSBhLmRhdGEodGhpcyxcInBsdWdpbl9XYXRlclJpcHBsZUVmZmVjdFwiLG5ldyBXYXRlclJpcHBsZUVmZmVjdCh0aGlzLGIpKX0pfX0oalF1ZXJ5KTsiXX0=
