var overlapThreshold = "0"; 
var dTarget = $('.target'); 

var drag1 = Draggable.create(".box, input, button", {
    type:"x,y",
    //type:"rotation",//旋轉物件
    edgeResistance: 0,//設為0-1時,可以把物件拖出綁定的容器,但會自動回到綁定範圍內。
                      //設為1時,移動範圍就只能在綁定的容器內。
                      //設為1以上時,移動的物件會有反彈的效果,但移動範圍只能在綁定範圍內。
                      //可以設為負數
    dragResistance: 0,//拖曳阻力
    bounds:".wrap", //移動的物件被綁在哪一個容器上
    lockAxis:false, //true時,只能拉動直線方向
    throwProps:true,
    zindexBoost:true,
    //trigger:".box2,.box1,", //設定的element會出現可以移動的標示,但需為頁面裡有的element,最上面的element會蓋住其它的
    //cursor:"rotation",//更改游標的圖示
    autoScroll:1,
    //liveSnap:function(endValue) { return Math.round(endValue / 50) * 50; },//設定拖移時的距離
    //liveSnap:{x:[5,20,80,400], y:[10,60,80,500]},
    //liveSnap:{top:function(endValue) { return Math.round(endValue / 50) * 50; }, left:function(endValue) { return Math.round(endValue / 100) * 100; }},
    dragClickables:true,//對像為create()裡的element,true為可拖動,false則不能
    //throwProps:true,
    //throwProps:{top:{min:0, max:1000, end:[0,200,400,600]}},
    minimumMovement:1,//number,設定拖動時的最小單位,數字越大,位移越多才能開始移動element
    force3D:false,//Boolean,當有支援3D時會開啟或關閉
    allowNativeTouchScrolling:false,
    onClick:function() {
        console.log("clicked");
    },
    onDrag:function() {
        
    },
    onDragEnd:function() {
        //Sense overlaps with hitTest() 
        if (this.hitTest(dTarget, overlapThreshold)) {
            //$('.target').fadeOut();
            //this.dragResistance = 1;
            //this.disable();
        }
    }
});

