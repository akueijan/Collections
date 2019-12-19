var award_view = new Vue({
    el: "#app",
    data: {
        listblock: true,
        bigdata: false,
        weekdata: false,
        monthdata: false,
        awardData: {
            award50: {},
            award10: {},
            toffy: {},
        },
    },
    methods: {
        showAward: function() {
            var vm = this;
            vm.getToken().then(function(){
                vm.getaward().then(function(res){
                    // console.log('award',res);
                    if(res.success) {
                        vm.awardData = res.data.awardData;
                        if(res.data.awardData.bigaward) {
                            // vm.awardlist = res.data.awardlist;
                            vm.bigdata = true;
                        }
                        if(res.data.awardData.monthaward) {
                            // vm.awardlist.awardweek = res.data.awardlist.awardweek;
                            vm.monthdata = true;
                        }
                        if(res.data.awardData.weekaward) {
                            // vm.awardlist.awardweek = res.data.awardlist.awardweek;
                            vm.weekdata = true;
                        }
                    } else {
                        console.log("nodata");
                    }
                });
            })
        },
        WawardOpen: function(name) {
            var vm = this;
            if(!vm.weekdata) {
                alert("敬請期待");
            } else {
                vm.popup = true;
                vm.popPage = "awardPop";
                vm.awardList = name;
                vm.popupOpen();
            }
        },
        MawardOpen: function(name) {
            var vm = this;
            if(!vm.monthdata) {
                alert("敬請期待");
            } else {
                vm.popup = true;
                vm.popPage = "awardPop";
                vm.awardList = name;
                vm.popupOpen();
            }
        },
        awardApi: function() {
            var vm = this;
            var xmlhttp = new XMLHttpRequest();
            var url = "./static/award.json";
            
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var myArr = JSON.parse(this.responseText);
                    console.log(myArr.data);
                    vm.bigdata = myArr.data.awardData.bigaward;
                    vm.monthdata = myArr.data.awardData.monthaward;
                    vm.weekdata = myArr.data.awardData.weekaward;
                    vm.awardData = myArr.data.awardData;
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
    },
    created: function() {
        var vm = this;
        vm.awardApi();
    },
    mounted: function() {
        var vm = this;
        // vm.showAward();
        $(".nav_events").click(function(){
            location.href = "./index.html#events"
        })
    }
});