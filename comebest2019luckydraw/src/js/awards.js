var awards = new Vue({
    el: "#app",
    data: {
        awardList: {
            firstAward: [],
            planeAward: [],
            cashAward: [],
            movieAward: [],
            creamAward: [],
            bookAward: [],
        },
        awardName: ['台北-沖繩 來回機票一張', '現金 NT$888元', '雙人威秀電影票', 'Haagen-Dazs 105元冰品購物金', '誠品生活 50元即享券'],
        awardTitle: '',
    },
    methods: {
        GetAwards: function () {
            var vm = this;
            return $.ajax({
                url: apiUrl + "/awardList",
                method: "GET",
                error: function (e) {
                    alert("系統忙碌中，請稍後再試!");
                },
                dataType: "json"
            });
        },
        awardPop: function (obj,num) {
            var vm = this;
            console.log(obj);
            if (obj) {
                vm.awardPopList = obj.list;
                vm.popup = true;
                vm.popuppage = "awardlist";
                vm.awardTitle = vm.awardName[num-1];
                vm.popupOpen();
            }
        }
    },
    mounted: function () {
        var vm = this;
        vm.cloud_Ani();
        $(".fixedbtn").addClass("fixedbtn-active")
        $('div.l-bling,div.r-bling').scrollingParallax({
            staticSpeed : 0.2,
            loopIt : true,
            staticScrollLimit : false,
            bgHeight: '220%',
            disableIE6 : true
        });
        // vm.GetAwards().then(function (res) {
        //     // console.log(res);
        //     if (res.errorCode === 2000) { 
        //         vm.awardList = res.data.awardList;
        //     }
        // })
        $.getJSON("./static/list.json", function (data) {
            vm.awardList = data.awardList;
        });
    }
});