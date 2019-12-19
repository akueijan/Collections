var index_view = new Vue({
    el: "#app",
    data: {
        loading: false,
        // score: 0,
        // popup: "",
        invoToken: "",
        fbData: {
            fbId: "",
            fbName: "",
            fbPic: "",
        },
        top100Arr: [],
        note: true,
        start_date: "",
        mode_status: "",
    },
    methods: {
        deltest() {
            var vm = this;
            vm.GameToken().then(function(){
                vm.deletetest();
            });
        },
        sPhone() {
            var vm = this;
            vm.GameToken().then(function(){
                vm.savephone();
            });
        },
        getTop100() {
            var vm = this;
            // vm.top100();
            vm.GameToken().then(function(){
                vm.top100();
            });
        },
        gamecheck() {
            var vm = this;
            vm.GameToken().then(function(){
                vm.getstatus();
            });
        },
        kv_Ani() {
            var vm = this;
            var sec = 0.3;
            var tl = new TimelineMax({delay: 1.2});
            tl.from(".kvman", sec, {
                opacity: 0,
                x: -300,
                y: 100,
            })
            // tl.to(".kvman", 0.1, {
            //     opacity: 0,
            // })
            // tl.to(".kvman", 0.1, {
            //     opacity: 1,
            // })
            tl.from(".kvmandeco", sec, {
                opacity: 0,
            })
            tl.from(".kvslogn", sec, {
                opacity: 0,
                x: 150,
            })
            tl.from(".kvtxt", sec, {
                opacity: 0,
                x: 150,
            }, "-=0.2")
            tl.from(".kvprods", sec, {
                opacity: 0,
            })
            tl.from(".kvbtns", sec, {
                opacity: 0,
            },"-=0.3")
        },
        noteOpen() {
            var vm = this;
            if(isMobile) {
                if(vm.note) {
                    vm.note = false
                } else {
                    vm.note = true
                }
            }
        },
    },
    mounted: function () {
        var vm = this;
        $("body").loadpage("init",{async : false});
        setTimeout(function(){
            vm.getIe();
        },1000);
        if(isMobile) {
            vm.note = false;
        };
        // alert("活動已結束 感謝您的參與！");
        vm.navOpen();
        // vm.getTop100();
        vm.kv_Ani();  
        if(new Date() > new Date("2019/09/25 10:00:00")) {
            // vm.getTop100();
            vm.top100Api();
        }
    }
})
