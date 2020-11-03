var award_view = new Vue({
    el: "#app",
    data: {
        hasBig: false,
        hasWeek: false,
        awardlist: {},
    },
    methods: {
        showAward() {
            var vm = this;
            vm.getToken().then(function(){
                vm.getAward().then(function(res){
                    if(res.success) {
                        vm.awardlist = res.data;
                        if(res.data.hasBig) {
                            vm.hasBig = true
                        }
                        if(res.data.hasWeek) {
                            vm.hasWeek = true
                        }
                    } else {
                        console.log("nodata")
                    }
                })
            })
        },

        getAward() {
            var vm = this;
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}Comebest2020CNY/award/76`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                method: "GET",
                // dataType: "json",
            }).done(function(res){
                console.log("getaward",res);
            })
        },

        weekShow: function(week) {
            var vm = this;
            if(!vm.hasWeek) {
                alert("尚未開獎");
                return
            } else {
                for(var i=0; i<vm.awardlist.weekAward.length; i++) {
                    if(vm.awardlist.weekAward[week-1] == "" || vm.awardlist.weekAward[week-1] == undefined) {
                        alert("尚未開獎");
                        // console.log(vm.awardlist.weekAward[week-1]);
                        return
                    }
                }
                vm.popup = true;
                vm.poPage = "weekaward";
                vm.popweek = week;
                vm.scrollto = $(window).scrollTop();
                // alert(vm.scrollto);
                // console.log($(window).scrollTop())
                // $("body").addClass("_freeze");
            }
        }
    },
    created: function() {
        var vm = this;
        vm.showAward();
    },
    mounted: function() {
        var vm = this;
        $("body").loadpage("init",{async : false});
        vm.indexlink();
    }
})
