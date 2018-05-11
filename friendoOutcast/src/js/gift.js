const gift = new Vue({
    el: "#gift",
    data: {
        gift_data: {},
        url_id: findGetParameter("card_url"),
        phone: "",
        errorStyle: 4,
        errorMsg:"",
        success:false,
    },
    methods: {
        ga_click: ga_init,
        send_phone: function () {
            let vm = this;
            let phone_rule = /^09[0-9]{8}$/
            if (vm.phone == "" || !vm.phone.match(phone_rule)) {
                alert("請輸入手機正確格式");
                return false;
            }
            $.post({
                url: friendo_url + "UpdateGiftInfo",
                data: {
                    url_id: vm.url_id,
                    phone_num: vm.phone
                },
                dataType:'json',
                success: function (e) {
                    console.log(e);
                    if (e.result) {
                        vm.success = true
                        vm.ga_click('result', 'gift_領取兌換券成功', 'gift_領取兌換券成功');
                    }
                    else {
                        switch (e.errorCode) {
                            case 501:
                                vm.errorStyle = 1;
                                vm.ga_click('result', 'gift_兌換卷過期', 'gift_兌換卷過期');
                                break;
                            case 502:
                                vm.errorStyle = 2;
                                vm.ga_click('result', 'gift_兌換券已被領取', 'gift_兌換券已被領取');
                                break;
                            default:
                                console.log("result", e.errorMsg);
                                break;
                        }
                    }
                }
            })
        }
    },
    mounted: function () {
        let vm = this;
        $("body").loadpage('init', {
            async: true
        }).then((data) => { 
            $.post({
                url: friendo_url + "GetGiftInfo",
                data: {
                    url_id: vm.url_id
                },
                dataType: 'json',
                success: function (e) {
                    $("body").loadpage('close');
                    console.log(e);
                    if (e.result) {
                        vm.gift_data = e.data;
                        if (!vm.gift_data.expired){
                            if (typeof vm.gift_data.expire_date != 'undefined') {
                                vm.errorStyle = 0;
                            }
                            else {
                                vm.errorMsg = "查無此號碼!";
                                vm.ga_click('result', 'gift_兌換卷過期', 'gift_兌換卷過期');
                            }
                        }
                        else {
                            vm.errorStyle = 1;
                        }
                    }
                    else {
                        switch (e.errorCode) {
                            case 501:
                                vm.errorStyle = 1;
                                vm.ga_click('result', 'gift_兌換券已被領取', 'gift_兌換券已被領取');
                                break;
                            case 502:
                                vm.errorStyle = 2;
                                vm.errorMsg = "禮物已經被領取囉!";
                                vm.ga_click('result', 'gift_兌換券已被領取', 'gift_兌換券已被領取');
                                break;
                            default:
                                console.log("error", e.errorMsg);
                                break;
                        }
                    }
                }
            });
        })    
    }
})