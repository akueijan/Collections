import * as THREE from 'three'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRM, VRMSchema } from '@pixiv/three-vrm'

window.addEventListener("DOMContentLoaded", () => {
    let control = {
        x: 0,
        y: 0,
        face: ''
    }
    const gui = new dat.gui.GUI()
    gui.add(control, 'x', -100, 100)
    gui.add(control, 'y', -45, 45)
    gui.add(control, 'face', ['fun', 'angry', 'joy', 'sorrow'])

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
                // const head = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Head)
                // head.rotation.x = Math.PI /6

                // vrm.blendShapeProxy.setValue(VRMSchema.BlendShapePresetName.Fun, 1.0)
                // vrm.blendShapeProxy.setValue(VRMSchema.BlendShapePresetName.O, 1.0)
                // vrm.blendShapeProxy.update()

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

    // let controlface
    // setTimeout(() => {
    //     controlface = 'fun'
    //     setTimeout(() => {
    //         controlface = 'angry'
    //         setTimeout(() => {
    //             controlface = 'joy'
    //             setTimeout(() => {
    //                 controlface = 'fun'
    //                 console.log('faceover')
    //             }, 1000);
    //         }, 1000);
    //     }, 1000);
    // }, 1000);

    // フレーム毎に呼ばれる
    const update = (vrm) => {
        // console.log(x)
        const head = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Head)
        // head.rotation.x = control.y
        head.rotation.x = control.y * 0.01
        head.rotation.y = control.x * 0.01

        vrm.blendShapeProxy.setValue(control.face, 1.0)
        vrm.blendShapeProxy.update()
        // vrm.blendShapeProxy.setValue(VRMSchema.BlendShapePresetName.A, 1.0)
        // vrm.blendShapeProxy.update()


        requestAnimationFrame(() => update(vrm))
        renderer.render(scene, camera)
    }
    //   update()
})
