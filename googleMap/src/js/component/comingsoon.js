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
            return (this.envMode != "Testing" && this.total > 0);
        }
    },
    mounted: function () {
        var padLeft = function (str, len) {
            str = '' + str;
            if (str.length >= len) {
                return str;
            } else {
                return padLeft("0" + str, len);
            }
        };
        var vm = this;
        vm.getToken().then(function (res) {
            vm.total = Date.parse(new Date(vm.startDate)) - Date.parse(new Date());
            if (vm.envMode != "Testing" || vm.total <= 0) {
                var timeinterval = setInterval(function () {
                    vm.total = Date.parse(new Date(vm.startDate)) - Date.parse(new Date());
                    var seconds = Math.floor((vm.total / 1000) % 60);
                    var minutes = Math.floor((vm.total / 1000 / 60) % 60);
                    var hours = Math.floor((vm.total / (1000 * 60 * 60)) % 24);
                    var days = Math.floor(vm.total / (1000 * 60 * 60 * 24));
                    vm.date = {
                        'total': vm.total,
                        'days': padLeft(days, 2),
                        'hours': padLeft(hours, 2),
                        'minutes': padLeft(minutes, 2),
                        'seconds': padLeft(seconds, 2)
                    };
                    if (vm.date.total <= 0) {
                        clearInterval(timeinterval);
                    }
                }, 1000);
            }
        });
    },
})
