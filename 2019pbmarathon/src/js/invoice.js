var invoice_view = new Vue({
    el: "#app",
    data: {
        inv_date: "",
        inv_num: "",
        inv_random: "",
        mobile: "",
        agree: false,
        loading: false,
        start_date: "",
        mode_status: "",
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
                vm.InvoiceToken().then(function(){
                    vm.grecaptcha("invoice").then(function() {
                        vm.invoiceSave().then(function(res){
                            if(!res.success) {
                                alert(res.responseMessage);
                                vm.loading = false;
                            } else {
                                // alert(res.responseMessage);
                                vm.popup = true;
                                vm.popPage = "invSuccess";
                                vm.loading = false;
                            }
                        });
                    })
                })
            }
        },
        sampleOpen() {
            var vm = this;
            vm.popup = true;
            vm.popPage = "sample";
            $('body').addClass('_freeze');
        },
        again() {
            var vm = this;
            vm.inv_date = "";
            vm.inv_num = "";
            vm.inv_random = "";
            vm.mobile = "";
            vm.agree = false;
            vm.loading = false;
            vm.popup = false;
        },
    },
    mounted: function () {
        var vm = this;
        if(new Date() > new Date("2019/11/21 00:00:00")) {
            alert("活動已結束 感謝您的參與");
            window.location = "./index.html";
        };
        $("body").loadpage("init",{async : false});
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