var index_view = new Vue({
    el: "#app",
    data: {
        
    },
    methods: {
        
    },
    mounted: function() {
        // this.projApi.post(uri, data)  //Ex
        let control = {
            x: 0,
            y: 0,
            eyes: 'sorrow',
            eyesInt: 0,
            mouth: '',
            mouthInt: 0,
            leftHand: 0.01,
            rightHand: 0.01
        }
        let gui = new dat.GUI()
        gui.add(control, 'x', -100, 100)
        gui.add(control, 'y', -45, 45)
        let conEyes = gui.add(control, 'eyes', ['Fun', 'Angry', 'Joy', 'Sorrow'])
        gui.add(control, 'eyesInt', 0, 10)
        gui.add(control, 'mouth', ['A', 'O'])
        gui.add(control, 'mouthInt', 0, 10)
        gui.add(control, 'leftHand', 0, 10)
        gui.add(control, 'rightHand', 0, 10)

        const canvas = document.getElementById('canvas')

        // シーンの生成
        const scene = new THREE.Scene()

        // カメラの生成
        const camera = new THREE.PerspectiveCamera(90, canvas.clientWidth/canvas.clientHeight, 0.1, 1000)
        camera.position.set(0, 1, -0.8)
        camera.rotation.set(0, Math.PI, 0)

        // レンダラーの生成
        const renderer = new THREE.WebGLRenderer()
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(canvas.clientWidth, canvas.clientHeight)
        renderer.setClearColor(0x7fbfff, 1.0)
        canvas.appendChild(renderer.domElement)

        // ライトの生成
        const light = new THREE.DirectionalLight(0xffffff)
        light.position.set(-1, 1, -1).normalize()
        scene.add(light)

        const lookAtTarget = new THREE.Object3D();
        camera.add( lookAtTarget );
        console.log(lookAtTarget)
        
        const loader = new THREE.GLTFLoader();
        loader.crossOrigin = 'anonymous';
        loader.load('./static/alicia.vrm',
            (gltf) => {
                THREE.VRM.from(gltf).then( (vrm) => {
                    // シーンへの追加
                    scene.add(vrm.scene)
                    console.log(vrm)

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

                    for (let j = 0; j < 2; j++) {
                        // ターゲットの生成
                        let movingTarget = new THREE.Mesh(
                            new THREE.SphereGeometry(0),
                            new THREE.MeshBasicMaterial({color: 0xff0000})
                            )
                        movingTarget.position.x = -0.2
                        let pivot = new THREE.Object3D()
                        pivot.add(movingTarget)
                        pivot.position.x =  j == 0 ? -0.3 : 0.3
                        pivot.position.y = 1.2
                        pivot.position.z = -0.3
                        scene.add(pivot)
                        pivotList.push(pivot)
            
                        // チェーンの生成
                        let bones = [] // ボーン
                        let nodes = [] // ノード
                        for (let i = 0; i < 3; i++) {
                        // ボーンとノードの生成
                        let bone = new THREE.Bone()
                        let node = vrm.humanoid.getBoneNode(boneName[j][i])
            
                        if (i == 0) {
                            node.getWorldPosition(bone.position)
                        } else {
                            bone.position.set(node.position.x, node.position.y, node.position.z)
                            bones[i - 1].add(bone)
                        }
                        bones.push(bone)
                        nodes.push(node)
            
                        // チェーンに追加
                        let target = i === 2 ? movingTarget : null
                        chainList[j].add(new THREE.IKJoint(bone, {}), {target})
                        }
            
                        // IKシステムにチェーン追加
                        ikList[j].add(chainList[j])
            
                        // リストに追加
                        bonesList.push(bones)
                        nodesList.push(nodes)
            
                        // ルートボーンの追加
                        scene.add(ikList[j].getRootBone())
            
                        // ヘルパーの追加
                        // let helper = new IKHelper(ikList[j])
                        // scene.add(helper)
                    }

                    vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.Sorrow, 0)
                    vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.A, 0)

                    update(vrm, ikList, pivotList, bonesList, nodesList)

                })
            }
        )

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
        body.addEventListener('keydown', getkeycode, false)

        let clock = new THREE.Clock()
        
        let action = THREE.VRMSchema.BlendShapePresetName.Sorrow
        let aniS = null
        let acTemp = false
        conEyes.onChange((val) => {
            console.log(val)
            // vrm.blendShapeProxy.setValue(control.eyes, 0)
            // vrm.update()
            switch (val) {
                case 'Fun':
                    action = THREE.VRMSchema.BlendShapePresetName.Fun
                    break
                case 'Angry':
                    action = THREE.VRMSchema.BlendShapePresetName.Angry
                    break
                case 'Joy':
                    action = THREE.VRMSchema.BlendShapePresetName.Joy
                    break
                case 'Sorrow':
                    action = THREE.VRMSchema.BlendShapePresetName.Sorrow
                    break
                default:
                    break
            }
            // aniS = Math.sin( Math.PI * clock.elapsedTime )
            acTemp = true
            timeSwich = true
        })

        let timeCun = 0
        let timeSwich = true

        let update = (vrm, ikList, pivotList, bonesList, nodesList) => {
            const deltaTime = clock.getDelta()
            const head = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.Head)
            // head.rotation.x = control.y
            // head.rotation.x = control.y * 0.01 // 頭左右移
            // head.rotation.y = control.x * 0.01 // 頭上下移

            head.rotation.x = offsetY
            head.rotation.y = offsetX

            const LeftUpperLeg = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftUpperLeg)
            // console.log(LeftUpperLeg.rotation.x)
            // console.log(LeftUpperLeg.position.y)
            LeftUpperLeg.rotation.y = offsetX
            LeftUpperLeg.rotation.x = offsetY * 0.1
            // console.log(LeftFoot)

            const RightUpperLeg = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperLeg)
            RightUpperLeg.rotation.y = -offsetX
            RightUpperLeg.rotation.x = offsetY * 0.1

            aniS = control.eyesInt/10
            if(acTemp) {
                // console.log(timeCun)
                aniS = timeCun * 0.01
                if(timeSwich) {
                    timeCun += 3
                    if(timeCun >= 100) {
                        timeSwich = false
                    }
                } else {
                    timeCun -= 3
                    if(timeCun <= 0) {
                        timeCun = 0
                    }
                }
            }

            // ターゲットの移動
            // pivotList[0].rotation.z -= 0.01
            // pivotList[1].rotation.z += 0.01
            pivotList[0].rotation.z = control.leftHand / 2 // 左手
            pivotList[1].rotation.z = control.rightHand / 2 // 右手

            // IKの更新
            ikList[0].solve()
            ikList[1].solve()

            // 腕の更新
            updateArm(bonesList[0], nodesList[0], Math.PI / 2)
            updateArm(bonesList[1], nodesList[1], -Math.PI / 2)

            vrm.blendShapeProxy.setValue(action, aniS)
            vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.A, control.mouthInt/10)
    
            vrm.update(deltaTime)

            requestAnimationFrame(() => update(vrm, ikList, pivotList, bonesList, nodesList))
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
        window.addEventListener( 'mousedown', ( event ) => {
            console.log(event.button)
        })
    }
})
