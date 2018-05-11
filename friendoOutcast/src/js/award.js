const award = new Vue({
    el:"#award",
    data:{
        award_date: true,
        award_list: true,
        data_list: [
            [
                {
                name: "陳育聖",
                phone: "0983516385",
                }
            ], [
                {
                    name: "陳雅芬",
                    phone: "0989338881",
                },
                {
                    name: "鄭珮汝",
                    phone: "0912432642",
                },
                {
                    name: "林于筑",
                    phone: "0963099116",
                },
                {
                    name: "陳佩汶",
                    phone: "0978251857",
                },
                {
                    name: "王振偉",
                    phone: "0973237056",
                },
                {
                    name: "吳靜雯",
                    phone: "0930771573",
                },
                {
                    name: "賴力嘉",
                    phone: "0908871482",
                },
                {
                    name: "芮",
                    phone: "0931552727",
                },
                {
                    name: "高育騏",
                    phone: "0910901539",
                },
                {
                    name: "林恩宇",
                    phone: "0912233717",
                },
            ], [
                {
                    name: "林曉雨",
                    phone: "0921930391",
                },
                {
                    name: "李育儒",
                    phone: "0928813688",
                },
                {
                    name: "林麗玲",
                    phone: "0985525288",
                },
                {
                    name: "彭佳萬",
                    phone: "0970882871",
                },
                {
                    name: "楊弘謙",
                    phone: "0989334473",
                },
                {
                    name: "劉麗香",
                    phone: "0903486616",
                },
                {
                    name: "洪學斌",
                    phone: "0988530176",
                },
                {
                    name: "李思賢",
                    phone: "0976635550",
                },
                {
                    name: "歐鴻正",
                    phone: "0922726142",
                },
                {
                    name: "郭姵辰",
                    phone: "0900103404",
                },
            ]
        ]

    },
    methods: {
        ga_click: ga_init,
    },
    mounted: function () {
        let vm = this;
        $("body").loadpage();
    }
})