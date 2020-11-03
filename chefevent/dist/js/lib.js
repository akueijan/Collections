"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

;

(function ($) {
  $.fn.menu = function (opts) {
    // default configuration
    var config = $.extend({}, {
      opt1: null
    }, opts); // main function

    function init(obj) {
      var dObj = $(obj);
      var dMenulink = dObj.find('.nav-btn');
      var dAllLink = dObj.find('.nav-menu a');
      var dMenuClose = dObj.find('.nav-close');
      dMenulink.click(function () {
        dObj.toggleClass('nav--active');
        $('body').toggleClass('_freeze');
      });
      dMenuClose.click(function () {
        dObj.removeClass("nav--active");
        $('body').removeClass('_freeze');
      });
      dAllLink.click(function () {
        dObj.removeClass('nav--active');
        $('body').removeClass('_freeze');
      });
    } // initialize every element


    return this.each(function () {
      init($(this));
    });
  }; // start

})(jQuery);

;

(function ($) {
  $.fn.loadpage = function (action, opts) {
    action = action ? action : "init";
    var progressValue = 0;
    var loadHtml = ['<div class="mdLoading">', '    <div class="loadingBox">', '        <img class="loadpic" src="images/load-pic.gif">', // '        <div class="progressBar">',
    // '            <div class="progress js-bar" style="width:0"></div>',
    // '        </div>',
    '    </div>', '</div>'].join('');
    var dLoad, dCount, dBar;
    var config = $.extend({
      async: false
    }, opts);

    function init(obj) {
      $(loadHtml).appendTo('body');
      dLoad = obj.find('.mdLoading');
      dCount = dLoad.find('.js-count');
      dBar = dLoad.find('.js-bar');
      return new Promise(function (resolve, reject) {
        if (!config.async) {
          var queue = new createjs.LoadQueue();
          queue.setMaxConnections(200);
          var loadArray = [];
          obj.find("img").each(function (i) {
            loadArray.push({
              id: i,
              src: $(this).attr("src")
            });
          });
          queue.loadManifest(loadArray);

          var handleComplete = function handleComplete() {
            $(window).trigger("loadCompleted");
            $('.js-wrap').css({
              'visibility': 'visible'
            });
            TweenMax.fromTo(dLoad, 0.5, {
              opacity: 1
            }, {
              delay: .8,
              opacity: 0,
              ease: Power4.easeOut,
              onComplete: function onComplete() {
                dLoad.remove();
                resolve(true);
              }
            });
          };

          queue.on("progress", function () {
            var procValue = Math.min(Math.ceil(queue.progress * 100), 100);
            dCount.text(procValue + '%');
            dBar.css({
              'width': procValue + '%'
            });
          });
          queue.on("complete", handleComplete, this);
        } else {
          resolve(true);
        }
      });
    }

    if (action == 'init') {
      return init($(this));
    }

    if (action == 'close') {
      dLoad = $(this).find('.mdLoading');
      dCount = dLoad.find('.js-count');
      dBar = dLoad.find('.js-bar');
      dCount.text('100%');
      dBar.css({
        'width': '100%'
      });
      TweenMax.fromTo(dLoad, 0.5, {
        opacity: 1
      }, {
        delay: .8,
        opacity: 0,
        ease: Power4.easeOut,
        onComplete: function onComplete() {
          dLoad.remove();
        }
      });
    }
  };
})(jQuery);

"use strict";

!function (l, m) {
  l(function () {
    "use strict";

    function n(v, w) {
      return null != v && null != w && v.toLowerCase() === w.toLowerCase();
    }

    function o(v, w) {
      var x,
          y,
          z = v.length;
      if (!z || !w) return !1;

      for (x = w.toLowerCase(), y = 0; y < z; ++y) {
        if (x === v[y].toLowerCase()) return !0;
      }

      return !1;
    }

    function p(v) {
      for (var w in v) {
        u.call(v, w) && (v[w] = new RegExp(v[w], "i"));
      }
    }

    function q(v) {
      return (v || "").substr(0, 500);
    }

    function r(v, w) {
      this.ua = q(v), this._cache = {}, this.maxPhoneWidth = w || 600;
    }

    var s = {
      mobileDetectRules: {
        phones: {
          iPhone: "\\biPhone\\b|\\biPod\\b",
          BlackBerry: "BlackBerry|\\bBB10\\b|rim[0-9]+",
          HTC: "HTC|HTC.*(Sensation|Evo|Vision|Explorer|6800|8100|8900|A7272|S510e|C110e|Legend|Desire|T8282)|APX515CKT|Qtek9090|APA9292KT|HD_mini|Sensation.*Z710e|PG86100|Z715e|Desire.*(A8181|HD)|ADR6200|ADR6400L|ADR6425|001HT|Inspire 4G|Android.*\\bEVO\\b|T-Mobile G1|Z520m|Android [0-9.]+; Pixel",
          Nexus: "Nexus One|Nexus S|Galaxy.*Nexus|Android.*Nexus.*Mobile|Nexus 4|Nexus 5|Nexus 6",
          Dell: "Dell[;]? (Streak|Aero|Venue|Venue Pro|Flash|Smoke|Mini 3iX)|XCD28|XCD35|\\b001DL\\b|\\b101DL\\b|\\bGS01\\b",
          Motorola: "Motorola|DROIDX|DROID BIONIC|\\bDroid\\b.*Build|Android.*Xoom|HRI39|MOT-|A1260|A1680|A555|A853|A855|A953|A955|A956|Motorola.*ELECTRIFY|Motorola.*i1|i867|i940|MB200|MB300|MB501|MB502|MB508|MB511|MB520|MB525|MB526|MB611|MB612|MB632|MB810|MB855|MB860|MB861|MB865|MB870|ME501|ME502|ME511|ME525|ME600|ME632|ME722|ME811|ME860|ME863|ME865|MT620|MT710|MT716|MT720|MT810|MT870|MT917|Motorola.*TITANIUM|WX435|WX445|XT300|XT301|XT311|XT316|XT317|XT319|XT320|XT390|XT502|XT530|XT531|XT532|XT535|XT603|XT610|XT611|XT615|XT681|XT701|XT702|XT711|XT720|XT800|XT806|XT860|XT862|XT875|XT882|XT883|XT894|XT901|XT907|XT909|XT910|XT912|XT928|XT926|XT915|XT919|XT925|XT1021|\\bMoto E\\b|XT1068|XT1092|XT1052",
          Samsung: "\\bSamsung\\b|SM-G950F|SM-G955F|SM-G9250|GT-19300|SGH-I337|BGT-S5230|GT-B2100|GT-B2700|GT-B2710|GT-B3210|GT-B3310|GT-B3410|GT-B3730|GT-B3740|GT-B5510|GT-B5512|GT-B5722|GT-B6520|GT-B7300|GT-B7320|GT-B7330|GT-B7350|GT-B7510|GT-B7722|GT-B7800|GT-C3010|GT-C3011|GT-C3060|GT-C3200|GT-C3212|GT-C3212I|GT-C3262|GT-C3222|GT-C3300|GT-C3300K|GT-C3303|GT-C3303K|GT-C3310|GT-C3322|GT-C3330|GT-C3350|GT-C3500|GT-C3510|GT-C3530|GT-C3630|GT-C3780|GT-C5010|GT-C5212|GT-C6620|GT-C6625|GT-C6712|GT-E1050|GT-E1070|GT-E1075|GT-E1080|GT-E1081|GT-E1085|GT-E1087|GT-E1100|GT-E1107|GT-E1110|GT-E1120|GT-E1125|GT-E1130|GT-E1160|GT-E1170|GT-E1175|GT-E1180|GT-E1182|GT-E1200|GT-E1210|GT-E1225|GT-E1230|GT-E1390|GT-E2100|GT-E2120|GT-E2121|GT-E2152|GT-E2220|GT-E2222|GT-E2230|GT-E2232|GT-E2250|GT-E2370|GT-E2550|GT-E2652|GT-E3210|GT-E3213|GT-I5500|GT-I5503|GT-I5700|GT-I5800|GT-I5801|GT-I6410|GT-I6420|GT-I7110|GT-I7410|GT-I7500|GT-I8000|GT-I8150|GT-I8160|GT-I8190|GT-I8320|GT-I8330|GT-I8350|GT-I8530|GT-I8700|GT-I8703|GT-I8910|GT-I9000|GT-I9001|GT-I9003|GT-I9010|GT-I9020|GT-I9023|GT-I9070|GT-I9082|GT-I9100|GT-I9103|GT-I9220|GT-I9250|GT-I9300|GT-I9305|GT-I9500|GT-I9505|GT-M3510|GT-M5650|GT-M7500|GT-M7600|GT-M7603|GT-M8800|GT-M8910|GT-N7000|GT-S3110|GT-S3310|GT-S3350|GT-S3353|GT-S3370|GT-S3650|GT-S3653|GT-S3770|GT-S3850|GT-S5210|GT-S5220|GT-S5229|GT-S5230|GT-S5233|GT-S5250|GT-S5253|GT-S5260|GT-S5263|GT-S5270|GT-S5300|GT-S5330|GT-S5350|GT-S5360|GT-S5363|GT-S5369|GT-S5380|GT-S5380D|GT-S5560|GT-S5570|GT-S5600|GT-S5603|GT-S5610|GT-S5620|GT-S5660|GT-S5670|GT-S5690|GT-S5750|GT-S5780|GT-S5830|GT-S5839|GT-S6102|GT-S6500|GT-S7070|GT-S7200|GT-S7220|GT-S7230|GT-S7233|GT-S7250|GT-S7500|GT-S7530|GT-S7550|GT-S7562|GT-S7710|GT-S8000|GT-S8003|GT-S8500|GT-S8530|GT-S8600|SCH-A310|SCH-A530|SCH-A570|SCH-A610|SCH-A630|SCH-A650|SCH-A790|SCH-A795|SCH-A850|SCH-A870|SCH-A890|SCH-A930|SCH-A950|SCH-A970|SCH-A990|SCH-I100|SCH-I110|SCH-I400|SCH-I405|SCH-I500|SCH-I510|SCH-I515|SCH-I600|SCH-I730|SCH-I760|SCH-I770|SCH-I830|SCH-I910|SCH-I920|SCH-I959|SCH-LC11|SCH-N150|SCH-N300|SCH-R100|SCH-R300|SCH-R351|SCH-R400|SCH-R410|SCH-T300|SCH-U310|SCH-U320|SCH-U350|SCH-U360|SCH-U365|SCH-U370|SCH-U380|SCH-U410|SCH-U430|SCH-U450|SCH-U460|SCH-U470|SCH-U490|SCH-U540|SCH-U550|SCH-U620|SCH-U640|SCH-U650|SCH-U660|SCH-U700|SCH-U740|SCH-U750|SCH-U810|SCH-U820|SCH-U900|SCH-U940|SCH-U960|SCS-26UC|SGH-A107|SGH-A117|SGH-A127|SGH-A137|SGH-A157|SGH-A167|SGH-A177|SGH-A187|SGH-A197|SGH-A227|SGH-A237|SGH-A257|SGH-A437|SGH-A517|SGH-A597|SGH-A637|SGH-A657|SGH-A667|SGH-A687|SGH-A697|SGH-A707|SGH-A717|SGH-A727|SGH-A737|SGH-A747|SGH-A767|SGH-A777|SGH-A797|SGH-A817|SGH-A827|SGH-A837|SGH-A847|SGH-A867|SGH-A877|SGH-A887|SGH-A897|SGH-A927|SGH-B100|SGH-B130|SGH-B200|SGH-B220|SGH-C100|SGH-C110|SGH-C120|SGH-C130|SGH-C140|SGH-C160|SGH-C170|SGH-C180|SGH-C200|SGH-C207|SGH-C210|SGH-C225|SGH-C230|SGH-C417|SGH-C450|SGH-D307|SGH-D347|SGH-D357|SGH-D407|SGH-D415|SGH-D780|SGH-D807|SGH-D980|SGH-E105|SGH-E200|SGH-E315|SGH-E316|SGH-E317|SGH-E335|SGH-E590|SGH-E635|SGH-E715|SGH-E890|SGH-F300|SGH-F480|SGH-I200|SGH-I300|SGH-I320|SGH-I550|SGH-I577|SGH-I600|SGH-I607|SGH-I617|SGH-I627|SGH-I637|SGH-I677|SGH-I700|SGH-I717|SGH-I727|SGH-i747M|SGH-I777|SGH-I780|SGH-I827|SGH-I847|SGH-I857|SGH-I896|SGH-I897|SGH-I900|SGH-I907|SGH-I917|SGH-I927|SGH-I937|SGH-I997|SGH-J150|SGH-J200|SGH-L170|SGH-L700|SGH-M110|SGH-M150|SGH-M200|SGH-N105|SGH-N500|SGH-N600|SGH-N620|SGH-N625|SGH-N700|SGH-N710|SGH-P107|SGH-P207|SGH-P300|SGH-P310|SGH-P520|SGH-P735|SGH-P777|SGH-Q105|SGH-R210|SGH-R220|SGH-R225|SGH-S105|SGH-S307|SGH-T109|SGH-T119|SGH-T139|SGH-T209|SGH-T219|SGH-T229|SGH-T239|SGH-T249|SGH-T259|SGH-T309|SGH-T319|SGH-T329|SGH-T339|SGH-T349|SGH-T359|SGH-T369|SGH-T379|SGH-T409|SGH-T429|SGH-T439|SGH-T459|SGH-T469|SGH-T479|SGH-T499|SGH-T509|SGH-T519|SGH-T539|SGH-T559|SGH-T589|SGH-T609|SGH-T619|SGH-T629|SGH-T639|SGH-T659|SGH-T669|SGH-T679|SGH-T709|SGH-T719|SGH-T729|SGH-T739|SGH-T746|SGH-T749|SGH-T759|SGH-T769|SGH-T809|SGH-T819|SGH-T839|SGH-T919|SGH-T929|SGH-T939|SGH-T959|SGH-T989|SGH-U100|SGH-U200|SGH-U800|SGH-V205|SGH-V206|SGH-X100|SGH-X105|SGH-X120|SGH-X140|SGH-X426|SGH-X427|SGH-X475|SGH-X495|SGH-X497|SGH-X507|SGH-X600|SGH-X610|SGH-X620|SGH-X630|SGH-X700|SGH-X820|SGH-X890|SGH-Z130|SGH-Z150|SGH-Z170|SGH-ZX10|SGH-ZX20|SHW-M110|SPH-A120|SPH-A400|SPH-A420|SPH-A460|SPH-A500|SPH-A560|SPH-A600|SPH-A620|SPH-A660|SPH-A700|SPH-A740|SPH-A760|SPH-A790|SPH-A800|SPH-A820|SPH-A840|SPH-A880|SPH-A900|SPH-A940|SPH-A960|SPH-D600|SPH-D700|SPH-D710|SPH-D720|SPH-I300|SPH-I325|SPH-I330|SPH-I350|SPH-I500|SPH-I600|SPH-I700|SPH-L700|SPH-M100|SPH-M220|SPH-M240|SPH-M300|SPH-M305|SPH-M320|SPH-M330|SPH-M350|SPH-M360|SPH-M370|SPH-M380|SPH-M510|SPH-M540|SPH-M550|SPH-M560|SPH-M570|SPH-M580|SPH-M610|SPH-M620|SPH-M630|SPH-M800|SPH-M810|SPH-M850|SPH-M900|SPH-M910|SPH-M920|SPH-M930|SPH-N100|SPH-N200|SPH-N240|SPH-N300|SPH-N400|SPH-Z400|SWC-E100|SCH-i909|GT-N7100|GT-N7105|SCH-I535|SM-N900A|SGH-I317|SGH-T999L|GT-S5360B|GT-I8262|GT-S6802|GT-S6312|GT-S6310|GT-S5312|GT-S5310|GT-I9105|GT-I8510|GT-S6790N|SM-G7105|SM-N9005|GT-S5301|GT-I9295|GT-I9195|SM-C101|GT-S7392|GT-S7560|GT-B7610|GT-I5510|GT-S7582|GT-S7530E|GT-I8750|SM-G9006V|SM-G9008V|SM-G9009D|SM-G900A|SM-G900D|SM-G900F|SM-G900H|SM-G900I|SM-G900J|SM-G900K|SM-G900L|SM-G900M|SM-G900P|SM-G900R4|SM-G900S|SM-G900T|SM-G900V|SM-G900W8|SHV-E160K|SCH-P709|SCH-P729|SM-T2558|GT-I9205|SM-G9350|SM-J120F|SM-G920F|SM-G920V|SM-G930F|SM-N910C|SM-A310F|GT-I9190|SM-J500FN|SM-G903F|SM-J330F",
          LG: "\\bLG\\b;|LG[- ]?(C800|C900|E400|E610|E900|E-900|F160|F180K|F180L|F180S|730|855|L160|LS740|LS840|LS970|LU6200|MS690|MS695|MS770|MS840|MS870|MS910|P500|P700|P705|VM696|AS680|AS695|AX840|C729|E970|GS505|272|C395|E739BK|E960|L55C|L75C|LS696|LS860|P769BK|P350|P500|P509|P870|UN272|US730|VS840|VS950|LN272|LN510|LS670|LS855|LW690|MN270|MN510|P509|P769|P930|UN200|UN270|UN510|UN610|US670|US740|US760|UX265|UX840|VN271|VN530|VS660|VS700|VS740|VS750|VS910|VS920|VS930|VX9200|VX11000|AX840A|LW770|P506|P925|P999|E612|D955|D802|MS323|M257)",
          Sony: "SonyST|SonyLT|SonyEricsson|SonyEricssonLT15iv|LT18i|E10i|LT28h|LT26w|SonyEricssonMT27i|C5303|C6902|C6903|C6906|C6943|D2533",
          Asus: "Asus.*Galaxy|PadFone.*Mobile",
          NokiaLumia: "Lumia [0-9]{3,4}",
          Micromax: "Micromax.*\\b(A210|A92|A88|A72|A111|A110Q|A115|A116|A110|A90S|A26|A51|A35|A54|A25|A27|A89|A68|A65|A57|A90)\\b",
          Palm: "PalmSource|Palm",
          Vertu: "Vertu|Vertu.*Ltd|Vertu.*Ascent|Vertu.*Ayxta|Vertu.*Constellation(F|Quest)?|Vertu.*Monika|Vertu.*Signature",
          Pantech: "PANTECH|IM-A850S|IM-A840S|IM-A830L|IM-A830K|IM-A830S|IM-A820L|IM-A810K|IM-A810S|IM-A800S|IM-T100K|IM-A725L|IM-A780L|IM-A775C|IM-A770K|IM-A760S|IM-A750K|IM-A740S|IM-A730S|IM-A720L|IM-A710K|IM-A690L|IM-A690S|IM-A650S|IM-A630K|IM-A600S|VEGA PTL21|PT003|P8010|ADR910L|P6030|P6020|P9070|P4100|P9060|P5000|CDM8992|TXT8045|ADR8995|IS11PT|P2030|P6010|P8000|PT002|IS06|CDM8999|P9050|PT001|TXT8040|P2020|P9020|P2000|P7040|P7000|C790",
          Fly: "IQ230|IQ444|IQ450|IQ440|IQ442|IQ441|IQ245|IQ256|IQ236|IQ255|IQ235|IQ245|IQ275|IQ240|IQ285|IQ280|IQ270|IQ260|IQ250",
          Wiko: "KITE 4G|HIGHWAY|GETAWAY|STAIRWAY|DARKSIDE|DARKFULL|DARKNIGHT|DARKMOON|SLIDE|WAX 4G|RAINBOW|BLOOM|SUNSET|GOA(?!nna)|LENNY|BARRY|IGGY|OZZY|CINK FIVE|CINK PEAX|CINK PEAX 2|CINK SLIM|CINK SLIM 2|CINK +|CINK KING|CINK PEAX|CINK SLIM|SUBLIM",
          iMobile: "i-mobile (IQ|i-STYLE|idea|ZAA|Hitz)",
          SimValley: "\\b(SP-80|XT-930|SX-340|XT-930|SX-310|SP-360|SP60|SPT-800|SP-120|SPT-800|SP-140|SPX-5|SPX-8|SP-100|SPX-8|SPX-12)\\b",
          Wolfgang: "AT-B24D|AT-AS50HD|AT-AS40W|AT-AS55HD|AT-AS45q2|AT-B26D|AT-AS50Q",
          Alcatel: "Alcatel",
          Nintendo: "Nintendo (3DS|Switch)",
          Amoi: "Amoi",
          INQ: "INQ",
          GenericPhone: "Tapatalk|PDA;|SAGEM|\\bmmp\\b|pocket|\\bpsp\\b|symbian|Smartphone|smartfon|treo|up.browser|up.link|vodafone|\\bwap\\b|nokia|Series40|Series60|S60|SonyEricsson|N900|MAUI.*WAP.*Browser"
        },
        tablets: {
          iPad: "iPad|iPad.*Mobile",
          NexusTablet: "Android.*Nexus[\\s]+(7|9|10)",
          GoogleTablet: "Android.*Pixel C",
          SamsungTablet: "SAMSUNG.*Tablet|Galaxy.*Tab|SC-01C|GT-P1000|GT-P1003|GT-P1010|GT-P3105|GT-P6210|GT-P6800|GT-P6810|GT-P7100|GT-P7300|GT-P7310|GT-P7500|GT-P7510|SCH-I800|SCH-I815|SCH-I905|SGH-I957|SGH-I987|SGH-T849|SGH-T859|SGH-T869|SPH-P100|GT-P3100|GT-P3108|GT-P3110|GT-P5100|GT-P5110|GT-P6200|GT-P7320|GT-P7511|GT-N8000|GT-P8510|SGH-I497|SPH-P500|SGH-T779|SCH-I705|SCH-I915|GT-N8013|GT-P3113|GT-P5113|GT-P8110|GT-N8010|GT-N8005|GT-N8020|GT-P1013|GT-P6201|GT-P7501|GT-N5100|GT-N5105|GT-N5110|SHV-E140K|SHV-E140L|SHV-E140S|SHV-E150S|SHV-E230K|SHV-E230L|SHV-E230S|SHW-M180K|SHW-M180L|SHW-M180S|SHW-M180W|SHW-M300W|SHW-M305W|SHW-M380K|SHW-M380S|SHW-M380W|SHW-M430W|SHW-M480K|SHW-M480S|SHW-M480W|SHW-M485W|SHW-M486W|SHW-M500W|GT-I9228|SCH-P739|SCH-I925|GT-I9200|GT-P5200|GT-P5210|GT-P5210X|SM-T311|SM-T310|SM-T310X|SM-T210|SM-T210R|SM-T211|SM-P600|SM-P601|SM-P605|SM-P900|SM-P901|SM-T217|SM-T217A|SM-T217S|SM-P6000|SM-T3100|SGH-I467|XE500|SM-T110|GT-P5220|GT-I9200X|GT-N5110X|GT-N5120|SM-P905|SM-T111|SM-T2105|SM-T315|SM-T320|SM-T320X|SM-T321|SM-T520|SM-T525|SM-T530NU|SM-T230NU|SM-T330NU|SM-T900|XE500T1C|SM-P605V|SM-P905V|SM-T337V|SM-T537V|SM-T707V|SM-T807V|SM-P600X|SM-P900X|SM-T210X|SM-T230|SM-T230X|SM-T325|GT-P7503|SM-T531|SM-T330|SM-T530|SM-T705|SM-T705C|SM-T535|SM-T331|SM-T800|SM-T700|SM-T537|SM-T807|SM-P907A|SM-T337A|SM-T537A|SM-T707A|SM-T807A|SM-T237|SM-T807P|SM-P607T|SM-T217T|SM-T337T|SM-T807T|SM-T116NQ|SM-T116BU|SM-P550|SM-T350|SM-T550|SM-T9000|SM-P9000|SM-T705Y|SM-T805|GT-P3113|SM-T710|SM-T810|SM-T815|SM-T360|SM-T533|SM-T113|SM-T335|SM-T715|SM-T560|SM-T670|SM-T677|SM-T377|SM-T567|SM-T357T|SM-T555|SM-T561|SM-T713|SM-T719|SM-T813|SM-T819|SM-T580|SM-T355Y?|SM-T280|SM-T817A|SM-T820|SM-W700|SM-P580|SM-T587|SM-P350|SM-P555M|SM-P355M|SM-T113NU|SM-T815Y|SM-T585|SM-T285|SM-T825|SM-W708",
          Kindle: "Kindle|Silk.*Accelerated|Android.*\\b(KFOT|KFTT|KFJWI|KFJWA|KFOTE|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|WFJWAE|KFSAWA|KFSAWI|KFASWI|KFARWI|KFFOWI|KFGIWI|KFMEWI)\\b|Android.*Silk/[0-9.]+ like Chrome/[0-9.]+ (?!Mobile)",
          SurfaceTablet: "Windows NT [0-9.]+; ARM;.*(Tablet|ARMBJS)",
          HPTablet: "HP Slate (7|8|10)|HP ElitePad 900|hp-tablet|EliteBook.*Touch|HP 8|Slate 21|HP SlateBook 10",
          AsusTablet: "^.*PadFone((?!Mobile).)*$|Transformer|TF101|TF101G|TF300T|TF300TG|TF300TL|TF700T|TF700KL|TF701T|TF810C|ME171|ME301T|ME302C|ME371MG|ME370T|ME372MG|ME172V|ME173X|ME400C|Slider SL101|\\bK00F\\b|\\bK00C\\b|\\bK00E\\b|\\bK00L\\b|TX201LA|ME176C|ME102A|\\bM80TA\\b|ME372CL|ME560CG|ME372CG|ME302KL| K010 | K011 | K017 | K01E |ME572C|ME103K|ME170C|ME171C|\\bME70C\\b|ME581C|ME581CL|ME8510C|ME181C|P01Y|PO1MA|P01Z|\\bP027\\b|\\bP024\\b|\\bP00C\\b",
          BlackBerryTablet: "PlayBook|RIM Tablet",
          HTCtablet: "HTC_Flyer_P512|HTC Flyer|HTC Jetstream|HTC-P715a|HTC EVO View 4G|PG41200|PG09410",
          MotorolaTablet: "xoom|sholest|MZ615|MZ605|MZ505|MZ601|MZ602|MZ603|MZ604|MZ606|MZ607|MZ608|MZ609|MZ615|MZ616|MZ617",
          NookTablet: "Android.*Nook|NookColor|nook browser|BNRV200|BNRV200A|BNTV250|BNTV250A|BNTV400|BNTV600|LogicPD Zoom2",
          AcerTablet: "Android.*; \\b(A100|A101|A110|A200|A210|A211|A500|A501|A510|A511|A700|A701|W500|W500P|W501|W501P|W510|W511|W700|G100|G100W|B1-A71|B1-710|B1-711|A1-810|A1-811|A1-830)\\b|W3-810|\\bA3-A10\\b|\\bA3-A11\\b|\\bA3-A20\\b|\\bA3-A30",
          ToshibaTablet: "Android.*(AT100|AT105|AT200|AT205|AT270|AT275|AT300|AT305|AT1S5|AT500|AT570|AT700|AT830)|TOSHIBA.*FOLIO",
          LGTablet: "\\bL-06C|LG-V909|LG-V900|LG-V700|LG-V510|LG-V500|LG-V410|LG-V400|LG-VK810\\b",
          FujitsuTablet: "Android.*\\b(F-01D|F-02F|F-05E|F-10D|M532|Q572)\\b",
          PrestigioTablet: "PMP3170B|PMP3270B|PMP3470B|PMP7170B|PMP3370B|PMP3570C|PMP5870C|PMP3670B|PMP5570C|PMP5770D|PMP3970B|PMP3870C|PMP5580C|PMP5880D|PMP5780D|PMP5588C|PMP7280C|PMP7280C3G|PMP7280|PMP7880D|PMP5597D|PMP5597|PMP7100D|PER3464|PER3274|PER3574|PER3884|PER5274|PER5474|PMP5097CPRO|PMP5097|PMP7380D|PMP5297C|PMP5297C_QUAD|PMP812E|PMP812E3G|PMP812F|PMP810E|PMP880TD|PMT3017|PMT3037|PMT3047|PMT3057|PMT7008|PMT5887|PMT5001|PMT5002",
          LenovoTablet: "Lenovo TAB|Idea(Tab|Pad)( A1|A10| K1|)|ThinkPad([ ]+)?Tablet|YT3-850M|YT3-X90L|YT3-X90F|YT3-X90X|Lenovo.*(S2109|S2110|S5000|S6000|K3011|A3000|A3500|A1000|A2107|A2109|A1107|A5500|A7600|B6000|B8000|B8080)(-|)(FL|F|HV|H|)|TB-X103F|TB-X304F|TB-X304L|TB-8703F|Tab2A7-10F",
          DellTablet: "Venue 11|Venue 8|Venue 7|Dell Streak 10|Dell Streak 7",
          YarvikTablet: "Android.*\\b(TAB210|TAB211|TAB224|TAB250|TAB260|TAB264|TAB310|TAB360|TAB364|TAB410|TAB411|TAB420|TAB424|TAB450|TAB460|TAB461|TAB464|TAB465|TAB467|TAB468|TAB07-100|TAB07-101|TAB07-150|TAB07-151|TAB07-152|TAB07-200|TAB07-201-3G|TAB07-210|TAB07-211|TAB07-212|TAB07-214|TAB07-220|TAB07-400|TAB07-485|TAB08-150|TAB08-200|TAB08-201-3G|TAB08-201-30|TAB09-100|TAB09-211|TAB09-410|TAB10-150|TAB10-201|TAB10-211|TAB10-400|TAB10-410|TAB13-201|TAB274EUK|TAB275EUK|TAB374EUK|TAB462EUK|TAB474EUK|TAB9-200)\\b",
          MedionTablet: "Android.*\\bOYO\\b|LIFE.*(P9212|P9514|P9516|S9512)|LIFETAB",
          ArnovaTablet: "97G4|AN10G2|AN7bG3|AN7fG3|AN8G3|AN8cG3|AN7G3|AN9G3|AN7dG3|AN7dG3ST|AN7dG3ChildPad|AN10bG3|AN10bG3DT|AN9G2",
          IntensoTablet: "INM8002KP|INM1010FP|INM805ND|Intenso Tab|TAB1004",
          IRUTablet: "M702pro",
          MegafonTablet: "MegaFon V9|\\bZTE V9\\b|Android.*\\bMT7A\\b",
          EbodaTablet: "E-Boda (Supreme|Impresspeed|Izzycomm|Essential)",
          AllViewTablet: "Allview.*(Viva|Alldro|City|Speed|All TV|Frenzy|Quasar|Shine|TX1|AX1|AX2)",
          ArchosTablet: "\\b(101G9|80G9|A101IT)\\b|Qilive 97R|Archos5|\\bARCHOS (70|79|80|90|97|101|FAMILYPAD|)(b|c|)(G10| Cobalt| TITANIUM(HD|)| Xenon| Neon|XSK| 2| XS 2| PLATINUM| CARBON|GAMEPAD)\\b",
          AinolTablet: "NOVO7|NOVO8|NOVO10|Novo7Aurora|Novo7Basic|NOVO7PALADIN|novo9-Spark",
          NokiaLumiaTablet: "Lumia 2520",
          SonyTablet: "Sony.*Tablet|Xperia Tablet|Sony Tablet S|SO-03E|SGPT12|SGPT13|SGPT114|SGPT121|SGPT122|SGPT123|SGPT111|SGPT112|SGPT113|SGPT131|SGPT132|SGPT133|SGPT211|SGPT212|SGPT213|SGP311|SGP312|SGP321|EBRD1101|EBRD1102|EBRD1201|SGP351|SGP341|SGP511|SGP512|SGP521|SGP541|SGP551|SGP621|SGP612|SOT31",
          PhilipsTablet: "\\b(PI2010|PI3000|PI3100|PI3105|PI3110|PI3205|PI3210|PI3900|PI4010|PI7000|PI7100)\\b",
          CubeTablet: "Android.*(K8GT|U9GT|U10GT|U16GT|U17GT|U18GT|U19GT|U20GT|U23GT|U30GT)|CUBE U8GT",
          CobyTablet: "MID1042|MID1045|MID1125|MID1126|MID7012|MID7014|MID7015|MID7034|MID7035|MID7036|MID7042|MID7048|MID7127|MID8042|MID8048|MID8127|MID9042|MID9740|MID9742|MID7022|MID7010",
          MIDTablet: "M9701|M9000|M9100|M806|M1052|M806|T703|MID701|MID713|MID710|MID727|MID760|MID830|MID728|MID933|MID125|MID810|MID732|MID120|MID930|MID800|MID731|MID900|MID100|MID820|MID735|MID980|MID130|MID833|MID737|MID960|MID135|MID860|MID736|MID140|MID930|MID835|MID733|MID4X10",
          MSITablet: "MSI \\b(Primo 73K|Primo 73L|Primo 81L|Primo 77|Primo 93|Primo 75|Primo 76|Primo 73|Primo 81|Primo 91|Primo 90|Enjoy 71|Enjoy 7|Enjoy 10)\\b",
          SMiTTablet: "Android.*(\\bMID\\b|MID-560|MTV-T1200|MTV-PND531|MTV-P1101|MTV-PND530)",
          RockChipTablet: "Android.*(RK2818|RK2808A|RK2918|RK3066)|RK2738|RK2808A",
          FlyTablet: "IQ310|Fly Vision",
          bqTablet: "Android.*(bq)?.*(Elcano|Curie|Edison|Maxwell|Kepler|Pascal|Tesla|Hypatia|Platon|Newton|Livingstone|Cervantes|Avant|Aquaris ([E|M]10|M8))|Maxwell.*Lite|Maxwell.*Plus",
          HuaweiTablet: "MediaPad|MediaPad 7 Youth|IDEOS S7|S7-201c|S7-202u|S7-101|S7-103|S7-104|S7-105|S7-106|S7-201|S7-Slim|M2-A01L|BAH-L09|BAH-W09",
          NecTablet: "\\bN-06D|\\bN-08D",
          PantechTablet: "Pantech.*P4100",
          BronchoTablet: "Broncho.*(N701|N708|N802|a710)",
          VersusTablet: "TOUCHPAD.*[78910]|\\bTOUCHTAB\\b",
          ZyncTablet: "z1000|Z99 2G|z99|z930|z999|z990|z909|Z919|z900",
          PositivoTablet: "TB07STA|TB10STA|TB07FTA|TB10FTA",
          NabiTablet: "Android.*\\bNabi",
          KoboTablet: "Kobo Touch|\\bK080\\b|\\bVox\\b Build|\\bArc\\b Build",
          DanewTablet: "DSlide.*\\b(700|701R|702|703R|704|802|970|971|972|973|974|1010|1012)\\b",
          TexetTablet: "NaviPad|TB-772A|TM-7045|TM-7055|TM-9750|TM-7016|TM-7024|TM-7026|TM-7041|TM-7043|TM-7047|TM-8041|TM-9741|TM-9747|TM-9748|TM-9751|TM-7022|TM-7021|TM-7020|TM-7011|TM-7010|TM-7023|TM-7025|TM-7037W|TM-7038W|TM-7027W|TM-9720|TM-9725|TM-9737W|TM-1020|TM-9738W|TM-9740|TM-9743W|TB-807A|TB-771A|TB-727A|TB-725A|TB-719A|TB-823A|TB-805A|TB-723A|TB-715A|TB-707A|TB-705A|TB-709A|TB-711A|TB-890HD|TB-880HD|TB-790HD|TB-780HD|TB-770HD|TB-721HD|TB-710HD|TB-434HD|TB-860HD|TB-840HD|TB-760HD|TB-750HD|TB-740HD|TB-730HD|TB-722HD|TB-720HD|TB-700HD|TB-500HD|TB-470HD|TB-431HD|TB-430HD|TB-506|TB-504|TB-446|TB-436|TB-416|TB-146SE|TB-126SE",
          PlaystationTablet: "Playstation.*(Portable|Vita)",
          TrekstorTablet: "ST10416-1|VT10416-1|ST70408-1|ST702xx-1|ST702xx-2|ST80208|ST97216|ST70104-2|VT10416-2|ST10216-2A|SurfTab",
          PyleAudioTablet: "\\b(PTBL10CEU|PTBL10C|PTBL72BC|PTBL72BCEU|PTBL7CEU|PTBL7C|PTBL92BC|PTBL92BCEU|PTBL9CEU|PTBL9CUK|PTBL9C)\\b",
          AdvanTablet: "Android.* \\b(E3A|T3X|T5C|T5B|T3E|T3C|T3B|T1J|T1F|T2A|T1H|T1i|E1C|T1-E|T5-A|T4|E1-B|T2Ci|T1-B|T1-D|O1-A|E1-A|T1-A|T3A|T4i)\\b ",
          DanyTechTablet: "Genius Tab G3|Genius Tab S2|Genius Tab Q3|Genius Tab G4|Genius Tab Q4|Genius Tab G-II|Genius TAB GII|Genius TAB GIII|Genius Tab S1",
          GalapadTablet: "Android.*\\bG1\\b",
          MicromaxTablet: "Funbook|Micromax.*\\b(P250|P560|P360|P362|P600|P300|P350|P500|P275)\\b",
          KarbonnTablet: "Android.*\\b(A39|A37|A34|ST8|ST10|ST7|Smart Tab3|Smart Tab2)\\b",
          AllFineTablet: "Fine7 Genius|Fine7 Shine|Fine7 Air|Fine8 Style|Fine9 More|Fine10 Joy|Fine11 Wide",
          PROSCANTablet: "\\b(PEM63|PLT1023G|PLT1041|PLT1044|PLT1044G|PLT1091|PLT4311|PLT4311PL|PLT4315|PLT7030|PLT7033|PLT7033D|PLT7035|PLT7035D|PLT7044K|PLT7045K|PLT7045KB|PLT7071KG|PLT7072|PLT7223G|PLT7225G|PLT7777G|PLT7810K|PLT7849G|PLT7851G|PLT7852G|PLT8015|PLT8031|PLT8034|PLT8036|PLT8080K|PLT8082|PLT8088|PLT8223G|PLT8234G|PLT8235G|PLT8816K|PLT9011|PLT9045K|PLT9233G|PLT9735|PLT9760G|PLT9770G)\\b",
          YONESTablet: "BQ1078|BC1003|BC1077|RK9702|BC9730|BC9001|IT9001|BC7008|BC7010|BC708|BC728|BC7012|BC7030|BC7027|BC7026",
          ChangJiaTablet: "TPC7102|TPC7103|TPC7105|TPC7106|TPC7107|TPC7201|TPC7203|TPC7205|TPC7210|TPC7708|TPC7709|TPC7712|TPC7110|TPC8101|TPC8103|TPC8105|TPC8106|TPC8203|TPC8205|TPC8503|TPC9106|TPC9701|TPC97101|TPC97103|TPC97105|TPC97106|TPC97111|TPC97113|TPC97203|TPC97603|TPC97809|TPC97205|TPC10101|TPC10103|TPC10106|TPC10111|TPC10203|TPC10205|TPC10503",
          GUTablet: "TX-A1301|TX-M9002|Q702|kf026",
          PointOfViewTablet: "TAB-P506|TAB-navi-7-3G-M|TAB-P517|TAB-P-527|TAB-P701|TAB-P703|TAB-P721|TAB-P731N|TAB-P741|TAB-P825|TAB-P905|TAB-P925|TAB-PR945|TAB-PL1015|TAB-P1025|TAB-PI1045|TAB-P1325|TAB-PROTAB[0-9]+|TAB-PROTAB25|TAB-PROTAB26|TAB-PROTAB27|TAB-PROTAB26XL|TAB-PROTAB2-IPS9|TAB-PROTAB30-IPS9|TAB-PROTAB25XXL|TAB-PROTAB26-IPS10|TAB-PROTAB30-IPS10",
          OvermaxTablet: "OV-(SteelCore|NewBase|Basecore|Baseone|Exellen|Quattor|EduTab|Solution|ACTION|BasicTab|TeddyTab|MagicTab|Stream|TB-08|TB-09)|Qualcore 1027",
          HCLTablet: "HCL.*Tablet|Connect-3G-2.0|Connect-2G-2.0|ME Tablet U1|ME Tablet U2|ME Tablet G1|ME Tablet X1|ME Tablet Y2|ME Tablet Sync",
          DPSTablet: "DPS Dream 9|DPS Dual 7",
          VistureTablet: "V97 HD|i75 3G|Visture V4( HD)?|Visture V5( HD)?|Visture V10",
          CrestaTablet: "CTP(-)?810|CTP(-)?818|CTP(-)?828|CTP(-)?838|CTP(-)?888|CTP(-)?978|CTP(-)?980|CTP(-)?987|CTP(-)?988|CTP(-)?989",
          MediatekTablet: "\\bMT8125|MT8389|MT8135|MT8377\\b",
          ConcordeTablet: "Concorde([ ]+)?Tab|ConCorde ReadMan",
          GoCleverTablet: "GOCLEVER TAB|A7GOCLEVER|M1042|M7841|M742|R1042BK|R1041|TAB A975|TAB A7842|TAB A741|TAB A741L|TAB M723G|TAB M721|TAB A1021|TAB I921|TAB R721|TAB I720|TAB T76|TAB R70|TAB R76.2|TAB R106|TAB R83.2|TAB M813G|TAB I721|GCTA722|TAB I70|TAB I71|TAB S73|TAB R73|TAB R74|TAB R93|TAB R75|TAB R76.1|TAB A73|TAB A93|TAB A93.2|TAB T72|TAB R83|TAB R974|TAB R973|TAB A101|TAB A103|TAB A104|TAB A104.2|R105BK|M713G|A972BK|TAB A971|TAB R974.2|TAB R104|TAB R83.3|TAB A1042",
          ModecomTablet: "FreeTAB 9000|FreeTAB 7.4|FreeTAB 7004|FreeTAB 7800|FreeTAB 2096|FreeTAB 7.5|FreeTAB 1014|FreeTAB 1001 |FreeTAB 8001|FreeTAB 9706|FreeTAB 9702|FreeTAB 7003|FreeTAB 7002|FreeTAB 1002|FreeTAB 7801|FreeTAB 1331|FreeTAB 1004|FreeTAB 8002|FreeTAB 8014|FreeTAB 9704|FreeTAB 1003",
          VoninoTablet: "\\b(Argus[ _]?S|Diamond[ _]?79HD|Emerald[ _]?78E|Luna[ _]?70C|Onyx[ _]?S|Onyx[ _]?Z|Orin[ _]?HD|Orin[ _]?S|Otis[ _]?S|SpeedStar[ _]?S|Magnet[ _]?M9|Primus[ _]?94[ _]?3G|Primus[ _]?94HD|Primus[ _]?QS|Android.*\\bQ8\\b|Sirius[ _]?EVO[ _]?QS|Sirius[ _]?QS|Spirit[ _]?S)\\b",
          ECSTablet: "V07OT2|TM105A|S10OT1|TR10CS1",
          StorexTablet: "eZee[_']?(Tab|Go)[0-9]+|TabLC7|Looney Tunes Tab",
          VodafoneTablet: "SmartTab([ ]+)?[0-9]+|SmartTabII10|SmartTabII7|VF-1497",
          EssentielBTablet: "Smart[ ']?TAB[ ]+?[0-9]+|Family[ ']?TAB2",
          RossMoorTablet: "RM-790|RM-997|RMD-878G|RMD-974R|RMT-705A|RMT-701|RME-601|RMT-501|RMT-711",
          iMobileTablet: "i-mobile i-note",
          TolinoTablet: "tolino tab [0-9.]+|tolino shine",
          AudioSonicTablet: "\\bC-22Q|T7-QC|T-17B|T-17P\\b",
          AMPETablet: "Android.* A78 ",
          SkkTablet: "Android.* (SKYPAD|PHOENIX|CYCLOPS)",
          TecnoTablet: "TECNO P9|TECNO DP8D",
          JXDTablet: "Android.* \\b(F3000|A3300|JXD5000|JXD3000|JXD2000|JXD300B|JXD300|S5800|S7800|S602b|S5110b|S7300|S5300|S602|S603|S5100|S5110|S601|S7100a|P3000F|P3000s|P101|P200s|P1000m|P200m|P9100|P1000s|S6600b|S908|P1000|P300|S18|S6600|S9100)\\b",
          iJoyTablet: "Tablet (Spirit 7|Essentia|Galatea|Fusion|Onix 7|Landa|Titan|Scooby|Deox|Stella|Themis|Argon|Unique 7|Sygnus|Hexen|Finity 7|Cream|Cream X2|Jade|Neon 7|Neron 7|Kandy|Scape|Saphyr 7|Rebel|Biox|Rebel|Rebel 8GB|Myst|Draco 7|Myst|Tab7-004|Myst|Tadeo Jones|Tablet Boing|Arrow|Draco Dual Cam|Aurix|Mint|Amity|Revolution|Finity 9|Neon 9|T9w|Amity 4GB Dual Cam|Stone 4GB|Stone 8GB|Andromeda|Silken|X2|Andromeda II|Halley|Flame|Saphyr 9,7|Touch 8|Planet|Triton|Unique 10|Hexen 10|Memphis 4GB|Memphis 8GB|Onix 10)",
          FX2Tablet: "FX2 PAD7|FX2 PAD10",
          XoroTablet: "KidsPAD 701|PAD[ ]?712|PAD[ ]?714|PAD[ ]?716|PAD[ ]?717|PAD[ ]?718|PAD[ ]?720|PAD[ ]?721|PAD[ ]?722|PAD[ ]?790|PAD[ ]?792|PAD[ ]?900|PAD[ ]?9715D|PAD[ ]?9716DR|PAD[ ]?9718DR|PAD[ ]?9719QR|PAD[ ]?9720QR|TelePAD1030|Telepad1032|TelePAD730|TelePAD731|TelePAD732|TelePAD735Q|TelePAD830|TelePAD9730|TelePAD795|MegaPAD 1331|MegaPAD 1851|MegaPAD 2151",
          ViewsonicTablet: "ViewPad 10pi|ViewPad 10e|ViewPad 10s|ViewPad E72|ViewPad7|ViewPad E100|ViewPad 7e|ViewSonic VB733|VB100a",
          VerizonTablet: "QTAQZ3|QTAIR7|QTAQTZ3|QTASUN1|QTASUN2|QTAXIA1",
          OdysTablet: "LOOX|XENO10|ODYS[ -](Space|EVO|Xpress|NOON)|\\bXELIO\\b|Xelio10Pro|XELIO7PHONETAB|XELIO10EXTREME|XELIOPT2|NEO_QUAD10",
          CaptivaTablet: "CAPTIVA PAD",
          IconbitTablet: "NetTAB|NT-3702|NT-3702S|NT-3702S|NT-3603P|NT-3603P|NT-0704S|NT-0704S|NT-3805C|NT-3805C|NT-0806C|NT-0806C|NT-0909T|NT-0909T|NT-0907S|NT-0907S|NT-0902S|NT-0902S",
          TeclastTablet: "T98 4G|\\bP80\\b|\\bX90HD\\b|X98 Air|X98 Air 3G|\\bX89\\b|P80 3G|\\bX80h\\b|P98 Air|\\bX89HD\\b|P98 3G|\\bP90HD\\b|P89 3G|X98 3G|\\bP70h\\b|P79HD 3G|G18d 3G|\\bP79HD\\b|\\bP89s\\b|\\bA88\\b|\\bP10HD\\b|\\bP19HD\\b|G18 3G|\\bP78HD\\b|\\bA78\\b|\\bP75\\b|G17s 3G|G17h 3G|\\bP85t\\b|\\bP90\\b|\\bP11\\b|\\bP98t\\b|\\bP98HD\\b|\\bG18d\\b|\\bP85s\\b|\\bP11HD\\b|\\bP88s\\b|\\bA80HD\\b|\\bA80se\\b|\\bA10h\\b|\\bP89\\b|\\bP78s\\b|\\bG18\\b|\\bP85\\b|\\bA70h\\b|\\bA70\\b|\\bG17\\b|\\bP18\\b|\\bA80s\\b|\\bA11s\\b|\\bP88HD\\b|\\bA80h\\b|\\bP76s\\b|\\bP76h\\b|\\bP98\\b|\\bA10HD\\b|\\bP78\\b|\\bP88\\b|\\bA11\\b|\\bA10t\\b|\\bP76a\\b|\\bP76t\\b|\\bP76e\\b|\\bP85HD\\b|\\bP85a\\b|\\bP86\\b|\\bP75HD\\b|\\bP76v\\b|\\bA12\\b|\\bP75a\\b|\\bA15\\b|\\bP76Ti\\b|\\bP81HD\\b|\\bA10\\b|\\bT760VE\\b|\\bT720HD\\b|\\bP76\\b|\\bP73\\b|\\bP71\\b|\\bP72\\b|\\bT720SE\\b|\\bC520Ti\\b|\\bT760\\b|\\bT720VE\\b|T720-3GE|T720-WiFi",
          OndaTablet: "\\b(V975i|Vi30|VX530|V701|Vi60|V701s|Vi50|V801s|V719|Vx610w|VX610W|V819i|Vi10|VX580W|Vi10|V711s|V813|V811|V820w|V820|Vi20|V711|VI30W|V712|V891w|V972|V819w|V820w|Vi60|V820w|V711|V813s|V801|V819|V975s|V801|V819|V819|V818|V811|V712|V975m|V101w|V961w|V812|V818|V971|V971s|V919|V989|V116w|V102w|V973|Vi40)\\b[\\s]+",
          JaytechTablet: "TPC-PA762",
          BlaupunktTablet: "Endeavour 800NG|Endeavour 1010",
          DigmaTablet: "\\b(iDx10|iDx9|iDx8|iDx7|iDxD7|iDxD8|iDsQ8|iDsQ7|iDsQ8|iDsD10|iDnD7|3TS804H|iDsQ11|iDj7|iDs10)\\b",
          EvolioTablet: "ARIA_Mini_wifi|Aria[ _]Mini|Evolio X10|Evolio X7|Evolio X8|\\bEvotab\\b|\\bNeura\\b",
          LavaTablet: "QPAD E704|\\bIvoryS\\b|E-TAB IVORY|\\bE-TAB\\b",
          AocTablet: "MW0811|MW0812|MW0922|MTK8382|MW1031|MW0831|MW0821|MW0931|MW0712",
          MpmanTablet: "MP11 OCTA|MP10 OCTA|MPQC1114|MPQC1004|MPQC994|MPQC974|MPQC973|MPQC804|MPQC784|MPQC780|\\bMPG7\\b|MPDCG75|MPDCG71|MPDC1006|MP101DC|MPDC9000|MPDC905|MPDC706HD|MPDC706|MPDC705|MPDC110|MPDC100|MPDC99|MPDC97|MPDC88|MPDC8|MPDC77|MP709|MID701|MID711|MID170|MPDC703|MPQC1010",
          CelkonTablet: "CT695|CT888|CT[\\s]?910|CT7 Tab|CT9 Tab|CT3 Tab|CT2 Tab|CT1 Tab|C820|C720|\\bCT-1\\b",
          WolderTablet: "miTab \\b(DIAMOND|SPACE|BROOKLYN|NEO|FLY|MANHATTAN|FUNK|EVOLUTION|SKY|GOCAR|IRON|GENIUS|POP|MINT|EPSILON|BROADWAY|JUMP|HOP|LEGEND|NEW AGE|LINE|ADVANCE|FEEL|FOLLOW|LIKE|LINK|LIVE|THINK|FREEDOM|CHICAGO|CLEVELAND|BALTIMORE-GH|IOWA|BOSTON|SEATTLE|PHOENIX|DALLAS|IN 101|MasterChef)\\b",
          MediacomTablet: "M-MPI10C3G|M-SP10EG|M-SP10EGP|M-SP10HXAH|M-SP7HXAH|M-SP10HXBH|M-SP8HXAH|M-SP8MXA",
          MiTablet: "\\bMI PAD\\b|\\bHM NOTE 1W\\b",
          NibiruTablet: "Nibiru M1|Nibiru Jupiter One",
          NexoTablet: "NEXO NOVA|NEXO 10|NEXO AVIO|NEXO FREE|NEXO GO|NEXO EVO|NEXO 3G|NEXO SMART|NEXO KIDDO|NEXO MOBI",
          LeaderTablet: "TBLT10Q|TBLT10I|TBL-10WDKB|TBL-10WDKBO2013|TBL-W230V2|TBL-W450|TBL-W500|SV572|TBLT7I|TBA-AC7-8G|TBLT79|TBL-8W16|TBL-10W32|TBL-10WKB|TBL-W100",
          UbislateTablet: "UbiSlate[\\s]?7C",
          PocketBookTablet: "Pocketbook",
          KocasoTablet: "\\b(TB-1207)\\b",
          HisenseTablet: "\\b(F5281|E2371)\\b",
          Hudl: "Hudl HT7S3|Hudl 2",
          TelstraTablet: "T-Hub2",
          GenericTablet: "Android.*\\b97D\\b|Tablet(?!.*PC)|BNTV250A|MID-WCDMA|LogicPD Zoom2|\\bA7EB\\b|CatNova8|A1_07|CT704|CT1002|\\bM721\\b|rk30sdk|\\bEVOTAB\\b|M758A|ET904|ALUMIUM10|Smartfren Tab|Endeavour 1010|Tablet-PC-4|Tagi Tab|\\bM6pro\\b|CT1020W|arc 10HD|\\bTP750\\b|\\bQTAQZ3\\b|WVT101|TM1088|KT107"
        },
        oss: {
          AndroidOS: "Android",
          BlackBerryOS: "blackberry|\\bBB10\\b|rim tablet os",
          PalmOS: "PalmOS|avantgo|blazer|elaine|hiptop|palm|plucker|xiino",
          SymbianOS: "Symbian|SymbOS|Series60|Series40|SYB-[0-9]+|\\bS60\\b",
          WindowsMobileOS: "Windows CE.*(PPC|Smartphone|Mobile|[0-9]{3}x[0-9]{3})|Window Mobile|Windows Phone [0-9.]+|WCE;",
          WindowsPhoneOS: "Windows Phone 10.0|Windows Phone 8.1|Windows Phone 8.0|Windows Phone OS|XBLWP7|ZuneWP7|Windows NT 6.[23]; ARM;",
          iOS: "\\biPhone.*Mobile|\\biPod|\\biPad|AppleCoreMedia",
          MeeGoOS: "MeeGo",
          MaemoOS: "Maemo",
          JavaOS: "J2ME/|\\bMIDP\\b|\\bCLDC\\b",
          webOS: "webOS|hpwOS",
          badaOS: "\\bBada\\b",
          BREWOS: "BREW"
        },
        uas: {
          Chrome: "\\bCrMo\\b|CriOS|Android.*Chrome/[.0-9]* (Mobile)?",
          Dolfin: "\\bDolfin\\b",
          Opera: "Opera.*Mini|Opera.*Mobi|Android.*Opera|Mobile.*OPR/[0-9.]+|Coast/[0-9.]+",
          Skyfire: "Skyfire",
          Edge: "Mobile Safari/[.0-9]* Edge",
          IE: "IEMobile|MSIEMobile",
          Firefox: "fennec|firefox.*maemo|(Mobile|Tablet).*Firefox|Firefox.*Mobile|FxiOS",
          Bolt: "bolt",
          TeaShark: "teashark",
          Blazer: "Blazer",
          Safari: "Version.*Mobile.*Safari|Safari.*Mobile|MobileSafari",
          UCBrowser: "UC.*Browser|UCWEB",
          baiduboxapp: "baiduboxapp",
          baidubrowser: "baidubrowser",
          DiigoBrowser: "DiigoBrowser",
          Puffin: "Puffin",
          Mercury: "\\bMercury\\b",
          ObigoBrowser: "Obigo",
          NetFront: "NF-Browser",
          GenericBrowser: "NokiaBrowser|OviBrowser|OneBrowser|TwonkyBeamBrowser|SEMC.*Browser|FlyFlow|Minimo|NetFront|Novarra-Vision|MQQBrowser|MicroMessenger",
          PaleMoon: "Android.*PaleMoon|Mobile.*PaleMoon"
        },
        props: {
          Mobile: "Mobile/[VER]",
          Build: "Build/[VER]",
          Version: "Version/[VER]",
          VendorID: "VendorID/[VER]",
          iPad: "iPad.*CPU[a-z ]+[VER]",
          iPhone: "iPhone.*CPU[a-z ]+[VER]",
          iPod: "iPod.*CPU[a-z ]+[VER]",
          Kindle: "Kindle/[VER]",
          Chrome: ["Chrome/[VER]", "CriOS/[VER]", "CrMo/[VER]"],
          Coast: ["Coast/[VER]"],
          Dolfin: "Dolfin/[VER]",
          Firefox: ["Firefox/[VER]", "FxiOS/[VER]"],
          Fennec: "Fennec/[VER]",
          Edge: "Edge/[VER]",
          IE: ["IEMobile/[VER];", "IEMobile [VER]", "MSIE [VER];", "Trident/[0-9.]+;.*rv:[VER]"],
          NetFront: "NetFront/[VER]",
          NokiaBrowser: "NokiaBrowser/[VER]",
          Opera: [" OPR/[VER]", "Opera Mini/[VER]", "Version/[VER]"],
          "Opera Mini": "Opera Mini/[VER]",
          "Opera Mobi": "Version/[VER]",
          UCBrowser: ["UCWEB[VER]", "UC.*Browser/[VER]"],
          MQQBrowser: "MQQBrowser/[VER]",
          MicroMessenger: "MicroMessenger/[VER]",
          baiduboxapp: "baiduboxapp/[VER]",
          baidubrowser: "baidubrowser/[VER]",
          SamsungBrowser: "SamsungBrowser/[VER]",
          Iron: "Iron/[VER]",
          Safari: ["Version/[VER]", "Safari/[VER]"],
          Skyfire: "Skyfire/[VER]",
          Tizen: "Tizen/[VER]",
          Webkit: "webkit[ /][VER]",
          PaleMoon: "PaleMoon/[VER]",
          Gecko: "Gecko/[VER]",
          Trident: "Trident/[VER]",
          Presto: "Presto/[VER]",
          Goanna: "Goanna/[VER]",
          iOS: " \\bi?OS\\b [VER][ ;]{1}",
          Android: "Android [VER]",
          BlackBerry: ["BlackBerry[\\w]+/[VER]", "BlackBerry.*Version/[VER]", "Version/[VER]"],
          BREW: "BREW [VER]",
          Java: "Java/[VER]",
          "Windows Phone OS": ["Windows Phone OS [VER]", "Windows Phone [VER]"],
          "Windows Phone": "Windows Phone [VER]",
          "Windows CE": "Windows CE/[VER]",
          "Windows NT": "Windows NT [VER]",
          Symbian: ["SymbianOS/[VER]", "Symbian/[VER]"],
          webOS: ["webOS/[VER]", "hpwOS/[VER];"]
        },
        utils: {
          Bot: "Googlebot|facebookexternalhit|AdsBot-Google|Google Keyword Suggestion|Facebot|YandexBot|YandexMobileBot|bingbot|ia_archiver|AhrefsBot|Ezooms|GSLFbot|WBSearchBot|Twitterbot|TweetmemeBot|Twikle|PaperLiBot|Wotbox|UnwindFetchor|Exabot|MJ12bot|YandexImages|TurnitinBot|Pingdom",
          MobileBot: "Googlebot-Mobile|AdsBot-Google-Mobile|YahooSeeker/M1A1-R2D2",
          DesktopMode: "WPDesktop",
          TV: "SonyDTV|HbbTV",
          WebKit: "(webkit)[ /]([\\w.]+)",
          Console: "\\b(Nintendo|Nintendo WiiU|Nintendo 3DS|Nintendo Switch|PLAYSTATION|Xbox)\\b",
          Watch: "SM-V700"
        }
      },
      detectMobileBrowsers: {
        fullPattern: /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
        shortPattern: /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
        tabletPattern: /android|ipad|playbook|silk/i
      }
    },
        t,
        u = Object.prototype.hasOwnProperty;
    return s.FALLBACK_PHONE = "UnknownPhone", s.FALLBACK_TABLET = "UnknownTablet", s.FALLBACK_MOBILE = "UnknownMobile", t = "isArray" in Array ? Array.isArray : function (v) {
      return "[object Array]" === Object.prototype.toString.call(v);
    }, function () {
      var v,
          w,
          x,
          y,
          z,
          A,
          B = s.mobileDetectRules;

      for (v in B.props) {
        if (u.call(B.props, v)) {
          for (w = B.props[v], t(w) || (w = [w]), z = w.length, y = 0; y < z; ++y) {
            x = w[y], A = x.indexOf("[VER]"), 0 <= A && (x = x.substring(0, A) + "([\\w._\\+]+)" + x.substring(A + 5)), w[y] = new RegExp(x, "i");
          }

          B.props[v] = w;
        }
      }

      p(B.oss), p(B.phones), p(B.tablets), p(B.uas), p(B.utils), B.oss0 = {
        WindowsPhoneOS: B.oss.WindowsPhoneOS,
        WindowsMobileOS: B.oss.WindowsMobileOS
      };
    }(), s.findMatch = function (v, w) {
      for (var x in v) {
        if (u.call(v, x) && v[x].test(w)) return x;
      }

      return null;
    }, s.findMatches = function (v, w) {
      var x = [];

      for (var y in v) {
        u.call(v, y) && v[y].test(w) && x.push(y);
      }

      return x;
    }, s.getVersionStr = function (v, w) {
      var x,
          y,
          z,
          A,
          B = s.mobileDetectRules.props;
      if (u.call(B, v)) for (x = B[v], z = x.length, y = 0; y < z; ++y) {
        if (A = x[y].exec(w), null !== A) return A[1];
      }
      return null;
    }, s.getVersion = function (v, w) {
      var x = s.getVersionStr(v, w);
      return x ? s.prepareVersionNo(x) : NaN;
    }, s.prepareVersionNo = function (v) {
      var w;
      return w = v.split(/[a-z._ \/\-]/i), 1 === w.length && (v = w[0]), 1 < w.length && (v = w[0] + ".", w.shift(), v += w.join("")), +v;
    }, s.isMobileFallback = function (v) {
      return s.detectMobileBrowsers.fullPattern.test(v) || s.detectMobileBrowsers.shortPattern.test(v.substr(0, 4));
    }, s.isTabletFallback = function (v) {
      return s.detectMobileBrowsers.tabletPattern.test(v);
    }, s.prepareDetectionCache = function (v, w, x) {
      if (v.mobile === m) {
        var y, z, A;
        return (z = s.findMatch(s.mobileDetectRules.tablets, w)) ? (v.mobile = v.tablet = z, void (v.phone = null)) : (y = s.findMatch(s.mobileDetectRules.phones, w)) ? (v.mobile = v.phone = y, void (v.tablet = null)) : void (s.isMobileFallback(w) ? (A = r.isPhoneSized(x), A === m ? (v.mobile = s.FALLBACK_MOBILE, v.tablet = v.phone = null) : A ? (v.mobile = v.phone = s.FALLBACK_PHONE, v.tablet = null) : (v.mobile = v.tablet = s.FALLBACK_TABLET, v.phone = null)) : s.isTabletFallback(w) ? (v.mobile = v.tablet = s.FALLBACK_TABLET, v.phone = null) : v.mobile = v.tablet = v.phone = null);
      }
    }, s.mobileGrade = function (v) {
      var w = null !== v.mobile();
      return v.os("iOS") && 4.3 <= v.version("iPad") || v.os("iOS") && 3.1 <= v.version("iPhone") || v.os("iOS") && 3.1 <= v.version("iPod") || 2.1 < v.version("Android") && v.is("Webkit") || 7 <= v.version("Windows Phone OS") || v.is("BlackBerry") && 6 <= v.version("BlackBerry") || v.match("Playbook.*Tablet") || 1.4 <= v.version("webOS") && v.match("Palm|Pre|Pixi") || v.match("hp.*TouchPad") || v.is("Firefox") && 12 <= v.version("Firefox") || v.is("Chrome") && v.is("AndroidOS") && 4 <= v.version("Android") || v.is("Skyfire") && 4.1 <= v.version("Skyfire") && v.is("AndroidOS") && 2.3 <= v.version("Android") || v.is("Opera") && 11 < v.version("Opera Mobi") && v.is("AndroidOS") || v.is("MeeGoOS") || v.is("Tizen") || v.is("Dolfin") && 2 <= v.version("Bada") || (v.is("UC Browser") || v.is("Dolfin")) && 2.3 <= v.version("Android") || v.match("Kindle Fire") || v.is("Kindle") && 3 <= v.version("Kindle") || v.is("AndroidOS") && v.is("NookTablet") || 11 <= v.version("Chrome") && !w || 5 <= v.version("Safari") && !w || 4 <= v.version("Firefox") && !w || 7 <= v.version("MSIE") && !w || 10 <= v.version("Opera") && !w ? "A" : v.os("iOS") && 4.3 > v.version("iPad") || v.os("iOS") && 3.1 > v.version("iPhone") || v.os("iOS") && 3.1 > v.version("iPod") || v.is("Blackberry") && 5 <= v.version("BlackBerry") && 6 > v.version("BlackBerry") || 5 <= v.version("Opera Mini") && 6.5 >= v.version("Opera Mini") && (2.3 <= v.version("Android") || v.is("iOS")) || v.match("NokiaN8|NokiaC7|N97.*Series60|Symbian/3") || 11 <= v.version("Opera Mobi") && v.is("SymbianOS") ? "B" : (5 > v.version("BlackBerry") || v.match("MSIEMobile|Windows CE.*Mobile") || 5.2 >= v.version("Windows Mobile"), "C");
    }, s.detectOS = function (v) {
      return s.findMatch(s.mobileDetectRules.oss0, v) || s.findMatch(s.mobileDetectRules.oss, v);
    }, s.getDeviceSmallerSide = function () {
      return window.screen.width < window.screen.height ? window.screen.width : window.screen.height;
    }, r.prototype = {
      constructor: r,
      mobile: function mobile() {
        return s.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth), this._cache.mobile;
      },
      phone: function phone() {
        return s.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth), this._cache.phone;
      },
      tablet: function tablet() {
        return s.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth), this._cache.tablet;
      },
      userAgent: function userAgent() {
        return this._cache.userAgent === m && (this._cache.userAgent = s.findMatch(s.mobileDetectRules.uas, this.ua)), this._cache.userAgent;
      },
      userAgents: function userAgents() {
        return this._cache.userAgents === m && (this._cache.userAgents = s.findMatches(s.mobileDetectRules.uas, this.ua)), this._cache.userAgents;
      },
      os: function os() {
        return this._cache.os === m && (this._cache.os = s.detectOS(this.ua)), this._cache.os;
      },
      version: function version(v) {
        return s.getVersion(v, this.ua);
      },
      versionStr: function versionStr(v) {
        return s.getVersionStr(v, this.ua);
      },
      is: function is(v) {
        return o(this.userAgents(), v) || n(v, this.os()) || n(v, this.phone()) || n(v, this.tablet()) || o(s.findMatches(s.mobileDetectRules.utils, this.ua), v);
      },
      match: function match(v) {
        return v instanceof RegExp || (v = new RegExp(v, "i")), v.test(this.ua);
      },
      isPhoneSized: function isPhoneSized(v) {
        return r.isPhoneSized(v || this.maxPhoneWidth);
      },
      mobileGrade: function mobileGrade() {
        return this._cache.grade === m && (this._cache.grade = s.mobileGrade(this)), this._cache.grade;
      }
    }, r.isPhoneSized = "undefined" != typeof window && window.screen ? function (v) {
      return 0 > v ? m : s.getDeviceSmallerSide() <= v;
    } : function () {}, r._impl = s, r.version = "1.4.2 2018-06-10", r;
  });
}(function () {
  if ("undefined" != typeof module && module.exports) return function (m) {
    module.exports = m();
  };
  if ("function" == typeof define && define.amd) return define;
  if ("undefined" != typeof window) return function (m) {
    window.MobileDetect = m();
  };
  throw new Error("unknown environment");
}());
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.8.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */

/* global window, document, define, jQuery, setInterval, clearInterval */

;

(function (factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
})(function ($) {
  'use strict';

  var Slick = window.Slick || {};

  Slick = function () {
    var instanceUid = 0;

    function Slick(element, settings) {
      var _ = this,
          dataSettings;

      _.defaults = {
        accessibility: true,
        adaptiveHeight: false,
        appendArrows: $(element),
        appendDots: $(element),
        arrows: true,
        asNavFor: null,
        prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
        nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
        autoplay: false,
        autoplaySpeed: 3000,
        centerMode: false,
        centerPadding: '50px',
        cssEase: 'ease',
        customPaging: function customPaging(slider, i) {
          return $('<button type="button" />').text(i + 1);
        },
        dots: false,
        dotsClass: 'slick-dots',
        draggable: true,
        easing: 'linear',
        edgeFriction: 0.35,
        fade: false,
        focusOnSelect: false,
        focusOnChange: false,
        infinite: true,
        initialSlide: 0,
        lazyLoad: 'ondemand',
        mobileFirst: false,
        pauseOnHover: true,
        pauseOnFocus: true,
        pauseOnDotsHover: false,
        respondTo: 'window',
        responsive: null,
        rows: 1,
        rtl: false,
        slide: '',
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: true,
        swipeToSlide: false,
        touchMove: true,
        touchThreshold: 5,
        useCSS: true,
        useTransform: true,
        variableWidth: false,
        vertical: false,
        verticalSwiping: false,
        waitForAnimate: true,
        zIndex: 1000
      };
      _.initials = {
        animating: false,
        dragging: false,
        autoPlayTimer: null,
        currentDirection: 0,
        currentLeft: null,
        currentSlide: 0,
        direction: 1,
        $dots: null,
        listWidth: null,
        listHeight: null,
        loadIndex: 0,
        $nextArrow: null,
        $prevArrow: null,
        scrolling: false,
        slideCount: null,
        slideWidth: null,
        $slideTrack: null,
        $slides: null,
        sliding: false,
        slideOffset: 0,
        swipeLeft: null,
        swiping: false,
        $list: null,
        touchObject: {},
        transformsEnabled: false,
        unslicked: false
      };
      $.extend(_, _.initials);
      _.activeBreakpoint = null;
      _.animType = null;
      _.animProp = null;
      _.breakpoints = [];
      _.breakpointSettings = [];
      _.cssTransitions = false;
      _.focussed = false;
      _.interrupted = false;
      _.hidden = 'hidden';
      _.paused = true;
      _.positionProp = null;
      _.respondTo = null;
      _.rowCount = 1;
      _.shouldClick = true;
      _.$slider = $(element);
      _.$slidesCache = null;
      _.transformType = null;
      _.transitionType = null;
      _.visibilityChange = 'visibilitychange';
      _.windowWidth = 0;
      _.windowTimer = null;
      dataSettings = $(element).data('slick') || {};
      _.options = $.extend({}, _.defaults, settings, dataSettings);
      _.currentSlide = _.options.initialSlide;
      _.originalSettings = _.options;

      if (typeof document.mozHidden !== 'undefined') {
        _.hidden = 'mozHidden';
        _.visibilityChange = 'mozvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        _.hidden = 'webkitHidden';
        _.visibilityChange = 'webkitvisibilitychange';
      }

      _.autoPlay = $.proxy(_.autoPlay, _);
      _.autoPlayClear = $.proxy(_.autoPlayClear, _);
      _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
      _.changeSlide = $.proxy(_.changeSlide, _);
      _.clickHandler = $.proxy(_.clickHandler, _);
      _.selectHandler = $.proxy(_.selectHandler, _);
      _.setPosition = $.proxy(_.setPosition, _);
      _.swipeHandler = $.proxy(_.swipeHandler, _);
      _.dragHandler = $.proxy(_.dragHandler, _);
      _.keyHandler = $.proxy(_.keyHandler, _);
      _.instanceUid = instanceUid++; // A simple way to check for HTML strings
      // Strict HTML recognition (must start with <)
      // Extracted from jQuery v1.11 source

      _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

      _.registerBreakpoints();

      _.init(true);
    }

    return Slick;
  }();

  Slick.prototype.activateADA = function () {
    var _ = this;

    _.$slideTrack.find('.slick-active').attr({
      'aria-hidden': 'false'
    }).find('a, input, button, select').attr({
      'tabindex': '0'
    });
  };

  Slick.prototype.addSlide = Slick.prototype.slickAdd = function (markup, index, addBefore) {
    var _ = this;

    if (typeof index === 'boolean') {
      addBefore = index;
      index = null;
    } else if (index < 0 || index >= _.slideCount) {
      return false;
    }

    _.unload();

    if (typeof index === 'number') {
      if (index === 0 && _.$slides.length === 0) {
        $(markup).appendTo(_.$slideTrack);
      } else if (addBefore) {
        $(markup).insertBefore(_.$slides.eq(index));
      } else {
        $(markup).insertAfter(_.$slides.eq(index));
      }
    } else {
      if (addBefore === true) {
        $(markup).prependTo(_.$slideTrack);
      } else {
        $(markup).appendTo(_.$slideTrack);
      }
    }

    _.$slides = _.$slideTrack.children(this.options.slide);

    _.$slideTrack.children(this.options.slide).detach();

    _.$slideTrack.append(_.$slides);

    _.$slides.each(function (index, element) {
      $(element).attr('data-slick-index', index);
    });

    _.$slidesCache = _.$slides;

    _.reinit();
  };

  Slick.prototype.animateHeight = function () {
    var _ = this;

    if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);

      _.$list.animate({
        height: targetHeight
      }, _.options.speed);
    }
  };

  Slick.prototype.animateSlide = function (targetLeft, callback) {
    var animProps = {},
        _ = this;

    _.animateHeight();

    if (_.options.rtl === true && _.options.vertical === false) {
      targetLeft = -targetLeft;
    }

    if (_.transformsEnabled === false) {
      if (_.options.vertical === false) {
        _.$slideTrack.animate({
          left: targetLeft
        }, _.options.speed, _.options.easing, callback);
      } else {
        _.$slideTrack.animate({
          top: targetLeft
        }, _.options.speed, _.options.easing, callback);
      }
    } else {
      if (_.cssTransitions === false) {
        if (_.options.rtl === true) {
          _.currentLeft = -_.currentLeft;
        }

        $({
          animStart: _.currentLeft
        }).animate({
          animStart: targetLeft
        }, {
          duration: _.options.speed,
          easing: _.options.easing,
          step: function step(now) {
            now = Math.ceil(now);

            if (_.options.vertical === false) {
              animProps[_.animType] = 'translate(' + now + 'px, 0px)';

              _.$slideTrack.css(animProps);
            } else {
              animProps[_.animType] = 'translate(0px,' + now + 'px)';

              _.$slideTrack.css(animProps);
            }
          },
          complete: function complete() {
            if (callback) {
              callback.call();
            }
          }
        });
      } else {
        _.applyTransition();

        targetLeft = Math.ceil(targetLeft);

        if (_.options.vertical === false) {
          animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
        } else {
          animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
        }

        _.$slideTrack.css(animProps);

        if (callback) {
          setTimeout(function () {
            _.disableTransition();

            callback.call();
          }, _.options.speed);
        }
      }
    }
  };

  Slick.prototype.getNavTarget = function () {
    var _ = this,
        asNavFor = _.options.asNavFor;

    if (asNavFor && asNavFor !== null) {
      asNavFor = $(asNavFor).not(_.$slider);
    }

    return asNavFor;
  };

  Slick.prototype.asNavFor = function (index) {
    var _ = this,
        asNavFor = _.getNavTarget();

    if (asNavFor !== null && _typeof(asNavFor) === 'object') {
      asNavFor.each(function () {
        var target = $(this).slick('getSlick');

        if (!target.unslicked) {
          target.slideHandler(index, true);
        }
      });
    }
  };

  Slick.prototype.applyTransition = function (slide) {
    var _ = this,
        transition = {};

    if (_.options.fade === false) {
      transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
    } else {
      transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
    }

    if (_.options.fade === false) {
      _.$slideTrack.css(transition);
    } else {
      _.$slides.eq(slide).css(transition);
    }
  };

  Slick.prototype.autoPlay = function () {
    var _ = this;

    _.autoPlayClear();

    if (_.slideCount > _.options.slidesToShow) {
      _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
    }
  };

  Slick.prototype.autoPlayClear = function () {
    var _ = this;

    if (_.autoPlayTimer) {
      clearInterval(_.autoPlayTimer);
    }
  };

  Slick.prototype.autoPlayIterator = function () {
    var _ = this,
        slideTo = _.currentSlide + _.options.slidesToScroll;

    if (!_.paused && !_.interrupted && !_.focussed) {
      if (_.options.infinite === false) {
        if (_.direction === 1 && _.currentSlide + 1 === _.slideCount - 1) {
          _.direction = 0;
        } else if (_.direction === 0) {
          slideTo = _.currentSlide - _.options.slidesToScroll;

          if (_.currentSlide - 1 === 0) {
            _.direction = 1;
          }
        }
      }

      _.slideHandler(slideTo);
    }
  };

  Slick.prototype.buildArrows = function () {
    var _ = this;

    if (_.options.arrows === true) {
      _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
      _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

      if (_.slideCount > _.options.slidesToShow) {
        _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

        _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

        if (_.htmlExpr.test(_.options.prevArrow)) {
          _.$prevArrow.prependTo(_.options.appendArrows);
        }

        if (_.htmlExpr.test(_.options.nextArrow)) {
          _.$nextArrow.appendTo(_.options.appendArrows);
        }

        if (_.options.infinite !== true) {
          _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
        }
      } else {
        _.$prevArrow.add(_.$nextArrow).addClass('slick-hidden').attr({
          'aria-disabled': 'true',
          'tabindex': '-1'
        });
      }
    }
  };

  Slick.prototype.buildDots = function () {
    var _ = this,
        i,
        dot;

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$slider.addClass('slick-dotted');

      dot = $('<ul />').addClass(_.options.dotsClass);

      for (i = 0; i <= _.getDotCount(); i += 1) {
        dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
      }

      _.$dots = dot.appendTo(_.options.appendDots);

      _.$dots.find('li').first().addClass('slick-active');
    }
  };

  Slick.prototype.buildOut = function () {
    var _ = this;

    _.$slides = _.$slider.children(_.options.slide + ':not(.slick-cloned)').addClass('slick-slide');
    _.slideCount = _.$slides.length;

    _.$slides.each(function (index, element) {
      $(element).attr('data-slick-index', index).data('originalStyling', $(element).attr('style') || '');
    });

    _.$slider.addClass('slick-slider');

    _.$slideTrack = _.slideCount === 0 ? $('<div class="slick-track"/>').appendTo(_.$slider) : _.$slides.wrapAll('<div class="slick-track"/>').parent();
    _.$list = _.$slideTrack.wrap('<div class="slick-list"/>').parent();

    _.$slideTrack.css('opacity', 0);

    if (_.options.centerMode === true || _.options.swipeToSlide === true) {
      _.options.slidesToScroll = 1;
    }

    $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

    _.setupInfinite();

    _.buildArrows();

    _.buildDots();

    _.updateDots();

    _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

    if (_.options.draggable === true) {
      _.$list.addClass('draggable');
    }
  };

  Slick.prototype.buildRows = function () {
    var _ = this,
        a,
        b,
        c,
        newSlides,
        numOfSlides,
        originalSlides,
        slidesPerSection;

    newSlides = document.createDocumentFragment();
    originalSlides = _.$slider.children();

    if (_.options.rows > 0) {
      slidesPerSection = _.options.slidesPerRow * _.options.rows;
      numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);

      for (a = 0; a < numOfSlides; a++) {
        var slide = document.createElement('div');

        for (b = 0; b < _.options.rows; b++) {
          var row = document.createElement('div');

          for (c = 0; c < _.options.slidesPerRow; c++) {
            var target = a * slidesPerSection + (b * _.options.slidesPerRow + c);

            if (originalSlides.get(target)) {
              row.appendChild(originalSlides.get(target));
            }
          }

          slide.appendChild(row);
        }

        newSlides.appendChild(slide);
      }

      _.$slider.empty().append(newSlides);

      _.$slider.children().children().children().css({
        'width': 100 / _.options.slidesPerRow + '%',
        'display': 'inline-block'
      });
    }
  };

  Slick.prototype.checkResponsive = function (initial, forceUpdate) {
    var _ = this,
        breakpoint,
        targetBreakpoint,
        respondToWidth,
        triggerBreakpoint = false;

    var sliderWidth = _.$slider.width();

    var windowWidth = window.innerWidth || $(window).width();

    if (_.respondTo === 'window') {
      respondToWidth = windowWidth;
    } else if (_.respondTo === 'slider') {
      respondToWidth = sliderWidth;
    } else if (_.respondTo === 'min') {
      respondToWidth = Math.min(windowWidth, sliderWidth);
    }

    if (_.options.responsive && _.options.responsive.length && _.options.responsive !== null) {
      targetBreakpoint = null;

      for (breakpoint in _.breakpoints) {
        if (_.breakpoints.hasOwnProperty(breakpoint)) {
          if (_.originalSettings.mobileFirst === false) {
            if (respondToWidth < _.breakpoints[breakpoint]) {
              targetBreakpoint = _.breakpoints[breakpoint];
            }
          } else {
            if (respondToWidth > _.breakpoints[breakpoint]) {
              targetBreakpoint = _.breakpoints[breakpoint];
            }
          }
        }
      }

      if (targetBreakpoint !== null) {
        if (_.activeBreakpoint !== null) {
          if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
            _.activeBreakpoint = targetBreakpoint;

            if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
              _.unslick(targetBreakpoint);
            } else {
              _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);

              if (initial === true) {
                _.currentSlide = _.options.initialSlide;
              }

              _.refresh(initial);
            }

            triggerBreakpoint = targetBreakpoint;
          }
        } else {
          _.activeBreakpoint = targetBreakpoint;

          if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
            _.unslick(targetBreakpoint);
          } else {
            _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);

            if (initial === true) {
              _.currentSlide = _.options.initialSlide;
            }

            _.refresh(initial);
          }

          triggerBreakpoint = targetBreakpoint;
        }
      } else {
        if (_.activeBreakpoint !== null) {
          _.activeBreakpoint = null;
          _.options = _.originalSettings;

          if (initial === true) {
            _.currentSlide = _.options.initialSlide;
          }

          _.refresh(initial);

          triggerBreakpoint = targetBreakpoint;
        }
      } // only trigger breakpoints during an actual break. not on initialize.


      if (!initial && triggerBreakpoint !== false) {
        _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
      }
    }
  };

  Slick.prototype.changeSlide = function (event, dontAnimate) {
    var _ = this,
        $target = $(event.currentTarget),
        indexOffset,
        slideOffset,
        unevenOffset; // If target is a link, prevent default action.


    if ($target.is('a')) {
      event.preventDefault();
    } // If target is not the <li> element (ie: a child), find the <li>.


    if (!$target.is('li')) {
      $target = $target.closest('li');
    }

    unevenOffset = _.slideCount % _.options.slidesToScroll !== 0;
    indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

    switch (event.data.message) {
      case 'previous':
        slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;

        if (_.slideCount > _.options.slidesToShow) {
          _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
        }

        break;

      case 'next':
        slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;

        if (_.slideCount > _.options.slidesToShow) {
          _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
        }

        break;

      case 'index':
        var index = event.data.index === 0 ? 0 : event.data.index || $target.index() * _.options.slidesToScroll;

        _.slideHandler(_.checkNavigable(index), false, dontAnimate);

        $target.children().trigger('focus');
        break;

      default:
        return;
    }
  };

  Slick.prototype.checkNavigable = function (index) {
    var _ = this,
        navigables,
        prevNavigable;

    navigables = _.getNavigableIndexes();
    prevNavigable = 0;

    if (index > navigables[navigables.length - 1]) {
      index = navigables[navigables.length - 1];
    } else {
      for (var n in navigables) {
        if (index < navigables[n]) {
          index = prevNavigable;
          break;
        }

        prevNavigable = navigables[n];
      }
    }

    return index;
  };

  Slick.prototype.cleanUpEvents = function () {
    var _ = this;

    if (_.options.dots && _.$dots !== null) {
      $('li', _.$dots).off('click.slick', _.changeSlide).off('mouseenter.slick', $.proxy(_.interrupt, _, true)).off('mouseleave.slick', $.proxy(_.interrupt, _, false));

      if (_.options.accessibility === true) {
        _.$dots.off('keydown.slick', _.keyHandler);
      }
    }

    _.$slider.off('focus.slick blur.slick');

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
      _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);

      if (_.options.accessibility === true) {
        _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);
        _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);
      }
    }

    _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);

    _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);

    _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);

    _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

    _.$list.off('click.slick', _.clickHandler);

    $(document).off(_.visibilityChange, _.visibility);

    _.cleanUpSlideEvents();

    if (_.options.accessibility === true) {
      _.$list.off('keydown.slick', _.keyHandler);
    }

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().off('click.slick', _.selectHandler);
    }

    $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);
    $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);
    $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);
    $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
  };

  Slick.prototype.cleanUpSlideEvents = function () {
    var _ = this;

    _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));

    _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));
  };

  Slick.prototype.cleanUpRows = function () {
    var _ = this,
        originalSlides;

    if (_.options.rows > 0) {
      originalSlides = _.$slides.children().children();
      originalSlides.removeAttr('style');

      _.$slider.empty().append(originalSlides);
    }
  };

  Slick.prototype.clickHandler = function (event) {
    var _ = this;

    if (_.shouldClick === false) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  };

  Slick.prototype.destroy = function (refresh) {
    var _ = this;

    _.autoPlayClear();

    _.touchObject = {};

    _.cleanUpEvents();

    $('.slick-cloned', _.$slider).detach();

    if (_.$dots) {
      _.$dots.remove();
    }

    if (_.$prevArrow && _.$prevArrow.length) {
      _.$prevArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

      if (_.htmlExpr.test(_.options.prevArrow)) {
        _.$prevArrow.remove();
      }
    }

    if (_.$nextArrow && _.$nextArrow.length) {
      _.$nextArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

      if (_.htmlExpr.test(_.options.nextArrow)) {
        _.$nextArrow.remove();
      }
    }

    if (_.$slides) {
      _.$slides.removeClass('slick-slide slick-active slick-center slick-visible slick-current').removeAttr('aria-hidden').removeAttr('data-slick-index').each(function () {
        $(this).attr('style', $(this).data('originalStyling'));
      });

      _.$slideTrack.children(this.options.slide).detach();

      _.$slideTrack.detach();

      _.$list.detach();

      _.$slider.append(_.$slides);
    }

    _.cleanUpRows();

    _.$slider.removeClass('slick-slider');

    _.$slider.removeClass('slick-initialized');

    _.$slider.removeClass('slick-dotted');

    _.unslicked = true;

    if (!refresh) {
      _.$slider.trigger('destroy', [_]);
    }
  };

  Slick.prototype.disableTransition = function (slide) {
    var _ = this,
        transition = {};

    transition[_.transitionType] = '';

    if (_.options.fade === false) {
      _.$slideTrack.css(transition);
    } else {
      _.$slides.eq(slide).css(transition);
    }
  };

  Slick.prototype.fadeSlide = function (slideIndex, callback) {
    var _ = this;

    if (_.cssTransitions === false) {
      _.$slides.eq(slideIndex).css({
        zIndex: _.options.zIndex
      });

      _.$slides.eq(slideIndex).animate({
        opacity: 1
      }, _.options.speed, _.options.easing, callback);
    } else {
      _.applyTransition(slideIndex);

      _.$slides.eq(slideIndex).css({
        opacity: 1,
        zIndex: _.options.zIndex
      });

      if (callback) {
        setTimeout(function () {
          _.disableTransition(slideIndex);

          callback.call();
        }, _.options.speed);
      }
    }
  };

  Slick.prototype.fadeSlideOut = function (slideIndex) {
    var _ = this;

    if (_.cssTransitions === false) {
      _.$slides.eq(slideIndex).animate({
        opacity: 0,
        zIndex: _.options.zIndex - 2
      }, _.options.speed, _.options.easing);
    } else {
      _.applyTransition(slideIndex);

      _.$slides.eq(slideIndex).css({
        opacity: 0,
        zIndex: _.options.zIndex - 2
      });
    }
  };

  Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (filter) {
    var _ = this;

    if (filter !== null) {
      _.$slidesCache = _.$slides;

      _.unload();

      _.$slideTrack.children(this.options.slide).detach();

      _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

      _.reinit();
    }
  };

  Slick.prototype.focusHandler = function () {
    var _ = this;

    _.$slider.off('focus.slick blur.slick').on('focus.slick blur.slick', '*', function (event) {
      event.stopImmediatePropagation();
      var $sf = $(this);
      setTimeout(function () {
        if (_.options.pauseOnFocus) {
          _.focussed = $sf.is(':focus');

          _.autoPlay();
        }
      }, 0);
    });
  };

  Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function () {
    var _ = this;

    return _.currentSlide;
  };

  Slick.prototype.getDotCount = function () {
    var _ = this;

    var breakPoint = 0;
    var counter = 0;
    var pagerQty = 0;

    if (_.options.infinite === true) {
      if (_.slideCount <= _.options.slidesToShow) {
        ++pagerQty;
      } else {
        while (breakPoint < _.slideCount) {
          ++pagerQty;
          breakPoint = counter + _.options.slidesToScroll;
          counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }
      }
    } else if (_.options.centerMode === true) {
      pagerQty = _.slideCount;
    } else if (!_.options.asNavFor) {
      pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
    } else {
      while (breakPoint < _.slideCount) {
        ++pagerQty;
        breakPoint = counter + _.options.slidesToScroll;
        counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
      }
    }

    return pagerQty - 1;
  };

  Slick.prototype.getLeft = function (slideIndex) {
    var _ = this,
        targetLeft,
        verticalHeight,
        verticalOffset = 0,
        targetSlide,
        coef;

    _.slideOffset = 0;
    verticalHeight = _.$slides.first().outerHeight(true);

    if (_.options.infinite === true) {
      if (_.slideCount > _.options.slidesToShow) {
        _.slideOffset = _.slideWidth * _.options.slidesToShow * -1;
        coef = -1;

        if (_.options.vertical === true && _.options.centerMode === true) {
          if (_.options.slidesToShow === 2) {
            coef = -1.5;
          } else if (_.options.slidesToShow === 1) {
            coef = -2;
          }
        }

        verticalOffset = verticalHeight * _.options.slidesToShow * coef;
      }

      if (_.slideCount % _.options.slidesToScroll !== 0) {
        if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
          if (slideIndex > _.slideCount) {
            _.slideOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth * -1;
            verticalOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight * -1;
          } else {
            _.slideOffset = _.slideCount % _.options.slidesToScroll * _.slideWidth * -1;
            verticalOffset = _.slideCount % _.options.slidesToScroll * verticalHeight * -1;
          }
        }
      }
    } else {
      if (slideIndex + _.options.slidesToShow > _.slideCount) {
        _.slideOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * _.slideWidth;
        verticalOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight;
      }
    }

    if (_.slideCount <= _.options.slidesToShow) {
      _.slideOffset = 0;
      verticalOffset = 0;
    }

    if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
      _.slideOffset = _.slideWidth * Math.floor(_.options.slidesToShow) / 2 - _.slideWidth * _.slideCount / 2;
    } else if (_.options.centerMode === true && _.options.infinite === true) {
      _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
    } else if (_.options.centerMode === true) {
      _.slideOffset = 0;
      _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
    }

    if (_.options.vertical === false) {
      targetLeft = slideIndex * _.slideWidth * -1 + _.slideOffset;
    } else {
      targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
    }

    if (_.options.variableWidth === true) {
      if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
        targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
      } else {
        targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
      }

      if (_.options.rtl === true) {
        if (targetSlide[0]) {
          targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
        } else {
          targetLeft = 0;
        }
      } else {
        targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
      }

      if (_.options.centerMode === true) {
        if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
          targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
        } else {
          targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
        }

        if (_.options.rtl === true) {
          if (targetSlide[0]) {
            targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
          } else {
            targetLeft = 0;
          }
        } else {
          targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
        }

        targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
      }
    }

    return targetLeft;
  };

  Slick.prototype.getOption = Slick.prototype.slickGetOption = function (option) {
    var _ = this;

    return _.options[option];
  };

  Slick.prototype.getNavigableIndexes = function () {
    var _ = this,
        breakPoint = 0,
        counter = 0,
        indexes = [],
        max;

    if (_.options.infinite === false) {
      max = _.slideCount;
    } else {
      breakPoint = _.options.slidesToScroll * -1;
      counter = _.options.slidesToScroll * -1;
      max = _.slideCount * 2;
    }

    while (breakPoint < max) {
      indexes.push(breakPoint);
      breakPoint = counter + _.options.slidesToScroll;
      counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
    }

    return indexes;
  };

  Slick.prototype.getSlick = function () {
    return this;
  };

  Slick.prototype.getSlideCount = function () {
    var _ = this,
        slidesTraversed,
        swipedSlide,
        centerOffset;

    centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

    if (_.options.swipeToSlide === true) {
      _.$slideTrack.find('.slick-slide').each(function (index, slide) {
        if (slide.offsetLeft - centerOffset + $(slide).outerWidth() / 2 > _.swipeLeft * -1) {
          swipedSlide = slide;
          return false;
        }
      });

      slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;
      return slidesTraversed;
    } else {
      return _.options.slidesToScroll;
    }
  };

  Slick.prototype.goTo = Slick.prototype.slickGoTo = function (slide, dontAnimate) {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'index',
        index: parseInt(slide)
      }
    }, dontAnimate);
  };

  Slick.prototype.init = function (creation) {
    var _ = this;

    if (!$(_.$slider).hasClass('slick-initialized')) {
      $(_.$slider).addClass('slick-initialized');

      _.buildRows();

      _.buildOut();

      _.setProps();

      _.startLoad();

      _.loadSlider();

      _.initializeEvents();

      _.updateArrows();

      _.updateDots();

      _.checkResponsive(true);

      _.focusHandler();
    }

    if (creation) {
      _.$slider.trigger('init', [_]);
    }

    if (_.options.accessibility === true) {
      _.initADA();
    }

    if (_.options.autoplay) {
      _.paused = false;

      _.autoPlay();
    }
  };

  Slick.prototype.initADA = function () {
    var _ = this,
        numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
        tabControlIndexes = _.getNavigableIndexes().filter(function (val) {
      return val >= 0 && val < _.slideCount;
    });

    _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
      'aria-hidden': 'true',
      'tabindex': '-1'
    }).find('a, input, button, select').attr({
      'tabindex': '-1'
    });

    if (_.$dots !== null) {
      _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function (i) {
        var slideControlIndex = tabControlIndexes.indexOf(i);
        $(this).attr({
          'role': 'tabpanel',
          'id': 'slick-slide' + _.instanceUid + i,
          'tabindex': -1
        });

        if (slideControlIndex !== -1) {
          var ariaButtonControl = 'slick-slide-control' + _.instanceUid + slideControlIndex;

          if ($('#' + ariaButtonControl).length) {
            $(this).attr({
              'aria-describedby': ariaButtonControl
            });
          }
        }
      });

      _.$dots.attr('role', 'tablist').find('li').each(function (i) {
        var mappedSlideIndex = tabControlIndexes[i];
        $(this).attr({
          'role': 'presentation'
        });
        $(this).find('button').first().attr({
          'role': 'tab',
          'id': 'slick-slide-control' + _.instanceUid + i,
          'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
          'aria-label': i + 1 + ' of ' + numDotGroups,
          'aria-selected': null,
          'tabindex': '-1'
        });
      }).eq(_.currentSlide).find('button').attr({
        'aria-selected': 'true',
        'tabindex': '0'
      }).end();
    }

    for (var i = _.currentSlide, max = i + _.options.slidesToShow; i < max; i++) {
      if (_.options.focusOnChange) {
        _.$slides.eq(i).attr({
          'tabindex': '0'
        });
      } else {
        _.$slides.eq(i).removeAttr('tabindex');
      }
    }

    _.activateADA();
  };

  Slick.prototype.initArrowEvents = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.off('click.slick').on('click.slick', {
        message: 'previous'
      }, _.changeSlide);

      _.$nextArrow.off('click.slick').on('click.slick', {
        message: 'next'
      }, _.changeSlide);

      if (_.options.accessibility === true) {
        _.$prevArrow.on('keydown.slick', _.keyHandler);

        _.$nextArrow.on('keydown.slick', _.keyHandler);
      }
    }
  };

  Slick.prototype.initDotEvents = function () {
    var _ = this;

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      $('li', _.$dots).on('click.slick', {
        message: 'index'
      }, _.changeSlide);

      if (_.options.accessibility === true) {
        _.$dots.on('keydown.slick', _.keyHandler);
      }
    }

    if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {
      $('li', _.$dots).on('mouseenter.slick', $.proxy(_.interrupt, _, true)).on('mouseleave.slick', $.proxy(_.interrupt, _, false));
    }
  };

  Slick.prototype.initSlideEvents = function () {
    var _ = this;

    if (_.options.pauseOnHover) {
      _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));

      _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));
    }
  };

  Slick.prototype.initializeEvents = function () {
    var _ = this;

    _.initArrowEvents();

    _.initDotEvents();

    _.initSlideEvents();

    _.$list.on('touchstart.slick mousedown.slick', {
      action: 'start'
    }, _.swipeHandler);

    _.$list.on('touchmove.slick mousemove.slick', {
      action: 'move'
    }, _.swipeHandler);

    _.$list.on('touchend.slick mouseup.slick', {
      action: 'end'
    }, _.swipeHandler);

    _.$list.on('touchcancel.slick mouseleave.slick', {
      action: 'end'
    }, _.swipeHandler);

    _.$list.on('click.slick', _.clickHandler);

    $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

    if (_.options.accessibility === true) {
      _.$list.on('keydown.slick', _.keyHandler);
    }

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().on('click.slick', _.selectHandler);
    }

    $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));
    $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));
    $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);
    $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
    $(_.setPosition);
  };

  Slick.prototype.initUI = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.show();

      _.$nextArrow.show();
    }

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$dots.show();
    }
  };

  Slick.prototype.keyHandler = function (event) {
    var _ = this; //Dont slide if the cursor is inside the form fields and arrow keys are pressed


    if (!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
      if (event.keyCode === 37 && _.options.accessibility === true) {
        _.changeSlide({
          data: {
            message: _.options.rtl === true ? 'next' : 'previous'
          }
        });
      } else if (event.keyCode === 39 && _.options.accessibility === true) {
        _.changeSlide({
          data: {
            message: _.options.rtl === true ? 'previous' : 'next'
          }
        });
      }
    }
  };

  Slick.prototype.lazyLoad = function () {
    var _ = this,
        loadRange,
        cloneRange,
        rangeStart,
        rangeEnd;

    function loadImages(imagesScope) {
      $('img[data-lazy]', imagesScope).each(function () {
        var image = $(this),
            imageSource = $(this).attr('data-lazy'),
            imageSrcSet = $(this).attr('data-srcset'),
            imageSizes = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
            imageToLoad = document.createElement('img');

        imageToLoad.onload = function () {
          image.animate({
            opacity: 0
          }, 100, function () {
            if (imageSrcSet) {
              image.attr('srcset', imageSrcSet);

              if (imageSizes) {
                image.attr('sizes', imageSizes);
              }
            }

            image.attr('src', imageSource).animate({
              opacity: 1
            }, 200, function () {
              image.removeAttr('data-lazy data-srcset data-sizes').removeClass('slick-loading');
            });

            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
          });
        };

        imageToLoad.onerror = function () {
          image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

          _.$slider.trigger('lazyLoadError', [_, image, imageSource]);
        };

        imageToLoad.src = imageSource;
      });
    }

    if (_.options.centerMode === true) {
      if (_.options.infinite === true) {
        rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
        rangeEnd = rangeStart + _.options.slidesToShow + 2;
      } else {
        rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
        rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
      }
    } else {
      rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
      rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);

      if (_.options.fade === true) {
        if (rangeStart > 0) rangeStart--;
        if (rangeEnd <= _.slideCount) rangeEnd++;
      }
    }

    loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

    if (_.options.lazyLoad === 'anticipated') {
      var prevSlide = rangeStart - 1,
          nextSlide = rangeEnd,
          $slides = _.$slider.find('.slick-slide');

      for (var i = 0; i < _.options.slidesToScroll; i++) {
        if (prevSlide < 0) prevSlide = _.slideCount - 1;
        loadRange = loadRange.add($slides.eq(prevSlide));
        loadRange = loadRange.add($slides.eq(nextSlide));
        prevSlide--;
        nextSlide++;
      }
    }

    loadImages(loadRange);

    if (_.slideCount <= _.options.slidesToShow) {
      cloneRange = _.$slider.find('.slick-slide');
      loadImages(cloneRange);
    } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
      cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
      loadImages(cloneRange);
    } else if (_.currentSlide === 0) {
      cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
      loadImages(cloneRange);
    }
  };

  Slick.prototype.loadSlider = function () {
    var _ = this;

    _.setPosition();

    _.$slideTrack.css({
      opacity: 1
    });

    _.$slider.removeClass('slick-loading');

    _.initUI();

    if (_.options.lazyLoad === 'progressive') {
      _.progressiveLazyLoad();
    }
  };

  Slick.prototype.next = Slick.prototype.slickNext = function () {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'next'
      }
    });
  };

  Slick.prototype.orientationChange = function () {
    var _ = this;

    _.checkResponsive();

    _.setPosition();
  };

  Slick.prototype.pause = Slick.prototype.slickPause = function () {
    var _ = this;

    _.autoPlayClear();

    _.paused = true;
  };

  Slick.prototype.play = Slick.prototype.slickPlay = function () {
    var _ = this;

    _.autoPlay();

    _.options.autoplay = true;
    _.paused = false;
    _.focussed = false;
    _.interrupted = false;
  };

  Slick.prototype.postSlide = function (index) {
    var _ = this;

    if (!_.unslicked) {
      _.$slider.trigger('afterChange', [_, index]);

      _.animating = false;

      if (_.slideCount > _.options.slidesToShow) {
        _.setPosition();
      }

      _.swipeLeft = null;

      if (_.options.autoplay) {
        _.autoPlay();
      }

      if (_.options.accessibility === true) {
        _.initADA();

        if (_.options.focusOnChange) {
          var $currentSlide = $(_.$slides.get(_.currentSlide));
          $currentSlide.attr('tabindex', 0).focus();
        }
      }
    }
  };

  Slick.prototype.prev = Slick.prototype.slickPrev = function () {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'previous'
      }
    });
  };

  Slick.prototype.preventDefault = function (event) {
    event.preventDefault();
  };

  Slick.prototype.progressiveLazyLoad = function (tryCount) {
    tryCount = tryCount || 1;

    var _ = this,
        $imgsToLoad = $('img[data-lazy]', _.$slider),
        image,
        imageSource,
        imageSrcSet,
        imageSizes,
        imageToLoad;

    if ($imgsToLoad.length) {
      image = $imgsToLoad.first();
      imageSource = image.attr('data-lazy');
      imageSrcSet = image.attr('data-srcset');
      imageSizes = image.attr('data-sizes') || _.$slider.attr('data-sizes');
      imageToLoad = document.createElement('img');

      imageToLoad.onload = function () {
        if (imageSrcSet) {
          image.attr('srcset', imageSrcSet);

          if (imageSizes) {
            image.attr('sizes', imageSizes);
          }
        }

        image.attr('src', imageSource).removeAttr('data-lazy data-srcset data-sizes').removeClass('slick-loading');

        if (_.options.adaptiveHeight === true) {
          _.setPosition();
        }

        _.$slider.trigger('lazyLoaded', [_, image, imageSource]);

        _.progressiveLazyLoad();
      };

      imageToLoad.onerror = function () {
        if (tryCount < 3) {
          /**
           * try to load the image 3 times,
           * leave a slight delay so we don't get
           * servers blocking the request.
           */
          setTimeout(function () {
            _.progressiveLazyLoad(tryCount + 1);
          }, 500);
        } else {
          image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

          _.$slider.trigger('lazyLoadError', [_, image, imageSource]);

          _.progressiveLazyLoad();
        }
      };

      imageToLoad.src = imageSource;
    } else {
      _.$slider.trigger('allImagesLoaded', [_]);
    }
  };

  Slick.prototype.refresh = function (initializing) {
    var _ = this,
        currentSlide,
        lastVisibleIndex;

    lastVisibleIndex = _.slideCount - _.options.slidesToShow; // in non-infinite sliders, we don't want to go past the
    // last visible index.

    if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
      _.currentSlide = lastVisibleIndex;
    } // if less slides than to show, go to start.


    if (_.slideCount <= _.options.slidesToShow) {
      _.currentSlide = 0;
    }

    currentSlide = _.currentSlide;

    _.destroy(true);

    $.extend(_, _.initials, {
      currentSlide: currentSlide
    });

    _.init();

    if (!initializing) {
      _.changeSlide({
        data: {
          message: 'index',
          index: currentSlide
        }
      }, false);
    }
  };

  Slick.prototype.registerBreakpoints = function () {
    var _ = this,
        breakpoint,
        currentBreakpoint,
        l,
        responsiveSettings = _.options.responsive || null;

    if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {
      _.respondTo = _.options.respondTo || 'window';

      for (breakpoint in responsiveSettings) {
        l = _.breakpoints.length - 1;

        if (responsiveSettings.hasOwnProperty(breakpoint)) {
          currentBreakpoint = responsiveSettings[breakpoint].breakpoint; // loop through the breakpoints and cut out any existing
          // ones with the same breakpoint number, we don't want dupes.

          while (l >= 0) {
            if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
              _.breakpoints.splice(l, 1);
            }

            l--;
          }

          _.breakpoints.push(currentBreakpoint);

          _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;
        }
      }

      _.breakpoints.sort(function (a, b) {
        return _.options.mobileFirst ? a - b : b - a;
      });
    }
  };

  Slick.prototype.reinit = function () {
    var _ = this;

    _.$slides = _.$slideTrack.children(_.options.slide).addClass('slick-slide');
    _.slideCount = _.$slides.length;

    if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
      _.currentSlide = _.currentSlide - _.options.slidesToScroll;
    }

    if (_.slideCount <= _.options.slidesToShow) {
      _.currentSlide = 0;
    }

    _.registerBreakpoints();

    _.setProps();

    _.setupInfinite();

    _.buildArrows();

    _.updateArrows();

    _.initArrowEvents();

    _.buildDots();

    _.updateDots();

    _.initDotEvents();

    _.cleanUpSlideEvents();

    _.initSlideEvents();

    _.checkResponsive(false, true);

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().on('click.slick', _.selectHandler);
    }

    _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

    _.setPosition();

    _.focusHandler();

    _.paused = !_.options.autoplay;

    _.autoPlay();

    _.$slider.trigger('reInit', [_]);
  };

  Slick.prototype.resize = function () {
    var _ = this;

    if ($(window).width() !== _.windowWidth) {
      clearTimeout(_.windowDelay);
      _.windowDelay = window.setTimeout(function () {
        _.windowWidth = $(window).width();

        _.checkResponsive();

        if (!_.unslicked) {
          _.setPosition();
        }
      }, 50);
    }
  };

  Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (index, removeBefore, removeAll) {
    var _ = this;

    if (typeof index === 'boolean') {
      removeBefore = index;
      index = removeBefore === true ? 0 : _.slideCount - 1;
    } else {
      index = removeBefore === true ? --index : index;
    }

    if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
      return false;
    }

    _.unload();

    if (removeAll === true) {
      _.$slideTrack.children().remove();
    } else {
      _.$slideTrack.children(this.options.slide).eq(index).remove();
    }

    _.$slides = _.$slideTrack.children(this.options.slide);

    _.$slideTrack.children(this.options.slide).detach();

    _.$slideTrack.append(_.$slides);

    _.$slidesCache = _.$slides;

    _.reinit();
  };

  Slick.prototype.setCSS = function (position) {
    var _ = this,
        positionProps = {},
        x,
        y;

    if (_.options.rtl === true) {
      position = -position;
    }

    x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
    y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';
    positionProps[_.positionProp] = position;

    if (_.transformsEnabled === false) {
      _.$slideTrack.css(positionProps);
    } else {
      positionProps = {};

      if (_.cssTransitions === false) {
        positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';

        _.$slideTrack.css(positionProps);
      } else {
        positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';

        _.$slideTrack.css(positionProps);
      }
    }
  };

  Slick.prototype.setDimensions = function () {
    var _ = this;

    if (_.options.vertical === false) {
      if (_.options.centerMode === true) {
        _.$list.css({
          padding: '0px ' + _.options.centerPadding
        });
      }
    } else {
      _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);

      if (_.options.centerMode === true) {
        _.$list.css({
          padding: _.options.centerPadding + ' 0px'
        });
      }
    }

    _.listWidth = _.$list.width();
    _.listHeight = _.$list.height();

    if (_.options.vertical === false && _.options.variableWidth === false) {
      _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);

      _.$slideTrack.width(Math.ceil(_.slideWidth * _.$slideTrack.children('.slick-slide').length));
    } else if (_.options.variableWidth === true) {
      _.$slideTrack.width(5000 * _.slideCount);
    } else {
      _.slideWidth = Math.ceil(_.listWidth);

      _.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length));
    }

    var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();

    if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
  };

  Slick.prototype.setFade = function () {
    var _ = this,
        targetLeft;

    _.$slides.each(function (index, element) {
      targetLeft = _.slideWidth * index * -1;

      if (_.options.rtl === true) {
        $(element).css({
          position: 'relative',
          right: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0
        });
      } else {
        $(element).css({
          position: 'relative',
          left: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0
        });
      }
    });

    _.$slides.eq(_.currentSlide).css({
      zIndex: _.options.zIndex - 1,
      opacity: 1
    });
  };

  Slick.prototype.setHeight = function () {
    var _ = this;

    if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);

      _.$list.css('height', targetHeight);
    }
  };

  Slick.prototype.setOption = Slick.prototype.slickSetOption = function () {
    /**
     * accepts arguments in format of:
     *
     *  - for changing a single option's value:
     *     .slick("setOption", option, value, refresh )
     *
     *  - for changing a set of responsive options:
     *     .slick("setOption", 'responsive', [{}, ...], refresh )
     *
     *  - for updating multiple values at once (not responsive)
     *     .slick("setOption", { 'option': value, ... }, refresh )
     */
    var _ = this,
        l,
        item,
        option,
        value,
        refresh = false,
        type;

    if ($.type(arguments[0]) === 'object') {
      option = arguments[0];
      refresh = arguments[1];
      type = 'multiple';
    } else if ($.type(arguments[0]) === 'string') {
      option = arguments[0];
      value = arguments[1];
      refresh = arguments[2];

      if (arguments[0] === 'responsive' && $.type(arguments[1]) === 'array') {
        type = 'responsive';
      } else if (typeof arguments[1] !== 'undefined') {
        type = 'single';
      }
    }

    if (type === 'single') {
      _.options[option] = value;
    } else if (type === 'multiple') {
      $.each(option, function (opt, val) {
        _.options[opt] = val;
      });
    } else if (type === 'responsive') {
      for (item in value) {
        if ($.type(_.options.responsive) !== 'array') {
          _.options.responsive = [value[item]];
        } else {
          l = _.options.responsive.length - 1; // loop through the responsive object and splice out duplicates.

          while (l >= 0) {
            if (_.options.responsive[l].breakpoint === value[item].breakpoint) {
              _.options.responsive.splice(l, 1);
            }

            l--;
          }

          _.options.responsive.push(value[item]);
        }
      }
    }

    if (refresh) {
      _.unload();

      _.reinit();
    }
  };

  Slick.prototype.setPosition = function () {
    var _ = this;

    _.setDimensions();

    _.setHeight();

    if (_.options.fade === false) {
      _.setCSS(_.getLeft(_.currentSlide));
    } else {
      _.setFade();
    }

    _.$slider.trigger('setPosition', [_]);
  };

  Slick.prototype.setProps = function () {
    var _ = this,
        bodyStyle = document.body.style;

    _.positionProp = _.options.vertical === true ? 'top' : 'left';

    if (_.positionProp === 'top') {
      _.$slider.addClass('slick-vertical');
    } else {
      _.$slider.removeClass('slick-vertical');
    }

    if (bodyStyle.WebkitTransition !== undefined || bodyStyle.MozTransition !== undefined || bodyStyle.msTransition !== undefined) {
      if (_.options.useCSS === true) {
        _.cssTransitions = true;
      }
    }

    if (_.options.fade) {
      if (typeof _.options.zIndex === 'number') {
        if (_.options.zIndex < 3) {
          _.options.zIndex = 3;
        }
      } else {
        _.options.zIndex = _.defaults.zIndex;
      }
    }

    if (bodyStyle.OTransform !== undefined) {
      _.animType = 'OTransform';
      _.transformType = '-o-transform';
      _.transitionType = 'OTransition';
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
    }

    if (bodyStyle.MozTransform !== undefined) {
      _.animType = 'MozTransform';
      _.transformType = '-moz-transform';
      _.transitionType = 'MozTransition';
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
    }

    if (bodyStyle.webkitTransform !== undefined) {
      _.animType = 'webkitTransform';
      _.transformType = '-webkit-transform';
      _.transitionType = 'webkitTransition';
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
    }

    if (bodyStyle.msTransform !== undefined) {
      _.animType = 'msTransform';
      _.transformType = '-ms-transform';
      _.transitionType = 'msTransition';
      if (bodyStyle.msTransform === undefined) _.animType = false;
    }

    if (bodyStyle.transform !== undefined && _.animType !== false) {
      _.animType = 'transform';
      _.transformType = 'transform';
      _.transitionType = 'transition';
    }

    _.transformsEnabled = _.options.useTransform && _.animType !== null && _.animType !== false;
  };

  Slick.prototype.setSlideClasses = function (index) {
    var _ = this,
        centerOffset,
        allSlides,
        indexOffset,
        remainder;

    allSlides = _.$slider.find('.slick-slide').removeClass('slick-active slick-center slick-current').attr('aria-hidden', 'true');

    _.$slides.eq(index).addClass('slick-current');

    if (_.options.centerMode === true) {
      var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;
      centerOffset = Math.floor(_.options.slidesToShow / 2);

      if (_.options.infinite === true) {
        if (index >= centerOffset && index <= _.slideCount - 1 - centerOffset) {
          _.$slides.slice(index - centerOffset + evenCoef, index + centerOffset + 1).addClass('slick-active').attr('aria-hidden', 'false');
        } else {
          indexOffset = _.options.slidesToShow + index;
          allSlides.slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2).addClass('slick-active').attr('aria-hidden', 'false');
        }

        if (index === 0) {
          allSlides.eq(allSlides.length - 1 - _.options.slidesToShow).addClass('slick-center');
        } else if (index === _.slideCount - 1) {
          allSlides.eq(_.options.slidesToShow).addClass('slick-center');
        }
      }

      _.$slides.eq(index).addClass('slick-center');
    } else {
      if (index >= 0 && index <= _.slideCount - _.options.slidesToShow) {
        _.$slides.slice(index, index + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
      } else if (allSlides.length <= _.options.slidesToShow) {
        allSlides.addClass('slick-active').attr('aria-hidden', 'false');
      } else {
        remainder = _.slideCount % _.options.slidesToShow;
        indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

        if (_.options.slidesToShow == _.options.slidesToScroll && _.slideCount - index < _.options.slidesToShow) {
          allSlides.slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder).addClass('slick-active').attr('aria-hidden', 'false');
        } else {
          allSlides.slice(indexOffset, indexOffset + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
        }
      }
    }

    if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
      _.lazyLoad();
    }
  };

  Slick.prototype.setupInfinite = function () {
    var _ = this,
        i,
        slideIndex,
        infiniteCount;

    if (_.options.fade === true) {
      _.options.centerMode = false;
    }

    if (_.options.infinite === true && _.options.fade === false) {
      slideIndex = null;

      if (_.slideCount > _.options.slidesToShow) {
        if (_.options.centerMode === true) {
          infiniteCount = _.options.slidesToShow + 1;
        } else {
          infiniteCount = _.options.slidesToShow;
        }

        for (i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) {
          slideIndex = i - 1;
          $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex - _.slideCount).prependTo(_.$slideTrack).addClass('slick-cloned');
        }

        for (i = 0; i < infiniteCount + _.slideCount; i += 1) {
          slideIndex = i;
          $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex + _.slideCount).appendTo(_.$slideTrack).addClass('slick-cloned');
        }

        _.$slideTrack.find('.slick-cloned').find('[id]').each(function () {
          $(this).attr('id', '');
        });
      }
    }
  };

  Slick.prototype.interrupt = function (toggle) {
    var _ = this;

    if (!toggle) {
      _.autoPlay();
    }

    _.interrupted = toggle;
  };

  Slick.prototype.selectHandler = function (event) {
    var _ = this;

    var targetElement = $(event.target).is('.slick-slide') ? $(event.target) : $(event.target).parents('.slick-slide');
    var index = parseInt(targetElement.attr('data-slick-index'));
    if (!index) index = 0;

    if (_.slideCount <= _.options.slidesToShow) {
      _.slideHandler(index, false, true);

      return;
    }

    _.slideHandler(index);
  };

  Slick.prototype.slideHandler = function (index, sync, dontAnimate) {
    var targetSlide,
        animSlide,
        oldSlide,
        slideLeft,
        targetLeft = null,
        _ = this,
        navTarget;

    sync = sync || false;

    if (_.animating === true && _.options.waitForAnimate === true) {
      return;
    }

    if (_.options.fade === true && _.currentSlide === index) {
      return;
    }

    if (sync === false) {
      _.asNavFor(index);
    }

    targetSlide = index;
    targetLeft = _.getLeft(targetSlide);
    slideLeft = _.getLeft(_.currentSlide);
    _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

    if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
      if (_.options.fade === false) {
        targetSlide = _.currentSlide;

        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
          _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide);
          });
        } else {
          _.postSlide(targetSlide);
        }
      }

      return;
    } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > _.slideCount - _.options.slidesToScroll)) {
      if (_.options.fade === false) {
        targetSlide = _.currentSlide;

        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
          _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide);
          });
        } else {
          _.postSlide(targetSlide);
        }
      }

      return;
    }

    if (_.options.autoplay) {
      clearInterval(_.autoPlayTimer);
    }

    if (targetSlide < 0) {
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        animSlide = _.slideCount - _.slideCount % _.options.slidesToScroll;
      } else {
        animSlide = _.slideCount + targetSlide;
      }
    } else if (targetSlide >= _.slideCount) {
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        animSlide = 0;
      } else {
        animSlide = targetSlide - _.slideCount;
      }
    } else {
      animSlide = targetSlide;
    }

    _.animating = true;

    _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

    oldSlide = _.currentSlide;
    _.currentSlide = animSlide;

    _.setSlideClasses(_.currentSlide);

    if (_.options.asNavFor) {
      navTarget = _.getNavTarget();
      navTarget = navTarget.slick('getSlick');

      if (navTarget.slideCount <= navTarget.options.slidesToShow) {
        navTarget.setSlideClasses(_.currentSlide);
      }
    }

    _.updateDots();

    _.updateArrows();

    if (_.options.fade === true) {
      if (dontAnimate !== true) {
        _.fadeSlideOut(oldSlide);

        _.fadeSlide(animSlide, function () {
          _.postSlide(animSlide);
        });
      } else {
        _.postSlide(animSlide);
      }

      _.animateHeight();

      return;
    }

    if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
      _.animateSlide(targetLeft, function () {
        _.postSlide(animSlide);
      });
    } else {
      _.postSlide(animSlide);
    }
  };

  Slick.prototype.startLoad = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.hide();

      _.$nextArrow.hide();
    }

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$dots.hide();
    }

    _.$slider.addClass('slick-loading');
  };

  Slick.prototype.swipeDirection = function () {
    var xDist,
        yDist,
        r,
        swipeAngle,
        _ = this;

    xDist = _.touchObject.startX - _.touchObject.curX;
    yDist = _.touchObject.startY - _.touchObject.curY;
    r = Math.atan2(yDist, xDist);
    swipeAngle = Math.round(r * 180 / Math.PI);

    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }

    if (swipeAngle <= 45 && swipeAngle >= 0) {
      return _.options.rtl === false ? 'left' : 'right';
    }

    if (swipeAngle <= 360 && swipeAngle >= 315) {
      return _.options.rtl === false ? 'left' : 'right';
    }

    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return _.options.rtl === false ? 'right' : 'left';
    }

    if (_.options.verticalSwiping === true) {
      if (swipeAngle >= 35 && swipeAngle <= 135) {
        return 'down';
      } else {
        return 'up';
      }
    }

    return 'vertical';
  };

  Slick.prototype.swipeEnd = function (event) {
    var _ = this,
        slideCount,
        direction;

    _.dragging = false;
    _.swiping = false;

    if (_.scrolling) {
      _.scrolling = false;
      return false;
    }

    _.interrupted = false;
    _.shouldClick = _.touchObject.swipeLength > 10 ? false : true;

    if (_.touchObject.curX === undefined) {
      return false;
    }

    if (_.touchObject.edgeHit === true) {
      _.$slider.trigger('edge', [_, _.swipeDirection()]);
    }

    if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
      direction = _.swipeDirection();

      switch (direction) {
        case 'left':
        case 'down':
          slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide + _.getSlideCount()) : _.currentSlide + _.getSlideCount();
          _.currentDirection = 0;
          break;

        case 'right':
        case 'up':
          slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide - _.getSlideCount()) : _.currentSlide - _.getSlideCount();
          _.currentDirection = 1;
          break;

        default:
      }

      if (direction != 'vertical') {
        _.slideHandler(slideCount);

        _.touchObject = {};

        _.$slider.trigger('swipe', [_, direction]);
      }
    } else {
      if (_.touchObject.startX !== _.touchObject.curX) {
        _.slideHandler(_.currentSlide);

        _.touchObject = {};
      }
    }
  };

  Slick.prototype.swipeHandler = function (event) {
    var _ = this;

    if (_.options.swipe === false || 'ontouchend' in document && _.options.swipe === false) {
      return;
    } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
      return;
    }

    _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ? event.originalEvent.touches.length : 1;
    _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;

    if (_.options.verticalSwiping === true) {
      _.touchObject.minSwipe = _.listHeight / _.options.touchThreshold;
    }

    switch (event.data.action) {
      case 'start':
        _.swipeStart(event);

        break;

      case 'move':
        _.swipeMove(event);

        break;

      case 'end':
        _.swipeEnd(event);

        break;
    }
  };

  Slick.prototype.swipeMove = function (event) {
    var _ = this,
        edgeWasHit = false,
        curLeft,
        swipeDirection,
        swipeLength,
        positionOffset,
        touches,
        verticalSwipeLength;

    touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

    if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
      return false;
    }

    curLeft = _.getLeft(_.currentSlide);
    _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
    _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;
    _.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));
    verticalSwipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));

    if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
      _.scrolling = true;
      return false;
    }

    if (_.options.verticalSwiping === true) {
      _.touchObject.swipeLength = verticalSwipeLength;
    }

    swipeDirection = _.swipeDirection();

    if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
      _.swiping = true;
      event.preventDefault();
    }

    positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);

    if (_.options.verticalSwiping === true) {
      positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
    }

    swipeLength = _.touchObject.swipeLength;
    _.touchObject.edgeHit = false;

    if (_.options.infinite === false) {
      if (_.currentSlide === 0 && swipeDirection === 'right' || _.currentSlide >= _.getDotCount() && swipeDirection === 'left') {
        swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
        _.touchObject.edgeHit = true;
      }
    }

    if (_.options.vertical === false) {
      _.swipeLeft = curLeft + swipeLength * positionOffset;
    } else {
      _.swipeLeft = curLeft + swipeLength * (_.$list.height() / _.listWidth) * positionOffset;
    }

    if (_.options.verticalSwiping === true) {
      _.swipeLeft = curLeft + swipeLength * positionOffset;
    }

    if (_.options.fade === true || _.options.touchMove === false) {
      return false;
    }

    if (_.animating === true) {
      _.swipeLeft = null;
      return false;
    }

    _.setCSS(_.swipeLeft);
  };

  Slick.prototype.swipeStart = function (event) {
    var _ = this,
        touches;

    _.interrupted = true;

    if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
      _.touchObject = {};
      return false;
    }

    if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
      touches = event.originalEvent.touches[0];
    }

    _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
    _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;
    _.dragging = true;
  };

  Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function () {
    var _ = this;

    if (_.$slidesCache !== null) {
      _.unload();

      _.$slideTrack.children(this.options.slide).detach();

      _.$slidesCache.appendTo(_.$slideTrack);

      _.reinit();
    }
  };

  Slick.prototype.unload = function () {
    var _ = this;

    $('.slick-cloned', _.$slider).remove();

    if (_.$dots) {
      _.$dots.remove();
    }

    if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
      _.$prevArrow.remove();
    }

    if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
      _.$nextArrow.remove();
    }

    _.$slides.removeClass('slick-slide slick-active slick-visible slick-current').attr('aria-hidden', 'true').css('width', '');
  };

  Slick.prototype.unslick = function (fromBreakpoint) {
    var _ = this;

    _.$slider.trigger('unslick', [_, fromBreakpoint]);

    _.destroy();
  };

  Slick.prototype.updateArrows = function () {
    var _ = this,
        centerOffset;

    centerOffset = Math.floor(_.options.slidesToShow / 2);

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow && !_.options.infinite) {
      _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

      _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

      if (_.currentSlide === 0) {
        _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

        _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
      } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {
        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

        _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
      } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {
        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

        _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
      }
    }
  };

  Slick.prototype.updateDots = function () {
    var _ = this;

    if (_.$dots !== null) {
      _.$dots.find('li').removeClass('slick-active').end();

      _.$dots.find('li').eq(Math.floor(_.currentSlide / _.options.slidesToScroll)).addClass('slick-active');
    }
  };

  Slick.prototype.visibility = function () {
    var _ = this;

    if (_.options.autoplay) {
      if (document[_.hidden]) {
        _.interrupted = true;
      } else {
        _.interrupted = false;
      }
    }
  };

  $.fn.slick = function () {
    var _ = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = _.length,
        i,
        ret;

    for (i = 0; i < l; i++) {
      if (_typeof(opt) == 'object' || typeof opt == 'undefined') _[i].slick = new Slick(_[i], opt);else ret = _[i].slick[opt].apply(_[i].slick, args);
      if (typeof ret != 'undefined') return ret;
    }

    return _;
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5uYXYuanMiLCJsb2FkLmpzIiwibW9iaWxlLWRldGVjdC5taW4uanMiLCJzbGljay5qcyJdLCJuYW1lcyI6WyIkIiwiZm4iLCJtZW51Iiwib3B0cyIsImNvbmZpZyIsImV4dGVuZCIsIm9wdDEiLCJpbml0Iiwib2JqIiwiZE9iaiIsImRNZW51bGluayIsImZpbmQiLCJkQWxsTGluayIsImRNZW51Q2xvc2UiLCJjbGljayIsInRvZ2dsZUNsYXNzIiwicmVtb3ZlQ2xhc3MiLCJlYWNoIiwialF1ZXJ5IiwibG9hZHBhZ2UiLCJhY3Rpb24iLCJwcm9ncmVzc1ZhbHVlIiwibG9hZEh0bWwiLCJqb2luIiwiZExvYWQiLCJkQ291bnQiLCJkQmFyIiwiYXN5bmMiLCJhcHBlbmRUbyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicXVldWUiLCJjcmVhdGVqcyIsIkxvYWRRdWV1ZSIsInNldE1heENvbm5lY3Rpb25zIiwibG9hZEFycmF5IiwiaSIsInB1c2giLCJpZCIsInNyYyIsImF0dHIiLCJsb2FkTWFuaWZlc3QiLCJoYW5kbGVDb21wbGV0ZSIsIndpbmRvdyIsInRyaWdnZXIiLCJjc3MiLCJUd2Vlbk1heCIsImZyb21UbyIsIm9wYWNpdHkiLCJkZWxheSIsImVhc2UiLCJQb3dlcjQiLCJlYXNlT3V0Iiwib25Db21wbGV0ZSIsInJlbW92ZSIsIm9uIiwicHJvY1ZhbHVlIiwiTWF0aCIsIm1pbiIsImNlaWwiLCJwcm9ncmVzcyIsInRleHQiLCJsIiwibSIsIm4iLCJ2IiwidyIsInRvTG93ZXJDYXNlIiwibyIsIngiLCJ5IiwieiIsImxlbmd0aCIsInAiLCJ1IiwiY2FsbCIsIlJlZ0V4cCIsInEiLCJzdWJzdHIiLCJyIiwidWEiLCJfY2FjaGUiLCJtYXhQaG9uZVdpZHRoIiwicyIsIm1vYmlsZURldGVjdFJ1bGVzIiwicGhvbmVzIiwiaVBob25lIiwiQmxhY2tCZXJyeSIsIkhUQyIsIk5leHVzIiwiRGVsbCIsIk1vdG9yb2xhIiwiU2Ftc3VuZyIsIkxHIiwiU29ueSIsIkFzdXMiLCJOb2tpYUx1bWlhIiwiTWljcm9tYXgiLCJQYWxtIiwiVmVydHUiLCJQYW50ZWNoIiwiRmx5IiwiV2lrbyIsImlNb2JpbGUiLCJTaW1WYWxsZXkiLCJXb2xmZ2FuZyIsIkFsY2F0ZWwiLCJOaW50ZW5kbyIsIkFtb2kiLCJJTlEiLCJHZW5lcmljUGhvbmUiLCJ0YWJsZXRzIiwiaVBhZCIsIk5leHVzVGFibGV0IiwiR29vZ2xlVGFibGV0IiwiU2Ftc3VuZ1RhYmxldCIsIktpbmRsZSIsIlN1cmZhY2VUYWJsZXQiLCJIUFRhYmxldCIsIkFzdXNUYWJsZXQiLCJCbGFja0JlcnJ5VGFibGV0IiwiSFRDdGFibGV0IiwiTW90b3JvbGFUYWJsZXQiLCJOb29rVGFibGV0IiwiQWNlclRhYmxldCIsIlRvc2hpYmFUYWJsZXQiLCJMR1RhYmxldCIsIkZ1aml0c3VUYWJsZXQiLCJQcmVzdGlnaW9UYWJsZXQiLCJMZW5vdm9UYWJsZXQiLCJEZWxsVGFibGV0IiwiWWFydmlrVGFibGV0IiwiTWVkaW9uVGFibGV0IiwiQXJub3ZhVGFibGV0IiwiSW50ZW5zb1RhYmxldCIsIklSVVRhYmxldCIsIk1lZ2Fmb25UYWJsZXQiLCJFYm9kYVRhYmxldCIsIkFsbFZpZXdUYWJsZXQiLCJBcmNob3NUYWJsZXQiLCJBaW5vbFRhYmxldCIsIk5va2lhTHVtaWFUYWJsZXQiLCJTb255VGFibGV0IiwiUGhpbGlwc1RhYmxldCIsIkN1YmVUYWJsZXQiLCJDb2J5VGFibGV0IiwiTUlEVGFibGV0IiwiTVNJVGFibGV0IiwiU01pVFRhYmxldCIsIlJvY2tDaGlwVGFibGV0IiwiRmx5VGFibGV0IiwiYnFUYWJsZXQiLCJIdWF3ZWlUYWJsZXQiLCJOZWNUYWJsZXQiLCJQYW50ZWNoVGFibGV0IiwiQnJvbmNob1RhYmxldCIsIlZlcnN1c1RhYmxldCIsIlp5bmNUYWJsZXQiLCJQb3NpdGl2b1RhYmxldCIsIk5hYmlUYWJsZXQiLCJLb2JvVGFibGV0IiwiRGFuZXdUYWJsZXQiLCJUZXhldFRhYmxldCIsIlBsYXlzdGF0aW9uVGFibGV0IiwiVHJla3N0b3JUYWJsZXQiLCJQeWxlQXVkaW9UYWJsZXQiLCJBZHZhblRhYmxldCIsIkRhbnlUZWNoVGFibGV0IiwiR2FsYXBhZFRhYmxldCIsIk1pY3JvbWF4VGFibGV0IiwiS2FyYm9ublRhYmxldCIsIkFsbEZpbmVUYWJsZXQiLCJQUk9TQ0FOVGFibGV0IiwiWU9ORVNUYWJsZXQiLCJDaGFuZ0ppYVRhYmxldCIsIkdVVGFibGV0IiwiUG9pbnRPZlZpZXdUYWJsZXQiLCJPdmVybWF4VGFibGV0IiwiSENMVGFibGV0IiwiRFBTVGFibGV0IiwiVmlzdHVyZVRhYmxldCIsIkNyZXN0YVRhYmxldCIsIk1lZGlhdGVrVGFibGV0IiwiQ29uY29yZGVUYWJsZXQiLCJHb0NsZXZlclRhYmxldCIsIk1vZGVjb21UYWJsZXQiLCJWb25pbm9UYWJsZXQiLCJFQ1NUYWJsZXQiLCJTdG9yZXhUYWJsZXQiLCJWb2RhZm9uZVRhYmxldCIsIkVzc2VudGllbEJUYWJsZXQiLCJSb3NzTW9vclRhYmxldCIsImlNb2JpbGVUYWJsZXQiLCJUb2xpbm9UYWJsZXQiLCJBdWRpb1NvbmljVGFibGV0IiwiQU1QRVRhYmxldCIsIlNra1RhYmxldCIsIlRlY25vVGFibGV0IiwiSlhEVGFibGV0IiwiaUpveVRhYmxldCIsIkZYMlRhYmxldCIsIlhvcm9UYWJsZXQiLCJWaWV3c29uaWNUYWJsZXQiLCJWZXJpem9uVGFibGV0IiwiT2R5c1RhYmxldCIsIkNhcHRpdmFUYWJsZXQiLCJJY29uYml0VGFibGV0IiwiVGVjbGFzdFRhYmxldCIsIk9uZGFUYWJsZXQiLCJKYXl0ZWNoVGFibGV0IiwiQmxhdXB1bmt0VGFibGV0IiwiRGlnbWFUYWJsZXQiLCJFdm9saW9UYWJsZXQiLCJMYXZhVGFibGV0IiwiQW9jVGFibGV0IiwiTXBtYW5UYWJsZXQiLCJDZWxrb25UYWJsZXQiLCJXb2xkZXJUYWJsZXQiLCJNZWRpYWNvbVRhYmxldCIsIk1pVGFibGV0IiwiTmliaXJ1VGFibGV0IiwiTmV4b1RhYmxldCIsIkxlYWRlclRhYmxldCIsIlViaXNsYXRlVGFibGV0IiwiUG9ja2V0Qm9va1RhYmxldCIsIktvY2Fzb1RhYmxldCIsIkhpc2Vuc2VUYWJsZXQiLCJIdWRsIiwiVGVsc3RyYVRhYmxldCIsIkdlbmVyaWNUYWJsZXQiLCJvc3MiLCJBbmRyb2lkT1MiLCJCbGFja0JlcnJ5T1MiLCJQYWxtT1MiLCJTeW1iaWFuT1MiLCJXaW5kb3dzTW9iaWxlT1MiLCJXaW5kb3dzUGhvbmVPUyIsImlPUyIsIk1lZUdvT1MiLCJNYWVtb09TIiwiSmF2YU9TIiwid2ViT1MiLCJiYWRhT1MiLCJCUkVXT1MiLCJ1YXMiLCJDaHJvbWUiLCJEb2xmaW4iLCJPcGVyYSIsIlNreWZpcmUiLCJFZGdlIiwiSUUiLCJGaXJlZm94IiwiQm9sdCIsIlRlYVNoYXJrIiwiQmxhemVyIiwiU2FmYXJpIiwiVUNCcm93c2VyIiwiYmFpZHVib3hhcHAiLCJiYWlkdWJyb3dzZXIiLCJEaWlnb0Jyb3dzZXIiLCJQdWZmaW4iLCJNZXJjdXJ5IiwiT2JpZ29Ccm93c2VyIiwiTmV0RnJvbnQiLCJHZW5lcmljQnJvd3NlciIsIlBhbGVNb29uIiwicHJvcHMiLCJNb2JpbGUiLCJCdWlsZCIsIlZlcnNpb24iLCJWZW5kb3JJRCIsImlQb2QiLCJDb2FzdCIsIkZlbm5lYyIsIk5va2lhQnJvd3NlciIsIk1RUUJyb3dzZXIiLCJNaWNyb01lc3NlbmdlciIsIlNhbXN1bmdCcm93c2VyIiwiSXJvbiIsIlRpemVuIiwiV2Via2l0IiwiR2Vja28iLCJUcmlkZW50IiwiUHJlc3RvIiwiR29hbm5hIiwiQW5kcm9pZCIsIkJSRVciLCJKYXZhIiwiU3ltYmlhbiIsInV0aWxzIiwiQm90IiwiTW9iaWxlQm90IiwiRGVza3RvcE1vZGUiLCJUViIsIldlYktpdCIsIkNvbnNvbGUiLCJXYXRjaCIsImRldGVjdE1vYmlsZUJyb3dzZXJzIiwiZnVsbFBhdHRlcm4iLCJzaG9ydFBhdHRlcm4iLCJ0YWJsZXRQYXR0ZXJuIiwidCIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiRkFMTEJBQ0tfUEhPTkUiLCJGQUxMQkFDS19UQUJMRVQiLCJGQUxMQkFDS19NT0JJTEUiLCJBcnJheSIsImlzQXJyYXkiLCJ0b1N0cmluZyIsIkEiLCJCIiwiaW5kZXhPZiIsInN1YnN0cmluZyIsIm9zczAiLCJmaW5kTWF0Y2giLCJ0ZXN0IiwiZmluZE1hdGNoZXMiLCJnZXRWZXJzaW9uU3RyIiwiZXhlYyIsImdldFZlcnNpb24iLCJwcmVwYXJlVmVyc2lvbk5vIiwiTmFOIiwic3BsaXQiLCJzaGlmdCIsImlzTW9iaWxlRmFsbGJhY2siLCJpc1RhYmxldEZhbGxiYWNrIiwicHJlcGFyZURldGVjdGlvbkNhY2hlIiwibW9iaWxlIiwidGFibGV0IiwicGhvbmUiLCJpc1Bob25lU2l6ZWQiLCJtb2JpbGVHcmFkZSIsIm9zIiwidmVyc2lvbiIsImlzIiwibWF0Y2giLCJkZXRlY3RPUyIsImdldERldmljZVNtYWxsZXJTaWRlIiwic2NyZWVuIiwid2lkdGgiLCJoZWlnaHQiLCJjb25zdHJ1Y3RvciIsInVzZXJBZ2VudCIsInVzZXJBZ2VudHMiLCJ2ZXJzaW9uU3RyIiwiZ3JhZGUiLCJfaW1wbCIsIm1vZHVsZSIsImV4cG9ydHMiLCJkZWZpbmUiLCJhbWQiLCJNb2JpbGVEZXRlY3QiLCJFcnJvciIsImZhY3RvcnkiLCJyZXF1aXJlIiwiU2xpY2siLCJpbnN0YW5jZVVpZCIsImVsZW1lbnQiLCJzZXR0aW5ncyIsIl8iLCJkYXRhU2V0dGluZ3MiLCJkZWZhdWx0cyIsImFjY2Vzc2liaWxpdHkiLCJhZGFwdGl2ZUhlaWdodCIsImFwcGVuZEFycm93cyIsImFwcGVuZERvdHMiLCJhcnJvd3MiLCJhc05hdkZvciIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsImF1dG9wbGF5IiwiYXV0b3BsYXlTcGVlZCIsImNlbnRlck1vZGUiLCJjZW50ZXJQYWRkaW5nIiwiY3NzRWFzZSIsImN1c3RvbVBhZ2luZyIsInNsaWRlciIsImRvdHMiLCJkb3RzQ2xhc3MiLCJkcmFnZ2FibGUiLCJlYXNpbmciLCJlZGdlRnJpY3Rpb24iLCJmYWRlIiwiZm9jdXNPblNlbGVjdCIsImZvY3VzT25DaGFuZ2UiLCJpbmZpbml0ZSIsImluaXRpYWxTbGlkZSIsImxhenlMb2FkIiwibW9iaWxlRmlyc3QiLCJwYXVzZU9uSG92ZXIiLCJwYXVzZU9uRm9jdXMiLCJwYXVzZU9uRG90c0hvdmVyIiwicmVzcG9uZFRvIiwicmVzcG9uc2l2ZSIsInJvd3MiLCJydGwiLCJzbGlkZSIsInNsaWRlc1BlclJvdyIsInNsaWRlc1RvU2hvdyIsInNsaWRlc1RvU2Nyb2xsIiwic3BlZWQiLCJzd2lwZSIsInN3aXBlVG9TbGlkZSIsInRvdWNoTW92ZSIsInRvdWNoVGhyZXNob2xkIiwidXNlQ1NTIiwidXNlVHJhbnNmb3JtIiwidmFyaWFibGVXaWR0aCIsInZlcnRpY2FsIiwidmVydGljYWxTd2lwaW5nIiwid2FpdEZvckFuaW1hdGUiLCJ6SW5kZXgiLCJpbml0aWFscyIsImFuaW1hdGluZyIsImRyYWdnaW5nIiwiYXV0b1BsYXlUaW1lciIsImN1cnJlbnREaXJlY3Rpb24iLCJjdXJyZW50TGVmdCIsImN1cnJlbnRTbGlkZSIsImRpcmVjdGlvbiIsIiRkb3RzIiwibGlzdFdpZHRoIiwibGlzdEhlaWdodCIsImxvYWRJbmRleCIsIiRuZXh0QXJyb3ciLCIkcHJldkFycm93Iiwic2Nyb2xsaW5nIiwic2xpZGVDb3VudCIsInNsaWRlV2lkdGgiLCIkc2xpZGVUcmFjayIsIiRzbGlkZXMiLCJzbGlkaW5nIiwic2xpZGVPZmZzZXQiLCJzd2lwZUxlZnQiLCJzd2lwaW5nIiwiJGxpc3QiLCJ0b3VjaE9iamVjdCIsInRyYW5zZm9ybXNFbmFibGVkIiwidW5zbGlja2VkIiwiYWN0aXZlQnJlYWtwb2ludCIsImFuaW1UeXBlIiwiYW5pbVByb3AiLCJicmVha3BvaW50cyIsImJyZWFrcG9pbnRTZXR0aW5ncyIsImNzc1RyYW5zaXRpb25zIiwiZm9jdXNzZWQiLCJpbnRlcnJ1cHRlZCIsImhpZGRlbiIsInBhdXNlZCIsInBvc2l0aW9uUHJvcCIsInJvd0NvdW50Iiwic2hvdWxkQ2xpY2siLCIkc2xpZGVyIiwiJHNsaWRlc0NhY2hlIiwidHJhbnNmb3JtVHlwZSIsInRyYW5zaXRpb25UeXBlIiwidmlzaWJpbGl0eUNoYW5nZSIsIndpbmRvd1dpZHRoIiwid2luZG93VGltZXIiLCJkYXRhIiwib3B0aW9ucyIsIm9yaWdpbmFsU2V0dGluZ3MiLCJkb2N1bWVudCIsIm1vekhpZGRlbiIsIndlYmtpdEhpZGRlbiIsImF1dG9QbGF5IiwicHJveHkiLCJhdXRvUGxheUNsZWFyIiwiYXV0b1BsYXlJdGVyYXRvciIsImNoYW5nZVNsaWRlIiwiY2xpY2tIYW5kbGVyIiwic2VsZWN0SGFuZGxlciIsInNldFBvc2l0aW9uIiwic3dpcGVIYW5kbGVyIiwiZHJhZ0hhbmRsZXIiLCJrZXlIYW5kbGVyIiwiaHRtbEV4cHIiLCJyZWdpc3RlckJyZWFrcG9pbnRzIiwiYWN0aXZhdGVBREEiLCJhZGRTbGlkZSIsInNsaWNrQWRkIiwibWFya3VwIiwiaW5kZXgiLCJhZGRCZWZvcmUiLCJ1bmxvYWQiLCJpbnNlcnRCZWZvcmUiLCJlcSIsImluc2VydEFmdGVyIiwicHJlcGVuZFRvIiwiY2hpbGRyZW4iLCJkZXRhY2giLCJhcHBlbmQiLCJyZWluaXQiLCJhbmltYXRlSGVpZ2h0IiwidGFyZ2V0SGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJhbmltYXRlIiwiYW5pbWF0ZVNsaWRlIiwidGFyZ2V0TGVmdCIsImNhbGxiYWNrIiwiYW5pbVByb3BzIiwibGVmdCIsInRvcCIsImFuaW1TdGFydCIsImR1cmF0aW9uIiwic3RlcCIsIm5vdyIsImNvbXBsZXRlIiwiYXBwbHlUcmFuc2l0aW9uIiwic2V0VGltZW91dCIsImRpc2FibGVUcmFuc2l0aW9uIiwiZ2V0TmF2VGFyZ2V0Iiwibm90IiwidGFyZ2V0Iiwic2xpY2siLCJzbGlkZUhhbmRsZXIiLCJ0cmFuc2l0aW9uIiwic2V0SW50ZXJ2YWwiLCJjbGVhckludGVydmFsIiwic2xpZGVUbyIsImJ1aWxkQXJyb3dzIiwiYWRkQ2xhc3MiLCJyZW1vdmVBdHRyIiwiYWRkIiwiYnVpbGREb3RzIiwiZG90IiwiZ2V0RG90Q291bnQiLCJmaXJzdCIsImJ1aWxkT3V0Iiwid3JhcEFsbCIsInBhcmVudCIsIndyYXAiLCJzZXR1cEluZmluaXRlIiwidXBkYXRlRG90cyIsInNldFNsaWRlQ2xhc3NlcyIsImJ1aWxkUm93cyIsImEiLCJiIiwiYyIsIm5ld1NsaWRlcyIsIm51bU9mU2xpZGVzIiwib3JpZ2luYWxTbGlkZXMiLCJzbGlkZXNQZXJTZWN0aW9uIiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImNyZWF0ZUVsZW1lbnQiLCJyb3ciLCJnZXQiLCJhcHBlbmRDaGlsZCIsImVtcHR5IiwiY2hlY2tSZXNwb25zaXZlIiwiaW5pdGlhbCIsImZvcmNlVXBkYXRlIiwiYnJlYWtwb2ludCIsInRhcmdldEJyZWFrcG9pbnQiLCJyZXNwb25kVG9XaWR0aCIsInRyaWdnZXJCcmVha3BvaW50Iiwic2xpZGVyV2lkdGgiLCJpbm5lcldpZHRoIiwidW5zbGljayIsInJlZnJlc2giLCJldmVudCIsImRvbnRBbmltYXRlIiwiJHRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJpbmRleE9mZnNldCIsInVuZXZlbk9mZnNldCIsInByZXZlbnREZWZhdWx0IiwiY2xvc2VzdCIsIm1lc3NhZ2UiLCJjaGVja05hdmlnYWJsZSIsIm5hdmlnYWJsZXMiLCJwcmV2TmF2aWdhYmxlIiwiZ2V0TmF2aWdhYmxlSW5kZXhlcyIsImNsZWFuVXBFdmVudHMiLCJvZmYiLCJpbnRlcnJ1cHQiLCJ2aXNpYmlsaXR5IiwiY2xlYW5VcFNsaWRlRXZlbnRzIiwib3JpZW50YXRpb25DaGFuZ2UiLCJyZXNpemUiLCJjbGVhblVwUm93cyIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsInN0b3BQcm9wYWdhdGlvbiIsImRlc3Ryb3kiLCJmYWRlU2xpZGUiLCJzbGlkZUluZGV4IiwiZmFkZVNsaWRlT3V0IiwiZmlsdGVyU2xpZGVzIiwic2xpY2tGaWx0ZXIiLCJmaWx0ZXIiLCJmb2N1c0hhbmRsZXIiLCIkc2YiLCJnZXRDdXJyZW50Iiwic2xpY2tDdXJyZW50U2xpZGUiLCJicmVha1BvaW50IiwiY291bnRlciIsInBhZ2VyUXR5IiwiZ2V0TGVmdCIsInZlcnRpY2FsSGVpZ2h0IiwidmVydGljYWxPZmZzZXQiLCJ0YXJnZXRTbGlkZSIsImNvZWYiLCJmbG9vciIsIm9mZnNldExlZnQiLCJvdXRlcldpZHRoIiwiZ2V0T3B0aW9uIiwic2xpY2tHZXRPcHRpb24iLCJvcHRpb24iLCJpbmRleGVzIiwibWF4IiwiZ2V0U2xpY2siLCJnZXRTbGlkZUNvdW50Iiwic2xpZGVzVHJhdmVyc2VkIiwic3dpcGVkU2xpZGUiLCJjZW50ZXJPZmZzZXQiLCJhYnMiLCJnb1RvIiwic2xpY2tHb1RvIiwicGFyc2VJbnQiLCJjcmVhdGlvbiIsImhhc0NsYXNzIiwic2V0UHJvcHMiLCJzdGFydExvYWQiLCJsb2FkU2xpZGVyIiwiaW5pdGlhbGl6ZUV2ZW50cyIsInVwZGF0ZUFycm93cyIsImluaXRBREEiLCJudW1Eb3RHcm91cHMiLCJ0YWJDb250cm9sSW5kZXhlcyIsInZhbCIsInNsaWRlQ29udHJvbEluZGV4IiwiYXJpYUJ1dHRvbkNvbnRyb2wiLCJtYXBwZWRTbGlkZUluZGV4IiwiZW5kIiwiaW5pdEFycm93RXZlbnRzIiwiaW5pdERvdEV2ZW50cyIsImluaXRTbGlkZUV2ZW50cyIsImluaXRVSSIsInNob3ciLCJ0YWdOYW1lIiwia2V5Q29kZSIsImxvYWRSYW5nZSIsImNsb25lUmFuZ2UiLCJyYW5nZVN0YXJ0IiwicmFuZ2VFbmQiLCJsb2FkSW1hZ2VzIiwiaW1hZ2VzU2NvcGUiLCJpbWFnZSIsImltYWdlU291cmNlIiwiaW1hZ2VTcmNTZXQiLCJpbWFnZVNpemVzIiwiaW1hZ2VUb0xvYWQiLCJvbmxvYWQiLCJvbmVycm9yIiwic2xpY2UiLCJwcmV2U2xpZGUiLCJuZXh0U2xpZGUiLCJwcm9ncmVzc2l2ZUxhenlMb2FkIiwibmV4dCIsInNsaWNrTmV4dCIsInBhdXNlIiwic2xpY2tQYXVzZSIsInBsYXkiLCJzbGlja1BsYXkiLCJwb3N0U2xpZGUiLCIkY3VycmVudFNsaWRlIiwiZm9jdXMiLCJwcmV2Iiwic2xpY2tQcmV2IiwidHJ5Q291bnQiLCIkaW1nc1RvTG9hZCIsImluaXRpYWxpemluZyIsImxhc3RWaXNpYmxlSW5kZXgiLCJjdXJyZW50QnJlYWtwb2ludCIsInJlc3BvbnNpdmVTZXR0aW5ncyIsInR5cGUiLCJzcGxpY2UiLCJzb3J0IiwiY2xlYXJUaW1lb3V0Iiwid2luZG93RGVsYXkiLCJyZW1vdmVTbGlkZSIsInNsaWNrUmVtb3ZlIiwicmVtb3ZlQmVmb3JlIiwicmVtb3ZlQWxsIiwic2V0Q1NTIiwicG9zaXRpb24iLCJwb3NpdGlvblByb3BzIiwic2V0RGltZW5zaW9ucyIsInBhZGRpbmciLCJvZmZzZXQiLCJzZXRGYWRlIiwicmlnaHQiLCJzZXRIZWlnaHQiLCJzZXRPcHRpb24iLCJzbGlja1NldE9wdGlvbiIsIml0ZW0iLCJ2YWx1ZSIsImFyZ3VtZW50cyIsIm9wdCIsImJvZHlTdHlsZSIsImJvZHkiLCJzdHlsZSIsIldlYmtpdFRyYW5zaXRpb24iLCJ1bmRlZmluZWQiLCJNb3pUcmFuc2l0aW9uIiwibXNUcmFuc2l0aW9uIiwiT1RyYW5zZm9ybSIsInBlcnNwZWN0aXZlUHJvcGVydHkiLCJ3ZWJraXRQZXJzcGVjdGl2ZSIsIk1velRyYW5zZm9ybSIsIk1velBlcnNwZWN0aXZlIiwid2Via2l0VHJhbnNmb3JtIiwibXNUcmFuc2Zvcm0iLCJ0cmFuc2Zvcm0iLCJhbGxTbGlkZXMiLCJyZW1haW5kZXIiLCJldmVuQ29lZiIsImluZmluaXRlQ291bnQiLCJjbG9uZSIsInRvZ2dsZSIsInRhcmdldEVsZW1lbnQiLCJwYXJlbnRzIiwic3luYyIsImFuaW1TbGlkZSIsIm9sZFNsaWRlIiwic2xpZGVMZWZ0IiwibmF2VGFyZ2V0IiwiaGlkZSIsInN3aXBlRGlyZWN0aW9uIiwieERpc3QiLCJ5RGlzdCIsInN3aXBlQW5nbGUiLCJzdGFydFgiLCJjdXJYIiwic3RhcnRZIiwiY3VyWSIsImF0YW4yIiwicm91bmQiLCJQSSIsInN3aXBlRW5kIiwic3dpcGVMZW5ndGgiLCJlZGdlSGl0IiwibWluU3dpcGUiLCJmaW5nZXJDb3VudCIsIm9yaWdpbmFsRXZlbnQiLCJ0b3VjaGVzIiwic3dpcGVTdGFydCIsInN3aXBlTW92ZSIsImVkZ2VXYXNIaXQiLCJjdXJMZWZ0IiwicG9zaXRpb25PZmZzZXQiLCJ2ZXJ0aWNhbFN3aXBlTGVuZ3RoIiwicGFnZVgiLCJjbGllbnRYIiwicGFnZVkiLCJjbGllbnRZIiwic3FydCIsInBvdyIsInVuZmlsdGVyU2xpZGVzIiwic2xpY2tVbmZpbHRlciIsImZyb21CcmVha3BvaW50IiwiYXJncyIsInJldCIsImFwcGx5Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7O0FBQUEsQ0FBQSxVQUFBQSxDQUFBLEVBQUE7QUFDQUEsRUFBQUEsQ0FBQSxDQUFBQyxFQUFBLENBQUFDLElBQUEsR0FBQSxVQUFBQyxJQUFBLEVBQUE7QUFDQTtBQUNBLFFBQUFDLE1BQUEsR0FBQUosQ0FBQSxDQUFBSyxNQUFBLENBQUEsRUFBQSxFQUFBO0FBQ0FDLE1BQUFBLElBQUEsRUFBQTtBQURBLEtBQUEsRUFFQUgsSUFGQSxDQUFBLENBRkEsQ0FLQTs7QUFDQSxhQUFBSSxJQUFBLENBQUFDLEdBQUEsRUFBQTtBQUNBLFVBQUFDLElBQUEsR0FBQVQsQ0FBQSxDQUFBUSxHQUFBLENBQUE7QUFDQSxVQUFBRSxTQUFBLEdBQUFELElBQUEsQ0FBQUUsSUFBQSxDQUFBLFVBQUEsQ0FBQTtBQUNBLFVBQUFDLFFBQUEsR0FBQUgsSUFBQSxDQUFBRSxJQUFBLENBQUEsYUFBQSxDQUFBO0FBQ0EsVUFBQUUsVUFBQSxHQUFBSixJQUFBLENBQUFFLElBQUEsQ0FBQSxZQUFBLENBQUE7QUFDQUQsTUFBQUEsU0FBQSxDQUFBSSxLQUFBLENBQUEsWUFBQTtBQUNBTCxRQUFBQSxJQUFBLENBQUFNLFdBQUEsQ0FBQSxhQUFBO0FBQ0FmLFFBQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQWUsV0FBQSxDQUFBLFNBQUE7QUFDQSxPQUhBO0FBSUFGLE1BQUFBLFVBQUEsQ0FBQUMs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Q0FBQSxRQUFBLENBQUEsSUFBQTlRLENBQUEsQ0FBQTZRLEVBQUEsQ0FBQSxLQUFBLEtBQUEsT0FBQTdRLENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxNQUFBLENBQUEsSUFBQSxNQUFBOVEsQ0FBQSxDQUFBOFEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBK1EsRUFBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBLEtBQUEvUSxDQUFBLENBQUE4USxPQUFBLENBQUEsa0JBQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBK1EsRUFBQSxDQUFBLFlBQUEsS0FBQSxLQUFBL1EsQ0FBQSxDQUFBOFEsT0FBQSxDQUFBLFlBQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBZ1IsS0FBQSxDQUFBLGtCQUFBLENBQUEsSUFBQSxPQUFBaFIsQ0FBQSxDQUFBOFEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBZ1IsS0FBQSxDQUFBLGVBQUEsQ0FBQSxJQUFBaFIsQ0FBQSxDQUFBZ1IsS0FBQSxDQUFBLGNBQUEsQ0FBQSxJQUFBaFIsQ0FBQSxDQUFBK1EsRUFBQSxDQUFBLFNBQUEsS0FBQSxNQUFBL1EsQ0FBQSxDQUFBOFEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBK1EsRUFBQSxDQUFBLFFBQUEsS0FBQS9RLENBQUEsQ0FBQStRLEVBQUEsQ0FBQSxXQUFBLENBQUEsSUFBQSxLQUFBL1EsQ0FBQSxDQUFBOFEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBK1EsRUFBQSxDQUFBLFNBQUEsS0FBQSxPQUFBL1EsQ0FBQSxDQUFBOFEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBK1EsRUFBQSxDQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEvUSxDQUFBLENBQUE4USxPQUFBLENBQUEsU0FBQSxDQUFBLElBQUE5USxDQUFBLENBQUErUSxFQUFBLENBQUEsT0FBQSxLQUFBLEtBQUEvUSxDQUFBLENBQUE4USxPQUFBLENBQUEsWUFBQSxDQUFBLElBQUE5USxDQUFBLENBQUErUSxFQUFBLENBQUEsV0FBQSxDQUFBLElBQUEvUSxDQUFBLENBQUErUSxFQUFBLENBQUEsU0FBQSxDQUFBLElBQUEvUSxDQUFBLENBQUErUSxFQUFBLENBQUEsT0FBQSxDQUFBLElBQUEvUSxDQUFBLENBQUErUSxFQUFBLENBQUEsUUFBQSxLQUFBLEtBQUEvUSxDQUFBLENBQUE4USxPQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsQ0FBQTlRLENBQUEsQ0FBQStRLEVBQUEsQ0FBQSxZQUFBLEtBQUEvUSxDQUFBLENBQUErUSxFQUFBLENBQUEsUUFBQSxDQUFBLEtBQUEsT0FBQS9RLENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxTQUFBLENBQUEsSUFBQTlRLENBQUEsQ0FBQWdSLEtBQUEsQ0FBQSxhQUFBLENBQUEsSUFBQWhSLENBQUEsQ0FBQStRLEVBQUEsQ0FBQSxRQUFBLEtBQUEsS0FBQS9RLENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxRQUFBLENBQUEsSUFBQTlRLENBQUEsQ0FBQStRLEVBQUEsQ0FBQSxXQUFBLEtBQUEvUSxDQUFBLENBQUErUSxFQUFBLENBQUEsWUFBQSxDQUFBLElBQUEsTUFBQS9RLENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBN1EsQ0FBQSxJQUFBLEtBQUFELENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBN1EsQ0FBQSxJQUFBLEtBQUFELENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSxDQUFBN1EsQ0FBQSxJQUFBLEtBQUFELENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxNQUFBLENBQUEsSUFBQSxDQUFBN1EsQ0FBQSxJQUFBLE1BQUFELENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxDQUFBN1EsQ0FBQSxHQUFBLEdBQUEsR0FBQUQsQ0FBQSxDQUFBNlEsRUFBQSxDQUFBLEtBQUEsS0FBQSxNQUFBN1EsQ0FBQSxDQUFBOFEsT0FBQSxDQUFBLE1BQUEsQ0FBQSxJQUFBOVEsQ0FB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QUFBLEdBQUEsS0FBQTtBQUVBO0FBRUE7QUFFQSxHQWxCQTs7QUFvQkFqYyxFQUFBQSxDQUFBLENBQUFDLEVBQUEsQ0FBQW9nQixLQUFBLEdBQUEsWUFBQTtBQUNBLFFBQUEzSixDQUFBLEdBQUEsSUFBQTtBQUFBLFFBQ0FtVixHQUFBLEdBQUFELFNBQUEsQ0FBQSxDQUFBLENBREE7QUFBQSxRQUVBZ0UsSUFBQSxHQUFBdmMsS0FBQSxDQUFBTCxTQUFBLENBQUFpVyxLQUFBLENBQUFya0IsSUFBQSxDQUFBZ25CLFNBQUEsRUFBQSxDQUFBLENBRkE7QUFBQSxRQUdBN25CLENBQUEsR0FBQTJTLENBQUEsQ0FBQWpTLE1BSEE7QUFBQSxRQUlBcEMsQ0FKQTtBQUFBLFFBS0F3dEIsR0FMQTs7QUFNQSxTQUFBeHRCLENBQUEsR0FBQSxDQUFBLEVBQUFBLENBQUEsR0FBQTBCLENBQUEsRUFBQTFCLENBQUEsRUFBQSxFQUFBO0FBQ0EsVUFBQSxRQUFBd3BCLEdBQUEsS0FBQSxRQUFBLElBQUEsT0FBQUEsR0FBQSxJQUFBLFdBQUEsRUFDQW5WLENBQUEsQ0FBQXJVLENBQUEsQ0FBQSxDQUFBZ2UsS0FBQSxHQUFBLElBQUEvSixLQUFBLENBQUFJLENBQUEsQ0FBQXJVLENBQUEsQ0FBQSxFQUFBd3BCLEdBQUEsQ0FBQSxDQURBLEtBR0FnRSxHQUFBLEdBQUFuWixDQUFBLENBQUFyVSxDQUFBLENBQUEsQ0FBQWdlLEtBQUEsQ0FBQXdMLEdBQUEsRUFBQWlFLEtBQUEsQ0FBQXBaLENBQUEsQ0FBQXJVLENBQUEsQ0FBQSxDQUFBZ2UsS0FBQSxFQUFBdVAsSUFBQSxDQUFBO0FBQ0EsVUFBQSxPQUFBQyxHQUFBLElBQUEsV0FBQSxFQUFBLE9BQUFBLEdBQUE7QUFDQTs7QUFDQSxXQUFBblosQ0FBQTtBQUNBLEdBZkE7QUFpQkEsQ0FqN0ZBLENBQUEiLCJmaWxlIjoibGliLmpzIiwic291cmNlc0NvbnRlbnQiOlsiOyhmdW5jdGlvbiAoJCkge1xyXG4gICQuZm4ubWVudSA9IGZ1bmN0aW9uIChvcHRzKSB7XHJcbiAgICAvLyBkZWZhdWx0IGNvbmZpZ3VyYXRpb25cclxuICAgIHZhciBjb25maWcgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICBvcHQxOiBudWxsXHJcbiAgICB9LCBvcHRzKTtcclxuICAgIC8vIG1haW4gZnVuY3Rpb25cclxuICAgIGZ1bmN0aW9uIGluaXQob2JqKSB7XHJcbiAgICAgIHZhciBkT2JqID0gJChvYmopO1xyXG4gICAgICB2YXIgZE1lbnVsaW5rID0gZE9iai5maW5kKCcubmF2LWJ0bicpO1xyXG4gICAgICB2YXIgZEFsbExpbmsgPSBkT2JqLmZpbmQoJy5uYXYtbWVudSBhJyk7XHJcbiAgICAgIHZhciBkTWVudUNsb3NlID0gZE9iai5maW5kKCcubmF2LWNsb3NlJyk7XHJcbiAgICAgIGRNZW51bGluay5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZE9iai50b2dnbGVDbGFzcygnbmF2LS1hY3RpdmUnKTtcclxuICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ19mcmVlemUnKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGRNZW51Q2xvc2UuY2xpY2soZnVuY3Rpb24gKCkgeyBcclxuICAgICAgICBkT2JqLnJlbW92ZUNsYXNzKFwibmF2LS1hY3RpdmVcIik7XHJcbiAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdfZnJlZXplJyk7XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBkQWxsTGluay5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZE9iai5yZW1vdmVDbGFzcygnbmF2LS1hY3RpdmUnKVxyXG4gICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnX2ZyZWV6ZScpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIGluaXRpYWxpemUgZXZlcnkgZWxlbWVudFxyXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGluaXQoJCh0aGlzKSk7XHJcbiAgICB9KTtcclxuICB9O1xyXG4gIC8vIHN0YXJ0XHJcbiAgXHJcbn0pKGpRdWVyeSk7XHJcbiIsIjsgKGZ1bmN0aW9uICgkKSB7XHJcblx0JC5mbi5sb2FkcGFnZSA9IGZ1bmN0aW9uIChhY3Rpb24sIG9wdHMpIHtcclxuXHRcdGFjdGlvbiA9IGFjdGlvbiA/IGFjdGlvbiA6IFwiaW5pdFwiO1xyXG5cdFx0dmFyIHByb2dyZXNzVmFsdWUgPSAwO1xyXG5cdFx0dmFyIGxvYWRIdG1sID0gW1xyXG5cdFx0XHQnPGRpdiBjbGFzcz1cIm1kTG9hZGluZ1wiPicsXHJcblx0XHRcdCcgICAgPGRpdiBjbGFzcz1cImxvYWRpbmdCb3hcIj4nLFxyXG5cdFx0XHQnICAgICAgICA8aW1nIGNsYXNzPVwibG9hZHBpY1wiIHNyYz1cImltYWdlcy9sb2FkLXBpYy5naWZcIj4nLFxyXG5cdFx0XHQvLyAnICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3NCYXJcIj4nLFxyXG5cdFx0XHQvLyAnICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzIGpzLWJhclwiIHN0eWxlPVwid2lkdGg6MFwiPjwvZGl2PicsXHJcblx0XHRcdC8vICcgICAgICAgIDwvZGl2PicsXHJcblx0XHRcdCcgICAgPC9kaXY+JyxcclxuXHRcdFx0JzwvZGl2PidcclxuXHRcdF0uam9pbignJyk7XHJcblx0XHR2YXIgZExvYWQsZENvdW50LGRCYXI7XHJcblx0XHR2YXIgY29uZmlnID0gJC5leHRlbmQoe1xyXG5cdFx0XHRhc3luYzpmYWxzZVxyXG5cdFx0fSwgb3B0cyk7XHJcblx0XHRcclxuXHRcdGZ1bmN0aW9uIGluaXQob2JqKSB7XHJcblx0XHRcdCQobG9hZEh0bWwpLmFwcGVuZFRvKCdib2R5Jyk7XHJcblx0XHRcdGRMb2FkID0gb2JqLmZpbmQoJy5tZExvYWRpbmcnKTtcclxuXHRcdFx0ZENvdW50ID0gZExvYWQuZmluZCgnLmpzLWNvdW50Jyk7XHJcblx0XHRcdGRCYXIgPSBkTG9hZC5maW5kKCcuanMtYmFyJyk7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KXtcclxuXHRcdFx0XHRpZiAoIWNvbmZpZy5hc3luYykge1xyXG5cdFx0XHRcdFx0dmFyIHF1ZXVlID0gbmV3IGNyZWF0ZWpzLkxvYWRRdWV1ZSgpO1xyXG5cdFx0XHRcdFx0cXVldWUuc2V0TWF4Q29ubmVjdGlvbnMoMjAwKTtcclxuXHRcdFx0XHRcdHZhciBsb2FkQXJyYXkgPSBbXTtcclxuXHRcdFx0XHRcdG9iai5maW5kKFwiaW1nXCIpLmVhY2goZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHRcdFx0bG9hZEFycmF5LnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdGlkOiBpLFxyXG5cdFx0XHRcdFx0XHRcdHNyYzogJCh0aGlzKS5hdHRyKFwic3JjXCIpXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdHF1ZXVlLmxvYWRNYW5pZmVzdChsb2FkQXJyYXkpO1xyXG5cclxuXHRcdFx0XHRcdHZhciBoYW5kbGVDb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0XHRcdCQod2luZG93KS50cmlnZ2VyKFwibG9hZENvbXBsZXRlZFwiKTtcclxuXHRcdFx0XHRcdFx0JCgnLmpzLXdyYXAnKS5jc3MoeyAndmlzaWJpbGl0eSc6ICd2aXNpYmxlJyB9KTtcclxuXHRcdFx0XHRcdFx0VHdlZW5NYXguZnJvbVRvKGRMb2FkLCAwLjUsIHsgb3BhY2l0eTogMSB9LCB7XHJcblx0XHRcdFx0XHRcdFx0ZGVsYXk6IC44LFxyXG5cdFx0XHRcdFx0XHRcdG9wYWNpdHk6IDAsIGVhc2U6IFBvd2VyNC5lYXNlT3V0LCBvbkNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkTG9hZC5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUodHJ1ZSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHQgICBcclxuXHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0cXVldWUub24oXCJwcm9ncmVzc1wiLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdHZhciBwcm9jVmFsdWUgPSBNYXRoLm1pbihNYXRoLmNlaWwocXVldWUucHJvZ3Jlc3MgKiAxMDApLCAxMDApO1xyXG5cdFx0XHRcdFx0XHRkQ291bnQudGV4dChwcm9jVmFsdWUgKyAnJScpO1xyXG5cdFx0XHRcdFx0XHRkQmFyLmNzcyh7XHJcblx0XHRcdFx0XHRcdFx0J3dpZHRoJzogcHJvY1ZhbHVlICsgJyUnXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0cXVldWUub24oXCJjb21wbGV0ZVwiLCBoYW5kbGVDb21wbGV0ZSwgdGhpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0aWYoYWN0aW9uID09ICdpbml0Jyl7XHJcblx0XHRcdHJldHVybiBpbml0KCQodGhpcykpO1x0XHJcblx0XHR9XHJcblx0XHRpZiAoYWN0aW9uID09ICdjbG9zZScpIHtcclxuXHRcdFx0ZExvYWQgPSAkKHRoaXMpLmZpbmQoJy5tZExvYWRpbmcnKTtcclxuXHRcdFx0ZENvdW50ID0gZExvYWQuZmluZCgnLmpzLWNvdW50Jyk7XHJcblx0XHRcdGRCYXIgPSBkTG9hZC5maW5kKCcuanMtYmFyJyk7XHJcblx0XHRcdGRDb3VudC50ZXh0KCcxMDAlJyk7XHJcblx0XHRcdGRCYXIuY3NzKHtcclxuXHRcdFx0XHQnd2lkdGgnOicxMDAlJ1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0VHdlZW5NYXguZnJvbVRvKGRMb2FkLCAwLjUsIHsgb3BhY2l0eTogMSB9LCB7XHJcblx0XHRcdFx0ZGVsYXk6IC44LFxyXG5cdFx0XHRcdG9wYWNpdHk6IDAsIGVhc2U6IFBvd2VyNC5lYXNlT3V0LCBvbkNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRkTG9hZC5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxufSkoalF1ZXJ5KTsiLCJcInVzZSBzdHJpY3RcIjshZnVuY3Rpb24obCxtKXtsKGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbih2LHcpe3JldHVybiBudWxsIT12JiZudWxsIT13JiZ2LnRvTG93ZXJDYXNlKCk9PT13LnRvTG93ZXJDYXNlKCl9ZnVuY3Rpb24gbyh2LHcpe3ZhciB4LHksej12Lmxlbmd0aDtpZighenx8IXcpcmV0dXJuITE7Zm9yKHg9dy50b0xvd2VyQ2FzZSgpLHk9MDt5PHo7Kyt5KWlmKHg9PT12W3ldLnRvTG93ZXJDYXNlKCkpcmV0dXJuITA7cmV0dXJuITF9ZnVuY3Rpb24gcCh2KXtmb3IodmFyIHcgaW4gdil1LmNhbGwodix3KSYmKHZbd109bmV3IFJlZ0V4cCh2W3ddLFwiaVwiKSl9ZnVuY3Rpb24gcSh2KXtyZXR1cm4odnx8XCJcIikuc3Vic3RyKDAsNTAwKX1mdW5jdGlvbiByKHYsdyl7dGhpcy51YT1xKHYpLHRoaXMuX2NhY2hlPXt9LHRoaXMubWF4UGhvbmVXaWR0aD13fHw2MDB9dmFyIHM9e21vYmlsZURldGVjdFJ1bGVzOntwaG9uZXM6e2lQaG9uZTpcIlxcXFxiaVBob25lXFxcXGJ8XFxcXGJpUG9kXFxcXGJcIixCbGFja0JlcnJ5OlwiQmxhY2tCZXJyeXxcXFxcYkJCMTBcXFxcYnxyaW1bMC05XStcIixIVEM6XCJIVEN8SFRDLiooU2Vuc2F0aW9ufEV2b3xWaXNpb258RXhwbG9yZXJ8NjgwMHw4MTAwfDg5MDB8QTcyNzJ8UzUxMGV8QzExMGV8TGVnZW5kfERlc2lyZXxUODI4Mil8QVBYNTE1Q0tUfFF0ZWs5MDkwfEFQQTkyOTJLVHxIRF9taW5pfFNlbnNhdGlvbi4qWjcxMGV8UEc4NjEwMHxaNzE1ZXxEZXNpcmUuKihBODE4MXxIRCl8QURSNjIwMHxBRFI2NDAwTHxBRFI2NDI1fDAwMUhUfEluc3BpcmUgNEd8QW5kcm9pZC4qXFxcXGJFVk9cXFxcYnxULU1vYmlsZSBHMXxaNTIwbXxBbmRyb2lkIFswLTkuXSs7IFBpeGVsXCIsTmV4dXM6XCJOZXh1cyBPbmV8TmV4dXMgU3xHYWxheHkuKk5leHVzfEFuZHJvaWQuKk5leHVzLipNb2JpbGV8TmV4dXMgNHxOZXh1cyA1fE5leHVzIDZcIixEZWxsOlwiRGVsbFs7XT8gKFN0cmVha3xBZXJvfFZlbnVlfFZlbnVlIFByb3xGbGFzaHxTbW9rZXxNaW5pIDNpWCl8WENEMjh8WENEMzV8XFxcXGIwMDFETFxcXFxifFxcXFxiMTAxRExcXFxcYnxcXFxcYkdTMDFcXFxcYlwiLE1vdG9yb2xhOlwiTW90b3JvbGF8RFJPSURYfERST0lEIEJJT05JQ3xcXFxcYkRyb2lkXFxcXGIuKkJ1aWxkfEFuZHJvaWQuKlhvb218SFJJMzl8TU9ULXxBMTI2MHxBMTY4MHxBNTU1fEE4NTN8QTg1NXxBOTUzfEE5NTV8QTk1NnxNb3Rvcm9sYS4qRUxFQ1RSSUZZfE1vdG9yb2xhLippMXxpODY3fGk5NDB8TUIyMDB8TUIzMDB8TUI1MDF8TUI1MDJ8TUI1MDh8TUI1MTF8TUI1MjB8TUI1MjV8TUI1MjZ8TUI2MTF8TUI2MTJ8TUI2MzJ8TUI4MTB8TUI4NTV8TUI4NjB8TUI4NjF8TUI4NjV8TUI4NzB8TUU1MDF8TUU1MDJ8TUU1MTF8TUU1MjV8TUU2MDB8TUU2MzJ8TUU3MjJ8TUU4MTF8TUU4NjB8TUU4NjN8TUU4NjV8TVQ2MjB8TVQ3MTB8TVQ3MTZ8TVQ3MjB8TVQ4MTB8TVQ4NzB8TVQ5MTd8TW90b3JvbGEuKlRJVEFOSVVNfFdYNDM1fFdYNDQ1fFhUMzAwfFhUMzAxfFhUMzExfFhUMzE2fFhUMzE3fFhUMzE5fFhUMzIwfFhUMzkwfFhUNTAyfFhUNTMwfFhUNTMxfFhUNTMyfFhUNTM1fFhUNjAzfFhUNjEwfFhUNjExfFhUNjE1fFhUNjgxfFhUNzAxfFhUNzAyfFhUNzExfFhUNzIwfFhUODAwfFhUODA2fFhUODYwfFhUODYyfFhUODc1fFhUODgyfFhUODgzfFhUODk0fFhUOTAxfFhUOTA3fFhUOTA5fFhUOTEwfFhUOTEyfFhUOTI4fFhUOTI2fFhUOTE1fFhUOTE5fFhUOTI1fFhUMTAyMXxcXFxcYk1vdG8gRVxcXFxifFhUMTA2OHxYVDEwOTJ8WFQxMDUyXCIsU2Ftc3VuZzpcIlxcXFxiU2Ftc3VuZ1xcXFxifFNNLUc5NTBGfFNNLUc5NTVGfFNNLUc5MjUwfEdULTE5MzAwfFNHSC1JMzM3fEJHVC1TNTIzMHxHVC1CMjEwMHxHVC1CMjcwMHxHVC1CMjcxMHxHVC1CMzIxMHxHVC1CMzMxMHxHVC1CMzQxMHxHVC1CMzczMHxHVC1CMzc0MHxHVC1CNTUxMHxHVC1CNTUxMnxHVC1CNTcyMnxHVC1CNjUyMHxHVC1CNzMwMHxHVC1CNzMyMHxHVC1CNzMzMHxHVC1CNzM1MHxHVC1CNzUxMHxHVC1CNzcyMnxHVC1CNzgwMHxHVC1DMzAxMHxHVC1DMzAxMXxHVC1DMzA2MHxHVC1DMzIwMHxHVC1DMzIxMnxHVC1DMzIxMkl8R1QtQzMyNjJ8R1QtQzMyMjJ8R1QtQzMzMDB8R1QtQzMzMDBLfEdULUMzMzAzfEdULUMzMzAzS3xHVC1DMzMxMHxHVC1DMzMyMnxHVC1DMzMzMHxHVC1DMzM1MHxHVC1DMzUwMHxHVC1DMzUxMHxHVC1DMzUzMHxHVC1DMzYzMHxHVC1DMzc4MHxHVC1DNTAxMHxHVC1DNTIxMnxHVC1DNjYyMHxHVC1DNjYyNXxHVC1DNjcxMnxHVC1FMTA1MHxHVC1FMTA3MHxHVC1FMTA3NXxHVC1FMTA4MHxHVC1FMTA4MXxHVC1FMTA4NXxHVC1FMTA4N3xHVC1FMTEwMHxHVC1FMTEwN3xHVC1FMTExMHxHVC1FMTEyMHxHVC1FMTEyNXxHVC1FMTEzMHxHVC1FMTE2MHxHVC1FMTE3MHxHVC1FMTE3NXxHVC1FMTE4MHxHVC1FMTE4MnxHVC1FMTIwMHxHVC1FMTIxMHxHVC1FMTIyNXxHVC1FMTIzMHxHVC1FMTM5MHxHVC1FMjEwMHxHVC1FMjEyMHxHVC1FMjEyMXxHVC1FMjE1MnxHVC1FMjIyMHxHVC1FMjIyMnxHVC1FMjIzMHxHVC1FMjIzMnxHVC1FMjI1MHxHVC1FMjM3MHxHVC1FMjU1MHxHVC1FMjY1MnxHVC1FMzIxMHxHVC1FMzIxM3xHVC1JNTUwMHxHVC1JNTUwM3xHVC1JNTcwMHxHVC1JNTgwMHxHVC1JNTgwMXxHVC1JNjQxMHxHVC1JNjQyMHxHVC1JNzExMHxHVC1JNzQxMHxHVC1JNzUwMHxHVC1JODAwMHxHVC1JODE1MHxHVC1JODE2MHxHVC1JODE5MHxHVC1JODMyMHxHVC1JODMzMHxHVC1JODM1MHxHVC1JODUzMHxHVC1JODcwMHxHVC1JODcwM3xHVC1JODkxMHxHVC1JOTAwMHxHVC1JOTAwMXxHVC1JOTAwM3xHVC1JOTAxMHxHVC1JOTAyMHxHVC1JOTAyM3xHVC1JOTA3MHxHVC1JOTA4MnxHVC1JOTEwMHxHVC1JOTEwM3xHVC1JOTIyMHxHVC1JOTI1MHxHVC1JOTMwMHxHVC1JOTMwNXxHVC1JOTUwMHxHVC1JOTUwNXxHVC1NMzUxMHxHVC1NNTY1MHxHVC1NNzUwMHxHVC1NNzYwMHxHVC1NNzYwM3xHVC1NODgwMHxHVC1NODkxMHxHVC1ONzAwMHxHVC1TMzExMHxHVC1TMzMxMHxHVC1TMzM1MHxHVC1TMzM1M3xHVC1TMzM3MHxHVC1TMzY1MHxHVC1TMzY1M3xHVC1TMzc3MHxHVC1TMzg1MHxHVC1TNTIxMHxHVC1TNTIyMHxHVC1TNTIyOXxHVC1TNTIzMHxHVC1TNTIzM3xHVC1TNTI1MHxHVC1TNTI1M3xHVC1TNTI2MHxHVC1TNTI2M3xHVC1TNTI3MHxHVC1TNTMwMHxHVC1TNTMzMHxHVC1TNTM1MHxHVC1TNTM2MHxHVC1TNTM2M3xHVC1TNTM2OXxHVC1TNTM4MHxHVC1TNTM4MER8R1QtUzU1NjB8R1QtUzU1NzB8R1QtUzU2MDB8R1QtUzU2MDN8R1QtUzU2MTB8R1QtUzU2MjB8R1QtUzU2NjB8R1QtUzU2NzB8R1QtUzU2OTB8R1QtUzU3NTB8R1QtUzU3ODB8R1QtUzU4MzB8R1QtUzU4Mzl8R1QtUzYxMDJ8R1QtUzY1MDB8R1QtUzcwNzB8R1QtUzcyMDB8R1QtUzcyMjB8R1QtUzcyMzB8R1QtUzcyMzN8R1QtUzcyNTB8R1QtUzc1MDB8R1QtUzc1MzB8R1QtUzc1NTB8R1QtUzc1NjJ8R1QtUzc3MTB8R1QtUzgwMDB8R1QtUzgwMDN8R1QtUzg1MDB8R1QtUzg1MzB8R1QtUzg2MDB8U0NILUEzMTB8U0NILUE1MzB8U0NILUE1NzB8U0NILUE2MTB8U0NILUE2MzB8U0NILUE2NTB8U0NILUE3OTB8U0NILUE3OTV8U0NILUE4NTB8U0NILUE4NzB8U0NILUE4OTB8U0NILUE5MzB8U0NILUE5NTB8U0NILUE5NzB8U0NILUE5OTB8U0NILUkxMDB8U0NILUkxMTB8U0NILUk0MDB8U0NILUk0MDV8U0NILUk1MDB8U0NILUk1MTB8U0NILUk1MTV8U0NILUk2MDB8U0NILUk3MzB8U0NILUk3NjB8U0NILUk3NzB8U0NILUk4MzB8U0NILUk5MTB8U0NILUk5MjB8U0NILUk5NTl8U0NILUxDMTF8U0NILU4xNTB8U0NILU4zMDB8U0NILVIxMDB8U0NILVIzMDB8U0NILVIzNTF8U0NILVI0MDB8U0NILVI0MTB8U0NILVQzMDB8U0NILVUzMTB8U0NILVUzMjB8U0NILVUzNTB8U0NILVUzNjB8U0NILVUzNjV8U0NILVUzNzB8U0NILVUzODB8U0NILVU0MTB8U0NILVU0MzB8U0NILVU0NTB8U0NILVU0NjB8U0NILVU0NzB8U0NILVU0OTB8U0NILVU1NDB8U0NILVU1NTB8U0NILVU2MjB8U0NILVU2NDB8U0NILVU2NTB8U0NILVU2NjB8U0NILVU3MDB8U0NILVU3NDB8U0NILVU3NTB8U0NILVU4MTB8U0NILVU4MjB8U0NILVU5MDB8U0NILVU5NDB8U0NILVU5NjB8U0NTLTI2VUN8U0dILUExMDd8U0dILUExMTd8U0dILUExMjd8U0dILUExMzd8U0dILUExNTd8U0dILUExNjd8U0dILUExNzd8U0dILUExODd8U0dILUExOTd8U0dILUEyMjd8U0dILUEyMzd8U0dILUEyNTd8U0dILUE0Mzd8U0dILUE1MTd8U0dILUE1OTd8U0dILUE2Mzd8U0dILUE2NTd8U0dILUE2Njd8U0dILUE2ODd8U0dILUE2OTd8U0dILUE3MDd8U0dILUE3MTd8U0dILUE3Mjd8U0dILUE3Mzd8U0dILUE3NDd8U0dILUE3Njd8U0dILUE3Nzd8U0dILUE3OTd8U0dILUE4MTd8U0dILUE4Mjd8U0dILUE4Mzd8U0dILUE4NDd8U0dILUE4Njd8U0dILUE4Nzd8U0dILUE4ODd8U0dILUE4OTd8U0dILUE5Mjd8U0dILUIxMDB8U0dILUIxMzB8U0dILUIyMDB8U0dILUIyMjB8U0dILUMxMDB8U0dILUMxMTB8U0dILUMxMjB8U0dILUMxMzB8U0dILUMxNDB8U0dILUMxNjB8U0dILUMxNzB8U0dILUMxODB8U0dILUMyMDB8U0dILUMyMDd8U0dILUMyMTB8U0dILUMyMjV8U0dILUMyMzB8U0dILUM0MTd8U0dILUM0NTB8U0dILUQzMDd8U0dILUQzNDd8U0dILUQzNTd8U0dILUQ0MDd8U0dILUQ0MTV8U0dILUQ3ODB8U0dILUQ4MDd8U0dILUQ5ODB8U0dILUUxMDV8U0dILUUyMDB8U0dILUUzMTV8U0dILUUzMTZ8U0dILUUzMTd8U0dILUUzMzV8U0dILUU1OTB8U0dILUU2MzV8U0dILUU3MTV8U0dILUU4OTB8U0dILUYzMDB8U0dILUY0ODB8U0dILUkyMDB8U0dILUkzMDB8U0dILUkzMjB8U0dILUk1NTB8U0dILUk1Nzd8U0dILUk2MDB8U0dILUk2MDd8U0dILUk2MTd8U0dILUk2Mjd8U0dILUk2Mzd8U0dILUk2Nzd8U0dILUk3MDB8U0dILUk3MTd8U0dILUk3Mjd8U0dILWk3NDdNfFNHSC1JNzc3fFNHSC1JNzgwfFNHSC1JODI3fFNHSC1JODQ3fFNHSC1JODU3fFNHSC1JODk2fFNHSC1JODk3fFNHSC1JOTAwfFNHSC1JOTA3fFNHSC1JOTE3fFNHSC1JOTI3fFNHSC1JOTM3fFNHSC1JOTk3fFNHSC1KMTUwfFNHSC1KMjAwfFNHSC1MMTcwfFNHSC1MNzAwfFNHSC1NMTEwfFNHSC1NMTUwfFNHSC1NMjAwfFNHSC1OMTA1fFNHSC1ONTAwfFNHSC1ONjAwfFNHSC1ONjIwfFNHSC1ONjI1fFNHSC1ONzAwfFNHSC1ONzEwfFNHSC1QMTA3fFNHSC1QMjA3fFNHSC1QMzAwfFNHSC1QMzEwfFNHSC1QNTIwfFNHSC1QNzM1fFNHSC1QNzc3fFNHSC1RMTA1fFNHSC1SMjEwfFNHSC1SMjIwfFNHSC1SMjI1fFNHSC1TMTA1fFNHSC1TMzA3fFNHSC1UMTA5fFNHSC1UMTE5fFNHSC1UMTM5fFNHSC1UMjA5fFNHSC1UMjE5fFNHSC1UMjI5fFNHSC1UMjM5fFNHSC1UMjQ5fFNHSC1UMjU5fFNHSC1UMzA5fFNHSC1UMzE5fFNHSC1UMzI5fFNHSC1UMzM5fFNHSC1UMzQ5fFNHSC1UMzU5fFNHSC1UMzY5fFNHSC1UMzc5fFNHSC1UNDA5fFNHSC1UNDI5fFNHSC1UNDM5fFNHSC1UNDU5fFNHSC1UNDY5fFNHSC1UNDc5fFNHSC1UNDk5fFNHSC1UNTA5fFNHSC1UNTE5fFNHSC1UNTM5fFNHSC1UNTU5fFNHSC1UNTg5fFNHSC1UNjA5fFNHSC1UNjE5fFNHSC1UNjI5fFNHSC1UNjM5fFNHSC1UNjU5fFNHSC1UNjY5fFNHSC1UNjc5fFNHSC1UNzA5fFNHSC1UNzE5fFNHSC1UNzI5fFNHSC1UNzM5fFNHSC1UNzQ2fFNHSC1UNzQ5fFNHSC1UNzU5fFNHSC1UNzY5fFNHSC1UODA5fFNHSC1UODE5fFNHSC1UODM5fFNHSC1UOTE5fFNHSC1UOTI5fFNHSC1UOTM5fFNHSC1UOTU5fFNHSC1UOTg5fFNHSC1VMTAwfFNHSC1VMjAwfFNHSC1VODAwfFNHSC1WMjA1fFNHSC1WMjA2fFNHSC1YMTAwfFNHSC1YMTA1fFNHSC1YMTIwfFNHSC1YMTQwfFNHSC1YNDI2fFNHSC1YNDI3fFNHSC1YNDc1fFNHSC1YNDk1fFNHSC1YNDk3fFNHSC1YNTA3fFNHSC1YNjAwfFNHSC1YNjEwfFNHSC1YNjIwfFNHSC1YNjMwfFNHSC1YNzAwfFNHSC1YODIwfFNHSC1YODkwfFNHSC1aMTMwfFNHSC1aMTUwfFNHSC1aMTcwfFNHSC1aWDEwfFNHSC1aWDIwfFNIVy1NMTEwfFNQSC1BMTIwfFNQSC1BNDAwfFNQSC1BNDIwfFNQSC1BNDYwfFNQSC1BNTAwfFNQSC1BNTYwfFNQSC1BNjAwfFNQSC1BNjIwfFNQSC1BNjYwfFNQSC1BNzAwfFNQSC1BNzQwfFNQSC1BNzYwfFNQSC1BNzkwfFNQSC1BODAwfFNQSC1BODIwfFNQSC1BODQwfFNQSC1BODgwfFNQSC1BOTAwfFNQSC1BOTQwfFNQSC1BOTYwfFNQSC1ENjAwfFNQSC1ENzAwfFNQSC1ENzEwfFNQSC1ENzIwfFNQSC1JMzAwfFNQSC1JMzI1fFNQSC1JMzMwfFNQSC1JMzUwfFNQSC1JNTAwfFNQSC1JNjAwfFNQSC1JNzAwfFNQSC1MNzAwfFNQSC1NMTAwfFNQSC1NMjIwfFNQSC1NMjQwfFNQSC1NMzAwfFNQSC1NMzA1fFNQSC1NMzIwfFNQSC1NMzMwfFNQSC1NMzUwfFNQSC1NMzYwfFNQSC1NMzcwfFNQSC1NMzgwfFNQSC1NNTEwfFNQSC1NNTQwfFNQSC1NNTUwfFNQSC1NNTYwfFNQSC1NNTcwfFNQSC1NNTgwfFNQSC1NNjEwfFNQSC1NNjIwfFNQSC1NNjMwfFNQSC1NODAwfFNQSC1NODEwfFNQSC1NODUwfFNQSC1NOTAwfFNQSC1NOTEwfFNQSC1NOTIwfFNQSC1NOTMwfFNQSC1OMTAwfFNQSC1OMjAwfFNQSC1OMjQwfFNQSC1OMzAwfFNQSC1ONDAwfFNQSC1aNDAwfFNXQy1FMTAwfFNDSC1pOTA5fEdULU43MTAwfEdULU43MTA1fFNDSC1JNTM1fFNNLU45MDBBfFNHSC1JMzE3fFNHSC1UOTk5THxHVC1TNTM2MEJ8R1QtSTgyNjJ8R1QtUzY4MDJ8R1QtUzYzMTJ8R1QtUzYzMTB8R1QtUzUzMTJ8R1QtUzUzMTB8R1QtSTkxMDV8R1QtSTg1MTB8R1QtUzY3OTBOfFNNLUc3MTA1fFNNLU45MDA1fEdULVM1MzAxfEdULUk5Mjk1fEdULUk5MTk1fFNNLUMxMDF8R1QtUzczOTJ8R1QtUzc1NjB8R1QtQjc2MTB8R1QtSTU1MTB8R1QtUzc1ODJ8R1QtUzc1MzBFfEdULUk4NzUwfFNNLUc5MDA2VnxTTS1HOTAwOFZ8U00tRzkwMDlEfFNNLUc5MDBBfFNNLUc5MDBEfFNNLUc5MDBGfFNNLUc5MDBIfFNNLUc5MDBJfFNNLUc5MDBKfFNNLUc5MDBLfFNNLUc5MDBMfFNNLUc5MDBNfFNNLUc5MDBQfFNNLUc5MDBSNHxTTS1HOTAwU3xTTS1HOTAwVHxTTS1HOTAwVnxTTS1HOTAwVzh8U0hWLUUxNjBLfFNDSC1QNzA5fFNDSC1QNzI5fFNNLVQyNTU4fEdULUk5MjA1fFNNLUc5MzUwfFNNLUoxMjBGfFNNLUc5MjBGfFNNLUc5MjBWfFNNLUc5MzBGfFNNLU45MTBDfFNNLUEzMTBGfEdULUk5MTkwfFNNLUo1MDBGTnxTTS1HOTAzRnxTTS1KMzMwRlwiLExHOlwiXFxcXGJMR1xcXFxiO3xMR1stIF0/KEM4MDB8QzkwMHxFNDAwfEU2MTB8RTkwMHxFLTkwMHxGMTYwfEYxODBLfEYxODBMfEYxODBTfDczMHw4NTV8TDE2MHxMUzc0MHxMUzg0MHxMUzk3MHxMVTYyMDB8TVM2OTB8TVM2OTV8TVM3NzB8TVM4NDB8TVM4NzB8TVM5MTB8UDUwMHxQNzAwfFA3MDV8Vk02OTZ8QVM2ODB8QVM2OTV8QVg4NDB8QzcyOXxFOTcwfEdTNTA1fDI3MnxDMzk1fEU3MzlCS3xFOTYwfEw1NUN8TDc1Q3xMUzY5NnxMUzg2MHxQNzY5Qkt8UDM1MHxQNTAwfFA1MDl8UDg3MHxVTjI3MnxVUzczMHxWUzg0MHxWUzk1MHxMTjI3MnxMTjUxMHxMUzY3MHxMUzg1NXxMVzY5MHxNTjI3MHxNTjUxMHxQNTA5fFA3Njl8UDkzMHxVTjIwMHxVTjI3MHxVTjUxMHxVTjYxMHxVUzY3MHxVUzc0MHxVUzc2MHxVWDI2NXxVWDg0MHxWTjI3MXxWTjUzMHxWUzY2MHxWUzcwMHxWUzc0MHxWUzc1MHxWUzkxMHxWUzkyMHxWUzkzMHxWWDkyMDB8VlgxMTAwMHxBWDg0MEF8TFc3NzB8UDUwNnxQOTI1fFA5OTl8RTYxMnxEOTU1fEQ4MDJ8TVMzMjN8TTI1NylcIixTb255OlwiU29ueVNUfFNvbnlMVHxTb255RXJpY3Nzb258U29ueUVyaWNzc29uTFQxNWl2fExUMThpfEUxMGl8TFQyOGh8TFQyNnd8U29ueUVyaWNzc29uTVQyN2l8QzUzMDN8QzY5MDJ8QzY5MDN8QzY5MDZ8QzY5NDN8RDI1MzNcIixBc3VzOlwiQXN1cy4qR2FsYXh5fFBhZEZvbmUuKk1vYmlsZVwiLE5va2lhTHVtaWE6XCJMdW1pYSBbMC05XXszLDR9XCIsTWljcm9tYXg6XCJNaWNyb21heC4qXFxcXGIoQTIxMHxBOTJ8QTg4fEE3MnxBMTExfEExMTBRfEExMTV8QTExNnxBMTEwfEE5MFN8QTI2fEE1MXxBMzV8QTU0fEEyNXxBMjd8QTg5fEE2OHxBNjV8QTU3fEE5MClcXFxcYlwiLFBhbG06XCJQYWxtU291cmNlfFBhbG1cIixWZXJ0dTpcIlZlcnR1fFZlcnR1LipMdGR8VmVydHUuKkFzY2VudHxWZXJ0dS4qQXl4dGF8VmVydHUuKkNvbnN0ZWxsYXRpb24oRnxRdWVzdCk/fFZlcnR1LipNb25pa2F8VmVydHUuKlNpZ25hdHVyZVwiLFBhbnRlY2g6XCJQQU5URUNIfElNLUE4NTBTfElNLUE4NDBTfElNLUE4MzBMfElNLUE4MzBLfElNLUE4MzBTfElNLUE4MjBMfElNLUE4MTBLfElNLUE4MTBTfElNLUE4MDBTfElNLVQxMDBLfElNLUE3MjVMfElNLUE3ODBMfElNLUE3NzVDfElNLUE3NzBLfElNLUE3NjBTfElNLUE3NTBLfElNLUE3NDBTfElNLUE3MzBTfElNLUE3MjBMfElNLUE3MTBLfElNLUE2OTBMfElNLUE2OTBTfElNLUE2NTBTfElNLUE2MzBLfElNLUE2MDBTfFZFR0EgUFRMMjF8UFQwMDN8UDgwMTB8QURSOTEwTHxQNjAzMHxQNjAyMHxQOTA3MHxQNDEwMHxQOTA2MHxQNTAwMHxDRE04OTkyfFRYVDgwNDV8QURSODk5NXxJUzExUFR8UDIwMzB8UDYwMTB8UDgwMDB8UFQwMDJ8SVMwNnxDRE04OTk5fFA5MDUwfFBUMDAxfFRYVDgwNDB8UDIwMjB8UDkwMjB8UDIwMDB8UDcwNDB8UDcwMDB8Qzc5MFwiLEZseTpcIklRMjMwfElRNDQ0fElRNDUwfElRNDQwfElRNDQyfElRNDQxfElRMjQ1fElRMjU2fElRMjM2fElRMjU1fElRMjM1fElRMjQ1fElRMjc1fElRMjQwfElRMjg1fElRMjgwfElRMjcwfElRMjYwfElRMjUwXCIsV2lrbzpcIktJVEUgNEd8SElHSFdBWXxHRVRBV0FZfFNUQUlSV0FZfERBUktTSURFfERBUktGVUxMfERBUktOSUdIVHxEQVJLTU9PTnxTTElERXxXQVggNEd8UkFJTkJPV3xCTE9PTXxTVU5TRVR8R09BKD8hbm5hKXxMRU5OWXxCQVJSWXxJR0dZfE9aWll8Q0lOSyBGSVZFfENJTksgUEVBWHxDSU5LIFBFQVggMnxDSU5LIFNMSU18Q0lOSyBTTElNIDJ8Q0lOSyArfENJTksgS0lOR3xDSU5LIFBFQVh8Q0lOSyBTTElNfFNVQkxJTVwiLGlNb2JpbGU6XCJpLW1vYmlsZSAoSVF8aS1TVFlMRXxpZGVhfFpBQXxIaXR6KVwiLFNpbVZhbGxleTpcIlxcXFxiKFNQLTgwfFhULTkzMHxTWC0zNDB8WFQtOTMwfFNYLTMxMHxTUC0zNjB8U1A2MHxTUFQtODAwfFNQLTEyMHxTUFQtODAwfFNQLTE0MHxTUFgtNXxTUFgtOHxTUC0xMDB8U1BYLTh8U1BYLTEyKVxcXFxiXCIsV29sZmdhbmc6XCJBVC1CMjREfEFULUFTNTBIRHxBVC1BUzQwV3xBVC1BUzU1SER8QVQtQVM0NXEyfEFULUIyNkR8QVQtQVM1MFFcIixBbGNhdGVsOlwiQWxjYXRlbFwiLE5pbnRlbmRvOlwiTmludGVuZG8gKDNEU3xTd2l0Y2gpXCIsQW1vaTpcIkFtb2lcIixJTlE6XCJJTlFcIixHZW5lcmljUGhvbmU6XCJUYXBhdGFsa3xQREE7fFNBR0VNfFxcXFxibW1wXFxcXGJ8cG9ja2V0fFxcXFxicHNwXFxcXGJ8c3ltYmlhbnxTbWFydHBob25lfHNtYXJ0Zm9ufHRyZW98dXAuYnJvd3Nlcnx1cC5saW5rfHZvZGFmb25lfFxcXFxid2FwXFxcXGJ8bm9raWF8U2VyaWVzNDB8U2VyaWVzNjB8UzYwfFNvbnlFcmljc3NvbnxOOTAwfE1BVUkuKldBUC4qQnJvd3NlclwifSx0YWJsZXRzOntpUGFkOlwiaVBhZHxpUGFkLipNb2JpbGVcIixOZXh1c1RhYmxldDpcIkFuZHJvaWQuKk5leHVzW1xcXFxzXSsoN3w5fDEwKVwiLEdvb2dsZVRhYmxldDpcIkFuZHJvaWQuKlBpeGVsIENcIixTYW1zdW5nVGFibGV0OlwiU0FNU1VORy4qVGFibGV0fEdhbGF4eS4qVGFifFNDLTAxQ3xHVC1QMTAwMHxHVC1QMTAwM3xHVC1QMTAxMHxHVC1QMzEwNXxHVC1QNjIxMHxHVC1QNjgwMHxHVC1QNjgxMHxHVC1QNzEwMHxHVC1QNzMwMHxHVC1QNzMxMHxHVC1QNzUwMHxHVC1QNzUxMHxTQ0gtSTgwMHxTQ0gtSTgxNXxTQ0gtSTkwNXxTR0gtSTk1N3xTR0gtSTk4N3xTR0gtVDg0OXxTR0gtVDg1OXxTR0gtVDg2OXxTUEgtUDEwMHxHVC1QMzEwMHxHVC1QMzEwOHxHVC1QMzExMHxHVC1QNTEwMHxHVC1QNTExMHxHVC1QNjIwMHxHVC1QNzMyMHxHVC1QNzUxMXxHVC1OODAwMHxHVC1QODUxMHxTR0gtSTQ5N3xTUEgtUDUwMHxTR0gtVDc3OXxTQ0gtSTcwNXxTQ0gtSTkxNXxHVC1OODAxM3xHVC1QMzExM3xHVC1QNTExM3xHVC1QODExMHxHVC1OODAxMHxHVC1OODAwNXxHVC1OODAyMHxHVC1QMTAxM3xHVC1QNjIwMXxHVC1QNzUwMXxHVC1ONTEwMHxHVC1ONTEwNXxHVC1ONTExMHxTSFYtRTE0MEt8U0hWLUUxNDBMfFNIVi1FMTQwU3xTSFYtRTE1MFN8U0hWLUUyMzBLfFNIVi1FMjMwTHxTSFYtRTIzMFN8U0hXLU0xODBLfFNIVy1NMTgwTHxTSFctTTE4MFN8U0hXLU0xODBXfFNIVy1NMzAwV3xTSFctTTMwNVd8U0hXLU0zODBLfFNIVy1NMzgwU3xTSFctTTM4MFd8U0hXLU00MzBXfFNIVy1NNDgwS3xTSFctTTQ4MFN8U0hXLU00ODBXfFNIVy1NNDg1V3xTSFctTTQ4Nld8U0hXLU01MDBXfEdULUk5MjI4fFNDSC1QNzM5fFNDSC1JOTI1fEdULUk5MjAwfEdULVA1MjAwfEdULVA1MjEwfEdULVA1MjEwWHxTTS1UMzExfFNNLVQzMTB8U00tVDMxMFh8U00tVDIxMHxTTS1UMjEwUnxTTS1UMjExfFNNLVA2MDB8U00tUDYwMXxTTS1QNjA1fFNNLVA5MDB8U00tUDkwMXxTTS1UMjE3fFNNLVQyMTdBfFNNLVQyMTdTfFNNLVA2MDAwfFNNLVQzMTAwfFNHSC1JNDY3fFhFNTAwfFNNLVQxMTB8R1QtUDUyMjB8R1QtSTkyMDBYfEdULU41MTEwWHxHVC1ONTEyMHxTTS1QOTA1fFNNLVQxMTF8U00tVDIxMDV8U00tVDMxNXxTTS1UMzIwfFNNLVQzMjBYfFNNLVQzMjF8U00tVDUyMHxTTS1UNTI1fFNNLVQ1MzBOVXxTTS1UMjMwTlV8U00tVDMzME5VfFNNLVQ5MDB8WEU1MDBUMUN8U00tUDYwNVZ8U00tUDkwNVZ8U00tVDMzN1Z8U00tVDUzN1Z8U00tVDcwN1Z8U00tVDgwN1Z8U00tUDYwMFh8U00tUDkwMFh8U00tVDIxMFh8U00tVDIzMHxTTS1UMjMwWHxTTS1UMzI1fEdULVA3NTAzfFNNLVQ1MzF8U00tVDMzMHxTTS1UNTMwfFNNLVQ3MDV8U00tVDcwNUN8U00tVDUzNXxTTS1UMzMxfFNNLVQ4MDB8U00tVDcwMHxTTS1UNTM3fFNNLVQ4MDd8U00tUDkwN0F8U00tVDMzN0F8U00tVDUzN0F8U00tVDcwN0F8U00tVDgwN0F8U00tVDIzN3xTTS1UODA3UHxTTS1QNjA3VHxTTS1UMjE3VHxTTS1UMzM3VHxTTS1UODA3VHxTTS1UMTE2TlF8U00tVDExNkJVfFNNLVA1NTB8U00tVDM1MHxTTS1UNTUwfFNNLVQ5MDAwfFNNLVA5MDAwfFNNLVQ3MDVZfFNNLVQ4MDV8R1QtUDMxMTN8U00tVDcxMHxTTS1UODEwfFNNLVQ4MTV8U00tVDM2MHxTTS1UNTMzfFNNLVQxMTN8U00tVDMzNXxTTS1UNzE1fFNNLVQ1NjB8U00tVDY3MHxTTS1UNjc3fFNNLVQzNzd8U00tVDU2N3xTTS1UMzU3VHxTTS1UNTU1fFNNLVQ1NjF8U00tVDcxM3xTTS1UNzE5fFNNLVQ4MTN8U00tVDgxOXxTTS1UNTgwfFNNLVQzNTVZP3xTTS1UMjgwfFNNLVQ4MTdBfFNNLVQ4MjB8U00tVzcwMHxTTS1QNTgwfFNNLVQ1ODd8U00tUDM1MHxTTS1QNTU1TXxTTS1QMzU1TXxTTS1UMTEzTlV8U00tVDgxNVl8U00tVDU4NXxTTS1UMjg1fFNNLVQ4MjV8U00tVzcwOFwiLEtpbmRsZTpcIktpbmRsZXxTaWxrLipBY2NlbGVyYXRlZHxBbmRyb2lkLipcXFxcYihLRk9UfEtGVFR8S0ZKV0l8S0ZKV0F8S0ZPVEV8S0ZTT1dJfEtGVEhXSXxLRlRIV0F8S0ZBUFdJfEtGQVBXQXxXRkpXQUV8S0ZTQVdBfEtGU0FXSXxLRkFTV0l8S0ZBUldJfEtGRk9XSXxLRkdJV0l8S0ZNRVdJKVxcXFxifEFuZHJvaWQuKlNpbGsvWzAtOS5dKyBsaWtlIENocm9tZS9bMC05Ll0rICg/IU1vYmlsZSlcIixTdXJmYWNlVGFibGV0OlwiV2luZG93cyBOVCBbMC05Ll0rOyBBUk07LiooVGFibGV0fEFSTUJKUylcIixIUFRhYmxldDpcIkhQIFNsYXRlICg3fDh8MTApfEhQIEVsaXRlUGFkIDkwMHxocC10YWJsZXR8RWxpdGVCb29rLipUb3VjaHxIUCA4fFNsYXRlIDIxfEhQIFNsYXRlQm9vayAxMFwiLEFzdXNUYWJsZXQ6XCJeLipQYWRGb25lKCg/IU1vYmlsZSkuKSokfFRyYW5zZm9ybWVyfFRGMTAxfFRGMTAxR3xURjMwMFR8VEYzMDBUR3xURjMwMFRMfFRGNzAwVHxURjcwMEtMfFRGNzAxVHxURjgxMEN8TUUxNzF8TUUzMDFUfE1FMzAyQ3xNRTM3MU1HfE1FMzcwVHxNRTM3Mk1HfE1FMTcyVnxNRTE3M1h8TUU0MDBDfFNsaWRlciBTTDEwMXxcXFxcYkswMEZcXFxcYnxcXFxcYkswMENcXFxcYnxcXFxcYkswMEVcXFxcYnxcXFxcYkswMExcXFxcYnxUWDIwMUxBfE1FMTc2Q3xNRTEwMkF8XFxcXGJNODBUQVxcXFxifE1FMzcyQ0x8TUU1NjBDR3xNRTM3MkNHfE1FMzAyS0x8IEswMTAgfCBLMDExIHwgSzAxNyB8IEswMUUgfE1FNTcyQ3xNRTEwM0t8TUUxNzBDfE1FMTcxQ3xcXFxcYk1FNzBDXFxcXGJ8TUU1ODFDfE1FNTgxQ0x8TUU4NTEwQ3xNRTE4MUN8UDAxWXxQTzFNQXxQMDFafFxcXFxiUDAyN1xcXFxifFxcXFxiUDAyNFxcXFxifFxcXFxiUDAwQ1xcXFxiXCIsQmxhY2tCZXJyeVRhYmxldDpcIlBsYXlCb29rfFJJTSBUYWJsZXRcIixIVEN0YWJsZXQ6XCJIVENfRmx5ZXJfUDUxMnxIVEMgRmx5ZXJ8SFRDIEpldHN0cmVhbXxIVEMtUDcxNWF8SFRDIEVWTyBWaWV3IDRHfFBHNDEyMDB8UEcwOTQxMFwiLE1vdG9yb2xhVGFibGV0OlwieG9vbXxzaG9sZXN0fE1aNjE1fE1aNjA1fE1aNTA1fE1aNjAxfE1aNjAyfE1aNjAzfE1aNjA0fE1aNjA2fE1aNjA3fE1aNjA4fE1aNjA5fE1aNjE1fE1aNjE2fE1aNjE3XCIsTm9va1RhYmxldDpcIkFuZHJvaWQuKk5vb2t8Tm9va0NvbG9yfG5vb2sgYnJvd3NlcnxCTlJWMjAwfEJOUlYyMDBBfEJOVFYyNTB8Qk5UVjI1MEF8Qk5UVjQwMHxCTlRWNjAwfExvZ2ljUEQgWm9vbTJcIixBY2VyVGFibGV0OlwiQW5kcm9pZC4qOyBcXFxcYihBMTAwfEExMDF8QTExMHxBMjAwfEEyMTB8QTIxMXxBNTAwfEE1MDF8QTUxMHxBNTExfEE3MDB8QTcwMXxXNTAwfFc1MDBQfFc1MDF8VzUwMVB8VzUxMHxXNTExfFc3MDB8RzEwMHxHMTAwV3xCMS1BNzF8QjEtNzEwfEIxLTcxMXxBMS04MTB8QTEtODExfEExLTgzMClcXFxcYnxXMy04MTB8XFxcXGJBMy1BMTBcXFxcYnxcXFxcYkEzLUExMVxcXFxifFxcXFxiQTMtQTIwXFxcXGJ8XFxcXGJBMy1BMzBcIixUb3NoaWJhVGFibGV0OlwiQW5kcm9pZC4qKEFUMTAwfEFUMTA1fEFUMjAwfEFUMjA1fEFUMjcwfEFUMjc1fEFUMzAwfEFUMzA1fEFUMVM1fEFUNTAwfEFUNTcwfEFUNzAwfEFUODMwKXxUT1NISUJBLipGT0xJT1wiLExHVGFibGV0OlwiXFxcXGJMLTA2Q3xMRy1WOTA5fExHLVY5MDB8TEctVjcwMHxMRy1WNTEwfExHLVY1MDB8TEctVjQxMHxMRy1WNDAwfExHLVZLODEwXFxcXGJcIixGdWppdHN1VGFibGV0OlwiQW5kcm9pZC4qXFxcXGIoRi0wMUR8Ri0wMkZ8Ri0wNUV8Ri0xMER8TTUzMnxRNTcyKVxcXFxiXCIsUHJlc3RpZ2lvVGFibGV0OlwiUE1QMzE3MEJ8UE1QMzI3MEJ8UE1QMzQ3MEJ8UE1QNzE3MEJ8UE1QMzM3MEJ8UE1QMzU3MEN8UE1QNTg3MEN8UE1QMzY3MEJ8UE1QNTU3MEN8UE1QNTc3MER8UE1QMzk3MEJ8UE1QMzg3MEN8UE1QNTU4MEN8UE1QNTg4MER8UE1QNTc4MER8UE1QNTU4OEN8UE1QNzI4MEN8UE1QNzI4MEMzR3xQTVA3MjgwfFBNUDc4ODBEfFBNUDU1OTdEfFBNUDU1OTd8UE1QNzEwMER8UEVSMzQ2NHxQRVIzMjc0fFBFUjM1NzR8UEVSMzg4NHxQRVI1Mjc0fFBFUjU0NzR8UE1QNTA5N0NQUk98UE1QNTA5N3xQTVA3MzgwRHxQTVA1Mjk3Q3xQTVA1Mjk3Q19RVUFEfFBNUDgxMkV8UE1QODEyRTNHfFBNUDgxMkZ8UE1QODEwRXxQTVA4ODBURHxQTVQzMDE3fFBNVDMwMzd8UE1UMzA0N3xQTVQzMDU3fFBNVDcwMDh8UE1UNTg4N3xQTVQ1MDAxfFBNVDUwMDJcIixMZW5vdm9UYWJsZXQ6XCJMZW5vdm8gVEFCfElkZWEoVGFifFBhZCkoIEExfEExMHwgSzF8KXxUaGlua1BhZChbIF0rKT9UYWJsZXR8WVQzLTg1ME18WVQzLVg5MEx8WVQzLVg5MEZ8WVQzLVg5MFh8TGVub3ZvLiooUzIxMDl8UzIxMTB8UzUwMDB8UzYwMDB8SzMwMTF8QTMwMDB8QTM1MDB8QTEwMDB8QTIxMDd8QTIxMDl8QTExMDd8QTU1MDB8QTc2MDB8QjYwMDB8QjgwMDB8QjgwODApKC18KShGTHxGfEhWfEh8KXxUQi1YMTAzRnxUQi1YMzA0RnxUQi1YMzA0THxUQi04NzAzRnxUYWIyQTctMTBGXCIsRGVsbFRhYmxldDpcIlZlbnVlIDExfFZlbnVlIDh8VmVudWUgN3xEZWxsIFN0cmVhayAxMHxEZWxsIFN0cmVhayA3XCIsWWFydmlrVGFibGV0OlwiQW5kcm9pZC4qXFxcXGIoVEFCMjEwfFRBQjIxMXxUQUIyMjR8VEFCMjUwfFRBQjI2MHxUQUIyNjR8VEFCMzEwfFRBQjM2MHxUQUIzNjR8VEFCNDEwfFRBQjQxMXxUQUI0MjB8VEFCNDI0fFRBQjQ1MHxUQUI0NjB8VEFCNDYxfFRBQjQ2NHxUQUI0NjV8VEFCNDY3fFRBQjQ2OHxUQUIwNy0xMDB8VEFCMDctMTAxfFRBQjA3LTE1MHxUQUIwNy0xNTF8VEFCMDctMTUyfFRBQjA3LTIwMHxUQUIwNy0yMDEtM0d8VEFCMDctMjEwfFRBQjA3LTIxMXxUQUIwNy0yMTJ8VEFCMDctMjE0fFRBQjA3LTIyMHxUQUIwNy00MDB8VEFCMDctNDg1fFRBQjA4LTE1MHxUQUIwOC0yMDB8VEFCMDgtMjAxLTNHfFRBQjA4LTIwMS0zMHxUQUIwOS0xMDB8VEFCMDktMjExfFRBQjA5LTQxMHxUQUIxMC0xNTB8VEFCMTAtMjAxfFRBQjEwLTIxMXxUQUIxMC00MDB8VEFCMTAtNDEwfFRBQjEzLTIwMXxUQUIyNzRFVUt8VEFCMjc1RVVLfFRBQjM3NEVVS3xUQUI0NjJFVUt8VEFCNDc0RVVLfFRBQjktMjAwKVxcXFxiXCIsTWVkaW9uVGFibGV0OlwiQW5kcm9pZC4qXFxcXGJPWU9cXFxcYnxMSUZFLiooUDkyMTJ8UDk1MTR8UDk1MTZ8Uzk1MTIpfExJRkVUQUJcIixBcm5vdmFUYWJsZXQ6XCI5N0c0fEFOMTBHMnxBTjdiRzN8QU43ZkczfEFOOEczfEFOOGNHM3xBTjdHM3xBTjlHM3xBTjdkRzN8QU43ZEczU1R8QU43ZEczQ2hpbGRQYWR8QU4xMGJHM3xBTjEwYkczRFR8QU45RzJcIixJbnRlbnNvVGFibGV0OlwiSU5NODAwMktQfElOTTEwMTBGUHxJTk04MDVORHxJbnRlbnNvIFRhYnxUQUIxMDA0XCIsSVJVVGFibGV0OlwiTTcwMnByb1wiLE1lZ2Fmb25UYWJsZXQ6XCJNZWdhRm9uIFY5fFxcXFxiWlRFIFY5XFxcXGJ8QW5kcm9pZC4qXFxcXGJNVDdBXFxcXGJcIixFYm9kYVRhYmxldDpcIkUtQm9kYSAoU3VwcmVtZXxJbXByZXNzcGVlZHxJenp5Y29tbXxFc3NlbnRpYWwpXCIsQWxsVmlld1RhYmxldDpcIkFsbHZpZXcuKihWaXZhfEFsbGRyb3xDaXR5fFNwZWVkfEFsbCBUVnxGcmVuenl8UXVhc2FyfFNoaW5lfFRYMXxBWDF8QVgyKVwiLEFyY2hvc1RhYmxldDpcIlxcXFxiKDEwMUc5fDgwRzl8QTEwMUlUKVxcXFxifFFpbGl2ZSA5N1J8QXJjaG9zNXxcXFxcYkFSQ0hPUyAoNzB8Nzl8ODB8OTB8OTd8MTAxfEZBTUlMWVBBRHwpKGJ8Y3wpKEcxMHwgQ29iYWx0fCBUSVRBTklVTShIRHwpfCBYZW5vbnwgTmVvbnxYU0t8IDJ8IFhTIDJ8IFBMQVRJTlVNfCBDQVJCT058R0FNRVBBRClcXFxcYlwiLEFpbm9sVGFibGV0OlwiTk9WTzd8Tk9WTzh8Tk9WTzEwfE5vdm83QXVyb3JhfE5vdm83QmFzaWN8Tk9WTzdQQUxBRElOfG5vdm85LVNwYXJrXCIsTm9raWFMdW1pYVRhYmxldDpcIkx1bWlhIDI1MjBcIixTb255VGFibGV0OlwiU29ueS4qVGFibGV0fFhwZXJpYSBUYWJsZXR8U29ueSBUYWJsZXQgU3xTTy0wM0V8U0dQVDEyfFNHUFQxM3xTR1BUMTE0fFNHUFQxMjF8U0dQVDEyMnxTR1BUMTIzfFNHUFQxMTF8U0dQVDExMnxTR1BUMTEzfFNHUFQxMzF8U0dQVDEzMnxTR1BUMTMzfFNHUFQyMTF8U0dQVDIxMnxTR1BUMjEzfFNHUDMxMXxTR1AzMTJ8U0dQMzIxfEVCUkQxMTAxfEVCUkQxMTAyfEVCUkQxMjAxfFNHUDM1MXxTR1AzNDF8U0dQNTExfFNHUDUxMnxTR1A1MjF8U0dQNTQxfFNHUDU1MXxTR1A2MjF8U0dQNjEyfFNPVDMxXCIsUGhpbGlwc1RhYmxldDpcIlxcXFxiKFBJMjAxMHxQSTMwMDB8UEkzMTAwfFBJMzEwNXxQSTMxMTB8UEkzMjA1fFBJMzIxMHxQSTM5MDB8UEk0MDEwfFBJNzAwMHxQSTcxMDApXFxcXGJcIixDdWJlVGFibGV0OlwiQW5kcm9pZC4qKEs4R1R8VTlHVHxVMTBHVHxVMTZHVHxVMTdHVHxVMThHVHxVMTlHVHxVMjBHVHxVMjNHVHxVMzBHVCl8Q1VCRSBVOEdUXCIsQ29ieVRhYmxldDpcIk1JRDEwNDJ8TUlEMTA0NXxNSUQxMTI1fE1JRDExMjZ8TUlENzAxMnxNSUQ3MDE0fE1JRDcwMTV8TUlENzAzNHxNSUQ3MDM1fE1JRDcwMzZ8TUlENzA0MnxNSUQ3MDQ4fE1JRDcxMjd8TUlEODA0MnxNSUQ4MDQ4fE1JRDgxMjd8TUlEOTA0MnxNSUQ5NzQwfE1JRDk3NDJ8TUlENzAyMnxNSUQ3MDEwXCIsTUlEVGFibGV0OlwiTTk3MDF8TTkwMDB8TTkxMDB8TTgwNnxNMTA1MnxNODA2fFQ3MDN8TUlENzAxfE1JRDcxM3xNSUQ3MTB8TUlENzI3fE1JRDc2MHxNSUQ4MzB8TUlENzI4fE1JRDkzM3xNSUQxMjV8TUlEODEwfE1JRDczMnxNSUQxMjB8TUlEOTMwfE1JRDgwMHxNSUQ3MzF8TUlEOTAwfE1JRDEwMHxNSUQ4MjB8TUlENzM1fE1JRDk4MHxNSUQxMzB8TUlEODMzfE1JRDczN3xNSUQ5NjB8TUlEMTM1fE1JRDg2MHxNSUQ3MzZ8TUlEMTQwfE1JRDkzMHxNSUQ4MzV8TUlENzMzfE1JRDRYMTBcIixNU0lUYWJsZXQ6XCJNU0kgXFxcXGIoUHJpbW8gNzNLfFByaW1vIDczTHxQcmltbyA4MUx8UHJpbW8gNzd8UHJpbW8gOTN8UHJpbW8gNzV8UHJpbW8gNzZ8UHJpbW8gNzN8UHJpbW8gODF8UHJpbW8gOTF8UHJpbW8gOTB8RW5qb3kgNzF8RW5qb3kgN3xFbmpveSAxMClcXFxcYlwiLFNNaVRUYWJsZXQ6XCJBbmRyb2lkLiooXFxcXGJNSURcXFxcYnxNSUQtNTYwfE1UVi1UMTIwMHxNVFYtUE5ENTMxfE1UVi1QMTEwMXxNVFYtUE5ENTMwKVwiLFJvY2tDaGlwVGFibGV0OlwiQW5kcm9pZC4qKFJLMjgxOHxSSzI4MDhBfFJLMjkxOHxSSzMwNjYpfFJLMjczOHxSSzI4MDhBXCIsRmx5VGFibGV0OlwiSVEzMTB8Rmx5IFZpc2lvblwiLGJxVGFibGV0OlwiQW5kcm9pZC4qKGJxKT8uKihFbGNhbm98Q3VyaWV8RWRpc29ufE1heHdlbGx8S2VwbGVyfFBhc2NhbHxUZXNsYXxIeXBhdGlhfFBsYXRvbnxOZXd0b258TGl2aW5nc3RvbmV8Q2VydmFudGVzfEF2YW50fEFxdWFyaXMgKFtFfE1dMTB8TTgpKXxNYXh3ZWxsLipMaXRlfE1heHdlbGwuKlBsdXNcIixIdWF3ZWlUYWJsZXQ6XCJNZWRpYVBhZHxNZWRpYVBhZCA3IFlvdXRofElERU9TIFM3fFM3LTIwMWN8UzctMjAydXxTNy0xMDF8UzctMTAzfFM3LTEwNHxTNy0xMDV8UzctMTA2fFM3LTIwMXxTNy1TbGltfE0yLUEwMUx8QkFILUwwOXxCQUgtVzA5XCIsTmVjVGFibGV0OlwiXFxcXGJOLTA2RHxcXFxcYk4tMDhEXCIsUGFudGVjaFRhYmxldDpcIlBhbnRlY2guKlA0MTAwXCIsQnJvbmNob1RhYmxldDpcIkJyb25jaG8uKihONzAxfE43MDh8TjgwMnxhNzEwKVwiLFZlcnN1c1RhYmxldDpcIlRPVUNIUEFELipbNzg5MTBdfFxcXFxiVE9VQ0hUQUJcXFxcYlwiLFp5bmNUYWJsZXQ6XCJ6MTAwMHxaOTkgMkd8ejk5fHo5MzB8ejk5OXx6OTkwfHo5MDl8WjkxOXx6OTAwXCIsUG9zaXRpdm9UYWJsZXQ6XCJUQjA3U1RBfFRCMTBTVEF8VEIwN0ZUQXxUQjEwRlRBXCIsTmFiaVRhYmxldDpcIkFuZHJvaWQuKlxcXFxiTmFiaVwiLEtvYm9UYWJsZXQ6XCJLb2JvIFRvdWNofFxcXFxiSzA4MFxcXFxifFxcXFxiVm94XFxcXGIgQnVpbGR8XFxcXGJBcmNcXFxcYiBCdWlsZFwiLERhbmV3VGFibGV0OlwiRFNsaWRlLipcXFxcYig3MDB8NzAxUnw3MDJ8NzAzUnw3MDR8ODAyfDk3MHw5NzF8OTcyfDk3M3w5NzR8MTAxMHwxMDEyKVxcXFxiXCIsVGV4ZXRUYWJsZXQ6XCJOYXZpUGFkfFRCLTc3MkF8VE0tNzA0NXxUTS03MDU1fFRNLTk3NTB8VE0tNzAxNnxUTS03MDI0fFRNLTcwMjZ8VE0tNzA0MXxUTS03MDQzfFRNLTcwNDd8VE0tODA0MXxUTS05NzQxfFRNLTk3NDd8VE0tOTc0OHxUTS05NzUxfFRNLTcwMjJ8VE0tNzAyMXxUTS03MDIwfFRNLTcwMTF8VE0tNzAxMHxUTS03MDIzfFRNLTcwMjV8VE0tNzAzN1d8VE0tNzAzOFd8VE0tNzAyN1d8VE0tOTcyMHxUTS05NzI1fFRNLTk3MzdXfFRNLTEwMjB8VE0tOTczOFd8VE0tOTc0MHxUTS05NzQzV3xUQi04MDdBfFRCLTc3MUF8VEItNzI3QXxUQi03MjVBfFRCLTcxOUF8VEItODIzQXxUQi04MDVBfFRCLTcyM0F8VEItNzE1QXxUQi03MDdBfFRCLTcwNUF8VEItNzA5QXxUQi03MTFBfFRCLTg5MEhEfFRCLTg4MEhEfFRCLTc5MEhEfFRCLTc4MEhEfFRCLTc3MEhEfFRCLTcyMUhEfFRCLTcxMEhEfFRCLTQzNEhEfFRCLTg2MEhEfFRCLTg0MEhEfFRCLTc2MEhEfFRCLTc1MEhEfFRCLTc0MEhEfFRCLTczMEhEfFRCLTcyMkhEfFRCLTcyMEhEfFRCLTcwMEhEfFRCLTUwMEhEfFRCLTQ3MEhEfFRCLTQzMUhEfFRCLTQzMEhEfFRCLTUwNnxUQi01MDR8VEItNDQ2fFRCLTQzNnxUQi00MTZ8VEItMTQ2U0V8VEItMTI2U0VcIixQbGF5c3RhdGlvblRhYmxldDpcIlBsYXlzdGF0aW9uLiooUG9ydGFibGV8Vml0YSlcIixUcmVrc3RvclRhYmxldDpcIlNUMTA0MTYtMXxWVDEwNDE2LTF8U1Q3MDQwOC0xfFNUNzAyeHgtMXxTVDcwMnh4LTJ8U1Q4MDIwOHxTVDk3MjE2fFNUNzAxMDQtMnxWVDEwNDE2LTJ8U1QxMDIxNi0yQXxTdXJmVGFiXCIsUHlsZUF1ZGlvVGFibGV0OlwiXFxcXGIoUFRCTDEwQ0VVfFBUQkwxMEN8UFRCTDcyQkN8UFRCTDcyQkNFVXxQVEJMN0NFVXxQVEJMN0N8UFRCTDkyQkN8UFRCTDkyQkNFVXxQVEJMOUNFVXxQVEJMOUNVS3xQVEJMOUMpXFxcXGJcIixBZHZhblRhYmxldDpcIkFuZHJvaWQuKiBcXFxcYihFM0F8VDNYfFQ1Q3xUNUJ8VDNFfFQzQ3xUM0J8VDFKfFQxRnxUMkF8VDFIfFQxaXxFMUN8VDEtRXxUNS1BfFQ0fEUxLUJ8VDJDaXxUMS1CfFQxLUR8TzEtQXxFMS1BfFQxLUF8VDNBfFQ0aSlcXFxcYiBcIixEYW55VGVjaFRhYmxldDpcIkdlbml1cyBUYWIgRzN8R2VuaXVzIFRhYiBTMnxHZW5pdXMgVGFiIFEzfEdlbml1cyBUYWIgRzR8R2VuaXVzIFRhYiBRNHxHZW5pdXMgVGFiIEctSUl8R2VuaXVzIFRBQiBHSUl8R2VuaXVzIFRBQiBHSUlJfEdlbml1cyBUYWIgUzFcIixHYWxhcGFkVGFibGV0OlwiQW5kcm9pZC4qXFxcXGJHMVxcXFxiXCIsTWljcm9tYXhUYWJsZXQ6XCJGdW5ib29rfE1pY3JvbWF4LipcXFxcYihQMjUwfFA1NjB8UDM2MHxQMzYyfFA2MDB8UDMwMHxQMzUwfFA1MDB8UDI3NSlcXFxcYlwiLEthcmJvbm5UYWJsZXQ6XCJBbmRyb2lkLipcXFxcYihBMzl8QTM3fEEzNHxTVDh8U1QxMHxTVDd8U21hcnQgVGFiM3xTbWFydCBUYWIyKVxcXFxiXCIsQWxsRmluZVRhYmxldDpcIkZpbmU3IEdlbml1c3xGaW5lNyBTaGluZXxGaW5lNyBBaXJ8RmluZTggU3R5bGV8RmluZTkgTW9yZXxGaW5lMTAgSm95fEZpbmUxMSBXaWRlXCIsUFJPU0NBTlRhYmxldDpcIlxcXFxiKFBFTTYzfFBMVDEwMjNHfFBMVDEwNDF8UExUMTA0NHxQTFQxMDQ0R3xQTFQxMDkxfFBMVDQzMTF8UExUNDMxMVBMfFBMVDQzMTV8UExUNzAzMHxQTFQ3MDMzfFBMVDcwMzNEfFBMVDcwMzV8UExUNzAzNUR8UExUNzA0NEt8UExUNzA0NUt8UExUNzA0NUtCfFBMVDcwNzFLR3xQTFQ3MDcyfFBMVDcyMjNHfFBMVDcyMjVHfFBMVDc3NzdHfFBMVDc4MTBLfFBMVDc4NDlHfFBMVDc4NTFHfFBMVDc4NTJHfFBMVDgwMTV8UExUODAzMXxQTFQ4MDM0fFBMVDgwMzZ8UExUODA4MEt8UExUODA4MnxQTFQ4MDg4fFBMVDgyMjNHfFBMVDgyMzRHfFBMVDgyMzVHfFBMVDg4MTZLfFBMVDkwMTF8UExUOTA0NUt8UExUOTIzM0d8UExUOTczNXxQTFQ5NzYwR3xQTFQ5NzcwRylcXFxcYlwiLFlPTkVTVGFibGV0OlwiQlExMDc4fEJDMTAwM3xCQzEwNzd8Uks5NzAyfEJDOTczMHxCQzkwMDF8SVQ5MDAxfEJDNzAwOHxCQzcwMTB8QkM3MDh8QkM3Mjh8QkM3MDEyfEJDNzAzMHxCQzcwMjd8QkM3MDI2XCIsQ2hhbmdKaWFUYWJsZXQ6XCJUUEM3MTAyfFRQQzcxMDN8VFBDNzEwNXxUUEM3MTA2fFRQQzcxMDd8VFBDNzIwMXxUUEM3MjAzfFRQQzcyMDV8VFBDNzIxMHxUUEM3NzA4fFRQQzc3MDl8VFBDNzcxMnxUUEM3MTEwfFRQQzgxMDF8VFBDODEwM3xUUEM4MTA1fFRQQzgxMDZ8VFBDODIwM3xUUEM4MjA1fFRQQzg1MDN8VFBDOTEwNnxUUEM5NzAxfFRQQzk3MTAxfFRQQzk3MTAzfFRQQzk3MTA1fFRQQzk3MTA2fFRQQzk3MTExfFRQQzk3MTEzfFRQQzk3MjAzfFRQQzk3NjAzfFRQQzk3ODA5fFRQQzk3MjA1fFRQQzEwMTAxfFRQQzEwMTAzfFRQQzEwMTA2fFRQQzEwMTExfFRQQzEwMjAzfFRQQzEwMjA1fFRQQzEwNTAzXCIsR1VUYWJsZXQ6XCJUWC1BMTMwMXxUWC1NOTAwMnxRNzAyfGtmMDI2XCIsUG9pbnRPZlZpZXdUYWJsZXQ6XCJUQUItUDUwNnxUQUItbmF2aS03LTNHLU18VEFCLVA1MTd8VEFCLVAtNTI3fFRBQi1QNzAxfFRBQi1QNzAzfFRBQi1QNzIxfFRBQi1QNzMxTnxUQUItUDc0MXxUQUItUDgyNXxUQUItUDkwNXxUQUItUDkyNXxUQUItUFI5NDV8VEFCLVBMMTAxNXxUQUItUDEwMjV8VEFCLVBJMTA0NXxUQUItUDEzMjV8VEFCLVBST1RBQlswLTldK3xUQUItUFJPVEFCMjV8VEFCLVBST1RBQjI2fFRBQi1QUk9UQUIyN3xUQUItUFJPVEFCMjZYTHxUQUItUFJPVEFCMi1JUFM5fFRBQi1QUk9UQUIzMC1JUFM5fFRBQi1QUk9UQUIyNVhYTHxUQUItUFJPVEFCMjYtSVBTMTB8VEFCLVBST1RBQjMwLUlQUzEwXCIsT3Zlcm1heFRhYmxldDpcIk9WLShTdGVlbENvcmV8TmV3QmFzZXxCYXNlY29yZXxCYXNlb25lfEV4ZWxsZW58UXVhdHRvcnxFZHVUYWJ8U29sdXRpb258QUNUSU9OfEJhc2ljVGFifFRlZGR5VGFifE1hZ2ljVGFifFN0cmVhbXxUQi0wOHxUQi0wOSl8UXVhbGNvcmUgMTAyN1wiLEhDTFRhYmxldDpcIkhDTC4qVGFibGV0fENvbm5lY3QtM0ctMi4wfENvbm5lY3QtMkctMi4wfE1FIFRhYmxldCBVMXxNRSBUYWJsZXQgVTJ8TUUgVGFibGV0IEcxfE1FIFRhYmxldCBYMXxNRSBUYWJsZXQgWTJ8TUUgVGFibGV0IFN5bmNcIixEUFNUYWJsZXQ6XCJEUFMgRHJlYW0gOXxEUFMgRHVhbCA3XCIsVmlzdHVyZVRhYmxldDpcIlY5NyBIRHxpNzUgM0d8VmlzdHVyZSBWNCggSEQpP3xWaXN0dXJlIFY1KCBIRCk/fFZpc3R1cmUgVjEwXCIsQ3Jlc3RhVGFibGV0OlwiQ1RQKC0pPzgxMHxDVFAoLSk/ODE4fENUUCgtKT84Mjh8Q1RQKC0pPzgzOHxDVFAoLSk/ODg4fENUUCgtKT85Nzh8Q1RQKC0pPzk4MHxDVFAoLSk/OTg3fENUUCgtKT85ODh8Q1RQKC0pPzk4OVwiLE1lZGlhdGVrVGFibGV0OlwiXFxcXGJNVDgxMjV8TVQ4Mzg5fE1UODEzNXxNVDgzNzdcXFxcYlwiLENvbmNvcmRlVGFibGV0OlwiQ29uY29yZGUoWyBdKyk/VGFifENvbkNvcmRlIFJlYWRNYW5cIixHb0NsZXZlclRhYmxldDpcIkdPQ0xFVkVSIFRBQnxBN0dPQ0xFVkVSfE0xMDQyfE03ODQxfE03NDJ8UjEwNDJCS3xSMTA0MXxUQUIgQTk3NXxUQUIgQTc4NDJ8VEFCIEE3NDF8VEFCIEE3NDFMfFRBQiBNNzIzR3xUQUIgTTcyMXxUQUIgQTEwMjF8VEFCIEk5MjF8VEFCIFI3MjF8VEFCIEk3MjB8VEFCIFQ3NnxUQUIgUjcwfFRBQiBSNzYuMnxUQUIgUjEwNnxUQUIgUjgzLjJ8VEFCIE04MTNHfFRBQiBJNzIxfEdDVEE3MjJ8VEFCIEk3MHxUQUIgSTcxfFRBQiBTNzN8VEFCIFI3M3xUQUIgUjc0fFRBQiBSOTN8VEFCIFI3NXxUQUIgUjc2LjF8VEFCIEE3M3xUQUIgQTkzfFRBQiBBOTMuMnxUQUIgVDcyfFRBQiBSODN8VEFCIFI5NzR8VEFCIFI5NzN8VEFCIEExMDF8VEFCIEExMDN8VEFCIEExMDR8VEFCIEExMDQuMnxSMTA1Qkt8TTcxM0d8QTk3MkJLfFRBQiBBOTcxfFRBQiBSOTc0LjJ8VEFCIFIxMDR8VEFCIFI4My4zfFRBQiBBMTA0MlwiLE1vZGVjb21UYWJsZXQ6XCJGcmVlVEFCIDkwMDB8RnJlZVRBQiA3LjR8RnJlZVRBQiA3MDA0fEZyZWVUQUIgNzgwMHxGcmVlVEFCIDIwOTZ8RnJlZVRBQiA3LjV8RnJlZVRBQiAxMDE0fEZyZWVUQUIgMTAwMSB8RnJlZVRBQiA4MDAxfEZyZWVUQUIgOTcwNnxGcmVlVEFCIDk3MDJ8RnJlZVRBQiA3MDAzfEZyZWVUQUIgNzAwMnxGcmVlVEFCIDEwMDJ8RnJlZVRBQiA3ODAxfEZyZWVUQUIgMTMzMXxGcmVlVEFCIDEwMDR8RnJlZVRBQiA4MDAyfEZyZWVUQUIgODAxNHxGcmVlVEFCIDk3MDR8RnJlZVRBQiAxMDAzXCIsVm9uaW5vVGFibGV0OlwiXFxcXGIoQXJndXNbIF9dP1N8RGlhbW9uZFsgX10/NzlIRHxFbWVyYWxkWyBfXT83OEV8THVuYVsgX10/NzBDfE9ueXhbIF9dP1N8T255eFsgX10/WnxPcmluWyBfXT9IRHxPcmluWyBfXT9TfE90aXNbIF9dP1N8U3BlZWRTdGFyWyBfXT9TfE1hZ25ldFsgX10/TTl8UHJpbXVzWyBfXT85NFsgX10/M0d8UHJpbXVzWyBfXT85NEhEfFByaW11c1sgX10/UVN8QW5kcm9pZC4qXFxcXGJROFxcXFxifFNpcml1c1sgX10/RVZPWyBfXT9RU3xTaXJpdXNbIF9dP1FTfFNwaXJpdFsgX10/UylcXFxcYlwiLEVDU1RhYmxldDpcIlYwN09UMnxUTTEwNUF8UzEwT1QxfFRSMTBDUzFcIixTdG9yZXhUYWJsZXQ6XCJlWmVlW18nXT8oVGFifEdvKVswLTldK3xUYWJMQzd8TG9vbmV5IFR1bmVzIFRhYlwiLFZvZGFmb25lVGFibGV0OlwiU21hcnRUYWIoWyBdKyk/WzAtOV0rfFNtYXJ0VGFiSUkxMHxTbWFydFRhYklJN3xWRi0xNDk3XCIsRXNzZW50aWVsQlRhYmxldDpcIlNtYXJ0WyAnXT9UQUJbIF0rP1swLTldK3xGYW1pbHlbICddP1RBQjJcIixSb3NzTW9vclRhYmxldDpcIlJNLTc5MHxSTS05OTd8Uk1ELTg3OEd8Uk1ELTk3NFJ8Uk1ULTcwNUF8Uk1ULTcwMXxSTUUtNjAxfFJNVC01MDF8Uk1ULTcxMVwiLGlNb2JpbGVUYWJsZXQ6XCJpLW1vYmlsZSBpLW5vdGVcIixUb2xpbm9UYWJsZXQ6XCJ0b2xpbm8gdGFiIFswLTkuXSt8dG9saW5vIHNoaW5lXCIsQXVkaW9Tb25pY1RhYmxldDpcIlxcXFxiQy0yMlF8VDctUUN8VC0xN0J8VC0xN1BcXFxcYlwiLEFNUEVUYWJsZXQ6XCJBbmRyb2lkLiogQTc4IFwiLFNra1RhYmxldDpcIkFuZHJvaWQuKiAoU0tZUEFEfFBIT0VOSVh8Q1lDTE9QUylcIixUZWNub1RhYmxldDpcIlRFQ05PIFA5fFRFQ05PIERQOERcIixKWERUYWJsZXQ6XCJBbmRyb2lkLiogXFxcXGIoRjMwMDB8QTMzMDB8SlhENTAwMHxKWEQzMDAwfEpYRDIwMDB8SlhEMzAwQnxKWEQzMDB8UzU4MDB8Uzc4MDB8UzYwMmJ8UzUxMTBifFM3MzAwfFM1MzAwfFM2MDJ8UzYwM3xTNTEwMHxTNTExMHxTNjAxfFM3MTAwYXxQMzAwMEZ8UDMwMDBzfFAxMDF8UDIwMHN8UDEwMDBtfFAyMDBtfFA5MTAwfFAxMDAwc3xTNjYwMGJ8UzkwOHxQMTAwMHxQMzAwfFMxOHxTNjYwMHxTOTEwMClcXFxcYlwiLGlKb3lUYWJsZXQ6XCJUYWJsZXQgKFNwaXJpdCA3fEVzc2VudGlhfEdhbGF0ZWF8RnVzaW9ufE9uaXggN3xMYW5kYXxUaXRhbnxTY29vYnl8RGVveHxTdGVsbGF8VGhlbWlzfEFyZ29ufFVuaXF1ZSA3fFN5Z251c3xIZXhlbnxGaW5pdHkgN3xDcmVhbXxDcmVhbSBYMnxKYWRlfE5lb24gN3xOZXJvbiA3fEthbmR5fFNjYXBlfFNhcGh5ciA3fFJlYmVsfEJpb3h8UmViZWx8UmViZWwgOEdCfE15c3R8RHJhY28gN3xNeXN0fFRhYjctMDA0fE15c3R8VGFkZW8gSm9uZXN8VGFibGV0IEJvaW5nfEFycm93fERyYWNvIER1YWwgQ2FtfEF1cml4fE1pbnR8QW1pdHl8UmV2b2x1dGlvbnxGaW5pdHkgOXxOZW9uIDl8VDl3fEFtaXR5IDRHQiBEdWFsIENhbXxTdG9uZSA0R0J8U3RvbmUgOEdCfEFuZHJvbWVkYXxTaWxrZW58WDJ8QW5kcm9tZWRhIElJfEhhbGxleXxGbGFtZXxTYXBoeXIgOSw3fFRvdWNoIDh8UGxhbmV0fFRyaXRvbnxVbmlxdWUgMTB8SGV4ZW4gMTB8TWVtcGhpcyA0R0J8TWVtcGhpcyA4R0J8T25peCAxMClcIixGWDJUYWJsZXQ6XCJGWDIgUEFEN3xGWDIgUEFEMTBcIixYb3JvVGFibGV0OlwiS2lkc1BBRCA3MDF8UEFEWyBdPzcxMnxQQURbIF0/NzE0fFBBRFsgXT83MTZ8UEFEWyBdPzcxN3xQQURbIF0/NzE4fFBBRFsgXT83MjB8UEFEWyBdPzcyMXxQQURbIF0/NzIyfFBBRFsgXT83OTB8UEFEWyBdPzc5MnxQQURbIF0/OTAwfFBBRFsgXT85NzE1RHxQQURbIF0/OTcxNkRSfFBBRFsgXT85NzE4RFJ8UEFEWyBdPzk3MTlRUnxQQURbIF0/OTcyMFFSfFRlbGVQQUQxMDMwfFRlbGVwYWQxMDMyfFRlbGVQQUQ3MzB8VGVsZVBBRDczMXxUZWxlUEFENzMyfFRlbGVQQUQ3MzVRfFRlbGVQQUQ4MzB8VGVsZVBBRDk3MzB8VGVsZVBBRDc5NXxNZWdhUEFEIDEzMzF8TWVnYVBBRCAxODUxfE1lZ2FQQUQgMjE1MVwiLFZpZXdzb25pY1RhYmxldDpcIlZpZXdQYWQgMTBwaXxWaWV3UGFkIDEwZXxWaWV3UGFkIDEwc3xWaWV3UGFkIEU3MnxWaWV3UGFkN3xWaWV3UGFkIEUxMDB8Vmlld1BhZCA3ZXxWaWV3U29uaWMgVkI3MzN8VkIxMDBhXCIsVmVyaXpvblRhYmxldDpcIlFUQVFaM3xRVEFJUjd8UVRBUVRaM3xRVEFTVU4xfFFUQVNVTjJ8UVRBWElBMVwiLE9keXNUYWJsZXQ6XCJMT09YfFhFTk8xMHxPRFlTWyAtXShTcGFjZXxFVk98WHByZXNzfE5PT04pfFxcXFxiWEVMSU9cXFxcYnxYZWxpbzEwUHJvfFhFTElPN1BIT05FVEFCfFhFTElPMTBFWFRSRU1FfFhFTElPUFQyfE5FT19RVUFEMTBcIixDYXB0aXZhVGFibGV0OlwiQ0FQVElWQSBQQURcIixJY29uYml0VGFibGV0OlwiTmV0VEFCfE5ULTM3MDJ8TlQtMzcwMlN8TlQtMzcwMlN8TlQtMzYwM1B8TlQtMzYwM1B8TlQtMDcwNFN8TlQtMDcwNFN8TlQtMzgwNUN8TlQtMzgwNUN8TlQtMDgwNkN8TlQtMDgwNkN8TlQtMDkwOVR8TlQtMDkwOVR8TlQtMDkwN1N8TlQtMDkwN1N8TlQtMDkwMlN8TlQtMDkwMlNcIixUZWNsYXN0VGFibGV0OlwiVDk4IDRHfFxcXFxiUDgwXFxcXGJ8XFxcXGJYOTBIRFxcXFxifFg5OCBBaXJ8WDk4IEFpciAzR3xcXFxcYlg4OVxcXFxifFA4MCAzR3xcXFxcYlg4MGhcXFxcYnxQOTggQWlyfFxcXFxiWDg5SERcXFxcYnxQOTggM0d8XFxcXGJQOTBIRFxcXFxifFA4OSAzR3xYOTggM0d8XFxcXGJQNzBoXFxcXGJ8UDc5SEQgM0d8RzE4ZCAzR3xcXFxcYlA3OUhEXFxcXGJ8XFxcXGJQODlzXFxcXGJ8XFxcXGJBODhcXFxcYnxcXFxcYlAxMEhEXFxcXGJ8XFxcXGJQMTlIRFxcXFxifEcxOCAzR3xcXFxcYlA3OEhEXFxcXGJ8XFxcXGJBNzhcXFxcYnxcXFxcYlA3NVxcXFxifEcxN3MgM0d8RzE3aCAzR3xcXFxcYlA4NXRcXFxcYnxcXFxcYlA5MFxcXFxifFxcXFxiUDExXFxcXGJ8XFxcXGJQOTh0XFxcXGJ8XFxcXGJQOThIRFxcXFxifFxcXFxiRzE4ZFxcXFxifFxcXFxiUDg1c1xcXFxifFxcXFxiUDExSERcXFxcYnxcXFxcYlA4OHNcXFxcYnxcXFxcYkE4MEhEXFxcXGJ8XFxcXGJBODBzZVxcXFxifFxcXFxiQTEwaFxcXFxifFxcXFxiUDg5XFxcXGJ8XFxcXGJQNzhzXFxcXGJ8XFxcXGJHMThcXFxcYnxcXFxcYlA4NVxcXFxifFxcXFxiQTcwaFxcXFxifFxcXFxiQTcwXFxcXGJ8XFxcXGJHMTdcXFxcYnxcXFxcYlAxOFxcXFxifFxcXFxiQTgwc1xcXFxifFxcXFxiQTExc1xcXFxifFxcXFxiUDg4SERcXFxcYnxcXFxcYkE4MGhcXFxcYnxcXFxcYlA3NnNcXFxcYnxcXFxcYlA3NmhcXFxcYnxcXFxcYlA5OFxcXFxifFxcXFxiQTEwSERcXFxcYnxcXFxcYlA3OFxcXFxifFxcXFxiUDg4XFxcXGJ8XFxcXGJBMTFcXFxcYnxcXFxcYkExMHRcXFxcYnxcXFxcYlA3NmFcXFxcYnxcXFxcYlA3NnRcXFxcYnxcXFxcYlA3NmVcXFxcYnxcXFxcYlA4NUhEXFxcXGJ8XFxcXGJQODVhXFxcXGJ8XFxcXGJQODZcXFxcYnxcXFxcYlA3NUhEXFxcXGJ8XFxcXGJQNzZ2XFxcXGJ8XFxcXGJBMTJcXFxcYnxcXFxcYlA3NWFcXFxcYnxcXFxcYkExNVxcXFxifFxcXFxiUDc2VGlcXFxcYnxcXFxcYlA4MUhEXFxcXGJ8XFxcXGJBMTBcXFxcYnxcXFxcYlQ3NjBWRVxcXFxifFxcXFxiVDcyMEhEXFxcXGJ8XFxcXGJQNzZcXFxcYnxcXFxcYlA3M1xcXFxifFxcXFxiUDcxXFxcXGJ8XFxcXGJQNzJcXFxcYnxcXFxcYlQ3MjBTRVxcXFxifFxcXFxiQzUyMFRpXFxcXGJ8XFxcXGJUNzYwXFxcXGJ8XFxcXGJUNzIwVkVcXFxcYnxUNzIwLTNHRXxUNzIwLVdpRmlcIixPbmRhVGFibGV0OlwiXFxcXGIoVjk3NWl8VmkzMHxWWDUzMHxWNzAxfFZpNjB8VjcwMXN8Vmk1MHxWODAxc3xWNzE5fFZ4NjEwd3xWWDYxMFd8VjgxOWl8VmkxMHxWWDU4MFd8VmkxMHxWNzExc3xWODEzfFY4MTF8VjgyMHd8VjgyMHxWaTIwfFY3MTF8VkkzMFd8VjcxMnxWODkxd3xWOTcyfFY4MTl3fFY4MjB3fFZpNjB8VjgyMHd8VjcxMXxWODEzc3xWODAxfFY4MTl8Vjk3NXN8VjgwMXxWODE5fFY4MTl8VjgxOHxWODExfFY3MTJ8Vjk3NW18VjEwMXd8Vjk2MXd8VjgxMnxWODE4fFY5NzF8Vjk3MXN8VjkxOXxWOTg5fFYxMTZ3fFYxMDJ3fFY5NzN8Vmk0MClcXFxcYltcXFxcc10rXCIsSmF5dGVjaFRhYmxldDpcIlRQQy1QQTc2MlwiLEJsYXVwdW5rdFRhYmxldDpcIkVuZGVhdm91ciA4MDBOR3xFbmRlYXZvdXIgMTAxMFwiLERpZ21hVGFibGV0OlwiXFxcXGIoaUR4MTB8aUR4OXxpRHg4fGlEeDd8aUR4RDd8aUR4RDh8aURzUTh8aURzUTd8aURzUTh8aURzRDEwfGlEbkQ3fDNUUzgwNEh8aURzUTExfGlEajd8aURzMTApXFxcXGJcIixFdm9saW9UYWJsZXQ6XCJBUklBX01pbmlfd2lmaXxBcmlhWyBfXU1pbml8RXZvbGlvIFgxMHxFdm9saW8gWDd8RXZvbGlvIFg4fFxcXFxiRXZvdGFiXFxcXGJ8XFxcXGJOZXVyYVxcXFxiXCIsTGF2YVRhYmxldDpcIlFQQUQgRTcwNHxcXFxcYkl2b3J5U1xcXFxifEUtVEFCIElWT1JZfFxcXFxiRS1UQUJcXFxcYlwiLEFvY1RhYmxldDpcIk1XMDgxMXxNVzA4MTJ8TVcwOTIyfE1USzgzODJ8TVcxMDMxfE1XMDgzMXxNVzA4MjF8TVcwOTMxfE1XMDcxMlwiLE1wbWFuVGFibGV0OlwiTVAxMSBPQ1RBfE1QMTAgT0NUQXxNUFFDMTExNHxNUFFDMTAwNHxNUFFDOTk0fE1QUUM5NzR8TVBRQzk3M3xNUFFDODA0fE1QUUM3ODR8TVBRQzc4MHxcXFxcYk1QRzdcXFxcYnxNUERDRzc1fE1QRENHNzF8TVBEQzEwMDZ8TVAxMDFEQ3xNUERDOTAwMHxNUERDOTA1fE1QREM3MDZIRHxNUERDNzA2fE1QREM3MDV8TVBEQzExMHxNUERDMTAwfE1QREM5OXxNUERDOTd8TVBEQzg4fE1QREM4fE1QREM3N3xNUDcwOXxNSUQ3MDF8TUlENzExfE1JRDE3MHxNUERDNzAzfE1QUUMxMDEwXCIsQ2Vsa29uVGFibGV0OlwiQ1Q2OTV8Q1Q4ODh8Q1RbXFxcXHNdPzkxMHxDVDcgVGFifENUOSBUYWJ8Q1QzIFRhYnxDVDIgVGFifENUMSBUYWJ8QzgyMHxDNzIwfFxcXFxiQ1QtMVxcXFxiXCIsV29sZGVyVGFibGV0OlwibWlUYWIgXFxcXGIoRElBTU9ORHxTUEFDRXxCUk9PS0xZTnxORU98RkxZfE1BTkhBVFRBTnxGVU5LfEVWT0xVVElPTnxTS1l8R09DQVJ8SVJPTnxHRU5JVVN8UE9QfE1JTlR8RVBTSUxPTnxCUk9BRFdBWXxKVU1QfEhPUHxMRUdFTkR8TkVXIEFHRXxMSU5FfEFEVkFOQ0V8RkVFTHxGT0xMT1d8TElLRXxMSU5LfExJVkV8VEhJTkt8RlJFRURPTXxDSElDQUdPfENMRVZFTEFORHxCQUxUSU1PUkUtR0h8SU9XQXxCT1NUT058U0VBVFRMRXxQSE9FTklYfERBTExBU3xJTiAxMDF8TWFzdGVyQ2hlZilcXFxcYlwiLE1lZGlhY29tVGFibGV0OlwiTS1NUEkxMEMzR3xNLVNQMTBFR3xNLVNQMTBFR1B8TS1TUDEwSFhBSHxNLVNQN0hYQUh8TS1TUDEwSFhCSHxNLVNQOEhYQUh8TS1TUDhNWEFcIixNaVRhYmxldDpcIlxcXFxiTUkgUEFEXFxcXGJ8XFxcXGJITSBOT1RFIDFXXFxcXGJcIixOaWJpcnVUYWJsZXQ6XCJOaWJpcnUgTTF8TmliaXJ1IEp1cGl0ZXIgT25lXCIsTmV4b1RhYmxldDpcIk5FWE8gTk9WQXxORVhPIDEwfE5FWE8gQVZJT3xORVhPIEZSRUV8TkVYTyBHT3xORVhPIEVWT3xORVhPIDNHfE5FWE8gU01BUlR8TkVYTyBLSURET3xORVhPIE1PQklcIixMZWFkZXJUYWJsZXQ6XCJUQkxUMTBRfFRCTFQxMEl8VEJMLTEwV0RLQnxUQkwtMTBXREtCTzIwMTN8VEJMLVcyMzBWMnxUQkwtVzQ1MHxUQkwtVzUwMHxTVjU3MnxUQkxUN0l8VEJBLUFDNy04R3xUQkxUNzl8VEJMLThXMTZ8VEJMLTEwVzMyfFRCTC0xMFdLQnxUQkwtVzEwMFwiLFViaXNsYXRlVGFibGV0OlwiVWJpU2xhdGVbXFxcXHNdPzdDXCIsUG9ja2V0Qm9va1RhYmxldDpcIlBvY2tldGJvb2tcIixLb2Nhc29UYWJsZXQ6XCJcXFxcYihUQi0xMjA3KVxcXFxiXCIsSGlzZW5zZVRhYmxldDpcIlxcXFxiKEY1MjgxfEUyMzcxKVxcXFxiXCIsSHVkbDpcIkh1ZGwgSFQ3UzN8SHVkbCAyXCIsVGVsc3RyYVRhYmxldDpcIlQtSHViMlwiLEdlbmVyaWNUYWJsZXQ6XCJBbmRyb2lkLipcXFxcYjk3RFxcXFxifFRhYmxldCg/IS4qUEMpfEJOVFYyNTBBfE1JRC1XQ0RNQXxMb2dpY1BEIFpvb20yfFxcXFxiQTdFQlxcXFxifENhdE5vdmE4fEExXzA3fENUNzA0fENUMTAwMnxcXFxcYk03MjFcXFxcYnxyazMwc2RrfFxcXFxiRVZPVEFCXFxcXGJ8TTc1OEF8RVQ5MDR8QUxVTUlVTTEwfFNtYXJ0ZnJlbiBUYWJ8RW5kZWF2b3VyIDEwMTB8VGFibGV0LVBDLTR8VGFnaSBUYWJ8XFxcXGJNNnByb1xcXFxifENUMTAyMFd8YXJjIDEwSER8XFxcXGJUUDc1MFxcXFxifFxcXFxiUVRBUVozXFxcXGJ8V1ZUMTAxfFRNMTA4OHxLVDEwN1wifSxvc3M6e0FuZHJvaWRPUzpcIkFuZHJvaWRcIixCbGFja0JlcnJ5T1M6XCJibGFja2JlcnJ5fFxcXFxiQkIxMFxcXFxifHJpbSB0YWJsZXQgb3NcIixQYWxtT1M6XCJQYWxtT1N8YXZhbnRnb3xibGF6ZXJ8ZWxhaW5lfGhpcHRvcHxwYWxtfHBsdWNrZXJ8eGlpbm9cIixTeW1iaWFuT1M6XCJTeW1iaWFufFN5bWJPU3xTZXJpZXM2MHxTZXJpZXM0MHxTWUItWzAtOV0rfFxcXFxiUzYwXFxcXGJcIixXaW5kb3dzTW9iaWxlT1M6XCJXaW5kb3dzIENFLiooUFBDfFNtYXJ0cGhvbmV8TW9iaWxlfFswLTldezN9eFswLTldezN9KXxXaW5kb3cgTW9iaWxlfFdpbmRvd3MgUGhvbmUgWzAtOS5dK3xXQ0U7XCIsV2luZG93c1Bob25lT1M6XCJXaW5kb3dzIFBob25lIDEwLjB8V2luZG93cyBQaG9uZSA4LjF8V2luZG93cyBQaG9uZSA4LjB8V2luZG93cyBQaG9uZSBPU3xYQkxXUDd8WnVuZVdQN3xXaW5kb3dzIE5UIDYuWzIzXTsgQVJNO1wiLGlPUzpcIlxcXFxiaVBob25lLipNb2JpbGV8XFxcXGJpUG9kfFxcXFxiaVBhZHxBcHBsZUNvcmVNZWRpYVwiLE1lZUdvT1M6XCJNZWVHb1wiLE1hZW1vT1M6XCJNYWVtb1wiLEphdmFPUzpcIkoyTUUvfFxcXFxiTUlEUFxcXFxifFxcXFxiQ0xEQ1xcXFxiXCIsd2ViT1M6XCJ3ZWJPU3xocHdPU1wiLGJhZGFPUzpcIlxcXFxiQmFkYVxcXFxiXCIsQlJFV09TOlwiQlJFV1wifSx1YXM6e0Nocm9tZTpcIlxcXFxiQ3JNb1xcXFxifENyaU9TfEFuZHJvaWQuKkNocm9tZS9bLjAtOV0qIChNb2JpbGUpP1wiLERvbGZpbjpcIlxcXFxiRG9sZmluXFxcXGJcIixPcGVyYTpcIk9wZXJhLipNaW5pfE9wZXJhLipNb2JpfEFuZHJvaWQuKk9wZXJhfE1vYmlsZS4qT1BSL1swLTkuXSt8Q29hc3QvWzAtOS5dK1wiLFNreWZpcmU6XCJTa3lmaXJlXCIsRWRnZTpcIk1vYmlsZSBTYWZhcmkvWy4wLTldKiBFZGdlXCIsSUU6XCJJRU1vYmlsZXxNU0lFTW9iaWxlXCIsRmlyZWZveDpcImZlbm5lY3xmaXJlZm94LiptYWVtb3woTW9iaWxlfFRhYmxldCkuKkZpcmVmb3h8RmlyZWZveC4qTW9iaWxlfEZ4aU9TXCIsQm9sdDpcImJvbHRcIixUZWFTaGFyazpcInRlYXNoYXJrXCIsQmxhemVyOlwiQmxhemVyXCIsU2FmYXJpOlwiVmVyc2lvbi4qTW9iaWxlLipTYWZhcml8U2FmYXJpLipNb2JpbGV8TW9iaWxlU2FmYXJpXCIsVUNCcm93c2VyOlwiVUMuKkJyb3dzZXJ8VUNXRUJcIixiYWlkdWJveGFwcDpcImJhaWR1Ym94YXBwXCIsYmFpZHVicm93c2VyOlwiYmFpZHVicm93c2VyXCIsRGlpZ29Ccm93c2VyOlwiRGlpZ29Ccm93c2VyXCIsUHVmZmluOlwiUHVmZmluXCIsTWVyY3VyeTpcIlxcXFxiTWVyY3VyeVxcXFxiXCIsT2JpZ29Ccm93c2VyOlwiT2JpZ29cIixOZXRGcm9udDpcIk5GLUJyb3dzZXJcIixHZW5lcmljQnJvd3NlcjpcIk5va2lhQnJvd3NlcnxPdmlCcm93c2VyfE9uZUJyb3dzZXJ8VHdvbmt5QmVhbUJyb3dzZXJ8U0VNQy4qQnJvd3NlcnxGbHlGbG93fE1pbmltb3xOZXRGcm9udHxOb3ZhcnJhLVZpc2lvbnxNUVFCcm93c2VyfE1pY3JvTWVzc2VuZ2VyXCIsUGFsZU1vb246XCJBbmRyb2lkLipQYWxlTW9vbnxNb2JpbGUuKlBhbGVNb29uXCJ9LHByb3BzOntNb2JpbGU6XCJNb2JpbGUvW1ZFUl1cIixCdWlsZDpcIkJ1aWxkL1tWRVJdXCIsVmVyc2lvbjpcIlZlcnNpb24vW1ZFUl1cIixWZW5kb3JJRDpcIlZlbmRvcklEL1tWRVJdXCIsaVBhZDpcImlQYWQuKkNQVVthLXogXStbVkVSXVwiLGlQaG9uZTpcImlQaG9uZS4qQ1BVW2EteiBdK1tWRVJdXCIsaVBvZDpcImlQb2QuKkNQVVthLXogXStbVkVSXVwiLEtpbmRsZTpcIktpbmRsZS9bVkVSXVwiLENocm9tZTpbXCJDaHJvbWUvW1ZFUl1cIixcIkNyaU9TL1tWRVJdXCIsXCJDck1vL1tWRVJdXCJdLENvYXN0OltcIkNvYXN0L1tWRVJdXCJdLERvbGZpbjpcIkRvbGZpbi9bVkVSXVwiLEZpcmVmb3g6W1wiRmlyZWZveC9bVkVSXVwiLFwiRnhpT1MvW1ZFUl1cIl0sRmVubmVjOlwiRmVubmVjL1tWRVJdXCIsRWRnZTpcIkVkZ2UvW1ZFUl1cIixJRTpbXCJJRU1vYmlsZS9bVkVSXTtcIixcIklFTW9iaWxlIFtWRVJdXCIsXCJNU0lFIFtWRVJdO1wiLFwiVHJpZGVudC9bMC05Ll0rOy4qcnY6W1ZFUl1cIl0sTmV0RnJvbnQ6XCJOZXRGcm9udC9bVkVSXVwiLE5va2lhQnJvd3NlcjpcIk5va2lhQnJvd3Nlci9bVkVSXVwiLE9wZXJhOltcIiBPUFIvW1ZFUl1cIixcIk9wZXJhIE1pbmkvW1ZFUl1cIixcIlZlcnNpb24vW1ZFUl1cIl0sXCJPcGVyYSBNaW5pXCI6XCJPcGVyYSBNaW5pL1tWRVJdXCIsXCJPcGVyYSBNb2JpXCI6XCJWZXJzaW9uL1tWRVJdXCIsVUNCcm93c2VyOltcIlVDV0VCW1ZFUl1cIixcIlVDLipCcm93c2VyL1tWRVJdXCJdLE1RUUJyb3dzZXI6XCJNUVFCcm93c2VyL1tWRVJdXCIsTWljcm9NZXNzZW5nZXI6XCJNaWNyb01lc3Nlbmdlci9bVkVSXVwiLGJhaWR1Ym94YXBwOlwiYmFpZHVib3hhcHAvW1ZFUl1cIixiYWlkdWJyb3dzZXI6XCJiYWlkdWJyb3dzZXIvW1ZFUl1cIixTYW1zdW5nQnJvd3NlcjpcIlNhbXN1bmdCcm93c2VyL1tWRVJdXCIsSXJvbjpcIklyb24vW1ZFUl1cIixTYWZhcmk6W1wiVmVyc2lvbi9bVkVSXVwiLFwiU2FmYXJpL1tWRVJdXCJdLFNreWZpcmU6XCJTa3lmaXJlL1tWRVJdXCIsVGl6ZW46XCJUaXplbi9bVkVSXVwiLFdlYmtpdDpcIndlYmtpdFsgL11bVkVSXVwiLFBhbGVNb29uOlwiUGFsZU1vb24vW1ZFUl1cIixHZWNrbzpcIkdlY2tvL1tWRVJdXCIsVHJpZGVudDpcIlRyaWRlbnQvW1ZFUl1cIixQcmVzdG86XCJQcmVzdG8vW1ZFUl1cIixHb2FubmE6XCJHb2FubmEvW1ZFUl1cIixpT1M6XCIgXFxcXGJpP09TXFxcXGIgW1ZFUl1bIDtdezF9XCIsQW5kcm9pZDpcIkFuZHJvaWQgW1ZFUl1cIixCbGFja0JlcnJ5OltcIkJsYWNrQmVycnlbXFxcXHddKy9bVkVSXVwiLFwiQmxhY2tCZXJyeS4qVmVyc2lvbi9bVkVSXVwiLFwiVmVyc2lvbi9bVkVSXVwiXSxCUkVXOlwiQlJFVyBbVkVSXVwiLEphdmE6XCJKYXZhL1tWRVJdXCIsXCJXaW5kb3dzIFBob25lIE9TXCI6W1wiV2luZG93cyBQaG9uZSBPUyBbVkVSXVwiLFwiV2luZG93cyBQaG9uZSBbVkVSXVwiXSxcIldpbmRvd3MgUGhvbmVcIjpcIldpbmRvd3MgUGhvbmUgW1ZFUl1cIixcIldpbmRvd3MgQ0VcIjpcIldpbmRvd3MgQ0UvW1ZFUl1cIixcIldpbmRvd3MgTlRcIjpcIldpbmRvd3MgTlQgW1ZFUl1cIixTeW1iaWFuOltcIlN5bWJpYW5PUy9bVkVSXVwiLFwiU3ltYmlhbi9bVkVSXVwiXSx3ZWJPUzpbXCJ3ZWJPUy9bVkVSXVwiLFwiaHB3T1MvW1ZFUl07XCJdfSx1dGlsczp7Qm90OlwiR29vZ2xlYm90fGZhY2Vib29rZXh0ZXJuYWxoaXR8QWRzQm90LUdvb2dsZXxHb29nbGUgS2V5d29yZCBTdWdnZXN0aW9ufEZhY2Vib3R8WWFuZGV4Qm90fFlhbmRleE1vYmlsZUJvdHxiaW5nYm90fGlhX2FyY2hpdmVyfEFocmVmc0JvdHxFem9vbXN8R1NMRmJvdHxXQlNlYXJjaEJvdHxUd2l0dGVyYm90fFR3ZWV0bWVtZUJvdHxUd2lrbGV8UGFwZXJMaUJvdHxXb3Rib3h8VW53aW5kRmV0Y2hvcnxFeGFib3R8TUoxMmJvdHxZYW5kZXhJbWFnZXN8VHVybml0aW5Cb3R8UGluZ2RvbVwiLE1vYmlsZUJvdDpcIkdvb2dsZWJvdC1Nb2JpbGV8QWRzQm90LUdvb2dsZS1Nb2JpbGV8WWFob29TZWVrZXIvTTFBMS1SMkQyXCIsRGVza3RvcE1vZGU6XCJXUERlc2t0b3BcIixUVjpcIlNvbnlEVFZ8SGJiVFZcIixXZWJLaXQ6XCIod2Via2l0KVsgL10oW1xcXFx3Ll0rKVwiLENvbnNvbGU6XCJcXFxcYihOaW50ZW5kb3xOaW50ZW5kbyBXaWlVfE5pbnRlbmRvIDNEU3xOaW50ZW5kbyBTd2l0Y2h8UExBWVNUQVRJT058WGJveClcXFxcYlwiLFdhdGNoOlwiU00tVjcwMFwifX0sZGV0ZWN0TW9iaWxlQnJvd3NlcnM6e2Z1bGxQYXR0ZXJuOi8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcmlzfGtpbmRsZXxsZ2UgfG1hZW1vfG1pZHB8bW1wfG1vYmlsZS4rZmlyZWZveHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyBjZXx4ZGF8eGlpbm8vaSxzaG9ydFBhdHRlcm46LzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2ksdGFibGV0UGF0dGVybjovYW5kcm9pZHxpcGFkfHBsYXlib29rfHNpbGsvaX19LHQsdT1PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O3JldHVybiBzLkZBTExCQUNLX1BIT05FPVwiVW5rbm93blBob25lXCIscy5GQUxMQkFDS19UQUJMRVQ9XCJVbmtub3duVGFibGV0XCIscy5GQUxMQkFDS19NT0JJTEU9XCJVbmtub3duTW9iaWxlXCIsdD1cImlzQXJyYXlcImluIEFycmF5P0FycmF5LmlzQXJyYXk6ZnVuY3Rpb24odil7cmV0dXJuXCJbb2JqZWN0IEFycmF5XVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHYpfSxmdW5jdGlvbigpe3ZhciB2LHcseCx5LHosQSxCPXMubW9iaWxlRGV0ZWN0UnVsZXM7Zm9yKHYgaW4gQi5wcm9wcylpZih1LmNhbGwoQi5wcm9wcyx2KSl7Zm9yKHc9Qi5wcm9wc1t2XSx0KHcpfHwodz1bd10pLHo9dy5sZW5ndGgseT0wO3k8ejsrK3kpeD13W3ldLEE9eC5pbmRleE9mKFwiW1ZFUl1cIiksMDw9QSYmKHg9eC5zdWJzdHJpbmcoMCxBKStcIihbXFxcXHcuX1xcXFwrXSspXCIreC5zdWJzdHJpbmcoQSs1KSksd1t5XT1uZXcgUmVnRXhwKHgsXCJpXCIpO0IucHJvcHNbdl09d31wKEIub3NzKSxwKEIucGhvbmVzKSxwKEIudGFibGV0cykscChCLnVhcykscChCLnV0aWxzKSxCLm9zczA9e1dpbmRvd3NQaG9uZU9TOkIub3NzLldpbmRvd3NQaG9uZU9TLFdpbmRvd3NNb2JpbGVPUzpCLm9zcy5XaW5kb3dzTW9iaWxlT1N9fSgpLHMuZmluZE1hdGNoPWZ1bmN0aW9uKHYsdyl7Zm9yKHZhciB4IGluIHYpaWYodS5jYWxsKHYseCkmJnZbeF0udGVzdCh3KSlyZXR1cm4geDtyZXR1cm4gbnVsbH0scy5maW5kTWF0Y2hlcz1mdW5jdGlvbih2LHcpe3ZhciB4PVtdO2Zvcih2YXIgeSBpbiB2KXUuY2FsbCh2LHkpJiZ2W3ldLnRlc3QodykmJngucHVzaCh5KTtyZXR1cm4geH0scy5nZXRWZXJzaW9uU3RyPWZ1bmN0aW9uKHYsdyl7dmFyIHgseSx6LEEsQj1zLm1vYmlsZURldGVjdFJ1bGVzLnByb3BzO2lmKHUuY2FsbChCLHYpKWZvcih4PUJbdl0sej14Lmxlbmd0aCx5PTA7eTx6OysreSlpZihBPXhbeV0uZXhlYyh3KSxudWxsIT09QSlyZXR1cm4gQVsxXTtyZXR1cm4gbnVsbH0scy5nZXRWZXJzaW9uPWZ1bmN0aW9uKHYsdyl7dmFyIHg9cy5nZXRWZXJzaW9uU3RyKHYsdyk7cmV0dXJuIHg/cy5wcmVwYXJlVmVyc2lvbk5vKHgpOk5hTn0scy5wcmVwYXJlVmVyc2lvbk5vPWZ1bmN0aW9uKHYpe3ZhciB3O3JldHVybiB3PXYuc3BsaXQoL1thLXouXyBcXC9cXC1dL2kpLDE9PT13Lmxlbmd0aCYmKHY9d1swXSksMTx3Lmxlbmd0aCYmKHY9d1swXStcIi5cIix3LnNoaWZ0KCksdis9dy5qb2luKFwiXCIpKSwrdn0scy5pc01vYmlsZUZhbGxiYWNrPWZ1bmN0aW9uKHYpe3JldHVybiBzLmRldGVjdE1vYmlsZUJyb3dzZXJzLmZ1bGxQYXR0ZXJuLnRlc3Qodil8fHMuZGV0ZWN0TW9iaWxlQnJvd3NlcnMuc2hvcnRQYXR0ZXJuLnRlc3Qodi5zdWJzdHIoMCw0KSl9LHMuaXNUYWJsZXRGYWxsYmFjaz1mdW5jdGlvbih2KXtyZXR1cm4gcy5kZXRlY3RNb2JpbGVCcm93c2Vycy50YWJsZXRQYXR0ZXJuLnRlc3Qodil9LHMucHJlcGFyZURldGVjdGlvbkNhY2hlPWZ1bmN0aW9uKHYsdyx4KXtpZih2Lm1vYmlsZT09PW0pe3ZhciB5LHosQTtyZXR1cm4oej1zLmZpbmRNYXRjaChzLm1vYmlsZURldGVjdFJ1bGVzLnRhYmxldHMsdykpPyh2Lm1vYmlsZT12LnRhYmxldD16LHZvaWQodi5waG9uZT1udWxsKSk6KHk9cy5maW5kTWF0Y2gocy5tb2JpbGVEZXRlY3RSdWxlcy5waG9uZXMsdykpPyh2Lm1vYmlsZT12LnBob25lPXksdm9pZCh2LnRhYmxldD1udWxsKSk6dm9pZChzLmlzTW9iaWxlRmFsbGJhY2sodyk/KEE9ci5pc1Bob25lU2l6ZWQoeCksQT09PW0/KHYubW9iaWxlPXMuRkFMTEJBQ0tfTU9CSUxFLHYudGFibGV0PXYucGhvbmU9bnVsbCk6QT8odi5tb2JpbGU9di5waG9uZT1zLkZBTExCQUNLX1BIT05FLHYudGFibGV0PW51bGwpOih2Lm1vYmlsZT12LnRhYmxldD1zLkZBTExCQUNLX1RBQkxFVCx2LnBob25lPW51bGwpKTpzLmlzVGFibGV0RmFsbGJhY2sodyk/KHYubW9iaWxlPXYudGFibGV0PXMuRkFMTEJBQ0tfVEFCTEVULHYucGhvbmU9bnVsbCk6di5tb2JpbGU9di50YWJsZXQ9di5waG9uZT1udWxsKX19LHMubW9iaWxlR3JhZGU9ZnVuY3Rpb24odil7dmFyIHc9bnVsbCE9PXYubW9iaWxlKCk7cmV0dXJuIHYub3MoXCJpT1NcIikmJjQuMzw9di52ZXJzaW9uKFwiaVBhZFwiKXx8di5vcyhcImlPU1wiKSYmMy4xPD12LnZlcnNpb24oXCJpUGhvbmVcIil8fHYub3MoXCJpT1NcIikmJjMuMTw9di52ZXJzaW9uKFwiaVBvZFwiKXx8Mi4xPHYudmVyc2lvbihcIkFuZHJvaWRcIikmJnYuaXMoXCJXZWJraXRcIil8fDc8PXYudmVyc2lvbihcIldpbmRvd3MgUGhvbmUgT1NcIil8fHYuaXMoXCJCbGFja0JlcnJ5XCIpJiY2PD12LnZlcnNpb24oXCJCbGFja0JlcnJ5XCIpfHx2Lm1hdGNoKFwiUGxheWJvb2suKlRhYmxldFwiKXx8MS40PD12LnZlcnNpb24oXCJ3ZWJPU1wiKSYmdi5tYXRjaChcIlBhbG18UHJlfFBpeGlcIil8fHYubWF0Y2goXCJocC4qVG91Y2hQYWRcIil8fHYuaXMoXCJGaXJlZm94XCIpJiYxMjw9di52ZXJzaW9uKFwiRmlyZWZveFwiKXx8di5pcyhcIkNocm9tZVwiKSYmdi5pcyhcIkFuZHJvaWRPU1wiKSYmNDw9di52ZXJzaW9uKFwiQW5kcm9pZFwiKXx8di5pcyhcIlNreWZpcmVcIikmJjQuMTw9di52ZXJzaW9uKFwiU2t5ZmlyZVwiKSYmdi5pcyhcIkFuZHJvaWRPU1wiKSYmMi4zPD12LnZlcnNpb24oXCJBbmRyb2lkXCIpfHx2LmlzKFwiT3BlcmFcIikmJjExPHYudmVyc2lvbihcIk9wZXJhIE1vYmlcIikmJnYuaXMoXCJBbmRyb2lkT1NcIil8fHYuaXMoXCJNZWVHb09TXCIpfHx2LmlzKFwiVGl6ZW5cIil8fHYuaXMoXCJEb2xmaW5cIikmJjI8PXYudmVyc2lvbihcIkJhZGFcIil8fCh2LmlzKFwiVUMgQnJvd3NlclwiKXx8di5pcyhcIkRvbGZpblwiKSkmJjIuMzw9di52ZXJzaW9uKFwiQW5kcm9pZFwiKXx8di5tYXRjaChcIktpbmRsZSBGaXJlXCIpfHx2LmlzKFwiS2luZGxlXCIpJiYzPD12LnZlcnNpb24oXCJLaW5kbGVcIil8fHYuaXMoXCJBbmRyb2lkT1NcIikmJnYuaXMoXCJOb29rVGFibGV0XCIpfHwxMTw9di52ZXJzaW9uKFwiQ2hyb21lXCIpJiYhd3x8NTw9di52ZXJzaW9uKFwiU2FmYXJpXCIpJiYhd3x8NDw9di52ZXJzaW9uKFwiRmlyZWZveFwiKSYmIXd8fDc8PXYudmVyc2lvbihcIk1TSUVcIikmJiF3fHwxMDw9di52ZXJzaW9uKFwiT3BlcmFcIikmJiF3P1wiQVwiOnYub3MoXCJpT1NcIikmJjQuMz52LnZlcnNpb24oXCJpUGFkXCIpfHx2Lm9zKFwiaU9TXCIpJiYzLjE+di52ZXJzaW9uKFwiaVBob25lXCIpfHx2Lm9zKFwiaU9TXCIpJiYzLjE+di52ZXJzaW9uKFwiaVBvZFwiKXx8di5pcyhcIkJsYWNrYmVycnlcIikmJjU8PXYudmVyc2lvbihcIkJsYWNrQmVycnlcIikmJjY+di52ZXJzaW9uKFwiQmxhY2tCZXJyeVwiKXx8NTw9di52ZXJzaW9uKFwiT3BlcmEgTWluaVwiKSYmNi41Pj12LnZlcnNpb24oXCJPcGVyYSBNaW5pXCIpJiYoMi4zPD12LnZlcnNpb24oXCJBbmRyb2lkXCIpfHx2LmlzKFwiaU9TXCIpKXx8di5tYXRjaChcIk5va2lhTjh8Tm9raWFDN3xOOTcuKlNlcmllczYwfFN5bWJpYW4vM1wiKXx8MTE8PXYudmVyc2lvbihcIk9wZXJhIE1vYmlcIikmJnYuaXMoXCJTeW1iaWFuT1NcIik/XCJCXCI6KDU+di52ZXJzaW9uKFwiQmxhY2tCZXJyeVwiKXx8di5tYXRjaChcIk1TSUVNb2JpbGV8V2luZG93cyBDRS4qTW9iaWxlXCIpfHw1LjI+PXYudmVyc2lvbihcIldpbmRvd3MgTW9iaWxlXCIpLFwiQ1wiKX0scy5kZXRlY3RPUz1mdW5jdGlvbih2KXtyZXR1cm4gcy5maW5kTWF0Y2gocy5tb2JpbGVEZXRlY3RSdWxlcy5vc3MwLHYpfHxzLmZpbmRNYXRjaChzLm1vYmlsZURldGVjdFJ1bGVzLm9zcyx2KX0scy5nZXREZXZpY2VTbWFsbGVyU2lkZT1mdW5jdGlvbigpe3JldHVybiB3aW5kb3cuc2NyZWVuLndpZHRoPHdpbmRvdy5zY3JlZW4uaGVpZ2h0P3dpbmRvdy5zY3JlZW4ud2lkdGg6d2luZG93LnNjcmVlbi5oZWlnaHR9LHIucHJvdG90eXBlPXtjb25zdHJ1Y3RvcjpyLG1vYmlsZTpmdW5jdGlvbiBtb2JpbGUoKXtyZXR1cm4gcy5wcmVwYXJlRGV0ZWN0aW9uQ2FjaGUodGhpcy5fY2FjaGUsdGhpcy51YSx0aGlzLm1heFBob25lV2lkdGgpLHRoaXMuX2NhY2hlLm1vYmlsZX0scGhvbmU6ZnVuY3Rpb24gcGhvbmUoKXtyZXR1cm4gcy5wcmVwYXJlRGV0ZWN0aW9uQ2FjaGUodGhpcy5fY2FjaGUsdGhpcy51YSx0aGlzLm1heFBob25lV2lkdGgpLHRoaXMuX2NhY2hlLnBob25lfSx0YWJsZXQ6ZnVuY3Rpb24gdGFibGV0KCl7cmV0dXJuIHMucHJlcGFyZURldGVjdGlvbkNhY2hlKHRoaXMuX2NhY2hlLHRoaXMudWEsdGhpcy5tYXhQaG9uZVdpZHRoKSx0aGlzLl9jYWNoZS50YWJsZXR9LHVzZXJBZ2VudDpmdW5jdGlvbiB1c2VyQWdlbnQoKXtyZXR1cm4gdGhpcy5fY2FjaGUudXNlckFnZW50PT09bSYmKHRoaXMuX2NhY2hlLnVzZXJBZ2VudD1zLmZpbmRNYXRjaChzLm1vYmlsZURldGVjdFJ1bGVzLnVhcyx0aGlzLnVhKSksdGhpcy5fY2FjaGUudXNlckFnZW50fSx1c2VyQWdlbnRzOmZ1bmN0aW9uIHVzZXJBZ2VudHMoKXtyZXR1cm4gdGhpcy5fY2FjaGUudXNlckFnZW50cz09PW0mJih0aGlzLl9jYWNoZS51c2VyQWdlbnRzPXMuZmluZE1hdGNoZXMocy5tb2JpbGVEZXRlY3RSdWxlcy51YXMsdGhpcy51YSkpLHRoaXMuX2NhY2hlLnVzZXJBZ2VudHN9LG9zOmZ1bmN0aW9uIG9zKCl7cmV0dXJuIHRoaXMuX2NhY2hlLm9zPT09bSYmKHRoaXMuX2NhY2hlLm9zPXMuZGV0ZWN0T1ModGhpcy51YSkpLHRoaXMuX2NhY2hlLm9zfSx2ZXJzaW9uOmZ1bmN0aW9uIHZlcnNpb24odil7cmV0dXJuIHMuZ2V0VmVyc2lvbih2LHRoaXMudWEpfSx2ZXJzaW9uU3RyOmZ1bmN0aW9uIHZlcnNpb25TdHIodil7cmV0dXJuIHMuZ2V0VmVyc2lvblN0cih2LHRoaXMudWEpfSxpczpmdW5jdGlvbiBpcyh2KXtyZXR1cm4gbyh0aGlzLnVzZXJBZ2VudHMoKSx2KXx8bih2LHRoaXMub3MoKSl8fG4odix0aGlzLnBob25lKCkpfHxuKHYsdGhpcy50YWJsZXQoKSl8fG8ocy5maW5kTWF0Y2hlcyhzLm1vYmlsZURldGVjdFJ1bGVzLnV0aWxzLHRoaXMudWEpLHYpfSxtYXRjaDpmdW5jdGlvbiBtYXRjaCh2KXtyZXR1cm4gdiBpbnN0YW5jZW9mIFJlZ0V4cHx8KHY9bmV3IFJlZ0V4cCh2LFwiaVwiKSksdi50ZXN0KHRoaXMudWEpfSxpc1Bob25lU2l6ZWQ6ZnVuY3Rpb24gaXNQaG9uZVNpemVkKHYpe3JldHVybiByLmlzUGhvbmVTaXplZCh2fHx0aGlzLm1heFBob25lV2lkdGgpfSxtb2JpbGVHcmFkZTpmdW5jdGlvbiBtb2JpbGVHcmFkZSgpe3JldHVybiB0aGlzLl9jYWNoZS5ncmFkZT09PW0mJih0aGlzLl9jYWNoZS5ncmFkZT1zLm1vYmlsZUdyYWRlKHRoaXMpKSx0aGlzLl9jYWNoZS5ncmFkZX19LHIuaXNQaG9uZVNpemVkPVwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJndpbmRvdy5zY3JlZW4/ZnVuY3Rpb24odil7cmV0dXJuIDA+dj9tOnMuZ2V0RGV2aWNlU21hbGxlclNpZGUoKTw9dn06ZnVuY3Rpb24oKXt9LHIuX2ltcGw9cyxyLnZlcnNpb249XCIxLjQuMiAyMDE4LTA2LTEwXCIscn0pfShmdW5jdGlvbigpe2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzKXJldHVybiBmdW5jdGlvbihtKXttb2R1bGUuZXhwb3J0cz1tKCl9O2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClyZXR1cm4gZGVmaW5lO2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cpcmV0dXJuIGZ1bmN0aW9uKG0pe3dpbmRvdy5Nb2JpbGVEZXRlY3Q9bSgpfTt0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIGVudmlyb25tZW50XCIpfSgpKTsiLCIvKlxyXG4gICAgIF8gXyAgICAgIF8gICAgICAgX1xyXG4gX19ffCAoXykgX19ffCB8IF9fICAoXylfX19cclxuLyBfX3wgfCB8LyBfX3wgfC8gLyAgfCAvIF9ffFxyXG5cXF9fIFxcIHwgfCAoX198ICAgPCBfIHwgXFxfXyBcXFxyXG58X19fL198X3xcXF9fX3xffFxcXyhfKS8gfF9fXy9cclxuICAgICAgICAgICAgICAgICAgIHxfXy9cclxuXHJcbiBWZXJzaW9uOiAxLjguMFxyXG4gIEF1dGhvcjogS2VuIFdoZWVsZXJcclxuIFdlYnNpdGU6IGh0dHA6Ly9rZW53aGVlbGVyLmdpdGh1Yi5pb1xyXG4gICAgRG9jczogaHR0cDovL2tlbndoZWVsZXIuZ2l0aHViLmlvL3NsaWNrXHJcbiAgICBSZXBvOiBodHRwOi8vZ2l0aHViLmNvbS9rZW53aGVlbGVyL3NsaWNrXHJcbiAgSXNzdWVzOiBodHRwOi8vZ2l0aHViLmNvbS9rZW53aGVlbGVyL3NsaWNrL2lzc3Vlc1xyXG5cclxuICovXHJcbi8qIGdsb2JhbCB3aW5kb3csIGRvY3VtZW50LCBkZWZpbmUsIGpRdWVyeSwgc2V0SW50ZXJ2YWwsIGNsZWFySW50ZXJ2YWwgKi9cclxuOyhmdW5jdGlvbihmYWN0b3J5KSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICAgICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBmYWN0b3J5KGpRdWVyeSk7XHJcbiAgICB9XHJcblxyXG59KGZ1bmN0aW9uKCQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHZhciBTbGljayA9IHdpbmRvdy5TbGljayB8fCB7fTtcclxuXHJcbiAgICBTbGljayA9IChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIGluc3RhbmNlVWlkID0gMDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gU2xpY2soZWxlbWVudCwgc2V0dGluZ3MpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBfID0gdGhpcywgZGF0YVNldHRpbmdzO1xyXG5cclxuICAgICAgICAgICAgXy5kZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgICAgIGFjY2Vzc2liaWxpdHk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhcHBlbmRBcnJvd3M6ICQoZWxlbWVudCksXHJcbiAgICAgICAgICAgICAgICBhcHBlbmREb3RzOiAkKGVsZW1lbnQpLFxyXG4gICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYXNOYXZGb3I6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBwcmV2QXJyb3c6ICc8YnV0dG9uIGNsYXNzPVwic2xpY2stcHJldlwiIGFyaWEtbGFiZWw9XCJQcmV2aW91c1wiIHR5cGU9XCJidXR0b25cIj5QcmV2aW91czwvYnV0dG9uPicsXHJcbiAgICAgICAgICAgICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIGNsYXNzPVwic2xpY2stbmV4dFwiIGFyaWEtbGFiZWw9XCJOZXh0XCIgdHlwZT1cImJ1dHRvblwiPk5leHQ8L2J1dHRvbj4nLFxyXG4gICAgICAgICAgICAgICAgYXV0b3BsYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXV0b3BsYXlTcGVlZDogMzAwMCxcclxuICAgICAgICAgICAgICAgIGNlbnRlck1vZGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyUGFkZGluZzogJzUwcHgnLFxyXG4gICAgICAgICAgICAgICAgY3NzRWFzZTogJ2Vhc2UnLFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tUGFnaW5nOiBmdW5jdGlvbihzbGlkZXIsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCgnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgLz4nKS50ZXh0KGkgKyAxKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGRvdHNDbGFzczogJ3NsaWNrLWRvdHMnLFxyXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZWFzaW5nOiAnbGluZWFyJyxcclxuICAgICAgICAgICAgICAgIGVkZ2VGcmljdGlvbjogMC4zNSxcclxuICAgICAgICAgICAgICAgIGZhZGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZm9jdXNPblNlbGVjdDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBmb2N1c09uQ2hhbmdlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgaW5pdGlhbFNsaWRlOiAwLFxyXG4gICAgICAgICAgICAgICAgbGF6eUxvYWQ6ICdvbmRlbWFuZCcsXHJcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwYXVzZU9uSG92ZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwYXVzZU9uRm9jdXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwYXVzZU9uRG90c0hvdmVyOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHJlc3BvbmRUbzogJ3dpbmRvdycsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgcm93czogMSxcclxuICAgICAgICAgICAgICAgIHJ0bDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzbGlkZTogJycsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJSb3c6IDEsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgICAgIHNwZWVkOiA1MDAsXHJcbiAgICAgICAgICAgICAgICBzd2lwZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHN3aXBlVG9TbGlkZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB0b3VjaE1vdmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0b3VjaFRocmVzaG9sZDogNSxcclxuICAgICAgICAgICAgICAgIHVzZUNTUzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHVzZVRyYW5zZm9ybTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdmVydGljYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdmVydGljYWxTd2lwaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHdhaXRGb3JBbmltYXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgekluZGV4OiAxMDAwXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBfLmluaXRpYWxzID0ge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGF1dG9QbGF5VGltZXI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50RGlyZWN0aW9uOiAwLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudExlZnQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U2xpZGU6IDAsXHJcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246IDEsXHJcbiAgICAgICAgICAgICAgICAkZG90czogbnVsbCxcclxuICAgICAgICAgICAgICAgIGxpc3RXaWR0aDogbnVsbCxcclxuICAgICAgICAgICAgICAgIGxpc3RIZWlnaHQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBsb2FkSW5kZXg6IDAsXHJcbiAgICAgICAgICAgICAgICAkbmV4dEFycm93OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgJHByZXZBcnJvdzogbnVsbCxcclxuICAgICAgICAgICAgICAgIHNjcm9sbGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzbGlkZUNvdW50OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVXaWR0aDogbnVsbCxcclxuICAgICAgICAgICAgICAgICRzbGlkZVRyYWNrOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgJHNsaWRlczogbnVsbCxcclxuICAgICAgICAgICAgICAgIHNsaWRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVPZmZzZXQ6IDAsXHJcbiAgICAgICAgICAgICAgICBzd2lwZUxlZnQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBzd2lwaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICRsaXN0OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgdG91Y2hPYmplY3Q6IHt9LFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3Jtc0VuYWJsZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdW5zbGlja2VkOiBmYWxzZVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJC5leHRlbmQoXywgXy5pbml0aWFscyk7XHJcblxyXG4gICAgICAgICAgICBfLmFjdGl2ZUJyZWFrcG9pbnQgPSBudWxsO1xyXG4gICAgICAgICAgICBfLmFuaW1UeXBlID0gbnVsbDtcclxuICAgICAgICAgICAgXy5hbmltUHJvcCA9IG51bGw7XHJcbiAgICAgICAgICAgIF8uYnJlYWtwb2ludHMgPSBbXTtcclxuICAgICAgICAgICAgXy5icmVha3BvaW50U2V0dGluZ3MgPSBbXTtcclxuICAgICAgICAgICAgXy5jc3NUcmFuc2l0aW9ucyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBfLmZvY3Vzc2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIF8uaW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgXy5oaWRkZW4gPSAnaGlkZGVuJztcclxuICAgICAgICAgICAgXy5wYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBfLnBvc2l0aW9uUHJvcCA9IG51bGw7XHJcbiAgICAgICAgICAgIF8ucmVzcG9uZFRvID0gbnVsbDtcclxuICAgICAgICAgICAgXy5yb3dDb3VudCA9IDE7XHJcbiAgICAgICAgICAgIF8uc2hvdWxkQ2xpY2sgPSB0cnVlO1xyXG4gICAgICAgICAgICBfLiRzbGlkZXIgPSAkKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBfLiRzbGlkZXNDYWNoZSA9IG51bGw7XHJcbiAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSBudWxsO1xyXG4gICAgICAgICAgICBfLnZpc2liaWxpdHlDaGFuZ2UgPSAndmlzaWJpbGl0eWNoYW5nZSc7XHJcbiAgICAgICAgICAgIF8ud2luZG93V2lkdGggPSAwO1xyXG4gICAgICAgICAgICBfLndpbmRvd1RpbWVyID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGRhdGFTZXR0aW5ncyA9ICQoZWxlbWVudCkuZGF0YSgnc2xpY2snKSB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgIF8ub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBfLmRlZmF1bHRzLCBzZXR0aW5ncywgZGF0YVNldHRpbmdzKTtcclxuXHJcbiAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5vcHRpb25zLmluaXRpYWxTbGlkZTtcclxuXHJcbiAgICAgICAgICAgIF8ub3JpZ2luYWxTZXR0aW5ncyA9IF8ub3B0aW9ucztcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQubW96SGlkZGVuICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgXy5oaWRkZW4gPSAnbW96SGlkZGVuJztcclxuICAgICAgICAgICAgICAgIF8udmlzaWJpbGl0eUNoYW5nZSA9ICdtb3p2aXNpYmlsaXR5Y2hhbmdlJztcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQud2Via2l0SGlkZGVuICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgXy5oaWRkZW4gPSAnd2Via2l0SGlkZGVuJztcclxuICAgICAgICAgICAgICAgIF8udmlzaWJpbGl0eUNoYW5nZSA9ICd3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgXy5hdXRvUGxheSA9ICQucHJveHkoXy5hdXRvUGxheSwgXyk7XHJcbiAgICAgICAgICAgIF8uYXV0b1BsYXlDbGVhciA9ICQucHJveHkoXy5hdXRvUGxheUNsZWFyLCBfKTtcclxuICAgICAgICAgICAgXy5hdXRvUGxheUl0ZXJhdG9yID0gJC5wcm94eShfLmF1dG9QbGF5SXRlcmF0b3IsIF8pO1xyXG4gICAgICAgICAgICBfLmNoYW5nZVNsaWRlID0gJC5wcm94eShfLmNoYW5nZVNsaWRlLCBfKTtcclxuICAgICAgICAgICAgXy5jbGlja0hhbmRsZXIgPSAkLnByb3h5KF8uY2xpY2tIYW5kbGVyLCBfKTtcclxuICAgICAgICAgICAgXy5zZWxlY3RIYW5kbGVyID0gJC5wcm94eShfLnNlbGVjdEhhbmRsZXIsIF8pO1xyXG4gICAgICAgICAgICBfLnNldFBvc2l0aW9uID0gJC5wcm94eShfLnNldFBvc2l0aW9uLCBfKTtcclxuICAgICAgICAgICAgXy5zd2lwZUhhbmRsZXIgPSAkLnByb3h5KF8uc3dpcGVIYW5kbGVyLCBfKTtcclxuICAgICAgICAgICAgXy5kcmFnSGFuZGxlciA9ICQucHJveHkoXy5kcmFnSGFuZGxlciwgXyk7XHJcbiAgICAgICAgICAgIF8ua2V5SGFuZGxlciA9ICQucHJveHkoXy5rZXlIYW5kbGVyLCBfKTtcclxuXHJcbiAgICAgICAgICAgIF8uaW5zdGFuY2VVaWQgPSBpbnN0YW5jZVVpZCsrO1xyXG5cclxuICAgICAgICAgICAgLy8gQSBzaW1wbGUgd2F5IHRvIGNoZWNrIGZvciBIVE1MIHN0cmluZ3NcclxuICAgICAgICAgICAgLy8gU3RyaWN0IEhUTUwgcmVjb2duaXRpb24gKG11c3Qgc3RhcnQgd2l0aCA8KVxyXG4gICAgICAgICAgICAvLyBFeHRyYWN0ZWQgZnJvbSBqUXVlcnkgdjEuMTEgc291cmNlXHJcbiAgICAgICAgICAgIF8uaHRtbEV4cHIgPSAvXig/OlxccyooPFtcXHdcXFddKz4pW14+XSopJC87XHJcblxyXG5cclxuICAgICAgICAgICAgXy5yZWdpc3RlckJyZWFrcG9pbnRzKCk7XHJcbiAgICAgICAgICAgIF8uaW5pdCh0cnVlKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gU2xpY2s7XHJcblxyXG4gICAgfSgpKTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYWN0aXZhdGVBREEgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlVHJhY2suZmluZCgnLnNsaWNrLWFjdGl2ZScpLmF0dHIoe1xyXG4gICAgICAgICAgICAnYXJpYS1oaWRkZW4nOiAnZmFsc2UnXHJcbiAgICAgICAgfSkuZmluZCgnYSwgaW5wdXQsIGJ1dHRvbiwgc2VsZWN0JykuYXR0cih7XHJcbiAgICAgICAgICAgICd0YWJpbmRleCc6ICcwJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmFkZFNsaWRlID0gU2xpY2sucHJvdG90eXBlLnNsaWNrQWRkID0gZnVuY3Rpb24obWFya3VwLCBpbmRleCwgYWRkQmVmb3JlKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZihpbmRleCkgPT09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICBhZGRCZWZvcmUgPSBpbmRleDtcclxuICAgICAgICAgICAgaW5kZXggPSBudWxsO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCAwIHx8IChpbmRleCA+PSBfLnNsaWRlQ291bnQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8udW5sb2FkKCk7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YoaW5kZXgpID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IDAgJiYgXy4kc2xpZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgJChtYXJrdXApLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFkZEJlZm9yZSkge1xyXG4gICAgICAgICAgICAgICAgJChtYXJrdXApLmluc2VydEJlZm9yZShfLiRzbGlkZXMuZXEoaW5kZXgpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQobWFya3VwKS5pbnNlcnRBZnRlcihfLiRzbGlkZXMuZXEoaW5kZXgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChhZGRCZWZvcmUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICQobWFya3VwKS5wcmVwZW5kVG8oXy4kc2xpZGVUcmFjayk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKG1hcmt1cCkuYXBwZW5kVG8oXy4kc2xpZGVUcmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uJHNsaWRlcyA9IF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpO1xyXG5cclxuICAgICAgICBfLiRzbGlkZVRyYWNrLmFwcGVuZChfLiRzbGlkZXMpO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXMuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgICAgICAgICAkKGVsZW1lbnQpLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnLCBpbmRleCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlc0NhY2hlID0gXy4kc2xpZGVzO1xyXG5cclxuICAgICAgICBfLnJlaW5pdCgpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmFuaW1hdGVIZWlnaHQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPT09IDEgJiYgXy5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0ID09PSB0cnVlICYmIF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdmFyIHRhcmdldEhlaWdodCA9IF8uJHNsaWRlcy5lcShfLmN1cnJlbnRTbGlkZSkub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcbiAgICAgICAgICAgIF8uJGxpc3QuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRhcmdldEhlaWdodFxyXG4gICAgICAgICAgICB9LCBfLm9wdGlvbnMuc3BlZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmFuaW1hdGVTbGlkZSA9IGZ1bmN0aW9uKHRhcmdldExlZnQsIGNhbGxiYWNrKSB7XHJcblxyXG4gICAgICAgIHZhciBhbmltUHJvcHMgPSB7fSxcclxuICAgICAgICAgICAgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uYW5pbWF0ZUhlaWdodCgpO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHRhcmdldExlZnQgPSAtdGFyZ2V0TGVmdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKF8udHJhbnNmb3Jtc0VuYWJsZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHRhcmdldExlZnRcclxuICAgICAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCwgXy5vcHRpb25zLmVhc2luZywgY2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IHRhcmdldExlZnRcclxuICAgICAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCwgXy5vcHRpb25zLmVhc2luZywgY2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5jc3NUcmFuc2l0aW9ucyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMucnRsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50TGVmdCA9IC0oXy5jdXJyZW50TGVmdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkKHtcclxuICAgICAgICAgICAgICAgICAgICBhbmltU3RhcnQ6IF8uY3VycmVudExlZnRcclxuICAgICAgICAgICAgICAgIH0pLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1TdGFydDogdGFyZ2V0TGVmdFxyXG4gICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBfLm9wdGlvbnMuc3BlZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgZWFzaW5nOiBfLm9wdGlvbnMuZWFzaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA6IGZ1bmN0aW9uKG5vdykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3cgPSBNYXRoLmNlaWwobm93KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUoJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm93ICsgJ3B4LCAwcHgpJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKGFuaW1Qcm9wcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlKDBweCwnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3cgKyAncHgpJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKGFuaW1Qcm9wcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy5hcHBseVRyYW5zaXRpb24oKTtcclxuICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSBNYXRoLmNlaWwodGFyZ2V0TGVmdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmltUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlM2QoJyArIHRhcmdldExlZnQgKyAncHgsIDBweCwgMHB4KSc7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUzZCgwcHgsJyArIHRhcmdldExlZnQgKyAncHgsIDBweCknO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MoYW5pbVByb3BzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5kaXNhYmxlVHJhbnNpdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXROYXZUYXJnZXQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBhc05hdkZvciA9IF8ub3B0aW9ucy5hc05hdkZvcjtcclxuXHJcbiAgICAgICAgaWYgKCBhc05hdkZvciAmJiBhc05hdkZvciAhPT0gbnVsbCApIHtcclxuICAgICAgICAgICAgYXNOYXZGb3IgPSAkKGFzTmF2Rm9yKS5ub3QoXy4kc2xpZGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhc05hdkZvcjtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5hc05hdkZvciA9IGZ1bmN0aW9uKGluZGV4KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgYXNOYXZGb3IgPSBfLmdldE5hdlRhcmdldCgpO1xyXG5cclxuICAgICAgICBpZiAoIGFzTmF2Rm9yICE9PSBudWxsICYmIHR5cGVvZiBhc05hdkZvciA9PT0gJ29iamVjdCcgKSB7XHJcbiAgICAgICAgICAgIGFzTmF2Rm9yLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJCh0aGlzKS5zbGljaygnZ2V0U2xpY2snKTtcclxuICAgICAgICAgICAgICAgIGlmKCF0YXJnZXQudW5zbGlja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnNsaWRlSGFuZGxlcihpbmRleCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5hcHBseVRyYW5zaXRpb24gPSBmdW5jdGlvbihzbGlkZSkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSB7fTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB0cmFuc2l0aW9uW18udHJhbnNpdGlvblR5cGVdID0gXy50cmFuc2Zvcm1UeXBlICsgJyAnICsgXy5vcHRpb25zLnNwZWVkICsgJ21zICcgKyBfLm9wdGlvbnMuY3NzRWFzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0cmFuc2l0aW9uW18udHJhbnNpdGlvblR5cGVdID0gJ29wYWNpdHkgJyArIF8ub3B0aW9ucy5zcGVlZCArICdtcyAnICsgXy5vcHRpb25zLmNzc0Vhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHRyYW5zaXRpb24pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZSkuY3NzKHRyYW5zaXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5hdXRvUGxheSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uYXV0b1BsYXlDbGVhcigpO1xyXG5cclxuICAgICAgICBpZiAoIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKSB7XHJcbiAgICAgICAgICAgIF8uYXV0b1BsYXlUaW1lciA9IHNldEludGVydmFsKCBfLmF1dG9QbGF5SXRlcmF0b3IsIF8ub3B0aW9ucy5hdXRvcGxheVNwZWVkICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmF1dG9QbGF5Q2xlYXIgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5hdXRvUGxheVRpbWVyKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoXy5hdXRvUGxheVRpbWVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYXV0b1BsYXlJdGVyYXRvciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIHNsaWRlVG8gPSBfLmN1cnJlbnRTbGlkZSArIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcclxuXHJcbiAgICAgICAgaWYgKCAhXy5wYXVzZWQgJiYgIV8uaW50ZXJydXB0ZWQgJiYgIV8uZm9jdXNzZWQgKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBfLmRpcmVjdGlvbiA9PT0gMSAmJiAoIF8uY3VycmVudFNsaWRlICsgMSApID09PSAoIF8uc2xpZGVDb3VudCAtIDEgKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uZGlyZWN0aW9uID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICggXy5kaXJlY3Rpb24gPT09IDAgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlVG8gPSBfLmN1cnJlbnRTbGlkZSAtIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBfLmN1cnJlbnRTbGlkZSAtIDEgPT09IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZGlyZWN0aW9uID0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgXy5zbGlkZUhhbmRsZXIoIHNsaWRlVG8gKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmJ1aWxkQXJyb3dzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hcnJvd3MgPT09IHRydWUgKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRwcmV2QXJyb3cgPSAkKF8ub3B0aW9ucy5wcmV2QXJyb3cpLmFkZENsYXNzKCdzbGljay1hcnJvdycpO1xyXG4gICAgICAgICAgICBfLiRuZXh0QXJyb3cgPSAkKF8ub3B0aW9ucy5uZXh0QXJyb3cpLmFkZENsYXNzKCdzbGljay1hcnJvdycpO1xyXG5cclxuICAgICAgICAgICAgaWYoIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LnJlbW92ZUNsYXNzKCdzbGljay1oaWRkZW4nKS5yZW1vdmVBdHRyKCdhcmlhLWhpZGRlbiB0YWJpbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LnJlbW92ZUNsYXNzKCdzbGljay1oaWRkZW4nKS5yZW1vdmVBdHRyKCdhcmlhLWhpZGRlbiB0YWJpbmRleCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChfLmh0bWxFeHByLnRlc3QoXy5vcHRpb25zLnByZXZBcnJvdykpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucHJlcGVuZFRvKF8ub3B0aW9ucy5hcHBlbmRBcnJvd3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChfLmh0bWxFeHByLnRlc3QoXy5vcHRpb25zLm5leHRBcnJvdykpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cuYXBwZW5kVG8oXy5vcHRpb25zLmFwcGVuZEFycm93cyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cuYWRkKCBfLiRuZXh0QXJyb3cgKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWhpZGRlbicpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXJpYS1kaXNhYmxlZCc6ICd0cnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RhYmluZGV4JzogJy0xJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYnVpbGREb3RzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgaSwgZG90O1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmRvdHMgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVyLmFkZENsYXNzKCdzbGljay1kb3R0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgIGRvdCA9ICQoJzx1bCAvPicpLmFkZENsYXNzKF8ub3B0aW9ucy5kb3RzQ2xhc3MpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8PSBfLmdldERvdENvdW50KCk7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgZG90LmFwcGVuZCgkKCc8bGkgLz4nKS5hcHBlbmQoXy5vcHRpb25zLmN1c3RvbVBhZ2luZy5jYWxsKHRoaXMsIF8sIGkpKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIF8uJGRvdHMgPSBkb3QuYXBwZW5kVG8oXy5vcHRpb25zLmFwcGVuZERvdHMpO1xyXG5cclxuICAgICAgICAgICAgXy4kZG90cy5maW5kKCdsaScpLmZpcnN0KCkuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYnVpbGRPdXQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXMgPVxyXG4gICAgICAgICAgICBfLiRzbGlkZXJcclxuICAgICAgICAgICAgICAgIC5jaGlsZHJlbiggXy5vcHRpb25zLnNsaWRlICsgJzpub3QoLnNsaWNrLWNsb25lZCknKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1zbGlkZScpO1xyXG5cclxuICAgICAgICBfLnNsaWRlQ291bnQgPSBfLiRzbGlkZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXMuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgICAgICAgICAkKGVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1zbGljay1pbmRleCcsIGluZGV4KVxyXG4gICAgICAgICAgICAgICAgLmRhdGEoJ29yaWdpbmFsU3R5bGluZycsICQoZWxlbWVudCkuYXR0cignc3R5bGUnKSB8fCAnJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlci5hZGRDbGFzcygnc2xpY2stc2xpZGVyJyk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlVHJhY2sgPSAoXy5zbGlkZUNvdW50ID09PSAwKSA/XHJcbiAgICAgICAgICAgICQoJzxkaXYgY2xhc3M9XCJzbGljay10cmFja1wiLz4nKS5hcHBlbmRUbyhfLiRzbGlkZXIpIDpcclxuICAgICAgICAgICAgXy4kc2xpZGVzLndyYXBBbGwoJzxkaXYgY2xhc3M9XCJzbGljay10cmFja1wiLz4nKS5wYXJlbnQoKTtcclxuXHJcbiAgICAgICAgXy4kbGlzdCA9IF8uJHNsaWRlVHJhY2sud3JhcChcclxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJzbGljay1saXN0XCIvPicpLnBhcmVudCgpO1xyXG4gICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKCdvcGFjaXR5JywgMCk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSB8fCBfLm9wdGlvbnMuc3dpcGVUb1NsaWRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKCdpbWdbZGF0YS1sYXp5XScsIF8uJHNsaWRlcikubm90KCdbc3JjXScpLmFkZENsYXNzKCdzbGljay1sb2FkaW5nJyk7XHJcblxyXG4gICAgICAgIF8uc2V0dXBJbmZpbml0ZSgpO1xyXG5cclxuICAgICAgICBfLmJ1aWxkQXJyb3dzKCk7XHJcblxyXG4gICAgICAgIF8uYnVpbGREb3RzKCk7XHJcblxyXG4gICAgICAgIF8udXBkYXRlRG90cygpO1xyXG5cclxuXHJcbiAgICAgICAgXy5zZXRTbGlkZUNsYXNzZXModHlwZW9mIF8uY3VycmVudFNsaWRlID09PSAnbnVtYmVyJyA/IF8uY3VycmVudFNsaWRlIDogMCk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZHJhZ2dhYmxlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uJGxpc3QuYWRkQ2xhc3MoJ2RyYWdnYWJsZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5idWlsZFJvd3MgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLCBhLCBiLCBjLCBuZXdTbGlkZXMsIG51bU9mU2xpZGVzLCBvcmlnaW5hbFNsaWRlcyxzbGlkZXNQZXJTZWN0aW9uO1xyXG5cclxuICAgICAgICBuZXdTbGlkZXMgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICAgICAgb3JpZ2luYWxTbGlkZXMgPSBfLiRzbGlkZXIuY2hpbGRyZW4oKTtcclxuXHJcbiAgICAgICAgaWYoXy5vcHRpb25zLnJvd3MgPiAwKSB7XHJcblxyXG4gICAgICAgICAgICBzbGlkZXNQZXJTZWN0aW9uID0gXy5vcHRpb25zLnNsaWRlc1BlclJvdyAqIF8ub3B0aW9ucy5yb3dzO1xyXG4gICAgICAgICAgICBudW1PZlNsaWRlcyA9IE1hdGguY2VpbChcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsU2xpZGVzLmxlbmd0aCAvIHNsaWRlc1BlclNlY3Rpb25cclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGZvcihhID0gMDsgYSA8IG51bU9mU2xpZGVzOyBhKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIHNsaWRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICBmb3IoYiA9IDA7IGIgPCBfLm9wdGlvbnMucm93czsgYisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihjID0gMDsgYyA8IF8ub3B0aW9ucy5zbGlkZXNQZXJSb3c7IGMrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gKGEgKiBzbGlkZXNQZXJTZWN0aW9uICsgKChiICogXy5vcHRpb25zLnNsaWRlc1BlclJvdykgKyBjKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcmlnaW5hbFNsaWRlcy5nZXQodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKG9yaWdpbmFsU2xpZGVzLmdldCh0YXJnZXQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzbGlkZS5hcHBlbmRDaGlsZChyb3cpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbmV3U2xpZGVzLmFwcGVuZENoaWxkKHNsaWRlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVyLmVtcHR5KCkuYXBwZW5kKG5ld1NsaWRlcyk7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlci5jaGlsZHJlbigpLmNoaWxkcmVuKCkuY2hpbGRyZW4oKVxyXG4gICAgICAgICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzooMTAwIC8gXy5vcHRpb25zLnNsaWRlc1BlclJvdykgKyAnJScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiAnaW5saW5lLWJsb2NrJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5jaGVja1Jlc3BvbnNpdmUgPSBmdW5jdGlvbihpbml0aWFsLCBmb3JjZVVwZGF0ZSkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGJyZWFrcG9pbnQsIHRhcmdldEJyZWFrcG9pbnQsIHJlc3BvbmRUb1dpZHRoLCB0cmlnZ2VyQnJlYWtwb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBzbGlkZXJXaWR0aCA9IF8uJHNsaWRlci53aWR0aCgpO1xyXG4gICAgICAgIHZhciB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIHx8ICQod2luZG93KS53aWR0aCgpO1xyXG5cclxuICAgICAgICBpZiAoXy5yZXNwb25kVG8gPT09ICd3aW5kb3cnKSB7XHJcbiAgICAgICAgICAgIHJlc3BvbmRUb1dpZHRoID0gd2luZG93V2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIGlmIChfLnJlc3BvbmRUbyA9PT0gJ3NsaWRlcicpIHtcclxuICAgICAgICAgICAgcmVzcG9uZFRvV2lkdGggPSBzbGlkZXJXaWR0aDtcclxuICAgICAgICB9IGVsc2UgaWYgKF8ucmVzcG9uZFRvID09PSAnbWluJykge1xyXG4gICAgICAgICAgICByZXNwb25kVG9XaWR0aCA9IE1hdGgubWluKHdpbmRvd1dpZHRoLCBzbGlkZXJXaWR0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5yZXNwb25zaXZlICYmXHJcbiAgICAgICAgICAgIF8ub3B0aW9ucy5yZXNwb25zaXZlLmxlbmd0aCAmJlxyXG4gICAgICAgICAgICBfLm9wdGlvbnMucmVzcG9uc2l2ZSAhPT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgdGFyZ2V0QnJlYWtwb2ludCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGJyZWFrcG9pbnQgaW4gXy5icmVha3BvaW50cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKF8uYnJlYWtwb2ludHMuaGFzT3duUHJvcGVydHkoYnJlYWtwb2ludCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXy5vcmlnaW5hbFNldHRpbmdzLm1vYmlsZUZpcnN0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uZFRvV2lkdGggPCBfLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50ID0gXy5icmVha3BvaW50c1ticmVha3BvaW50XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25kVG9XaWR0aCA+IF8uYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnQgPSBfLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0QnJlYWtwb2ludCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF8uYWN0aXZlQnJlYWtwb2ludCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRCcmVha3BvaW50ICE9PSBfLmFjdGl2ZUJyZWFrcG9pbnQgfHwgZm9yY2VVcGRhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5hY3RpdmVCcmVha3BvaW50ID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLmJyZWFrcG9pbnRTZXR0aW5nc1t0YXJnZXRCcmVha3BvaW50XSA9PT0gJ3Vuc2xpY2snKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLnVuc2xpY2sodGFyZ2V0QnJlYWtwb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgXy5vcmlnaW5hbFNldHRpbmdzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludFNldHRpbmdzW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5vcHRpb25zLmluaXRpYWxTbGlkZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8ucmVmcmVzaChpbml0aWFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyQnJlYWtwb2ludCA9IHRhcmdldEJyZWFrcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmFjdGl2ZUJyZWFrcG9pbnQgPSB0YXJnZXRCcmVha3BvaW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfLmJyZWFrcG9pbnRTZXR0aW5nc1t0YXJnZXRCcmVha3BvaW50XSA9PT0gJ3Vuc2xpY2snKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8udW5zbGljayh0YXJnZXRCcmVha3BvaW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgXy5vcmlnaW5hbFNldHRpbmdzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5icmVha3BvaW50U2V0dGluZ3NbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0QnJlYWtwb2ludF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBfLm9wdGlvbnMuaW5pdGlhbFNsaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ucmVmcmVzaChpbml0aWFsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlckJyZWFrcG9pbnQgPSB0YXJnZXRCcmVha3BvaW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKF8uYWN0aXZlQnJlYWtwb2ludCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uYWN0aXZlQnJlYWtwb2ludCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zID0gXy5vcmlnaW5hbFNldHRpbmdzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5vcHRpb25zLmluaXRpYWxTbGlkZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXy5yZWZyZXNoKGluaXRpYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXJCcmVha3BvaW50ID0gdGFyZ2V0QnJlYWtwb2ludDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gb25seSB0cmlnZ2VyIGJyZWFrcG9pbnRzIGR1cmluZyBhbiBhY3R1YWwgYnJlYWsuIG5vdCBvbiBpbml0aWFsaXplLlxyXG4gICAgICAgICAgICBpZiggIWluaXRpYWwgJiYgdHJpZ2dlckJyZWFrcG9pbnQgIT09IGZhbHNlICkge1xyXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2JyZWFrcG9pbnQnLCBbXywgdHJpZ2dlckJyZWFrcG9pbnRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5jaGFuZ2VTbGlkZSA9IGZ1bmN0aW9uKGV2ZW50LCBkb250QW5pbWF0ZSkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgICR0YXJnZXQgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLFxyXG4gICAgICAgICAgICBpbmRleE9mZnNldCwgc2xpZGVPZmZzZXQsIHVuZXZlbk9mZnNldDtcclxuXHJcbiAgICAgICAgLy8gSWYgdGFyZ2V0IGlzIGEgbGluaywgcHJldmVudCBkZWZhdWx0IGFjdGlvbi5cclxuICAgICAgICBpZigkdGFyZ2V0LmlzKCdhJykpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIHRhcmdldCBpcyBub3QgdGhlIDxsaT4gZWxlbWVudCAoaWU6IGEgY2hpbGQpLCBmaW5kIHRoZSA8bGk+LlxyXG4gICAgICAgIGlmKCEkdGFyZ2V0LmlzKCdsaScpKSB7XHJcbiAgICAgICAgICAgICR0YXJnZXQgPSAkdGFyZ2V0LmNsb3Nlc3QoJ2xpJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1bmV2ZW5PZmZzZXQgPSAoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICE9PSAwKTtcclxuICAgICAgICBpbmRleE9mZnNldCA9IHVuZXZlbk9mZnNldCA/IDAgOiAoXy5zbGlkZUNvdW50IC0gXy5jdXJyZW50U2xpZGUpICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGV2ZW50LmRhdGEubWVzc2FnZSkge1xyXG5cclxuICAgICAgICAgICAgY2FzZSAncHJldmlvdXMnOlxyXG4gICAgICAgICAgICAgICAgc2xpZGVPZmZzZXQgPSBpbmRleE9mZnNldCA9PT0gMCA/IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA6IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLSBpbmRleE9mZnNldDtcclxuICAgICAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5zbGlkZUhhbmRsZXIoXy5jdXJyZW50U2xpZGUgLSBzbGlkZU9mZnNldCwgZmFsc2UsIGRvbnRBbmltYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnbmV4dCc6XHJcbiAgICAgICAgICAgICAgICBzbGlkZU9mZnNldCA9IGluZGV4T2Zmc2V0ID09PSAwID8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDogaW5kZXhPZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKF8uY3VycmVudFNsaWRlICsgc2xpZGVPZmZzZXQsIGZhbHNlLCBkb250QW5pbWF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2luZGV4JzpcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGV2ZW50LmRhdGEuaW5kZXggPT09IDAgPyAwIDpcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4IHx8ICR0YXJnZXQuaW5kZXgoKSAqIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcclxuXHJcbiAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlcihfLmNoZWNrTmF2aWdhYmxlKGluZGV4KSwgZmFsc2UsIGRvbnRBbmltYXRlKTtcclxuICAgICAgICAgICAgICAgICR0YXJnZXQuY2hpbGRyZW4oKS50cmlnZ2VyKCdmb2N1cycpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5jaGVja05hdmlnYWJsZSA9IGZ1bmN0aW9uKGluZGV4KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgbmF2aWdhYmxlcywgcHJldk5hdmlnYWJsZTtcclxuXHJcbiAgICAgICAgbmF2aWdhYmxlcyA9IF8uZ2V0TmF2aWdhYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIHByZXZOYXZpZ2FibGUgPSAwO1xyXG4gICAgICAgIGlmIChpbmRleCA+IG5hdmlnYWJsZXNbbmF2aWdhYmxlcy5sZW5ndGggLSAxXSkge1xyXG4gICAgICAgICAgICBpbmRleCA9IG5hdmlnYWJsZXNbbmF2aWdhYmxlcy5sZW5ndGggLSAxXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBuIGluIG5hdmlnYWJsZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IG5hdmlnYWJsZXNbbl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHByZXZOYXZpZ2FibGU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwcmV2TmF2aWdhYmxlID0gbmF2aWdhYmxlc1tuXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGluZGV4O1xyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuY2xlYW5VcEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyAmJiBfLiRkb3RzICE9PSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICAkKCdsaScsIF8uJGRvdHMpXHJcbiAgICAgICAgICAgICAgICAub2ZmKCdjbGljay5zbGljaycsIF8uY2hhbmdlU2xpZGUpXHJcbiAgICAgICAgICAgICAgICAub2ZmKCdtb3VzZWVudGVyLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgdHJ1ZSkpXHJcbiAgICAgICAgICAgICAgICAub2ZmKCdtb3VzZWxlYXZlLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgZmFsc2UpKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgXy4kZG90cy5vZmYoJ2tleWRvd24uc2xpY2snLCBfLmtleUhhbmRsZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLiRzbGlkZXIub2ZmKCdmb2N1cy5zbGljayBibHVyLnNsaWNrJyk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgXy4kcHJldkFycm93ICYmIF8uJHByZXZBcnJvdy5vZmYoJ2NsaWNrLnNsaWNrJywgXy5jaGFuZ2VTbGlkZSk7XHJcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdyAmJiBfLiRuZXh0QXJyb3cub2ZmKCdjbGljay5zbGljaycsIF8uY2hhbmdlU2xpZGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cgJiYgXy4kcHJldkFycm93Lm9mZigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cgJiYgXy4kbmV4dEFycm93Lm9mZigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uJGxpc3Qub2ZmKCd0b3VjaHN0YXJ0LnNsaWNrIG1vdXNlZG93bi5zbGljaycsIF8uc3dpcGVIYW5kbGVyKTtcclxuICAgICAgICBfLiRsaXN0Lm9mZigndG91Y2htb3ZlLnNsaWNrIG1vdXNlbW92ZS5zbGljaycsIF8uc3dpcGVIYW5kbGVyKTtcclxuICAgICAgICBfLiRsaXN0Lm9mZigndG91Y2hlbmQuc2xpY2sgbW91c2V1cC5zbGljaycsIF8uc3dpcGVIYW5kbGVyKTtcclxuICAgICAgICBfLiRsaXN0Lm9mZigndG91Y2hjYW5jZWwuc2xpY2sgbW91c2VsZWF2ZS5zbGljaycsIF8uc3dpcGVIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgXy4kbGlzdC5vZmYoJ2NsaWNrLnNsaWNrJywgXy5jbGlja0hhbmRsZXIpO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vZmYoXy52aXNpYmlsaXR5Q2hhbmdlLCBfLnZpc2liaWxpdHkpO1xyXG5cclxuICAgICAgICBfLmNsZWFuVXBTbGlkZUV2ZW50cygpO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy4kbGlzdC5vZmYoJ2tleWRvd24uc2xpY2snLCBfLmtleUhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mb2N1c09uU2VsZWN0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICQoXy4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vZmYoJ2NsaWNrLnNsaWNrJywgXy5zZWxlY3RIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQod2luZG93KS5vZmYoJ29yaWVudGF0aW9uY2hhbmdlLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLm9yaWVudGF0aW9uQ2hhbmdlKTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9mZigncmVzaXplLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLnJlc2l6ZSk7XHJcblxyXG4gICAgICAgICQoJ1tkcmFnZ2FibGUhPXRydWVdJywgXy4kc2xpZGVUcmFjaykub2ZmKCdkcmFnc3RhcnQnLCBfLnByZXZlbnREZWZhdWx0KTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9mZignbG9hZC5zbGljay5zbGljay0nICsgXy5pbnN0YW5jZVVpZCwgXy5zZXRQb3NpdGlvbik7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuY2xlYW5VcFNsaWRlRXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy4kbGlzdC5vZmYoJ21vdXNlZW50ZXIuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCB0cnVlKSk7XHJcbiAgICAgICAgXy4kbGlzdC5vZmYoJ21vdXNlbGVhdmUuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCBmYWxzZSkpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmNsZWFuVXBSb3dzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcywgb3JpZ2luYWxTbGlkZXM7XHJcblxyXG4gICAgICAgIGlmKF8ub3B0aW9ucy5yb3dzID4gMCkge1xyXG4gICAgICAgICAgICBvcmlnaW5hbFNsaWRlcyA9IF8uJHNsaWRlcy5jaGlsZHJlbigpLmNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsU2xpZGVzLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlci5lbXB0eSgpLmFwcGVuZChvcmlnaW5hbFNsaWRlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8uc2hvdWxkQ2xpY2sgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKHJlZnJlc2gpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLmF1dG9QbGF5Q2xlYXIoKTtcclxuXHJcbiAgICAgICAgXy50b3VjaE9iamVjdCA9IHt9O1xyXG5cclxuICAgICAgICBfLmNsZWFuVXBFdmVudHMoKTtcclxuXHJcbiAgICAgICAgJCgnLnNsaWNrLWNsb25lZCcsIF8uJHNsaWRlcikuZGV0YWNoKCk7XHJcblxyXG4gICAgICAgIGlmIChfLiRkb3RzKSB7XHJcbiAgICAgICAgICAgIF8uJGRvdHMucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIF8uJHByZXZBcnJvdyAmJiBfLiRwcmV2QXJyb3cubGVuZ3RoICkge1xyXG5cclxuICAgICAgICAgICAgXy4kcHJldkFycm93XHJcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkIHNsaWNrLWFycm93IHNsaWNrLWhpZGRlbicpXHJcbiAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignYXJpYS1oaWRkZW4gYXJpYS1kaXNhYmxlZCB0YWJpbmRleCcpXHJcbiAgICAgICAgICAgICAgICAuY3NzKCdkaXNwbGF5JywnJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIF8uaHRtbEV4cHIudGVzdCggXy5vcHRpb25zLnByZXZBcnJvdyApKSB7XHJcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggXy4kbmV4dEFycm93ICYmIF8uJG5leHRBcnJvdy5sZW5ndGggKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRuZXh0QXJyb3dcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQgc2xpY2stYXJyb3cgc2xpY2staGlkZGVuJylcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdhcmlhLWhpZGRlbiBhcmlhLWRpc2FibGVkIHRhYmluZGV4JylcclxuICAgICAgICAgICAgICAgIC5jc3MoJ2Rpc3BsYXknLCcnKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggXy5odG1sRXhwci50ZXN0KCBfLm9wdGlvbnMubmV4dEFycm93ICkpIHtcclxuICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmIChfLiRzbGlkZXMpIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlc1xyXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1zbGlkZSBzbGljay1hY3RpdmUgc2xpY2stY2VudGVyIHNsaWNrLXZpc2libGUgc2xpY2stY3VycmVudCcpXHJcbiAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignYXJpYS1oaWRkZW4nKVxyXG4gICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKVxyXG4gICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ3N0eWxlJywgJCh0aGlzKS5kYXRhKCdvcmlnaW5hbFN0eWxpbmcnKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suZGV0YWNoKCk7XHJcblxyXG4gICAgICAgICAgICBfLiRsaXN0LmRldGFjaCgpO1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVyLmFwcGVuZChfLiRzbGlkZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy5jbGVhblVwUm93cygpO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXIucmVtb3ZlQ2xhc3MoJ3NsaWNrLXNsaWRlcicpO1xyXG4gICAgICAgIF8uJHNsaWRlci5yZW1vdmVDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKTtcclxuICAgICAgICBfLiRzbGlkZXIucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRvdHRlZCcpO1xyXG5cclxuICAgICAgICBfLnVuc2xpY2tlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmKCFyZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdkZXN0cm95JywgW19dKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZGlzYWJsZVRyYW5zaXRpb24gPSBmdW5jdGlvbihzbGlkZSkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSB7fTtcclxuXHJcbiAgICAgICAgdHJhbnNpdGlvbltfLnRyYW5zaXRpb25UeXBlXSA9ICcnO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHRyYW5zaXRpb24pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZSkuY3NzKHRyYW5zaXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5mYWRlU2xpZGUgPSBmdW5jdGlvbihzbGlkZUluZGV4LCBjYWxsYmFjaykge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLmNzc1RyYW5zaXRpb25zID09PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXhcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGVJbmRleCkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCwgXy5vcHRpb25zLmVhc2luZywgY2FsbGJhY2spO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgXy5hcHBseVRyYW5zaXRpb24oc2xpZGVJbmRleCk7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGVJbmRleCkuY3NzKHtcclxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXHJcbiAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXhcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8uZGlzYWJsZVRyYW5zaXRpb24oc2xpZGVJbmRleCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoKTtcclxuICAgICAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmZhZGVTbGlkZU91dCA9IGZ1bmN0aW9uKHNsaWRlSW5kZXgpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5jc3NUcmFuc2l0aW9ucyA9PT0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZUluZGV4KS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXHJcbiAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXggLSAyXHJcbiAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCwgXy5vcHRpb25zLmVhc2luZyk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBfLmFwcGx5VHJhbnNpdGlvbihzbGlkZUluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZUluZGV4KS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcclxuICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleCAtIDJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5maWx0ZXJTbGlkZXMgPSBTbGljay5wcm90b3R5cGUuc2xpY2tGaWx0ZXIgPSBmdW5jdGlvbihmaWx0ZXIpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoZmlsdGVyICE9PSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXNDYWNoZSA9IF8uJHNsaWRlcztcclxuXHJcbiAgICAgICAgICAgIF8udW5sb2FkKCk7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCk7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXNDYWNoZS5maWx0ZXIoZmlsdGVyKS5hcHBlbmRUbyhfLiRzbGlkZVRyYWNrKTtcclxuXHJcbiAgICAgICAgICAgIF8ucmVpbml0KCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5mb2N1c0hhbmRsZXIgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXJcclxuICAgICAgICAgICAgLm9mZignZm9jdXMuc2xpY2sgYmx1ci5zbGljaycpXHJcbiAgICAgICAgICAgIC5vbignZm9jdXMuc2xpY2sgYmx1ci5zbGljaycsICcqJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICB2YXIgJHNmID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIF8ub3B0aW9ucy5wYXVzZU9uRm9jdXMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5mb2N1c3NlZCA9ICRzZi5pcygnOmZvY3VzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5hdXRvUGxheSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSwgMCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZ2V0Q3VycmVudCA9IFNsaWNrLnByb3RvdHlwZS5zbGlja0N1cnJlbnRTbGlkZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIF8uY3VycmVudFNsaWRlO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmdldERvdENvdW50ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIGJyZWFrUG9pbnQgPSAwO1xyXG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcclxuICAgICAgICB2YXIgcGFnZXJRdHkgPSAwO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICsrcGFnZXJRdHk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoYnJlYWtQb2ludCA8IF8uc2xpZGVDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICsrcGFnZXJRdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtQb2ludCA9IGNvdW50ZXIgKyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnRlciArPSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA/IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA6IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHBhZ2VyUXR5ID0gXy5zbGlkZUNvdW50O1xyXG4gICAgICAgIH0gZWxzZSBpZighXy5vcHRpb25zLmFzTmF2Rm9yKSB7XHJcbiAgICAgICAgICAgIHBhZ2VyUXR5ID0gMSArIE1hdGguY2VpbCgoXy5zbGlkZUNvdW50IC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykgLyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgd2hpbGUgKGJyZWFrUG9pbnQgPCBfLnNsaWRlQ291bnQpIHtcclxuICAgICAgICAgICAgICAgICsrcGFnZXJRdHk7XHJcbiAgICAgICAgICAgICAgICBicmVha1BvaW50ID0gY291bnRlciArIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcclxuICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgOiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGFnZXJRdHkgLSAxO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmdldExlZnQgPSBmdW5jdGlvbihzbGlkZUluZGV4KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgdGFyZ2V0TGVmdCxcclxuICAgICAgICAgICAgdmVydGljYWxIZWlnaHQsXHJcbiAgICAgICAgICAgIHZlcnRpY2FsT2Zmc2V0ID0gMCxcclxuICAgICAgICAgICAgdGFyZ2V0U2xpZGUsXHJcbiAgICAgICAgICAgIGNvZWY7XHJcblxyXG4gICAgICAgIF8uc2xpZGVPZmZzZXQgPSAwO1xyXG4gICAgICAgIHZlcnRpY2FsSGVpZ2h0ID0gXy4kc2xpZGVzLmZpcnN0KCkub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAoXy5zbGlkZVdpZHRoICogXy5vcHRpb25zLnNsaWRlc1RvU2hvdykgKiAtMTtcclxuICAgICAgICAgICAgICAgIGNvZWYgPSAtMVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IHRydWUgJiYgXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2VmID0gLTEuNTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29lZiA9IC0yXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAodmVydGljYWxIZWlnaHQgKiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAqIGNvZWY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgPiBfLnNsaWRlQ291bnQgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzbGlkZUluZGV4ID4gXy5zbGlkZUNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAoKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLSAoc2xpZGVJbmRleCAtIF8uc2xpZGVDb3VudCkpICogXy5zbGlkZVdpZHRoKSAqIC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9ICgoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAtIChzbGlkZUluZGV4IC0gXy5zbGlkZUNvdW50KSkgKiB2ZXJ0aWNhbEhlaWdodCkgKiAtMTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gKChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpICogXy5zbGlkZVdpZHRoKSAqIC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9ICgoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSAqIHZlcnRpY2FsSGVpZ2h0KSAqIC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChzbGlkZUluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA+IF8uc2xpZGVDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9ICgoc2xpZGVJbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIC0gXy5zbGlkZUNvdW50KSAqIF8uc2xpZGVXaWR0aDtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2FsT2Zmc2V0ID0gKChzbGlkZUluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdykgLSBfLnNsaWRlQ291bnQpICogdmVydGljYWxIZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAoKF8uc2xpZGVXaWR0aCAqIE1hdGguZmxvb3IoXy5vcHRpb25zLnNsaWRlc1RvU2hvdykpIC8gMikgLSAoKF8uc2xpZGVXaWR0aCAqIF8uc2xpZGVDb3VudCkgLyAyKTtcclxuICAgICAgICB9IGVsc2UgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlICYmIF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ICs9IF8uc2xpZGVXaWR0aCAqIE1hdGguZmxvb3IoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIpIC0gXy5zbGlkZVdpZHRoO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgKz0gXy5zbGlkZVdpZHRoICogTWF0aC5mbG9vcihfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB0YXJnZXRMZWZ0ID0gKChzbGlkZUluZGV4ICogXy5zbGlkZVdpZHRoKSAqIC0xKSArIF8uc2xpZGVPZmZzZXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGFyZ2V0TGVmdCA9ICgoc2xpZGVJbmRleCAqIHZlcnRpY2FsSGVpZ2h0KSAqIC0xKSArIHZlcnRpY2FsT2Zmc2V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52YXJpYWJsZVdpZHRoID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgfHwgXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U2xpZGUgPSBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS5lcShzbGlkZUluZGV4KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykuZXEoc2xpZGVJbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldFNsaWRlWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IChfLiRzbGlkZVRyYWNrLndpZHRoKCkgLSB0YXJnZXRTbGlkZVswXS5vZmZzZXRMZWZ0IC0gdGFyZ2V0U2xpZGUud2lkdGgoKSkgKiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9ICAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IHRhcmdldFNsaWRlWzBdID8gdGFyZ2V0U2xpZGVbMF0ub2Zmc2V0TGVmdCAqIC0xIDogMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgfHwgXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykuZXEoc2xpZGVJbmRleCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykuZXEoc2xpZGVJbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRTbGlkZVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gKF8uJHNsaWRlVHJhY2sud2lkdGgoKSAtIHRhcmdldFNsaWRlWzBdLm9mZnNldExlZnQgLSB0YXJnZXRTbGlkZS53aWR0aCgpKSAqIC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSAgMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSB0YXJnZXRTbGlkZVswXSA/IHRhcmdldFNsaWRlWzBdLm9mZnNldExlZnQgKiAtMSA6IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCArPSAoXy4kbGlzdC53aWR0aCgpIC0gdGFyZ2V0U2xpZGUub3V0ZXJXaWR0aCgpKSAvIDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0YXJnZXRMZWZ0O1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmdldE9wdGlvbiA9IFNsaWNrLnByb3RvdHlwZS5zbGlja0dldE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHJldHVybiBfLm9wdGlvbnNbb3B0aW9uXTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXROYXZpZ2FibGVJbmRleGVzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgYnJlYWtQb2ludCA9IDAsXHJcbiAgICAgICAgICAgIGNvdW50ZXIgPSAwLFxyXG4gICAgICAgICAgICBpbmRleGVzID0gW10sXHJcbiAgICAgICAgICAgIG1heDtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgbWF4ID0gXy5zbGlkZUNvdW50O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJyZWFrUG9pbnQgPSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgKiAtMTtcclxuICAgICAgICAgICAgY291bnRlciA9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAqIC0xO1xyXG4gICAgICAgICAgICBtYXggPSBfLnNsaWRlQ291bnQgKiAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2hpbGUgKGJyZWFrUG9pbnQgPCBtYXgpIHtcclxuICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGJyZWFrUG9pbnQpO1xyXG4gICAgICAgICAgICBicmVha1BvaW50ID0gY291bnRlciArIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcclxuICAgICAgICAgICAgY291bnRlciArPSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA/IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA6IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5kZXhlcztcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXRTbGljayA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXRTbGlkZUNvdW50ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgc2xpZGVzVHJhdmVyc2VkLCBzd2lwZWRTbGlkZSwgY2VudGVyT2Zmc2V0O1xyXG5cclxuICAgICAgICBjZW50ZXJPZmZzZXQgPSBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSA/IF8uc2xpZGVXaWR0aCAqIE1hdGguZmxvb3IoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIpIDogMDtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5zd2lwZVRvU2xpZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5maW5kKCcuc2xpY2stc2xpZGUnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBzbGlkZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNsaWRlLm9mZnNldExlZnQgLSBjZW50ZXJPZmZzZXQgKyAoJChzbGlkZSkub3V0ZXJXaWR0aCgpIC8gMikgPiAoXy5zd2lwZUxlZnQgKiAtMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzd2lwZWRTbGlkZSA9IHNsaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzbGlkZXNUcmF2ZXJzZWQgPSBNYXRoLmFicygkKHN3aXBlZFNsaWRlKS5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JykgLSBfLmN1cnJlbnRTbGlkZSkgfHwgMTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzbGlkZXNUcmF2ZXJzZWQ7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmdvVG8gPSBTbGljay5wcm90b3R5cGUuc2xpY2tHb1RvID0gZnVuY3Rpb24oc2xpZGUsIGRvbnRBbmltYXRlKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5jaGFuZ2VTbGlkZSh7XHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdpbmRleCcsXHJcbiAgICAgICAgICAgICAgICBpbmRleDogcGFyc2VJbnQoc2xpZGUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBkb250QW5pbWF0ZSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKGNyZWF0aW9uKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKCEkKF8uJHNsaWRlcikuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcclxuXHJcbiAgICAgICAgICAgICQoXy4kc2xpZGVyKS5hZGRDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKTtcclxuXHJcbiAgICAgICAgICAgIF8uYnVpbGRSb3dzKCk7XHJcbiAgICAgICAgICAgIF8uYnVpbGRPdXQoKTtcclxuICAgICAgICAgICAgXy5zZXRQcm9wcygpO1xyXG4gICAgICAgICAgICBfLnN0YXJ0TG9hZCgpO1xyXG4gICAgICAgICAgICBfLmxvYWRTbGlkZXIoKTtcclxuICAgICAgICAgICAgXy5pbml0aWFsaXplRXZlbnRzKCk7XHJcbiAgICAgICAgICAgIF8udXBkYXRlQXJyb3dzKCk7XHJcbiAgICAgICAgICAgIF8udXBkYXRlRG90cygpO1xyXG4gICAgICAgICAgICBfLmNoZWNrUmVzcG9uc2l2ZSh0cnVlKTtcclxuICAgICAgICAgICAgXy5mb2N1c0hhbmRsZXIoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY3JlYXRpb24pIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2luaXQnLCBbX10pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uaW5pdEFEQSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXV0b3BsYXkgKSB7XHJcblxyXG4gICAgICAgICAgICBfLnBhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBfLmF1dG9QbGF5KCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0QURBID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICAgICAgbnVtRG90R3JvdXBzID0gTWF0aC5jZWlsKF8uc2xpZGVDb3VudCAvIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpLFxyXG4gICAgICAgICAgICAgICAgdGFiQ29udHJvbEluZGV4ZXMgPSBfLmdldE5hdmlnYWJsZUluZGV4ZXMoKS5maWx0ZXIoZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh2YWwgPj0gMCkgJiYgKHZhbCA8IF8uc2xpZGVDb3VudCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVzLmFkZChfLiRzbGlkZVRyYWNrLmZpbmQoJy5zbGljay1jbG9uZWQnKSkuYXR0cih7XHJcbiAgICAgICAgICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJyxcclxuICAgICAgICAgICAgJ3RhYmluZGV4JzogJy0xJ1xyXG4gICAgICAgIH0pLmZpbmQoJ2EsIGlucHV0LCBidXR0b24sIHNlbGVjdCcpLmF0dHIoe1xyXG4gICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChfLiRkb3RzICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlcy5ub3QoXy4kc2xpZGVUcmFjay5maW5kKCcuc2xpY2stY2xvbmVkJykpLmVhY2goZnVuY3Rpb24oaSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNsaWRlQ29udHJvbEluZGV4ID0gdGFiQ29udHJvbEluZGV4ZXMuaW5kZXhPZihpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgICAgICdyb2xlJzogJ3RhYnBhbmVsJyxcclxuICAgICAgICAgICAgICAgICAgICAnaWQnOiAnc2xpY2stc2xpZGUnICsgXy5pbnN0YW5jZVVpZCArIGksXHJcbiAgICAgICAgICAgICAgICAgICAgJ3RhYmluZGV4JzogLTFcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzbGlkZUNvbnRyb2xJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgIHZhciBhcmlhQnV0dG9uQ29udHJvbCA9ICdzbGljay1zbGlkZS1jb250cm9sJyArIF8uaW5zdGFuY2VVaWQgKyBzbGlkZUNvbnRyb2xJbmRleFxyXG4gICAgICAgICAgICAgICAgICAgaWYgKCQoJyMnICsgYXJpYUJ1dHRvbkNvbnRyb2wpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ2FyaWEtZGVzY3JpYmVkYnknOiBhcmlhQnV0dG9uQ29udHJvbFxyXG4gICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBfLiRkb3RzLmF0dHIoJ3JvbGUnLCAndGFibGlzdCcpLmZpbmQoJ2xpJykuZWFjaChmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWFwcGVkU2xpZGVJbmRleCA9IHRhYkNvbnRyb2xJbmRleGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICQodGhpcykuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3JvbGUnOiAncHJlc2VudGF0aW9uJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdidXR0b24nKS5maXJzdCgpLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgICAgICdyb2xlJzogJ3RhYicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2lkJzogJ3NsaWNrLXNsaWRlLWNvbnRyb2wnICsgXy5pbnN0YW5jZVVpZCArIGksXHJcbiAgICAgICAgICAgICAgICAgICAgJ2FyaWEtY29udHJvbHMnOiAnc2xpY2stc2xpZGUnICsgXy5pbnN0YW5jZVVpZCArIG1hcHBlZFNsaWRlSW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2FyaWEtbGFiZWwnOiAoaSArIDEpICsgJyBvZiAnICsgbnVtRG90R3JvdXBzLFxyXG4gICAgICAgICAgICAgICAgICAgICdhcmlhLXNlbGVjdGVkJzogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0pLmVxKF8uY3VycmVudFNsaWRlKS5maW5kKCdidXR0b24nKS5hdHRyKHtcclxuICAgICAgICAgICAgICAgICdhcmlhLXNlbGVjdGVkJzogJ3RydWUnLFxyXG4gICAgICAgICAgICAgICAgJ3RhYmluZGV4JzogJzAnXHJcbiAgICAgICAgICAgIH0pLmVuZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaT1fLmN1cnJlbnRTbGlkZSwgbWF4PWkrXy5vcHRpb25zLnNsaWRlc1RvU2hvdzsgaSA8IG1heDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoXy5vcHRpb25zLmZvY3VzT25DaGFuZ2UpIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKGkpLmF0dHIoeyd0YWJpbmRleCc6ICcwJ30pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKGkpLnJlbW92ZUF0dHIoJ3RhYmluZGV4Jyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLmFjdGl2YXRlQURBKCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuaW5pdEFycm93RXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hcnJvd3MgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICBfLiRwcmV2QXJyb3dcclxuICAgICAgICAgICAgICAgLm9mZignY2xpY2suc2xpY2snKVxyXG4gICAgICAgICAgICAgICAub24oJ2NsaWNrLnNsaWNrJywge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdwcmV2aW91cydcclxuICAgICAgICAgICAgICAgfSwgXy5jaGFuZ2VTbGlkZSk7XHJcbiAgICAgICAgICAgIF8uJG5leHRBcnJvd1xyXG4gICAgICAgICAgICAgICAub2ZmKCdjbGljay5zbGljaycpXHJcbiAgICAgICAgICAgICAgIC5vbignY2xpY2suc2xpY2snLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ25leHQnXHJcbiAgICAgICAgICAgICAgIH0sIF8uY2hhbmdlU2xpZGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cub24oJ2tleWRvd24uc2xpY2snLCBfLmtleUhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgXy4kbmV4dEFycm93Lm9uKCdrZXlkb3duLnNsaWNrJywgXy5rZXlIYW5kbGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0RG90RXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5kb3RzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgJCgnbGknLCBfLiRkb3RzKS5vbignY2xpY2suc2xpY2snLCB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnaW5kZXgnXHJcbiAgICAgICAgICAgIH0sIF8uY2hhbmdlU2xpZGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBfLiRkb3RzLm9uKCdrZXlkb3duLnNsaWNrJywgXy5rZXlIYW5kbGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5kb3RzID09PSB0cnVlICYmIF8ub3B0aW9ucy5wYXVzZU9uRG90c0hvdmVyID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuXHJcbiAgICAgICAgICAgICQoJ2xpJywgXy4kZG90cylcclxuICAgICAgICAgICAgICAgIC5vbignbW91c2VlbnRlci5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIHRydWUpKVxyXG4gICAgICAgICAgICAgICAgLm9uKCdtb3VzZWxlYXZlLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgZmFsc2UpKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmluaXRTbGlkZUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmICggXy5vcHRpb25zLnBhdXNlT25Ib3ZlciApIHtcclxuXHJcbiAgICAgICAgICAgIF8uJGxpc3Qub24oJ21vdXNlZW50ZXIuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCB0cnVlKSk7XHJcbiAgICAgICAgICAgIF8uJGxpc3Qub24oJ21vdXNlbGVhdmUuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCBmYWxzZSkpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuaW5pdGlhbGl6ZUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uaW5pdEFycm93RXZlbnRzKCk7XHJcblxyXG4gICAgICAgIF8uaW5pdERvdEV2ZW50cygpO1xyXG4gICAgICAgIF8uaW5pdFNsaWRlRXZlbnRzKCk7XHJcblxyXG4gICAgICAgIF8uJGxpc3Qub24oJ3RvdWNoc3RhcnQuc2xpY2sgbW91c2Vkb3duLnNsaWNrJywge1xyXG4gICAgICAgICAgICBhY3Rpb246ICdzdGFydCdcclxuICAgICAgICB9LCBfLnN3aXBlSGFuZGxlcik7XHJcbiAgICAgICAgXy4kbGlzdC5vbigndG91Y2htb3ZlLnNsaWNrIG1vdXNlbW92ZS5zbGljaycsIHtcclxuICAgICAgICAgICAgYWN0aW9uOiAnbW92ZSdcclxuICAgICAgICB9LCBfLnN3aXBlSGFuZGxlcik7XHJcbiAgICAgICAgXy4kbGlzdC5vbigndG91Y2hlbmQuc2xpY2sgbW91c2V1cC5zbGljaycsIHtcclxuICAgICAgICAgICAgYWN0aW9uOiAnZW5kJ1xyXG4gICAgICAgIH0sIF8uc3dpcGVIYW5kbGVyKTtcclxuICAgICAgICBfLiRsaXN0Lm9uKCd0b3VjaGNhbmNlbC5zbGljayBtb3VzZWxlYXZlLnNsaWNrJywge1xyXG4gICAgICAgICAgICBhY3Rpb246ICdlbmQnXHJcbiAgICAgICAgfSwgXy5zd2lwZUhhbmRsZXIpO1xyXG5cclxuICAgICAgICBfLiRsaXN0Lm9uKCdjbGljay5zbGljaycsIF8uY2xpY2tIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oXy52aXNpYmlsaXR5Q2hhbmdlLCAkLnByb3h5KF8udmlzaWJpbGl0eSwgXykpO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy4kbGlzdC5vbigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZvY3VzT25TZWxlY3QgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgJChfLiRzbGlkZVRyYWNrKS5jaGlsZHJlbigpLm9uKCdjbGljay5zbGljaycsIF8uc2VsZWN0SGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKHdpbmRvdykub24oJ29yaWVudGF0aW9uY2hhbmdlLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCAkLnByb3h5KF8ub3JpZW50YXRpb25DaGFuZ2UsIF8pKTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsICQucHJveHkoXy5yZXNpemUsIF8pKTtcclxuXHJcbiAgICAgICAgJCgnW2RyYWdnYWJsZSE9dHJ1ZV0nLCBfLiRzbGlkZVRyYWNrKS5vbignZHJhZ3N0YXJ0JywgXy5wcmV2ZW50RGVmYXVsdCk7XHJcblxyXG4gICAgICAgICQod2luZG93KS5vbignbG9hZC5zbGljay5zbGljay0nICsgXy5pbnN0YW5jZVVpZCwgXy5zZXRQb3NpdGlvbik7XHJcbiAgICAgICAgJChfLnNldFBvc2l0aW9uKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0VUkgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmFycm93cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcblxyXG4gICAgICAgICAgICBfLiRwcmV2QXJyb3cuc2hvdygpO1xyXG4gICAgICAgICAgICBfLiRuZXh0QXJyb3cuc2hvdygpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcblxyXG4gICAgICAgICAgICBfLiRkb3RzLnNob3coKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmtleUhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcbiAgICAgICAgIC8vRG9udCBzbGlkZSBpZiB0aGUgY3Vyc29yIGlzIGluc2lkZSB0aGUgZm9ybSBmaWVsZHMgYW5kIGFycm93IGtleXMgYXJlIHByZXNzZWRcclxuICAgICAgICBpZighZXZlbnQudGFyZ2V0LnRhZ05hbWUubWF0Y2goJ1RFWFRBUkVBfElOUFVUfFNFTEVDVCcpKSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzNyAmJiBfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgXy5jaGFuZ2VTbGlkZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBfLm9wdGlvbnMucnRsID09PSB0cnVlID8gJ25leHQnIDogICdwcmV2aW91cydcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSAzOSAmJiBfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgXy5jaGFuZ2VTbGlkZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBfLm9wdGlvbnMucnRsID09PSB0cnVlID8gJ3ByZXZpb3VzJyA6ICduZXh0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmxhenlMb2FkID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgbG9hZFJhbmdlLCBjbG9uZVJhbmdlLCByYW5nZVN0YXJ0LCByYW5nZUVuZDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZEltYWdlcyhpbWFnZXNTY29wZSkge1xyXG5cclxuICAgICAgICAgICAgJCgnaW1nW2RhdGEtbGF6eV0nLCBpbWFnZXNTY29wZSkuZWFjaChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlU291cmNlID0gJCh0aGlzKS5hdHRyKCdkYXRhLWxhenknKSxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVNyY1NldCA9ICQodGhpcykuYXR0cignZGF0YS1zcmNzZXQnKSxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVNpemVzICA9ICQodGhpcykuYXR0cignZGF0YS1zaXplcycpIHx8IF8uJHNsaWRlci5hdHRyKCdkYXRhLXNpemVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VUb0xvYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZVRvTG9hZC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFuaW1hdGUoeyBvcGFjaXR5OiAwIH0sIDEwMCwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGltYWdlU3JjU2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3NyY3NldCcsIGltYWdlU3JjU2V0ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbWFnZVNpemVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignc2l6ZXMnLCBpbWFnZVNpemVzICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3NyYycsIGltYWdlU291cmNlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hbmltYXRlKHsgb3BhY2l0eTogMSB9LCAyMDAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ2RhdGEtbGF6eSBkYXRhLXNyY3NldCBkYXRhLXNpemVzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stbG9hZGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2xhenlMb2FkZWQnLCBbXywgaW1hZ2UsIGltYWdlU291cmNlXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2VUb0xvYWQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0ciggJ2RhdGEtbGF6eScgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoICdzbGljay1sb2FkaW5nJyApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyggJ3NsaWNrLWxhenlsb2FkLWVycm9yJyApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignbGF6eUxvYWRFcnJvcicsIFsgXywgaW1hZ2UsIGltYWdlU291cmNlIF0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2VUb0xvYWQuc3JjID0gaW1hZ2VTb3VyY2U7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VTdGFydCA9IF8uY3VycmVudFNsaWRlICsgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyICsgMSk7XHJcbiAgICAgICAgICAgICAgICByYW5nZUVuZCA9IHJhbmdlU3RhcnQgKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgMjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJhbmdlU3RhcnQgPSBNYXRoLm1heCgwLCBfLmN1cnJlbnRTbGlkZSAtIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMiArIDEpKTtcclxuICAgICAgICAgICAgICAgIHJhbmdlRW5kID0gMiArIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMiArIDEpICsgXy5jdXJyZW50U2xpZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByYW5nZVN0YXJ0ID0gXy5vcHRpb25zLmluZmluaXRlID8gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyArIF8uY3VycmVudFNsaWRlIDogXy5jdXJyZW50U2xpZGU7XHJcbiAgICAgICAgICAgIHJhbmdlRW5kID0gTWF0aC5jZWlsKHJhbmdlU3RhcnQgKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KTtcclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmFuZ2VTdGFydCA+IDApIHJhbmdlU3RhcnQtLTtcclxuICAgICAgICAgICAgICAgIGlmIChyYW5nZUVuZCA8PSBfLnNsaWRlQ291bnQpIHJhbmdlRW5kKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxvYWRSYW5nZSA9IF8uJHNsaWRlci5maW5kKCcuc2xpY2stc2xpZGUnKS5zbGljZShyYW5nZVN0YXJ0LCByYW5nZUVuZCk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMubGF6eUxvYWQgPT09ICdhbnRpY2lwYXRlZCcpIHtcclxuICAgICAgICAgICAgdmFyIHByZXZTbGlkZSA9IHJhbmdlU3RhcnQgLSAxLFxyXG4gICAgICAgICAgICAgICAgbmV4dFNsaWRlID0gcmFuZ2VFbmQsXHJcbiAgICAgICAgICAgICAgICAkc2xpZGVzID0gXy4kc2xpZGVyLmZpbmQoJy5zbGljay1zbGlkZScpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZXZTbGlkZSA8IDApIHByZXZTbGlkZSA9IF8uc2xpZGVDb3VudCAtIDE7XHJcbiAgICAgICAgICAgICAgICBsb2FkUmFuZ2UgPSBsb2FkUmFuZ2UuYWRkKCRzbGlkZXMuZXEocHJldlNsaWRlKSk7XHJcbiAgICAgICAgICAgICAgICBsb2FkUmFuZ2UgPSBsb2FkUmFuZ2UuYWRkKCRzbGlkZXMuZXEobmV4dFNsaWRlKSk7XHJcbiAgICAgICAgICAgICAgICBwcmV2U2xpZGUtLTtcclxuICAgICAgICAgICAgICAgIG5leHRTbGlkZSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsb2FkSW1hZ2VzKGxvYWRSYW5nZSk7XHJcblxyXG4gICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICBjbG9uZVJhbmdlID0gXy4kc2xpZGVyLmZpbmQoJy5zbGljay1zbGlkZScpO1xyXG4gICAgICAgICAgICBsb2FkSW1hZ2VzKGNsb25lUmFuZ2UpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgIGlmIChfLmN1cnJlbnRTbGlkZSA+PSBfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgIGNsb25lUmFuZ2UgPSBfLiRzbGlkZXIuZmluZCgnLnNsaWNrLWNsb25lZCcpLnNsaWNlKDAsIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xyXG4gICAgICAgICAgICBsb2FkSW1hZ2VzKGNsb25lUmFuZ2UpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXy5jdXJyZW50U2xpZGUgPT09IDApIHtcclxuICAgICAgICAgICAgY2xvbmVSYW5nZSA9IF8uJHNsaWRlci5maW5kKCcuc2xpY2stY2xvbmVkJykuc2xpY2UoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAqIC0xKTtcclxuICAgICAgICAgICAgbG9hZEltYWdlcyhjbG9uZVJhbmdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUubG9hZFNsaWRlciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uc2V0UG9zaXRpb24oKTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVUcmFjay5jc3Moe1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlci5yZW1vdmVDbGFzcygnc2xpY2stbG9hZGluZycpO1xyXG5cclxuICAgICAgICBfLmluaXRVSSgpO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmxhenlMb2FkID09PSAncHJvZ3Jlc3NpdmUnKSB7XHJcbiAgICAgICAgICAgIF8ucHJvZ3Jlc3NpdmVMYXp5TG9hZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5uZXh0ID0gU2xpY2sucHJvdG90eXBlLnNsaWNrTmV4dCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uY2hhbmdlU2xpZGUoe1xyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnbmV4dCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLm9yaWVudGF0aW9uQ2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5jaGVja1Jlc3BvbnNpdmUoKTtcclxuICAgICAgICBfLnNldFBvc2l0aW9uKCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUucGF1c2UgPSBTbGljay5wcm90b3R5cGUuc2xpY2tQYXVzZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uYXV0b1BsYXlDbGVhcigpO1xyXG4gICAgICAgIF8ucGF1c2VkID0gdHJ1ZTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5wbGF5ID0gU2xpY2sucHJvdG90eXBlLnNsaWNrUGxheSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uYXV0b1BsYXkoKTtcclxuICAgICAgICBfLm9wdGlvbnMuYXV0b3BsYXkgPSB0cnVlO1xyXG4gICAgICAgIF8ucGF1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgXy5mb2N1c3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIF8uaW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5wb3N0U2xpZGUgPSBmdW5jdGlvbihpbmRleCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmKCAhXy51bnNsaWNrZWQgKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignYWZ0ZXJDaGFuZ2UnLCBbXywgaW5kZXhdKTtcclxuXHJcbiAgICAgICAgICAgIF8uYW5pbWF0aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICAgICAgXy5zZXRQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBfLnN3aXBlTGVmdCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoIF8ub3B0aW9ucy5hdXRvcGxheSApIHtcclxuICAgICAgICAgICAgICAgIF8uYXV0b1BsYXkoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBfLmluaXRBREEoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLmZvY3VzT25DaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJGN1cnJlbnRTbGlkZSA9ICQoXy4kc2xpZGVzLmdldChfLmN1cnJlbnRTbGlkZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICRjdXJyZW50U2xpZGUuYXR0cigndGFiaW5kZXgnLCAwKS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5wcmV2ID0gU2xpY2sucHJvdG90eXBlLnNsaWNrUHJldiA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uY2hhbmdlU2xpZGUoe1xyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAncHJldmlvdXMnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUucHJvZ3Jlc3NpdmVMYXp5TG9hZCA9IGZ1bmN0aW9uKCB0cnlDb3VudCApIHtcclxuXHJcbiAgICAgICAgdHJ5Q291bnQgPSB0cnlDb3VudCB8fCAxO1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgICRpbWdzVG9Mb2FkID0gJCggJ2ltZ1tkYXRhLWxhenldJywgXy4kc2xpZGVyICksXHJcbiAgICAgICAgICAgIGltYWdlLFxyXG4gICAgICAgICAgICBpbWFnZVNvdXJjZSxcclxuICAgICAgICAgICAgaW1hZ2VTcmNTZXQsXHJcbiAgICAgICAgICAgIGltYWdlU2l6ZXMsXHJcbiAgICAgICAgICAgIGltYWdlVG9Mb2FkO1xyXG5cclxuICAgICAgICBpZiAoICRpbWdzVG9Mb2FkLmxlbmd0aCApIHtcclxuXHJcbiAgICAgICAgICAgIGltYWdlID0gJGltZ3NUb0xvYWQuZmlyc3QoKTtcclxuICAgICAgICAgICAgaW1hZ2VTb3VyY2UgPSBpbWFnZS5hdHRyKCdkYXRhLWxhenknKTtcclxuICAgICAgICAgICAgaW1hZ2VTcmNTZXQgPSBpbWFnZS5hdHRyKCdkYXRhLXNyY3NldCcpO1xyXG4gICAgICAgICAgICBpbWFnZVNpemVzICA9IGltYWdlLmF0dHIoJ2RhdGEtc2l6ZXMnKSB8fCBfLiRzbGlkZXIuYXR0cignZGF0YS1zaXplcycpO1xyXG4gICAgICAgICAgICBpbWFnZVRvTG9hZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG5cclxuICAgICAgICAgICAgaW1hZ2VUb0xvYWQub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGltYWdlU3JjU2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3NyY3NldCcsIGltYWdlU3JjU2V0ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbWFnZVNpemVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignc2l6ZXMnLCBpbWFnZVNpemVzICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoICdzcmMnLCBpbWFnZVNvdXJjZSApXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ2RhdGEtbGF6eSBkYXRhLXNyY3NldCBkYXRhLXNpemVzJylcclxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLWxvYWRpbmcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIF8ub3B0aW9ucy5hZGFwdGl2ZUhlaWdodCA9PT0gdHJ1ZSApIHtcclxuICAgICAgICAgICAgICAgICAgICBfLnNldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2xhenlMb2FkZWQnLCBbIF8sIGltYWdlLCBpbWFnZVNvdXJjZSBdKTtcclxuICAgICAgICAgICAgICAgIF8ucHJvZ3Jlc3NpdmVMYXp5TG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltYWdlVG9Mb2FkLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHRyeUNvdW50IDwgMyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogdHJ5IHRvIGxvYWQgdGhlIGltYWdlIDMgdGltZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICogbGVhdmUgYSBzbGlnaHQgZGVsYXkgc28gd2UgZG9uJ3QgZ2V0XHJcbiAgICAgICAgICAgICAgICAgICAgICogc2VydmVycyBibG9ja2luZyB0aGUgcmVxdWVzdC5cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5wcm9ncmVzc2l2ZUxhenlMb2FkKCB0cnlDb3VudCArIDEgKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCA1MDAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0ciggJ2RhdGEtbGF6eScgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoICdzbGljay1sb2FkaW5nJyApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyggJ3NsaWNrLWxhenlsb2FkLWVycm9yJyApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignbGF6eUxvYWRFcnJvcicsIFsgXywgaW1hZ2UsIGltYWdlU291cmNlIF0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBfLnByb2dyZXNzaXZlTGF6eUxvYWQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaW1hZ2VUb0xvYWQuc3JjID0gaW1hZ2VTb3VyY2U7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignYWxsSW1hZ2VzTG9hZGVkJywgWyBfIF0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uKCBpbml0aWFsaXppbmcgKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcywgY3VycmVudFNsaWRlLCBsYXN0VmlzaWJsZUluZGV4O1xyXG5cclxuICAgICAgICBsYXN0VmlzaWJsZUluZGV4ID0gXy5zbGlkZUNvdW50IC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcclxuXHJcbiAgICAgICAgLy8gaW4gbm9uLWluZmluaXRlIHNsaWRlcnMsIHdlIGRvbid0IHdhbnQgdG8gZ28gcGFzdCB0aGVcclxuICAgICAgICAvLyBsYXN0IHZpc2libGUgaW5kZXguXHJcbiAgICAgICAgaWYoICFfLm9wdGlvbnMuaW5maW5pdGUgJiYgKCBfLmN1cnJlbnRTbGlkZSA+IGxhc3RWaXNpYmxlSW5kZXggKSkge1xyXG4gICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IGxhc3RWaXNpYmxlSW5kZXg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBpZiBsZXNzIHNsaWRlcyB0aGFuIHRvIHNob3csIGdvIHRvIHN0YXJ0LlxyXG4gICAgICAgIGlmICggXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKSB7XHJcbiAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gMDtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjdXJyZW50U2xpZGUgPSBfLmN1cnJlbnRTbGlkZTtcclxuXHJcbiAgICAgICAgXy5kZXN0cm95KHRydWUpO1xyXG5cclxuICAgICAgICAkLmV4dGVuZChfLCBfLmluaXRpYWxzLCB7IGN1cnJlbnRTbGlkZTogY3VycmVudFNsaWRlIH0pO1xyXG5cclxuICAgICAgICBfLmluaXQoKTtcclxuXHJcbiAgICAgICAgaWYoICFpbml0aWFsaXppbmcgKSB7XHJcblxyXG4gICAgICAgICAgICBfLmNoYW5nZVNsaWRlKHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnaW5kZXgnLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBjdXJyZW50U2xpZGVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUucmVnaXN0ZXJCcmVha3BvaW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsIGJyZWFrcG9pbnQsIGN1cnJlbnRCcmVha3BvaW50LCBsLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlU2V0dGluZ3MgPSBfLm9wdGlvbnMucmVzcG9uc2l2ZSB8fCBudWxsO1xyXG5cclxuICAgICAgICBpZiAoICQudHlwZShyZXNwb25zaXZlU2V0dGluZ3MpID09PSAnYXJyYXknICYmIHJlc3BvbnNpdmVTZXR0aW5ncy5sZW5ndGggKSB7XHJcblxyXG4gICAgICAgICAgICBfLnJlc3BvbmRUbyA9IF8ub3B0aW9ucy5yZXNwb25kVG8gfHwgJ3dpbmRvdyc7XHJcblxyXG4gICAgICAgICAgICBmb3IgKCBicmVha3BvaW50IGluIHJlc3BvbnNpdmVTZXR0aW5ncyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsID0gXy5icmVha3BvaW50cy5sZW5ndGgtMTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2l2ZVNldHRpbmdzLmhhc093blByb3BlcnR5KGJyZWFrcG9pbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEJyZWFrcG9pbnQgPSByZXNwb25zaXZlU2V0dGluZ3NbYnJlYWtwb2ludF0uYnJlYWtwb2ludDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBicmVha3BvaW50cyBhbmQgY3V0IG91dCBhbnkgZXhpc3RpbmdcclxuICAgICAgICAgICAgICAgICAgICAvLyBvbmVzIHdpdGggdGhlIHNhbWUgYnJlYWtwb2ludCBudW1iZXIsIHdlIGRvbid0IHdhbnQgZHVwZXMuXHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUoIGwgPj0gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIF8uYnJlYWtwb2ludHNbbF0gJiYgXy5icmVha3BvaW50c1tsXSA9PT0gY3VycmVudEJyZWFrcG9pbnQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmJyZWFrcG9pbnRzLnNwbGljZShsLDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGwtLTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludHMucHVzaChjdXJyZW50QnJlYWtwb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5icmVha3BvaW50U2V0dGluZ3NbY3VycmVudEJyZWFrcG9pbnRdID0gcmVzcG9uc2l2ZVNldHRpbmdzW2JyZWFrcG9pbnRdLnNldHRpbmdzO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIF8uYnJlYWtwb2ludHMuc29ydChmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBfLm9wdGlvbnMubW9iaWxlRmlyc3QgKSA/IGEtYiA6IGItYTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5yZWluaXQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXMgPVxyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrXHJcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oXy5vcHRpb25zLnNsaWRlKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1zbGlkZScpO1xyXG5cclxuICAgICAgICBfLnNsaWRlQ291bnQgPSBfLiRzbGlkZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICBpZiAoXy5jdXJyZW50U2xpZGUgPj0gXy5zbGlkZUNvdW50ICYmIF8uY3VycmVudFNsaWRlICE9PSAwKSB7XHJcbiAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5jdXJyZW50U2xpZGUgLSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy5yZWdpc3RlckJyZWFrcG9pbnRzKCk7XHJcblxyXG4gICAgICAgIF8uc2V0UHJvcHMoKTtcclxuICAgICAgICBfLnNldHVwSW5maW5pdGUoKTtcclxuICAgICAgICBfLmJ1aWxkQXJyb3dzKCk7XHJcbiAgICAgICAgXy51cGRhdGVBcnJvd3MoKTtcclxuICAgICAgICBfLmluaXRBcnJvd0V2ZW50cygpO1xyXG4gICAgICAgIF8uYnVpbGREb3RzKCk7XHJcbiAgICAgICAgXy51cGRhdGVEb3RzKCk7XHJcbiAgICAgICAgXy5pbml0RG90RXZlbnRzKCk7XHJcbiAgICAgICAgXy5jbGVhblVwU2xpZGVFdmVudHMoKTtcclxuICAgICAgICBfLmluaXRTbGlkZUV2ZW50cygpO1xyXG5cclxuICAgICAgICBfLmNoZWNrUmVzcG9uc2l2ZShmYWxzZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZm9jdXNPblNlbGVjdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAkKF8uJHNsaWRlVHJhY2spLmNoaWxkcmVuKCkub24oJ2NsaWNrLnNsaWNrJywgXy5zZWxlY3RIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uc2V0U2xpZGVDbGFzc2VzKHR5cGVvZiBfLmN1cnJlbnRTbGlkZSA9PT0gJ251bWJlcicgPyBfLmN1cnJlbnRTbGlkZSA6IDApO1xyXG5cclxuICAgICAgICBfLnNldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgXy5mb2N1c0hhbmRsZXIoKTtcclxuXHJcbiAgICAgICAgXy5wYXVzZWQgPSAhXy5vcHRpb25zLmF1dG9wbGF5O1xyXG4gICAgICAgIF8uYXV0b1BsYXkoKTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ3JlSW5pdCcsIFtfXSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpICE9PSBfLndpbmRvd1dpZHRoKSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChfLndpbmRvd0RlbGF5KTtcclxuICAgICAgICAgICAgXy53aW5kb3dEZWxheSA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgXy53aW5kb3dXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgXy5jaGVja1Jlc3BvbnNpdmUoKTtcclxuICAgICAgICAgICAgICAgIGlmKCAhXy51bnNsaWNrZWQgKSB7IF8uc2V0UG9zaXRpb24oKTsgfVxyXG4gICAgICAgICAgICB9LCA1MCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUucmVtb3ZlU2xpZGUgPSBTbGljay5wcm90b3R5cGUuc2xpY2tSZW1vdmUgPSBmdW5jdGlvbihpbmRleCwgcmVtb3ZlQmVmb3JlLCByZW1vdmVBbGwpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mKGluZGV4KSA9PT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZUJlZm9yZSA9IGluZGV4O1xyXG4gICAgICAgICAgICBpbmRleCA9IHJlbW92ZUJlZm9yZSA9PT0gdHJ1ZSA/IDAgOiBfLnNsaWRlQ291bnQgLSAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGluZGV4ID0gcmVtb3ZlQmVmb3JlID09PSB0cnVlID8gLS1pbmRleCA6IGluZGV4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8IDEgfHwgaW5kZXggPCAwIHx8IGluZGV4ID4gXy5zbGlkZUNvdW50IC0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLnVubG9hZCgpO1xyXG5cclxuICAgICAgICBpZiAocmVtb3ZlQWxsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZXEoaW5kZXgpLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy4kc2xpZGVzID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpO1xyXG5cclxuICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlVHJhY2suYXBwZW5kKF8uJHNsaWRlcyk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlc0NhY2hlID0gXy4kc2xpZGVzO1xyXG5cclxuICAgICAgICBfLnJlaW5pdCgpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNldENTUyA9IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgcG9zaXRpb25Qcm9wcyA9IHt9LFxyXG4gICAgICAgICAgICB4LCB5O1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IC1wb3NpdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgeCA9IF8ucG9zaXRpb25Qcm9wID09ICdsZWZ0JyA/IE1hdGguY2VpbChwb3NpdGlvbikgKyAncHgnIDogJzBweCc7XHJcbiAgICAgICAgeSA9IF8ucG9zaXRpb25Qcm9wID09ICd0b3AnID8gTWF0aC5jZWlsKHBvc2l0aW9uKSArICdweCcgOiAnMHB4JztcclxuXHJcbiAgICAgICAgcG9zaXRpb25Qcm9wc1tfLnBvc2l0aW9uUHJvcF0gPSBwb3NpdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKF8udHJhbnNmb3Jtc0VuYWJsZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHBvc2l0aW9uUHJvcHMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uUHJvcHMgPSB7fTtcclxuICAgICAgICAgICAgaWYgKF8uY3NzVHJhbnNpdGlvbnMgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvblByb3BzW18uYW5pbVR5cGVdID0gJ3RyYW5zbGF0ZSgnICsgeCArICcsICcgKyB5ICsgJyknO1xyXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MocG9zaXRpb25Qcm9wcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvblByb3BzW18uYW5pbVR5cGVdID0gJ3RyYW5zbGF0ZTNkKCcgKyB4ICsgJywgJyArIHkgKyAnLCAwcHgpJztcclxuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHBvc2l0aW9uUHJvcHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNldERpbWVuc2lvbnMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIF8uJGxpc3QuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAoJzBweCAnICsgXy5vcHRpb25zLmNlbnRlclBhZGRpbmcpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF8uJGxpc3QuaGVpZ2h0KF8uJHNsaWRlcy5maXJzdCgpLm91dGVySGVpZ2h0KHRydWUpICogXy5vcHRpb25zLnNsaWRlc1RvU2hvdyk7XHJcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgXy4kbGlzdC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IChfLm9wdGlvbnMuY2VudGVyUGFkZGluZyArICcgMHB4JylcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLmxpc3RXaWR0aCA9IF8uJGxpc3Qud2lkdGgoKTtcclxuICAgICAgICBfLmxpc3RIZWlnaHQgPSBfLiRsaXN0LmhlaWdodCgpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UgJiYgXy5vcHRpb25zLnZhcmlhYmxlV2lkdGggPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIF8uc2xpZGVXaWR0aCA9IE1hdGguY2VpbChfLmxpc3RXaWR0aCAvIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLndpZHRoKE1hdGguY2VpbCgoXy5zbGlkZVdpZHRoICogXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykubGVuZ3RoKSkpO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKF8ub3B0aW9ucy52YXJpYWJsZVdpZHRoID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2sud2lkdGgoNTAwMCAqIF8uc2xpZGVDb3VudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy5zbGlkZVdpZHRoID0gTWF0aC5jZWlsKF8ubGlzdFdpZHRoKTtcclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5oZWlnaHQoTWF0aC5jZWlsKChfLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCh0cnVlKSAqIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLmxlbmd0aCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBvZmZzZXQgPSBfLiRzbGlkZXMuZmlyc3QoKS5vdXRlcldpZHRoKHRydWUpIC0gXy4kc2xpZGVzLmZpcnN0KCkud2lkdGgoKTtcclxuICAgICAgICBpZiAoXy5vcHRpb25zLnZhcmlhYmxlV2lkdGggPT09IGZhbHNlKSBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS53aWR0aChfLnNsaWRlV2lkdGggLSBvZmZzZXQpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNldEZhZGUgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICB0YXJnZXRMZWZ0O1xyXG5cclxuICAgICAgICBfLiRzbGlkZXMuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgICAgICAgICB0YXJnZXRMZWZ0ID0gKF8uc2xpZGVXaWR0aCAqIGluZGV4KSAqIC0xO1xyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiB0YXJnZXRMZWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXggLSAyLFxyXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHRhcmdldExlZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleCAtIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVzLmVxKF8uY3VycmVudFNsaWRlKS5jc3Moe1xyXG4gICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXggLSAxLFxyXG4gICAgICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc2V0SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPT09IDEgJiYgXy5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0ID09PSB0cnVlICYmIF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdmFyIHRhcmdldEhlaWdodCA9IF8uJHNsaWRlcy5lcShfLmN1cnJlbnRTbGlkZSkub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcbiAgICAgICAgICAgIF8uJGxpc3QuY3NzKCdoZWlnaHQnLCB0YXJnZXRIZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXRPcHRpb24gPVxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNsaWNrU2V0T3B0aW9uID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGFjY2VwdHMgYXJndW1lbnRzIGluIGZvcm1hdCBvZjpcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqICAtIGZvciBjaGFuZ2luZyBhIHNpbmdsZSBvcHRpb24ncyB2YWx1ZTpcclxuICAgICAgICAgKiAgICAgLnNsaWNrKFwic2V0T3B0aW9uXCIsIG9wdGlvbiwgdmFsdWUsIHJlZnJlc2ggKVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogIC0gZm9yIGNoYW5naW5nIGEgc2V0IG9mIHJlc3BvbnNpdmUgb3B0aW9uczpcclxuICAgICAgICAgKiAgICAgLnNsaWNrKFwic2V0T3B0aW9uXCIsICdyZXNwb25zaXZlJywgW3t9LCAuLi5dLCByZWZyZXNoIClcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqICAtIGZvciB1cGRhdGluZyBtdWx0aXBsZSB2YWx1ZXMgYXQgb25jZSAobm90IHJlc3BvbnNpdmUpXHJcbiAgICAgICAgICogICAgIC5zbGljayhcInNldE9wdGlvblwiLCB7ICdvcHRpb24nOiB2YWx1ZSwgLi4uIH0sIHJlZnJlc2ggKVxyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsIGwsIGl0ZW0sIG9wdGlvbiwgdmFsdWUsIHJlZnJlc2ggPSBmYWxzZSwgdHlwZTtcclxuXHJcbiAgICAgICAgaWYoICQudHlwZSggYXJndW1lbnRzWzBdICkgPT09ICdvYmplY3QnICkge1xyXG5cclxuICAgICAgICAgICAgb3B0aW9uID0gIGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgcmVmcmVzaCA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdHlwZSA9ICdtdWx0aXBsZSc7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoICQudHlwZSggYXJndW1lbnRzWzBdICkgPT09ICdzdHJpbmcnICkge1xyXG5cclxuICAgICAgICAgICAgb3B0aW9uID0gIGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdmFsdWUgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHJlZnJlc2ggPSBhcmd1bWVudHNbMl07XHJcblxyXG4gICAgICAgICAgICBpZiAoIGFyZ3VtZW50c1swXSA9PT0gJ3Jlc3BvbnNpdmUnICYmICQudHlwZSggYXJndW1lbnRzWzFdICkgPT09ICdhcnJheScgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdyZXNwb25zaXZlJztcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGVvZiBhcmd1bWVudHNbMV0gIT09ICd1bmRlZmluZWQnICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHR5cGUgPSAnc2luZ2xlJztcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIHR5cGUgPT09ICdzaW5nbGUnICkge1xyXG5cclxuICAgICAgICAgICAgXy5vcHRpb25zW29wdGlvbl0gPSB2YWx1ZTtcclxuXHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdtdWx0aXBsZScgKSB7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goIG9wdGlvbiAsIGZ1bmN0aW9uKCBvcHQsIHZhbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLm9wdGlvbnNbb3B0XSA9IHZhbDtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ3Jlc3BvbnNpdmUnICkge1xyXG5cclxuICAgICAgICAgICAgZm9yICggaXRlbSBpbiB2YWx1ZSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiggJC50eXBlKCBfLm9wdGlvbnMucmVzcG9uc2l2ZSApICE9PSAnYXJyYXknICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMucmVzcG9uc2l2ZSA9IFsgdmFsdWVbaXRlbV0gXTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsID0gXy5vcHRpb25zLnJlc3BvbnNpdmUubGVuZ3RoLTE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgcmVzcG9uc2l2ZSBvYmplY3QgYW5kIHNwbGljZSBvdXQgZHVwbGljYXRlcy5cclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSggbCA+PSAwICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIF8ub3B0aW9ucy5yZXNwb25zaXZlW2xdLmJyZWFrcG9pbnQgPT09IHZhbHVlW2l0ZW1dLmJyZWFrcG9pbnQgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnJlc3BvbnNpdmUuc3BsaWNlKGwsMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsLS07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnJlc3BvbnNpdmUucHVzaCggdmFsdWVbaXRlbV0gKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCByZWZyZXNoICkge1xyXG5cclxuICAgICAgICAgICAgXy51bmxvYWQoKTtcclxuICAgICAgICAgICAgXy5yZWluaXQoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5zZXREaW1lbnNpb25zKCk7XHJcblxyXG4gICAgICAgIF8uc2V0SGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgXy5zZXRDU1MoXy5nZXRMZWZ0KF8uY3VycmVudFNsaWRlKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy5zZXRGYWRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignc2V0UG9zaXRpb24nLCBbX10pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNldFByb3BzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgYm9keVN0eWxlID0gZG9jdW1lbnQuYm9keS5zdHlsZTtcclxuXHJcbiAgICAgICAgXy5wb3NpdGlvblByb3AgPSBfLm9wdGlvbnMudmVydGljYWwgPT09IHRydWUgPyAndG9wJyA6ICdsZWZ0JztcclxuXHJcbiAgICAgICAgaWYgKF8ucG9zaXRpb25Qcm9wID09PSAndG9wJykge1xyXG4gICAgICAgICAgICBfLiRzbGlkZXIuYWRkQ2xhc3MoJ3NsaWNrLXZlcnRpY2FsJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVyLnJlbW92ZUNsYXNzKCdzbGljay12ZXJ0aWNhbCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGJvZHlTdHlsZS5XZWJraXRUcmFuc2l0aW9uICE9PSB1bmRlZmluZWQgfHxcclxuICAgICAgICAgICAgYm9keVN0eWxlLk1velRyYW5zaXRpb24gIT09IHVuZGVmaW5lZCB8fFxyXG4gICAgICAgICAgICBib2R5U3R5bGUubXNUcmFuc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy51c2VDU1MgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIF8uY3NzVHJhbnNpdGlvbnMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5mYWRlICkge1xyXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBfLm9wdGlvbnMuekluZGV4ID09PSAnbnVtYmVyJyApIHtcclxuICAgICAgICAgICAgICAgIGlmKCBfLm9wdGlvbnMuekluZGV4IDwgMyApIHtcclxuICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMuekluZGV4ID0gMztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF8ub3B0aW9ucy56SW5kZXggPSBfLmRlZmF1bHRzLnpJbmRleDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGJvZHlTdHlsZS5PVHJhbnNmb3JtICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgXy5hbmltVHlwZSA9ICdPVHJhbnNmb3JtJztcclxuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJy1vLXRyYW5zZm9ybSc7XHJcbiAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSAnT1RyYW5zaXRpb24nO1xyXG4gICAgICAgICAgICBpZiAoYm9keVN0eWxlLnBlcnNwZWN0aXZlUHJvcGVydHkgPT09IHVuZGVmaW5lZCAmJiBib2R5U3R5bGUud2Via2l0UGVyc3BlY3RpdmUgPT09IHVuZGVmaW5lZCkgXy5hbmltVHlwZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYm9keVN0eWxlLk1velRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSAnTW96VHJhbnNmb3JtJztcclxuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJy1tb3otdHJhbnNmb3JtJztcclxuICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9ICdNb3pUcmFuc2l0aW9uJztcclxuICAgICAgICAgICAgaWYgKGJvZHlTdHlsZS5wZXJzcGVjdGl2ZVByb3BlcnR5ID09PSB1bmRlZmluZWQgJiYgYm9keVN0eWxlLk1velBlcnNwZWN0aXZlID09PSB1bmRlZmluZWQpIF8uYW5pbVR5cGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGJvZHlTdHlsZS53ZWJraXRUcmFuc2Zvcm0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBfLmFuaW1UeXBlID0gJ3dlYmtpdFRyYW5zZm9ybSc7XHJcbiAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICctd2Via2l0LXRyYW5zZm9ybSc7XHJcbiAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSAnd2Via2l0VHJhbnNpdGlvbic7XHJcbiAgICAgICAgICAgIGlmIChib2R5U3R5bGUucGVyc3BlY3RpdmVQcm9wZXJ0eSA9PT0gdW5kZWZpbmVkICYmIGJvZHlTdHlsZS53ZWJraXRQZXJzcGVjdGl2ZSA9PT0gdW5kZWZpbmVkKSBfLmFuaW1UeXBlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChib2R5U3R5bGUubXNUcmFuc2Zvcm0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBfLmFuaW1UeXBlID0gJ21zVHJhbnNmb3JtJztcclxuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJy1tcy10cmFuc2Zvcm0nO1xyXG4gICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gJ21zVHJhbnNpdGlvbic7XHJcbiAgICAgICAgICAgIGlmIChib2R5U3R5bGUubXNUcmFuc2Zvcm0gPT09IHVuZGVmaW5lZCkgXy5hbmltVHlwZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYm9keVN0eWxlLnRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkICYmIF8uYW5pbVR5cGUgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSAndHJhbnNmb3JtJztcclxuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJ3RyYW5zZm9ybSc7XHJcbiAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSAndHJhbnNpdGlvbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF8udHJhbnNmb3Jtc0VuYWJsZWQgPSBfLm9wdGlvbnMudXNlVHJhbnNmb3JtICYmIChfLmFuaW1UeXBlICE9PSBudWxsICYmIF8uYW5pbVR5cGUgIT09IGZhbHNlKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXRTbGlkZUNsYXNzZXMgPSBmdW5jdGlvbihpbmRleCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGNlbnRlck9mZnNldCwgYWxsU2xpZGVzLCBpbmRleE9mZnNldCwgcmVtYWluZGVyO1xyXG5cclxuICAgICAgICBhbGxTbGlkZXMgPSBfLiRzbGlkZXJcclxuICAgICAgICAgICAgLmZpbmQoJy5zbGljay1zbGlkZScpXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stYWN0aXZlIHNsaWNrLWNlbnRlciBzbGljay1jdXJyZW50JylcclxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVzXHJcbiAgICAgICAgICAgIC5lcShpbmRleClcclxuICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1jdXJyZW50Jyk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGV2ZW5Db2VmID0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAlIDIgPT09IDAgPyAxIDogMDtcclxuXHJcbiAgICAgICAgICAgIGNlbnRlck9mZnNldCA9IE1hdGguZmxvb3IoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSBjZW50ZXJPZmZzZXQgJiYgaW5kZXggPD0gKF8uc2xpZGVDb3VudCAtIDEpIC0gY2VudGVyT2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZShpbmRleCAtIGNlbnRlck9mZnNldCArIGV2ZW5Db2VmLCBpbmRleCArIGNlbnRlck9mZnNldCArIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhPZmZzZXQgPSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxsU2xpZGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZShpbmRleE9mZnNldCAtIGNlbnRlck9mZnNldCArIDEgKyBldmVuQ29lZiwgaW5kZXhPZmZzZXQgKyBjZW50ZXJPZmZzZXQgKyAyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYWxsU2xpZGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lcShhbGxTbGlkZXMubGVuZ3RoIC0gMSAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stY2VudGVyJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gXy5zbGlkZUNvdW50IC0gMSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmVxKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stY2VudGVyJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVzXHJcbiAgICAgICAgICAgICAgICAuZXEoaW5kZXgpXHJcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWNlbnRlcicpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPD0gKF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVzXHJcbiAgICAgICAgICAgICAgICAgICAgLnNsaWNlKGluZGV4LCBpbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChhbGxTbGlkZXMubGVuZ3RoIDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBhbGxTbGlkZXNcclxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIHJlbWFpbmRlciA9IF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XHJcbiAgICAgICAgICAgICAgICBpbmRleE9mZnNldCA9IF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSA/IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyBpbmRleCA6IGluZGV4O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID09IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAmJiAoXy5zbGlkZUNvdW50IC0gaW5kZXgpIDwgXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKGluZGV4T2Zmc2V0IC0gKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLSByZW1haW5kZXIpLCBpbmRleE9mZnNldCArIHJlbWFpbmRlcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKGluZGV4T2Zmc2V0LCBpbmRleE9mZnNldCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMubGF6eUxvYWQgPT09ICdvbmRlbWFuZCcgfHwgXy5vcHRpb25zLmxhenlMb2FkID09PSAnYW50aWNpcGF0ZWQnKSB7XHJcbiAgICAgICAgICAgIF8ubGF6eUxvYWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXR1cEluZmluaXRlID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgaSwgc2xpZGVJbmRleCwgaW5maW5pdGVDb3VudDtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8ub3B0aW9ucy5jZW50ZXJNb2RlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlICYmIF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgc2xpZGVJbmRleCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZmluaXRlQ291bnQgPSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5maW5pdGVDb3VudCA9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gXy5zbGlkZUNvdW50OyBpID4gKF8uc2xpZGVDb3VudCAtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZmluaXRlQ291bnQpOyBpIC09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZUluZGV4ID0gaSAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgJChfLiRzbGlkZXNbc2xpZGVJbmRleF0pLmNsb25lKHRydWUpLmF0dHIoJ2lkJywgJycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4Jywgc2xpZGVJbmRleCAtIF8uc2xpZGVDb3VudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnByZXBlbmRUbyhfLiRzbGlkZVRyYWNrKS5hZGRDbGFzcygnc2xpY2stY2xvbmVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaW5maW5pdGVDb3VudCAgKyBfLnNsaWRlQ291bnQ7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlSW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoXy4kc2xpZGVzW3NsaWRlSW5kZXhdKS5jbG9uZSh0cnVlKS5hdHRyKCdpZCcsICcnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1zbGljay1pbmRleCcsIHNsaWRlSW5kZXggKyBfLnNsaWRlQ291bnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhfLiRzbGlkZVRyYWNrKS5hZGRDbGFzcygnc2xpY2stY2xvbmVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmZpbmQoJy5zbGljay1jbG9uZWQnKS5maW5kKCdbaWRdJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2lkJywgJycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5pbnRlcnJ1cHQgPSBmdW5jdGlvbiggdG9nZ2xlICkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmKCAhdG9nZ2xlICkge1xyXG4gICAgICAgICAgICBfLmF1dG9QbGF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF8uaW50ZXJydXB0ZWQgPSB0b2dnbGU7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc2VsZWN0SGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHRhcmdldEVsZW1lbnQgPVxyXG4gICAgICAgICAgICAkKGV2ZW50LnRhcmdldCkuaXMoJy5zbGljay1zbGlkZScpID9cclxuICAgICAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KSA6XHJcbiAgICAgICAgICAgICAgICAkKGV2ZW50LnRhcmdldCkucGFyZW50cygnLnNsaWNrLXNsaWRlJyk7XHJcblxyXG4gICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KHRhcmdldEVsZW1lbnQuYXR0cignZGF0YS1zbGljay1pbmRleCcpKTtcclxuXHJcbiAgICAgICAgaWYgKCFpbmRleCkgaW5kZXggPSAwO1xyXG5cclxuICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuXHJcbiAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKGluZGV4LCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLnNsaWRlSGFuZGxlcihpbmRleCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc2xpZGVIYW5kbGVyID0gZnVuY3Rpb24oaW5kZXgsIHN5bmMsIGRvbnRBbmltYXRlKSB7XHJcblxyXG4gICAgICAgIHZhciB0YXJnZXRTbGlkZSwgYW5pbVNsaWRlLCBvbGRTbGlkZSwgc2xpZGVMZWZ0LCB0YXJnZXRMZWZ0ID0gbnVsbCxcclxuICAgICAgICAgICAgXyA9IHRoaXMsIG5hdlRhcmdldDtcclxuXHJcbiAgICAgICAgc3luYyA9IHN5bmMgfHwgZmFsc2U7XHJcblxyXG4gICAgICAgIGlmIChfLmFuaW1hdGluZyA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMud2FpdEZvckFuaW1hdGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSB0cnVlICYmIF8uY3VycmVudFNsaWRlID09PSBpbmRleCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3luYyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgXy5hc05hdkZvcihpbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0YXJnZXRTbGlkZSA9IGluZGV4O1xyXG4gICAgICAgIHRhcmdldExlZnQgPSBfLmdldExlZnQodGFyZ2V0U2xpZGUpO1xyXG4gICAgICAgIHNsaWRlTGVmdCA9IF8uZ2V0TGVmdChfLmN1cnJlbnRTbGlkZSk7XHJcblxyXG4gICAgICAgIF8uY3VycmVudExlZnQgPSBfLnN3aXBlTGVmdCA9PT0gbnVsbCA/IHNsaWRlTGVmdCA6IF8uc3dpcGVMZWZ0O1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSAmJiBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gZmFsc2UgJiYgKGluZGV4IDwgMCB8fCBpbmRleCA+IF8uZ2V0RG90Q291bnQoKSAqIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpIHtcclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U2xpZGUgPSBfLmN1cnJlbnRTbGlkZTtcclxuICAgICAgICAgICAgICAgIGlmIChkb250QW5pbWF0ZSAhPT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5hbmltYXRlU2xpZGUoc2xpZGVMZWZ0LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUodGFyZ2V0U2xpZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZSh0YXJnZXRTbGlkZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSAmJiBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSAmJiAoaW5kZXggPCAwIHx8IGluZGV4ID4gKF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpKSB7XHJcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy5jdXJyZW50U2xpZGU7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG9udEFuaW1hdGUgIT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uYW5pbWF0ZVNsaWRlKHNsaWRlTGVmdCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKHRhcmdldFNsaWRlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUodGFyZ2V0U2xpZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggXy5vcHRpb25zLmF1dG9wbGF5ICkge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKF8uYXV0b1BsYXlUaW1lcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGFyZ2V0U2xpZGUgPCAwKSB7XHJcbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIGFuaW1TbGlkZSA9IF8uc2xpZGVDb3VudCAtIChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYW5pbVNsaWRlID0gXy5zbGlkZUNvdW50ICsgdGFyZ2V0U2xpZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHRhcmdldFNsaWRlID49IF8uc2xpZGVDb3VudCkge1xyXG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBhbmltU2xpZGUgPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYW5pbVNsaWRlID0gdGFyZ2V0U2xpZGUgLSBfLnNsaWRlQ291bnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbmltU2xpZGUgPSB0YXJnZXRTbGlkZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uYW5pbWF0aW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2JlZm9yZUNoYW5nZScsIFtfLCBfLmN1cnJlbnRTbGlkZSwgYW5pbVNsaWRlXSk7XHJcblxyXG4gICAgICAgIG9sZFNsaWRlID0gXy5jdXJyZW50U2xpZGU7XHJcbiAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBhbmltU2xpZGU7XHJcblxyXG4gICAgICAgIF8uc2V0U2xpZGVDbGFzc2VzKF8uY3VycmVudFNsaWRlKTtcclxuXHJcbiAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXNOYXZGb3IgKSB7XHJcblxyXG4gICAgICAgICAgICBuYXZUYXJnZXQgPSBfLmdldE5hdlRhcmdldCgpO1xyXG4gICAgICAgICAgICBuYXZUYXJnZXQgPSBuYXZUYXJnZXQuc2xpY2soJ2dldFNsaWNrJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIG5hdlRhcmdldC5zbGlkZUNvdW50IDw9IG5hdlRhcmdldC5vcHRpb25zLnNsaWRlc1RvU2hvdyApIHtcclxuICAgICAgICAgICAgICAgIG5hdlRhcmdldC5zZXRTbGlkZUNsYXNzZXMoXy5jdXJyZW50U2xpZGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy51cGRhdGVEb3RzKCk7XHJcbiAgICAgICAgXy51cGRhdGVBcnJvd3MoKTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGlmIChkb250QW5pbWF0ZSAhPT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIF8uZmFkZVNsaWRlT3V0KG9sZFNsaWRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBfLmZhZGVTbGlkZShhbmltU2xpZGUsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKGFuaW1TbGlkZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZShhbmltU2xpZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF8uYW5pbWF0ZUhlaWdodCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZG9udEFuaW1hdGUgIT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICBfLmFuaW1hdGVTbGlkZSh0YXJnZXRMZWZ0LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKGFuaW1TbGlkZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF8ucG9zdFNsaWRlKGFuaW1TbGlkZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnN0YXJ0TG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHByZXZBcnJvdy5oaWRlKCk7XHJcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdy5oaWRlKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5kb3RzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuXHJcbiAgICAgICAgICAgIF8uJGRvdHMuaGlkZSgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uJHNsaWRlci5hZGRDbGFzcygnc2xpY2stbG9hZGluZycpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnN3aXBlRGlyZWN0aW9uID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciB4RGlzdCwgeURpc3QsIHIsIHN3aXBlQW5nbGUsIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICB4RGlzdCA9IF8udG91Y2hPYmplY3Quc3RhcnRYIC0gXy50b3VjaE9iamVjdC5jdXJYO1xyXG4gICAgICAgIHlEaXN0ID0gXy50b3VjaE9iamVjdC5zdGFydFkgLSBfLnRvdWNoT2JqZWN0LmN1clk7XHJcbiAgICAgICAgciA9IE1hdGguYXRhbjIoeURpc3QsIHhEaXN0KTtcclxuXHJcbiAgICAgICAgc3dpcGVBbmdsZSA9IE1hdGgucm91bmQociAqIDE4MCAvIE1hdGguUEkpO1xyXG4gICAgICAgIGlmIChzd2lwZUFuZ2xlIDwgMCkge1xyXG4gICAgICAgICAgICBzd2lwZUFuZ2xlID0gMzYwIC0gTWF0aC5hYnMoc3dpcGVBbmdsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoKHN3aXBlQW5nbGUgPD0gNDUpICYmIChzd2lwZUFuZ2xlID49IDApKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoXy5vcHRpb25zLnJ0bCA9PT0gZmFsc2UgPyAnbGVmdCcgOiAncmlnaHQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKChzd2lwZUFuZ2xlIDw9IDM2MCkgJiYgKHN3aXBlQW5nbGUgPj0gMzE1KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKF8ub3B0aW9ucy5ydGwgPT09IGZhbHNlID8gJ2xlZnQnIDogJ3JpZ2h0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgoc3dpcGVBbmdsZSA+PSAxMzUpICYmIChzd2lwZUFuZ2xlIDw9IDIyNSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChfLm9wdGlvbnMucnRsID09PSBmYWxzZSA/ICdyaWdodCcgOiAnbGVmdCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBpZiAoKHN3aXBlQW5nbGUgPj0gMzUpICYmIChzd2lwZUFuZ2xlIDw9IDEzNSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnZG93bic7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3VwJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc3dpcGVFbmQgPSBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIHNsaWRlQ291bnQsXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbjtcclxuXHJcbiAgICAgICAgXy5kcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIF8uc3dpcGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoXy5zY3JvbGxpbmcpIHtcclxuICAgICAgICAgICAgXy5zY3JvbGxpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG4gICAgICAgIF8uc2hvdWxkQ2xpY2sgPSAoIF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggPiAxMCApID8gZmFsc2UgOiB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoIF8udG91Y2hPYmplY3QuY3VyWCA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIF8udG91Y2hPYmplY3QuZWRnZUhpdCA9PT0gdHJ1ZSApIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2VkZ2UnLCBbXywgXy5zd2lwZURpcmVjdGlvbigpIF0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoID49IF8udG91Y2hPYmplY3QubWluU3dpcGUgKSB7XHJcblxyXG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBfLnN3aXBlRGlyZWN0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKCBkaXJlY3Rpb24gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnbGVmdCc6XHJcbiAgICAgICAgICAgICAgICBjYXNlICdkb3duJzpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVDb3VudCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucy5zd2lwZVRvU2xpZGUgP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jaGVja05hdmlnYWJsZSggXy5jdXJyZW50U2xpZGUgKyBfLmdldFNsaWRlQ291bnQoKSApIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlICsgXy5nZXRTbGlkZUNvdW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8uY3VycmVudERpcmVjdGlvbiA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3VwJzpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVDb3VudCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucy5zd2lwZVRvU2xpZGUgP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jaGVja05hdmlnYWJsZSggXy5jdXJyZW50U2xpZGUgLSBfLmdldFNsaWRlQ291bnQoKSApIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlIC0gXy5nZXRTbGlkZUNvdW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8uY3VycmVudERpcmVjdGlvbiA9IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcblxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoIGRpcmVjdGlvbiAhPSAndmVydGljYWwnICkge1xyXG5cclxuICAgICAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKCBzbGlkZUNvdW50ICk7XHJcbiAgICAgICAgICAgICAgICBfLnRvdWNoT2JqZWN0ID0ge307XHJcbiAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignc3dpcGUnLCBbXywgZGlyZWN0aW9uIF0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgaWYgKCBfLnRvdWNoT2JqZWN0LnN0YXJ0WCAhPT0gXy50b3VjaE9iamVjdC5jdXJYICkge1xyXG5cclxuICAgICAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKCBfLmN1cnJlbnRTbGlkZSApO1xyXG4gICAgICAgICAgICAgICAgXy50b3VjaE9iamVjdCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc3dpcGVIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoKF8ub3B0aW9ucy5zd2lwZSA9PT0gZmFsc2UpIHx8ICgnb250b3VjaGVuZCcgaW4gZG9jdW1lbnQgJiYgXy5vcHRpb25zLnN3aXBlID09PSBmYWxzZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmRyYWdnYWJsZSA9PT0gZmFsc2UgJiYgZXZlbnQudHlwZS5pbmRleE9mKCdtb3VzZScpICE9PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLnRvdWNoT2JqZWN0LmZpbmdlckNvdW50ID0gZXZlbnQub3JpZ2luYWxFdmVudCAmJiBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXMgIT09IHVuZGVmaW5lZCA/XHJcbiAgICAgICAgICAgIGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlcy5sZW5ndGggOiAxO1xyXG5cclxuICAgICAgICBfLnRvdWNoT2JqZWN0Lm1pblN3aXBlID0gXy5saXN0V2lkdGggLyBfLm9wdGlvbnNcclxuICAgICAgICAgICAgLnRvdWNoVGhyZXNob2xkO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLnRvdWNoT2JqZWN0Lm1pblN3aXBlID0gXy5saXN0SGVpZ2h0IC8gXy5vcHRpb25zXHJcbiAgICAgICAgICAgICAgICAudG91Y2hUaHJlc2hvbGQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2l0Y2ggKGV2ZW50LmRhdGEuYWN0aW9uKSB7XHJcblxyXG4gICAgICAgICAgICBjYXNlICdzdGFydCc6XHJcbiAgICAgICAgICAgICAgICBfLnN3aXBlU3RhcnQoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlICdtb3ZlJzpcclxuICAgICAgICAgICAgICAgIF8uc3dpcGVNb3ZlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnZW5kJzpcclxuICAgICAgICAgICAgICAgIF8uc3dpcGVFbmQoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zd2lwZU1vdmUgPSBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGVkZ2VXYXNIaXQgPSBmYWxzZSxcclxuICAgICAgICAgICAgY3VyTGVmdCwgc3dpcGVEaXJlY3Rpb24sIHN3aXBlTGVuZ3RoLCBwb3NpdGlvbk9mZnNldCwgdG91Y2hlcywgdmVydGljYWxTd2lwZUxlbmd0aDtcclxuXHJcbiAgICAgICAgdG91Y2hlcyA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQgIT09IHVuZGVmaW5lZCA/IGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlcyA6IG51bGw7XHJcblxyXG4gICAgICAgIGlmICghXy5kcmFnZ2luZyB8fCBfLnNjcm9sbGluZyB8fCB0b3VjaGVzICYmIHRvdWNoZXMubGVuZ3RoICE9PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN1ckxlZnQgPSBfLmdldExlZnQoXy5jdXJyZW50U2xpZGUpO1xyXG5cclxuICAgICAgICBfLnRvdWNoT2JqZWN0LmN1clggPSB0b3VjaGVzICE9PSB1bmRlZmluZWQgPyB0b3VjaGVzWzBdLnBhZ2VYIDogZXZlbnQuY2xpZW50WDtcclxuICAgICAgICBfLnRvdWNoT2JqZWN0LmN1clkgPSB0b3VjaGVzICE9PSB1bmRlZmluZWQgPyB0b3VjaGVzWzBdLnBhZ2VZIDogZXZlbnQuY2xpZW50WTtcclxuXHJcbiAgICAgICAgXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCA9IE1hdGgucm91bmQoTWF0aC5zcXJ0KFxyXG4gICAgICAgICAgICBNYXRoLnBvdyhfLnRvdWNoT2JqZWN0LmN1clggLSBfLnRvdWNoT2JqZWN0LnN0YXJ0WCwgMikpKTtcclxuXHJcbiAgICAgICAgdmVydGljYWxTd2lwZUxlbmd0aCA9IE1hdGgucm91bmQoTWF0aC5zcXJ0KFxyXG4gICAgICAgICAgICBNYXRoLnBvdyhfLnRvdWNoT2JqZWN0LmN1clkgLSBfLnRvdWNoT2JqZWN0LnN0YXJ0WSwgMikpKTtcclxuXHJcbiAgICAgICAgaWYgKCFfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nICYmICFfLnN3aXBpbmcgJiYgdmVydGljYWxTd2lwZUxlbmd0aCA+IDQpIHtcclxuICAgICAgICAgICAgXy5zY3JvbGxpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoID0gdmVydGljYWxTd2lwZUxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXBlRGlyZWN0aW9uID0gXy5zd2lwZURpcmVjdGlvbigpO1xyXG5cclxuICAgICAgICBpZiAoZXZlbnQub3JpZ2luYWxFdmVudCAhPT0gdW5kZWZpbmVkICYmIF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggPiA0KSB7XHJcbiAgICAgICAgICAgIF8uc3dpcGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwb3NpdGlvbk9mZnNldCA9IChfLm9wdGlvbnMucnRsID09PSBmYWxzZSA/IDEgOiAtMSkgKiAoXy50b3VjaE9iamVjdC5jdXJYID4gXy50b3VjaE9iamVjdC5zdGFydFggPyAxIDogLTEpO1xyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uT2Zmc2V0ID0gXy50b3VjaE9iamVjdC5jdXJZID4gXy50b3VjaE9iamVjdC5zdGFydFkgPyAxIDogLTE7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgc3dpcGVMZW5ndGggPSBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoO1xyXG5cclxuICAgICAgICBfLnRvdWNoT2JqZWN0LmVkZ2VIaXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYgKChfLmN1cnJlbnRTbGlkZSA9PT0gMCAmJiBzd2lwZURpcmVjdGlvbiA9PT0gJ3JpZ2h0JykgfHwgKF8uY3VycmVudFNsaWRlID49IF8uZ2V0RG90Q291bnQoKSAmJiBzd2lwZURpcmVjdGlvbiA9PT0gJ2xlZnQnKSkge1xyXG4gICAgICAgICAgICAgICAgc3dpcGVMZW5ndGggPSBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoICogXy5vcHRpb25zLmVkZ2VGcmljdGlvbjtcclxuICAgICAgICAgICAgICAgIF8udG91Y2hPYmplY3QuZWRnZUhpdCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIF8uc3dpcGVMZWZ0ID0gY3VyTGVmdCArIHN3aXBlTGVuZ3RoICogcG9zaXRpb25PZmZzZXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBjdXJMZWZ0ICsgKHN3aXBlTGVuZ3RoICogKF8uJGxpc3QuaGVpZ2h0KCkgLyBfLmxpc3RXaWR0aCkpICogcG9zaXRpb25PZmZzZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uc3dpcGVMZWZ0ID0gY3VyTGVmdCArIHN3aXBlTGVuZ3RoICogcG9zaXRpb25PZmZzZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUgfHwgXy5vcHRpb25zLnRvdWNoTW92ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8uYW5pbWF0aW5nID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uc3dpcGVMZWZ0ID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy5zZXRDU1MoXy5zd2lwZUxlZnQpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnN3aXBlU3RhcnQgPSBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIHRvdWNoZXM7XHJcblxyXG4gICAgICAgIF8uaW50ZXJydXB0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoXy50b3VjaE9iamVjdC5maW5nZXJDb3VudCAhPT0gMSB8fCBfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICBfLnRvdWNoT2JqZWN0ID0ge307XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudC5vcmlnaW5hbEV2ZW50ICE9PSB1bmRlZmluZWQgJiYgZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdG91Y2hlcyA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8udG91Y2hPYmplY3Quc3RhcnRYID0gXy50b3VjaE9iamVjdC5jdXJYID0gdG91Y2hlcyAhPT0gdW5kZWZpbmVkID8gdG91Y2hlcy5wYWdlWCA6IGV2ZW50LmNsaWVudFg7XHJcbiAgICAgICAgXy50b3VjaE9iamVjdC5zdGFydFkgPSBfLnRvdWNoT2JqZWN0LmN1clkgPSB0b3VjaGVzICE9PSB1bmRlZmluZWQgPyB0b3VjaGVzLnBhZ2VZIDogZXZlbnQuY2xpZW50WTtcclxuXHJcbiAgICAgICAgXy5kcmFnZ2luZyA9IHRydWU7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUudW5maWx0ZXJTbGlkZXMgPSBTbGljay5wcm90b3R5cGUuc2xpY2tVbmZpbHRlciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLiRzbGlkZXNDYWNoZSAhPT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgXy51bmxvYWQoKTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlc0NhY2hlLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spO1xyXG5cclxuICAgICAgICAgICAgXy5yZWluaXQoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnVubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgICQoJy5zbGljay1jbG9uZWQnLCBfLiRzbGlkZXIpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICBpZiAoXy4kZG90cykge1xyXG4gICAgICAgICAgICBfLiRkb3RzLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8uJHByZXZBcnJvdyAmJiBfLmh0bWxFeHByLnRlc3QoXy5vcHRpb25zLnByZXZBcnJvdykpIHtcclxuICAgICAgICAgICAgXy4kcHJldkFycm93LnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8uJG5leHRBcnJvdyAmJiBfLmh0bWxFeHByLnRlc3QoXy5vcHRpb25zLm5leHRBcnJvdykpIHtcclxuICAgICAgICAgICAgXy4kbmV4dEFycm93LnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy4kc2xpZGVzXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stc2xpZGUgc2xpY2stYWN0aXZlIHNsaWNrLXZpc2libGUgc2xpY2stY3VycmVudCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJylcclxuICAgICAgICAgICAgLmNzcygnd2lkdGgnLCAnJyk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUudW5zbGljayA9IGZ1bmN0aW9uKGZyb21CcmVha3BvaW50KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcigndW5zbGljaycsIFtfLCBmcm9tQnJlYWtwb2ludF0pO1xyXG4gICAgICAgIF8uZGVzdHJveSgpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnVwZGF0ZUFycm93cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGNlbnRlck9mZnNldDtcclxuXHJcbiAgICAgICAgY2VudGVyT2Zmc2V0ID0gTWF0aC5mbG9vcihfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMik7XHJcblxyXG4gICAgICAgIGlmICggXy5vcHRpb25zLmFycm93cyA9PT0gdHJ1ZSAmJlxyXG4gICAgICAgICAgICBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICYmXHJcbiAgICAgICAgICAgICFfLm9wdGlvbnMuaW5maW5pdGUgKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xyXG4gICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAgICAgaWYgKF8uY3VycmVudFNsaWRlID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LmFkZENsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LnJlbW92ZUNsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAnZmFsc2UnKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5jdXJyZW50U2xpZGUgPj0gXy5zbGlkZUNvdW50IC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAmJiBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cuYWRkQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmN1cnJlbnRTbGlkZSA+PSBfLnNsaWRlQ291bnQgLSAxICYmIF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LmFkZENsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LnJlbW92ZUNsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAnZmFsc2UnKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnVwZGF0ZURvdHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy4kZG90cyAhPT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgXy4kZG90c1xyXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2xpJylcclxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgLmVuZCgpO1xyXG5cclxuICAgICAgICAgICAgXy4kZG90c1xyXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2xpJylcclxuICAgICAgICAgICAgICAgIC5lcShNYXRoLmZsb29yKF8uY3VycmVudFNsaWRlIC8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSlcclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJyk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS52aXNpYmlsaXR5ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXV0b3BsYXkgKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGRvY3VtZW50W18uaGlkZGVuXSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLmludGVycnVwdGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICAkLmZuLnNsaWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBvcHQgPSBhcmd1bWVudHNbMF0sXHJcbiAgICAgICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxyXG4gICAgICAgICAgICBsID0gXy5sZW5ndGgsXHJcbiAgICAgICAgICAgIGksXHJcbiAgICAgICAgICAgIHJldDtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0ID09ICdvYmplY3QnIHx8IHR5cGVvZiBvcHQgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICBfW2ldLnNsaWNrID0gbmV3IFNsaWNrKF9baV0sIG9wdCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldCA9IF9baV0uc2xpY2tbb3B0XS5hcHBseShfW2ldLnNsaWNrLCBhcmdzKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXQgIT0gJ3VuZGVmaW5lZCcpIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfO1xyXG4gICAgfTtcclxuXHJcbn0pKTtcclxuIl19
