var index_view = new Vue({
    el: "#app",
    data: {
        popNote: true,
        dataShow: true
    },
    watch: {
    },
    methods: {
        getAppstate: function() {
            var vm = this;
            vm.getToken().then(function() {
                vm.state_check();
            })
        },
        testapi: function() {
            var vm = this;
            vm.getToken().then(function() {
                vm.register().then(function(){
                    vm.top100();
                });
            })
        },
        indexAni: function() {
            var vm = this;
            var sec = 0.6;
            var tl = new TimelineMax({delay: 0.3});
            tl.from(".kvbd", sec, {
                opacity: 0,
            })
            tl.from(".kvft", sec, {
                opacity: 0,
            })
            tl.from(".kvbtn", sec, {
                opacity: 0,
            })
            // tl.to(".kvman", 0.1, {
            //     opacity: 0,
            // })
            // tl.to(".kvman", 0.1, {
            //     opacity: 1,
            // })
        }
    },
    mounted: function() {
        var vm = this;
        // vm.Logo = "./images/logo.png";
        vm.indexAni();
        // vm.getReg();
        // vm.getFb();
        // vm.getSp();
        // vm.testapi();
    }
})
