var award_view = new Vue({
    el: "#app",
    data: {
        bigaward: false,
        weekdata: false,
        awardlist: {},
        start_date: "",
        mode_status: "",
    },
    methods: {
        showAward: function() {
            var vm = this;
            vm.GameToken().then(function(){
                vm.getaward().then(function(res){
                    // console.log('award',res);
                    if(res.success) {
                        vm.awardlist = res.data.awardlist;
                        // vm.bigaward = true;
                        if(res.data.awardlist.bigaward) {
                            // vm.awardlist = res.data.awardlist;
                            vm.bigaward = true;
                        }
                        if(res.data.awardlist.weekaward) {
                            // vm.awardlist.awardweek = res.data.awardlist.awardweek;
                            // vm.awardlist = res.data.awardlist;
                            vm.weekdata = true;
                        }
                    } else {
                        console.log("nodata")
                    }
                });
            })
        },
        awardApi: function() {
            var vm = this;
            var xmlhttp = new XMLHttpRequest();
            var url = "./static/award.json";
            
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var myArr = JSON.parse(this.responseText);
                    console.log(myArr);
                    vm.awardlist = myArr.data.awardlist;
                    vm.bigaward = myArr.data.awardlist.bigaward;
                    vm.weekdata = myArr.data.awardlist.weekaward;
                }
            };
            xmlhttp.open("GET", url, false); // ture不會等 資料傳回來, false 等資料傳回來 才會讓資料繼續下去
            xmlhttp.send();
        },
        energyShow: function(week) {
            var vm = this;
            if(!vm.weekdata) {
                alert("尚未開獎");
                return
            } else {
                for(var i=0; i<vm.awardlist.awardweek.length; i++) {
                    if(vm.awardlist.awardweek[week-1] == "" || vm.awardlist.awardweek[week-1] == undefined) {
                        alert("尚未開獎");
                        return
                    }
                }
                vm.popup = true;
                vm.popPage = "weekaward";
                vm.popweek = week;
                vm.scrollto = $(window).scrollTop();
                // alert(vm.scrollto);
                // console.log($(window).scrollTop())
                $("body").addClass("_freeze");
            }
        }
    },
    mounted: function() {
        var vm = this;
        $("body").loadpage("init",{async : false});
        vm.awardApi();
        vm.navOpen();
        $(".nav .leaderboard").click(function(){
            window.location.href = "./index.html#leaderboard";
        });
        $(".nav .product").click(function(){
            window.location.href = "./index.html#product";
        });
        $(".nav .event").click(function () {
            window.location.href = "./index.html#readme";
        });
    }
})