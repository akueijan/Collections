var index_view = new Vue({
    el: "#app",
    data: {
        
    },
    methods: {
        
    },
    mounted: function() {
        console.log('faceapi: ', faceapi.nets)
        // let input = document.querySelector('#webcanvas')
        // let detections = faceapi.detectAllFaces(input)
        // let video = document.querySelector('#inputVideo')

        // videoRun()

        // this.projApi.post(uri, data)  //Ex
        let control = {
            bgColor: '#212121',
            light: {
                x: -1,
                y: 1,
                z: -1
            },
            eyes: 'sorrow',
            eyesInt: 0,
            mouth: 'A',
            mouthInt: 0,
            head: {
                x: 0,
                y: 0,
                z: 0
            },
            chest: {
                x: 0,
                y: 0,
                z: 0
            },
            leftUpperArm: {
                x: 0,
                y: 0,
                z: 0
            },
            leftLowerArm: {
                x: 0,
                y: 0,
                z: 0
            },
            leftHand: {
                x: 0,
                y: 0,
                z: 0
            },
            leftUpperLeg: {
                x: 0,
                y: 0,
                z: 0
            },
            leftLowerLeg: {
                x: 0,
                y: 0,
                z: 0
            },
            rightUpperArm: {
                x: 0,
                y: 0,
                z: 0
            },
            rightLowerArm: {
                x: 0,
                y: 0,
                z: 0
            },
            rightHand: {
                x: 0,
                y: 0,
                z: 0
            },
            rightUpperLeg: {
                x: 0,
                y: 0,
                z: 0
            },
            rightLowerLeg: {
                x: 0,
                y: 0,
                z: 0
            },
            actionName: {
                none: false,
                walk: false,
                run: false,
                wave: false,
            },
            actionEyes: {
                fun: false,
                angry: false,
                joy: false,
                // sorrow: false
            }
        }
        
        let gui = new dat.GUI()
            gui.addColor(control, 'bgColor')
        let lightFolder = gui.addFolder('light')
            lightFolder.add(control.light, 'x', -1.0, 1.0)
            lightFolder.add(control.light, 'y', -1.0, 1.0)
            lightFolder.add(control.light, 'z', -1.0, 1.0)
        gui.add(control, 'eyesInt', 0, 10)
        gui.add(control, 'mouth', ['A', 'E', 'I', 'O', 'U'])
        gui.add(control, 'mouthInt', 0, 10)
        let headFolder = gui.addFolder('head')
            headFolder.add(control.head, 'x', -2.0, 2.0)
            headFolder.add(control.head, 'y', -2.0, 2.0)
            headFolder.add(control.head, 'z', -2.0, 2.0)
        let chestFolder = gui.addFolder('chest')
            chestFolder.add(control.chest, 'x', -2.0, 2.0)
            chestFolder.add(control.chest, 'y', -2.0, 2.0)
            chestFolder.add(control.chest, 'z', -2.0, 2.0)
        let leftUpperArmFolder = gui.addFolder('leftUpperArm')
            leftUpperArmFolder.add(control.leftUpperArm, 'x', -1.0, 1.0)
            leftUpperArmFolder.add(control.leftUpperArm, 'y', -2.0, 1.0)
            leftUpperArmFolder.add(control.leftUpperArm, 'z', -1.0, 1.0)
        let leftLowerArmFolder = gui.addFolder('leftLowerArm')
            leftLowerArmFolder.add(control.leftLowerArm, 'x', -1.0, 1.0)
            leftLowerArmFolder.add(control.leftLowerArm, 'y', -5.0, 5.0)
            leftLowerArmFolder.add(control.leftLowerArm, 'z', -1.0, 1.0)
        let leftHandFolder = gui.addFolder('leftHand')
            leftHandFolder.add(control.leftHand, 'x', -1, 1)
            leftHandFolder.add(control.leftHand, 'y', -2, 2)
            leftHandFolder.add(control.leftHand, 'z', -1, 1)
        let leftUpperLegFolder = gui.addFolder('leftUpperLeg')
            leftUpperLegFolder.add(control.leftUpperLeg, 'x', -2, 2.0)
            leftUpperLegFolder.add(control.leftUpperLeg, 'y', -5.0, 5.0)
            leftUpperLegFolder.add(control.leftUpperLeg, 'z', -1.0, 1.0)
        let leftLowerLegFolder = gui.addFolder('leftLowerLeg')
            leftLowerLegFolder.add(control.leftLowerLeg, 'x', -2, 2)
            leftLowerLegFolder.add(control.leftLowerLeg, 'y', -5.0, 5) 
            leftLowerLegFolder.add(control.leftLowerLeg, 'z', -1.0, 1.0)
        let rightUpperArmFolder = gui.addFolder('rightUpperArm')
            rightUpperArmFolder.add(control.rightUpperArm, 'x', -1.0, 1.0)
            rightUpperArmFolder.add(control.rightUpperArm, 'y', -2.0, 2.0)
            rightUpperArmFolder.add(control.rightUpperArm, 'z', -1.0, 1.0)
        let rightLowerArmFolder = gui.addFolder('rightLowerArm')
            rightLowerArmFolder.add(control.rightLowerArm, 'x', -1.0, 1.0)
            rightLowerArmFolder.add(control.rightLowerArm, 'y', -5.0, 5.0)
            rightLowerArmFolder.add(control.rightLowerArm, 'z', -1.0, 1.0)
        let rightHandFolder = gui.addFolder('rightHand')
            rightHandFolder.add(control.rightHand, 'x', -1, 1)
            rightHandFolder.add(control.rightHand, 'y', -2, 2)
            rightHandFolder.add(control.rightHand, 'z', -1, 1)
        let rightUpperLegFolder = gui.addFolder('rightUpperLeg')
            rightUpperLegFolder.add(control.rightUpperLeg, 'x', -2, 2.0)
            rightUpperLegFolder.add(control.rightUpperLeg, 'y', -5.0, 5.0)
            rightUpperLegFolder.add(control.rightUpperLeg, 'z', -1.0, 1.0)
        let rightLowerLegFolder = gui.addFolder('rightLowerLeg')
            rightLowerLegFolder.add(control.rightLowerLeg, 'x', -2, 2)
            rightLowerLegFolder.add(control.rightLowerLeg, 'y', -5.0, 5.0)
            rightLowerLegFolder.add(control.rightLowerLeg, 'z', -1.0, 1.0)
        // leftUpperArmFolder.add(control.leftUpperArm, 'y', 0, 10)
        // leftUpperArmFolder.add(control.leftUpperArm, 'z', 0, 10)

        let actionAni = undefined
        let actionbones = undefined
        let actionFolder = gui.addFolder('Actions')
            actionFolder.add(control.actionName, 'none').name('none').listen().onChange(() => {
                setChecked('none')
                if(currentAction) {
                    for(let i=0; i<currentAction.length; i++) {
                        currentAction[i].stop()
                    }
                }
            })
            actionFolder.add(control.actionName, 'walk').name('walk').listen().onChange(() => {
                setChecked('walk')
                actionAni = {
                    hierarchy: [
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -10*Math.PI/180, 0)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 10*Math.PI/180, 0)).toArray(),
                                    time: 600                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -10*Math.PI/180, 0)).toArray(),
                                    time: 1200                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -40*Math.PI/180, 60*Math.PI/180)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 40*Math.PI/180, 60*Math.PI/180)).toArray(),
                                    time: 600                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -40*Math.PI/180, 60*Math.PI/180)).toArray(),
                                    time: 1200                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -40*Math.PI/180, -60*Math.PI/180)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 40*Math.PI/180, -60*Math.PI/180)).toArray(),
                                    time: 600                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -40*Math.PI/180, -60*Math.PI/180)).toArray(),
                                    time: 1200                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-10*Math.PI/180, 0, 0)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(10*Math.PI/180, 0, 0)).toArray(),
                                    time: 600                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-10*Math.PI/180, 0, 0)).toArray(),
                                    time: 1200                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(10*Math.PI/180, 0, 0)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-10*Math.PI/180, 0, 0)).toArray(),
                                    time: 600                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(10*Math.PI/180, 0, 0)).toArray(),
                                    time: 1200                        
                                },
                            ]
                        },
                        
                    ]
                }
                actionbones = [
                    THREE.VRMSchema.HumanoidBoneName.Chest,
                    THREE.VRMSchema.HumanoidBoneName.LeftUpperArm,
                    THREE.VRMSchema.HumanoidBoneName.RightUpperArm,
                    THREE.VRMSchema.HumanoidBoneName.LeftUpperLeg,
                    THREE.VRMSchema.HumanoidBoneName.RightUpperLeg,
                ]
                setupAnimation(currentVrm, actionAni, actionbones)
                for(let i=0; i<currentAction.length; i++) {
                    // currentAction[i].stop()
                    currentAction[i].play()
                }
            })
            actionFolder.add(control.actionName, 'run').name('run').listen().onChange(() => {
                setChecked('run')
                let second = 450
                actionAni = {
                    hierarchy: [
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-30*Math.PI/180, -20*Math.PI/180, 0)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-30*Math.PI/180, 20*Math.PI/180, 0)).toArray(),
                                    time: second           
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-30*Math.PI/180, -20*Math.PI/180, 0)).toArray(),
                                    time: second*2                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-60*Math.PI/180, -40*Math.PI/180, 60*Math.PI/180)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(40*Math.PI/180, -40*Math.PI/180, 60*Math.PI/180)).toArray(),
                                    time: second           
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-60*Math.PI/180, -40*Math.PI/180, 60*Math.PI/180)).toArray(),
                                    time: second*2                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(60*Math.PI/180, -40*Math.PI/180, -60*Math.PI/180)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-40*Math.PI/180, -40*Math.PI/180, -60*Math.PI/180)).toArray(),
                                    time: second                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(60*Math.PI/180, -40*Math.PI/180, -60*Math.PI/180)).toArray(),
                                    time: second*2                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0.9, -90*Math.PI/180, 0)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(1.0, -90*Math.PI/180, 0)).toArray(),
                                    time: second                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0.9, -90*Math.PI/180, 0)).toArray(),
                                    time: second*2                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.8, 90*Math.PI/180, 0)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.9, 90*Math.PI/180, 0)).toArray(),
                                    time: second                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.8, 90*Math.PI/180, 0)).toArray(),
                                    time: second*2                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(60*Math.PI/180, 0, 0)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-40*Math.PI/180, 0, 0)).toArray(),
                                    time: second                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(60*Math.PI/180, 0, 0)).toArray(),
                                    time: second*2                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-40*Math.PI/180, 0, 0)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(60*Math.PI/180, 0, 0)).toArray(),
                                    time: second                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-40*Math.PI/180, 0, 0)).toArray(),
                                    time: second*2                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-90*Math.PI/180, 0, 0)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(20*Math.PI/180, 0, 0)).toArray(),
                                    time: second                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-90*Math.PI/180, 0, 0)).toArray(),
                                    time: second*2                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(20*Math.PI/180, 0, 0)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-90*Math.PI/180, 0, 0)).toArray(),
                                    time: second                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(20*Math.PI/180, 0, 0)).toArray(),
                                    time: second*2                        
                                },
                            ]
                        },
                    ]
                }
                actionbones = [
                    THREE.VRMSchema.HumanoidBoneName.Chest,
                    THREE.VRMSchema.HumanoidBoneName.LeftUpperArm,
                    THREE.VRMSchema.HumanoidBoneName.RightUpperArm,
                    THREE.VRMSchema.HumanoidBoneName.LeftLowerArm,
                    THREE.VRMSchema.HumanoidBoneName.RightLowerArm,
                    THREE.VRMSchema.HumanoidBoneName.LeftUpperLeg,
                    THREE.VRMSchema.HumanoidBoneName.RightUpperLeg,
                    THREE.VRMSchema.HumanoidBoneName.LeftLowerLeg,
                    THREE.VRMSchema.HumanoidBoneName.RightLowerLeg,
                ]
                setupAnimation(currentVrm, actionAni, actionbones)
                // currentAction.loop = THREE.LoopOnce
                // currentAction.LoopOnce = true
                // currentAction.clampWhenFinished = true
                for(let i=0; i<currentAction.length; i++) {
                    // currentAction[i].stop()
                    currentAction[i].play()
                }
            })
            actionFolder.add(control.actionName, 'wave').name('wave').listen().onChange(() => {
                setChecked('wave')
                let second = 600
                actionAni = {
                    hierarchy: [
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -10*Math.PI/180)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 10*Math.PI/180)).toArray(),
                                    time: second           
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -10*Math.PI/180)).toArray(),
                                    time: second*2                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -2*Math.PI/180)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 2*Math.PI/180)).toArray(),
                                    time: second           
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -2*Math.PI/180)).toArray(),
                                    time: second*2                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(1, -10*Math.PI/180, 1)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(1, 10*Math.PI/180, 1)).toArray(),
                                    time: second                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(1, -10*Math.PI/180, 1)).toArray(),
                                    time: second*2                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(1, -2, 0)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.5, -2, 0)).toArray(),
                                    time: second                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(1, -2, 0)).toArray(),
                                    time: second*2                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-1, 0, 0)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.8, 0, 0)).toArray(),
                                    time: second                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(-1, 0, 0)).toArray(),
                                    time: second*2                        
                                },
                            ]
                        },
                        {
                            keys: [
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -1)).toArray(),
                                    time: 0
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -0.9)).toArray(),
                                    time: second                        
                                },
                                {
                                    rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -1)).toArray(),
                                    time: second*2                        
                                },
                            ]
                        },
                    ]
                }
                actionbones = [
                    THREE.VRMSchema.HumanoidBoneName.Head,
                    THREE.VRMSchema.HumanoidBoneName.Chest,
                    THREE.VRMSchema.HumanoidBoneName.LeftUpperArm,
                    THREE.VRMSchema.HumanoidBoneName.LeftLowerArm,
                    THREE.VRMSchema.HumanoidBoneName.LeftHand,
                    THREE.VRMSchema.HumanoidBoneName.RightUpperArm,
                ]
                setupAnimation(currentVrm, actionAni, actionbones)
                // currentAction.loop = THREE.LoopOnce
                // currentAction.LoopOnce = true
                // currentAction.clampWhenFinished = true
                for(let i=0; i<currentAction.length; i++) {
                    // currentAction[i].stop()
                    currentAction[i].play()
                }
            })
        
        let eyeFolder = gui.addFolder('Eyes')
            for(let eyename in control.actionEyes) {
                // console.log('eye ', eyename)
                eyeFolder.add(control.actionEyes, eyename).name(eyename).listen().onChange(() => {
                    setChecked(eyename)
                    if(eyename === 'fun') {
                        eyesAnimation(currentVrm[0], THREE.VRMSchema.BlendShapePresetName.Fun)
                    }
                    if(eyename === 'angry') {
                        eyesAnimation(currentVrm[0], THREE.VRMSchema.BlendShapePresetName.Angry)
                    }
                    if(eyename === 'joy') {
                        eyesAnimation(currentVrm[0], THREE.VRMSchema.BlendShapePresetName.Joy)
                    }
                    // if(eyename === 'sorrow') {
                    //     eyesAnimation(currentVrm[0], THREE.VRMSchema.BlendShapePresetName.Sorrow)
                    // }
                    // eyeAction.loop = THREE.LoopOnce
                    // eyeAction.LoopOnce = true
                    // eyeAction.clampWhenFinished = true
                    eyeAction.play()
                    // mounthAction.loop = THREE.LoopOnce
                    // mounthAction.LoopOnce = true
                    // mounthAction.clampWhenFinished = true
                    mounthAction.play()
                })
            }

        function setChecked(prop) {
            for (let action in control.actionName) {
                control.actionName[action] = false
            }
            for (let action in control.actionEyes) {
                control.actionEyes[action] = false
            }
            control.actionName[prop] = true
            control.actionEyes[prop] = true
        }
        

        const canvas = document.getElementById('canvas')

        const scene = new THREE.Scene()

        const camera = new THREE.PerspectiveCamera(90, canvas.clientWidth/canvas.clientHeight, 0.1, 1000)
        camera.position.set( 0.0, 1.0, -1.0 )
        // camera.rotation.set(0, Math.PI, 0)

        const renderer = new THREE.WebGLRenderer()
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(canvas.clientWidth, canvas.clientHeight)
        renderer.setClearColor(0x212121, 1.0)
        canvas.appendChild(renderer.domElement)
        console.log('render: ', renderer)

        // camera controls
        const controls = new THREE.OrbitControls( camera, renderer.domElement )
        controls.screenSpacePanning = true
        controls.target.set( 0.0, 1.0, 0.0 )
        controls.update()

        const light = new THREE.DirectionalLight(0xffffff)
        light.position.set(-1, 1, -1).normalize()
        scene.add(light)

        const lookAtTarget = new THREE.Object3D()
        camera.add( lookAtTarget )
        // console.log(lookAtTarget)
        
        const loader = new THREE.GLTFLoader()
        loader.crossOrigin = 'anonymous'

        let currentVrm = []
        let mixer = undefined
        let currentMixer = undefined
        let currentAction = undefined
        let eyeCurrentMixer = undefined
        let eyeAction = undefined
        let mounthCurrentMixer = undefined
        let mounthAction = undefined


        // loader.load('./static/alicia.vrm',
        //     (gltf) => {
        //         THREE.VRM.from(gltf).then( (vrm) => {
        //             // シーンへの追加
        //             scene.add(vrm.scene)
        //             console.log("vrm: ", vrm)

        //             currentVrm.push(vrm)

        //             // vrm.scene.position.x = -1
        //             // vrm.scene.position.y = 0
        //             // vrm.scene.position.z = 0.3
        //             // vrm.scene.rotation.y = 0.3

        //             vrm.lookAt.target = lookAtTarget;

        //             // IKの準備
        //             let ikList = [new THREE.IK(), new THREE.IK()] // IKシステム
        //             let chainList = [new THREE.IKChain(), new THREE.IKChain()] // チェーン
        //             let pivotList = [] // ピボット
        //             let bonesList = [] // ボーン
        //             let nodesList = [] // ノード

        //             // ボーン名
        //             let boneName = [
        //                 [THREE.VRMSchema.HumanoidBoneName.LeftUpperArm,
        //                 THREE.VRMSchema.HumanoidBoneName.LeftLowerArm,
        //                 THREE.VRMSchema.HumanoidBoneName.LeftHand],
        //                 [THREE.VRMSchema.HumanoidBoneName.RightUpperArm,
        //                 THREE.VRMSchema.HumanoidBoneName.RightLowerArm,
        //                 THREE.VRMSchema.HumanoidBoneName.RightHand]
        //             ]

        //             // for (let j = 0; j < 2; j++) {
        //             //     // ターゲットの生成
        //             //     let movingTarget = new THREE.Mesh(
        //             //         new THREE.SphereGeometry(0.01),
        //             //         new THREE.MeshBasicMaterial({color: 0xff0000})
        //             //     )
        //             //     movingTarget.position.x = -0.2
        //             //     let pivot = new THREE.Object3D()
        //             //     pivot.add(movingTarget)
        //             //     pivot.position.x =  j == 0 ? -0.3 : 0.3
        //             //     pivot.position.y = 1.2
        //             //     pivot.position.z = -0.3
        //             //     scene.add(pivot)
        //             //     pivotList.push(pivot)
            
        //             //     // チェーンの生成
        //             //     let bones = [] // ボーン
        //             //     let nodes = [] // ノード
        //             //     for (let i = 0; i < 3; i++) {
        //             //     // ボーンとノードの生成
        //             //     let bone = new THREE.Bone()
        //             //     let node = vrm.humanoid.getBoneNode(boneName[j][i])
            
        //             //     if (i == 0) {
        //             //         node.getWorldPosition(bone.position)
        //             //     } else {
        //             //         bone.position.set(node.position.x, node.position.y, node.position.z)
        //             //         bones[i - 1].add(bone)
        //             //     }
        //             //     bones.push(bone)
        //             //     nodes.push(node)
            
        //             //     // チェーンに追加
        //             //     let target = i === 2 ? movingTarget : null
        //             //     chainList[j].add(new THREE.IKJoint(bone, {}), {target})
        //             //     }
            
        //             //     // IKシステムにチェーン追加
        //             //     ikList[j].add(chainList[j])
            
        //             //     // リストに追加
        //             //     bonesList.push(bones)
        //             //     nodesList.push(nodes)
            
        //             //     // ルートボーンの追加
        //             //     scene.add(ikList[j].getRootBone())
            
        //             //     // ヘルパーの追加
        //             //     // let helper = new IKHelper(ikList[j])
        //             //     // scene.add(helper)
        //             // }

        //             // vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.Sorrow, 0)
        //             // vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.A, 0)

        //             // setupAnimation(vrm)
        //             // eyesAnimation(vrm)
        //             update(vrm, ikList, pivotList, bonesList, nodesList)
        //         })
        //     }
        // )
        // loader.load('./static/alicia.vrm',
        loader.load('./static/QMO_1.vrm',
            (gltf) => {
                THREE.VRM.from(gltf).then( (vrm) => {
                    // シーンへの追加
                    scene.add(vrm.scene)
                    console.log(vrm)
                    // currentVrm = vrm
                    currentVrm.push(vrm)

                    // vrm.scene.position.x = -1
                    // vrm.scene.position.y = 0.8
                    // vrm.scene.position.z = 0.5
                    // vrm.scene.rotation.y = -0.3

                    vrm.lookAt.target = lookAtTarget;

                    // IKの準備
                    let ikList = [new THREE.IK(), new THREE.IK()] // IKシステム
                    let chainList = [new THREE.IKChain(), new THREE.IKChain()] // チェーン
                    let pivotList = [] // ピボット
                    let bonesList = [] // ボーン
                    let nodesList = [] // ノード

                    // ボーン名
                    let boneName = [
                        [THREE.VRMSchema.HumanoidBoneName.LeftUpperArm,
                        THREE.VRMSchema.HumanoidBoneName.LeftLowerArm,
                        THREE.VRMSchema.HumanoidBoneName.LeftHand],
                        [THREE.VRMSchema.HumanoidBoneName.RightUpperArm,
                        THREE.VRMSchema.HumanoidBoneName.RightLowerArm,
                        THREE.VRMSchema.HumanoidBoneName.RightHand]
                    ]

                    // for (let j = 0; j < 2; j++) {
                    //     // ターゲットの生成
                    //     let movingTarget = new THREE.Mesh(
                    //         new THREE.SphereGeometry(0.01),
                    //         new THREE.MeshBasicMaterial({color: 0xff0000})
                    //     )
                    //     movingTarget.position.x = -0.2
                    //     let pivot = new THREE.Object3D()
                    //     pivot.add(movingTarget)
                    //     pivot.position.x =  j == 0 ? -0.3 : 0.3
                    //     pivot.position.y = 1.2
                    //     pivot.position.z = -0.3
                    //     scene.add(pivot)
                    //     pivotList.push(pivot)
            
                    //     // チェーンの生成
                    //     let bones = [] // ボーン
                    //     let nodes = [] // ノード
                    //     for (let i = 0; i < 3; i++) {
                    //     // ボーンとノードの生成
                    //     let bone = new THREE.Bone()
                    //     let node = vrm.humanoid.getBoneNode(boneName[j][i])
            
                    //     if (i == 0) {
                    //         node.getWorldPosition(bone.position)
                    //     } else {
                    //         bone.position.set(node.position.x, node.position.y, node.position.z)
                    //         bones[i - 1].add(bone)
                    //     }
                    //     bones.push(bone)
                    //     nodes.push(node)
            
                    //     // チェーンに追加
                    //     let target = i === 2 ? movingTarget : null
                    //     chainList[j].add(new THREE.IKJoint(bone, {}), {target})
                    //     }
            
                    //     // IKシステムにチェーン追加
                    //     ikList[j].add(chainList[j])
            
                    //     // リストに追加
                    //     bonesList.push(bones)
                    //     nodesList.push(nodes)
            
                    //     // ルートボーンの追加
                    //     scene.add(ikList[j].getRootBone())
            
                    //     // ヘルパーの追加
                    //     // let helper = new IKHelper(ikList[j])
                    //     // scene.add(helper)
                    // }

                    // vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.Sorrow, 0)
                    // vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.A, 0)

                    // setupAnimation(vrm)
                    // eyesAnimation(vrm)
                    update(vrm, ikList, pivotList, bonesList, nodesList)
                })
            }
        )

        
        // helper
        
        const gridHelper = new THREE.GridHelper( 10, 10 );
        scene.add( gridHelper )

        const axesHelper = new THREE.AxesHelper( 5 );
        scene.add( axesHelper )

        // 腕の更新
        let updateArm = (bones, nodes, offset) => {
            let q = new THREE.Quaternion()
            q.setFromAxisAngle( new THREE.Vector3(0, 1, 0), offset)
            nodes[0].setRotationFromQuaternion(bones[0].quaternion.multiply(q))
            nodes[1].setRotationFromQuaternion(bones[1].quaternion)
            nodes[2].setRotationFromQuaternion(bones[2].quaternion)
        }

        let body = document.body
        function getkeycode(e) {
            console.log(e.keyCode)
            switch(e.keyCode) {
                case 39:
                    control.x += 2
                    break
                case 37:
                    control.x -= 2
                    break
                case 38:
                    control.y += 1
                    break
                case 40:
                    control.y -= 1
                    break
                default:
                    break
            }
        }
        // body.addEventListener('keydown', getkeycode, false)

        let clock = new THREE.Clock()

        let setupAnimation = (vrm, actionAni, actionbones) => {
            currentMixer = []
            let currentActionTemp = []
            for(let i=0; i<vrm.length; i++) {
                let bones = actionbones.map(function(boneName) {
                    // console.log(vrm.humanoid.getBoneNode(boneName))
                    return vrm[i].humanoid.getBoneNode(boneName)
                })
                let clip = THREE.AnimationClip.parseAnimation(actionAni, bones)
                clip.tracks.some((track) => {
                    track.name = track.name.replace(/^\.bones\[([^\]]+)\].(position|quaternion|scale)$/, '$1.$2')
                })
                currentMixer.push(new THREE.AnimationMixer(vrm[i].scene))
                // for(let j=0; j<currentMixer.length; j++) {
                //     currentActionTemp.push(currentMixer[j].clipAction(clip))
                // }
                currentActionTemp.push(currentMixer[i].clipAction(clip))
                console.log(currentActionTemp)
                currentAction = currentActionTemp
            }
            // for(let i=0; i<currentActionTemp.length; i++) {
            //     // console.log(currentActionTemp[i])
            //     currentActionTemp[i].reset()
            // }
            // console.log(currentMixer)


            // console.log('bones: ', bones)
            // currentMixer = mixer
            // console.log(clip)
            // console.log('aasd ', mixer)
    
            // let action = mixer.clipAction(clip)
            // action.stop()
        }

        let eyesAnimation = (vrm, eyeActionAni) => {
            let action = undefined
            let blinkTrack = new THREE.NumberKeyframeTrack(
                vrm.blendShapeProxy.getBlendShapeTrackName( eyeActionAni ), // name
                [ 0.0, 0.6, 1.2 ], // times
                [ 0.0, 1, 0.0 ] // values
            )
            eyeCurrentMixer = new THREE.AnimationMixer( vrm.scene )
            let clip = new THREE.AnimationClip( 'blink', 1.0, [blinkTrack] )
            eyeAction = eyeCurrentMixer.clipAction( clip )
            // eyeAction.play()
        }

        let mounthAnimation = (vrm, mounthActionAni) => {
            let blinkTrack2 = new THREE.NumberKeyframeTrack(
                vrm.blendShapeProxy.getBlendShapeTrackName( mounthActionAni ), // name
                [ 0.0, 0.6, 1.2 ], // times
                [ 0.0, 1, 0.0 ] // values
            )

            mounthCurrentMixer = new THREE.AnimationMixer( vrm.scene )
            let clip2 = new THREE.AnimationClip( 'blink', 1.0, [blinkTrack2] )
            mounthAction = mounthCurrentMixer.clipAction( clip2 )
        }

        let lastTime = (new Date()).getTime()

        let update = (vrm, ikList, pivotList, bonesList, nodesList) => {
            const deltaTime = clock.getDelta()
            const Head = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.Head) // 頭
            const Jaw = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.Jaw) // 顎
            const Neck = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.Neck) // 脖子
            const Chest = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.Chest) // 胸部
            const Hips = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.Hips) // 臀部
            const LeftEye = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftEye) // 左眼
            const LeftLowerArm = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftLowerArm) // 左下臂
            const LeftUpperArm = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftUpperArm) // 左上臂
            const LeftHand = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftHand) // 左手
            const LeftLowerLeg = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftLowerLeg) // 左下腿
            const LeftUpperLeg = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftUpperLeg) // 左上腿
            const LeftFoot = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftFoot) // 左腳
            const RightEye = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightEye) // 右眼
            const RightUpperArm = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperArm) // 右上臂
            const RightLowerArm = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLowerArm) // 右下臂
            const RightHand = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightHand) // 右手
            const RightUpperLeg = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperLeg) // 右上腿
            const RightLowerLeg = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLowerLeg) // 右下腿
            const RightFoot = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightFoot) // 右腳


            // head.rotation.x = control.y
            // head.rotation.x = control.y * 0.01 // 頭左右移
            // head.rotation.y = control.x * 0.01 // 頭上下移

            // Head.rotation.x = offsetY
            // Head.rotation.y = offsetX
            // Head.rotation.x = control.head.x
            // Head.rotation.y = control.head.y
            // Head.rotation.z = control.head.z

            Chest.rotation.x = control.chest.x
            Chest.rotation.y = control.chest.y
            Chest.rotation.z = control.chest.z

            LeftUpperArm.rotation.x = control.leftUpperArm.x
            LeftUpperArm.rotation.y = control.leftUpperArm.y
            LeftUpperArm.rotation.z = control.leftUpperArm.z

            LeftLowerArm.rotation.x = control.leftLowerArm.x
            LeftLowerArm.rotation.y = control.leftLowerArm.y
            LeftLowerArm.rotation.z = control.leftLowerArm.z

            LeftHand.rotation.x = control.leftHand.x
            LeftHand.rotation.y = control.leftHand.y
            LeftHand.rotation.z = control.leftHand.z

            LeftUpperLeg.rotation.x = control.leftUpperLeg.x
            LeftUpperLeg.rotation.y = control.leftUpperLeg.y
            LeftUpperLeg.rotation.z = control.leftUpperLeg.z
            
            LeftLowerLeg.rotation.x = control.leftLowerLeg.x
            LeftLowerLeg.rotation.y = control.leftLowerLeg.y
            LeftLowerLeg.rotation.z = control.leftLowerLeg.z


            RightUpperArm.rotation.x = control.rightUpperArm.x
            RightUpperArm.rotation.y = -control.rightUpperArm.y
            RightUpperArm.rotation.z = -control.rightUpperArm.z

            RightLowerArm.rotation.x = control.rightLowerArm.x
            RightLowerArm.rotation.y = -control.rightLowerArm.y
            RightLowerArm.rotation.z = -control.rightLowerArm.z

            RightHand.rotation.x = control.rightHand.x
            RightHand.rotation.y = -control.rightHand.y
            RightHand.rotation.z = -control.rightHand.z

            RightUpperLeg.rotation.x = control.rightUpperLeg.x
            RightUpperLeg.rotation.y = control.rightUpperLeg.y
            RightUpperLeg.rotation.z = control.rightUpperLeg.z
            
            RightLowerLeg.rotation.x = control.rightLowerLeg.x
            RightLowerLeg.rotation.y = control.rightLowerLeg.y
            RightLowerLeg.rotation.z = control.rightLowerLeg.z
            // LeftLowerArm.rotation.y = Math.PI * Math.sin( control.leftLowerArm )
            // LeftHand.rotation.z = Math.PI * Math.sin( control.leftHand )

            // ターゲットの移動
            // pivotList[0].rotation.z -= 0.01
            // pivotList[1].rotation.z += 0.01
            // pivotList[0].rotation.z = control.leftHand / 2 // 左手
            // pivotList[1].rotation.z = control.rightHand / 2 // 右手

            // console.log(clock.elapsedTime)
            const s = 0.25 * Math.PI * Math.sin( Math.PI * clock.elapsedTime )
            // vrm.humanoid.getBoneNode( THREE.VRMSchema.HumanoidBoneName.Neck ).rotation.z = s * 0.05;
            // // vrm.humanoid.getBoneNode( THREE.VRMSchema.HumanoidBoneName.UpperChest ).rotation.z = s * 0.05;
            // vrm.humanoid.getBoneNode( THREE.VRMSchema.HumanoidBoneName.LeftUpperArm ).rotation.y = s;
            // vrm.humanoid.getBoneNode( THREE.VRMSchema.HumanoidBoneName.LeftUpperArm ).rotation.z = 1.1
            // vrm.humanoid.getBoneNode( THREE.VRMSchema.HumanoidBoneName.RightUpperArm ).rotation.y = s;
            // vrm.humanoid.getBoneNode( THREE.VRMSchema.HumanoidBoneName.RightUpperArm ).rotation.z = -1.1
            // vrm.humanoid.getBoneNode( THREE.VRMSchema.HumanoidBoneName.LeftUpperLeg ).rotation.x = s * 0.25;
            // vrm.humanoid.getBoneNode( THREE.VRMSchema.HumanoidBoneName.RightUpperLeg ).rotation.x = s * -0.25;

            // console.log('awef: ', vrm.humanoid.getBoneNode( THREE.VRMSchema.HumanoidBoneName.Neck ))
            
            // IKの更新
            // ikList[0].solve()
            // ikList[1].solve()

            // 腕の更新
            // updateArm(bonesList[0], nodesList[0], Math.PI / 2)
            // updateArm(bonesList[1], nodesList[1], -Math.PI / 2)
            // walkAni()

            let time = (new Date()).getTime()
            let delta = time - lastTime
            
            if (currentMixer) {
                for(let i=0; i<currentMixer.length; i++) {
                    currentMixer[i].update(delta)
                }
            }

            if (eyeCurrentMixer) {
                eyeCurrentMixer.update(deltaTime)
            }


            lastTime = time

            vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.Sorrow, control.mouthInt/10)
            if(control.mouth == 'A') {
                vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.A, control.mouthInt/10)
            }
            if(control.mouth == 'E') {
                vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.E, control.mouthInt/10)
            }
            if(control.mouth == 'I') {
                vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.I, control.mouthInt/10)
            }
            if(control.mouth == 'O') {
                vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.O, control.mouthInt/10)
            }
            if(control.mouth == 'U') {
                vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.U, control.mouthInt/10)
            }
    
            vrm.update(deltaTime)

            requestAnimationFrame(() => update(vrm, ikList, pivotList, bonesList, nodesList))
            renderer.setClearColor(control.bgColor, 1.0)
            light.position.set(control.light.x, control.light.y, control.light.z).normalize()
            renderer.render(scene, camera)
        }

        // mouse listener
        let offsetX = 0
        let offsetY = 0
        canvas.addEventListener( 'mousemove', ( event ) => {
            // lookAtTarget.position.x =  10.0 * ( ( event.clientX - 0.5 * canvas.offsetWidth ) / canvas.offsetHeight );
            // lookAtTarget.position.y = -10.0 * ( ( event.clientY - 0.5 * canvas.offsetHeight ) / canvas.offsetHeight );
            offsetX = ( ( event.clientX - 0.5 * canvas.offsetWidth ) / canvas.offsetHeight ) * 1.0;
            offsetY = ( ( event.clientY - 0.5 * canvas.offsetHeight ) / canvas.offsetHeight ) * -1.0;
            if(offsetX >= 0.8) {
                offsetX = 0.8
            }
            if(offsetX <= -0.8) {
                offsetX = -0.8
            }
            if(offsetY >= 0.10) {
                offsetY = 0.10
            }
            if(offsetY <= -0.45) {
                offsetY = -0.45
            }
            // console.log(x)
        })
        // window.addEventListener( 'mousedown', ( event ) => {
        //     console.log(event.button)
        // })

        function videoRun() {
            let video = document.querySelector('#inputVideo')
            
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/static/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/static/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/static/models'),
                faceapi.nets.faceExpressionNet.loadFromUri('/static/models'),
            ])
            .then(startVideo)
            
            function startVideo() {
                navigator.getUserMedia(
                    { video: {} },
                    stream => video.srcObject = stream,
                    err => console.error(err)
                )
            }
            
            video.addEventListener('play', () => {
                const canvas = faceapi.createCanvasFromMedia(video)
                document.querySelector('#webcanvas').append(canvas)
                const displaySize = { width: video.width, height: video.height }
                faceapi.matchDimensions(canvas, displaySize)
                let happyAni
                setInterval(async () => {
                    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks()
                        .withFaceExpressions()
                    if(detections[0]) {
                        if(detections[0].expressions.happy > 0.5) {
                            console.log('happy')
                            happyAni = setTimeout(() => {
                                eyesAnimation(currentVrm[0], THREE.VRMSchema.BlendShapePresetName.Fun)
                                mounthAnimation(currentVrm[0], THREE.VRMSchema.BlendShapePresetName.A)
                                eyeAction.loop = THREE.LoopOnce
                                eyeAction.LoopOnce = true
                                eyeAction.play()

                                mounthAction.loop = THREE.LoopOnce
                                mounthAction.LoopOnce = true
                                mounthAction.play()
                            }, 600)
                        }
                    }
                    const resizedDetections = faceapi.resizeResults(detections, displaySize)
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                    faceapi.draw.drawDetections(canvas, resizedDetections)
                    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
                    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
                }, 1200)
            })
        }
    }
})


