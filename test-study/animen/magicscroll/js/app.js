var FDO = FDO || {};
FDO.project = FDO.project || {};
(function() {
    $('html').oldBrowserAlert();
})();


(function($) {
    $.fn.menu = function(opts) {
        // default configuration
        var config = $.extend({}, {
            opt1: null
        }, opts);
        // main function
        function init(obj) {
            var dObj = $(obj);
            var dMenulink = dObj.find('.nav-btn');
            var dAllLink = dObj.find('.nav-menu a');

            dMenulink.click(function() {
                dObj.toggleClass('nav--active');
                // $('body').toggleClass('_freeze');
            });

            dAllLink.click(function() {
                dObj.removeClass('nav--active')
            });
        }
        // initialize every element
        this.each(function() {
            init($(this));
        });
        return this;
    };
    // start
    $(function() {
        // $(".nav").menu();
    });
})(jQuery);




$(document).ready(function() {
    var controller = new ScrollMagic.Controller();
    var tl_step1 = new TimelineMax();
    var tl_account_s1 = new TimelineMax({ delay: 1 });
    var tl_account_s2 = new TimelineMax();

    Vue.use(VueRouter);
    var router = new VueRouter();

    var mixin = {
        created: function() {

        },
        data: function() {
            return {}
        },
        methods: {
            gaLog: function(tag) {
                //console.log(tag);
                _gaq.push(['_trackEvent', '中信卡優惠檢測', "點擊", tag, 1, true]);
            }
        },
        mounted: function() {
            $('.js_go-step1').on('click', function(e) {
                // e.preventDefault();
                $('html,body').animate({
                    scrollTop: $('.step1').offset().top - $(window).height() * 0.18
                }, 600, "swing");
            });

        }
    };


    var Nav = Vue.component('v-nav', {
        mixins: [mixin],
        template: '#v-nav',
        mounted: function() {
            $(".nav").menu();
        }
    });

    var ResultHas = Vue.component('v-result-has', {
        mixins: [mixin],
        template: '#v-result-has',
        data: function() {
            return {}
        },
        mounted: function() {
            window.scrollTo(0, 0);
            TweenMax.fromTo('.result__loader', 1, {
                opacity: 1
            }, {
                opacity: 0,
                ease: Power4.easeInOut
            }).delay(3);

            TweenMax.fromTo('.result__content', 1, {
                opacity: 0
            }, {
                opacity: 1,
                ease: Power4.easeInOut
            }).delay(3);

            TweenMax.to('.result__ft ul', 0.5,
            {
                autoAlpha: 1,
                y: -10
            });
        }
    });

    var ResultNoHas = Vue.component('v-result-nohas', {
        mixins: [mixin],
        template: '#v-result-nohas',
        data: function() {
            return {}
        },
        mounted: function() {
            var nohas_tl = new TimelineMax({
                pause: true,
                onComplete: render_content_1
            });
            var nohas_content1_tl = new TimelineMax({
                pause: true
            });
            var nohas_content2_tl = new TimelineMax({
                pause: true
            });

            var t1 = $('.inner--1'),
                t2 = $('.inner--2'),
                t3 = $('.inner--3'),
                t4 = $('.inner--4'),
                d1 = $('.doll-1'),
                d2 = $('.doll-2'),
                contentCard = $('.result__s-none__ContnetCard');

            window.scrollTo(0, 0);

            nohas_tl
                .add(
                    TweenMax.fromTo('.result__loader', 1,
                        {
                            opacity: 1
                        }, {
                            opacity: 0,
                            ease: Power4.easeInOut
                        })
                )
                .add(
                    TweenMax.fromTo('.result__nohasContent', 1,
                        {
                            opacity: 0
                        }, {
                            opacity: 1,
                            ease: Power4.easeInOut
                        })
                );

            function render_content_1(){
                nohas_content1_tl
                    .staggerTo([t1,t2,t3,t4], 0.25,
                        {
                            autoAlpha:1,
                            y: 10
                        }, 0.25
                    )
                    .staggerFromTo([d1,d2], 0.25,
                        {
                            scale: 0
                        },
                        {
                            autoAlpha:1,
                            scale: 1
                        },0.25
                    )
                    .to('.result__wrap .cover', 0.25,
                        {
                            autoAlpha: 1
                        }
                    )
                    .to('.result__wrap .btn-area', 0.25,
                        {
                            autoAlpha: 1,
                            y: -10
                        }
                    );
            }
            nohas_content2_tl
                .fromTo(contentCard.find('.title'), 0.5,
                    {
                        scale: 0
                    },
                    {
                        opacity:1,
                        scale: 1
                    }
                )
                .staggerTo('.wrap div', 0.5,
                    {
                        autoAlpha: 1
                    },0.25
                )
                .staggerTo('.card div', 0.25,
                    {
                        autoAlpha: 1,
                        y: -10
                    },0.25
                )
                .to('.result__content', 0.5,
                    {
                        autoAlpha: 1

                    }
                );

            new ScrollMagic.Scene({
                triggerElement: '.result__s-none__ContnetCard',
                offset: -100
            })
            .setTween(nohas_content2_tl)
            .addTo(controller);
        }
    });
    var Account = Vue.component('v-account', {
        mixins: [mixin],
        template: '#v-account',
        data: function() {
            return {}
        },
        init: function() {},
        mounted: function() {
            var _this = this;


            if (!initVideo.inited) {
                initVideo.init(function() {
                    if (!_this._isBeingDestroyed) {
                        $('.nav .js-playerBtnA').trigger('click');
                    }
                });
                $('.video__ctrl .js-hasAccount').click(function() {
                    _this.gaLog('pop-立即線上開戶');
                    console.log('立即線上開戶');
                });
                $('.video__ctrl .js-closeVideo').click(function() {
                    _this.gaLog('pop-暸解詳情');
                    console.log('暸解詳情');

                });
            } else {
                initVideo.bindEvent();
                if (!_this._isBeingDestroyed) {
                    $('.nav .js-playerBtnA').trigger('click');
                }
            }


            tl_account_s1.add(TweenMax.staggerFromTo('.account__ang1', 0.75, {
                y: -60,
                opacity: 0
            }, {
                y: 0,
                opacity: 1
            }, 0.25), 0);


            new ScrollMagic.Scene({
                    triggerElement: '#account__s1'
                })
                .setTween(tl_account_s1) // trigger a TweenMax.to tween
                .addTo(controller);


            tl_account_s2.add(TweenMax.staggerFromTo('.account__s2-title, .account__item', 0.75, {
                yPercent: -20,
                opacity: 0
            }, {
                yPercent: 0,
                opacity: 1
            }, 0.25), 0);



            new ScrollMagic.Scene({
                    triggerElement: '#account__s2'
                })
                .setTween(tl_account_s2) // trigger a TweenMax.to tween
                .addTo(controller);

            TweenMax.fromTo('.account__s4', 1, {
                yPercent: 100
            }, {
                yPercent: 0
            }).delay(4);



        }
    });

    var Index = Vue.component('v-index', {
        mixins: [mixin],
        template: '#v-index',
        data: function() {
            return {
                questions: {
                    Q1: {
                        question: '您在刷卡消費時，最關注哪些優惠?（可複選）',
                        selects: {
                            0: '美食優惠',
                            1: '旅遊優惠',
                            2: '購物優惠'
                        },
                        required: true,
                        default: [],
                        type: 'checkbox'
                    },
                    Q2: {
                        question: '您是否持有「中信銀行帳戶」？',
                        selects: {
                            1: '是',
                            0: '否'
                        },
                        required: true,
                        default: 3,
                        type: 'radio'
                    }
                },
                ans: {},
                result: {
                    isvalidate: true,
                    info: {}
                }
            }
        },
        methods: {
            initAns: function() {
                var obj = {};
                var _this = this;
                $.each(this.questions, function(key, item) {
                    Vue.set(_this.ans, key, item.default);
                    Vue.set(_this.result.info, key, {});
                });

            },
            checkActive: function(qid, selectid) {
                var _this = this;
                var selectid = parseInt(selectid);

                var result = false;
                switch (this.questions[qid].type) {
                    case 'checkbox':
                        var indexOf = _this.ans[qid].indexOf(selectid);
                        if (indexOf != -1) {
                            result = true;
                        };
                        break;
                    case 'radio':
                        if (selectid == _this.ans[qid]) {
                            result = true;
                        };
                        break;
                    default:
                        //default block
                }

                return result;
            },
            setAns: function(qid, selectid, event) {
                var _this = this;
                var selectid = parseInt(selectid);


                switch (this.questions[qid].type) {
                    case 'checkbox':
                        var indexOf = _this.ans[qid].indexOf(selectid);
                        if (indexOf != -1) {
                            if (_this.ans[qid].length == 1) {
                                alert('至少選擇一項，可複選');
                                return;
                            }
                            _this.ans[qid].splice(indexOf, 1);
                        } else {
                            _this.ans[qid].push(selectid);
                        }
                        break;
                    case 'radio':
                        // _this.ans[qid] = selectedId;
                        Vue.set(_this.ans, qid, selectid);
                        break;
                    default:
                        //default block
                }
            },
            validate: function() {
                var _this = this;
                var result = _this.result;
                var summaryValidate = true;

                $.each(this.questions, function(key, item) {
                    if (item.required) {
                        switch (item.type) {
                            case 'checkbox':
                                result.info[key].isvalidate = _this.ans[key].length > 0 ? true : false;
                                result.info[key].msg = "每個項目至少選則一項以上";

                                if (!result.info[key].isvalidate) { summaryValidate = false; }
                                break;
                            case 'radio':
                                result.info[key].isvalidate = _this.ans[key] != null ? true : false;
                                result.info[key].msg = "每個項目至少選則一項以上";

                                if (!result.info[key].isvalidate) { summaryValidate = false; }

                                break;
                            default:
                        }
                    }
                });

                result.isvalidate = summaryValidate;

                return result;

            },
            submitResult: function(event) {
                var _this = this;
                var hasAccount = _this.ans['Q2'] == 0 ? true : false;
                var hasQ1 = _this.ans['Q1'].length > 0 ? true : false;
                var hasQ2 = _this.ans['Q2'] != 3 ? true : false;
                //console.log(hasQ2);
                event.preventDefault();

                if (!hasQ1 || !hasQ2) {
                    alert('您有問題未作答，請點擊選項完成作答');
                    return;
                }

                if (hasAccount && hasQ1 && hasQ2) {
                    window.location = '#resultnohas';
                } else {
                    window.location = '#resulthas';
                }
            }
        },
        created: function() {

        },
        beforeMount: function() {
            this.initAns();
        },
        mounted: function() {
            var rwdSelect = isMobile ? '.people--mb' : '.people--pc';
            var index_tl_duration = isMobile ? 3 : 4.5;
            var people_talk_duration = isMobile ? 3 : 3.25;

            var people_talk = new TimelineMax({
                repeat: -1,
                delay: 0,
                paused: true,
                repeatDelay: 1,
                yoyo: true
            });


            var index_tl = new TimelineMax({
                repeat: 0,
                delay: 1.5,
                paused: true,
                yoyo: false,
                onComplete: function() {
                    people_talk.play();
                }
            });





            var easeInOut = function(opts) {
                return function() {
                    return Back.easeOut.config(opts);
                }
            };

            var indexEase = easeInOut(2);



            index_tl.add(TweenMax.fromTo(".index__cover", 1, {
                scale: 0
            }, {
                scale: 1
            }), 0);

            index_tl.add(TweenMax.fromTo(".index__bg", 1, {
                scale: 0
            }, {
                scale: 1
            }), 1.5);

            index_tl.add(TweenMax.staggerFromTo(rwdSelect + " .people__g", 2, {
                opacity: 0,
                yPercent: '+=90'
            }, {
                opacity: 1,
                yPercent: 0,
                ease: Back.easeOut.config(1.1)
            }, 0.5), 3);


            index_tl.add(TweenMax.staggerFromTo(rwdSelect + " .people__h", 3, {
                yPercent: '+=20'
            }, {
                yPercent: 0,
                ease: indexEase()
            }, 0.5), 3.25);

            index_tl.add(TweenMax.fromTo('.nav,.index__logo', 1, {
                yPercent: -100,
                opacity: 0
            }, {
                yPercent: 0,
                opacity: 1,
                ease: Power3.easeOut
            }), 0);

            people_talk.add(TweenMax.staggerTo(rwdSelect + " .people__p", 1, {
                yPercent: -1,
                ease: indexEase()
            }, 0.5), 0);

            people_talk.add(TweenMax.staggerFromTo(rwdSelect + " .people__h", 2, {
                yPercent: 0
            }, {
                yPercent: -5,
                ease: indexEase()
            }, 0.5), 0.25);


            people_talk.add(TweenMax.staggerFromTo(rwdSelect + " .people__t", 1.5, {
                yPercent: -2,
                scale: 0,
                opacity: 0
            }, {
                yPercent: 0,
                scale: 1,
                opacity: 1,
                ease: indexEase()
            }, 0.5), 0);

            people_talk.duration(people_talk_duration);
            people_talk.repeatDelay(4);
            index_tl.duration(index_tl_duration);
            index_tl.play();


            tl_step1.add(TweenMax.staggerFromTo('.step1__question,.step1__selects,.step1__ctrl', 1, {
                yPercent: -10,
                opacity: 0
            }, {
                yPercent: 0,
                opacity: 1,
                ease: Power4.easeInOut
            }, 0.25), 0);

            var scene_step = new ScrollMagic.Scene({
                    triggerElement: '#step1'
                })
                .setTween(tl_step1) // trigger a TweenMax.to tween
                .addTo(controller);

        }
    });


    var routes = [
        { path: '/', component: Index },
        { path: '/index', component: Index },
        { path: '/resulthas', component: ResultHas },
        { path: '/resultnohas', component: ResultNoHas },
        { path: '/account', component: Account }
    ];

    var router = new VueRouter({
        routes: routes,
        beforeEach: function(transition) {
            window.scrollTo(0, 0);
        }
    });

    // router.beforeEach(function (transition) {
    //   window.scrollTo(0, 0)
    //   // transition.next()
    // });

    var app = new Vue({
        router: router,
        watch: {},
        mounted: function() {



        }
    }).$mount('#ctbcGoHomeApp');






});
