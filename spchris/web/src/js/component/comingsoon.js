Vue.component('comingsoon', {
    template: "#comingsoon",
    data: function () {
        return {
            open: true,
            date: {
                total: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            },
            total: 0
        }
    },
    computed: {
        openCome: function () {
            let testing = sessionStorage.getItem('mode') === 'testing';
            return (this.total > 0 && !testing);
        }
    },
    methods: {
        padLeft(str, len) {
            var vm = this;
            str = '' + str;
            if (str.length >= len) {
                return str;
            } else {
                return vm.padLeft("0" + str, len);
            }
        },
        countIssue() {
            var vm = this;
            vm.total = Date.parse(new Date(vm.projApi.info.startDate)) - Date.parse(new Date());
            if (this.openCome) {
                var timeinterval = setInterval(function () {
                    vm.total = Date.parse(new Date(vm.projApi.info.startDate)) - Date.parse(new Date());
                    var seconds = Math.floor((vm.total / 1000) % 60);
                    var minutes = Math.floor((vm.total / 1000 / 60) % 60);
                    var hours = Math.floor((vm.total / (1000 * 60 * 60)) % 24);
                    var days = Math.floor(vm.total / (1000 * 60 * 60 * 24));
                    vm.date = {
                        'total': vm.total,
                        'days': vm.padLeft(days, 2),
                        'hours': vm.padLeft(hours, 2),
                        'minutes': vm.padLeft(minutes, 2),
                        'seconds': vm.padLeft(seconds, 2)
                    };
                    if (vm.date.total <= 0) {
                        clearInterval(timeinterval);
                    }
                }, 1000);
            }
        }
    },
    mounted: function () {
        var vm = this;
        this.projApi.token().then(() => {
            vm.countIssue();
        }).catch((error)=>{
            vm.countIssue();
        })
    },
})
