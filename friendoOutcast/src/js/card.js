"use strict";
var card_view = new Vue({
    el: "#card",
    data: {
        products: {},
        first_pords: {},
        more_prods: {},
        share_obj: {
            prod_id: "",
            prod_img: "",
            pord_text: ["", ""],
            share_id: ""
        },
        popup: !1,
        step: 0,
        card_no: 0,
        image_obj: card_images,
        showcard: !1,
        member_id: "",
        url_id: "",
        more: !1,
        line_shared: !1,
        loading: !1,
        preview_style: [],
        success: !1,
        share_link: ""
    },
    methods: {
        ga_click: ga_init,
        sildedown: function (e, t) {
            TweenMax.fromTo(e, .5, {
                height: 0
            }, {
                    height: $(e).height(),
                    onComplete: t
                })
        },
        check_share: function (e, t) {
            if (t > 0) {
                this.share_obj = {
                    prod_id: this.products[e].prod_id,
                    prod_img: this.products[e].prod_url,
                    share_id: this.products[e].share_id,
                    prod_name: this.products[e].prod_name,
                    pord_text: this.products[e].share_text
                }, this.popup = !0, $("body").addClass("_freeze")
            } else alert("商品數量不足 無法分享")
        },
        clear_share: function () {
            this.share_obj = {}, this.popup = !1, $("body").removeClass("_freeze")
        },
        sliderleave: function (e, t) {
            console.log("leave", e);
            var r = this;
            TweenLite.fromTo(e, .5, {
                x: "0%"
            }, {
                    x: "-100%",
                    onStart: function () {
                        console.log(r.step)
                    },
                    onComplete: function () {
                        t()
                    }
                })
        },
        sliderenter: function (e, t) {
            console.log("enter", e), TweenLite.fromTo(e, .5, {
                x: "100%"
            }, {
                    x: "0%",
                    onComplete: function () {
                        t()
                    }
                }, .3)
        },
        closecard: function () {
            this.showcard = !1
        },
        select_card: function (e) {
            this.card_no = e, this.share_obj.card = this.image_obj[e]
        },
        next_step: function () {
            var e = this;
            this.check_step().then(function (t) {
                t && (e.setting_step(t), e.step++ , $("html,body").scrollTop(0))
            })
        },
        pre_step: function () {
            this.step-- , "" != this.share_link && (location.href = "/loner/card"), $("html,body").scrollTop(0)
        },
        jump_step: function (e) {
            var t = this;
            if (e != this.step && (e == this.step + 1 || e == this.step - 1))
                if (e > this.step) {
                    this.check_step().then(function (r) {
                        r && (t.setting_step(r), t.step = e)
                    })
                } else this.step = e
        },
        sample_text: function (e) {
            switch (e) {
                case 1:
                    this.share_obj.msg = this.share_obj.pord_text[0];
                    break;
                case 2:
                    this.share_obj.msg = this.share_obj.pord_text[1]
            }
            $("textarea.msg").val(this.share_obj.msg)
        },
        line_share: function () {
            var e = this;
            e.loading || (e.loading = !0, e.line_shared ? (location.href = e.share_link, e.loading = !1) : new Promise(function (t) {
                $.post({
                    url: friendo_url + "SaveLineShare",
                    data: {
                        member_id: e.member_id,
                        from: e.share_obj.fromName,
                        to: e.share_obj.toName,
                        msg: e.share_obj.msg,
                        style: e.share_obj.card.id,
                        share_id: e.share_obj.share_id
                    },
                    dataType: "json",
                    success: function (r) {
                        if (r.result) {
                            var s = r.data;
                            e.line_shared = !0, e.ga_click("reuslt", "card_卡片完成", "card_卡片完成"), t(s)
                        } else 515 == r.errorCode && (alert("Oops! 商品存量不足"), e.ga_click("reuslt", "card_商品存量不足", "card_商品存量不足"), e.step = 0), 601 == r.errorCode && (alert("活動已逾期或不存在"), e.ga_click("reuslt", "card_活動已逾期", "card_活動已逾期"), location.href = friendo_url), t(!1)
                    }
                })
            }).then(function (t) {
                if (e.loading = !1, t) {
                    e.url_id = encodeURI(t.url_id);
                    var r = window.location.protocol + "//" + window.location.host + "/loner/gift?card_url=" + e.url_id;
                    e.share_link = "http://line.naver.jp/R/msg/text/?欸欸～現在全家零食飲料買一送一！%0D%0A我買了一個另外一個送你，只有3天可以領喔！(不然就過期了Orz...)%0D%0A" + r, location.href = e.share_link
                }
            }))
        },
        setting_step: function (e) {
            switch (this.step) {
                case 0:
                    $("body").removeClass("_freeze"), this.popup = !1, this.share_obj.card = this.image_obj[this.card_no], this.showcard = !1;
                    break;
                case 1:
                    this.share_obj.msg = "", this.share_obj.fromName = "", this.share_obj.toName = ""
            }
        },
        check_step: function () {
            var e = this;
            return new Promise(function (t) {
                switch (e.step) {
                    case 0:
                        e.share_obj.prod_id || (alert("請選擇商品"), t(!1)), t(!0);
                        break;
                    case 1:
                        e.share_obj.card || (alert("請選擇卡片"), t(!1)), t(!0);
                        break;
                    case 2:
                        e.share_obj.toName || (alert("請輸入對方暱稱"), t(!1)), e.share_obj.fromName || (alert("請輸入我的暱稱"), t(!1)), e.share_obj.msg || (alert("請輸入想跟對方說什麼"), t(!1)), t(!0);
                        break;
                    case 3:
                        break;
                    default:
                        alert("非法侵入"), e.step = 0, t(!1)
                }
            })
        }
    },
    mounted: function () {
        var e = this;
        $("body").loadpage(), e.member_id = checkCookie("mid") ? checkCookie("mid") : findGetParameter("memberID"), $.post({
            url: friendo_url + "GetMbShareProd",
            data: {
                member_id: e.member_id
            },
            dataType: "json",
            success: function (t) {
                t.result && (e.products = t.data, e.first_pords = t.data.filter(function (e, t) {
                    return t < 10
                }), e.more_prods = t.data.filter(function (e, t) {
                    return t >= 10
                }))
            }
        })
    }
});