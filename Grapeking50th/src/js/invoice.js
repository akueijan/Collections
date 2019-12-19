var invoive_view = new Vue({
    el: "#app",
    data: {
        step: "invoice",
        inv_date: "",
        inv_num: "",
        inv_random: "",
        mobile: "",
        agree: false,
        // loading: false,
    },
    methods: {
        saveInvo() {
            var vm = this;
            if(!vm.loading) {
                vm.loading = true;
                var mobile_rule = /^09[0-9]{8}$/;
                var inv_rule = /^[a-zA-Z]{2}[0-9]{8}$/;
                var random_rule = /^[0-9]{4}$/;
                if(vm.inv_date == "") {
                    alert("請選擇發票期別");
                    vm.loading = false;
                    return
                }
                if(vm.inv_num =="" || !vm.inv_num.match(inv_rule)) {
                    alert("請輸入發票正確格式");
                    vm.loading = false;
                    return
                }
                if(vm.inv_random =="" || !vm.inv_random.match(random_rule)) {
                    alert("請輸入隨機碼正確格式");
                    vm.loading = false;
                    return
                }
                if(vm.mobile =="" || !vm.mobile.match(mobile_rule)) {
                    alert("請輸入手機正確格式");
                    vm.loading = false;
                    return
                }
                if(!vm.agree) {
                    alert("請勾選我已詳閱");
                    vm.loading = false;
                    return
                }
                vm.getToken().then(function(){
                    vm.grecaptcha("invoice").then(function() {
                        vm.invoiceSave().then(function(res){
                            if(!res.success) {
                                alert(res.responseMessage);
                                vm.loading = false;
                            } else {
                                // alert(res.responseMessage);
                                // vm.popup = true;
                                vm.step = "invSuccess";
                                vm.loading = false;
                            }
                        });
                    })
                })
            }
        },
        invAgain() {
            var vm = this;
            vm.step = "invoice";
            vm.inv_date = "";
            vm.inv_num = "";
            vm.inv_random = "";
            // vm.mobile = "";
            // vm.agare = false;
        },
        sampleOpen() {
            var vm = this;
            vm.popup = true;
            vm.popPage = "sample"
        }
    },
    mounted: function() {
        var vm = this;
        $(".nav_events").click(function(){
            location.href = "./index.html#events"
        })
    }
})