window.onload = function() {

    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight,

        hue = 217,
        stars = [],
        count = 0,
        maxStars = 400;
        // document.getElementById("app").appendChild(canvas);


    var canvas2 = document.createElement('canvas'),
        ctx2 = canvas2.getContext('2d');
        canvas2.width = 100;
        canvas2.height = 100;
    var half = canvas2.width / 2,
        // gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
        gradient2 = ctx2.createRadialGradient(10,10,0,10,10,30);
        gradient2.addColorStop(0.025, '#fff');
        gradient2.addColorStop(0.1, 'hsl(' + hue + ', 21%, 33%)');
        gradient2.addColorStop(0.25, 'hsl(' + hue + ', 24%, 6%)');
        gradient2.addColorStop(1, 'transparent');

    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    // ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.arc(10, 10, 10, 0, Math.PI * 2);
    ctx2.fill();

    // End cache

    function random(min, max) {
        if (arguments.length < 2) {
            max = min;
            min = 0;
        }

        if (min > max) {
            var hold = max;
            max = min;
            min = hold;
        }

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function maxOrbit(x, y) {
        var max = Math.max(x, y),
            diameter = Math.round(Math.sqrt(max * max + max * max));
        return diameter / 2;
    }

    var Star = function(options) {

        this.orbitRadius = random(maxOrbit(w*0.3, h*0.3));
        this.radius = random(60, this.orbitRadius) / 6;
        // this.orbitX = w / 2;
        // this.orbitY = h / 2;
        // this.timePassed = random(0, maxStars);
        // this.speed = random(this.orbitRadius) / 1; //數字越大越慢
        this.alpha = random(2, 10) / 10;
        this.x = options.x;
        this.y = options.y;
        count++;
        stars[count] = this;
    }

    Star.prototype.draw = function() {
        var x = this.x,
            y =this.y,
            twinkle = random(10);

        if (twinkle === 1 && this.alpha > 0) {
            this.alpha -= 0.05;
        } else if (twinkle === 2 && this.alpha < 1) {
            this.alpha += 0.05;
        }
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
        // this.timePassed += this.speed;
    }

    for (var i = 0; i < maxStars; i++) {
        new Star({
            x:Math.sin(random(0, maxStars)) * random(maxOrbit(w*0.7, h*0.7)) + w/2,
            y: Math.cos(random(0, maxStars)) * random(maxOrbit(w*0.7, h*0.)) + h/2
        });
    }

    function animation() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = 'hsla(' + 0 + ', 14%, 16%, 0.3)';
        // ctx.fillStyle = 'rgba(0,0,0,1)';
        // ctx.createLinearGradient(0,0,w,h);
        ctx.fillRect(0, 0, w, h)

        ctx.globalCompositeOperation = 'lighter';
        for (var i = 1, l = stars.length; i < l; i++) {
            stars[i].draw();
        };
        window.requestAnimationFrame(animation);
    }

    animation();
    window.addEventListener('resize', function() {
        canvas.width = w = window.innerWidth;
        canvas.height = h = window.innerHeight;
        canvas.style.opacity = 0.3;

    }, false);
}
