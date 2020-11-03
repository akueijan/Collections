var invoice_view = new Vue({
    el: "#app",
    data: {
        inv_date: "",
        inv_num: "",
        inv_random: "",
        mobile: "",
        agree: false,
        reCaptcha: ""
    },
    methods: {
        invoiceSave: function() {
            var vm = this;
            var post_data = {
                "cell": vm.mobile,
                "inv_num": vm.inv_num.toUpperCase(),
                "random_number": vm.inv_random,
                "inv_date": vm.inv_date,
                "actToken" : "gnFsAs+qRjD3jnB6Z0HIEw==",
                "captcha": vm.reCaptcha
            }
            return $.ajax({
                // url: "https://developapi.azurewebsites.net/api/invoice/savedata",
                url: `${friendo_url}invoice/savedata`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json"
            }).done(function(res){
                // console.log("invores:",res);
            });
        },
        saveInvo() {
            var vm = this;
            if(!vm.loading) {
                vm.popup = true;
                vm.loading = true;
                var mobile_rule = /^09[0-9]{8}$/;
                var inv_rule = /^[a-zA-Z]{2}[0-9]{8}$/;
                var random_rule = /^[0-9]{4}$/;
                if(vm.inv_date == "") {
                    alert("請選擇發票期別");
                    vm.loading = false;
                    vm.popup = false;
                    return
                }
                if(vm.inv_num =="" || !vm.inv_num.match(inv_rule)) {
                    alert("請輸入發票正確格式");
                    vm.loading = false;
                    vm.popup = false;
                    return
                }
                if(vm.inv_random =="" || !vm.inv_random.match(random_rule)) {
                    alert("請輸入隨機碼正確格式");
                    vm.loading = false;
                    vm.popup = false;
                    return
                }
                if(vm.mobile =="" || !vm.mobile.match(mobile_rule)) {
                    alert("請輸入手機正確格式");
                    vm.loading = false;
                    vm.popup = false;
                    return
                }
                if(!vm.agree) {
                    alert("請勾選我已詳閱");
                    vm.loading = false;
                    vm.popup = false;
                    return
                }
                vm.getToken().then(function(){
                    vm.grecaptcha("invoice").then(function() {
                        vm.invoiceSave().then(function(res){
                            if(!res.success) {
                                alert(res.responseMessage);
                                vm.loading = false;
                                vm.popup = false;
                            } else {
                                // alert(res.responseMessage);
                                vm.popup = true;
                                vm.poPage = "invosuc";
                                vm.loading = false;
                            }
                        });
                    })
                })
            }
        },
        invAgain() {
            var vm = this;
            vm.popup = false;
            vm.poPage = "";
            vm.inv_date = "";
            vm.inv_num = "";
            vm.inv_random = "";
            // $('body').addClass('_freeze');
            // vm.mobile = "";
            // vm.agare = false;
        },
        sampleOpen() {
            var vm = this;
            vm.popup = true;
            vm.poPage = "sample";
            // $('body').addClass('_freeze');
        }
    },
    mounted: function() {
        var vm = this;
        $("body").loadpage("init",{async : false});
        vm.indexlink();

        alert("活動已結束 感謝您的參與");
        window.location.href = "./index.html";
    }
})
