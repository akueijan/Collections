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

Vue.mixin({
    data: function () {
        return {
            initText: 'hello world! Vue Start'
        }
    },
    mounted: function () {
        console.log("init mixins");
    }
});

var app = new Vue({
    el: '#el',
    data: {
        numStr:"",
        numStr2:"",
        selAZ:"",
        userDesc:"",
        userCa:"",
        selectOpt:"",
        selectLists: lists,
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
            vm.numStr += val; // vm.numStr為data裡的numStr變數
            // console.log(vm.numStr);
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
    },
    created: function () {
    },
    mounted: function () {
        console.log("app mounted");
        $(".btn").click(function(){
            // $(this).addClass("active");
            // $(this).toggleClass("active");
            $(".div1").fadeTo("slow",1);
            $(".div1").fadeTo("slow",0);
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
    }
});


var abc = () => { };
var abc = (b) => b;

const double = [1, 2, 3].map((num) => num * 2);
console.log(double); // [2,4,6]

var bob = {
    _name: "Bob",
    _friends: ["Sally", "Tom"],
    printFriends() {
        this._friends.forEach(f =>
            console.log(this._name + " knows " + f));
    }
};
console.log("2222" + bob.printFriends());
