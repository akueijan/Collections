const invoice_view = new Vue({
    el: "#invoice",
    data: {
        username: "",
        phone: "",
        inv_date: "",
        inv_num: "",
        random_number: "",
        check: "",
        loading: false,
        success: false,
        demo: false,
        first: true,
        startTimeout:false,
        slider_inx: {
            section1: 0,
            section2: 0
        }
    },
    watch: {
        demo: function (val) {
            $('body').toggleClass('_freeze');
        }
    },
    computed: {
        nowdate: function () {
            let today = new Date();
            let m = today.getMonth() + 1;
            let y = today.getFullYear();
            y = y - 1911;
            return (y * 100) + m + 1;
        },
        device_type: function () {
            let type = 0;
            switch (deviceCheck()) {
                case "andorid":
                    type = 2
                    break;
                case "ios":
                    type = 1;
                    break;
            }
            return type;
        }
    },
    methods: {
        ga_click: ga_init,
        post_inv: function () {
            let vm = this;
            let error = false;
            if (!vm.loading && !vm.startTimeout) {
                vm.loading = true;
                let error_msg = "";
                let phone_rule = /^09[0-9]{8}$/
                let inv_rule = /^[a-zA-Z]{2}[0-9]{8}$/
                if ($("#g-recaptcha-response").val() == "") {
                    alert("請勾選我不是機器人");
                    error = true;
                    vm.loading = false;
                }
                if (vm.username == "") {
                    alert("請輸入使用者名稱");
                    error = true;
                    vm.loading = false;
                }
                if (vm.phone == "" || !vm.phone.match(phone_rule)) {
                    alert("請輸入手機正確格式");
                    error = true;
                    vm.loading = false;
                }
                if (vm.inv_date == "") {
                    alert("請選擇發票期別");
                    error = true;
                    vm.loading = false;
                }
                if (vm.inv_num == "" || !vm.inv_num.match(inv_rule)) {
                    alert("請輸入發票正確格式");
                    error = true;
                    vm.loading = false;
                }
                if (vm.random_number == "") {
                    alert("請輸入發票隨機碼");
                    error = true;
                    vm.loading = false;
                }
                if (vm.check != 1) {
                    alert("請勾選同意說明");
                    error = true;
                    vm.loading = false;
                }
                if (!error) {
                    $.post({
                        url: friendo_url + "SaveInvoiceEx",
                        data: {
                            "cell_no": vm.phone,
                            "user_name": vm.username,
                            "email": "",
                            "inv_num": vm.inv_num,
                            "inv_date": vm.inv_date,
                            "random_number": vm.random_number,
                            "captcha": $("#g-recaptcha-response").val()
                        },
                        success: function (e) {
                            vm.loading = false;
                            grecaptcha.reset();
                            if (!e.result) {
                                alert(e.errorMsg);
                                vm.ga_click("result", "invoice_登錄失敗", "invoice_登錄失敗");
                            } else {
                                let data = e.data;
                                if (data.inv_type == 1 || data.inv_type == 4) {
                                    $("html").scrollTop(0);
                                    vm.success = true;
                                    FB.init({
                                        appId: '1768128233496858',
                                        autoLogAppEvents: true,
                                        xfbml: true,
                                        version: 'v2.11'
                                    });
                                    vm.ga_click("result", "invoice_登錄成功", "invoice_登錄成功");
                                } else {
                                    vm.ga_click("result", "invoice_登錄失敗", "invoice_登錄失敗");
                                }
                            }
                        },
                        dataType: "json"
                    });
                }
            }
        },
        sliderOneChange(index) {
            this.slider_inx.section1 = index;
        },
        sliderTwoChange(index) {
            this.slider_inx.section2 = index;
        }
    },
    components: {
        'carousel-3d': Carousel3d.Carousel3d,
        'slide': Carousel3d.Slide
    },
    mounted: function () {
        let vm = this;
        vm.success = false;
        if (findGetParameter("first")) {
            vm.first = false;
        }
        if ((Date.parse("2018/04/01")).valueOf() < new Date()) {
            vm.startTimeout = true;
            alert("活動已於3/31結束囉!");
            location = friendo_url;
        }
        $("body").loadpage();
    }
})