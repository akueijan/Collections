var index_view = new Vue({
    el: "#app",
    data: {
    },
    methods: {
    },
    mounted: function() {
        var vm = this
        // vm.kvAni()
        let cgame = new canGame()
        cgame.init()
        // cgame.control()
    }
})