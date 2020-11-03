var sakuraBg = function(count,speed) {
    console.log("init");
    const PI2 = Math.PI * 2.0;
    function symmetryRandom() {
        return Math.random() * 2.0 - 1.0;
    }
    const vertexShader = `
    attribute vec3 aEuler;
    attribute float aSize;

    varying float pAlpha;

    varying vec3 normX;
    varying vec3 normY;
    varying vec3 normZ;

    void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = aSize * (300.0 / -mvPosition.z);

        float pdist = length(mvPosition.xyz);
        pAlpha = smoothstep(0.0, 1.0, (pdist - 0.1) / 400.);

        // Caculate Normal
        vec3 elrsn = sin(aEuler);
        vec3 elrcs = cos(aEuler);
        mat3 rotx = mat3(
            1.0, 0.0, 0.0,
        0.0, elrcs.x, elrsn.x,
        0.0, -elrsn.x, elrcs.x
        );
        mat3 roty = mat3(
        elrcs.y, 0.0, -elrsn.y,
        0.0, 1.0, 0.0,
        elrsn.y, 0.0, elrcs.y
        );
        mat3 rotz = mat3(
        elrcs.z, elrsn.z, 0.0, 
        -elrsn.z, elrcs.z, 0.0,
        0.0, 0.0, 1.0
        );
        mat3 rotmat = rotx * roty * rotz;

        mat3 trrotm = mat3(
        rotmat[0][0], rotmat[1][0], rotmat[2][0],
        rotmat[0][1], rotmat[1][1], rotmat[2][1],
        rotmat[0][2], rotmat[1][2], rotmat[2][2]
        );
        normX = trrotm[0];
        normY = trrotm[1];
        normZ = trrotm[2];
    }
    `;
    const fragmentShader = `
    precision highp float;

    varying vec3 normX;
    varying vec3 normY;
    varying vec3 normZ;
    varying float pAlpha;

    float diffuse = 0.9;
    float specular = 0.8;
    float rstop = 0.1;

    // pos orign r.ab
    float ellipse(vec2 p, vec2 o, vec2 r) { 
        vec2 lp = (p - o) / r;
        return length(lp) - 1.0;
    }

    void main() {
        vec3 p = vec3(gl_PointCoord - vec2(0.5, 0.5), 0.0) * 2.0;
        vec3 d = vec3(0.0, 0.0, -1.0);
        float nd = normZ.z; //dot(-normZ, d);
        if(abs(nd) < 0.0001) discard;

        float np = dot(normZ, p);
        vec3 tp = p + d * np / nd;//dot(-normZ, d) / dot(-normZ, p);
        // Back 2D 
        vec2 coord = vec2(dot(normX, tp), dot(normY, tp));

        // angle = 15 degree
        const float flwrsn = 0.258819045102521;
        const float flwrcs = 0.965925826289068;
        mat2 flwrm = mat2(flwrcs, -flwrsn, flwrsn, flwrcs);
        // abs => double [0,1]
        vec2 flwrp = vec2(abs(coord.x), coord.y) * flwrm;
        float r;
        if(flwrp.x < 0.0) {
        // middle part(double)
            r = ellipse(flwrp, vec2(0.065, 0.024) * 0.5, vec2(0.36, 0.96) * 0.5);
        } else {
            // out part(double)
            r = ellipse(flwrp, vec2(0.065, 0.024) * 0.5, vec2(0.58, 0.96) * 0.5);
        }
        if(r > rstop) discard;
        // r = ellipse(flwrp, vec2(0.250,0.440), vec2(0.140,0.190));
        vec3 col = mix(vec3(1.0, 0.8, 0.75), vec3(1.0, 0.9, 0.87), r);
        
        float grady = mix(0.0, 1.0, pow(coord.y * 0.5 + 0.5, 0.35));
        col *= vec3(1.0, grady, grady);
        col *= mix(0.8, 1.0, pow(abs(coord.x), 0.3));
        col = col * diffuse + specular;
        
        float alpha = (0.5 - r / (rstop * 1.0));
        alpha = smoothstep(0.0, 1.0, alpha) * pAlpha;
        
        // gl_FragColor = vec4(vec3(alpha), 1.);
        // 櫻花顏色
        gl_FragColor = vec4(col*0.65, 1);
    }
    `;
    class Particle {
        constructor(){
            this.velocity = new Array(3);
            this.rotation = new Array(3);
            this.position = new Array(3);
            this.euler = new Array(3);
            this.size = 1.0;
            this.alpha = 1.0;
            this.zkey = 0.0;
        }
        setVelocity(vx, vy, vz){
            this.velocity[0] = vx;
            this.velocity[1] = vy;
            this.velocity[2] = vz;
        }
        setRotation(rx, ry, rz) {
            this.rotation[0] = rx;
            this.rotation[1] = ry;
            this.rotation[2] = rz;
        }
        setPosition(nx, ny, nz) {
            this.position[0] = nx;
            this.position[1] = ny;
            this.position[2] = nz;
        }
        setEulerAngles(rx, ry, rz) {
            this.euler[0] = rx;
            this.euler[1] = ry;
            this.euler[2] = rz;
        }
        setSize(s) {
            this.size = s;
        }
        update(dt) {
            this.position[0] += this.velocity[0] * dt;
            this.position[1] += this.velocity[1] * dt;
            this.position[2] += this.velocity[2] * dt;
            
            this.euler[0] += this.rotation[0] * dt;
            this.euler[1] += this.rotation[1] * dt;
            this.euler[2] += this.rotation[2] * dt;
        }
    }

    class Sakura {
        constructor(scene) {
            this.scene = scene;
            this.deltaTime = 0;
            // this.particleControl = {
            //     particleNum: 1000,
            //     area: [10.0, 10.0, 10.0] //區域大小, 數量間距, 花瓣大小
            // };
            if(window.innerWidth > 768) {
                this.particleControl = {
                    particleNum: count, //數量
                    area: [20.0, 40.0, 40.0] //區域大小, 間距, 花瓣大小
                };
            } else {
                this.particleControl = {
                    particleNum: count*3, //數量
                    area: [50.0, 10.0, 10.0] //區域大小, 間距, 花瓣大小
                };
            }
            // Data
            this.geometry = new THREE.BufferGeometry();
            this.positions = new Float32Array(this.particleControl.particleNum * 3);
            this.eulers = new Float32Array(this.particleControl.particleNum * 3);
            this.sizes = new Float32Array(this.particleControl.particleNum);
            this.initParticle();
        }

        initParticle() {
            let { particleControl } = this;
            let { particleNum, area } = particleControl;
            particleControl.particles = new Array(particleNum);
            let tempVec3 = new THREE.Vector3();
            let tempVelocity = 0;
            for (let i = 0; i < particleNum; i++) {
                particleControl.particles[i] = new Particle();
                let particle = particleControl.particles[i];
                // Init Transform
                tempVec3.x = symmetryRandom() * 0.3 + 0.8;
                tempVec3.y = symmetryRandom() * 0.2 - 1.0;
                tempVec3.z = symmetryRandom() * 0.3 + 0.5;
                tempVec3.normalize();
                tempVelocity = 5.0 + Math.random() * 1.0;
                tempVec3.multiplyScalar(tempVelocity);
                // Velocity
                particle.setVelocity(
                    tempVec3.x,
                    tempVec3.y,
                    tempVec3.z
                );
                // Rotation
                particle.setRotation(
                    symmetryRandom() * PI2 * 0.5,
                    symmetryRandom() * PI2 * 0.5,
                    symmetryRandom() * PI2 * 0.5
                );
                // Position
                particle.setPosition(
                    symmetryRandom() * area[0],
                    symmetryRandom() * area[1],
                    symmetryRandom() * area[2]
                );
                // Euler
                particle.setEulerAngles(
                    Math.random() * Math.PI * 2.0,
                    Math.random() * Math.PI * 2.0,
                    Math.random() * Math.PI * 2.0
                );
                // Size
                particle.setSize(4 + Math.random() * 1);
            }
            // Attributes
            this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
            this.geometry.setAttribute('aEuler', new THREE.BufferAttribute(this.eulers, 3));
            this.geometry.setAttribute('aSize', new THREE.BufferAttribute(this.sizes, 1));
            // Uniforms
            this.uniforms = {
                far: {
                    type: 'f',
                    value: area[2]
                }
            };
            this.points = new THREE.Points(
                this.geometry,
                new THREE.ShaderMaterial({
                    uniforms: this.uniforms,
                    vertexShader,
                    fragmentShader,
                })
            );
            this.scene.add(this.points);
        }

        // Cycle Position 
        repeatPos(particle, area) {
            for (let index = 0; index < 3; index++) {
                let limit = area[index];
                if (Math.abs(particle.position[index]) - particle.size * 0.5 > limit) {
                    // Out Of Area
                    if (particle.position[index] > 0) {
                        particle.position[index] -= limit * 2.0;
                    }
                    else {
                        particle.position[index] += limit * 2.0;
                    }
                }
            }
        }

        // Cycle Euler
        repeatEuler(particle) {
            for (let index = 0; index < 3; index++) {
                particle.euler[index] = particle.euler[index] % PI2;
                if (particle.euler[index] < 0.0) {
                    particle.euler[index] += PI2;
                }
            }
        }

        renderParticle(){
            let { particleNum, area, particles } = this.particleControl;
            // Update Data
            for (let i = 0; i < particleNum; i++) {
                let particle = particles[i];
                particle.update(this.deltaTime);
                this.repeatPos(particle, area);
                this.repeatEuler(particle);
                // Position
                this.positions[i*3] = particle.position[0];
                this.positions[i*3+1] = particle.position[1];
                this.positions[i*3+2] = particle.position[2];
                // Rotation
                this.eulers[i*3] = particle.euler[0];
                this.eulers[i*3+1] = particle.euler[1];
                this.eulers[i*3+2] = particle.euler[2];
                // Size
                this.sizes[i] = particle.size;
            }
            this.geometry.attributes['position'].needsUpdate = true;
            this.geometry.attributes['aEuler'].needsUpdate = true;
            this.geometry.attributes['aSize'].needsUpdate = true;
        }

        render(time) {
            this.deltaTime = time;
            this.renderParticle();
        }
    }


    class MainScene {
        constructor(container, callback) {
            this.container = container;
            // this.width = window.innerWidth;
            // this.height = window.innerHeight;
            if(window.innerWidth > 768) {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
            } else {
                this.width = 750;
                this.height = 1330;
            }
            this.clock = new THREE.Clock();

            // Camera
            const camera = (this.camera = new THREE.PerspectiveCamera(
                45,
                // document.body.clientWidth / window.innerHeight,
                750/1330,
                1,
                1000
            ));
            camera.position.set(0, 0, 10);

            // Renderer
            const renderer = (this.renderer = new THREE.WebGLRenderer({
                antialias: false,
                alpha: true
            }));
            renderer.domElement.id = 'canvasWebGL';
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(this.width, this.height);
            renderer.gammaFactor = 2.2;
            renderer.setClearColor(0x000000, 1);
            renderer.setClearAlpha(0);
            // renderer.setClearColorHex( 0xffffff, 1 );
            container.appendChild(renderer.domElement);
            // Scene
            this.initScene(callback);
            // Events
            this.initEvents();
        }
        initScene(callback) {
            const scene = (this.scene = new THREE.Scene());
            this.sakura = new Sakura(scene);
            this.animete();
            typeof callback === 'function' && callback();
        }
        initEvents() {
            window.addEventListener('resize', this.onWindowResize.bind(this), false);
        }
        onWindowResize() {
            // this.width = getEleWidth(this.container);
            // this.height = getEleHeight(this.container);
            if(window.innerWidth > 768) {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
            } else {
                this.width = 750;
                this.height = 1330;
            }
            // this.width = 750
            // this.height = 1330
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this.width, this.height);
        }
        animete() {
            const time = this.clock.getDelta()*speed; //落下速度
            this.sakura.render(time);
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(this.animete.bind(this));
        }
    }

    // window.onload = ()=> {
    //     let containerEle = document.querySelector("#tranarea");
    //     new MainScene(containerEle);
    // }

    let containerEle = document.querySelector("#tranarea");
    new MainScene(containerEle);
}