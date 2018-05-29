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

$(document).ready(function(){
    console.log('document.ready');
});

var isMobile = md.phone() != null || md.tablet() != null || window.innerWidth <= 640;
var app = new Vue({
    el: '#app',
    data: {
        index: true,
        step1: false,
        step2: false,
        success: false,
        userName: "",
        selectedY: "",
        picked:"",
        selectedM: "",
        userPhone: "",
    },
    props: {
    },
    watch: {
    },
    computed: {
    },
    methods: {
        //=====step1=====//
        fu1: function() {
            var vm = this;
            vm.index = false;
            vm.step1 = true;
        },
        //=====step2=====//
        fu2: function() {
            var vm = this;
            vm.step1 = false;
            vm.step2 = true;
        },
        //=====表單驗證=====//
        submit: function() {
            var vm = this;
            vm.success = true;
            var re_phone = /^09[0123456789]{2}[0-9]{6}$/;
            var re_userId = /^[A-Z]{1}[1-2]{1}[0-9]{8}/;
            if(vm.userName == "" || vm.userName.trim().length == 0) {
                alert("請輸入名字");
            } else if(vm.userPhone == "" || vm.userPhone.trim().length == 0) {
                alert("請輸入電話");
            } else if(!re_phone.test(vm.userPhone)) {
                alert("輸入電話錯誤");
            } else {
                alert("資料成功送出");
            }
        },
    },
    created: function () {
    },
    mounted: function () {
        console.log("app mounted");
        var vm = this;
        if(!isMobile) {
            $(".kv__more").click(function() {
                $("html,body").animate({ scrollTop: 1050 }, 1000);
            });
            setTimeout(function(){
                vm.startAni();
            },300);
        } else {

        }
        
    }
});

