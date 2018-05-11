const gift = new Vue({
    el: "#opencard",
    data: {
        card_data: {
            card: {
                url: "",
                name: ""
            }
        },
        url_id: findGetParameter("card_url")
    },
    methods: {
        ga_click: ga_init,
        share_link: function () { 
            var img = "/Content/carrefour_family/images/sharebtn-line.png",// line 按鈕圖示
                title = '不能只有我拿到！現在來家樂福滴血認親"完成會員認證"，免費拿娘家好禮，完成再抽會員點數一千萬點！';//document.title,
            url = "https://goo.gl/sNbJrY";

            // 行動裝置語法
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                href = "http://line.naver.jp/R/msg/text/?" + title + "%0D%0A" + url;
            } else {
                // 網頁版語法
                href = "https://lineit.line.me/share/ui?url=" + encodeURIComponent(url);
            }
            html = "<a href='" + href + "' target='_blank'><img src='" + img + "'/></a>";
            var x = $(".line");
            x.html(html);
        }
    },
    mounted: function () {
        let vm = this;
        $("body").loadpage('init',{
            async: true
        }).then((data) => { 
            $.post({
                url: friendo_url+"GetCard",
                data: {
                    url_id: vm.url_id
                },
                dataType: "json",
                success: function (e) {
                    if (e.result) {
                        vm.card_data = e.data;
                        vm.card_data.card = card_images[(e.data.style + 1)];
                        vm.ga_click("reuslt", "opencard_開啟卡片成功","opencard_開啟卡片成功");
                    }
                    else {
                        console.log("error", e.errorMsg);
                        vm.ga_click("reuslt", "opencard_開啟卡片失敗", "opencard_開啟卡片失敗");
                    }
                    $("body").loadpage('close');
                }
             });
        })
    }
})