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

var lists = [
    { "text": "請選擇也可以為model設定value>selected", "value": ""}
];

for (var i = 0; i <3; i++) {
    lists.push(
        { 
            "text": (i).toString(), 
            "value": (i).toString() 
        }
    )
}

Vue.mixin({
    data: function () {
        return {
            initText: 'hello world! Vue Start'
        }
    },
    mounted: function () {
        
    }
});

var app = new Vue({
    el: '#el',
    data: {
        selectOpt:"",
        selectLists: lists,
        area:"",
        city:"",
        aqi:"",
        status:"",
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
    },
    created: function () {
    },
    mounted: function () {
        let vm = this;
        let dataslist = $("#datas");
        $.ajax({
            type: "GET",
            url: "/json/apitest.json",
            datatype: "json",
            success: function(datas) {
                console.log(datas);
                $.each(datas, function(i, data) {
                    dataslist.append("<li>地區: "+data.SiteName+"　"+"AQI: "+data.AQI+"　"+"危險等級: "+data.Status+"　"+data.PublishTime+"</li>");
                });
            },
            error: function() {
                alert("datas error");
            }
        });
    },
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
