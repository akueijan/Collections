
const success_view = new Vue({
    el: "#app",
    data: {
        images: [
            "/Campaign/FunTaiwan/images/ending-pic-1.png",
        ],
        randomImage:"",
    },
    computed: {

    },
    methods: {
        Random2: function() {
            let vm = this;
            const idx = Math.floor(Math.random() * vm.images.length);
            vm.randomImage = vm.images[idx];
        },
        lineShare: function () {
            var img = "/Campaign/FunTaiwan/images/ending-linebtn.png",// line 按鈕圖示
                title = '我成為NISSAN玩咖了！\n趕快跟隨我的腳步加入NISSAN玩咖，一起探索台灣吧！',//document.title,
                url = location.origin +"/Campaign/FunTaiwan/registry.html",//分享目前頁
            href, html;
        
            // 行動裝置語法
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                href = "http://line.naver.jp/R/msg/text/?" + title + "%0D%0A" + url;
            } else {
            // 網頁版語法
                // href = "https://lineit.line.me/share/ui?url=" + encodeURIComponent(url);
                href = "http://line.naver.jp/R/msg/text/?" + title + "%0D%0A" + url;
            }
            html = "<a href='" + href + "' target='_blank'><img src='" + img + "'/></a>";
            var x = $(".line");
            x.html(html);
        },
    },
    mounted: function() {
        let vm = this;
        vm.logger(3,"start endingPage","EndingPage");
        
    },
    created: function() {
        let vm = this;

        vm.lineShare();
        vm.Random2();
    }
});

//LINE分享
//<![CDATA[
    // (function() {
    //     var img = "http://via.placeholder.com/350x150",// line 按鈕圖示
    //     title = '我成為NISSAN玩咖了.......',//document.title,
    //     url = friendo_url+"/CarMember/Index?state=P486ZGhmO4KqAJDrrzsinQ==",//分享目前頁
    //     href, html;
    
    //     // 行動裝置語法
    //     if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    //         href = "http://line.naver.jp/R/msg/text/?" + title + "%0D%0A" + url;
    //     } else {
    //     // 網頁版語法
    //         href = "https://lineit.line.me/share/ui?url=" + encodeURIComponent(url);
    //     }
    //     html = "<a href='" + href + "' target='_blank'><img src='" + img + "'/></a>";
    //     var x = $(".line");
    //     x.html(html);
    // })();
//]]>