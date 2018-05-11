const
    production = $("#appjs").attr("mode") === "false",
    friendo_url = "//o2o.friendo.com.tw/loner/";
const card_images = [ 
    {
        id: 1,
        url: "/content/outcast/images/card1.jpg",
        name: "新春款",
        text_pos: {
            left: "15%",
            top: "11%",
            width: "69%",
            height:"32%"
        },
        prod_pos: {
            left: "14.9%",
            top: "72.2%",
            width: "25%"
        }
    },
    {
        id: 2,
        url: "/content/outcast/images/card2.jpg",
        name: "基本款",
        text_pos: {
            left: "14.9%",
            top: "11%",
            width: "69%",
            height: "32%"
        },
        prod_pos: {
            left: "14.9%",
            top: "72.2%",
            width: "25%"
        }
    },
    {
        id: 3,
        url: "/content/outcast/images/card3.jpg",
        name: "情人款",
        text_pos: {
            left: "14.9%",
            top: "11%",
            width: "69%",
            height: "32%"
        },
        prod_pos: {
            left: "13.7%",
            top: "72.2%",
            width: "25%"
        }
    },
    {
        id: 4,
        url: "/content/outcast/images/card4.jpg",
        name: "邊緣款",
        text_pos: {
            left: "14.9%",
            top: "11%",
            width: "69%",
            height: "32%"
        },
        prod_pos: {
            left: "14.9%",
            top: "72.2%",
            width: "25%"
        }
    },
    {
        id: 5,
        url: "/content/outcast/images/card5.jpg",
        name: "RO情人款",
        text_pos: {
            left: "14.9%",
            top: "11%",
            width: "69%",
            height: "32%"
        },
        prod_pos: {
            left: "5.2%",
            top: "71.2%",
            width: "30%"
        }
    },
    {
        id: 6,
        url: "/content/outcast/images/card6.jpg",
        name: "RO新春款",
        text_pos: {
            left: "14.9%",
            top: "11%",
            width: "69%",
            height: "32%"
        },
        prod_pos: {
            left: "14.9%",
            top: "72.2%",
            width: "25%"
        }
    }
];
Vue.config.devtools = !production;
Vue.config.debug = !production;
Vue.config.silent = !production;

$(function () {
    console.log("v4");
    $(".nav-item.card").hide();
    var now = new Date();
    const today = now.getFullYear() + "/" + (now.getMonth() + 1);
    if (today == "2018/3") {
        // if (now.getDate() >= 22 && now.getDate() <= 31) {
        //     alert("※活動倒數再加碼※\n於 3 / 22~3 / 31期間登錄活動指定商品紙本電子發票，除原活動獎項外，加碼再抽全家購物金$200元 ，限量200組！登錄越多，抽中機會越高！");
        // }
    }
    if (findGetParameter("memberID") && !checkCookie("mid")) {
        document.cookie = document.cookie + ";mid=" + findGetParameter("memberID") + ";";
        let expire_days = 1;
        var d = new Date();
        d.setTime(d.getTime() + (expire_days * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = "mid=" + findGetParameter("memberID") + "; " + expires + '; path=/';
    }
    if (checkCookie("mid")) {
        $(".nav-item.card").show();
    }
    $(".gaEvent").click(function () {
        let action = $(this).attr("gAction");
        let category = $(this).attr("gCategory");
        let label = $(this).attr("gLabel");
        ga('send', {
            hitType: 'event',
            eventCategory: category,
            eventAction: action,
            eventLabel: label
        });
        fbq('trackCustom', action, { custom_param: "邊緣人_" + label });
        console.log("ga:", action, category, label);
    });
});
function ga_init(action, category, label) {
    ga('send', {
        hitType: 'event',
        eventCategory: category,
        eventAction: action,
        eventLabel: label
    });
    fbq('trackCustom', action, { custom_param: "邊緣人_" + label });
    console.log("ga:", action, category, label);
}
function findGetParameter(parameterName) {
    let result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName)
                result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function checkCookie(parameterName) {
    let result = null,
        tmp = [];
    let cookie = document.cookie;
    cookie.split(";")
        .forEach(function (item) { 
            tmp = item.split("=");
            if (tmp[0].replace(" ","") === parameterName)
                result = tmp[1];
        })
    return result;
}

function deviceCheck() {
    let device = "";
    let md = new MobileDetect(window.navigator.userAgent);
    if (md.match(/android/i)) {
        device = "android";
    } else if(md.match(/(iphone|ipad|ipod);?/i)) {
        device = "ios";
    } else {
        device = "pc";
    }
    return device;
}