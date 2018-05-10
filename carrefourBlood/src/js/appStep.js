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
                toggleMenu()
            });

            dAllLink.click(function() {
                dObj.toggleClass('nav--active');
                toggleMenu()
            });
        }
        function toggleMenu() {
            $('html,body').toggleClass('_freeze');
            $('.l-main').toggleClass('l-main--active');
        }
        // initialize every element
        this.each(function() {
            init($(this));
        });
        return this;
    };
    // start
    $(function() {
        $("#nav").menu();
    });
})(jQuery);

window.Vue.use(window.VueGrecaptcha, {
    sitekey: '6LdmQj4UAAAAAM3ParcNWkA0QuQDoZ__sUGk2jvE',
});

var fbhtml_url="http://www.yahoo.com.tw"; //fb分享的網址

//LINE分享
//<![CDATA[
(function() {
    var img = "../images/sharebtn-line.png",// line 按鈕圖示
    title = document.title,
    url = "http://yahoo.com.tw", //LINE分享的網址
    // url = "http://" + location.hostname + location.pathname,//分享目前頁
    href, html;

    // 行動裝置語法
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    href = "http://line.naver.jp/R/msg/text/?" + title + "%0D%0A" + url;
    } else {
    // 網頁版語法
    href = "https://lineit.line.me/share/ui?url=" + encodeURIComponent(url);
    }
    html = "<a href='" + href + "' target='_blank'><img src='" + img + "'/></a>";
    var x = $(".line");
    x.html(html);
})();
//]]>


var app = new Vue({
    el: '#app',
    data: {
        step : {
            telNum: true,
            personId: true,
            successPage: true,
            itemShare: true,
            falsePage: true,
        },
        popup: false,
        captchaResponse:"",
        numStr:"",
        days:"10265",
        btnAnimating: [],
        profile: {
            perId:"",
            uName:"",
            uCity:"",
            uArea:"",
            uAdr:"",
            uTel:"",
            uMobile:"",
            uEmail:"",
        },
        utel_checked: false,
        uid_checked: false,
        checkbox_checked: false,
    },
    props: {
    },
    watch: {
    },
    computed: {
    },
    methods: {
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

        fbShare: function() {
            window.open('http://www.facebook.com/sharer/sharer.php?u='+fbhtml_url);
        },

        resetRecaptcha() {
            this.$refs.recaptcha.reset(); // Direct call reset method
        },

        telNum_sumit: function() {
            var vm = this;
            if(!vm.numStr.length > 0) {
                alert("請輸入電話號碼");
            } else {
                vm.step.telNum = false;
                vm.step.personId = true;
            }
        },
        
        personId_sumit: function() {
            var vm = this;
            if(!vm.perId.length > 0) {
                alert("請輸入身份證")
            } else {
                vm.step.personId = false;
                vm.step.successPage = true;
            }
        },

        successPage_sumit: function() {
            var vm = this;
            vm.popup = true;
        },

        popupOpen: function() {
            var vm = this;
            vm.popup = true;
        },

        popupGo: function() {
            var vm = this;
            vm.step.successPage = false;
            vm.step.itemShare = true;
            vm.popup = false;
        },

        popupClose: function() {
            var vm = this;
            vm.popup = false;
        },

        itemShare_sumit: function() {
            var vm = this;
            vm.step.itemShare = false;
            vm.step.falsePage = true;
        },

        falsePage_sumit: function() {
            var vm = this;
            vm.resetRecaptcha();
            location.reload();
        },

    },
    created: function () {

    },
    mounted: function () {
        console.log("app mounted");
        var vm = this;


        //鍵盤血手印點擊效果
        var dFoo = $('#keyboard '); 
        var dDiv = dFoo.find(".steptel__opt--1"); //抓取#foo下的.btn
        var dDiv_2 = dFoo.find(".steptel__opt--2");
        var dDiv_3 = dFoo.find(".steptel__opt--3");
        for(var i=0; i<dDiv.length; i++) {
            vm.btnAnimating.push(false);
        }
        for(var i=0; i<dDiv_2.length; i++) {
            vm.btnAnimating.push(false);
        }
        for(var i=0; i<dDiv_3.length; i++) {
            vm.btnAnimating.push(false);
        }
        $("#keyboard .steptel__opt--1").click(function(){
            var dMask = $(this).find(".mask");
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
        $("#keyboard .steptel__opt--2").click(function(){
            var dMask = $(this).find(".mask--2");
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
        $("#keyboard .steptel__opt--3").click(function(){
            var dMask = $(this).find(".mask--3");
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
    }
});



