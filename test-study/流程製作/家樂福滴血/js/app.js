(function($) {
    $.fn.menu = function(opts) {
        // default configuration
        var config = $.extend({}, {
            opt1: null
        }, opts);
        // main function
        function init(obj) {
            var dObj = $(obj);
            var dMenulink = dObj.find('.nav-btn');
            var dAllLink = dObj.find('.nav-menu a');

            dMenulink.click(function() {
                dObj.toggleClass('nav--active');
                // $('body').toggleClass('_freeze');
            });

            dAllLink.click(function() {
                dObj.removeClass('active')
            });
        }
        // initialize every element
        this.each(function() {
            init($(this));
        });
        return this;
    };
    // start
    $(function() {
        $(".nav").menu();
    });
})(jQuery);

window.Vue.use(window.VueGrecaptcha, {
    sitekey: '6LdmQj4UAAAAAM3ParcNWkA0QuQDoZ__sUGk2jvE'
})

var fbhtml_url="http://www.yahoo.com.tw";
var lists = [
    { "text": "請選擇身份證第一碼", "value": ""}
];

for(var i = 65; i <=90; i++) {
    lists.push({
        "text": String.fromCharCode(i),
        "value": String.fromCharCode(i),
    })
};


var app = new Vue({
    el: '#app',
    data: {
        captchaResponse:"",
        numStr:"",
        numStr2:"",
        perId:"",
        selAZ:"",
        userDesc:"",
        userCa:"",
        selectOpt:"",
        selectLists: lists,
        test: false,
        btnAnimating: [],
        step1: true,
        step2: false,
        step3: false,
        step4: false,
        step5: false,
    },
    props: {
    },
    watch: {
    },
    computed: {
    },
    methods: {
        optValue: function(val) {
            return 1
        },

        signup: function() {
            alert("送出");
        },

        pushVal: function(val){
            var vm = this; // now vm = app
            //用if else讓判斷走該走的路線
            if (vm.numStr.length >= 10) {
                alert("電話號碼超過10個字");//當numStr長度超過10時，顯示訊息並停止
            } else {
                vm.numStr += val; // vm.numStr為data裡的numStr變數
            }
        },

        delStr: function(val) {
            var vm = this;
            // var str = vm.numStr;
            // str = str.slice(0, -1);
            // vm.numStr = str; //把str值回推numStr
            vm.numStr = vm.numStr.slice(0, -1);
        },

        selObj: function(val) {
            var vm = this;
            vm.selAZ = vm.userDesc;
        },

        clear: function(val) {
            var vm = this;
            vm.numStr = "";
            vm.selAZ = "";
        },

        fbShare: function() {
            window.open('http://www.facebook.com/sharer/sharer.php?u='+fbhtml_url);
        },

        resetRecaptcha() {
            this.$refs.recaptcha.reset(); // Direct call reset method
        },

        sakura: function() {
            var fa = false;
  
            //more layers and css blur will cause performance drop
            var layer2 = new Layer(16, 6);
            setInterval(layer2.addIcon, 400);

            var layer1 = new Layer(32, 4);
            setInterval(layer1.addIcon, 800);

            function Layer(str, speed){
                this.addIcon = function(){
                    var random_icon = icons[Math.floor(Math.random()*icons.length)];
                    var $random_x = Math.floor((Math.random() * 600) + 1);
                
                    var str= '<div class=hana></div>'
                    var $icon = $(str).appendTo("#sakura");

                    //initial position
                    TweenLite.to($icon, 0, {x: $random_x, color: "#2222ff", y: -80});

                    //main animation
                    TweenLite.to($icon, speed, {color: "#ff00ff", y: 800, x: $random_x + (Math.random() * 400), opacity: 0, ease:Linear.easeNone, onComplete: deleteIcon, onCompleteParams: ["{self}"]});

                    //rotate animation
                    var rotation_speed = (Math.random() + 10);
                    TweenMax.to($icon, rotation_speed, {rotation: 390, ease:Linear.easeNone, repeat: -1});
                };

                var deleteIcon = function(obj){
                    obj.target.remove();
                    obj.remove;
                };

                var icons = [];
            }
        },

        startAni: function() {
            var sec = 0.3;
            var tl = new TimelineMax({ 
                repeatDelay:0,
                onStart: function() {
                    TweenMax.set($('#ripple'),{opacity:1})
                },
                onComplete: function() {
  
                },
            });
            tl.to(".kv__item", sec*3, { opacity: 1 })
                .to(".kv__hand", sec*2, { y: -262 })
                .to(".kv__hand", sec*2, { transformStyle:"preserve-3d", rotationY: 45, opacity:0 })
                .to(".kv__blood", sec*8, { opacity: 0.8, scale: 1,ease: Elastic.easeInOut.config(1, 0.3), transformOrigin:"center center"})

        },

        fixAni: function() {
            $(window).scroll(function() {
                var windowScrollTop = $("body").scrollTop()>0?$("body").scrollTop():$("html, body").scrollTop();
                var tl = new TimelineMax();
                var sec = 0.3;
                if(windowScrollTop > $(".step__hd").offset().top-200) {
                    tl.to(".step__other", sec*3, { right: 0 })
                } else {
                    tl.to(".step__other", sec*1, { right: -$(".step__other").width() })
                }
            });
        },

        fixSakura: function() {
            $(window).scroll(function() {
                var windowScrollTop = $("body").scrollTop()>0?$("body").scrollTop():$("html, body").scrollTop();
                var tl = new TimelineMax();
                var sec = 0.3;
                if(windowScrollTop > $(".step__hd").offset().top-150) {
                    tl.to("#sakura", sec*3, { opacity: 1 })
                } else {
                    tl.to("#sakura", sec*1, { opacity: 0 })
                }
            });
        },

        control_1: function() {
            var vm = this;
            if(!vm.numStr.length > 0) {
                alert("請輸入電話號碼");
            } else {
                vm.step1 = false;
                vm.step2 = true;
            }
        },
        
        control_2: function() {
            var vm = this;
            if(!vm.perId.length > 0) {
                alert("請輸入身份證")
            } else {
                vm.step2 = false;
                vm.step3 = true;
            }
        },

        control_3: function() {
            var vm = this;
            vm.step3 = false;
            vm.step4 = true;
        },

        control_4: function() {
            var vm = this;
            vm.step4 = false;
            vm.step5 = true;
        },

    },
    created: function () {

    },
    mounted: function () {
        console.log("app mounted");
        var vm = this;


        //鍵盤血手印點擊效果
        var dFoo = $('#foo '); 
        var dDiv = dFoo.find(".btn"); //抓取#foo下的.btn
        for(i=0; i<dDiv.length; i++) {
            vm.btnAnimating.push(false);
        }
        $("#foo .btn").click(function(){
            var dMask = $(this).find(".div1");
            var index = $(this).index();
            if(!vm.btnAnimating[index]) {
                vm.btnAnimating[index] = true;
                dMask.fadeTo("slow",1,function(){
                    dMask.fadeTo("slow",0,function(){
                        vm.btnAnimating[index] = false;
                    });
                });
            };
        });

        //隨機碼產生
        function getCode(n) {
            var all = "azxcvbnmsdfghjklqwertyuiopZXCVBNMASDFGHJKLQWERTYUIOP0123456789";
            var b = "";
            for (var i = 0; i < n; i++) {
              var index = Math.floor(Math.random() * 62);
              b += all.charAt(index);
            }
            return b;
        };
        function loginCode() {
            $("#loginCode").html(getCode(4));
        };
        window.onload = loginCode;

        //kv動畫
        function initRipple() {
 
            //Settings - params for WaterRippleEffect
            var settings = {
                image: './images/rippie.png',//背景图片
                rippleRadius: 50,//radius of the ripple
                width: 350,//width
                height: 350,//height
                delay: 3,//if auto param === true. 1 === 1 second delay for animation
                auto: true//if auto param === true, animation starts on it´s own
            };
           
            //------------------------------------------------------------------------
            
            //standalone
            //初始化
            var waterRippleEffect = new WaterRippleEffect( document.getElementById( 'ripple' ), settings );
        
        }
        
        if($("#ripple").length > 0) {
            initRipple();
        };

        setTimeout(function(){
            vm.startAni();
        },300);

        $(".kv__more").click(function(){
            $("html,body").animate({
                scrollTop: $(".step").offset().top
            }, 1000);
        });

        if($("#sakura").length > 0) {
            vm.sakura();
        };

        vm.fixAni();
        vm.fixSakura();

    }
});



