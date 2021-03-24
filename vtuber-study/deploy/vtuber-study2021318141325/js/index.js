"use strict";var index_view=new Vue({el:"#app",data:{},methods:{},mounted:function(){var s={x:0,y:0,eyes:"sorrow",eyesInt:0,mouth:"",mouthInt:0,leftHand:.01,rightHand:.01},e=new dat.GUI;e.add(s,"x",-100,100),e.add(s,"y",-45,45);var o=e.add(s,"eyes",["Fun","Angry","Joy","Sorrow"]);e.add(s,"eyesInt",0,10),e.add(s,"mouth",["A","O"]),e.add(s,"mouthInt",0,10),e.add(s,"leftHand",0,10),e.add(s,"rightHand",0,10);var n=document.getElementById("canvas"),u=new THREE.Scene,E=new THREE.PerspectiveCamera(90,n.clientWidth/n.clientHeight,.1,1e3);E.position.set(0,.8,-.95),E.rotation.set(0,Math.PI,0);var m=new THREE.WebGLRenderer;m.setPixelRatio(window.devicePixelRatio),m.setSize(n.clientWidth,n.clientHeight),m.setClearColor(10066329,1),n.appendChild(m.domElement);e=new THREE.DirectionalLight(16777215);e.position.set(-1,1,-1).normalize(),u.add(e);var l=new THREE.Object3D;E.add(l),console.log(l);e=new THREE.GLTFLoader;e.crossOrigin="anonymous",e.load("./static/HumanoidTest3.vrm",function(e){THREE.VRM.from(e).then(function(e){u.add(e.scene),console.log(e),e.scene.position.x=.7,e.scene.position.y=.3,e.scene.position.z=.3,e.scene.rotation.y=.2,e.lookAt.target=l;for(var o=[new THREE.IK,new THREE.IK],n=[new THREE.IKChain,new THREE.IKChain],a=[],t=[],i=[],r=[[THREE.VRMSchema.HumanoidBoneName.LeftUpperArm,THREE.VRMSchema.HumanoidBoneName.LeftLowerArm,THREE.VRMSchema.HumanoidBoneName.LeftHand],[THREE.VRMSchema.HumanoidBoneName.RightUpperArm,THREE.VRMSchema.HumanoidBoneName.RightLowerArm,THREE.VRMSchema.HumanoidBoneName.RightHand]],d=0;d<2;d++){var s=new THREE.Mesh(new THREE.SphereGeometry(0),new THREE.MeshBasicMaterial({color:16711680}));s.position.x=-.2;var E=new THREE.Object3D;E.add(s),E.position.x=0==d?-.3:1,E.position.y=1.2,E.position.z=-.3,u.add(E),a.push(E);for(var m=[],h=[],R=0;R<3;R++){var c=new THREE.Bone,H=e.humanoid.getBoneNode(r[d][R]);0==R?H.getWorldPosition(c.position):(c.position.set(H.position.x,H.position.y,H.position.z),m[R-1].add(c)),m.push(c),h.push(H);H=2===R?s:null;n[d].add(new THREE.IKJoint(c,{}),{target:H})}o[d].add(n[d]),t.push(m),i.push(h),u.add(o[d].getRootBone())}e.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.Sorrow,0),e.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.A,0),S(e,o,a,t,i)})}),e.load("./static/QMO-2.vrm",function(e){THREE.VRM.from(e).then(function(e){u.add(e.scene),console.log(e),e.scene.position.x=-.3,e.scene.position.y=1,e.scene.position.z=.3,e.scene.rotation.y=-.3,e.lookAt.target=l;for(var o=[new THREE.IK,new THREE.IK],n=[new THREE.IKChain,new THREE.IKChain],a=[],t=[],i=[],r=[[THREE.VRMSchema.HumanoidBoneName.LeftUpperArm,THREE.VRMSchema.HumanoidBoneName.LeftLowerArm,THREE.VRMSchema.HumanoidBoneName.LeftHand],[THREE.VRMSchema.HumanoidBoneName.RightUpperArm,THREE.VRMSchema.HumanoidBoneName.RightLowerArm,THREE.VRMSchema.HumanoidBoneName.RightHand]],d=0;d<2;d++){var s=new THREE.Mesh(new THREE.SphereGeometry(0),new THREE.MeshBasicMaterial({color:16711680}));s.position.x=-.2;var E=new THREE.Object3D;E.add(s),E.position.x=0==d?-.3:.3,E.position.y=1.2,E.position.z=-.3,u.add(E),a.push(E);for(var m=[],h=[],R=0;R<3;R++){var c=new THREE.Bone,H=e.humanoid.getBoneNode(r[d][R]);0==R?H.getWorldPosition(c.position):(c.position.set(H.position.x,H.position.y,H.position.z),m[R-1].add(c)),m.push(c),h.push(H);H=2===R?s:null;n[d].add(new THREE.IKJoint(c,{}),{target:H})}o[d].add(n[d]),t.push(m),i.push(h),u.add(o[d].getRootBone())}e.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.Sorrow,0),e.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.A,0),S(e,o,a,t,i)})});function h(e,o,n){var a=new THREE.Quaternion;a.setFromAxisAngle(new THREE.Vector3(0,1,0),n),o[0].setRotationFromQuaternion(e[0].quaternion.multiply(a)),o[1].setRotationFromQuaternion(e[1].quaternion),o[2].setRotationFromQuaternion(e[2].quaternion)}document.body.addEventListener("keydown",function(e){switch(console.log(e.keyCode),e.keyCode){case 39:s.x+=2;break;case 37:s.x-=2;break;case 38:s.y+=1;break;case 40:--s.y}},!1);var R=new THREE.Clock,c=THREE.VRMSchema.BlendShapePresetName.Sorrow,H=null,p=!1;o.onChange(function(e){switch(console.log(e),e){case"Fun":c=THREE.VRMSchema.BlendShapePresetName.Fun;break;case"Angry":c=THREE.VRMSchema.BlendShapePresetName.Angry;break;case"Joy":c=THREE.VRMSchema.BlendShapePresetName.Joy;break;case"Sorrow":c=THREE.VRMSchema.BlendShapePresetName.Sorrow}w=p=!0});var T=0,w=!0,S=function e(o,n,a,t,i){var r=R.getDelta(),d=o.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.Head);d.rotation.x=y,d.rotation.y=g;d=o.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftUpperLeg);d.rotation.y=g,d.rotation.x=.1*y;d=o.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperLeg);d.rotation.y=-g,d.rotation.x=.1*y,H=s.eyesInt/10,p&&(H=.01*T,w?100<=(T+=3)&&(w=!1):(T-=3)<=0&&(T=0)),a[0].rotation.z=s.leftHand/2,a[1].rotation.z=s.rightHand/2,n[0].solve(),n[1].solve(),h(t[0],i[0],Math.PI/2),h(t[1],i[1],-Math.PI/2),o.blendShapeProxy.setValue(c,H),o.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName.A,s.mouthInt/10),o.update(r),requestAnimationFrame(function(){return e(o,n,a,t,i)}),m.render(u,E)},g=0,y=0;n.addEventListener("mousemove",function(e){g=(e.clientX-.5*n.offsetWidth)/n.offsetHeight*1,y=(e.clientY-.5*n.offsetHeight)/n.offsetHeight*-1,(g=.8<=g?.8:g)<=-.8&&(g=-.8),(y=.1<=y?.1:y)<=-.45&&(y=-.45)}),window.addEventListener("mousedown",function(e){console.log(e.button)})}});