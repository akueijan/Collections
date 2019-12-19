const
    production = $("#appjs").data("mode") === "false",
    friendo_url = $("#appjs").data("site");

const device = deviceCheck();
device.width = window.innerWidth;
if (device.os == "android") {
    device.width = Math.floor(device.width * 1.1)
}

Vue.config.devtools = !production;
Vue.config.debug = !production;
Vue.config.silent = !production;

var md = new MobileDetect(window.navigator.userAgent);
var isMobile = md.phone() != null || md.tablet() != null;
if (isMobile) {
    if (!/index_mobile.html/.test(window.location.pathname)) {
        window.location.href = "index_mobile.html" + window.location.search + window.location.hash
    }
} else if (!/index.html/.test(window.location.pathname)) {
    window.location.href = "index.html" + window.location.search + window.location.hash
}

var game;
var kvideo;
var linkVideo;
var video_link = ['Meh3sPKPhVo', 'eMESi4ZVMSc', 'r1HWGQ7lZp0', 'vZlKCFaP2lU', 'mmNXGMSm6pk'];

function onYouTubeIframeAPIReady() {
    console.log("%cTY loaded", "color:blue;")
    kvideoInit();
}
function kvideoInit() {
    linkVideo = parseInt(findGetParameter('linkvideo'));
    kvideo = new YT.Player('kvideo', {
        height: '100%',
        width: '100%',
        videoId: video_link[linkVideo],
        playerVars: {
            'controls': 1,
            'rel': 0,
            'enablejsapi': 1,
            'showinfo': 0,
            'iv_load_policy': 3,
            'modestbranding': 1,
            'playlist': '',
            'start': 3,
            'playsinline': 1
        },
        events: {
            'onReady': function (e) {
                // e.target.mute();
            },
        }
    });
    if (linkVideo <= 4) {
        index_view.videoPlayLink();
    }
}
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

$(function () {
    console.log("v1.8");
    console.log(device);
    // var vConsole = new VConsole();
    $(".nav").menu();
});


