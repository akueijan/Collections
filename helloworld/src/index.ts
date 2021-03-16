import * as THREE from 'three'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRM, VRMSchema } from '@pixiv/three-vrm'
import { IK, IKChain, IKJoint, IKHelper } from 'three-ik'

window.addEventListener("DOMContentLoaded", () => {
    let control = {
        x: 0,
        y: 0,
        eyes: 'fun',
        eyesInt: 0,
        mouth: '',
        mouthInt: 0
    }
    const gui = new dat.gui.GUI()
    gui.add(control, 'x', -100, 100)
    gui.add(control, 'y', -45, 45)
    let conEyes = gui.add(control, 'eyes', ['Fun', 'Angry', 'Joy', 'Sorrow'])
    gui.add(control, 'eyesInt', 0, 10)
    gui.add(control, 'mouth', ['A', 'O'])
    gui.add(control, 'mouthInt', 0, 10)

    // canvasの取得
    const canvas = document.getElementById('canvas')

    // シーンの生成
    const scene = new THREE.Scene()

    // カメラの生成
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth/canvas.clientHeight, 0.1, 1000)
    camera.position.set(0, 1.3, -1)
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

    // VRMの読み込み
    const loader = new GLTFLoader()
    loader.load('./alicia.vrm',
        (gltf) => {
            VRM.from(gltf).then( (vrm) => {
                // シーンへの追加
                scene.add(vrm.scene)
                console.log(vrm)

                // IKの準備
                const ikList = [new IK(), new IK()] // IKシステム
                const chainList = [new IKChain(), new IKChain()] // チェーン
                const pivotList = [] // ピボット
                const bonesList = [] // ボーン
                const nodesList = [] // ノード

                // ボーン名
                let boneName = [
                    [VRMSchema.HumanoidBoneName.LeftUpperArm,
                    VRMSchema.HumanoidBoneName.LeftLowerArm,
                    VRMSchema.HumanoidBoneName.LeftHand],
                    [VRMSchema.HumanoidBoneName.RightUpperArm,
                    VRMSchema.HumanoidBoneName.RightLowerArm,
                    VRMSchema.HumanoidBoneName.RightHand]
                ]

                for (let j = 0; j < 2; j++) {
                    // ターゲットの生成
                    const movingTarget = new THREE.Mesh(
                        new THREE.SphereGeometry(0.05),
                        new THREE.MeshBasicMaterial({color: 0xff0000}))
                    movingTarget.position.x = -0.2
                    let pivot = new THREE.Object3D()
                    pivot.add(movingTarget)
                    pivot.position.x =  j == 0 ? -0.3 : 0.3
                    pivot.position.y = 1.2
                    pivot.position.z = -0.3
                    scene.add(pivot)
                    pivotList.push(pivot)
          
                    // チェーンの生成
                    const bones = [] // ボーン
                    const nodes = [] // ノード
                    for (let i = 0; i < 3; i++) {
                      // ボーンとノードの生成
                      const bone = new THREE.Bone()
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
                      const target = i === 2 ? movingTarget : null
                      chainList[j].add(new IKJoint(bone, {}), {target})
                    }
          
                    // IKシステムにチェーン追加
                    ikList[j].add(chainList[j])
          
                    // リストに追加
                    bonesList.push(bones)
                    nodesList.push(nodes)
          
                    // ルートボーンの追加
                    scene.add(ikList[j].getRootBone())
          
                    // ヘルパーの追加
                    //const helper = new IKHelper(ikList[j])
                    //scene.add(helper)
                  }

                vrm.blendShapeProxy.setValue(VRMSchema.BlendShapePresetName.Fun, control.eyesInt/10)
                vrm.blendShapeProxy.setValue(VRMSchema.BlendShapePresetName.A, control.mouthInt/10)

                update(vrm)
            })
        }
    )

    // let x = 1
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

    const clock = new THREE.Clock()

    let action = VRMSchema.BlendShapePresetName.Fun
    let aniS = null
    let acTemp = false
    conEyes.onChange((val) => {
        console.log(val)
        // vrm.blendShapeProxy.setValue(control.eyes, 0)
        // vrm.update()
        switch (val) {
            case 'Fun':
                action = VRMSchema.BlendShapePresetName.Fun
                break
            case 'Angry':
                action = VRMSchema.BlendShapePresetName.Angry
                break
            case 'Joy':
                action = VRMSchema.BlendShapePresetName.Joy
                break
            case 'Sorrow':
                action = VRMSchema.BlendShapePresetName.Sorrow
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
    // フレーム毎に呼ばれる
    const update = (vrm) => {
        const deltaTime = clock.getDelta()
        const head = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Head)
        // head.rotation.x = control.y
        head.rotation.x = control.y * 0.01
        head.rotation.y = control.x * 0.01

        aniS = control.eyesInt/10
        // if(acTemp) {
        //     aniS = Math.sin( Math.PI * clock.elapsedTime )
        //     console.log('clock: ', clock.elapsedTime)
        // }
        if(acTemp) {
            console.log(timeCun)
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
        
        vrm.blendShapeProxy.setValue(action, aniS)
        vrm.blendShapeProxy.setValue(VRMSchema.BlendShapePresetName.A, control.mouthInt/10)

        vrm.update(deltaTime)


        requestAnimationFrame(() => update(vrm))
        renderer.render(scene, camera)
    }
    //   update()
})