function findGetParameter(parameterName) {
    var result = null,
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
    var result = null,
        tmp = [];
    var cookie = document.cookie;
    cookie.split(";")
        .forEach(function (item) {
            if (item.charAt(0) == " ") {
                item = item.substring(1);
            }
            tmp = item.split("=");
            if (tmp[0] === parameterName)
                result = tmp[1];
        })
    return result;
}
function deviceCheck() {
    var device = {};
    var md = new MobileDetect(window.navigator.userAgent);
    if (md.match(/android/i)) {
        device.os = "android";
        device.version = md.version("android");
    } else if (md.match(/(iphone|ipad|ipod);?/i)) {
        device.os = "ios";
        device.version = md.version("iOS");
    } else {
        device.os = "pc";
        device.version = md.version("Chrome");
    }
    return device;
}
function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
Vue.mixin({
    data: function () {
        return {
            status: "",
            start_date: "2100/08/09 12:09:10",
            error_msg: "",
            mode: production ? "Started" : "Testing",
            loading: false,
            popuptop: "",
            navHeight: "",
            video_link: video_link,
            rewardShake: true,
            lineHref: '',
            awardList: {
                movie: [{ "name": "詹O婷", "phone": "0928***759" }, { "name": "呂O龍", "phone": "0972***320" }, { "name": "陳O任", "phone": "0966***507" }],
                sharp: [{ "name": "邱O婷", "phone": "0932***271" }],
                switch: [{ "name": "高O嬬", "phone": "0916***425" }],
                honeywell: [{ "name": "羅O嚴", "phone": "0921***379" }],
                ticket1: [{ "name": "吳O峰", "phone": "0910***757" }, { "name": "周O益", "phone": "0933***398" }, { "name": "黃O堂", "phone": "0958***591" }, { "name": "林O鴻", "phone": "0939***190" }, { "name": "李O綺", "phone": "0929***583" }, { "name": "劉O中", "phone": "0975***355" }, { "name": "林O華", "phone": "0939***066" }, { "name": "鄭O潔", "phone": "0920***167" }, { "name": "張O洲", "phone": "0912***913" }, { "name": "王O榆", "phone": "0979***381" }, { "name": "柯O蓉", "phone": "0932***227" }, { "name": "李O玉", "phone": "0936***129" }, { "name": "蔡O慧", "phone": "0929***490" }, { "name": "黃O信", "phone": "0977***780" }, { "name": "黃O智", "phone": "0908***490" }, { "name": "陳O伶", "phone": "0952***390" }, { "name": "謝O穎", "phone": "0953***118" }, { "name": "周O慈", "phone": "0933***820" }, { "name": "黃O薇", "phone": "0912***989" }, { "name": "蔡O宸", "phone": "0928***791" }, { "name": "王O臻", "phone": "0970***881" }, { "name": "洪O瑋", "phone": "0970***926" }, { "name": "黃O翔", "phone": "0935***497" }, { "name": "薛O伶", "phone": "0922***523" }, { "name": "蘇O雯", "phone": "0929***559" }, { "name": "林O珍", "phone": "0912***965" }, { "name": "藍O雯", "phone": "0928***040" }, { "name": "謝O均", "phone": "0912***685" }, { "name": "張O莉", "phone": "0920***656" }, { "name": "伍O名", "phone": "0953***545" }, { "name": "黃O淳", "phone": "0989***323" }, { "name": "陳O玲", "phone": "0953***008" }, { "name": "鄭O帆", "phone": "0918***821" }, { "name": "林O翔", "phone": "0919***437" }, { "name": "董O思", "phone": "0918***899" }, { "name": "林O均", "phone": "0910***891" }, { "name": "盧O萍", "phone": "0920***884" }, { "name": "王O婷", "phone": "0975***790" }, { "name": "魏O翔", "phone": "0929***307" }, { "name": "陳O麟", "phone": "0919***011" }, { "name": "蘇O義", "phone": "0910***796" }, { "name": "林O強", "phone": "0918***311" }, { "name": "許O茹", "phone": "0989***123" }, { "name": "黃O晴", "phone": "0912***440" }, { "name": "林O雅", "phone": "0930***318" }, { "name": "林O華", "phone": "0952***066" }, { "name": "柯O堯", "phone": "0970***439" }, { "name": "黃O堯", "phone": "0982***325" }, { "name": "侯O豪", "phone": "0908***961" }, { "name": "郭O蓉", "phone": "0913***566" }],
                ticket2: [{ "name": "林O年", "phone": "0919***927" }, { "name": "姚O文", "phone": "0933***775" }, { "name": "勞O倫", "phone": "0952***105" }, { "name": "黃O棋", "phone": "0958***276" }, { "name": "蔡O豪", "phone": "0981***698" }, { "name": "羅O諠", "phone": "0915***951" }, { "name": "簡O忠", "phone": "0953***751" }, { "name": "李O熒", "phone": "0929***804" }, { "name": "劉O芳", "phone": "0912***003" }, { "name": "謝O娟", "phone": "0929***839" }, { "name": "江O珊", "phone": "0905***397" }, { "name": "林O勤", "phone": "0933***706" }, { "name": "趙O伶", "phone": "0912***129" }, { "name": "楊O穎", "phone": "0935***719" }, { "name": "葉O萍", "phone": "0933***937" }, { "name": "李O瑋", "phone": "0912***414" }, { "name": "周O儀", "phone": "0986***579" }, { "name": "陳O男", "phone": "0906***597" }, { "name": "黃O禎", "phone": "0963***580" }, { "name": "劉O群", "phone": "0975***857" }, { "name": "沈O昱", "phone": "0928***715" }, { "name": "蘇O丁", "phone": "0929***298" }, { "name": "林O君", "phone": "0989***455" }, { "name": "李O真", "phone": "0952***121" }, { "name": "張O雅", "phone": "0929***730" }, { "name": "許O珊", "phone": "0989***892" }, { "name": "何O諭", "phone": "0988***120" }, { "name": "吳O誠", "phone": "0921***206" }, { "name": "謝O平", "phone": "0988***221" }, { "name": "簡O琴", "phone": "0920***762" }, { "name": "李O學", "phone": "0988***258" }, { "name": "薛O洲", "phone": "0952***150" }, { "name": "蔡O姍", "phone": "0910***172" }, { "name": "吳O琦", "phone": "0985***307" }, { "name": "陳O平", "phone": "0909***987" }, { "name": "吳O樺", "phone": "0917***807" }, { "name": "陳O州", "phone": "0930***790" }, { "name": "詹O豪", "phone": "0963***437" }, { "name": "康O叡", "phone": "0916***748" }, { "name": "傅O錞", "phone": "0972***510" }, { "name": "吳O慧", "phone": "0939***314" }, { "name": "蔣O綺", "phone": "0986***425" }, { "name": "賴O昱", "phone": "0952***084" }, { "name": "黃O粒", "phone": "0933***981" }, { "name": "李O珠", "phone": "0921***255" }, { "name": "蘇O玲", "phone": "0929***498" }, { "name": "徐O倫", "phone": "0960***590" }, { "name": "沈O福", "phone": "0977***292" }, { "name": "許O琴", "phone": "0937***599" }, { "name": "黃O傲", "phone": "0988***818" }, { "name": "林O彬", "phone": "0955***060" }, { "name": "洪O睿", "phone": "0984***725" }, { "name": "楊O娟", "phone": "0912***035" }, { "name": "郭O燦", "phone": "0928***352" }, { "name": "簡O佳", "phone": "0919***030" }, { "name": "陳O勳", "phone": "0900***455" }, { "name": "丁O瑄", "phone": "0958***370" }, { "name": "廖O婷", "phone": "0917***871" }, { "name": "郭O琳", "phone": "0986***918" }, { "name": "徐O茵", "phone": "0931***570" }, { "name": "蔡O峰", "phone": "0989***116" }, { "name": "褚O鳴", "phone": "0976***894" }, { "name": "繆O芝", "phone": "0989***899" }, { "name": "林O倚", "phone": "0989***600" }, { "name": "陳O心", "phone": "0933***006" }, { "name": "陳O佑", "phone": "0968***505" }, { "name": "林O慧", "phone": "0972***920" }, { "name": "陳O群", "phone": "0988***452" }, { "name": "陳O彤", "phone": "0921***971" }, { "name": "吳O瑄", "phone": "0976***449" }, { "name": "吳OO雪", "phone": "0916***103" }, { "name": "尹O豪", "phone": "0979***630" }, { "name": "陳O勝", "phone": "0988***899" }, { "name": "廖O國", "phone": "0952***298" }, { "name": "曾O傑", "phone": "0986***293" }, { "name": "游O君", "phone": "0922***217" }, { "name": "劉O珮", "phone": "0918***313" }, { "name": "黃O琳", "phone": "0933***237" }, { "name": "方O", "phone": "0936***227" }, { "name": "蔡O蓮", "phone": "0931***986" }, { "name": "羅O銘", "phone": "0912***826" }, { "name": "王O田", "phone": "0915***563" }, { "name": "謝O雯", "phone": "0989***971" }, { "name": "張O奇", "phone": "0989***973" }, { "name": "陳O俊", "phone": "0912***540" }, { "name": "陳O安", "phone": "0915***316" }, { "name": "卓O豐", "phone": "0960***458" }, { "name": "劉O華", "phone": "0909***936" }, { "name": "王O娟", "phone": "0932***546" }, { "name": "何O婷", "phone": "0933***398" }, { "name": "李O學", "phone": "0928***897" }, { "name": "葛O", "phone": "0975***014" }, { "name": "鍾O森", "phone": "0900***318" }, { "name": "林O展", "phone": "0905***712" }, { "name": "段O芸", "phone": "0930***121" }, { "name": "孫O蘋", "phone": "0979***723" }, { "name": "沈O穎", "phone": "0919***855" }, { "name": "謝O蓉", "phone": "0926***365" }, { "name": "劉O威", "phone": "0958***515" }, { "name": "陳O淮", "phone": "0988***631" }],
                ticket3: [{ "name": "江O賢", "phone": "0921***701" }, { "name": "賴O瑋", "phone": "0963***274" }, { "name": "盧O順", "phone": "0932***728" }, { "name": "黃OO蘭", "phone": "0909***138" }, { "name": "賴O傑", "phone": "0915***721" }, { "name": "楊O惠", "phone": "0986***129" }, { "name": "陳O偉", "phone": "0966***966" }, { "name": "黃O珍", "phone": "0937***042" }, { "name": "潘O秀", "phone": "0939***872" }, { "name": "林O淑", "phone": "0966***048" }, { "name": "陳O民", "phone": "0919***623" }, { "name": "彭O偉", "phone": "0916***991" }, { "name": "許O凱", "phone": "0912***080" }, { "name": "林O欣", "phone": "0906***220" }, { "name": "吳O儀", "phone": "0919***041" }, { "name": "曾OO春", "phone": "0986***060" }, { "name": "柯O棼", "phone": "0958***584" }, { "name": "許O玉", "phone": "0921***258" }, { "name": "林O淇", "phone": "0934***314" }, { "name": "周O莉", "phone": "0926***230" }, { "name": "吳O凱", "phone": "0963***940" }, { "name": "黃O美", "phone": "0902***352" }, { "name": "彭O萍", "phone": "0955***599" }, { "name": "胡O琪", "phone": "0910***503" }, { "name": "賴O恩", "phone": "0911***998" }, { "name": "徐O娟", "phone": "0917***525" }, { "name": "戴O宗", "phone": "0937***442" }, { "name": "陳O郁", "phone": "0908***399" }, { "name": "陳O榮", "phone": "0972***725" }, { "name": "林O鳳", "phone": "0972***437" }, { "name": "陳O吟", "phone": "0978***692" }, { "name": "林O里", "phone": "0952***225" }, { "name": "李O玲", "phone": "0925***593" }, { "name": "李O錡", "phone": "0926***820" }, { "name": "盧O鳳", "phone": "0956***530" }, { "name": "王O雲", "phone": "0919***137" }, { "name": "張O讚", "phone": "0919***828" }, { "name": "蘇O真", "phone": "0916***011" }, { "name": "陳O廷", "phone": "0921***372" }, { "name": "柯O益", "phone": "0919***460" }, { "name": "蘇OO珠", "phone": "0917***022" }, { "name": "吳O芸", "phone": "0919***812" }, { "name": "陳O秀", "phone": "0909***936" }, { "name": "林O圳", "phone": "0935***866" }, { "name": "陳O瑋", "phone": "0960***602" }, { "name": "林O靜", "phone": "0975***929" }, { "name": "柯O娟", "phone": "0985***705" }, { "name": "張O文", "phone": "0953***531" }, { "name": "黃O雅", "phone": "0973***201" }, { "name": "蔡O哲", "phone": "0919***273" }, { "name": "汪O泉", "phone": "0903***076" }, { "name": "黃O嘉", "phone": "0953***747" }, { "name": "李O蓉", "phone": "0926***456" }, { "name": "林O敏", "phone": "0936***768" }, { "name": "邱O惠", "phone": "0963***936" }, { "name": "胡O竣", "phone": "0987***505" }, { "name": "李O興", "phone": "0932***670" }, { "name": "謝O原", "phone": "0915***825" }, { "name": "胡O銘", "phone": "0981***317" }, { "name": "洪O珠", "phone": "0930***989" }, { "name": "莊O漢", "phone": "0975***363" }, { "name": "陳O戎", "phone": "0912***482" }, { "name": "劉O玉", "phone": "0980***637" }, { "name": "劉O鍵", "phone": "0955***537" }, { "name": "蔡O城", "phone": "0972***608" }, { "name": "葉O嫺", "phone": "0939***868" }, { "name": "林O昌", "phone": "0977***449" }, { "name": "曹O國", "phone": "0911***708" }, { "name": "楊O芬", "phone": "0982***026" }, { "name": "張O龍", "phone": "0917***373" }, { "name": "林O靖", "phone": "0980***180" }, { "name": "張O銘", "phone": "0921***106" }, { "name": "張O蓮", "phone": "0912***202" }, { "name": "蕭O文", "phone": "0983***489" }, { "name": "陳O臻", "phone": "0988***696" }, { "name": "曾O雯", "phone": "0905***298" }, { "name": "蘇O輝", "phone": "0952***632" }, { "name": "李O桓", "phone": "0953***396" }, { "name": "葉O傑", "phone": "0913***332" }, { "name": "吳O瑄", "phone": "0922***826" }, { "name": "余O翰", "phone": "0978***770" }, { "name": "蔡O宗", "phone": "0974***553" }, { "name": "周O霖", "phone": "0972***170" }, { "name": "張O升", "phone": "0907***124" }, { "name": "邱O雯", "phone": "0937***042" }, { "name": "陳O炫", "phone": "0939***429" }, { "name": "魏O玲", "phone": "0910***536" }, { "name": "林O宣", "phone": "0956***751" }, { "name": "彭O鳳", "phone": "0983***709" }, { "name": "葉O娟", "phone": "0919***762" }, { "name": "李O曜", "phone": "0972***778" }, { "name": "陳O璋", "phone": "0908***938" }, { "name": "李O勳", "phone": "0917***279" }, { "name": "龔O媛", "phone": "0952***188" }, { "name": "倪O卿", "phone": "0972***990" }, { "name": "王O芬", "phone": "0926***825" }, { "name": "鄭O文", "phone": "0975***678" }, { "name": "陳O樺", "phone": "0920***232" }, { "name": "李O鋐", "phone": "0918***728" }, { "name": "陳O勳", "phone": "0978***941" }, { "name": "張O香", "phone": "0903***479" }, { "name": "陳O彰", "phone": "0972***215" }, { "name": "林O弘", "phone": "0953***013" }, { "name": "曾O順", "phone": "0979***036" }, { "name": "薛O勻", "phone": "0960***895" }, { "name": "李O綺", "phone": "0973***999" }, { "name": "陳O", "phone": "0989***242" }, { "name": "何O萱", "phone": "0922***827" }, { "name": "李O慧", "phone": "0978***265" }, { "name": "邱O庭", "phone": "0982***001" }, { "name": "林O婷", "phone": "0952***423" }, { "name": "林O翔", "phone": "0983***913" }, { "name": "蕭O怡", "phone": "0933***361" }, { "name": "陳O娟", "phone": "0918***692" }, { "name": "蔡O辛", "phone": "0920***641" }, { "name": "黃O銘", "phone": "0910***751" }, { "name": "蔡O育", "phone": "0987***444" }, { "name": "吳O娟", "phone": "0981***077" }, { "name": "李O魁", "phone": "0953***885" }, { "name": "王O婷", "phone": "0921***827" }, { "name": "張O莉", "phone": "0910***643" }, { "name": "neOOOin", "phone": "0920***584" }, { "name": "梁O安", "phone": "0972***392" }, { "name": "葉O恩", "phone": "0903***516" }, { "name": "黃O萍", "phone": "0975***456" }, { "name": "傅O潔", "phone": "0926***161" }, { "name": "孫O中", "phone": "0918***455" }, { "name": "張O茹", "phone": "0921***977" }, { "name": "吳O穎", "phone": "0921***053" }, { "name": "翟O潔", "phone": "0905***390" }, { "name": "廖O凱", "phone": "0983***309" }, { "name": "張O升", "phone": "0932***731" }, { "name": "陳O瑞", "phone": "0970***612" }, { "name": "廖O閔", "phone": "0953***089" }, { "name": "陳O如", "phone": "0934***279" }, { "name": "李O慧", "phone": "0927***823" }, { "name": "王O娥", "phone": "0955***324" }, { "name": "劉O輝", "phone": "0928***453" }, { "name": "張O庭", "phone": "0927***957" }, { "name": "劉O瑜", "phone": "0970***995" }, { "name": "徐O靜", "phone": "0978***886" }, { "name": "李O慧", "phone": "0913***593" }, { "name": "馮O杰", "phone": "0909***193" }, { "name": "黃O宇", "phone": "0910***513" }, { "name": "李O學", "phone": "0911***682" }, { "name": "鄭O榕", "phone": "0920***135" }, { "name": "吳O洋", "phone": "0972***812" }, { "name": "朱O嬌", "phone": "0953***828" }, { "name": "蔡O粉", "phone": "0922***818" }, { "name": "吳O宜", "phone": "0953***267" }, { "name": "O怡蓉", "phone": "0955***309" }, { "name": "朱O英", "phone": "0965***086" }, { "name": "郭O淇", "phone": "0989***982" }, { "name": "江O羚", "phone": "0968***684" }, { "name": "李O琳", "phone": "0920***926" }, { "name": "董O龍", "phone": "0910***495" }, { "name": "薛O藝", "phone": "0975***239" }, { "name": "溫O涵", "phone": "0975***183" }, { "name": "呂O欣", "phone": "0975***531" }, { "name": "鍾O珊", "phone": "0910***772" }, { "name": "林O珍", "phone": "0921***165" }, { "name": "MOOOs", "phone": "0931***191" }, { "name": "林O賢", "phone": "0916***996" }, { "name": "陳O毅", "phone": "0955***093" }, { "name": "鄭O君", "phone": "0933***964" }, { "name": "鍾O芳", "phone": "0921***743" }, { "name": "張O玲", "phone": "0931***411" }, { "name": "蕭O泰", "phone": "0910***386" }, { "name": "林O珍", "phone": "0983***535" }, { "name": "李O庭", "phone": "0923***426" }, { "name": "吳O娜", "phone": "0937***171" }, { "name": "林O志", "phone": "0910***430" }, { "name": "黃O喬", "phone": "0933***756" }, { "name": "黎O燁", "phone": "0931***433" }, { "name": "王O芳", "phone": "0937***211" }, { "name": "李O尚", "phone": "0910***020" }, { "name": "黃O皓", "phone": "0933***061" }, { "name": "林O蘭", "phone": "0932***791" }, { "name": "吳O蓉", "phone": "0921***366" }, { "name": "李O潔", "phone": "0930***807" }, { "name": "簡O甫", "phone": "0975***175" }, { "name": "李O宜", "phone": "0953***629" }, { "name": "龔O雯", "phone": "0958***960" }, { "name": "謝O馨", "phone": "0976***206" }, { "name": "邱O新", "phone": "0976***666" }, { "name": "林O閎", "phone": "0936***397" }, { "name": "鄧O才", "phone": "0930***068" }, { "name": "王O翔", "phone": "0908***650" }, { "name": "賴O羽", "phone": "0988***611" }, { "name": "黃O芳", "phone": "0933***256" }, { "name": "李O銓", "phone": "0910***429" }, { "name": "莊O勳", "phone": "0936***291" }, { "name": "劉O芳", "phone": "0928***918" }, { "name": "黃O書", "phone": "0963***112" }, { "name": "鄭O芳", "phone": "0934***325" }, { "name": "游O羽", "phone": "0900***789" }, { "name": "張O俗", "phone": "0919***833" }, { "name": "耿O媖", "phone": "0919***008" }, { "name": "陳O哲", "phone": "0952***149" }, { "name": "詹O祺", "phone": "0988***882" }, { "name": "裴O怡", "phone": "0939***716" }, { "name": "饒O齊", "phone": "0932***540" }, { "name": "林O儀", "phone": "0975***223" }, { "name": "洪O瑤", "phone": "0966***175" }, { "name": "梁O旻", "phone": "0937***868" }, { "name": "黃O珍", "phone": "0952***767" }, { "name": "王O蓉", "phone": "0926***489" }, { "name": "許O文", "phone": "0988***138" }, { "name": "顏O雄", "phone": "0939***851" }, { "name": "許O長", "phone": "0910***899" }, { "name": "楊O卿", "phone": "0912***281" }, { "name": "林O英", "phone": "0918***336" }, { "name": "楊O", "phone": "0918***142" }, { "name": "吳O靜", "phone": "0928***186" }, { "name": "彭O淯", "phone": "0955***112" }, { "name": "利O蓉", "phone": "0910***212" }, { "name": "莊O瑩", "phone": "0922***930" }, { "name": "黃O文", "phone": "0912***377" }, { "name": "王O雄", "phone": "0929***889" }, { "name": "甘O明", "phone": "0973***157" }, { "name": "許O宗", "phone": "0939***380" }, { "name": "吳O雯", "phone": "0918***278" }, { "name": "莊O荃", "phone": "0985***310" }, { "name": "吳O芳", "phone": "0921***588" }, { "name": "李O玲", "phone": "0986***031" }, { "name": "卓O珠", "phone": "0910***751" }, { "name": "吳O勳", "phone": "0912***270" }, { "name": "許O莉", "phone": "0928***067" }, { "name": "黃O芯", "phone": "0920***510" }, { "name": "黃O榮", "phone": "0960***741" }, { "name": "李O強", "phone": "0988***050" }, { "name": "李O倫", "phone": "0987***246" }, { "name": "譚O貞", "phone": "0920***014" }, { "name": "鍾O忠", "phone": "0930***526" }, { "name": "廖O婷", "phone": "0952***125" }, { "name": "賴O潔", "phone": "0972***172" }, { "name": "顏O淯", "phone": "0905***900" }, { "name": "陳O諶", "phone": "0909***063" }, { "name": "楊O珠", "phone": "0963***250" }, { "name": "廖O琳", "phone": "0921***315" }, { "name": "黃O哲", "phone": "0911***325" }, { "name": "黃O維", "phone": "0932***175" }, { "name": "張O鳳", "phone": "0903***081" }, { "name": "吳O育", "phone": "0985***369" }, { "name": "詹O華", "phone": "0903***202" }, { "name": "田O芸", "phone": "0975***355" }, { "name": "莊O傑", "phone": "0922***678" }, { "name": "王O宏", "phone": "0905***766" }, { "name": "廖O儀", "phone": "0953***523" }, { "name": "林O鋒", "phone": "0973***259" }, { "name": "潘O傑", "phone": "0937***800" }, { "name": "林O玲", "phone": "0917***043" }, { "name": "王O傑", "phone": "0970***822" }, { "name": "王O柔", "phone": "0928***911" }, { "name": "廖O荷", "phone": "0983***027" }, { "name": "魏O婷", "phone": "0918***149" }, { "name": "張O芸", "phone": "0929***330" }, { "name": "吳O佩", "phone": "0900***088" }, { "name": "曾O榆", "phone": "0963***632" }, { "name": "林O均", "phone": "0966***950" }, { "name": "高O鈞", "phone": "0989***059" }, { "name": "鄭O湖", "phone": "0922***405" }, { "name": "林O玉", "phone": "0955***897" }, { "name": "巫O陽", "phone": "0917***257" }, { "name": "鄭O吟", "phone": "0930***166" }, { "name": "黃O蘭", "phone": "0905***426" }, { "name": "盧O嫻", "phone": "0918***625" }, { "name": "黃O珺", "phone": "0914***927" }, { "name": "林O靖", "phone": "0972***699" }, { "name": "張O慧", "phone": "0953***923" }, { "name": "李O雅", "phone": "0918***698" }, { "name": "張O雲", "phone": "0926***821" }, { "name": "高O鴻", "phone": "0921***904" }, { "name": "蔡O華", "phone": "0988***545" }, { "name": "廖O良", "phone": "0979***332" }, { "name": "戴O諠", "phone": "0911***530" }, { "name": "林O裕", "phone": "0968***347" }, { "name": "陳O嘉", "phone": "0905***727" }, { "name": "施O妤", "phone": "0922***168" }, { "name": "李O祐", "phone": "0908***743" }, { "name": "趙O", "phone": "0987***075" }, { "name": "王O慧", "phone": "0929***878" }, { "name": "陳O瑄", "phone": "0978***315" }, { "name": "蔡O青", "phone": "0917***018" }, { "name": "潘O貞", "phone": "0926***916" }, { "name": "林O如", "phone": "0952***428" }, { "name": "許O榮", "phone": "0988***319" }, { "name": "鍾O豪", "phone": "0903***392" }, { "name": "江O雯", "phone": "0939***849" }, { "name": "陳O", "phone": "0988***716" }, { "name": "鄭O仁", "phone": "0926***484" }, { "name": "許O慶", "phone": "0960***978" }, { "name": "黃O妤", "phone": "0970***041" }, { "name": "廖O婷", "phone": "0931***018" }, { "name": "詹O慈", "phone": "0900***958" }, { "name": "葉O華", "phone": "0920***605" }, { "name": "田O全", "phone": "0917***100" }, { "name": "盧O芳", "phone": "0926***199" }, { "name": "詹O倫", "phone": "0973***217" }, { "name": "陳O鼎", "phone": "0962***848" }, { "name": "蔡O虹", "phone": "0909***183" }, { "name": "范O云", "phone": "0925***203" }, { "name": "李O弘", "phone": "0912***202" }, { "name": "鍾O柔", "phone": "0937***436" }, { "name": "杜O鈴", "phone": "0988***251" }, { "name": "楊OO月", "phone": "0908***600" }, { "name": "黃O晨", "phone": "0913***765" }, { "name": "鄒O珮", "phone": "0928***359" }, { "name": "林O萍", "phone": "0936***933" }, { "name": "潘O雯", "phone": "0978***201" }, { "name": "林O玲", "phone": "0989***366" }, { "name": "陳O螢", "phone": "0911***836" }, { "name": "林O賢", "phone": "0938***980" }, { "name": "陳O雯", "phone": "0919***824" }, { "name": "鍾O杉", "phone": "0905***761" }, { "name": "王O凱", "phone": "0939***286" }, { "name": "蔡O佳", "phone": "0926***840" }, { "name": "彭O梅", "phone": "0909***058" }, { "name": "蔡O慧", "phone": "0955***052" }, { "name": "謝O庭", "phone": "0988***803" }, { "name": "李O穎", "phone": "0903***015" }, { "name": "林O安", "phone": "0988***006" }, { "name": "何O筠", "phone": "0927***558" }, { "name": "林O玉", "phone": "0930***035" }, { "name": "廖O森", "phone": "0910***153" }, { "name": "黃O芳", "phone": "0917***251" }, { "name": "黃O毅", "phone": "0937***230" }, { "name": "吳O怡", "phone": "0918***477" }, { "name": "羅O英", "phone": "0930***991" }, { "name": "林O婷", "phone": "0983***687" }, { "name": "許O偉", "phone": "0982***379" }, { "name": "楊O任", "phone": "0982***761" }, { "name": "林O宗", "phone": "0922***729" }, { "name": "顏O萱", "phone": "0970***404" }, { "name": "吳O傑", "phone": "0922***210" }, { "name": "陳O言", "phone": "0907***665" }, { "name": "翁O萍", "phone": "0928***936" }, { "name": "李O翰", "phone": "0931***786" }, { "name": "陳O慧", "phone": "0929***796" }, { "name": "呂O榮", "phone": "0938***178" }, { "name": "郭O佑", "phone": "0903***714" }, { "name": "王O勛", "phone": "0915***678" }, { "name": "郭O莉", "phone": "0912***819" }, { "name": "林O廷", "phone": "0908***504" }, { "name": "楊O琴", "phone": "0925***799" }, { "name": "吳O蓉", "phone": "0980***185" }, { "name": "鄭O翔", "phone": "0972***851" }, { "name": "許O均", "phone": "0970***716" }, { "name": "林O琳", "phone": "0922***838" }, { "name": "陳OO紅", "phone": "0916***392" }, { "name": "黃O華", "phone": "0908***217" }, { "name": "呂O臻", "phone": "0952***556" }, { "name": "李O雲", "phone": "0987***544" }, { "name": "黃O薰", "phone": "0963***511" }, { "name": "蘇O君", "phone": "0982***531" }, { "name": "郭O廷", "phone": "0975***178" }, { "name": "王O文", "phone": "0935***968" }, { "name": "莊O潔", "phone": "0977***253" }, { "name": "邱O鈴", "phone": "0970***577" }, { "name": "林O萱", "phone": "0978***303" }, { "name": "易O堯", "phone": "0910***947" }, { "name": "李O棻", "phone": "0930***635" }, { "name": "黎O珍", "phone": "0932***735" }, { "name": "林O惠", "phone": "0976***720" }, { "name": "楊O苓", "phone": "0978***061" }, { "name": "胡O崚", "phone": "0928***957" }, { "name": "詹O汝", "phone": "0983***020" }, { "name": "周O璘", "phone": "0920***111" }, { "name": "黃O豪", "phone": "0919***010" }, { "name": "尤O茹", "phone": "0988***551" }, { "name": "程O", "phone": "0909***898" }, { "name": "劉O榮", "phone": "0932***470" }, { "name": "彭O玲", "phone": "0928***081" }, { "name": "鄭O心", "phone": "0938***224" }, { "name": "林O君", "phone": "0900***013" }, { "name": "張O源", "phone": "0916***823" }, { "name": "林O斌", "phone": "0987***591" }, { "name": "秦O涵", "phone": "0932***612" }, { "name": "郭O鳳", "phone": "0911***227" }, { "name": "洪O閔", "phone": "0965***196" }, { "name": "陳O儒", "phone": "0989***117" }, { "name": "蘇O水", "phone": "0933***268" }, { "name": "陳O葉", "phone": "0974***094" }, { "name": "陳O珍", "phone": "0973***787" }, { "name": "李O靜", "phone": "0922***773" }, { "name": "王O筑", "phone": "0972***985" }, { "name": "陳O修", "phone": "0920***777" }, { "name": "陳O傑", "phone": "0926***323" }, { "name": "賴O男", "phone": "0919***769" }, { "name": "朱O思", "phone": "0911***446" }, { "name": "吳O雲", "phone": "0963***736" }, { "name": "陳O國", "phone": "0968***538" }, { "name": "黃O萱", "phone": "0984***781" }, { "name": "劉O宜", "phone": "0903***681" }, { "name": "林O紜", "phone": "0987***287" }, { "name": "顏O淯", "phone": "0972***747" }, { "name": "汪O听", "phone": "0978***786" }, { "name": "林O娟", "phone": "0917***388" }, { "name": "蔡O玲", "phone": "0989***089" }, { "name": "劉O淳", "phone": "0921***605" }, { "name": "詹O榮", "phone": "0978***470" }, { "name": "郭O傑", "phone": "0926***050" }, { "name": "徐O峻", "phone": "0989***308" }, { "name": "蔡OO枝", "phone": "0968***016" }, { "name": "葉O秀", "phone": "0927***172" }, { "name": "楊O雄", "phone": "0905***254" }, { "name": "王O玲", "phone": "0952***146" }, { "name": "陳O惠", "phone": "0975***696" }, { "name": "葉O志", "phone": "0968***000" }, { "name": "李O緯", "phone": "0910***151" }, { "name": "葉O慧", "phone": "0975***336" }, { "name": "李O軒", "phone": "0955***833" }, { "name": "陳O玲", "phone": "0973***368" }, { "name": "陳O文", "phone": "0956***306" }, { "name": "黃O軒", "phone": "0986***855" }, { "name": "黃O慧", "phone": "0921***653" }, { "name": "蘇OO珠", "phone": "0973***332" }, { "name": "繆O暢", "phone": "0921***887" }, { "name": "吳O翔", "phone": "0968***656" }, { "name": "張O成", "phone": "0975***699" }, { "name": "洪O鈺", "phone": "0988***186" }, { "name": "李O臻", "phone": "0908***611" }, { "name": "陳O瑋", "phone": "0985***512" }, { "name": "吳O娜", "phone": "0920***699" }, { "name": "吳O美", "phone": "0952***576" }, { "name": "鍾O豪", "phone": "0972***436" }, { "name": "江O憲", "phone": "0920***101" }, { "name": "洪O傑", "phone": "0922***824" }, { "name": "翁O華", "phone": "0989***801" }, { "name": "陳O鶴", "phone": "0906***236" }, { "name": "林O如", "phone": "0963***873" }, { "name": "郭O君", "phone": "0983***603" }, { "name": "商O娥", "phone": "0963***502" }, { "name": "陳O宏", "phone": "0936***031" }, { "name": "鍾O坤", "phone": "0968***727" }, { "name": "羅O文", "phone": "0908***185" }, { "name": "邱O龍", "phone": "0931***455" }, { "name": "張OO琴", "phone": "0986***556" }, { "name": "彭O憶", "phone": "0921***792" }, { "name": "劉O婷", "phone": "0911***466" }, { "name": "紀O美", "phone": "0902***369" }, { "name": "王O瑤", "phone": "0963***198" }, { "name": "鄭O恩", "phone": "0956***833" }, { "name": "郭O媚", "phone": "0919***923" }, { "name": "池O珍", "phone": "0988***716" }, { "name": "戴O宇", "phone": "0970***795" }, { "name": "陳O儒", "phone": "0919***280" }, { "name": "蘇O君", "phone": "0908***909" }, { "name": "陳O玉", "phone": "0927***632" }, { "name": "郭O玫", "phone": "0988***377" }, { "name": "蔡O華", "phone": "0939***502" }, { "name": "劉O輝", "phone": "0929***781" }, { "name": "黎O廣", "phone": "0908***529" }, { "name": "陳O婷", "phone": "0922***393" }, { "name": "吳O翔", "phone": "0953***875" }, { "name": "李O岷", "phone": "0927***360" }, { "name": "林O蓉", "phone": "0929***727" }, { "name": "林O吉", "phone": "0917***823" }, { "name": "曾O玉", "phone": "0911***165" }, { "name": "白O婷", "phone": "0911***473" }, { "name": "鄭O慶", "phone": "0905***397" }, { "name": "翁O傑", "phone": "0989***128" }, { "name": "陳O賢", "phone": "0983***448" }, { "name": "楊O羚", "phone": "0976***512" }, { "name": "林O華", "phone": "0929***981" }, { "name": "陳O菁", "phone": "0968***003" }, { "name": "李O蓉", "phone": "0918***775" }, { "name": "張O君", "phone": "0933***054" }, { "name": "張O航", "phone": "0916***387" }, { "name": "蔡O穎", "phone": "0973***568" }, { "name": "邱O叡", "phone": "0919***269" }, { "name": "鄭O", "phone": "0989***272" }, { "name": "郭O今", "phone": "0929***655" }, { "name": "洪O仁", "phone": "0919***316" }, { "name": "廖O甫", "phone": "0928***215" }, { "name": "張O賢", "phone": "0916***313" }, { "name": "蔡O任", "phone": "0968***779" }, { "name": "林O琪", "phone": "0913***030" }, { "name": "鄧O男", "phone": "0929***229" }, { "name": "許O華", "phone": "0920***125" }, { "name": "宋O書", "phone": "0937***107" }, { "name": "黃O霖", "phone": "0929***612" }, { "name": "黃O芳", "phone": "0937***209" }, { "name": "湯O涵", "phone": "0926***132" }, { "name": "陳O麗", "phone": "0922***143" }, { "name": "黃O宏", "phone": "0972***251" }, { "name": "簡O田", "phone": "0919***274" }, { "name": "謝O敏", "phone": "0929***909" }, { "name": "涂O鎮", "phone": "0911***624" }, { "name": "朱O娜", "phone": "0912***167" }, { "name": "許O珊", "phone": "0975***035" }, { "name": "lOOOa", "phone": "0900***747" }, { "name": "蔡O青", "phone": "0932***632" }, { "name": "蕭O宣", "phone": "0920***577" }, { "name": "張O姿", "phone": "0937***865" }, { "name": "李O娟", "phone": "0988***276" }, { "name": "徐O虹", "phone": "0926***440" }, { "name": "陳O芳", "phone": "0925***098" }, { "name": "林O庭", "phone": "0981***366" }, { "name": "薛O華", "phone": "0972***785" }]
            }
        }
    },
    computed: {
        openCome: function () {
            return !(this.mode == "Testing" || start_date <= 0);
        }
    },
    watch: {
        error_msg: function (val) {
            $('body').toggleClass('_freeze');
        }
    },
    methods: {
        endDate: function () { 
            return Date.parse(new Date("2019/02/13 00:00")) - Date.parse(new Date()) <= 0
        },
        gaEvant: function (gtmData) {
            dataLayer.push({'event': gtmData});
            console.log("ga:", gtmData);
        },
        server_busy: function () {
            var vm = this;
            vm.error_msg = "系統忙碌中，請稍後在試!";
            vm.loading = false;
            vm.error_cou = 6;
        },
        setCookie: function (cname, cvalue, time) {
            var d = new Date();
            d.setTime(d.getTime() + (time * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";";
        },
        logger: function (level, content, tag) {
            if (production) {
                // level : ['ERROR' => 0, DEBUG' => 1, 'WARNING' => 2, 'INFO' => 3, 'ALL' => 4]
                var level_info = ['ERROR', 'DEBUG', 'WARNING', 'INFO', 'ALL'];
                _LTracker.push({
                    'level': level_info[level],
                    'content': JSON.stringify(content),
                    'path': window.location.href,
                    'tag': tag || null,
                    'device': device,
                    'timestamp': Date.now()
                });
            }
        },
        errorDone: function () {
            this.error_msg = "";
        },
        checkOnline: function () {
            if (!navigator.onLine) {
                alert("Internet 連線已斷開，請確認您的網路狀態。");
                // window.location.reload();
            }
        },
        state_check: function () {
            var vm = this;
            return $.ajax({
                method: "GET",
                url: `${friendo_url}GetProjectInfo`,
                success: function (res) {
                    // console.log(res);
                    var data = res.Data;
                    vm.start_date = data.StartDateTime;
                    vm.mode = data.Status;
                }
            })
        },
        scrollTo: function (e) {
            var vm = this;
            vm.room = null;
            vm.allPopupClose();
            $("html,body").animate({
                scrollTop: $(e).offset().top - vm.navHeight
            }, 500);
        },
        popupOpen: function () {
            var vm = this;
            if (!vm.popuptop || vm.popuptop === 0) {
                vm.popuptop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
            }
            $('body').addClass('_freeze');
        },
        popupClose: function () {
            var vm = this;
            $('body').removeClass('_freeze');
            $('html, body').scrollTop(vm.popuptop);
            vm.popuptop = 0;
        },
        afterEnter: function () {
            var vm = this;
            vm.popupOpen();
        },
        getToken: function() {
            var vm = this;
            return $.ajax({
                // url: "https://carrefour2019cny.azurewebsites.net/api/auth/login?projectId=61",
                url: `${friendo_url}api/auth/login?projectId=61`,
                headers: {
                    "webtoken": "2YRiIGevkjZZ-S22iwwuSoajRcnZUSeEJ+dwslTtM+s="
                },
                method: "GET",
                dataType: "json"
            });
        },
        // showToken: function() {
        //     var vm = this;
        //     vm.getToken().then(function(res){
        //         console.log(res);
        //         vm.token = res.token;
        //         // vm.getProj(res);
        //     });
        // },
        getProj: function() {
            var vm = this;
            return $.ajax({
                // url: "https://carrefour2019cny.azurewebsites.net/api/carrefourcny/project",
                url: `${friendo_url}api/carrefourcny/project`,
                headers: {
                    "Authorization": "Bearer " + vm.token,
                },
                method: "GET",
                dataType: "json"
            });
        },
        open_form: function () {
            var vm = this;
            vm.getToken().then(function (res) {
                vm.token = res.token;
                vm.saveCaptcha();
                vm.perdataPop = 'game';
                vm.gamePop = false;
                vm.game.eggPop = false;
                vm.navIssue();
            })
        },
        set_awardItem: function (val) { 
            this.awardItem = val
        },
        showProj: function() {
            var vm = this;
            vm.getToken().then(function(res){
                vm.token = res.token;
            }).then(function(){
                vm.getProj().then(function(proData){
                    console.log(proData);
                    vm.probability = proData.data.probability;
                }).then(function(){
                    vm.game = new Gmaes({
                        probability : vm.probability,
                        luckyAward: vm.luckyAward,
                        awardItem: vm.set_awardItem,
                        gtmData: vm.gaEvant,
                    });
                });
            });
        },
        getCaptcha: function() {
            var vm = this;
            var time = Date.now();
            return $.ajax({
                // url: "https://carrefour2019cny.azurewebsites.net/api/carrefourcny/captcha",
                url: `${friendo_url}api/carrefourcny/captcha?time=`+time,
                method: "GET",
                dataType: "json"
            });
        },
        saveCaptcha: function() {
            var vm = this;
            vm.getCaptcha().then(function(resCap){
                console.log(resCap);
                vm.base64Img = resCap.data.base64StringCaptcha;
                vm.capKey = resCap.data.key;
            })
        },
        sendData: function () {
            var vm = this;
            vm.luckyAward = vm.awardItem
            var phone_rule = /^09[0-9]{8}$/;
            if (vm.loading) {
                return 
            }
            if (vm.inputName == "") {
                alert("請輸入姓名")
                return
            }
            if (vm.inputMobile == "" || !vm.inputMobile.match(phone_rule)) {
                alert("手機號碼格式錯誤")
                return
            }
            console.log(vm.luckyAward);
            if (!vm.luckyAward) {
                alert("非正常管道")
                return
            }
            if (vm.inputEmail == "") {
                alert("請輸入email")
                return
            }
            if (vm.inputCap == "") {
                alert("請輸入驗證碼")
                return
            }
            if (!vm.checkagree) {
                alert("請勾選同意本活動辦法及注意事項，即可參加抽獎")
                return
            }
            if (!navigator.onLine) {
                alert("Internet 連線已斷開，請確認您的網路狀態。");
                return 
            }
            vm.loading = true;
            var post_data = {
                "Username": vm.inputName,
                "mobilephone": vm.inputMobile,
                "LuckyDrawType": vm.luckyAward,
                "email": vm.inputEmail,
                "IsAllowToGetNotification": vm.checkwish,
            }
            console.log(post_data)
            return $.ajax({
                // url: "https://carrefour2019cny.azurewebsites.net/api/carrefourcny/save",
                url: `${friendo_url}api/carrefourcny/save`,
                headers: {
                    "Authorization": "Bearer " + vm.token,
                    "Key": vm.capKey,
                    "Captcha": vm.inputCap,
                },
                data: post_data,
                method: "POST",
                dataType: "json"
            }).done(function (res) {
                vm.loading = false;
                console.log(res);
                if(res.statusCode == 201) {
                    vm.joinedPop = true;
                    vm.popupOpen();
                    return;
                }
                if(res.statusCode == 200 && res.responseMessage == "") {
                    vm.finishPop = true;
                    vm.popupOpen();
                    return;
                }
                if(res.statusCode == 401) {
                    alert(res.responseMessage);
                    vm.inputCap = "";
                    vm.saveCaptcha();
                    return;
                } else {
                    alert(res.responseMessage);
                    return;
                }
            });
        },
        code_reset: function () {
            var vm = this;
            vm.inputCap = "";
            vm.saveCaptcha();
        },
        finish_done: function () {
                this.popupClose();
                this.finishPop = false;
                this.perdataPop = false;
                this.joinedPop = false;
            if (this.perdataPop == 'game'){
                this.gamePop = false;
                this.game.eggPop = false;
                // this.scrollTo('#kv-bottom');
            } 
            if (this.perdataPop == 'room') {
                // this.scrollTo('#game-div');
            }
        },
        clearData: function() {
            var vm = this;
            vm.inputName = "";
            vm.inputMobile = "";
            vm.luckyAward = 0;
            vm.inputEmail = "";
            vm.checkwish = false;
            vm.checkagree = false;
            vm.inputCap = "";
            // vm.saveCaptcha();
            vm.game.clickCun = 0;
        },
    },
    components: {
        comingsoon: comingsoon
    },
    mounted: function () {
        var vm = this;
        // fix-body-space
        var navHeight = $('.window-top').height();
        vm.navHeight = navHeight - 30;
        $('body').css('margin-top', vm.navHeight);
        $(".nav-lock").click(function(){
            $("body").removeClass("_freeze");
        })
        //lineLink
        var title = "新年快樂！我剛剛看家樂福3+1支賀歲片，可以抽一年份電影票！在電影場景找彩蛋再抽50吋電視和超過500張家樂福即享券！%0D一起看電影抽大獎 >";
        if (isMobile) {
            vm.lineHref = "http://line.naver.jp/R/msg/text/?" + title + "%0D%0A" + "https://carrefour.friendo.com.tw/2019CNY/";
        } else {
            vm.lineHref = "https://lineit.line.me/share/ui?url=https://carrefour.friendo.com.tw/2019CNY/&text=新年快樂！我剛剛看家樂福3%2B1支賀歲片，可以抽一年份電影票！在電影場景找彩蛋再抽50吋電視和超過500張家樂福即享券！%0D一起看電影抽大獎 >";
        }
    }
})


Vue.component('comingsoon', {
    template: "#comingsoon",
    props: ['StartDate', 'mode'],
    data: function () {
        return {
            comingsoon: false,
            date: {
                total: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            }
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
        // vm.state_check().then(function (res) {
        //     var data = res.Data;
        //     vm.start_date = data.StartDateTime;
        var timeinterval = setInterval(function () {
            var t = Date.parse(new Date(vm.StartDate)) - Date.parse(new Date());
            var seconds = Math.floor((t / 1000) % 60);
            var minutes = Math.floor((t / 1000 / 60) % 60);
            var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            var days = Math.floor(t / (1000 * 60 * 60 * 24));
            vm.date = {
                'total': t,
                'days': padLeft(days, 2),
                'hours': padLeft(hours, 2),
                'minutes': padLeft(minutes, 2),
                'seconds': padLeft(seconds, 2)
            };
            if (vm.date.total <= 0 || vm.mode == "Testing") {
                clearInterval(timeinterval);
                vm.comingsoon = false;
            } else {
                vm.comingsoon = true;
            }
        }, 1000);
        // });
    },
})
