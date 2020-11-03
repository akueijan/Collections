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
        dObj.toggleClass('nav--active'); // $('body').toggleClass('_freeze');
      });
      dMenuClose.click(function () {
        dObj.removeClass("nav--active"); // $('body').removeClass('_freeze');
      });
      dAllLink.click(function () {
        dObj.removeClass('nav--active'); // $('body').removeClass('_freeze');
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
    var loadHtml = ['<div class="mdLoading">', '    <div class="loadingBox">', // '        <img class="line2" src="images/load-pic.png">',
    // '        <div class="progressBar">',
    // '            <div class="progress js-bar" style="width:0"></div>',
    // '        </div>',
    '		<img class="loadingpic" src="images/loading.gif">', '    </div>', '</div>'].join('');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5uYXYuanMiLCJsb2FkLmpzIiwibW9iaWxlLWRldGVjdC5taW4uanMiLCJzbGljay5qcyJdLCJuYW1lcyI6WyIkIiwiZm4iLCJtZW51Iiwib3B0cyIsImNvbmZpZyIsImV4dGVuZCIsIm9wdDEiLCJpbml0Iiwib2JqIiwiZE9iaiIsImRNZW51bGluayIsImZpbmQiLCJkQWxsTGluayIsImRNZW51Q2xvc2UiLCJjbGljayIsInRvZ2dsZUNsYXNzIiwicmVtb3ZlQ2xhc3MiLCJlYWNoIiwialF1ZXJ5IiwibG9hZHBhZ2UiLCJhY3Rpb24iLCJwcm9ncmVzc1ZhbHVlIiwibG9hZEh0bWwiLCJqb2luIiwiZExvYWQiLCJkQ291bnQiLCJkQmFyIiwiYXN5bmMiLCJhcHBlbmRUbyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicXVldWUiLCJjcmVhdGVqcyIsIkxvYWRRdWV1ZSIsInNldE1heENvbm5lY3Rpb25zIiwibG9hZEFycmF5IiwiaSIsInB1c2giLCJpZCIsInNyYyIsImF0dHIiLCJsb2FkTWFuaWZlc3QiLCJoYW5kbGVDb21wbGV0ZSIsIndpbmRvdyIsInRyaWdnZXIiLCJjc3MiLCJUd2Vlbk1heCIsImZyb21UbyIsIm9wYWNpdHkiLCJkZWxheSIsImVhc2UiLCJQb3dlcjQiLCJlYXNlT3V0Iiwib25Db21wbGV0ZSIsInJlbW92ZSIsIm9uIiwicHJvY1ZhbHVlIiwiTWF0aCIsIm1pbiIsImNlaWwiLCJwcm9ncmVzcyIsInRleHQiLCJsIiwibSIsIm4iLCJ2IiwidyIsInRvTG93ZXJDYXNlIiwibyIsIngiLCJ5IiwieiIsImxlbmd0aCIsInAiLCJ1IiwiY2FsbCIsIlJlZ0V4cCIsInEiLCJzdWJzdHIiLCJyIiwidWEiLCJfY2FjaGUiLCJtYXhQaG9uZVdpZHRoIiwicyIsIm1vYmlsZURldGVjdFJ1bGVzIiwicGhvbmVzIiwiaVBob25lIiwiQmxhY2tCZXJyeSIsIkhUQyIsIk5leHVzIiwiRGVsbCIsIk1vdG9yb2xhIiwiU2Ftc3VuZyIsIkxHIiwiU29ueSIsIkFzdXMiLCJOb2tpYUx1bWlhIiwiTWljcm9tYXgiLCJQYWxtIiwiVmVydHUiLCJQYW50ZWNoIiwiRmx5IiwiV2lrbyIsImlNb2JpbGUiLCJTaW1WYWxsZXkiLCJXb2xmZ2FuZyIsIkFsY2F0ZWwiLCJOaW50ZW5kbyIsIkFtb2kiLCJJTlEiLCJHZW5lcmljUGhvbmUiLCJ0YWJsZXRzIiwiaVBhZCIsIk5leHVzVGFibGV0IiwiR29vZ2xlVGFibGV0IiwiU2Ftc3VuZ1RhYmxldCIsIktpbmRsZSIsIlN1cmZhY2VUYWJsZXQiLCJIUFRhYmxldCIsIkFzdXNUYWJsZXQiLCJCbGFja0JlcnJ5VGFibGV0IiwiSFRDdGFibGV0IiwiTW90b3JvbGFUYWJsZXQiLCJOb29rVGFibGV0IiwiQWNlclRhYmxldCIsIlRvc2hpYmFUYWJsZXQiLCJMR1RhYmxldCIsIkZ1aml0c3VUYWJsZXQiLCJQcmVzdGlnaW9UYWJsZXQiLCJMZW5vdm9UYWJsZXQiLCJEZWxsVGFibGV0IiwiWWFydmlrVGFibGV0IiwiTWVkaW9uVGFibGV0IiwiQXJub3ZhVGFibGV0IiwiSW50ZW5zb1RhYmxldCIsIklSVVRhYmxldCIsIk1lZ2Fmb25UYWJsZXQiLCJFYm9kYVRhYmxldCIsIkFsbFZpZXdUYWJsZXQiLCJBcmNob3NUYWJsZXQiLCJBaW5vbFRhYmxldCIsIk5va2lhTHVtaWFUYWJsZXQiLCJTb255VGFibGV0IiwiUGhpbGlwc1RhYmxldCIsIkN1YmVUYWJsZXQiLCJDb2J5VGFibGV0IiwiTUlEVGFibGV0IiwiTVNJVGFibGV0IiwiU01pVFRhYmxldCIsIlJvY2tDaGlwVGFibGV0IiwiRmx5VGFibGV0IiwiYnFUYWJsZXQiLCJIdWF3ZWlUYWJsZXQiLCJOZWNUYWJsZXQiLCJQYW50ZWNoVGFibGV0IiwiQnJvbmNob1RhYmxldCIsIlZlcnN1c1RhYmxldCIsIlp5bmNUYWJsZXQiLCJQb3NpdGl2b1RhYmxldCIsIk5hYmlUYWJsZXQiLCJLb2JvVGFibGV0IiwiRGFuZXdUYWJsZXQiLCJUZXhldFRhYmxldCIsIlBsYXlzdGF0aW9uVGFibGV0IiwiVHJla3N0b3JUYWJsZXQiLCJQeWxlQXVkaW9UYWJsZXQiLCJBZHZhblRhYmxldCIsIkRhbnlUZWNoVGFibGV0IiwiR2FsYXBhZFRhYmxldCIsIk1pY3JvbWF4VGFibGV0IiwiS2FyYm9ublRhYmxldCIsIkFsbEZpbmVUYWJsZXQiLCJQUk9TQ0FOVGFibGV0IiwiWU9ORVNUYWJsZXQiLCJDaGFuZ0ppYVRhYmxldCIsIkdVVGFibGV0IiwiUG9pbnRPZlZpZXdUYWJsZXQiLCJPdmVybWF4VGFibGV0IiwiSENMVGFibGV0IiwiRFBTVGFibGV0IiwiVmlzdHVyZVRhYmxldCIsIkNyZXN0YVRhYmxldCIsIk1lZGlhdGVrVGFibGV0IiwiQ29uY29yZGVUYWJsZXQiLCJHb0NsZXZlclRhYmxldCIsIk1vZGVjb21UYWJsZXQiLCJWb25pbm9UYWJsZXQiLCJFQ1NUYWJsZXQiLCJTdG9yZXhUYWJsZXQiLCJWb2RhZm9uZVRhYmxldCIsIkVzc2VudGllbEJUYWJsZXQiLCJSb3NzTW9vclRhYmxldCIsImlNb2JpbGVUYWJsZXQiLCJUb2xpbm9UYWJsZXQiLCJBdWRpb1NvbmljVGFibGV0IiwiQU1QRVRhYmxldCIsIlNra1RhYmxldCIsIlRlY25vVGFibGV0IiwiSlhEVGFibGV0IiwiaUpveVRhYmxldCIsIkZYMlRhYmxldCIsIlhvcm9UYWJsZXQiLCJWaWV3c29uaWNUYWJsZXQiLCJWZXJpem9uVGFibGV0IiwiT2R5c1RhYmxldCIsIkNhcHRpdmFUYWJsZXQiLCJJY29uYml0VGFibGV0IiwiVGVjbGFzdFRhYmxldCIsIk9uZGFUYWJsZXQiLCJKYXl0ZWNoVGFibGV0IiwiQmxhdXB1bmt0VGFibGV0IiwiRGlnbWFUYWJsZXQiLCJFdm9saW9UYWJsZXQiLCJMYXZhVGFibGV0IiwiQW9jVGFibGV0IiwiTXBtYW5UYWJsZXQiLCJDZWxrb25UYWJsZXQiLCJXb2xkZXJUYWJsZXQiLCJNZWRpYWNvbVRhYmxldCIsIk1pVGFibGV0IiwiTmliaXJ1VGFibGV0IiwiTmV4b1RhYmxldCIsIkxlYWRlclRhYmxldCIsIlViaXNsYXRlVGFibGV0IiwiUG9ja2V0Qm9va1RhYmxldCIsIktvY2Fzb1RhYmxldCIsIkhpc2Vuc2VUYWJsZXQiLCJIdWRsIiwiVGVsc3RyYVRhYmxldCIsIkdlbmVyaWNUYWJsZXQiLCJvc3MiLCJBbmRyb2lkT1MiLCJCbGFja0JlcnJ5T1MiLCJQYWxtT1MiLCJTeW1iaWFuT1MiLCJXaW5kb3dzTW9iaWxlT1MiLCJXaW5kb3dzUGhvbmVPUyIsImlPUyIsIk1lZUdvT1MiLCJNYWVtb09TIiwiSmF2YU9TIiwid2ViT1MiLCJiYWRhT1MiLCJCUkVXT1MiLCJ1YXMiLCJDaHJvbWUiLCJEb2xmaW4iLCJPcGVyYSIsIlNreWZpcmUiLCJFZGdlIiwiSUUiLCJGaXJlZm94IiwiQm9sdCIsIlRlYVNoYXJrIiwiQmxhemVyIiwiU2FmYXJpIiwiVUNCcm93c2VyIiwiYmFpZHVib3hhcHAiLCJiYWlkdWJyb3dzZXIiLCJEaWlnb0Jyb3dzZXIiLCJQdWZmaW4iLCJNZXJjdXJ5IiwiT2JpZ29Ccm93c2VyIiwiTmV0RnJvbnQiLCJHZW5lcmljQnJvd3NlciIsIlBhbGVNb29uIiwicHJvcHMiLCJNb2JpbGUiLCJCdWlsZCIsIlZlcnNpb24iLCJWZW5kb3JJRCIsImlQb2QiLCJDb2FzdCIsIkZlbm5lYyIsIk5va2lhQnJvd3NlciIsIk1RUUJyb3dzZXIiLCJNaWNyb01lc3NlbmdlciIsIlNhbXN1bmdCcm93c2VyIiwiSXJvbiIsIlRpemVuIiwiV2Via2l0IiwiR2Vja28iLCJUcmlkZW50IiwiUHJlc3RvIiwiR29hbm5hIiwiQW5kcm9pZCIsIkJSRVciLCJKYXZhIiwiU3ltYmlhbiIsInV0aWxzIiwiQm90IiwiTW9iaWxlQm90IiwiRGVza3RvcE1vZGUiLCJUViIsIldlYktpdCIsIkNvbnNvbGUiLCJXYXRjaCIsImRldGVjdE1vYmlsZUJyb3dzZXJzIiwiZnVsbFBhdHRlcm4iLCJzaG9ydFBhdHRlcm4iLCJ0YWJsZXRQYXR0ZXJuIiwidCIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiRkFMTEJBQ0tfUEhPTkUiLCJGQUxMQkFDS19UQUJMRVQiLCJGQUxMQkFDS19NT0JJTEUiLCJBcnJheSIsImlzQXJyYXkiLCJ0b1N0cmluZyIsIkEiLCJCIiwiaW5kZXhPZiIsInN1YnN0cmluZyIsIm9zczAiLCJmaW5kTWF0Y2giLCJ0ZXN0IiwiZmluZE1hdGNoZXMiLCJnZXRWZXJzaW9uU3RyIiwiZXhlYyIsImdldFZlcnNpb24iLCJwcmVwYXJlVmVyc2lvbk5vIiwiTmFOIiwic3BsaXQiLCJzaGlmdCIsImlzTW9iaWxlRmFsbGJhY2siLCJpc1RhYmxldEZhbGxiYWNrIiwicHJlcGFyZURldGVjdGlvbkNhY2hlIiwibW9iaWxlIiwidGFibGV0IiwicGhvbmUiLCJpc1Bob25lU2l6ZWQiLCJtb2JpbGVHcmFkZSIsIm9zIiwidmVyc2lvbiIsImlzIiwibWF0Y2giLCJkZXRlY3RPUyIsImdldERldmljZVNtYWxsZXJTaWRlIiwic2NyZWVuIiwid2lkdGgiLCJoZWlnaHQiLCJjb25zdHJ1Y3RvciIsInVzZXJBZ2VudCIsInVzZXJBZ2VudHMiLCJ2ZXJzaW9uU3RyIiwiZ3JhZGUiLCJfaW1wbCIsIm1vZHVsZSIsImV4cG9ydHMiLCJkZWZpbmUiLCJhbWQiLCJNb2JpbGVEZXRlY3QiLCJFcnJvciIsImZhY3RvcnkiLCJyZXF1aXJlIiwiU2xpY2siLCJpbnN0YW5jZVVpZCIsImVsZW1lbnQiLCJzZXR0aW5ncyIsIl8iLCJkYXRhU2V0dGluZ3MiLCJkZWZhdWx0cyIsImFjY2Vzc2liaWxpdHkiLCJhZGFwdGl2ZUhlaWdodCIsImFwcGVuZEFycm93cyIsImFwcGVuZERvdHMiLCJhcnJvd3MiLCJhc05hdkZvciIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsImF1dG9wbGF5IiwiYXV0b3BsYXlTcGVlZCIsImNlbnRlck1vZGUiLCJjZW50ZXJQYWRkaW5nIiwiY3NzRWFzZSIsImN1c3RvbVBhZ2luZyIsInNsaWRlciIsImRvdHMiLCJkb3RzQ2xhc3MiLCJkcmFnZ2FibGUiLCJlYXNpbmciLCJlZGdlRnJpY3Rpb24iLCJmYWRlIiwiZm9jdXNPblNlbGVjdCIsImZvY3VzT25DaGFuZ2UiLCJpbmZpbml0ZSIsImluaXRpYWxTbGlkZSIsImxhenlMb2FkIiwibW9iaWxlRmlyc3QiLCJwYXVzZU9uSG92ZXIiLCJwYXVzZU9uRm9jdXMiLCJwYXVzZU9uRG90c0hvdmVyIiwicmVzcG9uZFRvIiwicmVzcG9uc2l2ZSIsInJvd3MiLCJydGwiLCJzbGlkZSIsInNsaWRlc1BlclJvdyIsInNsaWRlc1RvU2hvdyIsInNsaWRlc1RvU2Nyb2xsIiwic3BlZWQiLCJzd2lwZSIsInN3aXBlVG9TbGlkZSIsInRvdWNoTW92ZSIsInRvdWNoVGhyZXNob2xkIiwidXNlQ1NTIiwidXNlVHJhbnNmb3JtIiwidmFyaWFibGVXaWR0aCIsInZlcnRpY2FsIiwidmVydGljYWxTd2lwaW5nIiwid2FpdEZvckFuaW1hdGUiLCJ6SW5kZXgiLCJpbml0aWFscyIsImFuaW1hdGluZyIsImRyYWdnaW5nIiwiYXV0b1BsYXlUaW1lciIsImN1cnJlbnREaXJlY3Rpb24iLCJjdXJyZW50TGVmdCIsImN1cnJlbnRTbGlkZSIsImRpcmVjdGlvbiIsIiRkb3RzIiwibGlzdFdpZHRoIiwibGlzdEhlaWdodCIsImxvYWRJbmRleCIsIiRuZXh0QXJyb3ciLCIkcHJldkFycm93Iiwic2Nyb2xsaW5nIiwic2xpZGVDb3VudCIsInNsaWRlV2lkdGgiLCIkc2xpZGVUcmFjayIsIiRzbGlkZXMiLCJzbGlkaW5nIiwic2xpZGVPZmZzZXQiLCJzd2lwZUxlZnQiLCJzd2lwaW5nIiwiJGxpc3QiLCJ0b3VjaE9iamVjdCIsInRyYW5zZm9ybXNFbmFibGVkIiwidW5zbGlja2VkIiwiYWN0aXZlQnJlYWtwb2ludCIsImFuaW1UeXBlIiwiYW5pbVByb3AiLCJicmVha3BvaW50cyIsImJyZWFrcG9pbnRTZXR0aW5ncyIsImNzc1RyYW5zaXRpb25zIiwiZm9jdXNzZWQiLCJpbnRlcnJ1cHRlZCIsImhpZGRlbiIsInBhdXNlZCIsInBvc2l0aW9uUHJvcCIsInJvd0NvdW50Iiwic2hvdWxkQ2xpY2siLCIkc2xpZGVyIiwiJHNsaWRlc0NhY2hlIiwidHJhbnNmb3JtVHlwZSIsInRyYW5zaXRpb25UeXBlIiwidmlzaWJpbGl0eUNoYW5nZSIsIndpbmRvd1dpZHRoIiwid2luZG93VGltZXIiLCJkYXRhIiwib3B0aW9ucyIsIm9yaWdpbmFsU2V0dGluZ3MiLCJkb2N1bWVudCIsIm1vekhpZGRlbiIsIndlYmtpdEhpZGRlbiIsImF1dG9QbGF5IiwicHJveHkiLCJhdXRvUGxheUNsZWFyIiwiYXV0b1BsYXlJdGVyYXRvciIsImNoYW5nZVNsaWRlIiwiY2xpY2tIYW5kbGVyIiwic2VsZWN0SGFuZGxlciIsInNldFBvc2l0aW9uIiwic3dpcGVIYW5kbGVyIiwiZHJhZ0hhbmRsZXIiLCJrZXlIYW5kbGVyIiwiaHRtbEV4cHIiLCJyZWdpc3RlckJyZWFrcG9pbnRzIiwiYWN0aXZhdGVBREEiLCJhZGRTbGlkZSIsInNsaWNrQWRkIiwibWFya3VwIiwiaW5kZXgiLCJhZGRCZWZvcmUiLCJ1bmxvYWQiLCJpbnNlcnRCZWZvcmUiLCJlcSIsImluc2VydEFmdGVyIiwicHJlcGVuZFRvIiwiY2hpbGRyZW4iLCJkZXRhY2giLCJhcHBlbmQiLCJyZWluaXQiLCJhbmltYXRlSGVpZ2h0IiwidGFyZ2V0SGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJhbmltYXRlIiwiYW5pbWF0ZVNsaWRlIiwidGFyZ2V0TGVmdCIsImNhbGxiYWNrIiwiYW5pbVByb3BzIiwibGVmdCIsInRvcCIsImFuaW1TdGFydCIsImR1cmF0aW9uIiwic3RlcCIsIm5vdyIsImNvbXBsZXRlIiwiYXBwbHlUcmFuc2l0aW9uIiwic2V0VGltZW91dCIsImRpc2FibGVUcmFuc2l0aW9uIiwiZ2V0TmF2VGFyZ2V0Iiwibm90IiwidGFyZ2V0Iiwic2xpY2siLCJzbGlkZUhhbmRsZXIiLCJ0cmFuc2l0aW9uIiwic2V0SW50ZXJ2YWwiLCJjbGVhckludGVydmFsIiwic2xpZGVUbyIsImJ1aWxkQXJyb3dzIiwiYWRkQ2xhc3MiLCJyZW1vdmVBdHRyIiwiYWRkIiwiYnVpbGREb3RzIiwiZG90IiwiZ2V0RG90Q291bnQiLCJmaXJzdCIsImJ1aWxkT3V0Iiwid3JhcEFsbCIsInBhcmVudCIsIndyYXAiLCJzZXR1cEluZmluaXRlIiwidXBkYXRlRG90cyIsInNldFNsaWRlQ2xhc3NlcyIsImJ1aWxkUm93cyIsImEiLCJiIiwiYyIsIm5ld1NsaWRlcyIsIm51bU9mU2xpZGVzIiwib3JpZ2luYWxTbGlkZXMiLCJzbGlkZXNQZXJTZWN0aW9uIiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImNyZWF0ZUVsZW1lbnQiLCJyb3ciLCJnZXQiLCJhcHBlbmRDaGlsZCIsImVtcHR5IiwiY2hlY2tSZXNwb25zaXZlIiwiaW5pdGlhbCIsImZvcmNlVXBkYXRlIiwiYnJlYWtwb2ludCIsInRhcmdldEJyZWFrcG9pbnQiLCJyZXNwb25kVG9XaWR0aCIsInRyaWdnZXJCcmVha3BvaW50Iiwic2xpZGVyV2lkdGgiLCJpbm5lcldpZHRoIiwidW5zbGljayIsInJlZnJlc2giLCJldmVudCIsImRvbnRBbmltYXRlIiwiJHRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJpbmRleE9mZnNldCIsInVuZXZlbk9mZnNldCIsInByZXZlbnREZWZhdWx0IiwiY2xvc2VzdCIsIm1lc3NhZ2UiLCJjaGVja05hdmlnYWJsZSIsIm5hdmlnYWJsZXMiLCJwcmV2TmF2aWdhYmxlIiwiZ2V0TmF2aWdhYmxlSW5kZXhlcyIsImNsZWFuVXBFdmVudHMiLCJvZmYiLCJpbnRlcnJ1cHQiLCJ2aXNpYmlsaXR5IiwiY2xlYW5VcFNsaWRlRXZlbnRzIiwib3JpZW50YXRpb25DaGFuZ2UiLCJyZXNpemUiLCJjbGVhblVwUm93cyIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsInN0b3BQcm9wYWdhdGlvbiIsImRlc3Ryb3kiLCJmYWRlU2xpZGUiLCJzbGlkZUluZGV4IiwiZmFkZVNsaWRlT3V0IiwiZmlsdGVyU2xpZGVzIiwic2xpY2tGaWx0ZXIiLCJmaWx0ZXIiLCJmb2N1c0hhbmRsZXIiLCIkc2YiLCJnZXRDdXJyZW50Iiwic2xpY2tDdXJyZW50U2xpZGUiLCJicmVha1BvaW50IiwiY291bnRlciIsInBhZ2VyUXR5IiwiZ2V0TGVmdCIsInZlcnRpY2FsSGVpZ2h0IiwidmVydGljYWxPZmZzZXQiLCJ0YXJnZXRTbGlkZSIsImNvZWYiLCJmbG9vciIsIm9mZnNldExlZnQiLCJvdXRlcldpZHRoIiwiZ2V0T3B0aW9uIiwic2xpY2tHZXRPcHRpb24iLCJvcHRpb24iLCJpbmRleGVzIiwibWF4IiwiZ2V0U2xpY2siLCJnZXRTbGlkZUNvdW50Iiwic2xpZGVzVHJhdmVyc2VkIiwic3dpcGVkU2xpZGUiLCJjZW50ZXJPZmZzZXQiLCJhYnMiLCJnb1RvIiwic2xpY2tHb1RvIiwicGFyc2VJbnQiLCJjcmVhdGlvbiIsImhhc0NsYXNzIiwic2V0UHJvcHMiLCJzdGFydExvYWQiLCJsb2FkU2xpZGVyIiwiaW5pdGlhbGl6ZUV2ZW50cyIsInVwZGF0ZUFycm93cyIsImluaXRBREEiLCJudW1Eb3RHcm91cHMiLCJ0YWJDb250cm9sSW5kZXhlcyIsInZhbCIsInNsaWRlQ29udHJvbEluZGV4IiwiYXJpYUJ1dHRvbkNvbnRyb2wiLCJtYXBwZWRTbGlkZUluZGV4IiwiZW5kIiwiaW5pdEFycm93RXZlbnRzIiwiaW5pdERvdEV2ZW50cyIsImluaXRTbGlkZUV2ZW50cyIsImluaXRVSSIsInNob3ciLCJ0YWdOYW1lIiwia2V5Q29kZSIsImxvYWRSYW5nZSIsImNsb25lUmFuZ2UiLCJyYW5nZVN0YXJ0IiwicmFuZ2VFbmQiLCJsb2FkSW1hZ2VzIiwiaW1hZ2VzU2NvcGUiLCJpbWFnZSIsImltYWdlU291cmNlIiwiaW1hZ2VTcmNTZXQiLCJpbWFnZVNpemVzIiwiaW1hZ2VUb0xvYWQiLCJvbmxvYWQiLCJvbmVycm9yIiwic2xpY2UiLCJwcmV2U2xpZGUiLCJuZXh0U2xpZGUiLCJwcm9ncmVzc2l2ZUxhenlMb2FkIiwibmV4dCIsInNsaWNrTmV4dCIsInBhdXNlIiwic2xpY2tQYXVzZSIsInBsYXkiLCJzbGlja1BsYXkiLCJwb3N0U2xpZGUiLCIkY3VycmVudFNsaWRlIiwiZm9jdXMiLCJwcmV2Iiwic2xpY2tQcmV2IiwidHJ5Q291bnQiLCIkaW1nc1RvTG9hZCIsImluaXRpYWxpemluZyIsImxhc3RWaXNpYmxlSW5kZXgiLCJjdXJyZW50QnJlYWtwb2ludCIsInJlc3BvbnNpdmVTZXR0aW5ncyIsInR5cGUiLCJzcGxpY2UiLCJzb3J0IiwiY2xlYXJUaW1lb3V0Iiwid2luZG93RGVsYXkiLCJyZW1vdmVTbGlkZSIsInNsaWNrUmVtb3ZlIiwicmVtb3ZlQmVmb3JlIiwicmVtb3ZlQWxsIiwic2V0Q1NTIiwicG9zaXRpb24iLCJwb3NpdGlvblByb3BzIiwic2V0RGltZW5zaW9ucyIsInBhZGRpbmciLCJvZmZzZXQiLCJzZXRGYWRlIiwicmlnaHQiLCJzZXRIZWlnaHQiLCJzZXRPcHRpb24iLCJzbGlja1NldE9wdGlvbiIsIml0ZW0iLCJ2YWx1ZSIsImFyZ3VtZW50cyIsIm9wdCIsImJvZHlTdHlsZSIsImJvZHkiLCJzdHlsZSIsIldlYmtpdFRyYW5zaXRpb24iLCJ1bmRlZmluZWQiLCJNb3pUcmFuc2l0aW9uIiwibXNUcmFuc2l0aW9uIiwiT1RyYW5zZm9ybSIsInBlcnNwZWN0aXZlUHJvcGVydHkiLCJ3ZWJraXRQZXJzcGVjdGl2ZSIsIk1velRyYW5zZm9ybSIsIk1velBlcnNwZWN0aXZlIiwid2Via2l0VHJhbnNmb3JtIiwibXNUcmFuc2Zvcm0iLCJ0cmFuc2Zvcm0iLCJhbGxTbGlkZXMiLCJyZW1haW5kZXIiLCJldmVuQ29lZiIsImluZmluaXRlQ291bnQiLCJjbG9uZSIsInRvZ2dsZSIsInRhcmdldEVsZW1lbnQiLCJwYXJlbnRzIiwic3luYyIsImFuaW1TbGlkZSIsIm9sZFNsaWRlIiwic2xpZGVMZWZ0IiwibmF2VGFyZ2V0IiwiaGlkZSIsInN3aXBlRGlyZWN0aW9uIiwieERpc3QiLCJ5RGlzdCIsInN3aXBlQW5nbGUiLCJzdGFydFgiLCJjdXJYIiwic3RhcnRZIiwiY3VyWSIsImF0YW4yIiwicm91bmQiLCJQSSIsInN3aXBlRW5kIiwic3dpcGVMZW5ndGgiLCJlZGdlSGl0IiwibWluU3dpcGUiLCJmaW5nZXJDb3VudCIsIm9yaWdpbmFsRXZlbnQiLCJ0b3VjaGVzIiwic3dpcGVTdGFydCIsInN3aXBlTW92ZSIsImVkZ2VXYXNIaXQiLCJjdXJMZWZ0IiwicG9zaXRpb25PZmZzZXQiLCJ2ZXJ0aWNhbFN3aXBlTGVuZ3RoIiwicGFnZVgiLCJjbGllbnRYIiwicGFnZVkiLCJjbGllbnRZIiwic3FydCIsInBvdyIsInVuZmlsdGVyU2xpZGVzIiwic2xpY2tVbmZpbHRlciIsImZyb21CcmVha3BvaW50IiwiYXJncyIsInJldCIsImFwcGx5Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7O0FBQUEsQ0FBQSxVQUFBQSxDQUFBLEVBQUE7QUFDQUEsRUFBQUEsQ0FBQSxDQUFBQyxFQUFBLENBQUFDLElBQUEsR0FBQSxVQUFBQyxJQUFBLEVBQUE7QUFDQTtBQUNBLFFBQUFDLE1BQUEsR0FBQUosQ0FBQSxDQUFBSyxNQUFBLENBQUEsRUFBQSxFQUFBO0FBQ0FDLE1BQUFBLElBQUEsRUFBQTtBQURBLEtBQUEsRUFFQUgsSUFGQSxDQUFBLENBRkEsQ0FLQTs7QUFDQSxhQUFBSSxJQUFBLENBQUFDLEdBQUEsRUFBQTtBQUNBLFVBQUFDLElBQUEsR0FBQVQsQ0FBQSxDQUFBUSxHQUFBLENBQUE7QUFDQSxVQUFBRSxTQUFBLEdBQUFELElBQUEsQ0FBQUUsSUFBQSxDQUFBLFVBQUEsQ0FBQTtBQUNBLFVBQUFDLFFBQUEsR0FBQUgsSUFBQSxDQUFBRSxJQUFBLENBQUEsYUFBQSxDQUFBO0FBQ0EsVUFBQUUsVUFBQSxHQUFBSixJQUFBLENBQUFFLElBQUEsQ0FBQSxZQUFBLENBQUE7QUFDQUQsTUFBQUEsU0FBQSxDQUFBSSxLQUFBLENBQUEsWUFBQTtBQUNBTCxRQUFBQSxJQUFBLENBQUFNLFdBQUEsQ0FBQSxhQUFBLEVBREEsQ0FFQTtBQUNBLE9BSEE7QUFJQUYsTUFBQUEsVUFBQSxDQUFBQyxLQUFBLENBQUEsWUFBQTtBQUNBTCxRQUFBQSxJQUFBLENBQUFPLFdBQUEs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Q0FBQTtBQUNBLGlCQUFBO0FBREEsT0FBQTtBQUdBQyxNQUFBQSxRQUFBLENBQUFDLE1BQUEsQ0FBQXhCLEtBQUEsRUFBQSxHQUFBLEVBQUE7QUFBQXlCLFFBQUFBLE9BQUEsRUFBQTtBQUFBLE9BQUEsRUFBQTtBQUNBQyxRQUFBQSxLQUFBLEVBQUEsRUFEQTtBQUVBRCxRQUFBQSxPQUFBLEVBQUEsQ0FGQTtBQUVBRSxRQUFBQSxJQUFBLEVBQUFDLE1BQUEsQ0FBQUMsT0FGQTtBQUVBQyxRQUFBQSxVQUFBLEVBQUEsc0JBQUE7QUFDQTlCLFVBQUFBLEtBQUEsQ0FBQStCLE1BQUE7QUFDQTtBQUpBLE9BQUE7QUFNQTtBQUNBLEdBcEZBO0FBcUZBLENBdEZBLEVBc0ZBckMsTUF0RkE7O0FDQUE7O0FBQUEsQ0FBQSxVQUFBNkMsQ0FBQSxFQUFBQyxDQUFBLEVBQUE7QUFBQUQsRUFBQUEsQ0FBQSxDQUFBLFlBQUE7QUFBQTs7QUFBQSxhQUFBRSxDQUFBLENBQUFDLENBQUEsRUFBQUMsQ0FBQSxFQUFBO0FBQUEsYUFBQSxRQUFBRCxDQUFBLElBQUEsUUFBQUMsQ0FBQSxJQUFBRCxDQUFBLENBQUFFLFdBQUEsT0FBQUQsQ0FBQSxDQUFBQyxXQUFBLEVBQUE7QUFBQTs7QUFBQSxhQUFBQyxDQUFBLENBQUFILENBQUEsRUFBQUMsQ0FBQSxFQUFBO0FBQUEsVUFBQUcsQ0FBQTtBQUFBLFVBQUFDLENBQUE7QUFBQSxVQUFBQyxDQUFBLEdBQUFOLENBQUEsQ0FBQU8sTUFBQTtBQUFBLFVBQUEsQ0FBQUQsQ0FBQSxJQUFBLENBQUFMLENBQUEsRUFBQSxPQUFBLENBQUEsQ0FBQTs7QUFBQSxXQUFBRyxDQUFBLEdBQUFILENBQUEsQ0FBQUMsV0FBQSxFQUFBLEVBQUFHLENBQUEsR0FBQSxDQUFBLEVBQUFBLENBQUEsR0FBQUMsQ0FBQSxFQUFBLEVBQUFELENBQUE7QUFBQSxZQUFBRCxDQUFBLEtBQUFKLENBQUEsQ0FBQUssQ0FBQSxDQUFBLENBQUFILFdBQUEsRUFBQSxFQUFBLE9BQUEsQ0FBQSxDQUFBO0FBQUE7O0FBQUEsYUFBQSxDQUFBLENBQUE7QUFBQTs7QUFBQSxhQUFBTSxDQUFBLENBQUFSLENBQUEsRUFBQTtBQUFBLFdBQUEsSUFBQUMsQ0FBQSxJQUFBRCxDQUFBO0FBQUFTLFFBQUFBLENBQUEsQ0FBQUMsSUFBQSxDQUFBVixDQUFBLEVBQUFDLENBQUEsTUFBQUQsQ0FBQSxDQUFBQyxDQUFBLENBQUEsR0FBQSxJQUFBVSxNQUFBLENBQUFYLENBQUEsQ0FBQUMsQ0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFBO0FBQUE7QUFBQTs7QUFBQSxhQUFBVyxDQUFBLENBQUFaLENBQUEsRUFBQTtBQUFBLGFBQUEsQ0FBQUEsQ0FBQSxJQUFBLEVBQUEsRUFBQWEsTUFBQSxDQUFBLENBQUEsRUFBQSxHQUFBLENBQUE7QUFBQTs7QUFBQSxhQUFBQyxDQUFBLENBQUFkLENBQUEsRUFBQUMsQ0FBQSxFQUFBO0FBQUEsV0FBQWMsRUFBQSxHQUFBSCxDQUFBLENBQUFaLENBQUEsQ0FBQSxFQUFBLEtBQUFnQixNQUFBLEdBQUEsRUFBQSxFQUFBLEtBQUFDLGFBQUEsR0FBQWhCLENBQUEsSUFBQSxHQUFBO0FBQUE7O0FBQUEsUUFBQWlCLENBQUEsR0FBQTtBQUFBQyxNQUFBQSxpQkFBQSxFQUFBO0FBQUFDLFFBQUFBLE1BQUEsRUFBQTtBQUFBQyxVQUFBQSxNQUFBLEVBQUEseUJBQUE7QUFBQUMsVUFBQUEsVUFBQSxFQUFBLGlDQUFBO0FBQUFDLFVBQUFBLEdBQUEsRUFBQSw0UkFBQTtBQUFBQyxVQUFBQSxLQUFBLEVBQUEsZ0ZBQUE7QUFBQUMsVUFBQUEsSUFBQSxFQUFBLDRHQUFBO0FBQUFDLFVBQUFBLFFBQUEsRUFBQSwrcUJBQUE7QUFBQUMsVUFBQUEsT0FBQSxFQUFBLDh5S0FBQTtBQUFBQyxVQUFBQSxFQUFBLEVBQUEsbWhCQUFBO0FBQUFDLFVBQUFBLElBQUEsRUFBQSw0SEFBQTtBQUFBQyxVQUFBQSxJQUFBLEVBQUEsOEJBQUE7QUFBQUMsVUFBQUEsVUFBQSxFQUFBLGtCQUFBO0FBQUFDLFVBQUFBLFFBQUEsRUFBQSwrR0FBQTtBQUFBQyxVQUFBQSxJQUFBLEVBQUEsaUJBQUE7QUFBQUMsVUFBQUEsS0FBQSxFQUFBLDJHQUFBO0FBQUFDLFVBQUFBLE9BQUEsRUFBQSx3YUFBQTtBQUFBQyxVQUFBQSxHQUFBLEVBQUEsbUhBQUE7QUFBQUMsVUFBQUEsSUFBQSxFQUFBLDRPQUFBO0FBQUFDLFVBQUFBLE9BQUEsRUFBQSxxQ0FBQTtBQUFBQyxVQUFBQSxTQUFBLEVBQUEscUhBQUE7QUFBQUMsVUFBQUEsUUFBQSxFQUFBLGlFQUFBO0FBQUFDLFVBQUFBLE9BQUEsRUFBQSxTQUFBO0FBQUFDLFVBQUFBLFFBQUEsRUFBQSx1QkFBQTtBQUFBQyxVQUFBQSxJQUFBLEVBQUEsTUFBQTtBQUFBQyxVQUFBQSxHQUFBLEVBQUEsS0FBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUE7QUFBQSxTQUFBO0FBQUFDLFFBQUFBLE9BQUEsRUFBQTtBQUFBQyxVQUFBQSxJQUFBLEVBQUEsbUJBQUE7QUFBQUMsVUFBQUEsV0FBQSxFQUFBLDhCQUFBO0FBQUFDLFVBQUFBLFlBQUEsRUFBQSxrQkFBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEsc3ZEQUFBO0FBQUFDLFVBQUFBLE1BQUEsRUFBQSx1TkFBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEsMkNBQUE7QUFBQUMsVUFBQUEsUUFBQSxFQUFBLDRGQUFBO0FBQUFDLFVBQUFBLFVBQUEsRUFBQSxzYkFBQTtBQUFBQyxVQUFBQSxnQkFBQSxFQUFBLHFCQUFBO0FBQUFDLFVBQUFBLFNBQUEsRUFBQSxrRkFBQTtBQUFBQyxVQUFBQSxjQUFBLEVBQUEsa0dBQUE7QUFBQUMsVUFBQUEsVUFBQSxFQUFBLHNHQUFBO0FBQUFDLFVBQUFBLFVBQUEsRUFBQSxrT0FBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEseUdBQUE7QUFBQUMsVUFBQUEsUUFBQSxFQUFBLDhFQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQSxvREFBQTtBQUFBQyxVQUFBQSxlQUFBLEVBQUEsK1pBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLDJRQUFBO0FBQUFDLFVBQUFBLFVBQUEsRUFBQSx1REFBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUEsZ2ZBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLDREQUFBO0FBQUFDLFVBQUFBLFlBQUEsRUFBQSwyR0FBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEsa0RBQUE7QUFBQUMsVUFBQUEsU0FBQSxFQUFBLFNBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLDZDQUFBO0FBQUFDLFVBQUFBLFdBQUEsRUFBQSxpREFBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEsMEVBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLGlMQUFBO0FBQUFDLFVBQUFBLFdBQUEsRUFBQSxvRUFBQTtBQUFBQyxVQUFBQSxnQkFBQSxFQUFBLFlBQUE7QUFBQUMsVUFBQUEsVUFBQSxFQUFBLDRSQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQSxzRkFBQTtBQUFBQyxVQUFBQSxVQUFBLEVBQUEsZ0ZBQUE7QUFBQUMsVUFBQUEsVUFBQSxFQUFBLHlLQUFBO0FBQUFDLFVBQUFBLFNBQUEsRUFBQSx5UUFBQTtBQUFBQyxVQUFBQSxTQUFBLEVBQUEsNklBQUE7QUFBQUMsVUFBQUEsVUFBQSxFQUFBLHdFQUFBO0FBQUFDLFVBQUFBLGNBQUEsRUFBQSx3REFBQTtBQUFBQyxVQUFBQSxTQUFBLEVBQUEsa0JBQUE7QUFBQUMsVUFBQUEsUUFBQSxFQUFBLHNLQUFBO0FBQUFDLFVBQUFBLFlBQUEsRUFBQSw4SEFBQTtBQUFBQyxVQUFBQSxTQUFBLEVBQUEsbUJBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLGdCQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQSxnQ0FBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUEsa0NBQUE7QUFBQUMsVUFBQUEsVUFBQSxFQUFBLGdEQUFBO0FBQUFDLFVBQUFBLGNBQUEsRUFBQSxpQ0FBQTtBQUFBQyxVQUFBQSxVQUFBLEVBQUEsa0JBQUE7QUFBQUMsVUFBQUEsVUFBQSxFQUFBLHVEQUFBO0FBQUFDLFVBQUFBLFdBQUEsRUFBQSx5RUFBQTtBQUFBQyxVQUFBQSxXQUFBLEVBQUEseW1CQUFBO0FBQUFDLFVBQUFBLGlCQUFBLEVBQUEsOEJBQUE7QUFBQUMsVUFBQUEsY0FBQSxFQUFBLDBHQUFBO0FBQUFDLFVBQUFBLGVBQUEsRUFBQSw0R0FBQTtBQUFBQyxVQUFBQSxXQUFBLEVBQUEsZ0lBQUE7QUFBQUMsVUFBQUEsY0FBQSxFQUFBLG9JQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQSxtQkFBQTtBQUFBQyxVQUFBQSxjQUFBLEVBQUEsd0VBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLGlFQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQSxrRkFBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEsMlhBQUE7QUFBQUMsVUFBQUEsV0FBQSxFQUFBLHdHQUFBO0FBQUFDLFVBQUFBLGNBQUEsRUFBQSwwVUFBQTtBQUFBQyxVQUFBQSxRQUFBLEVBQUEsOEJBQUE7QUFBQUMsVUFBQUEsaUJBQUEsRUFBQSwwVUFBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEsNElBQUE7QUFBQUMsVUFBQUEsU0FBQSxFQUFBLDJIQUFBO0FBQUFDLFVBQUFBLFNBQUEsRUFBQSx3QkFBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEsNkRBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLCtHQUFBO0FBQUFDLFVBQUFBLGNBQUEsRUFBQSxtQ0FBQTtBQUFBQyxVQUFBQSxjQUFBLEVBQUEscUNBQUE7QUFBQUMsVUFBQUEsY0FBQSxFQUFBLHVjQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQSxpUkFBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUEsK1FBQUE7QUFBQUMsVUFBQUEsU0FBQSxFQUFBLDhCQUFBO0FBQUFDLFVBQUFBLFlBQUEsRUFBQSxpREFBQTtBQUFBQyxVQUFBQSxjQUFBLEVBQUEsd0RBQUE7QUFBQUMsVUFBQUEsZ0JBQUEsRUFBQSwwQ0FBQTtBQUFBQyxVQUFBQSxjQUFBLEVBQUEsMEVBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLGlCQUFBO0FBQUFDLFVBQUFBLFlBQUEsRUFBQSxpQ0FBQTtBQUFBQyxVQUFBQSxnQkFBQSxFQUFBLCtCQUFBO0FBQUFDLFVBQUFBLFVBQUEsRUFBQSxnQkFBQTtBQUFBQyxVQUFBQSxTQUFBLEVBQUEsb0NBQUE7QUFBQUMsVUFBQUEsV0FBQSxFQUFBLHFCQUFBO0FBQUFDLFVBQUFBLFNBQUEsRUFBQSx1T0FBQTtBQUFBQyxVQUFBQSxVQUFBLEVBQUEsdWZBQUE7QUFBQUMsVUFBQUEsU0FBQSxFQUFBLG9CQUFBO0FBQUFDLFVBQUFBLFVBQUEsRUFBQSx5VkFBQTtBQUFBQyxVQUFBQSxlQUFBLEVBQUEsMEdBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLCtDQUFBO0FBQUFDLFVBQUFBLFVBQUEsRUFBQSxzSEFBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEsYUFBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEsZ0tBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLHk0QkFBQTtBQUFBQyxVQUFBQSxVQUFBLEVBQUEsdVRBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLFdBQUE7QUFBQUMsVUFBQUEsZUFBQSxFQUFBLGdDQUFBO0FBQUFDLFVBQUFBLFdBQUEsRUFBQSxtR0FBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUEscUZBQUE7QUFBQUMsVUFBQUEsVUFBQSxFQUFBLGdEQUFBO0FBQUFDLFVBQUFBLFNBQUEsRUFBQSxpRUFBQTtBQUFBQyxVQUFBQSxXQUFBLEVBQUEsNFFBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLHNGQUFBO0FBQUFDLFVBQUFBLFlBQUEsRUFBQSx5UkFBQTtBQUFBQyxVQUFBQSxjQUFBLEVBQUEsa0ZBQUE7QUFBQUMsVUFBQUEsUUFBQSxFQUFBLCtCQUFBO0FBQUFDLFVBQUFBLFlBQUEsRUFBQSw4QkFBQTtBQUFBQyxVQUFBQSxVQUFBLEVBQUEsZ0dBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLDhJQUFBO0FBQUFDLFVBQUFBLGNBQUEsRUFBQSxrQkFBQTtBQUFBQyxVQUFBQSxnQkFBQSxFQUFBLFlBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLGlCQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQSxxQkFBQTtBQUFBQyxVQUFBQSxJQUFBLEVBQUEsbUJBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLFFBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBO0FBQUEsU0FBQTtBQUFBQyxRQUFBQSxHQUFBLEVBQUE7QUFBQUMsVUFBQUEsU0FBQSxFQUFBLFNBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLHFDQUFBO0FBQUFDLFVBQUFBLE1BQUEsRUFBQSx3REFBQTtBQUFBQyxVQUFBQSxTQUFBLEVBQUEsdURBQUE7QUFBQUMsVUFBQUEsZUFBQSxFQUFBLGdHQUFBO0FBQUFDLFVBQUFBLGNBQUEsRUFBQSxnSEFBQTtBQUFBQyxVQUFBQSxHQUFBLEVBQUEsa0RBQUE7QUFBQUMsVUFBQUEsT0FBQSxFQUFBLE9BQUE7QUFBQUMsVUFBQUEsT0FBQSxFQUFBLE9BQUE7QUFBQUMsVUFBQUEsTUFBQSxFQUFBLDZCQUFBO0FBQUFDLFVBQUFBLEtBQUEsRUFBQSxhQUFBO0FBQUFDLFVBQUFBLE1BQUEsRUFBQSxZQUFBO0FBQUFDLFVBQUFBLE1BQUEsRUFBQTtBQUFBLFNBQUE7QUFBQUMsUUFBQUEsR0FBQSxFQUFBO0FBQUFDLFVBQUFBLE1BQUEsRUFBQSxvREFBQTtBQUFBQyxVQUFBQSxNQUFBLEVBQUEsY0FBQTtBQUFBQyxVQUFBQSxLQUFBLEVBQUEsMEVBQUE7QUFBQUMsVUFBQUEsT0FBQSxFQUFBLFNBQUE7QUFBQUMsVUFBQUEsSUFBQSxFQUFBLDRCQUFBO0FBQUFDLFVBQUFBLEVBQUEsRUFBQSxxQkFBQTtBQUFBQyxVQUFBQSxPQUFBLEVBQUEsc0VBQUE7QUFBQUMsVUFBQUEsSUFBQSxFQUFBLE1BQUE7QUFBQUMsVUFBQUEsUUFBQSxFQUFBLFVBQUE7QUFBQUMsVUFBQUEsTUFBQSxFQUFBLFFBQUE7QUFBQUMsVUFBQUEsTUFBQSxFQUFBLHFEQUFBO0FBQUFDLFVBQUFBLFNBQUEsRUFBQSxtQkFBQTtBQUFBQyxVQUFBQSxXQUFBLEVBQUEsYUFBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUEsY0FBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUEsY0FBQTtBQUFBQyxVQUFBQSxNQUFBLEVBQUEsUUFBQTtBQUFBQyxVQUFBQSxPQUFBLEVBQUEsZUFBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUEsT0FBQTtBQUFBQyxVQUFBQSxRQUFBLEVBQUEsWUFBQTtBQUFBQyxVQUFBQSxjQUFBLEVBQUEscUlBQUE7QUFBQUMsVUFBQUEsUUFBQSxFQUFBO0FBQUEsU0FBQTtBQUFBQyxRQUFBQSxLQUFBLEVBQUE7QUFBQUMsVUFBQUEsTUFBQSxFQUFBLGNBQUE7QUFBQUMsVUFBQUEsS0FBQSxFQUFBLGFBQUE7QUFBQUMsVUFBQUEsT0FBQSxFQUFBLGVBQUE7QUFBQUMsVUFBQUEsUUFBQSxFQUFBLGdCQUFBO0FBQUE5SixVQUFBQSxJQUFBLEVBQUEsdUJBQUE7QUFBQTFCLFVBQUFBLE1BQUEsRUFBQSx5QkFBQTtBQUFBeUwsVUFBQUEsSUFBQSxFQUFBLHVCQUFBO0FBQUEzSixVQUFBQSxNQUFBLEVBQUEsY0FBQTtBQUFBaUksVUFBQUEsTUFBQSxFQUFBLENBQUEsY0FBQSxFQUFBLGFBQUEsRUFBQSxZQUFBLENBQUE7QUFBQTJCLFVBQUFBLEtBQUEsRUFBQSxDQUFBLGFBQUEsQ0FBQTtBQUFBMUIsVUFBQUEsTUFBQSxFQUFBLGNBQUE7QUFBQUssVUFBQUEsT0FBQSxFQUFBLENBQUEsZUFBQSxFQUFBLGFBQUEsQ0FBQTtBQUFBc0IsVUFBQUEsTUFBQSxFQUFBLGNBQUE7QUFBQXhCLFVBQUFBLElBQUEsRUFBQSxZQUFBO0FBQUFDLFVBQUFBLEVBQUEsRUFBQSxDQUFBLGlCQUFBLEVBQUEsZ0JBQUEsRUFBQSxhQUFBLEVBQUEsNEJBQUEsQ0FBQTtBQUFBYSxVQUFBQSxRQUFBLEVBQUEsZ0JBQUE7QUFBQVcsVUFBQUEsWUFBQSxFQUFBLG9CQUFBO0FBQUEzQixVQUFBQSxLQUFBLEVBQUEsQ0FBQSxZQUFBLEVBQUEsa0JBQUEsRUFBQSxlQUFBLENBQUE7QUFBQSx3QkFBQSxrQkFBQTtBQUFBLHdCQUFBLGVBQUE7QUFBQVMsVUFBQUEsU0FBQSxFQUFBLENBQUEsWUFBQSxFQUFBLG1CQUFBLENBQUE7QUFBQW1CLFVBQUFBLFVBQUEsRUFBQSxrQkFBQTtBQUFBQyxVQUFBQSxjQUFBLEVBQUEsc0JBQUE7QUFBQW5CLFVBQUFBLFdBQUEsRUFBQSxtQkFBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUEsb0JBQUE7QUFBQW1CLFVBQUFBLGNBQUEsRUFBQSxzQkFBQTtBQUFBQyxVQUFBQSxJQUFBLEVBQUEsWUFBQTtBQUFBdkIsVUFBQUEsTUFBQSxFQUFBLENBQUEsZUFBQSxFQUFBLGNBQUEsQ0FBQTtBQUFBUCxVQUFBQSxPQUFBLEVBQUEsZUFBQTtBQUFBK0IsVUFBQUEsS0FBQSxFQUFBLGFBQUE7QUFBQUMsVUFBQUEsTUFBQSxFQUFBLGlCQUFBO0FBQUFmLFVBQUFBLFFBQUEsRUFBQSxnQkFBQTtBQUFBZ0IsVUFBQUEsS0FBQSxFQUFBLGFBQUE7QUFBQUMsVUFBQUEsT0FBQSxFQUFBLGVBQUE7QUFBQUMsVUFBQUEsTUFBQSxFQUFBLGNBQUE7QUFBQUMsVUFBQUEsTUFBQSxFQUFBLGNBQUE7QUFBQS9DLFVBQUFBLEdBQUEsRUFBQSwwQkFBQTtBQUFBZ0QsVUFBQUEsT0FBQSxFQUFBLGVBQUE7QUFBQXRNLFVBQUFBLFVBQUEsRUFBQSxDQUFBLHdCQUFBLEVBQUEsMkJBQUEsRUFBQSxlQUFBLENBQUE7QUFBQXVNLFVBQUFBLElBQUEsRUFBQSxZQUFBO0FBQUFDLFVBQUFBLElBQUEsRUFBQSxZQUFBO0FBQUEsOEJBQUEsQ0FBQSx3QkFBQSxFQUFBLHFCQUFBLENBQUE7QUFBQSwyQkFBQSxxQkFBQTtBQUFBLHdCQUFBLGtCQUFBO0FBQUEsd0JBQUEsa0JBQUE7QUFBQUMsVUFBQUEsT0FBQSxFQUFBLENBQUEsaUJBQUEsRUFBQSxlQUFBLENBQUE7QUFBQS9DLFVBQUFBLEtBQUEsRUFBQSxDQUFBLGFBQUEsRUFBQSxjQUFBO0FBQUEsU0FBQTtBQUFBZ0QsUUFBQUEsS0FBQSxFQUFBO0FBQUFDLFVBQUFBLEdBQUEsRUFBQSxpUkFBQTtBQUFBQyxVQUFBQSxTQUFBLEVBQUEsNkRBQUE7QUFBQUMsVUFBQUEsV0FBQSxFQUFBLFdBQUE7QUFBQUMsVUFBQUEsRUFBQSxFQUFBLGVBQUE7QUFBQUMsVUFBQUEsTUFBQSxFQUFBLHVCQUFBO0FBQUFDLFVBQUFBLE9BQUEsRUFBQSw4RUFBQTtBQUFBQyxVQUFBQSxLQUFBLEVBQUE7QUFBQTtBQUFBLE9BQUE7QUFBQUMsTUFBQUEsb0JBQUEsRUFBQTtBQUFBQyxRQUFBQSxXQUFBLEVBQUEsMFRBQUE7QUFBQUMsUUFBQUEsWUFBQSxFQUFBLHlrREFBQTtBQUFBQyxRQUFBQSxhQUFBLEVBQUE7QUFBQTtBQUFBLEtBQUE7QUFBQSxRQUFBQyxDQUFBO0FBQUEsUUFBQW5PLENBQUEsR0FBQW9PLE1BQUEsQ0FBQUMsU0FBQSxDQUFBQyxjQUFBO0FBQUEsV0FBQTdOLENBQUEsQ0FBQThOLGNBQUEsR0FBQSxjQUFBLEVBQUE5TixDQUFBLENBQUErTixlQUFBLEdBQUEsZUFBQSxFQUFBL04sQ0FBQSxDQUFBZ08sZUFBQSxHQUFBLGVBQUEsRUFBQU4sQ0FBQSxHQUFBLGFBQUFPLEtBQUEsR0FBQUEsS0FBQSxDQUFBQyxPQUFBLEdBQUEsVUFBQXBQLENBQUEsRUFBQTtBQUFBLGFBQUEscUJBQUE2TyxNQUFBLENBQUFDLFNBQUEsQ0FBQU8sUUFBQSxDQUFBM08sSUFBQSxDQUFBVixDQUFBLENBQUE7QUFBQSxLQUFBLEVBQUEsWUFBQTtBQUFBLFVBQUFBLENBQUE7QUFBQSxVQUFBQyxDQUFBO0FBQUEsVUFBQUcsQ0FBQTtBQUFBLFVBQUFDLENBQUE7QUFBQSxVQUFBQyxDQUFBO0FBQUEsVUFBQWdQLENBQUE7QUFBQSxVQUFBQyxDQUFBLEdBQUFyTyxDQUFBLENBQUFDLGlCQUFBOztBQUFBLFdBQUFuQixDQUFBLElBQUF1UCxDQUFBLENBQUE5QyxLQUFBO0FBQUEsWUFBQWhNLENBQUEsQ0FBQUMsSUFBQSxDQUFBNk8sQ0FBQSxDQUFBOUMsS0FBQSxFQUFBek0sQ0FBQSxDQUFBLEVBQUE7QUFBQSxlQUFBQyxDQUFBLEdBQUFzUCxDQUFBLENBQUE5QyxLQUFBLENBQUF6TSxDQUFBLENBQUEsRUFBQTRPLENBQUEsQ0FBQTNPLENBQUEsQ0FBQSxLQUFBQSxDQUFBLEdBQUEsQ0FBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQUssQ0FBQSxHQUFBTCxDQUFBLENBQUFNLE1BQUEsRUFBQUYsQ0FBQSxHQUFBLENBQUEsRUFBQUEsQ0FBQSxHQUFBQyxDQUFBLEVBQUEsRUFBQUQsQ0FBQTtBQUFBRCxZQUFBQSxDQUFBLEdBQUFILENBQUEsQ0FBQUksQ0FBQSxDQUFBLEVBQUFpUCxDQUFBLEdBQUFsUCxDQUFBLENBQUFvUCxPQUFBLENBQUEsT0FBQSxDQUFBLEVBQUEsS0FBQUYsQ0FBQSxLQUFBbFAsQ0FBQSxHQUFBQSxDQUFBLENBQUFxUCxTQUFBLENBQUEsQ0FBQSxFQUFBSCxDQUFBLElBQUEsZUFBQSxHQUFBbFAsQ0FBQSxDQUFBcVAsU0FBQSxDQUFBSCxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQXJQLENBQUEsQ0FBQUksQ0FBQSxDQUFBLEdBQUEsSUFBQU0sTUFBQSxDQUFBUCxDQUFBLEVBQUEsR0FBQSxDQUFBO0FBQUE7O0FBQUFtUCxVQUFBQSxDQUFBLENBQUE5QyxLQUFBLENBQUF6TSxDQUFBLElBQUFDLENBQUE7QUFBQTtBQUFBOztBQUFBTyxNQUFBQSxDQUFBLENBQUErTyxDQUFBLENBQUFsRixHQUFBLENBQUEsRUFBQTdKLENBQUEsQ0FBQStPLENBQUEsQ0FBQW5PLE1BQUEsQ0FBQSxFQUFBWixDQUFBLENBQUErTyxDQUFBLENBQUF6TSxPQUFBLENBQUEsRUFBQXRDLENBQUEsQ0FBQStPLENBQUEsQ0FBQXBFLEdBQUEsQ0FBQSxFQUFBM0ssQ0FBQSxDQUFBK08sQ0FBQSxDQUFBdkIsS0FBQSxDQUFBLEVBQUF1QixDQUFBLENBQUFHLElBQUEsR0FBQTtBQUFBL0UsUUFBQUEsY0FBQSxFQUFBNEUsQ0FBQSxDQUFBbEYsR0FBQSxDQUFBTSxjQUFBO0FBQUFELFFBQUFBLGVBQUEsRUFBQTZFLENBQUEsQ0FBQWxGLEdBQUEsQ0FBQUs7QUFBQSxPQUFBO0FBQUEsS0FBQSxFQUFBLEVBQUF4SixDQUFBLENBQUF5TyxTQUFBLEdBQUEsVUFBQTNQLENBQUEsRUFBQUMsQ0FBQSxFQUFBO0FBQUEsV0FBQSxJQUFBRyxDQUFBLElBQUFKLENBQUE7QUFBQSxZQUFBUyxDQUFBLENBQUFDLElBQUEsQ0FBQVYsQ0FBQSxFQUFBSSxDQUFBLEtBQUFKLENBQUEsQ0FBQUksQ0FBQSxDQUFBLENBQUF3UCxJQUFBLENBQUEzUCxDQUFBLENBQUEsRUFBQSxPQUFBRyxDQUFBO0FBQUE7O0FBQUEsYUFBQSxJQUFBO0FBQUEsS0FBQSxFQUFBYyxDQUFBLENBQUEyTyxXQUFBLEdBQUEsVUFBQTdQLENBQUEsRUFBQUMsQ0FBQSxFQUFBO0FBQUEsVUFBQUcsQ0FBQSxHQUFBLEVBQUE7O0FBQUEsV0FBQSxJQUFBQyxDQUFBLElBQUFMLENBQUE7QUFBQVMsUUFBQUEsQ0FBQSxDQUFBQyxJQUFBLENBQUFWLENBQUEsRUFBQUssQ0FBQSxLQUFBTCxDQUFBLENBQUFLLENBQUEsQ0FBQSxDQUFBdVAsSUFBQSxDQUFBM1AsQ0FBQSxDQUFBLElBQUFHLENBQUEsQ0FBQWhDLElBQUEsQ0FBQWlDLENBQUEsQ0FBQTtBQUFBOztBQUFBLGFBQUFELENBQUE7QUFBQSxLQUFBLEVBQUFjLENBQUEsQ0FBQTRPLGFBQUEsR0FBQSxVQUFBOVAsQ0FBQSxFQUFBQyxDQUFBLEVBQUE7QUFBQSxVQUFBRyxDQUFBO0FBQUEsVUFBQUMsQ0FBQTtBQUFBLFVBQUFDLENBQUE7QUFBQSxVQUFBZ1AsQ0FBQTtBQUFBLFVBQUFDLENBQUEsR0FBQXJPLENBQUEsQ0FBQUMsaUJBQUEsQ0FBQXNMLEtBQUE7QUFBQSxVQUFBaE0sQ0FBQSxDQUFBQyxJQUFBLENBQUE2TyxDQUFBLEVBQUF2UCxDQUFBLENBQUEsRUFBQSxLQUFBSSxDQUFBLEdBQUFtUCxDQUFBLENBQUF2UCxDQUFBLENBQUEsRUFBQU0sQ0FBQSxHQUFBRixDQUFBLENBQUFHLE1BQUEsRUFBQUYsQ0FBQSxHQUFBLENBQUEsRUFBQUEsQ0FBQSxHQUFBQyxDQUFBLEVBQUEsRUFBQUQsQ0FBQTtBQUFBLFlBQUFpUCxDQUFBLEdBQUFsUCxDQUFBLENBQUFDLENBQUEsQ0FBQSxDQUFBMFAsSUFBQSxDQUFBOVAsQ0FBQSxDQUFBLEVBQUEsU0FBQXFQLENBQUEsRUFBQSxPQUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUE7QUFBQSxhQUFBLElBQUE7QUFBQSxLQUFBLEVBQUFwTyxDQUFBLENBQUE4TyxVQUFBLEdBQUEsVUFBQWhRLENBQUEsRUFBQUMsQ0FBQSxFQUFBO0FBQUEsVUFBQUcsQ0FBQSxHQUFBYyxDQUFBLENBQUE0TyxhQUFBLENBQUE5UCxDQUFBLEVBQUFDLENBQUEsQ0FBQTtBQUFBLGFBQUFHLENBQUEsR0FBQWMsQ0FBQSxDQUFBK08sZ0JBQUEsQ0FBQTdQLENBQUEsQ0FBQSxHQUFBOFAsR0FBQTtBQUFBLEtBQUEsRUFBQWhQLENBQUEsQ0FBQStPLGdCQUFBLEdBQUEsVUFBQWpRLENBQUEsRUFBQTtBQUFBLFVBQUFDLENBQUE7QUFBQSxhQUFBQSxDQUFBLEdBQUFELENBQUEsQ0FBQW1RLEtBQUEsQ0FBQSxlQUFBLENBQUEsRUFBQSxNQUFBbFEsQ0FBQSxDQUFBTSxNQUFBLEtBQUFQLENBQUEsR0FBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsSUFBQUEsQ0FBQSxDQUFBTSxNQUFBLEtBQUFQLENBQUEsR0FBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQUEsQ0FBQSxDQUFBbVEsS0FBQSxFQUFBLEVBQUFwUSxDQUFBLElBQUFDLENBQUEsQ0FBQTVDLElBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEyQyxDQUFBO0FBQUEsS0FBQSxFQUFBa0IsQ0FBQSxDQUFBbVAsZ0JBQUEsR0FBQSxVQUFBclEsQ0FBQSxFQUFBO0FBQUEsYUFBQWtCLENBQUEsQ0FBQXNOLG9CQUFBLENBQUFDLFdBQUEsQ0FBQW1CLElBQUEsQ0FBQTVQLENBQUEsS0FBQWtCLENBQUEsQ0FBQXNOLG9CQUFBLENBQUFFLFlBQUEsQ0FBQWtCLElBQUEsQ0FBQTVQLENBQUEsQ0FBQWEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQTtBQUFBLEtBQUEsRUFBQUssQ0FBQSxDQUFBb1AsZ0JBQUEsR0FBQSxVQUFBdFEsQ0FBQSxFQUFBO0FBQUEsYUFBQWtCLENBQUEsQ0FBQXNOLG9CQUFBLENBQUFHLGFBQUEsQ0FBQWlCLElBQUEsQ0FBQTVQLENBQUEsQ0FBQTtBQUFBLEtBQUEsRUFBQWtCLENBQUEsQ0FBQXFQLHFCQUFBLEdBQUEsVUFBQXZRLENBQUEsRUFBQUMsQ0FBQSxFQUFBRyxDQUFBLEVBQUE7QUFBQSxVQUFBSixDQUFBLENBQUF3USxNQUFBLEtBQUExUSxDQUFBLEVBQUE7QUFBQSxZQUFBTyxDQUFBLEVBQUFDLENBQUEsRUFBQWdQLENBQUE7QUFBQSxlQUFBLENBQUFoUCxDQUFBLEdBQUFZLENBQUEsQ0FBQXlPLFNBQUEsQ0FBQXpPLENBQUEsQ0FBQUMsaUJBQUEsQ0FBQTJCLE9BQUEsRUFBQTdDLENBQUEsQ0FBQSxLQUFBRCxDQUFBLENBQUF3USxNQUFBLEdBQUF4USxDQUFBLENBQUF5USxNQUFBLEdBQUFuUSxDQUFBLEVBQUEsTUFBQU4sQ0FBQSxDQUFBMFEsS0FBQSxHQUFBLElBQUEsQ0FBQSxJQUFBLENBQUFyUSxDQUFBLEdBQUFhLENBQUEsQ0FBQXlPLFNBQUEsQ0FBQXpPLENBQUEsQ0FBQUMsaUJBQUEsQ0FBQUMsTUFBQSxFQUFBbkIsQ0FBQSxDQUFBLEtBQUFELENBQUEsQ0FBQXdRLE1BQUEsR0FBQXhRLENBQUEsQ0FBQTBRLEtBQUEsR0FBQXJRLENBQUEsRUFBQSxNQUFBTCxDQUFBLENBQUF5USxNQUFBLEdBQUEsSUFBQSxDQUFBLElBQUEsTUFBQXZQLENBQUEsQ0FBQW1QLGdCQUFBLENBQUFwUSxDQUFBLEtBQUFxUCxDQUFBLEdBQUF4TyxDQUFBLENBQUE2UCxZQUFBLENBQUF2USxDQUFBLENBQUEsRUFBQWtQLENBQUEsS0FBQXhQLENBQUEsSUFBQUUsQ0FBQSxDQUFBd1EsTUFBQSxHQUFBdFAsQ0FBQSxDQUFBZ08sZUFBQSxFQUFBbFAsQ0FBQSxDQUFBeVEsTUFBQSxHQUFBelEsQ0FBQSxDQUFBMFEsS0FBQSxHQUFBLElBQUEsSUFBQXBCLENBQUEsSUFBQXRQLENBQUEsQ0FBQXdRLE1BQUEsR0FBQXhRLENBQUEsQ0FBQTBRLEtBQUEsR0FBQXhQLENBQUEsQ0FBQThOLGNBQUEsRUFBQWhQLENBQUEsQ0FBQXlRLE1BQUEsR0FBQSxJQUFBLEtBQUF6USxDQUFBLENBQUF3USxNQUFBLEdBQUF4USxDQUFBLENBQUF5USxNQUFBLEdBQUF2UCxDQUFBLENBQUErTixlQUFBLEVBQUFqUCxDQUFBLENBQUEwUSxLQUFBLEdBQUEsSUFBQSxDQUFBLElBQUF4UCxDQUFBLENBQUFvUCxnQkFBQSxDQUFBclEsQ0FBQSxLQUFBRCxDQUFBLENBQUF3USxNQUFBLEdBQUF4USxDQUFBLENBQUF5USxNQUFBLEdBQUF2UCxDQUFBLENBQUErTixlQUFBLEVBQUFqUCxDQUFBLENBQUEwUSxLQUFBLEdBQUEsSUFBQSxJQUFBMVEsQ0FBQSxDQUFBd1EsTUFBQSxHQUFBeFEsQ0FBQSxDQUFBeVEsTUFBQSxHQUFBelEsQ0FBQSxDQUFBMFEsS0FBQSxHQUFBLElBQUEsQ0FBQTtBQUFBO0FBQUEsS0FBQSxFQUFBeFAsQ0FBQSxDQUFBMFAsV0FBQSxHQUFBLFVBQUE1USxDQUFBLEVBQUE7QUFBQSxVQUFBQyxDQUFBLEdBQUEsU0FBQUQsQ0FBQSxDQUFBd1EsTUFBQSxFQUFBO0FBQUEsYUFBQXhRLENBQUEsQ0FBQTZRLEVBQUEsQ0FBQSxLQUFBLEtBQUEsT0FBQTdRLENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxNQUFBLENBQUEsSUFBQTlRLENBQUEsQ0FBQTZRLEVBQUEsQ0FBQSxLQUFBLEtBQUEsT0FBQTdRLENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxRQUFBLENBQUEsSUFBQTlRLENBQUEsQ0FBQTZRLEVBQUEsQ0FBQSxLQUFBLEtBQUEsT0FBQTdRLENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxNQUFBLENBQUEsSUFBQSxNQUFBOVEsQ0FBQSxDQUFBOFEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBK1EsRUFBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBLEtBQUEvUSxDQUFBLENBQUE4USxPQUFBLENBQUEsa0JBQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBK1EsRUFBQSxDQUFBLFlBQUEsS0FBQSxLQUFBL1EsQ0FBQSxDQUFBOFEsT0FBQSxDQUFBLFlBQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBZ1IsS0FBQSxDQUFBLGtCQUFBLENBQUEsSUFBQSxPQUFBaFIsQ0FBQSxDQUFBOFEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBZ1IsS0FBQSxDQUFBLGVBQUEsQ0FBQSxJQUFBaFIsQ0FBQSxDQUFBZ1IsS0FBQSxDQUFBLGNBQUEsQ0FBQSxJQUFBaFIsQ0FBQSxDQUFBK1EsRUFBQSxDQUFBLFNBQUEsS0FBQSxNQUFBL1EsQ0FBQSxDQUFBOFEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBK1EsRUFBQSxDQUFBLFFBQUEsS0FBQS9RLENBQUEsQ0FBQStRLEVBQUEsQ0FBQSxXQUFBLENBQUEsSUFBQSxLQUFBL1EsQ0FBQSxDQUFBOFEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBK1EsRUFBQSxDQUFBLFNBQUEsS0FBQSxPQUFBL1EsQ0FBQSxDQUFBOFEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBK1EsRUFBQSxDQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEvUSxDQUFBLENBQUE4USxPQUFBLENBQUEsU0FBQSxDQUFBLElBQUE5USxDQUFBLENBQUErUSxFQUFBLENBQUEsT0FBQSxLQUFBLEtBQUEvUSxDQUFBLENBQUE4USxPQUFBLENBQUEsWUFBQSxDQUFBLElBQUE5USxDQUFBLENBQUErUSxFQUFBLENBQUEsV0FBQSxDQUFBLElBQUEvUSxDQUFBLENBQUErUSxFQUFBLENBQUEsU0FBQSxDQUFBLElBQUEvUSxDQUFBLENBQUErUSxFQUFBLENBQUEsT0FBQSxDQUFBLElBQUEvUSxDQUFBLENBQUErUSxFQUFBLENBQUEsUUFBQSxLQUFBLEtBQUEvUSxDQUFBLENBQUE4USxPQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsQ0FBQTlRLENBQUEsQ0FBQStRLEVBQUEsQ0FBQSxZQUFBLEtBQUEvUSxDQUFBLENBQUErUSxFQUFBLENBQUEsUUFBQSxDQUFBLEtBQUEsT0FBQS9RLENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxTQUFBLENBQUEsSUFBQTlRLENBQUEsQ0FBQWdSLEtBQUEsQ0FBQSxhQUFBLENBQUEsSUFBQWhSLENBQUEsQ0FBQStRLEVBQUEsQ0FBQSxRQUFBLEtBQUEsS0FBQS9RLENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxRQUFBLENBQUEsSUFBQTlRLENBQUEsQ0FBQStRLEVBQUEsQ0FBQSxXQUFBLEtBQUEvUSxDQUFBLENBQUErUSxFQUFBLENBQUEsWUFBQSxDQUFBLElBQUEsTUFBQS9RLENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBN1EsQ0FBQSxJQUFBLEtBQUFELENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBN1EsQ0FBQSxJQUFBLEtBQUFELENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSxDQUFBN1EsQ0FBQSxJQUFBLEtBQUFELENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxNQUFBLENBQUEsSUFBQSxDQUFBN1EsQ0FBQSxJQUFBLE1BQUFELENBQUEsQ0FBQThRLE9BQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxDQUFBN1EsQ0FBQSxHQUFBLEdBQUEsR0FBQUQsQ0FBQSxDQUFBNlEsRUFBQSxDQUFBLEtBQUEsS0FBQSxNQUFBN1EsQ0FBQSxDQUFBOFEsT0FBQSxDQUFBLE1BQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBNlEsRUFBQSxDQUFBLEtBQUEsS0FBQSxNQUFBN1EsQ0FBQSxDQUFBOFEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBOVEsQ0FBQSxDQUFBNlEsRUFBQSxDQUFBLEtBQUEsS0FBQSxNQUFBN1EsQ0FBQSxDQUFBOFEsT0FB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QUFBLEdBQUFELFNBQUEsQ0FBQSxDQUFBLENBREE7QUFBQSxRQUVBZ0UsSUFBQSxHQUFBdmMsS0FBQSxDQUFBTCxTQUFBLENBQUFpVyxLQUFBLENBQUFya0IsSUFBQSxDQUFBZ25CLFNBQUEsRUFBQSxDQUFBLENBRkE7QUFBQSxRQUdBN25CLENBQUEsR0FBQTJTLENBQUEsQ0FBQWpTLE1BSEE7QUFBQSxRQUlBcEMsQ0FKQTtBQUFBLFFBS0F3dEIsR0FMQTs7QUFNQSxTQUFBeHRCLENBQUEsR0FBQSxDQUFBLEVBQUFBLENBQUEsR0FBQTBCLENBQUEsRUFBQTFCLENBQUEsRUFBQSxFQUFBO0FBQ0EsVUFBQSxRQUFBd3BCLEdBQUEsS0FBQSxRQUFBLElBQUEsT0FBQUEsR0FBQSxJQUFBLFdBQUEsRUFDQW5WLENBQUEsQ0FBQXJVLENBQUEsQ0FBQSxDQUFBZ2UsS0FBQSxHQUFBLElBQUEvSixLQUFBLENBQUFJLENBQUEsQ0FBQXJVLENBQUEsQ0FBQSxFQUFBd3BCLEdBQUEsQ0FBQSxDQURBLEtBR0FnRSxHQUFBLEdBQUFuWixDQUFBLENBQUFyVSxDQUFBLENBQUEsQ0FBQWdlLEtBQUEsQ0FBQXdMLEdBQUEsRUFBQWlFLEtBQUEsQ0FBQXBaLENBQUEsQ0FBQXJVLENBQUEsQ0FBQSxDQUFBZ2UsS0FBQSxFQUFBdVAsSUFBQSxDQUFBO0FBQ0EsVUFBQSxPQUFBQyxHQUFBLElBQUEsV0FBQSxFQUFBLE9BQUFBLEdBQUE7QUFDQTs7QUFDQSxXQUFBblosQ0FBQTtBQUNBLEdBZkE7QUFpQkEsQ0FqN0ZBLENBQUEiLCJmaWxlIjoibGliLmpzIiwic291cmNlc0NvbnRlbnQiOlsiOyhmdW5jdGlvbiAoJCkge1xyXG4gICQuZm4ubWVudSA9IGZ1bmN0aW9uIChvcHRzKSB7XHJcbiAgICAvLyBkZWZhdWx0IGNvbmZpZ3VyYXRpb25cclxuICAgIHZhciBjb25maWcgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICBvcHQxOiBudWxsXHJcbiAgICB9LCBvcHRzKTtcclxuICAgIC8vIG1haW4gZnVuY3Rpb25cclxuICAgIGZ1bmN0aW9uIGluaXQob2JqKSB7XHJcbiAgICAgIHZhciBkT2JqID0gJChvYmopO1xyXG4gICAgICB2YXIgZE1lbnVsaW5rID0gZE9iai5maW5kKCcubmF2LWJ0bicpO1xyXG4gICAgICB2YXIgZEFsbExpbmsgPSBkT2JqLmZpbmQoJy5uYXYtbWVudSBhJyk7XHJcbiAgICAgIHZhciBkTWVudUNsb3NlID0gZE9iai5maW5kKCcubmF2LWNsb3NlJyk7XHJcbiAgICAgIGRNZW51bGluay5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZE9iai50b2dnbGVDbGFzcygnbmF2LS1hY3RpdmUnKTtcclxuICAgICAgICAvLyAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ19mcmVlemUnKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGRNZW51Q2xvc2UuY2xpY2soZnVuY3Rpb24gKCkgeyBcclxuICAgICAgICBkT2JqLnJlbW92ZUNsYXNzKFwibmF2LS1hY3RpdmVcIik7XHJcbiAgICAgICAgLy8gJCgnYm9keScpLnJlbW92ZUNsYXNzKCdfZnJlZXplJyk7XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBkQWxsTGluay5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZE9iai5yZW1vdmVDbGFzcygnbmF2LS1hY3RpdmUnKVxyXG4gICAgICAgIC8vICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnX2ZyZWV6ZScpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIGluaXRpYWxpemUgZXZlcnkgZWxlbWVudFxyXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGluaXQoJCh0aGlzKSk7XHJcbiAgICB9KTtcclxuICB9O1xyXG4gIC8vIHN0YXJ0XHJcbiAgXHJcbn0pKGpRdWVyeSk7XHJcbiIsIjsgKGZ1bmN0aW9uICgkKSB7XHJcblx0JC5mbi5sb2FkcGFnZSA9IGZ1bmN0aW9uIChhY3Rpb24sIG9wdHMpIHtcclxuXHRcdGFjdGlvbiA9IGFjdGlvbiA/IGFjdGlvbiA6IFwiaW5pdFwiO1xyXG5cdFx0dmFyIHByb2dyZXNzVmFsdWUgPSAwO1xyXG5cdFx0dmFyIGxvYWRIdG1sID0gW1xyXG5cdFx0XHQnPGRpdiBjbGFzcz1cIm1kTG9hZGluZ1wiPicsXHJcblx0XHRcdCcgICAgPGRpdiBjbGFzcz1cImxvYWRpbmdCb3hcIj4nLFxyXG5cdFx0XHQvLyAnICAgICAgICA8aW1nIGNsYXNzPVwibGluZTJcIiBzcmM9XCJpbWFnZXMvbG9hZC1waWMucG5nXCI+JyxcclxuXHRcdFx0Ly8gJyAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzQmFyXCI+JyxcclxuXHRcdFx0Ly8gJyAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcyBqcy1iYXJcIiBzdHlsZT1cIndpZHRoOjBcIj48L2Rpdj4nLFxyXG5cdFx0XHQvLyAnICAgICAgICA8L2Rpdj4nLFxyXG5cdFx0XHQnXHRcdDxpbWcgY2xhc3M9XCJsb2FkaW5ncGljXCIgc3JjPVwiaW1hZ2VzL2xvYWRpbmcuZ2lmXCI+JyxcclxuXHRcdFx0JyAgICA8L2Rpdj4nLFxyXG5cdFx0XHQnPC9kaXY+J1xyXG5cdFx0XS5qb2luKCcnKTtcclxuXHRcdHZhciBkTG9hZCxkQ291bnQsZEJhcjtcclxuXHRcdHZhciBjb25maWcgPSAkLmV4dGVuZCh7XHJcblx0XHRcdGFzeW5jOmZhbHNlXHJcblx0XHR9LCBvcHRzKTtcclxuXHRcdFxyXG5cdFx0ZnVuY3Rpb24gaW5pdChvYmopIHtcclxuXHRcdFx0JChsb2FkSHRtbCkuYXBwZW5kVG8oJ2JvZHknKTtcclxuXHRcdFx0ZExvYWQgPSBvYmouZmluZCgnLm1kTG9hZGluZycpO1xyXG5cdFx0XHRkQ291bnQgPSBkTG9hZC5maW5kKCcuanMtY291bnQnKTtcclxuXHRcdFx0ZEJhciA9IGRMb2FkLmZpbmQoJy5qcy1iYXInKTtcclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3Qpe1xyXG5cdFx0XHRcdGlmICghY29uZmlnLmFzeW5jKSB7XHJcblx0XHRcdFx0XHR2YXIgcXVldWUgPSBuZXcgY3JlYXRlanMuTG9hZFF1ZXVlKCk7XHJcblx0XHRcdFx0XHRxdWV1ZS5zZXRNYXhDb25uZWN0aW9ucygyMDApO1xyXG5cdFx0XHRcdFx0dmFyIGxvYWRBcnJheSA9IFtdO1xyXG5cdFx0XHRcdFx0b2JqLmZpbmQoXCJpbWdcIikuZWFjaChmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0XHRsb2FkQXJyYXkucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0aWQ6IGksXHJcblx0XHRcdFx0XHRcdFx0c3JjOiAkKHRoaXMpLmF0dHIoXCJzcmNcIilcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0cXVldWUubG9hZE1hbmlmZXN0KGxvYWRBcnJheSk7XHJcblxyXG5cdFx0XHRcdFx0dmFyIGhhbmRsZUNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHRcdFx0JCh3aW5kb3cpLnRyaWdnZXIoXCJsb2FkQ29tcGxldGVkXCIpO1xyXG5cdFx0XHRcdFx0XHQkKCcuanMtd3JhcCcpLmNzcyh7ICd2aXNpYmlsaXR5JzogJ3Zpc2libGUnIH0pO1xyXG5cdFx0XHRcdFx0XHRUd2Vlbk1heC5mcm9tVG8oZExvYWQsIDAuNSwgeyBvcGFjaXR5OiAxIH0sIHtcclxuXHRcdFx0XHRcdFx0XHRkZWxheTogLjgsXHJcblx0XHRcdFx0XHRcdFx0b3BhY2l0eTogMCwgZWFzZTogUG93ZXI0LmVhc2VPdXQsIG9uQ29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRMb2FkLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdCAgIFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRxdWV1ZS5vbihcInByb2dyZXNzXCIsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0dmFyIHByb2NWYWx1ZSA9IE1hdGgubWluKE1hdGguY2VpbChxdWV1ZS5wcm9ncmVzcyAqIDEwMCksIDEwMCk7XHJcblx0XHRcdFx0XHRcdGRDb3VudC50ZXh0KHByb2NWYWx1ZSArICclJyk7XHJcblx0XHRcdFx0XHRcdGRCYXIuY3NzKHtcclxuXHRcdFx0XHRcdFx0XHQnd2lkdGgnOiBwcm9jVmFsdWUgKyAnJSdcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRxdWV1ZS5vbihcImNvbXBsZXRlXCIsIGhhbmRsZUNvbXBsZXRlLCB0aGlzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRpZihhY3Rpb24gPT0gJ2luaXQnKXtcclxuXHRcdFx0cmV0dXJuIGluaXQoJCh0aGlzKSk7XHRcclxuXHRcdH1cclxuXHRcdGlmIChhY3Rpb24gPT0gJ2Nsb3NlJykge1xyXG5cdFx0XHRkTG9hZCA9ICQodGhpcykuZmluZCgnLm1kTG9hZGluZycpO1xyXG5cdFx0XHRkQ291bnQgPSBkTG9hZC5maW5kKCcuanMtY291bnQnKTtcclxuXHRcdFx0ZEJhciA9IGRMb2FkLmZpbmQoJy5qcy1iYXInKTtcclxuXHRcdFx0ZENvdW50LnRleHQoJzEwMCUnKTtcclxuXHRcdFx0ZEJhci5jc3Moe1xyXG5cdFx0XHRcdCd3aWR0aCc6JzEwMCUnXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRUd2Vlbk1heC5mcm9tVG8oZExvYWQsIDAuNSwgeyBvcGFjaXR5OiAxIH0sIHtcclxuXHRcdFx0XHRkZWxheTogLjgsXHJcblx0XHRcdFx0b3BhY2l0eTogMCwgZWFzZTogUG93ZXI0LmVhc2VPdXQsIG9uQ29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGRMb2FkLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG59KShqUXVlcnkpOyIsIlwidXNlIHN0cmljdFwiOyFmdW5jdGlvbihsLG0pe2woZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHYsdyl7cmV0dXJuIG51bGwhPXYmJm51bGwhPXcmJnYudG9Mb3dlckNhc2UoKT09PXcudG9Mb3dlckNhc2UoKX1mdW5jdGlvbiBvKHYsdyl7dmFyIHgseSx6PXYubGVuZ3RoO2lmKCF6fHwhdylyZXR1cm4hMTtmb3IoeD13LnRvTG93ZXJDYXNlKCkseT0wO3k8ejsrK3kpaWYoeD09PXZbeV0udG9Mb3dlckNhc2UoKSlyZXR1cm4hMDtyZXR1cm4hMX1mdW5jdGlvbiBwKHYpe2Zvcih2YXIgdyBpbiB2KXUuY2FsbCh2LHcpJiYodlt3XT1uZXcgUmVnRXhwKHZbd10sXCJpXCIpKX1mdW5jdGlvbiBxKHYpe3JldHVybih2fHxcIlwiKS5zdWJzdHIoMCw1MDApfWZ1bmN0aW9uIHIodix3KXt0aGlzLnVhPXEodiksdGhpcy5fY2FjaGU9e30sdGhpcy5tYXhQaG9uZVdpZHRoPXd8fDYwMH12YXIgcz17bW9iaWxlRGV0ZWN0UnVsZXM6e3Bob25lczp7aVBob25lOlwiXFxcXGJpUGhvbmVcXFxcYnxcXFxcYmlQb2RcXFxcYlwiLEJsYWNrQmVycnk6XCJCbGFja0JlcnJ5fFxcXFxiQkIxMFxcXFxifHJpbVswLTldK1wiLEhUQzpcIkhUQ3xIVEMuKihTZW5zYXRpb258RXZvfFZpc2lvbnxFeHBsb3Jlcnw2ODAwfDgxMDB8ODkwMHxBNzI3MnxTNTEwZXxDMTEwZXxMZWdlbmR8RGVzaXJlfFQ4MjgyKXxBUFg1MTVDS1R8UXRlazkwOTB8QVBBOTI5MktUfEhEX21pbml8U2Vuc2F0aW9uLipaNzEwZXxQRzg2MTAwfFo3MTVlfERlc2lyZS4qKEE4MTgxfEhEKXxBRFI2MjAwfEFEUjY0MDBMfEFEUjY0MjV8MDAxSFR8SW5zcGlyZSA0R3xBbmRyb2lkLipcXFxcYkVWT1xcXFxifFQtTW9iaWxlIEcxfFo1MjBtfEFuZHJvaWQgWzAtOS5dKzsgUGl4ZWxcIixOZXh1czpcIk5leHVzIE9uZXxOZXh1cyBTfEdhbGF4eS4qTmV4dXN8QW5kcm9pZC4qTmV4dXMuKk1vYmlsZXxOZXh1cyA0fE5leHVzIDV8TmV4dXMgNlwiLERlbGw6XCJEZWxsWztdPyAoU3RyZWFrfEFlcm98VmVudWV8VmVudWUgUHJvfEZsYXNofFNtb2tlfE1pbmkgM2lYKXxYQ0QyOHxYQ0QzNXxcXFxcYjAwMURMXFxcXGJ8XFxcXGIxMDFETFxcXFxifFxcXFxiR1MwMVxcXFxiXCIsTW90b3JvbGE6XCJNb3Rvcm9sYXxEUk9JRFh8RFJPSUQgQklPTklDfFxcXFxiRHJvaWRcXFxcYi4qQnVpbGR8QW5kcm9pZC4qWG9vbXxIUkkzOXxNT1QtfEExMjYwfEExNjgwfEE1NTV8QTg1M3xBODU1fEE5NTN8QTk1NXxBOTU2fE1vdG9yb2xhLipFTEVDVFJJRll8TW90b3JvbGEuKmkxfGk4Njd8aTk0MHxNQjIwMHxNQjMwMHxNQjUwMXxNQjUwMnxNQjUwOHxNQjUxMXxNQjUyMHxNQjUyNXxNQjUyNnxNQjYxMXxNQjYxMnxNQjYzMnxNQjgxMHxNQjg1NXxNQjg2MHxNQjg2MXxNQjg2NXxNQjg3MHxNRTUwMXxNRTUwMnxNRTUxMXxNRTUyNXxNRTYwMHxNRTYzMnxNRTcyMnxNRTgxMXxNRTg2MHxNRTg2M3xNRTg2NXxNVDYyMHxNVDcxMHxNVDcxNnxNVDcyMHxNVDgxMHxNVDg3MHxNVDkxN3xNb3Rvcm9sYS4qVElUQU5JVU18V1g0MzV8V1g0NDV8WFQzMDB8WFQzMDF8WFQzMTF8WFQzMTZ8WFQzMTd8WFQzMTl8WFQzMjB8WFQzOTB8WFQ1MDJ8WFQ1MzB8WFQ1MzF8WFQ1MzJ8WFQ1MzV8WFQ2MDN8WFQ2MTB8WFQ2MTF8WFQ2MTV8WFQ2ODF8WFQ3MDF8WFQ3MDJ8WFQ3MTF8WFQ3MjB8WFQ4MDB8WFQ4MDZ8WFQ4NjB8WFQ4NjJ8WFQ4NzV8WFQ4ODJ8WFQ4ODN8WFQ4OTR8WFQ5MDF8WFQ5MDd8WFQ5MDl8WFQ5MTB8WFQ5MTJ8WFQ5Mjh8WFQ5MjZ8WFQ5MTV8WFQ5MTl8WFQ5MjV8WFQxMDIxfFxcXFxiTW90byBFXFxcXGJ8WFQxMDY4fFhUMTA5MnxYVDEwNTJcIixTYW1zdW5nOlwiXFxcXGJTYW1zdW5nXFxcXGJ8U00tRzk1MEZ8U00tRzk1NUZ8U00tRzkyNTB8R1QtMTkzMDB8U0dILUkzMzd8QkdULVM1MjMwfEdULUIyMTAwfEdULUIyNzAwfEdULUIyNzEwfEdULUIzMjEwfEdULUIzMzEwfEdULUIzNDEwfEdULUIzNzMwfEdULUIzNzQwfEdULUI1NTEwfEdULUI1NTEyfEdULUI1NzIyfEdULUI2NTIwfEdULUI3MzAwfEdULUI3MzIwfEdULUI3MzMwfEdULUI3MzUwfEdULUI3NTEwfEdULUI3NzIyfEdULUI3ODAwfEdULUMzMDEwfEdULUMzMDExfEdULUMzMDYwfEdULUMzMjAwfEdULUMzMjEyfEdULUMzMjEySXxHVC1DMzI2MnxHVC1DMzIyMnxHVC1DMzMwMHxHVC1DMzMwMEt8R1QtQzMzMDN8R1QtQzMzMDNLfEdULUMzMzEwfEdULUMzMzIyfEdULUMzMzMwfEdULUMzMzUwfEdULUMzNTAwfEdULUMzNTEwfEdULUMzNTMwfEdULUMzNjMwfEdULUMzNzgwfEdULUM1MDEwfEdULUM1MjEyfEdULUM2NjIwfEdULUM2NjI1fEdULUM2NzEyfEdULUUxMDUwfEdULUUxMDcwfEdULUUxMDc1fEdULUUxMDgwfEdULUUxMDgxfEdULUUxMDg1fEdULUUxMDg3fEdULUUxMTAwfEdULUUxMTA3fEdULUUxMTEwfEdULUUxMTIwfEdULUUxMTI1fEdULUUxMTMwfEdULUUxMTYwfEdULUUxMTcwfEdULUUxMTc1fEdULUUxMTgwfEdULUUxMTgyfEdULUUxMjAwfEdULUUxMjEwfEdULUUxMjI1fEdULUUxMjMwfEdULUUxMzkwfEdULUUyMTAwfEdULUUyMTIwfEdULUUyMTIxfEdULUUyMTUyfEdULUUyMjIwfEdULUUyMjIyfEdULUUyMjMwfEdULUUyMjMyfEdULUUyMjUwfEdULUUyMzcwfEdULUUyNTUwfEdULUUyNjUyfEdULUUzMjEwfEdULUUzMjEzfEdULUk1NTAwfEdULUk1NTAzfEdULUk1NzAwfEdULUk1ODAwfEdULUk1ODAxfEdULUk2NDEwfEdULUk2NDIwfEdULUk3MTEwfEdULUk3NDEwfEdULUk3NTAwfEdULUk4MDAwfEdULUk4MTUwfEdULUk4MTYwfEdULUk4MTkwfEdULUk4MzIwfEdULUk4MzMwfEdULUk4MzUwfEdULUk4NTMwfEdULUk4NzAwfEdULUk4NzAzfEdULUk4OTEwfEdULUk5MDAwfEdULUk5MDAxfEdULUk5MDAzfEdULUk5MDEwfEdULUk5MDIwfEdULUk5MDIzfEdULUk5MDcwfEdULUk5MDgyfEdULUk5MTAwfEdULUk5MTAzfEdULUk5MjIwfEdULUk5MjUwfEdULUk5MzAwfEdULUk5MzA1fEdULUk5NTAwfEdULUk5NTA1fEdULU0zNTEwfEdULU01NjUwfEdULU03NTAwfEdULU03NjAwfEdULU03NjAzfEdULU04ODAwfEdULU04OTEwfEdULU43MDAwfEdULVMzMTEwfEdULVMzMzEwfEdULVMzMzUwfEdULVMzMzUzfEdULVMzMzcwfEdULVMzNjUwfEdULVMzNjUzfEdULVMzNzcwfEdULVMzODUwfEdULVM1MjEwfEdULVM1MjIwfEdULVM1MjI5fEdULVM1MjMwfEdULVM1MjMzfEdULVM1MjUwfEdULVM1MjUzfEdULVM1MjYwfEdULVM1MjYzfEdULVM1MjcwfEdULVM1MzAwfEdULVM1MzMwfEdULVM1MzUwfEdULVM1MzYwfEdULVM1MzYzfEdULVM1MzY5fEdULVM1MzgwfEdULVM1MzgwRHxHVC1TNTU2MHxHVC1TNTU3MHxHVC1TNTYwMHxHVC1TNTYwM3xHVC1TNTYxMHxHVC1TNTYyMHxHVC1TNTY2MHxHVC1TNTY3MHxHVC1TNTY5MHxHVC1TNTc1MHxHVC1TNTc4MHxHVC1TNTgzMHxHVC1TNTgzOXxHVC1TNjEwMnxHVC1TNjUwMHxHVC1TNzA3MHxHVC1TNzIwMHxHVC1TNzIyMHxHVC1TNzIzMHxHVC1TNzIzM3xHVC1TNzI1MHxHVC1TNzUwMHxHVC1TNzUzMHxHVC1TNzU1MHxHVC1TNzU2MnxHVC1TNzcxMHxHVC1TODAwMHxHVC1TODAwM3xHVC1TODUwMHxHVC1TODUzMHxHVC1TODYwMHxTQ0gtQTMxMHxTQ0gtQTUzMHxTQ0gtQTU3MHxTQ0gtQTYxMHxTQ0gtQTYzMHxTQ0gtQTY1MHxTQ0gtQTc5MHxTQ0gtQTc5NXxTQ0gtQTg1MHxTQ0gtQTg3MHxTQ0gtQTg5MHxTQ0gtQTkzMHxTQ0gtQTk1MHxTQ0gtQTk3MHxTQ0gtQTk5MHxTQ0gtSTEwMHxTQ0gtSTExMHxTQ0gtSTQwMHxTQ0gtSTQwNXxTQ0gtSTUwMHxTQ0gtSTUxMHxTQ0gtSTUxNXxTQ0gtSTYwMHxTQ0gtSTczMHxTQ0gtSTc2MHxTQ0gtSTc3MHxTQ0gtSTgzMHxTQ0gtSTkxMHxTQ0gtSTkyMHxTQ0gtSTk1OXxTQ0gtTEMxMXxTQ0gtTjE1MHxTQ0gtTjMwMHxTQ0gtUjEwMHxTQ0gtUjMwMHxTQ0gtUjM1MXxTQ0gtUjQwMHxTQ0gtUjQxMHxTQ0gtVDMwMHxTQ0gtVTMxMHxTQ0gtVTMyMHxTQ0gtVTM1MHxTQ0gtVTM2MHxTQ0gtVTM2NXxTQ0gtVTM3MHxTQ0gtVTM4MHxTQ0gtVTQxMHxTQ0gtVTQzMHxTQ0gtVTQ1MHxTQ0gtVTQ2MHxTQ0gtVTQ3MHxTQ0gtVTQ5MHxTQ0gtVTU0MHxTQ0gtVTU1MHxTQ0gtVTYyMHxTQ0gtVTY0MHxTQ0gtVTY1MHxTQ0gtVTY2MHxTQ0gtVTcwMHxTQ0gtVTc0MHxTQ0gtVTc1MHxTQ0gtVTgxMHxTQ0gtVTgyMHxTQ0gtVTkwMHxTQ0gtVTk0MHxTQ0gtVTk2MHxTQ1MtMjZVQ3xTR0gtQTEwN3xTR0gtQTExN3xTR0gtQTEyN3xTR0gtQTEzN3xTR0gtQTE1N3xTR0gtQTE2N3xTR0gtQTE3N3xTR0gtQTE4N3xTR0gtQTE5N3xTR0gtQTIyN3xTR0gtQTIzN3xTR0gtQTI1N3xTR0gtQTQzN3xTR0gtQTUxN3xTR0gtQTU5N3xTR0gtQTYzN3xTR0gtQTY1N3xTR0gtQTY2N3xTR0gtQTY4N3xTR0gtQTY5N3xTR0gtQTcwN3xTR0gtQTcxN3xTR0gtQTcyN3xTR0gtQTczN3xTR0gtQTc0N3xTR0gtQTc2N3xTR0gtQTc3N3xTR0gtQTc5N3xTR0gtQTgxN3xTR0gtQTgyN3xTR0gtQTgzN3xTR0gtQTg0N3xTR0gtQTg2N3xTR0gtQTg3N3xTR0gtQTg4N3xTR0gtQTg5N3xTR0gtQTkyN3xTR0gtQjEwMHxTR0gtQjEzMHxTR0gtQjIwMHxTR0gtQjIyMHxTR0gtQzEwMHxTR0gtQzExMHxTR0gtQzEyMHxTR0gtQzEzMHxTR0gtQzE0MHxTR0gtQzE2MHxTR0gtQzE3MHxTR0gtQzE4MHxTR0gtQzIwMHxTR0gtQzIwN3xTR0gtQzIxMHxTR0gtQzIyNXxTR0gtQzIzMHxTR0gtQzQxN3xTR0gtQzQ1MHxTR0gtRDMwN3xTR0gtRDM0N3xTR0gtRDM1N3xTR0gtRDQwN3xTR0gtRDQxNXxTR0gtRDc4MHxTR0gtRDgwN3xTR0gtRDk4MHxTR0gtRTEwNXxTR0gtRTIwMHxTR0gtRTMxNXxTR0gtRTMxNnxTR0gtRTMxN3xTR0gtRTMzNXxTR0gtRTU5MHxTR0gtRTYzNXxTR0gtRTcxNXxTR0gtRTg5MHxTR0gtRjMwMHxTR0gtRjQ4MHxTR0gtSTIwMHxTR0gtSTMwMHxTR0gtSTMyMHxTR0gtSTU1MHxTR0gtSTU3N3xTR0gtSTYwMHxTR0gtSTYwN3xTR0gtSTYxN3xTR0gtSTYyN3xTR0gtSTYzN3xTR0gtSTY3N3xTR0gtSTcwMHxTR0gtSTcxN3xTR0gtSTcyN3xTR0gtaTc0N018U0dILUk3Nzd8U0dILUk3ODB8U0dILUk4Mjd8U0dILUk4NDd8U0dILUk4NTd8U0dILUk4OTZ8U0dILUk4OTd8U0dILUk5MDB8U0dILUk5MDd8U0dILUk5MTd8U0dILUk5Mjd8U0dILUk5Mzd8U0dILUk5OTd8U0dILUoxNTB8U0dILUoyMDB8U0dILUwxNzB8U0dILUw3MDB8U0dILU0xMTB8U0dILU0xNTB8U0dILU0yMDB8U0dILU4xMDV8U0dILU41MDB8U0dILU42MDB8U0dILU42MjB8U0dILU42MjV8U0dILU43MDB8U0dILU43MTB8U0dILVAxMDd8U0dILVAyMDd8U0dILVAzMDB8U0dILVAzMTB8U0dILVA1MjB8U0dILVA3MzV8U0dILVA3Nzd8U0dILVExMDV8U0dILVIyMTB8U0dILVIyMjB8U0dILVIyMjV8U0dILVMxMDV8U0dILVMzMDd8U0dILVQxMDl8U0dILVQxMTl8U0dILVQxMzl8U0dILVQyMDl8U0dILVQyMTl8U0dILVQyMjl8U0dILVQyMzl8U0dILVQyNDl8U0dILVQyNTl8U0dILVQzMDl8U0dILVQzMTl8U0dILVQzMjl8U0dILVQzMzl8U0dILVQzNDl8U0dILVQzNTl8U0dILVQzNjl8U0dILVQzNzl8U0dILVQ0MDl8U0dILVQ0Mjl8U0dILVQ0Mzl8U0dILVQ0NTl8U0dILVQ0Njl8U0dILVQ0Nzl8U0dILVQ0OTl8U0dILVQ1MDl8U0dILVQ1MTl8U0dILVQ1Mzl8U0dILVQ1NTl8U0dILVQ1ODl8U0dILVQ2MDl8U0dILVQ2MTl8U0dILVQ2Mjl8U0dILVQ2Mzl8U0dILVQ2NTl8U0dILVQ2Njl8U0dILVQ2Nzl8U0dILVQ3MDl8U0dILVQ3MTl8U0dILVQ3Mjl8U0dILVQ3Mzl8U0dILVQ3NDZ8U0dILVQ3NDl8U0dILVQ3NTl8U0dILVQ3Njl8U0dILVQ4MDl8U0dILVQ4MTl8U0dILVQ4Mzl8U0dILVQ5MTl8U0dILVQ5Mjl8U0dILVQ5Mzl8U0dILVQ5NTl8U0dILVQ5ODl8U0dILVUxMDB8U0dILVUyMDB8U0dILVU4MDB8U0dILVYyMDV8U0dILVYyMDZ8U0dILVgxMDB8U0dILVgxMDV8U0dILVgxMjB8U0dILVgxNDB8U0dILVg0MjZ8U0dILVg0Mjd8U0dILVg0NzV8U0dILVg0OTV8U0dILVg0OTd8U0dILVg1MDd8U0dILVg2MDB8U0dILVg2MTB8U0dILVg2MjB8U0dILVg2MzB8U0dILVg3MDB8U0dILVg4MjB8U0dILVg4OTB8U0dILVoxMzB8U0dILVoxNTB8U0dILVoxNzB8U0dILVpYMTB8U0dILVpYMjB8U0hXLU0xMTB8U1BILUExMjB8U1BILUE0MDB8U1BILUE0MjB8U1BILUE0NjB8U1BILUE1MDB8U1BILUE1NjB8U1BILUE2MDB8U1BILUE2MjB8U1BILUE2NjB8U1BILUE3MDB8U1BILUE3NDB8U1BILUE3NjB8U1BILUE3OTB8U1BILUE4MDB8U1BILUE4MjB8U1BILUE4NDB8U1BILUE4ODB8U1BILUE5MDB8U1BILUE5NDB8U1BILUE5NjB8U1BILUQ2MDB8U1BILUQ3MDB8U1BILUQ3MTB8U1BILUQ3MjB8U1BILUkzMDB8U1BILUkzMjV8U1BILUkzMzB8U1BILUkzNTB8U1BILUk1MDB8U1BILUk2MDB8U1BILUk3MDB8U1BILUw3MDB8U1BILU0xMDB8U1BILU0yMjB8U1BILU0yNDB8U1BILU0zMDB8U1BILU0zMDV8U1BILU0zMjB8U1BILU0zMzB8U1BILU0zNTB8U1BILU0zNjB8U1BILU0zNzB8U1BILU0zODB8U1BILU01MTB8U1BILU01NDB8U1BILU01NTB8U1BILU01NjB8U1BILU01NzB8U1BILU01ODB8U1BILU02MTB8U1BILU02MjB8U1BILU02MzB8U1BILU04MDB8U1BILU04MTB8U1BILU04NTB8U1BILU05MDB8U1BILU05MTB8U1BILU05MjB8U1BILU05MzB8U1BILU4xMDB8U1BILU4yMDB8U1BILU4yNDB8U1BILU4zMDB8U1BILU40MDB8U1BILVo0MDB8U1dDLUUxMDB8U0NILWk5MDl8R1QtTjcxMDB8R1QtTjcxMDV8U0NILUk1MzV8U00tTjkwMEF8U0dILUkzMTd8U0dILVQ5OTlMfEdULVM1MzYwQnxHVC1JODI2MnxHVC1TNjgwMnxHVC1TNjMxMnxHVC1TNjMxMHxHVC1TNTMxMnxHVC1TNTMxMHxHVC1JOTEwNXxHVC1JODUxMHxHVC1TNjc5ME58U00tRzcxMDV8U00tTjkwMDV8R1QtUzUzMDF8R1QtSTkyOTV8R1QtSTkxOTV8U00tQzEwMXxHVC1TNzM5MnxHVC1TNzU2MHxHVC1CNzYxMHxHVC1JNTUxMHxHVC1TNzU4MnxHVC1TNzUzMEV8R1QtSTg3NTB8U00tRzkwMDZWfFNNLUc5MDA4VnxTTS1HOTAwOUR8U00tRzkwMEF8U00tRzkwMER8U00tRzkwMEZ8U00tRzkwMEh8U00tRzkwMEl8U00tRzkwMEp8U00tRzkwMEt8U00tRzkwMEx8U00tRzkwME18U00tRzkwMFB8U00tRzkwMFI0fFNNLUc5MDBTfFNNLUc5MDBUfFNNLUc5MDBWfFNNLUc5MDBXOHxTSFYtRTE2MEt8U0NILVA3MDl8U0NILVA3Mjl8U00tVDI1NTh8R1QtSTkyMDV8U00tRzkzNTB8U00tSjEyMEZ8U00tRzkyMEZ8U00tRzkyMFZ8U00tRzkzMEZ8U00tTjkxMEN8U00tQTMxMEZ8R1QtSTkxOTB8U00tSjUwMEZOfFNNLUc5MDNGfFNNLUozMzBGXCIsTEc6XCJcXFxcYkxHXFxcXGI7fExHWy0gXT8oQzgwMHxDOTAwfEU0MDB8RTYxMHxFOTAwfEUtOTAwfEYxNjB8RjE4MEt8RjE4MEx8RjE4MFN8NzMwfDg1NXxMMTYwfExTNzQwfExTODQwfExTOTcwfExVNjIwMHxNUzY5MHxNUzY5NXxNUzc3MHxNUzg0MHxNUzg3MHxNUzkxMHxQNTAwfFA3MDB8UDcwNXxWTTY5NnxBUzY4MHxBUzY5NXxBWDg0MHxDNzI5fEU5NzB8R1M1MDV8MjcyfEMzOTV8RTczOUJLfEU5NjB8TDU1Q3xMNzVDfExTNjk2fExTODYwfFA3NjlCS3xQMzUwfFA1MDB8UDUwOXxQODcwfFVOMjcyfFVTNzMwfFZTODQwfFZTOTUwfExOMjcyfExONTEwfExTNjcwfExTODU1fExXNjkwfE1OMjcwfE1ONTEwfFA1MDl8UDc2OXxQOTMwfFVOMjAwfFVOMjcwfFVONTEwfFVONjEwfFVTNjcwfFVTNzQwfFVTNzYwfFVYMjY1fFVYODQwfFZOMjcxfFZONTMwfFZTNjYwfFZTNzAwfFZTNzQwfFZTNzUwfFZTOTEwfFZTOTIwfFZTOTMwfFZYOTIwMHxWWDExMDAwfEFYODQwQXxMVzc3MHxQNTA2fFA5MjV8UDk5OXxFNjEyfEQ5NTV8RDgwMnxNUzMyM3xNMjU3KVwiLFNvbnk6XCJTb255U1R8U29ueUxUfFNvbnlFcmljc3NvbnxTb255RXJpY3Nzb25MVDE1aXZ8TFQxOGl8RTEwaXxMVDI4aHxMVDI2d3xTb255RXJpY3Nzb25NVDI3aXxDNTMwM3xDNjkwMnxDNjkwM3xDNjkwNnxDNjk0M3xEMjUzM1wiLEFzdXM6XCJBc3VzLipHYWxheHl8UGFkRm9uZS4qTW9iaWxlXCIsTm9raWFMdW1pYTpcIkx1bWlhIFswLTldezMsNH1cIixNaWNyb21heDpcIk1pY3JvbWF4LipcXFxcYihBMjEwfEE5MnxBODh8QTcyfEExMTF8QTExMFF8QTExNXxBMTE2fEExMTB8QTkwU3xBMjZ8QTUxfEEzNXxBNTR8QTI1fEEyN3xBODl8QTY4fEE2NXxBNTd8QTkwKVxcXFxiXCIsUGFsbTpcIlBhbG1Tb3VyY2V8UGFsbVwiLFZlcnR1OlwiVmVydHV8VmVydHUuKkx0ZHxWZXJ0dS4qQXNjZW50fFZlcnR1LipBeXh0YXxWZXJ0dS4qQ29uc3RlbGxhdGlvbihGfFF1ZXN0KT98VmVydHUuKk1vbmlrYXxWZXJ0dS4qU2lnbmF0dXJlXCIsUGFudGVjaDpcIlBBTlRFQ0h8SU0tQTg1MFN8SU0tQTg0MFN8SU0tQTgzMEx8SU0tQTgzMEt8SU0tQTgzMFN8SU0tQTgyMEx8SU0tQTgxMEt8SU0tQTgxMFN8SU0tQTgwMFN8SU0tVDEwMEt8SU0tQTcyNUx8SU0tQTc4MEx8SU0tQTc3NUN8SU0tQTc3MEt8SU0tQTc2MFN8SU0tQTc1MEt8SU0tQTc0MFN8SU0tQTczMFN8SU0tQTcyMEx8SU0tQTcxMEt8SU0tQTY5MEx8SU0tQTY5MFN8SU0tQTY1MFN8SU0tQTYzMEt8SU0tQTYwMFN8VkVHQSBQVEwyMXxQVDAwM3xQODAxMHxBRFI5MTBMfFA2MDMwfFA2MDIwfFA5MDcwfFA0MTAwfFA5MDYwfFA1MDAwfENETTg5OTJ8VFhUODA0NXxBRFI4OTk1fElTMTFQVHxQMjAzMHxQNjAxMHxQODAwMHxQVDAwMnxJUzA2fENETTg5OTl8UDkwNTB8UFQwMDF8VFhUODA0MHxQMjAyMHxQOTAyMHxQMjAwMHxQNzA0MHxQNzAwMHxDNzkwXCIsRmx5OlwiSVEyMzB8SVE0NDR8SVE0NTB8SVE0NDB8SVE0NDJ8SVE0NDF8SVEyNDV8SVEyNTZ8SVEyMzZ8SVEyNTV8SVEyMzV8SVEyNDV8SVEyNzV8SVEyNDB8SVEyODV8SVEyODB8SVEyNzB8SVEyNjB8SVEyNTBcIixXaWtvOlwiS0lURSA0R3xISUdIV0FZfEdFVEFXQVl8U1RBSVJXQVl8REFSS1NJREV8REFSS0ZVTEx8REFSS05JR0hUfERBUktNT09OfFNMSURFfFdBWCA0R3xSQUlOQk9XfEJMT09NfFNVTlNFVHxHT0EoPyFubmEpfExFTk5ZfEJBUlJZfElHR1l8T1paWXxDSU5LIEZJVkV8Q0lOSyBQRUFYfENJTksgUEVBWCAyfENJTksgU0xJTXxDSU5LIFNMSU0gMnxDSU5LICt8Q0lOSyBLSU5HfENJTksgUEVBWHxDSU5LIFNMSU18U1VCTElNXCIsaU1vYmlsZTpcImktbW9iaWxlIChJUXxpLVNUWUxFfGlkZWF8WkFBfEhpdHopXCIsU2ltVmFsbGV5OlwiXFxcXGIoU1AtODB8WFQtOTMwfFNYLTM0MHxYVC05MzB8U1gtMzEwfFNQLTM2MHxTUDYwfFNQVC04MDB8U1AtMTIwfFNQVC04MDB8U1AtMTQwfFNQWC01fFNQWC04fFNQLTEwMHxTUFgtOHxTUFgtMTIpXFxcXGJcIixXb2xmZ2FuZzpcIkFULUIyNER8QVQtQVM1MEhEfEFULUFTNDBXfEFULUFTNTVIRHxBVC1BUzQ1cTJ8QVQtQjI2RHxBVC1BUzUwUVwiLEFsY2F0ZWw6XCJBbGNhdGVsXCIsTmludGVuZG86XCJOaW50ZW5kbyAoM0RTfFN3aXRjaClcIixBbW9pOlwiQW1vaVwiLElOUTpcIklOUVwiLEdlbmVyaWNQaG9uZTpcIlRhcGF0YWxrfFBEQTt8U0FHRU18XFxcXGJtbXBcXFxcYnxwb2NrZXR8XFxcXGJwc3BcXFxcYnxzeW1iaWFufFNtYXJ0cGhvbmV8c21hcnRmb258dHJlb3x1cC5icm93c2VyfHVwLmxpbmt8dm9kYWZvbmV8XFxcXGJ3YXBcXFxcYnxub2tpYXxTZXJpZXM0MHxTZXJpZXM2MHxTNjB8U29ueUVyaWNzc29ufE45MDB8TUFVSS4qV0FQLipCcm93c2VyXCJ9LHRhYmxldHM6e2lQYWQ6XCJpUGFkfGlQYWQuKk1vYmlsZVwiLE5leHVzVGFibGV0OlwiQW5kcm9pZC4qTmV4dXNbXFxcXHNdKyg3fDl8MTApXCIsR29vZ2xlVGFibGV0OlwiQW5kcm9pZC4qUGl4ZWwgQ1wiLFNhbXN1bmdUYWJsZXQ6XCJTQU1TVU5HLipUYWJsZXR8R2FsYXh5LipUYWJ8U0MtMDFDfEdULVAxMDAwfEdULVAxMDAzfEdULVAxMDEwfEdULVAzMTA1fEdULVA2MjEwfEdULVA2ODAwfEdULVA2ODEwfEdULVA3MTAwfEdULVA3MzAwfEdULVA3MzEwfEdULVA3NTAwfEdULVA3NTEwfFNDSC1JODAwfFNDSC1JODE1fFNDSC1JOTA1fFNHSC1JOTU3fFNHSC1JOTg3fFNHSC1UODQ5fFNHSC1UODU5fFNHSC1UODY5fFNQSC1QMTAwfEdULVAzMTAwfEdULVAzMTA4fEdULVAzMTEwfEdULVA1MTAwfEdULVA1MTEwfEdULVA2MjAwfEdULVA3MzIwfEdULVA3NTExfEdULU44MDAwfEdULVA4NTEwfFNHSC1JNDk3fFNQSC1QNTAwfFNHSC1UNzc5fFNDSC1JNzA1fFNDSC1JOTE1fEdULU44MDEzfEdULVAzMTEzfEdULVA1MTEzfEdULVA4MTEwfEdULU44MDEwfEdULU44MDA1fEdULU44MDIwfEdULVAxMDEzfEdULVA2MjAxfEdULVA3NTAxfEdULU41MTAwfEdULU41MTA1fEdULU41MTEwfFNIVi1FMTQwS3xTSFYtRTE0MEx8U0hWLUUxNDBTfFNIVi1FMTUwU3xTSFYtRTIzMEt8U0hWLUUyMzBMfFNIVi1FMjMwU3xTSFctTTE4MEt8U0hXLU0xODBMfFNIVy1NMTgwU3xTSFctTTE4MFd8U0hXLU0zMDBXfFNIVy1NMzA1V3xTSFctTTM4MEt8U0hXLU0zODBTfFNIVy1NMzgwV3xTSFctTTQzMFd8U0hXLU00ODBLfFNIVy1NNDgwU3xTSFctTTQ4MFd8U0hXLU00ODVXfFNIVy1NNDg2V3xTSFctTTUwMFd8R1QtSTkyMjh8U0NILVA3Mzl8U0NILUk5MjV8R1QtSTkyMDB8R1QtUDUyMDB8R1QtUDUyMTB8R1QtUDUyMTBYfFNNLVQzMTF8U00tVDMxMHxTTS1UMzEwWHxTTS1UMjEwfFNNLVQyMTBSfFNNLVQyMTF8U00tUDYwMHxTTS1QNjAxfFNNLVA2MDV8U00tUDkwMHxTTS1QOTAxfFNNLVQyMTd8U00tVDIxN0F8U00tVDIxN1N8U00tUDYwMDB8U00tVDMxMDB8U0dILUk0Njd8WEU1MDB8U00tVDExMHxHVC1QNTIyMHxHVC1JOTIwMFh8R1QtTjUxMTBYfEdULU41MTIwfFNNLVA5MDV8U00tVDExMXxTTS1UMjEwNXxTTS1UMzE1fFNNLVQzMjB8U00tVDMyMFh8U00tVDMyMXxTTS1UNTIwfFNNLVQ1MjV8U00tVDUzME5VfFNNLVQyMzBOVXxTTS1UMzMwTlV8U00tVDkwMHxYRTUwMFQxQ3xTTS1QNjA1VnxTTS1QOTA1VnxTTS1UMzM3VnxTTS1UNTM3VnxTTS1UNzA3VnxTTS1UODA3VnxTTS1QNjAwWHxTTS1QOTAwWHxTTS1UMjEwWHxTTS1UMjMwfFNNLVQyMzBYfFNNLVQzMjV8R1QtUDc1MDN8U00tVDUzMXxTTS1UMzMwfFNNLVQ1MzB8U00tVDcwNXxTTS1UNzA1Q3xTTS1UNTM1fFNNLVQzMzF8U00tVDgwMHxTTS1UNzAwfFNNLVQ1Mzd8U00tVDgwN3xTTS1QOTA3QXxTTS1UMzM3QXxTTS1UNTM3QXxTTS1UNzA3QXxTTS1UODA3QXxTTS1UMjM3fFNNLVQ4MDdQfFNNLVA2MDdUfFNNLVQyMTdUfFNNLVQzMzdUfFNNLVQ4MDdUfFNNLVQxMTZOUXxTTS1UMTE2QlV8U00tUDU1MHxTTS1UMzUwfFNNLVQ1NTB8U00tVDkwMDB8U00tUDkwMDB8U00tVDcwNVl8U00tVDgwNXxHVC1QMzExM3xTTS1UNzEwfFNNLVQ4MTB8U00tVDgxNXxTTS1UMzYwfFNNLVQ1MzN8U00tVDExM3xTTS1UMzM1fFNNLVQ3MTV8U00tVDU2MHxTTS1UNjcwfFNNLVQ2Nzd8U00tVDM3N3xTTS1UNTY3fFNNLVQzNTdUfFNNLVQ1NTV8U00tVDU2MXxTTS1UNzEzfFNNLVQ3MTl8U00tVDgxM3xTTS1UODE5fFNNLVQ1ODB8U00tVDM1NVk/fFNNLVQyODB8U00tVDgxN0F8U00tVDgyMHxTTS1XNzAwfFNNLVA1ODB8U00tVDU4N3xTTS1QMzUwfFNNLVA1NTVNfFNNLVAzNTVNfFNNLVQxMTNOVXxTTS1UODE1WXxTTS1UNTg1fFNNLVQyODV8U00tVDgyNXxTTS1XNzA4XCIsS2luZGxlOlwiS2luZGxlfFNpbGsuKkFjY2VsZXJhdGVkfEFuZHJvaWQuKlxcXFxiKEtGT1R8S0ZUVHxLRkpXSXxLRkpXQXxLRk9URXxLRlNPV0l8S0ZUSFdJfEtGVEhXQXxLRkFQV0l8S0ZBUFdBfFdGSldBRXxLRlNBV0F8S0ZTQVdJfEtGQVNXSXxLRkFSV0l8S0ZGT1dJfEtGR0lXSXxLRk1FV0kpXFxcXGJ8QW5kcm9pZC4qU2lsay9bMC05Ll0rIGxpa2UgQ2hyb21lL1swLTkuXSsgKD8hTW9iaWxlKVwiLFN1cmZhY2VUYWJsZXQ6XCJXaW5kb3dzIE5UIFswLTkuXSs7IEFSTTsuKihUYWJsZXR8QVJNQkpTKVwiLEhQVGFibGV0OlwiSFAgU2xhdGUgKDd8OHwxMCl8SFAgRWxpdGVQYWQgOTAwfGhwLXRhYmxldHxFbGl0ZUJvb2suKlRvdWNofEhQIDh8U2xhdGUgMjF8SFAgU2xhdGVCb29rIDEwXCIsQXN1c1RhYmxldDpcIl4uKlBhZEZvbmUoKD8hTW9iaWxlKS4pKiR8VHJhbnNmb3JtZXJ8VEYxMDF8VEYxMDFHfFRGMzAwVHxURjMwMFRHfFRGMzAwVEx8VEY3MDBUfFRGNzAwS0x8VEY3MDFUfFRGODEwQ3xNRTE3MXxNRTMwMVR8TUUzMDJDfE1FMzcxTUd8TUUzNzBUfE1FMzcyTUd8TUUxNzJWfE1FMTczWHxNRTQwMEN8U2xpZGVyIFNMMTAxfFxcXFxiSzAwRlxcXFxifFxcXFxiSzAwQ1xcXFxifFxcXFxiSzAwRVxcXFxifFxcXFxiSzAwTFxcXFxifFRYMjAxTEF8TUUxNzZDfE1FMTAyQXxcXFxcYk04MFRBXFxcXGJ8TUUzNzJDTHxNRTU2MENHfE1FMzcyQ0d8TUUzMDJLTHwgSzAxMCB8IEswMTEgfCBLMDE3IHwgSzAxRSB8TUU1NzJDfE1FMTAzS3xNRTE3MEN8TUUxNzFDfFxcXFxiTUU3MENcXFxcYnxNRTU4MUN8TUU1ODFDTHxNRTg1MTBDfE1FMTgxQ3xQMDFZfFBPMU1BfFAwMVp8XFxcXGJQMDI3XFxcXGJ8XFxcXGJQMDI0XFxcXGJ8XFxcXGJQMDBDXFxcXGJcIixCbGFja0JlcnJ5VGFibGV0OlwiUGxheUJvb2t8UklNIFRhYmxldFwiLEhUQ3RhYmxldDpcIkhUQ19GbHllcl9QNTEyfEhUQyBGbHllcnxIVEMgSmV0c3RyZWFtfEhUQy1QNzE1YXxIVEMgRVZPIFZpZXcgNEd8UEc0MTIwMHxQRzA5NDEwXCIsTW90b3JvbGFUYWJsZXQ6XCJ4b29tfHNob2xlc3R8TVo2MTV8TVo2MDV8TVo1MDV8TVo2MDF8TVo2MDJ8TVo2MDN8TVo2MDR8TVo2MDZ8TVo2MDd8TVo2MDh8TVo2MDl8TVo2MTV8TVo2MTZ8TVo2MTdcIixOb29rVGFibGV0OlwiQW5kcm9pZC4qTm9va3xOb29rQ29sb3J8bm9vayBicm93c2VyfEJOUlYyMDB8Qk5SVjIwMEF8Qk5UVjI1MHxCTlRWMjUwQXxCTlRWNDAwfEJOVFY2MDB8TG9naWNQRCBab29tMlwiLEFjZXJUYWJsZXQ6XCJBbmRyb2lkLio7IFxcXFxiKEExMDB8QTEwMXxBMTEwfEEyMDB8QTIxMHxBMjExfEE1MDB8QTUwMXxBNTEwfEE1MTF8QTcwMHxBNzAxfFc1MDB8VzUwMFB8VzUwMXxXNTAxUHxXNTEwfFc1MTF8VzcwMHxHMTAwfEcxMDBXfEIxLUE3MXxCMS03MTB8QjEtNzExfEExLTgxMHxBMS04MTF8QTEtODMwKVxcXFxifFczLTgxMHxcXFxcYkEzLUExMFxcXFxifFxcXFxiQTMtQTExXFxcXGJ8XFxcXGJBMy1BMjBcXFxcYnxcXFxcYkEzLUEzMFwiLFRvc2hpYmFUYWJsZXQ6XCJBbmRyb2lkLiooQVQxMDB8QVQxMDV8QVQyMDB8QVQyMDV8QVQyNzB8QVQyNzV8QVQzMDB8QVQzMDV8QVQxUzV8QVQ1MDB8QVQ1NzB8QVQ3MDB8QVQ4MzApfFRPU0hJQkEuKkZPTElPXCIsTEdUYWJsZXQ6XCJcXFxcYkwtMDZDfExHLVY5MDl8TEctVjkwMHxMRy1WNzAwfExHLVY1MTB8TEctVjUwMHxMRy1WNDEwfExHLVY0MDB8TEctVks4MTBcXFxcYlwiLEZ1aml0c3VUYWJsZXQ6XCJBbmRyb2lkLipcXFxcYihGLTAxRHxGLTAyRnxGLTA1RXxGLTEwRHxNNTMyfFE1NzIpXFxcXGJcIixQcmVzdGlnaW9UYWJsZXQ6XCJQTVAzMTcwQnxQTVAzMjcwQnxQTVAzNDcwQnxQTVA3MTcwQnxQTVAzMzcwQnxQTVAzNTcwQ3xQTVA1ODcwQ3xQTVAzNjcwQnxQTVA1NTcwQ3xQTVA1NzcwRHxQTVAzOTcwQnxQTVAzODcwQ3xQTVA1NTgwQ3xQTVA1ODgwRHxQTVA1NzgwRHxQTVA1NTg4Q3xQTVA3MjgwQ3xQTVA3MjgwQzNHfFBNUDcyODB8UE1QNzg4MER8UE1QNTU5N0R8UE1QNTU5N3xQTVA3MTAwRHxQRVIzNDY0fFBFUjMyNzR8UEVSMzU3NHxQRVIzODg0fFBFUjUyNzR8UEVSNTQ3NHxQTVA1MDk3Q1BST3xQTVA1MDk3fFBNUDczODBEfFBNUDUyOTdDfFBNUDUyOTdDX1FVQUR8UE1QODEyRXxQTVA4MTJFM0d8UE1QODEyRnxQTVA4MTBFfFBNUDg4MFREfFBNVDMwMTd8UE1UMzAzN3xQTVQzMDQ3fFBNVDMwNTd8UE1UNzAwOHxQTVQ1ODg3fFBNVDUwMDF8UE1UNTAwMlwiLExlbm92b1RhYmxldDpcIkxlbm92byBUQUJ8SWRlYShUYWJ8UGFkKSggQTF8QTEwfCBLMXwpfFRoaW5rUGFkKFsgXSspP1RhYmxldHxZVDMtODUwTXxZVDMtWDkwTHxZVDMtWDkwRnxZVDMtWDkwWHxMZW5vdm8uKihTMjEwOXxTMjExMHxTNTAwMHxTNjAwMHxLMzAxMXxBMzAwMHxBMzUwMHxBMTAwMHxBMjEwN3xBMjEwOXxBMTEwN3xBNTUwMHxBNzYwMHxCNjAwMHxCODAwMHxCODA4MCkoLXwpKEZMfEZ8SFZ8SHwpfFRCLVgxMDNGfFRCLVgzMDRGfFRCLVgzMDRMfFRCLTg3MDNGfFRhYjJBNy0xMEZcIixEZWxsVGFibGV0OlwiVmVudWUgMTF8VmVudWUgOHxWZW51ZSA3fERlbGwgU3RyZWFrIDEwfERlbGwgU3RyZWFrIDdcIixZYXJ2aWtUYWJsZXQ6XCJBbmRyb2lkLipcXFxcYihUQUIyMTB8VEFCMjExfFRBQjIyNHxUQUIyNTB8VEFCMjYwfFRBQjI2NHxUQUIzMTB8VEFCMzYwfFRBQjM2NHxUQUI0MTB8VEFCNDExfFRBQjQyMHxUQUI0MjR8VEFCNDUwfFRBQjQ2MHxUQUI0NjF8VEFCNDY0fFRBQjQ2NXxUQUI0Njd8VEFCNDY4fFRBQjA3LTEwMHxUQUIwNy0xMDF8VEFCMDctMTUwfFRBQjA3LTE1MXxUQUIwNy0xNTJ8VEFCMDctMjAwfFRBQjA3LTIwMS0zR3xUQUIwNy0yMTB8VEFCMDctMjExfFRBQjA3LTIxMnxUQUIwNy0yMTR8VEFCMDctMjIwfFRBQjA3LTQwMHxUQUIwNy00ODV8VEFCMDgtMTUwfFRBQjA4LTIwMHxUQUIwOC0yMDEtM0d8VEFCMDgtMjAxLTMwfFRBQjA5LTEwMHxUQUIwOS0yMTF8VEFCMDktNDEwfFRBQjEwLTE1MHxUQUIxMC0yMDF8VEFCMTAtMjExfFRBQjEwLTQwMHxUQUIxMC00MTB8VEFCMTMtMjAxfFRBQjI3NEVVS3xUQUIyNzVFVUt8VEFCMzc0RVVLfFRBQjQ2MkVVS3xUQUI0NzRFVUt8VEFCOS0yMDApXFxcXGJcIixNZWRpb25UYWJsZXQ6XCJBbmRyb2lkLipcXFxcYk9ZT1xcXFxifExJRkUuKihQOTIxMnxQOTUxNHxQOTUxNnxTOTUxMil8TElGRVRBQlwiLEFybm92YVRhYmxldDpcIjk3RzR8QU4xMEcyfEFON2JHM3xBTjdmRzN8QU44RzN8QU44Y0czfEFON0czfEFOOUczfEFON2RHM3xBTjdkRzNTVHxBTjdkRzNDaGlsZFBhZHxBTjEwYkczfEFOMTBiRzNEVHxBTjlHMlwiLEludGVuc29UYWJsZXQ6XCJJTk04MDAyS1B8SU5NMTAxMEZQfElOTTgwNU5EfEludGVuc28gVGFifFRBQjEwMDRcIixJUlVUYWJsZXQ6XCJNNzAycHJvXCIsTWVnYWZvblRhYmxldDpcIk1lZ2FGb24gVjl8XFxcXGJaVEUgVjlcXFxcYnxBbmRyb2lkLipcXFxcYk1UN0FcXFxcYlwiLEVib2RhVGFibGV0OlwiRS1Cb2RhIChTdXByZW1lfEltcHJlc3NwZWVkfEl6enljb21tfEVzc2VudGlhbClcIixBbGxWaWV3VGFibGV0OlwiQWxsdmlldy4qKFZpdmF8QWxsZHJvfENpdHl8U3BlZWR8QWxsIFRWfEZyZW56eXxRdWFzYXJ8U2hpbmV8VFgxfEFYMXxBWDIpXCIsQXJjaG9zVGFibGV0OlwiXFxcXGIoMTAxRzl8ODBHOXxBMTAxSVQpXFxcXGJ8UWlsaXZlIDk3UnxBcmNob3M1fFxcXFxiQVJDSE9TICg3MHw3OXw4MHw5MHw5N3wxMDF8RkFNSUxZUEFEfCkoYnxjfCkoRzEwfCBDb2JhbHR8IFRJVEFOSVVNKEhEfCl8IFhlbm9ufCBOZW9ufFhTS3wgMnwgWFMgMnwgUExBVElOVU18IENBUkJPTnxHQU1FUEFEKVxcXFxiXCIsQWlub2xUYWJsZXQ6XCJOT1ZPN3xOT1ZPOHxOT1ZPMTB8Tm92bzdBdXJvcmF8Tm92bzdCYXNpY3xOT1ZPN1BBTEFESU58bm92bzktU3BhcmtcIixOb2tpYUx1bWlhVGFibGV0OlwiTHVtaWEgMjUyMFwiLFNvbnlUYWJsZXQ6XCJTb255LipUYWJsZXR8WHBlcmlhIFRhYmxldHxTb255IFRhYmxldCBTfFNPLTAzRXxTR1BUMTJ8U0dQVDEzfFNHUFQxMTR8U0dQVDEyMXxTR1BUMTIyfFNHUFQxMjN8U0dQVDExMXxTR1BUMTEyfFNHUFQxMTN8U0dQVDEzMXxTR1BUMTMyfFNHUFQxMzN8U0dQVDIxMXxTR1BUMjEyfFNHUFQyMTN8U0dQMzExfFNHUDMxMnxTR1AzMjF8RUJSRDExMDF8RUJSRDExMDJ8RUJSRDEyMDF8U0dQMzUxfFNHUDM0MXxTR1A1MTF8U0dQNTEyfFNHUDUyMXxTR1A1NDF8U0dQNTUxfFNHUDYyMXxTR1A2MTJ8U09UMzFcIixQaGlsaXBzVGFibGV0OlwiXFxcXGIoUEkyMDEwfFBJMzAwMHxQSTMxMDB8UEkzMTA1fFBJMzExMHxQSTMyMDV8UEkzMjEwfFBJMzkwMHxQSTQwMTB8UEk3MDAwfFBJNzEwMClcXFxcYlwiLEN1YmVUYWJsZXQ6XCJBbmRyb2lkLiooSzhHVHxVOUdUfFUxMEdUfFUxNkdUfFUxN0dUfFUxOEdUfFUxOUdUfFUyMEdUfFUyM0dUfFUzMEdUKXxDVUJFIFU4R1RcIixDb2J5VGFibGV0OlwiTUlEMTA0MnxNSUQxMDQ1fE1JRDExMjV8TUlEMTEyNnxNSUQ3MDEyfE1JRDcwMTR8TUlENzAxNXxNSUQ3MDM0fE1JRDcwMzV8TUlENzAzNnxNSUQ3MDQyfE1JRDcwNDh8TUlENzEyN3xNSUQ4MDQyfE1JRDgwNDh8TUlEODEyN3xNSUQ5MDQyfE1JRDk3NDB8TUlEOTc0MnxNSUQ3MDIyfE1JRDcwMTBcIixNSURUYWJsZXQ6XCJNOTcwMXxNOTAwMHxNOTEwMHxNODA2fE0xMDUyfE04MDZ8VDcwM3xNSUQ3MDF8TUlENzEzfE1JRDcxMHxNSUQ3Mjd8TUlENzYwfE1JRDgzMHxNSUQ3Mjh8TUlEOTMzfE1JRDEyNXxNSUQ4MTB8TUlENzMyfE1JRDEyMHxNSUQ5MzB8TUlEODAwfE1JRDczMXxNSUQ5MDB8TUlEMTAwfE1JRDgyMHxNSUQ3MzV8TUlEOTgwfE1JRDEzMHxNSUQ4MzN8TUlENzM3fE1JRDk2MHxNSUQxMzV8TUlEODYwfE1JRDczNnxNSUQxNDB8TUlEOTMwfE1JRDgzNXxNSUQ3MzN8TUlENFgxMFwiLE1TSVRhYmxldDpcIk1TSSBcXFxcYihQcmltbyA3M0t8UHJpbW8gNzNMfFByaW1vIDgxTHxQcmltbyA3N3xQcmltbyA5M3xQcmltbyA3NXxQcmltbyA3NnxQcmltbyA3M3xQcmltbyA4MXxQcmltbyA5MXxQcmltbyA5MHxFbmpveSA3MXxFbmpveSA3fEVuam95IDEwKVxcXFxiXCIsU01pVFRhYmxldDpcIkFuZHJvaWQuKihcXFxcYk1JRFxcXFxifE1JRC01NjB8TVRWLVQxMjAwfE1UVi1QTkQ1MzF8TVRWLVAxMTAxfE1UVi1QTkQ1MzApXCIsUm9ja0NoaXBUYWJsZXQ6XCJBbmRyb2lkLiooUksyODE4fFJLMjgwOEF8UksyOTE4fFJLMzA2Nil8UksyNzM4fFJLMjgwOEFcIixGbHlUYWJsZXQ6XCJJUTMxMHxGbHkgVmlzaW9uXCIsYnFUYWJsZXQ6XCJBbmRyb2lkLiooYnEpPy4qKEVsY2Fub3xDdXJpZXxFZGlzb258TWF4d2VsbHxLZXBsZXJ8UGFzY2FsfFRlc2xhfEh5cGF0aWF8UGxhdG9ufE5ld3RvbnxMaXZpbmdzdG9uZXxDZXJ2YW50ZXN8QXZhbnR8QXF1YXJpcyAoW0V8TV0xMHxNOCkpfE1heHdlbGwuKkxpdGV8TWF4d2VsbC4qUGx1c1wiLEh1YXdlaVRhYmxldDpcIk1lZGlhUGFkfE1lZGlhUGFkIDcgWW91dGh8SURFT1MgUzd8UzctMjAxY3xTNy0yMDJ1fFM3LTEwMXxTNy0xMDN8UzctMTA0fFM3LTEwNXxTNy0xMDZ8UzctMjAxfFM3LVNsaW18TTItQTAxTHxCQUgtTDA5fEJBSC1XMDlcIixOZWNUYWJsZXQ6XCJcXFxcYk4tMDZEfFxcXFxiTi0wOERcIixQYW50ZWNoVGFibGV0OlwiUGFudGVjaC4qUDQxMDBcIixCcm9uY2hvVGFibGV0OlwiQnJvbmNoby4qKE43MDF8TjcwOHxOODAyfGE3MTApXCIsVmVyc3VzVGFibGV0OlwiVE9VQ0hQQUQuKls3ODkxMF18XFxcXGJUT1VDSFRBQlxcXFxiXCIsWnluY1RhYmxldDpcInoxMDAwfFo5OSAyR3x6OTl8ejkzMHx6OTk5fHo5OTB8ejkwOXxaOTE5fHo5MDBcIixQb3NpdGl2b1RhYmxldDpcIlRCMDdTVEF8VEIxMFNUQXxUQjA3RlRBfFRCMTBGVEFcIixOYWJpVGFibGV0OlwiQW5kcm9pZC4qXFxcXGJOYWJpXCIsS29ib1RhYmxldDpcIktvYm8gVG91Y2h8XFxcXGJLMDgwXFxcXGJ8XFxcXGJWb3hcXFxcYiBCdWlsZHxcXFxcYkFyY1xcXFxiIEJ1aWxkXCIsRGFuZXdUYWJsZXQ6XCJEU2xpZGUuKlxcXFxiKDcwMHw3MDFSfDcwMnw3MDNSfDcwNHw4MDJ8OTcwfDk3MXw5NzJ8OTczfDk3NHwxMDEwfDEwMTIpXFxcXGJcIixUZXhldFRhYmxldDpcIk5hdmlQYWR8VEItNzcyQXxUTS03MDQ1fFRNLTcwNTV8VE0tOTc1MHxUTS03MDE2fFRNLTcwMjR8VE0tNzAyNnxUTS03MDQxfFRNLTcwNDN8VE0tNzA0N3xUTS04MDQxfFRNLTk3NDF8VE0tOTc0N3xUTS05NzQ4fFRNLTk3NTF8VE0tNzAyMnxUTS03MDIxfFRNLTcwMjB8VE0tNzAxMXxUTS03MDEwfFRNLTcwMjN8VE0tNzAyNXxUTS03MDM3V3xUTS03MDM4V3xUTS03MDI3V3xUTS05NzIwfFRNLTk3MjV8VE0tOTczN1d8VE0tMTAyMHxUTS05NzM4V3xUTS05NzQwfFRNLTk3NDNXfFRCLTgwN0F8VEItNzcxQXxUQi03MjdBfFRCLTcyNUF8VEItNzE5QXxUQi04MjNBfFRCLTgwNUF8VEItNzIzQXxUQi03MTVBfFRCLTcwN0F8VEItNzA1QXxUQi03MDlBfFRCLTcxMUF8VEItODkwSER8VEItODgwSER8VEItNzkwSER8VEItNzgwSER8VEItNzcwSER8VEItNzIxSER8VEItNzEwSER8VEItNDM0SER8VEItODYwSER8VEItODQwSER8VEItNzYwSER8VEItNzUwSER8VEItNzQwSER8VEItNzMwSER8VEItNzIySER8VEItNzIwSER8VEItNzAwSER8VEItNTAwSER8VEItNDcwSER8VEItNDMxSER8VEItNDMwSER8VEItNTA2fFRCLTUwNHxUQi00NDZ8VEItNDM2fFRCLTQxNnxUQi0xNDZTRXxUQi0xMjZTRVwiLFBsYXlzdGF0aW9uVGFibGV0OlwiUGxheXN0YXRpb24uKihQb3J0YWJsZXxWaXRhKVwiLFRyZWtzdG9yVGFibGV0OlwiU1QxMDQxNi0xfFZUMTA0MTYtMXxTVDcwNDA4LTF8U1Q3MDJ4eC0xfFNUNzAyeHgtMnxTVDgwMjA4fFNUOTcyMTZ8U1Q3MDEwNC0yfFZUMTA0MTYtMnxTVDEwMjE2LTJBfFN1cmZUYWJcIixQeWxlQXVkaW9UYWJsZXQ6XCJcXFxcYihQVEJMMTBDRVV8UFRCTDEwQ3xQVEJMNzJCQ3xQVEJMNzJCQ0VVfFBUQkw3Q0VVfFBUQkw3Q3xQVEJMOTJCQ3xQVEJMOTJCQ0VVfFBUQkw5Q0VVfFBUQkw5Q1VLfFBUQkw5QylcXFxcYlwiLEFkdmFuVGFibGV0OlwiQW5kcm9pZC4qIFxcXFxiKEUzQXxUM1h8VDVDfFQ1QnxUM0V8VDNDfFQzQnxUMUp8VDFGfFQyQXxUMUh8VDFpfEUxQ3xUMS1FfFQ1LUF8VDR8RTEtQnxUMkNpfFQxLUJ8VDEtRHxPMS1BfEUxLUF8VDEtQXxUM0F8VDRpKVxcXFxiIFwiLERhbnlUZWNoVGFibGV0OlwiR2VuaXVzIFRhYiBHM3xHZW5pdXMgVGFiIFMyfEdlbml1cyBUYWIgUTN8R2VuaXVzIFRhYiBHNHxHZW5pdXMgVGFiIFE0fEdlbml1cyBUYWIgRy1JSXxHZW5pdXMgVEFCIEdJSXxHZW5pdXMgVEFCIEdJSUl8R2VuaXVzIFRhYiBTMVwiLEdhbGFwYWRUYWJsZXQ6XCJBbmRyb2lkLipcXFxcYkcxXFxcXGJcIixNaWNyb21heFRhYmxldDpcIkZ1bmJvb2t8TWljcm9tYXguKlxcXFxiKFAyNTB8UDU2MHxQMzYwfFAzNjJ8UDYwMHxQMzAwfFAzNTB8UDUwMHxQMjc1KVxcXFxiXCIsS2FyYm9ublRhYmxldDpcIkFuZHJvaWQuKlxcXFxiKEEzOXxBMzd8QTM0fFNUOHxTVDEwfFNUN3xTbWFydCBUYWIzfFNtYXJ0IFRhYjIpXFxcXGJcIixBbGxGaW5lVGFibGV0OlwiRmluZTcgR2VuaXVzfEZpbmU3IFNoaW5lfEZpbmU3IEFpcnxGaW5lOCBTdHlsZXxGaW5lOSBNb3JlfEZpbmUxMCBKb3l8RmluZTExIFdpZGVcIixQUk9TQ0FOVGFibGV0OlwiXFxcXGIoUEVNNjN8UExUMTAyM0d8UExUMTA0MXxQTFQxMDQ0fFBMVDEwNDRHfFBMVDEwOTF8UExUNDMxMXxQTFQ0MzExUEx8UExUNDMxNXxQTFQ3MDMwfFBMVDcwMzN8UExUNzAzM0R8UExUNzAzNXxQTFQ3MDM1RHxQTFQ3MDQ0S3xQTFQ3MDQ1S3xQTFQ3MDQ1S0J8UExUNzA3MUtHfFBMVDcwNzJ8UExUNzIyM0d8UExUNzIyNUd8UExUNzc3N0d8UExUNzgxMEt8UExUNzg0OUd8UExUNzg1MUd8UExUNzg1Mkd8UExUODAxNXxQTFQ4MDMxfFBMVDgwMzR8UExUODAzNnxQTFQ4MDgwS3xQTFQ4MDgyfFBMVDgwODh8UExUODIyM0d8UExUODIzNEd8UExUODIzNUd8UExUODgxNkt8UExUOTAxMXxQTFQ5MDQ1S3xQTFQ5MjMzR3xQTFQ5NzM1fFBMVDk3NjBHfFBMVDk3NzBHKVxcXFxiXCIsWU9ORVNUYWJsZXQ6XCJCUTEwNzh8QkMxMDAzfEJDMTA3N3xSSzk3MDJ8QkM5NzMwfEJDOTAwMXxJVDkwMDF8QkM3MDA4fEJDNzAxMHxCQzcwOHxCQzcyOHxCQzcwMTJ8QkM3MDMwfEJDNzAyN3xCQzcwMjZcIixDaGFuZ0ppYVRhYmxldDpcIlRQQzcxMDJ8VFBDNzEwM3xUUEM3MTA1fFRQQzcxMDZ8VFBDNzEwN3xUUEM3MjAxfFRQQzcyMDN8VFBDNzIwNXxUUEM3MjEwfFRQQzc3MDh8VFBDNzcwOXxUUEM3NzEyfFRQQzcxMTB8VFBDODEwMXxUUEM4MTAzfFRQQzgxMDV8VFBDODEwNnxUUEM4MjAzfFRQQzgyMDV8VFBDODUwM3xUUEM5MTA2fFRQQzk3MDF8VFBDOTcxMDF8VFBDOTcxMDN8VFBDOTcxMDV8VFBDOTcxMDZ8VFBDOTcxMTF8VFBDOTcxMTN8VFBDOTcyMDN8VFBDOTc2MDN8VFBDOTc4MDl8VFBDOTcyMDV8VFBDMTAxMDF8VFBDMTAxMDN8VFBDMTAxMDZ8VFBDMTAxMTF8VFBDMTAyMDN8VFBDMTAyMDV8VFBDMTA1MDNcIixHVVRhYmxldDpcIlRYLUExMzAxfFRYLU05MDAyfFE3MDJ8a2YwMjZcIixQb2ludE9mVmlld1RhYmxldDpcIlRBQi1QNTA2fFRBQi1uYXZpLTctM0ctTXxUQUItUDUxN3xUQUItUC01Mjd8VEFCLVA3MDF8VEFCLVA3MDN8VEFCLVA3MjF8VEFCLVA3MzFOfFRBQi1QNzQxfFRBQi1QODI1fFRBQi1QOTA1fFRBQi1QOTI1fFRBQi1QUjk0NXxUQUItUEwxMDE1fFRBQi1QMTAyNXxUQUItUEkxMDQ1fFRBQi1QMTMyNXxUQUItUFJPVEFCWzAtOV0rfFRBQi1QUk9UQUIyNXxUQUItUFJPVEFCMjZ8VEFCLVBST1RBQjI3fFRBQi1QUk9UQUIyNlhMfFRBQi1QUk9UQUIyLUlQUzl8VEFCLVBST1RBQjMwLUlQUzl8VEFCLVBST1RBQjI1WFhMfFRBQi1QUk9UQUIyNi1JUFMxMHxUQUItUFJPVEFCMzAtSVBTMTBcIixPdmVybWF4VGFibGV0OlwiT1YtKFN0ZWVsQ29yZXxOZXdCYXNlfEJhc2Vjb3JlfEJhc2VvbmV8RXhlbGxlbnxRdWF0dG9yfEVkdVRhYnxTb2x1dGlvbnxBQ1RJT058QmFzaWNUYWJ8VGVkZHlUYWJ8TWFnaWNUYWJ8U3RyZWFtfFRCLTA4fFRCLTA5KXxRdWFsY29yZSAxMDI3XCIsSENMVGFibGV0OlwiSENMLipUYWJsZXR8Q29ubmVjdC0zRy0yLjB8Q29ubmVjdC0yRy0yLjB8TUUgVGFibGV0IFUxfE1FIFRhYmxldCBVMnxNRSBUYWJsZXQgRzF8TUUgVGFibGV0IFgxfE1FIFRhYmxldCBZMnxNRSBUYWJsZXQgU3luY1wiLERQU1RhYmxldDpcIkRQUyBEcmVhbSA5fERQUyBEdWFsIDdcIixWaXN0dXJlVGFibGV0OlwiVjk3IEhEfGk3NSAzR3xWaXN0dXJlIFY0KCBIRCk/fFZpc3R1cmUgVjUoIEhEKT98VmlzdHVyZSBWMTBcIixDcmVzdGFUYWJsZXQ6XCJDVFAoLSk/ODEwfENUUCgtKT84MTh8Q1RQKC0pPzgyOHxDVFAoLSk/ODM4fENUUCgtKT84ODh8Q1RQKC0pPzk3OHxDVFAoLSk/OTgwfENUUCgtKT85ODd8Q1RQKC0pPzk4OHxDVFAoLSk/OTg5XCIsTWVkaWF0ZWtUYWJsZXQ6XCJcXFxcYk1UODEyNXxNVDgzODl8TVQ4MTM1fE1UODM3N1xcXFxiXCIsQ29uY29yZGVUYWJsZXQ6XCJDb25jb3JkZShbIF0rKT9UYWJ8Q29uQ29yZGUgUmVhZE1hblwiLEdvQ2xldmVyVGFibGV0OlwiR09DTEVWRVIgVEFCfEE3R09DTEVWRVJ8TTEwNDJ8TTc4NDF8TTc0MnxSMTA0MkJLfFIxMDQxfFRBQiBBOTc1fFRBQiBBNzg0MnxUQUIgQTc0MXxUQUIgQTc0MUx8VEFCIE03MjNHfFRBQiBNNzIxfFRBQiBBMTAyMXxUQUIgSTkyMXxUQUIgUjcyMXxUQUIgSTcyMHxUQUIgVDc2fFRBQiBSNzB8VEFCIFI3Ni4yfFRBQiBSMTA2fFRBQiBSODMuMnxUQUIgTTgxM0d8VEFCIEk3MjF8R0NUQTcyMnxUQUIgSTcwfFRBQiBJNzF8VEFCIFM3M3xUQUIgUjczfFRBQiBSNzR8VEFCIFI5M3xUQUIgUjc1fFRBQiBSNzYuMXxUQUIgQTczfFRBQiBBOTN8VEFCIEE5My4yfFRBQiBUNzJ8VEFCIFI4M3xUQUIgUjk3NHxUQUIgUjk3M3xUQUIgQTEwMXxUQUIgQTEwM3xUQUIgQTEwNHxUQUIgQTEwNC4yfFIxMDVCS3xNNzEzR3xBOTcyQkt8VEFCIEE5NzF8VEFCIFI5NzQuMnxUQUIgUjEwNHxUQUIgUjgzLjN8VEFCIEExMDQyXCIsTW9kZWNvbVRhYmxldDpcIkZyZWVUQUIgOTAwMHxGcmVlVEFCIDcuNHxGcmVlVEFCIDcwMDR8RnJlZVRBQiA3ODAwfEZyZWVUQUIgMjA5NnxGcmVlVEFCIDcuNXxGcmVlVEFCIDEwMTR8RnJlZVRBQiAxMDAxIHxGcmVlVEFCIDgwMDF8RnJlZVRBQiA5NzA2fEZyZWVUQUIgOTcwMnxGcmVlVEFCIDcwMDN8RnJlZVRBQiA3MDAyfEZyZWVUQUIgMTAwMnxGcmVlVEFCIDc4MDF8RnJlZVRBQiAxMzMxfEZyZWVUQUIgMTAwNHxGcmVlVEFCIDgwMDJ8RnJlZVRBQiA4MDE0fEZyZWVUQUIgOTcwNHxGcmVlVEFCIDEwMDNcIixWb25pbm9UYWJsZXQ6XCJcXFxcYihBcmd1c1sgX10/U3xEaWFtb25kWyBfXT83OUhEfEVtZXJhbGRbIF9dPzc4RXxMdW5hWyBfXT83MEN8T255eFsgX10/U3xPbnl4WyBfXT9afE9yaW5bIF9dP0hEfE9yaW5bIF9dP1N8T3Rpc1sgX10/U3xTcGVlZFN0YXJbIF9dP1N8TWFnbmV0WyBfXT9NOXxQcmltdXNbIF9dPzk0WyBfXT8zR3xQcmltdXNbIF9dPzk0SER8UHJpbXVzWyBfXT9RU3xBbmRyb2lkLipcXFxcYlE4XFxcXGJ8U2lyaXVzWyBfXT9FVk9bIF9dP1FTfFNpcml1c1sgX10/UVN8U3Bpcml0WyBfXT9TKVxcXFxiXCIsRUNTVGFibGV0OlwiVjA3T1QyfFRNMTA1QXxTMTBPVDF8VFIxMENTMVwiLFN0b3JleFRhYmxldDpcImVaZWVbXyddPyhUYWJ8R28pWzAtOV0rfFRhYkxDN3xMb29uZXkgVHVuZXMgVGFiXCIsVm9kYWZvbmVUYWJsZXQ6XCJTbWFydFRhYihbIF0rKT9bMC05XSt8U21hcnRUYWJJSTEwfFNtYXJ0VGFiSUk3fFZGLTE0OTdcIixFc3NlbnRpZWxCVGFibGV0OlwiU21hcnRbICddP1RBQlsgXSs/WzAtOV0rfEZhbWlseVsgJ10/VEFCMlwiLFJvc3NNb29yVGFibGV0OlwiUk0tNzkwfFJNLTk5N3xSTUQtODc4R3xSTUQtOTc0UnxSTVQtNzA1QXxSTVQtNzAxfFJNRS02MDF8Uk1ULTUwMXxSTVQtNzExXCIsaU1vYmlsZVRhYmxldDpcImktbW9iaWxlIGktbm90ZVwiLFRvbGlub1RhYmxldDpcInRvbGlubyB0YWIgWzAtOS5dK3x0b2xpbm8gc2hpbmVcIixBdWRpb1NvbmljVGFibGV0OlwiXFxcXGJDLTIyUXxUNy1RQ3xULTE3QnxULTE3UFxcXFxiXCIsQU1QRVRhYmxldDpcIkFuZHJvaWQuKiBBNzggXCIsU2trVGFibGV0OlwiQW5kcm9pZC4qIChTS1lQQUR8UEhPRU5JWHxDWUNMT1BTKVwiLFRlY25vVGFibGV0OlwiVEVDTk8gUDl8VEVDTk8gRFA4RFwiLEpYRFRhYmxldDpcIkFuZHJvaWQuKiBcXFxcYihGMzAwMHxBMzMwMHxKWEQ1MDAwfEpYRDMwMDB8SlhEMjAwMHxKWEQzMDBCfEpYRDMwMHxTNTgwMHxTNzgwMHxTNjAyYnxTNTExMGJ8UzczMDB8UzUzMDB8UzYwMnxTNjAzfFM1MTAwfFM1MTEwfFM2MDF8UzcxMDBhfFAzMDAwRnxQMzAwMHN8UDEwMXxQMjAwc3xQMTAwMG18UDIwMG18UDkxMDB8UDEwMDBzfFM2NjAwYnxTOTA4fFAxMDAwfFAzMDB8UzE4fFM2NjAwfFM5MTAwKVxcXFxiXCIsaUpveVRhYmxldDpcIlRhYmxldCAoU3Bpcml0IDd8RXNzZW50aWF8R2FsYXRlYXxGdXNpb258T25peCA3fExhbmRhfFRpdGFufFNjb29ieXxEZW94fFN0ZWxsYXxUaGVtaXN8QXJnb258VW5pcXVlIDd8U3lnbnVzfEhleGVufEZpbml0eSA3fENyZWFtfENyZWFtIFgyfEphZGV8TmVvbiA3fE5lcm9uIDd8S2FuZHl8U2NhcGV8U2FwaHlyIDd8UmViZWx8QmlveHxSZWJlbHxSZWJlbCA4R0J8TXlzdHxEcmFjbyA3fE15c3R8VGFiNy0wMDR8TXlzdHxUYWRlbyBKb25lc3xUYWJsZXQgQm9pbmd8QXJyb3d8RHJhY28gRHVhbCBDYW18QXVyaXh8TWludHxBbWl0eXxSZXZvbHV0aW9ufEZpbml0eSA5fE5lb24gOXxUOXd8QW1pdHkgNEdCIER1YWwgQ2FtfFN0b25lIDRHQnxTdG9uZSA4R0J8QW5kcm9tZWRhfFNpbGtlbnxYMnxBbmRyb21lZGEgSUl8SGFsbGV5fEZsYW1lfFNhcGh5ciA5LDd8VG91Y2ggOHxQbGFuZXR8VHJpdG9ufFVuaXF1ZSAxMHxIZXhlbiAxMHxNZW1waGlzIDRHQnxNZW1waGlzIDhHQnxPbml4IDEwKVwiLEZYMlRhYmxldDpcIkZYMiBQQUQ3fEZYMiBQQUQxMFwiLFhvcm9UYWJsZXQ6XCJLaWRzUEFEIDcwMXxQQURbIF0/NzEyfFBBRFsgXT83MTR8UEFEWyBdPzcxNnxQQURbIF0/NzE3fFBBRFsgXT83MTh8UEFEWyBdPzcyMHxQQURbIF0/NzIxfFBBRFsgXT83MjJ8UEFEWyBdPzc5MHxQQURbIF0/NzkyfFBBRFsgXT85MDB8UEFEWyBdPzk3MTVEfFBBRFsgXT85NzE2RFJ8UEFEWyBdPzk3MThEUnxQQURbIF0/OTcxOVFSfFBBRFsgXT85NzIwUVJ8VGVsZVBBRDEwMzB8VGVsZXBhZDEwMzJ8VGVsZVBBRDczMHxUZWxlUEFENzMxfFRlbGVQQUQ3MzJ8VGVsZVBBRDczNVF8VGVsZVBBRDgzMHxUZWxlUEFEOTczMHxUZWxlUEFENzk1fE1lZ2FQQUQgMTMzMXxNZWdhUEFEIDE4NTF8TWVnYVBBRCAyMTUxXCIsVmlld3NvbmljVGFibGV0OlwiVmlld1BhZCAxMHBpfFZpZXdQYWQgMTBlfFZpZXdQYWQgMTBzfFZpZXdQYWQgRTcyfFZpZXdQYWQ3fFZpZXdQYWQgRTEwMHxWaWV3UGFkIDdlfFZpZXdTb25pYyBWQjczM3xWQjEwMGFcIixWZXJpem9uVGFibGV0OlwiUVRBUVozfFFUQUlSN3xRVEFRVFozfFFUQVNVTjF8UVRBU1VOMnxRVEFYSUExXCIsT2R5c1RhYmxldDpcIkxPT1h8WEVOTzEwfE9EWVNbIC1dKFNwYWNlfEVWT3xYcHJlc3N8Tk9PTil8XFxcXGJYRUxJT1xcXFxifFhlbGlvMTBQcm98WEVMSU83UEhPTkVUQUJ8WEVMSU8xMEVYVFJFTUV8WEVMSU9QVDJ8TkVPX1FVQUQxMFwiLENhcHRpdmFUYWJsZXQ6XCJDQVBUSVZBIFBBRFwiLEljb25iaXRUYWJsZXQ6XCJOZXRUQUJ8TlQtMzcwMnxOVC0zNzAyU3xOVC0zNzAyU3xOVC0zNjAzUHxOVC0zNjAzUHxOVC0wNzA0U3xOVC0wNzA0U3xOVC0zODA1Q3xOVC0zODA1Q3xOVC0wODA2Q3xOVC0wODA2Q3xOVC0wOTA5VHxOVC0wOTA5VHxOVC0wOTA3U3xOVC0wOTA3U3xOVC0wOTAyU3xOVC0wOTAyU1wiLFRlY2xhc3RUYWJsZXQ6XCJUOTggNEd8XFxcXGJQODBcXFxcYnxcXFxcYlg5MEhEXFxcXGJ8WDk4IEFpcnxYOTggQWlyIDNHfFxcXFxiWDg5XFxcXGJ8UDgwIDNHfFxcXFxiWDgwaFxcXFxifFA5OCBBaXJ8XFxcXGJYODlIRFxcXFxifFA5OCAzR3xcXFxcYlA5MEhEXFxcXGJ8UDg5IDNHfFg5OCAzR3xcXFxcYlA3MGhcXFxcYnxQNzlIRCAzR3xHMThkIDNHfFxcXFxiUDc5SERcXFxcYnxcXFxcYlA4OXNcXFxcYnxcXFxcYkE4OFxcXFxifFxcXFxiUDEwSERcXFxcYnxcXFxcYlAxOUhEXFxcXGJ8RzE4IDNHfFxcXFxiUDc4SERcXFxcYnxcXFxcYkE3OFxcXFxifFxcXFxiUDc1XFxcXGJ8RzE3cyAzR3xHMTdoIDNHfFxcXFxiUDg1dFxcXFxifFxcXFxiUDkwXFxcXGJ8XFxcXGJQMTFcXFxcYnxcXFxcYlA5OHRcXFxcYnxcXFxcYlA5OEhEXFxcXGJ8XFxcXGJHMThkXFxcXGJ8XFxcXGJQODVzXFxcXGJ8XFxcXGJQMTFIRFxcXFxifFxcXFxiUDg4c1xcXFxifFxcXFxiQTgwSERcXFxcYnxcXFxcYkE4MHNlXFxcXGJ8XFxcXGJBMTBoXFxcXGJ8XFxcXGJQODlcXFxcYnxcXFxcYlA3OHNcXFxcYnxcXFxcYkcxOFxcXFxifFxcXFxiUDg1XFxcXGJ8XFxcXGJBNzBoXFxcXGJ8XFxcXGJBNzBcXFxcYnxcXFxcYkcxN1xcXFxifFxcXFxiUDE4XFxcXGJ8XFxcXGJBODBzXFxcXGJ8XFxcXGJBMTFzXFxcXGJ8XFxcXGJQODhIRFxcXFxifFxcXFxiQTgwaFxcXFxifFxcXFxiUDc2c1xcXFxifFxcXFxiUDc2aFxcXFxifFxcXFxiUDk4XFxcXGJ8XFxcXGJBMTBIRFxcXFxifFxcXFxiUDc4XFxcXGJ8XFxcXGJQODhcXFxcYnxcXFxcYkExMVxcXFxifFxcXFxiQTEwdFxcXFxifFxcXFxiUDc2YVxcXFxifFxcXFxiUDc2dFxcXFxifFxcXFxiUDc2ZVxcXFxifFxcXFxiUDg1SERcXFxcYnxcXFxcYlA4NWFcXFxcYnxcXFxcYlA4NlxcXFxifFxcXFxiUDc1SERcXFxcYnxcXFxcYlA3NnZcXFxcYnxcXFxcYkExMlxcXFxifFxcXFxiUDc1YVxcXFxifFxcXFxiQTE1XFxcXGJ8XFxcXGJQNzZUaVxcXFxifFxcXFxiUDgxSERcXFxcYnxcXFxcYkExMFxcXFxifFxcXFxiVDc2MFZFXFxcXGJ8XFxcXGJUNzIwSERcXFxcYnxcXFxcYlA3NlxcXFxifFxcXFxiUDczXFxcXGJ8XFxcXGJQNzFcXFxcYnxcXFxcYlA3MlxcXFxifFxcXFxiVDcyMFNFXFxcXGJ8XFxcXGJDNTIwVGlcXFxcYnxcXFxcYlQ3NjBcXFxcYnxcXFxcYlQ3MjBWRVxcXFxifFQ3MjAtM0dFfFQ3MjAtV2lGaVwiLE9uZGFUYWJsZXQ6XCJcXFxcYihWOTc1aXxWaTMwfFZYNTMwfFY3MDF8Vmk2MHxWNzAxc3xWaTUwfFY4MDFzfFY3MTl8Vng2MTB3fFZYNjEwV3xWODE5aXxWaTEwfFZYNTgwV3xWaTEwfFY3MTFzfFY4MTN8VjgxMXxWODIwd3xWODIwfFZpMjB8VjcxMXxWSTMwV3xWNzEyfFY4OTF3fFY5NzJ8VjgxOXd8VjgyMHd8Vmk2MHxWODIwd3xWNzExfFY4MTNzfFY4MDF8VjgxOXxWOTc1c3xWODAxfFY4MTl8VjgxOXxWODE4fFY4MTF8VjcxMnxWOTc1bXxWMTAxd3xWOTYxd3xWODEyfFY4MTh8Vjk3MXxWOTcxc3xWOTE5fFY5ODl8VjExNnd8VjEwMnd8Vjk3M3xWaTQwKVxcXFxiW1xcXFxzXStcIixKYXl0ZWNoVGFibGV0OlwiVFBDLVBBNzYyXCIsQmxhdXB1bmt0VGFibGV0OlwiRW5kZWF2b3VyIDgwME5HfEVuZGVhdm91ciAxMDEwXCIsRGlnbWFUYWJsZXQ6XCJcXFxcYihpRHgxMHxpRHg5fGlEeDh8aUR4N3xpRHhEN3xpRHhEOHxpRHNROHxpRHNRN3xpRHNROHxpRHNEMTB8aURuRDd8M1RTODA0SHxpRHNRMTF8aURqN3xpRHMxMClcXFxcYlwiLEV2b2xpb1RhYmxldDpcIkFSSUFfTWluaV93aWZpfEFyaWFbIF9dTWluaXxFdm9saW8gWDEwfEV2b2xpbyBYN3xFdm9saW8gWDh8XFxcXGJFdm90YWJcXFxcYnxcXFxcYk5ldXJhXFxcXGJcIixMYXZhVGFibGV0OlwiUVBBRCBFNzA0fFxcXFxiSXZvcnlTXFxcXGJ8RS1UQUIgSVZPUll8XFxcXGJFLVRBQlxcXFxiXCIsQW9jVGFibGV0OlwiTVcwODExfE1XMDgxMnxNVzA5MjJ8TVRLODM4MnxNVzEwMzF8TVcwODMxfE1XMDgyMXxNVzA5MzF8TVcwNzEyXCIsTXBtYW5UYWJsZXQ6XCJNUDExIE9DVEF8TVAxMCBPQ1RBfE1QUUMxMTE0fE1QUUMxMDA0fE1QUUM5OTR8TVBRQzk3NHxNUFFDOTczfE1QUUM4MDR8TVBRQzc4NHxNUFFDNzgwfFxcXFxiTVBHN1xcXFxifE1QRENHNzV8TVBEQ0c3MXxNUERDMTAwNnxNUDEwMURDfE1QREM5MDAwfE1QREM5MDV8TVBEQzcwNkhEfE1QREM3MDZ8TVBEQzcwNXxNUERDMTEwfE1QREMxMDB8TVBEQzk5fE1QREM5N3xNUERDODh8TVBEQzh8TVBEQzc3fE1QNzA5fE1JRDcwMXxNSUQ3MTF8TUlEMTcwfE1QREM3MDN8TVBRQzEwMTBcIixDZWxrb25UYWJsZXQ6XCJDVDY5NXxDVDg4OHxDVFtcXFxcc10/OTEwfENUNyBUYWJ8Q1Q5IFRhYnxDVDMgVGFifENUMiBUYWJ8Q1QxIFRhYnxDODIwfEM3MjB8XFxcXGJDVC0xXFxcXGJcIixXb2xkZXJUYWJsZXQ6XCJtaVRhYiBcXFxcYihESUFNT05EfFNQQUNFfEJST09LTFlOfE5FT3xGTFl8TUFOSEFUVEFOfEZVTkt8RVZPTFVUSU9OfFNLWXxHT0NBUnxJUk9OfEdFTklVU3xQT1B8TUlOVHxFUFNJTE9OfEJST0FEV0FZfEpVTVB8SE9QfExFR0VORHxORVcgQUdFfExJTkV8QURWQU5DRXxGRUVMfEZPTExPV3xMSUtFfExJTkt8TElWRXxUSElOS3xGUkVFRE9NfENISUNBR098Q0xFVkVMQU5EfEJBTFRJTU9SRS1HSHxJT1dBfEJPU1RPTnxTRUFUVExFfFBIT0VOSVh8REFMTEFTfElOIDEwMXxNYXN0ZXJDaGVmKVxcXFxiXCIsTWVkaWFjb21UYWJsZXQ6XCJNLU1QSTEwQzNHfE0tU1AxMEVHfE0tU1AxMEVHUHxNLVNQMTBIWEFIfE0tU1A3SFhBSHxNLVNQMTBIWEJIfE0tU1A4SFhBSHxNLVNQOE1YQVwiLE1pVGFibGV0OlwiXFxcXGJNSSBQQURcXFxcYnxcXFxcYkhNIE5PVEUgMVdcXFxcYlwiLE5pYmlydVRhYmxldDpcIk5pYmlydSBNMXxOaWJpcnUgSnVwaXRlciBPbmVcIixOZXhvVGFibGV0OlwiTkVYTyBOT1ZBfE5FWE8gMTB8TkVYTyBBVklPfE5FWE8gRlJFRXxORVhPIEdPfE5FWE8gRVZPfE5FWE8gM0d8TkVYTyBTTUFSVHxORVhPIEtJRERPfE5FWE8gTU9CSVwiLExlYWRlclRhYmxldDpcIlRCTFQxMFF8VEJMVDEwSXxUQkwtMTBXREtCfFRCTC0xMFdES0JPMjAxM3xUQkwtVzIzMFYyfFRCTC1XNDUwfFRCTC1XNTAwfFNWNTcyfFRCTFQ3SXxUQkEtQUM3LThHfFRCTFQ3OXxUQkwtOFcxNnxUQkwtMTBXMzJ8VEJMLTEwV0tCfFRCTC1XMTAwXCIsVWJpc2xhdGVUYWJsZXQ6XCJVYmlTbGF0ZVtcXFxcc10/N0NcIixQb2NrZXRCb29rVGFibGV0OlwiUG9ja2V0Ym9va1wiLEtvY2Fzb1RhYmxldDpcIlxcXFxiKFRCLTEyMDcpXFxcXGJcIixIaXNlbnNlVGFibGV0OlwiXFxcXGIoRjUyODF8RTIzNzEpXFxcXGJcIixIdWRsOlwiSHVkbCBIVDdTM3xIdWRsIDJcIixUZWxzdHJhVGFibGV0OlwiVC1IdWIyXCIsR2VuZXJpY1RhYmxldDpcIkFuZHJvaWQuKlxcXFxiOTdEXFxcXGJ8VGFibGV0KD8hLipQQyl8Qk5UVjI1MEF8TUlELVdDRE1BfExvZ2ljUEQgWm9vbTJ8XFxcXGJBN0VCXFxcXGJ8Q2F0Tm92YTh8QTFfMDd8Q1Q3MDR8Q1QxMDAyfFxcXFxiTTcyMVxcXFxifHJrMzBzZGt8XFxcXGJFVk9UQUJcXFxcYnxNNzU4QXxFVDkwNHxBTFVNSVVNMTB8U21hcnRmcmVuIFRhYnxFbmRlYXZvdXIgMTAxMHxUYWJsZXQtUEMtNHxUYWdpIFRhYnxcXFxcYk02cHJvXFxcXGJ8Q1QxMDIwV3xhcmMgMTBIRHxcXFxcYlRQNzUwXFxcXGJ8XFxcXGJRVEFRWjNcXFxcYnxXVlQxMDF8VE0xMDg4fEtUMTA3XCJ9LG9zczp7QW5kcm9pZE9TOlwiQW5kcm9pZFwiLEJsYWNrQmVycnlPUzpcImJsYWNrYmVycnl8XFxcXGJCQjEwXFxcXGJ8cmltIHRhYmxldCBvc1wiLFBhbG1PUzpcIlBhbG1PU3xhdmFudGdvfGJsYXplcnxlbGFpbmV8aGlwdG9wfHBhbG18cGx1Y2tlcnx4aWlub1wiLFN5bWJpYW5PUzpcIlN5bWJpYW58U3ltYk9TfFNlcmllczYwfFNlcmllczQwfFNZQi1bMC05XSt8XFxcXGJTNjBcXFxcYlwiLFdpbmRvd3NNb2JpbGVPUzpcIldpbmRvd3MgQ0UuKihQUEN8U21hcnRwaG9uZXxNb2JpbGV8WzAtOV17M314WzAtOV17M30pfFdpbmRvdyBNb2JpbGV8V2luZG93cyBQaG9uZSBbMC05Ll0rfFdDRTtcIixXaW5kb3dzUGhvbmVPUzpcIldpbmRvd3MgUGhvbmUgMTAuMHxXaW5kb3dzIFBob25lIDguMXxXaW5kb3dzIFBob25lIDguMHxXaW5kb3dzIFBob25lIE9TfFhCTFdQN3xadW5lV1A3fFdpbmRvd3MgTlQgNi5bMjNdOyBBUk07XCIsaU9TOlwiXFxcXGJpUGhvbmUuKk1vYmlsZXxcXFxcYmlQb2R8XFxcXGJpUGFkfEFwcGxlQ29yZU1lZGlhXCIsTWVlR29PUzpcIk1lZUdvXCIsTWFlbW9PUzpcIk1hZW1vXCIsSmF2YU9TOlwiSjJNRS98XFxcXGJNSURQXFxcXGJ8XFxcXGJDTERDXFxcXGJcIix3ZWJPUzpcIndlYk9TfGhwd09TXCIsYmFkYU9TOlwiXFxcXGJCYWRhXFxcXGJcIixCUkVXT1M6XCJCUkVXXCJ9LHVhczp7Q2hyb21lOlwiXFxcXGJDck1vXFxcXGJ8Q3JpT1N8QW5kcm9pZC4qQ2hyb21lL1suMC05XSogKE1vYmlsZSk/XCIsRG9sZmluOlwiXFxcXGJEb2xmaW5cXFxcYlwiLE9wZXJhOlwiT3BlcmEuKk1pbml8T3BlcmEuKk1vYml8QW5kcm9pZC4qT3BlcmF8TW9iaWxlLipPUFIvWzAtOS5dK3xDb2FzdC9bMC05Ll0rXCIsU2t5ZmlyZTpcIlNreWZpcmVcIixFZGdlOlwiTW9iaWxlIFNhZmFyaS9bLjAtOV0qIEVkZ2VcIixJRTpcIklFTW9iaWxlfE1TSUVNb2JpbGVcIixGaXJlZm94OlwiZmVubmVjfGZpcmVmb3guKm1hZW1vfChNb2JpbGV8VGFibGV0KS4qRmlyZWZveHxGaXJlZm94LipNb2JpbGV8RnhpT1NcIixCb2x0OlwiYm9sdFwiLFRlYVNoYXJrOlwidGVhc2hhcmtcIixCbGF6ZXI6XCJCbGF6ZXJcIixTYWZhcmk6XCJWZXJzaW9uLipNb2JpbGUuKlNhZmFyaXxTYWZhcmkuKk1vYmlsZXxNb2JpbGVTYWZhcmlcIixVQ0Jyb3dzZXI6XCJVQy4qQnJvd3NlcnxVQ1dFQlwiLGJhaWR1Ym94YXBwOlwiYmFpZHVib3hhcHBcIixiYWlkdWJyb3dzZXI6XCJiYWlkdWJyb3dzZXJcIixEaWlnb0Jyb3dzZXI6XCJEaWlnb0Jyb3dzZXJcIixQdWZmaW46XCJQdWZmaW5cIixNZXJjdXJ5OlwiXFxcXGJNZXJjdXJ5XFxcXGJcIixPYmlnb0Jyb3dzZXI6XCJPYmlnb1wiLE5ldEZyb250OlwiTkYtQnJvd3NlclwiLEdlbmVyaWNCcm93c2VyOlwiTm9raWFCcm93c2VyfE92aUJyb3dzZXJ8T25lQnJvd3NlcnxUd29ua3lCZWFtQnJvd3NlcnxTRU1DLipCcm93c2VyfEZseUZsb3d8TWluaW1vfE5ldEZyb250fE5vdmFycmEtVmlzaW9ufE1RUUJyb3dzZXJ8TWljcm9NZXNzZW5nZXJcIixQYWxlTW9vbjpcIkFuZHJvaWQuKlBhbGVNb29ufE1vYmlsZS4qUGFsZU1vb25cIn0scHJvcHM6e01vYmlsZTpcIk1vYmlsZS9bVkVSXVwiLEJ1aWxkOlwiQnVpbGQvW1ZFUl1cIixWZXJzaW9uOlwiVmVyc2lvbi9bVkVSXVwiLFZlbmRvcklEOlwiVmVuZG9ySUQvW1ZFUl1cIixpUGFkOlwiaVBhZC4qQ1BVW2EteiBdK1tWRVJdXCIsaVBob25lOlwiaVBob25lLipDUFVbYS16IF0rW1ZFUl1cIixpUG9kOlwiaVBvZC4qQ1BVW2EteiBdK1tWRVJdXCIsS2luZGxlOlwiS2luZGxlL1tWRVJdXCIsQ2hyb21lOltcIkNocm9tZS9bVkVSXVwiLFwiQ3JpT1MvW1ZFUl1cIixcIkNyTW8vW1ZFUl1cIl0sQ29hc3Q6W1wiQ29hc3QvW1ZFUl1cIl0sRG9sZmluOlwiRG9sZmluL1tWRVJdXCIsRmlyZWZveDpbXCJGaXJlZm94L1tWRVJdXCIsXCJGeGlPUy9bVkVSXVwiXSxGZW5uZWM6XCJGZW5uZWMvW1ZFUl1cIixFZGdlOlwiRWRnZS9bVkVSXVwiLElFOltcIklFTW9iaWxlL1tWRVJdO1wiLFwiSUVNb2JpbGUgW1ZFUl1cIixcIk1TSUUgW1ZFUl07XCIsXCJUcmlkZW50L1swLTkuXSs7LipydjpbVkVSXVwiXSxOZXRGcm9udDpcIk5ldEZyb250L1tWRVJdXCIsTm9raWFCcm93c2VyOlwiTm9raWFCcm93c2VyL1tWRVJdXCIsT3BlcmE6W1wiIE9QUi9bVkVSXVwiLFwiT3BlcmEgTWluaS9bVkVSXVwiLFwiVmVyc2lvbi9bVkVSXVwiXSxcIk9wZXJhIE1pbmlcIjpcIk9wZXJhIE1pbmkvW1ZFUl1cIixcIk9wZXJhIE1vYmlcIjpcIlZlcnNpb24vW1ZFUl1cIixVQ0Jyb3dzZXI6W1wiVUNXRUJbVkVSXVwiLFwiVUMuKkJyb3dzZXIvW1ZFUl1cIl0sTVFRQnJvd3NlcjpcIk1RUUJyb3dzZXIvW1ZFUl1cIixNaWNyb01lc3NlbmdlcjpcIk1pY3JvTWVzc2VuZ2VyL1tWRVJdXCIsYmFpZHVib3hhcHA6XCJiYWlkdWJveGFwcC9bVkVSXVwiLGJhaWR1YnJvd3NlcjpcImJhaWR1YnJvd3Nlci9bVkVSXVwiLFNhbXN1bmdCcm93c2VyOlwiU2Ftc3VuZ0Jyb3dzZXIvW1ZFUl1cIixJcm9uOlwiSXJvbi9bVkVSXVwiLFNhZmFyaTpbXCJWZXJzaW9uL1tWRVJdXCIsXCJTYWZhcmkvW1ZFUl1cIl0sU2t5ZmlyZTpcIlNreWZpcmUvW1ZFUl1cIixUaXplbjpcIlRpemVuL1tWRVJdXCIsV2Via2l0Olwid2Via2l0WyAvXVtWRVJdXCIsUGFsZU1vb246XCJQYWxlTW9vbi9bVkVSXVwiLEdlY2tvOlwiR2Vja28vW1ZFUl1cIixUcmlkZW50OlwiVHJpZGVudC9bVkVSXVwiLFByZXN0bzpcIlByZXN0by9bVkVSXVwiLEdvYW5uYTpcIkdvYW5uYS9bVkVSXVwiLGlPUzpcIiBcXFxcYmk/T1NcXFxcYiBbVkVSXVsgO117MX1cIixBbmRyb2lkOlwiQW5kcm9pZCBbVkVSXVwiLEJsYWNrQmVycnk6W1wiQmxhY2tCZXJyeVtcXFxcd10rL1tWRVJdXCIsXCJCbGFja0JlcnJ5LipWZXJzaW9uL1tWRVJdXCIsXCJWZXJzaW9uL1tWRVJdXCJdLEJSRVc6XCJCUkVXIFtWRVJdXCIsSmF2YTpcIkphdmEvW1ZFUl1cIixcIldpbmRvd3MgUGhvbmUgT1NcIjpbXCJXaW5kb3dzIFBob25lIE9TIFtWRVJdXCIsXCJXaW5kb3dzIFBob25lIFtWRVJdXCJdLFwiV2luZG93cyBQaG9uZVwiOlwiV2luZG93cyBQaG9uZSBbVkVSXVwiLFwiV2luZG93cyBDRVwiOlwiV2luZG93cyBDRS9bVkVSXVwiLFwiV2luZG93cyBOVFwiOlwiV2luZG93cyBOVCBbVkVSXVwiLFN5bWJpYW46W1wiU3ltYmlhbk9TL1tWRVJdXCIsXCJTeW1iaWFuL1tWRVJdXCJdLHdlYk9TOltcIndlYk9TL1tWRVJdXCIsXCJocHdPUy9bVkVSXTtcIl19LHV0aWxzOntCb3Q6XCJHb29nbGVib3R8ZmFjZWJvb2tleHRlcm5hbGhpdHxBZHNCb3QtR29vZ2xlfEdvb2dsZSBLZXl3b3JkIFN1Z2dlc3Rpb258RmFjZWJvdHxZYW5kZXhCb3R8WWFuZGV4TW9iaWxlQm90fGJpbmdib3R8aWFfYXJjaGl2ZXJ8QWhyZWZzQm90fEV6b29tc3xHU0xGYm90fFdCU2VhcmNoQm90fFR3aXR0ZXJib3R8VHdlZXRtZW1lQm90fFR3aWtsZXxQYXBlckxpQm90fFdvdGJveHxVbndpbmRGZXRjaG9yfEV4YWJvdHxNSjEyYm90fFlhbmRleEltYWdlc3xUdXJuaXRpbkJvdHxQaW5nZG9tXCIsTW9iaWxlQm90OlwiR29vZ2xlYm90LU1vYmlsZXxBZHNCb3QtR29vZ2xlLU1vYmlsZXxZYWhvb1NlZWtlci9NMUExLVIyRDJcIixEZXNrdG9wTW9kZTpcIldQRGVza3RvcFwiLFRWOlwiU29ueURUVnxIYmJUVlwiLFdlYktpdDpcIih3ZWJraXQpWyAvXShbXFxcXHcuXSspXCIsQ29uc29sZTpcIlxcXFxiKE5pbnRlbmRvfE5pbnRlbmRvIFdpaVV8TmludGVuZG8gM0RTfE5pbnRlbmRvIFN3aXRjaHxQTEFZU1RBVElPTnxYYm94KVxcXFxiXCIsV2F0Y2g6XCJTTS1WNzAwXCJ9fSxkZXRlY3RNb2JpbGVCcm93c2Vyczp7ZnVsbFBhdHRlcm46LyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWluby9pLHNob3J0UGF0dGVybjovMTIwN3w2MzEwfDY1OTB8M2dzb3w0dGhwfDUwWzEtNl1pfDc3MHN8ODAyc3xhIHdhfGFiYWN8YWMoZXJ8b298c1xcLSl8YWkoa298cm4pfGFsKGF2fGNhfGNvKXxhbW9pfGFuKGV4fG55fHl3KXxhcHR1fGFyKGNofGdvKXxhcyh0ZXx1cyl8YXR0d3xhdShkaXxcXC1tfHIgfHMgKXxhdmFufGJlKGNrfGxsfG5xKXxiaShsYnxyZCl8YmwoYWN8YXopfGJyKGV8dil3fGJ1bWJ8YndcXC0obnx1KXxjNTVcXC98Y2FwaXxjY3dhfGNkbVxcLXxjZWxsfGNodG18Y2xkY3xjbWRcXC18Y28obXB8bmQpfGNyYXd8ZGEoaXR8bGx8bmcpfGRidGV8ZGNcXC1zfGRldml8ZGljYXxkbW9ifGRvKGN8cClvfGRzKDEyfFxcLWQpfGVsKDQ5fGFpKXxlbShsMnx1bCl8ZXIoaWN8azApfGVzbDh8ZXooWzQtN10wfG9zfHdhfHplKXxmZXRjfGZseShcXC18Xyl8ZzEgdXxnNTYwfGdlbmV8Z2ZcXC01fGdcXC1tb3xnbyhcXC53fG9kKXxncihhZHx1bil8aGFpZXxoY2l0fGhkXFwtKG18cHx0KXxoZWlcXC18aGkocHR8dGEpfGhwKCBpfGlwKXxoc1xcLWN8aHQoYyhcXC18IHxffGF8Z3xwfHN8dCl8dHApfGh1KGF3fHRjKXxpXFwtKDIwfGdvfG1hKXxpMjMwfGlhYyggfFxcLXxcXC8pfGlicm98aWRlYXxpZzAxfGlrb218aW0xa3xpbm5vfGlwYXF8aXJpc3xqYSh0fHYpYXxqYnJvfGplbXV8amlnc3xrZGRpfGtlaml8a2d0KCB8XFwvKXxrbG9ufGtwdCB8a3djXFwtfGt5byhjfGspfGxlKG5vfHhpKXxsZyggZ3xcXC8oa3xsfHUpfDUwfDU0fFxcLVthLXddKXxsaWJ3fGx5bnh8bTFcXC13fG0zZ2F8bTUwXFwvfG1hKHRlfHVpfHhvKXxtYygwMXwyMXxjYSl8bVxcLWNyfG1lKHJjfHJpKXxtaShvOHxvYXx0cyl8bW1lZnxtbygwMXwwMnxiaXxkZXxkb3x0KFxcLXwgfG98dil8enopfG10KDUwfHAxfHYgKXxtd2JwfG15d2F8bjEwWzAtMl18bjIwWzItM118bjMwKDB8Mil8bjUwKDB8Mnw1KXxuNygwKDB8MSl8MTApfG5lKChjfG0pXFwtfG9ufHRmfHdmfHdnfHd0KXxub2soNnxpKXxuenBofG8yaW18b3AodGl8d3YpfG9yYW58b3dnMXxwODAwfHBhbihhfGR8dCl8cGR4Z3xwZygxM3xcXC0oWzEtOF18YykpfHBoaWx8cGlyZXxwbChheXx1Yyl8cG5cXC0yfHBvKGNrfHJ0fHNlKXxwcm94fHBzaW98cHRcXC1nfHFhXFwtYXxxYygwN3wxMnwyMXwzMnw2MHxcXC1bMi03XXxpXFwtKXxxdGVrfHIzODB8cjYwMHxyYWtzfHJpbTl8cm8odmV8em8pfHM1NVxcL3xzYShnZXxtYXxtbXxtc3xueXx2YSl8c2MoMDF8aFxcLXxvb3xwXFwtKXxzZGtcXC98c2UoYyhcXC18MHwxKXw0N3xtY3xuZHxyaSl8c2doXFwtfHNoYXJ8c2llKFxcLXxtKXxza1xcLTB8c2woNDV8aWQpfHNtKGFsfGFyfGIzfGl0fHQ1KXxzbyhmdHxueSl8c3AoMDF8aFxcLXx2XFwtfHYgKXxzeSgwMXxtYil8dDIoMTh8NTApfHQ2KDAwfDEwfDE4KXx0YShndHxsayl8dGNsXFwtfHRkZ1xcLXx0ZWwoaXxtKXx0aW1cXC18dFxcLW1vfHRvKHBsfHNoKXx0cyg3MHxtXFwtfG0zfG01KXx0eFxcLTl8dXAoXFwuYnxnMXxzaSl8dXRzdHx2NDAwfHY3NTB8dmVyaXx2aShyZ3x0ZSl8dmsoNDB8NVswLTNdfFxcLXYpfHZtNDB8dm9kYXx2dWxjfHZ4KDUyfDUzfDYwfDYxfDcwfDgwfDgxfDgzfDg1fDk4KXx3M2MoXFwtfCApfHdlYmN8d2hpdHx3aShnIHxuY3xudyl8d21sYnx3b251fHg3MDB8eWFzXFwtfHlvdXJ8emV0b3x6dGVcXC0vaSx0YWJsZXRQYXR0ZXJuOi9hbmRyb2lkfGlwYWR8cGxheWJvb2t8c2lsay9pfX0sdCx1PU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7cmV0dXJuIHMuRkFMTEJBQ0tfUEhPTkU9XCJVbmtub3duUGhvbmVcIixzLkZBTExCQUNLX1RBQkxFVD1cIlVua25vd25UYWJsZXRcIixzLkZBTExCQUNLX01PQklMRT1cIlVua25vd25Nb2JpbGVcIix0PVwiaXNBcnJheVwiaW4gQXJyYXk/QXJyYXkuaXNBcnJheTpmdW5jdGlvbih2KXtyZXR1cm5cIltvYmplY3QgQXJyYXldXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodil9LGZ1bmN0aW9uKCl7dmFyIHYsdyx4LHkseixBLEI9cy5tb2JpbGVEZXRlY3RSdWxlcztmb3IodiBpbiBCLnByb3BzKWlmKHUuY2FsbChCLnByb3BzLHYpKXtmb3Iodz1CLnByb3BzW3ZdLHQodyl8fCh3PVt3XSksej13Lmxlbmd0aCx5PTA7eTx6OysreSl4PXdbeV0sQT14LmluZGV4T2YoXCJbVkVSXVwiKSwwPD1BJiYoeD14LnN1YnN0cmluZygwLEEpK1wiKFtcXFxcdy5fXFxcXCtdKylcIit4LnN1YnN0cmluZyhBKzUpKSx3W3ldPW5ldyBSZWdFeHAoeCxcImlcIik7Qi5wcm9wc1t2XT13fXAoQi5vc3MpLHAoQi5waG9uZXMpLHAoQi50YWJsZXRzKSxwKEIudWFzKSxwKEIudXRpbHMpLEIub3NzMD17V2luZG93c1Bob25lT1M6Qi5vc3MuV2luZG93c1Bob25lT1MsV2luZG93c01vYmlsZU9TOkIub3NzLldpbmRvd3NNb2JpbGVPU319KCkscy5maW5kTWF0Y2g9ZnVuY3Rpb24odix3KXtmb3IodmFyIHggaW4gdilpZih1LmNhbGwodix4KSYmdlt4XS50ZXN0KHcpKXJldHVybiB4O3JldHVybiBudWxsfSxzLmZpbmRNYXRjaGVzPWZ1bmN0aW9uKHYsdyl7dmFyIHg9W107Zm9yKHZhciB5IGluIHYpdS5jYWxsKHYseSkmJnZbeV0udGVzdCh3KSYmeC5wdXNoKHkpO3JldHVybiB4fSxzLmdldFZlcnNpb25TdHI9ZnVuY3Rpb24odix3KXt2YXIgeCx5LHosQSxCPXMubW9iaWxlRGV0ZWN0UnVsZXMucHJvcHM7aWYodS5jYWxsKEIsdikpZm9yKHg9Qlt2XSx6PXgubGVuZ3RoLHk9MDt5PHo7Kyt5KWlmKEE9eFt5XS5leGVjKHcpLG51bGwhPT1BKXJldHVybiBBWzFdO3JldHVybiBudWxsfSxzLmdldFZlcnNpb249ZnVuY3Rpb24odix3KXt2YXIgeD1zLmdldFZlcnNpb25TdHIodix3KTtyZXR1cm4geD9zLnByZXBhcmVWZXJzaW9uTm8oeCk6TmFOfSxzLnByZXBhcmVWZXJzaW9uTm89ZnVuY3Rpb24odil7dmFyIHc7cmV0dXJuIHc9di5zcGxpdCgvW2Etei5fIFxcL1xcLV0vaSksMT09PXcubGVuZ3RoJiYodj13WzBdKSwxPHcubGVuZ3RoJiYodj13WzBdK1wiLlwiLHcuc2hpZnQoKSx2Kz13LmpvaW4oXCJcIikpLCt2fSxzLmlzTW9iaWxlRmFsbGJhY2s9ZnVuY3Rpb24odil7cmV0dXJuIHMuZGV0ZWN0TW9iaWxlQnJvd3NlcnMuZnVsbFBhdHRlcm4udGVzdCh2KXx8cy5kZXRlY3RNb2JpbGVCcm93c2Vycy5zaG9ydFBhdHRlcm4udGVzdCh2LnN1YnN0cigwLDQpKX0scy5pc1RhYmxldEZhbGxiYWNrPWZ1bmN0aW9uKHYpe3JldHVybiBzLmRldGVjdE1vYmlsZUJyb3dzZXJzLnRhYmxldFBhdHRlcm4udGVzdCh2KX0scy5wcmVwYXJlRGV0ZWN0aW9uQ2FjaGU9ZnVuY3Rpb24odix3LHgpe2lmKHYubW9iaWxlPT09bSl7dmFyIHkseixBO3JldHVybih6PXMuZmluZE1hdGNoKHMubW9iaWxlRGV0ZWN0UnVsZXMudGFibGV0cyx3KSk/KHYubW9iaWxlPXYudGFibGV0PXosdm9pZCh2LnBob25lPW51bGwpKTooeT1zLmZpbmRNYXRjaChzLm1vYmlsZURldGVjdFJ1bGVzLnBob25lcyx3KSk/KHYubW9iaWxlPXYucGhvbmU9eSx2b2lkKHYudGFibGV0PW51bGwpKTp2b2lkKHMuaXNNb2JpbGVGYWxsYmFjayh3KT8oQT1yLmlzUGhvbmVTaXplZCh4KSxBPT09bT8odi5tb2JpbGU9cy5GQUxMQkFDS19NT0JJTEUsdi50YWJsZXQ9di5waG9uZT1udWxsKTpBPyh2Lm1vYmlsZT12LnBob25lPXMuRkFMTEJBQ0tfUEhPTkUsdi50YWJsZXQ9bnVsbCk6KHYubW9iaWxlPXYudGFibGV0PXMuRkFMTEJBQ0tfVEFCTEVULHYucGhvbmU9bnVsbCkpOnMuaXNUYWJsZXRGYWxsYmFjayh3KT8odi5tb2JpbGU9di50YWJsZXQ9cy5GQUxMQkFDS19UQUJMRVQsdi5waG9uZT1udWxsKTp2Lm1vYmlsZT12LnRhYmxldD12LnBob25lPW51bGwpfX0scy5tb2JpbGVHcmFkZT1mdW5jdGlvbih2KXt2YXIgdz1udWxsIT09di5tb2JpbGUoKTtyZXR1cm4gdi5vcyhcImlPU1wiKSYmNC4zPD12LnZlcnNpb24oXCJpUGFkXCIpfHx2Lm9zKFwiaU9TXCIpJiYzLjE8PXYudmVyc2lvbihcImlQaG9uZVwiKXx8di5vcyhcImlPU1wiKSYmMy4xPD12LnZlcnNpb24oXCJpUG9kXCIpfHwyLjE8di52ZXJzaW9uKFwiQW5kcm9pZFwiKSYmdi5pcyhcIldlYmtpdFwiKXx8Nzw9di52ZXJzaW9uKFwiV2luZG93cyBQaG9uZSBPU1wiKXx8di5pcyhcIkJsYWNrQmVycnlcIikmJjY8PXYudmVyc2lvbihcIkJsYWNrQmVycnlcIil8fHYubWF0Y2goXCJQbGF5Ym9vay4qVGFibGV0XCIpfHwxLjQ8PXYudmVyc2lvbihcIndlYk9TXCIpJiZ2Lm1hdGNoKFwiUGFsbXxQcmV8UGl4aVwiKXx8di5tYXRjaChcImhwLipUb3VjaFBhZFwiKXx8di5pcyhcIkZpcmVmb3hcIikmJjEyPD12LnZlcnNpb24oXCJGaXJlZm94XCIpfHx2LmlzKFwiQ2hyb21lXCIpJiZ2LmlzKFwiQW5kcm9pZE9TXCIpJiY0PD12LnZlcnNpb24oXCJBbmRyb2lkXCIpfHx2LmlzKFwiU2t5ZmlyZVwiKSYmNC4xPD12LnZlcnNpb24oXCJTa3lmaXJlXCIpJiZ2LmlzKFwiQW5kcm9pZE9TXCIpJiYyLjM8PXYudmVyc2lvbihcIkFuZHJvaWRcIil8fHYuaXMoXCJPcGVyYVwiKSYmMTE8di52ZXJzaW9uKFwiT3BlcmEgTW9iaVwiKSYmdi5pcyhcIkFuZHJvaWRPU1wiKXx8di5pcyhcIk1lZUdvT1NcIil8fHYuaXMoXCJUaXplblwiKXx8di5pcyhcIkRvbGZpblwiKSYmMjw9di52ZXJzaW9uKFwiQmFkYVwiKXx8KHYuaXMoXCJVQyBCcm93c2VyXCIpfHx2LmlzKFwiRG9sZmluXCIpKSYmMi4zPD12LnZlcnNpb24oXCJBbmRyb2lkXCIpfHx2Lm1hdGNoKFwiS2luZGxlIEZpcmVcIil8fHYuaXMoXCJLaW5kbGVcIikmJjM8PXYudmVyc2lvbihcIktpbmRsZVwiKXx8di5pcyhcIkFuZHJvaWRPU1wiKSYmdi5pcyhcIk5vb2tUYWJsZXRcIil8fDExPD12LnZlcnNpb24oXCJDaHJvbWVcIikmJiF3fHw1PD12LnZlcnNpb24oXCJTYWZhcmlcIikmJiF3fHw0PD12LnZlcnNpb24oXCJGaXJlZm94XCIpJiYhd3x8Nzw9di52ZXJzaW9uKFwiTVNJRVwiKSYmIXd8fDEwPD12LnZlcnNpb24oXCJPcGVyYVwiKSYmIXc/XCJBXCI6di5vcyhcImlPU1wiKSYmNC4zPnYudmVyc2lvbihcImlQYWRcIil8fHYub3MoXCJpT1NcIikmJjMuMT52LnZlcnNpb24oXCJpUGhvbmVcIil8fHYub3MoXCJpT1NcIikmJjMuMT52LnZlcnNpb24oXCJpUG9kXCIpfHx2LmlzKFwiQmxhY2tiZXJyeVwiKSYmNTw9di52ZXJzaW9uKFwiQmxhY2tCZXJyeVwiKSYmNj52LnZlcnNpb24oXCJCbGFja0JlcnJ5XCIpfHw1PD12LnZlcnNpb24oXCJPcGVyYSBNaW5pXCIpJiY2LjU+PXYudmVyc2lvbihcIk9wZXJhIE1pbmlcIikmJigyLjM8PXYudmVyc2lvbihcIkFuZHJvaWRcIil8fHYuaXMoXCJpT1NcIikpfHx2Lm1hdGNoKFwiTm9raWFOOHxOb2tpYUM3fE45Ny4qU2VyaWVzNjB8U3ltYmlhbi8zXCIpfHwxMTw9di52ZXJzaW9uKFwiT3BlcmEgTW9iaVwiKSYmdi5pcyhcIlN5bWJpYW5PU1wiKT9cIkJcIjooNT52LnZlcnNpb24oXCJCbGFja0JlcnJ5XCIpfHx2Lm1hdGNoKFwiTVNJRU1vYmlsZXxXaW5kb3dzIENFLipNb2JpbGVcIil8fDUuMj49di52ZXJzaW9uKFwiV2luZG93cyBNb2JpbGVcIiksXCJDXCIpfSxzLmRldGVjdE9TPWZ1bmN0aW9uKHYpe3JldHVybiBzLmZpbmRNYXRjaChzLm1vYmlsZURldGVjdFJ1bGVzLm9zczAsdil8fHMuZmluZE1hdGNoKHMubW9iaWxlRGV0ZWN0UnVsZXMub3NzLHYpfSxzLmdldERldmljZVNtYWxsZXJTaWRlPWZ1bmN0aW9uKCl7cmV0dXJuIHdpbmRvdy5zY3JlZW4ud2lkdGg8d2luZG93LnNjcmVlbi5oZWlnaHQ/d2luZG93LnNjcmVlbi53aWR0aDp3aW5kb3cuc2NyZWVuLmhlaWdodH0sci5wcm90b3R5cGU9e2NvbnN0cnVjdG9yOnIsbW9iaWxlOmZ1bmN0aW9uIG1vYmlsZSgpe3JldHVybiBzLnByZXBhcmVEZXRlY3Rpb25DYWNoZSh0aGlzLl9jYWNoZSx0aGlzLnVhLHRoaXMubWF4UGhvbmVXaWR0aCksdGhpcy5fY2FjaGUubW9iaWxlfSxwaG9uZTpmdW5jdGlvbiBwaG9uZSgpe3JldHVybiBzLnByZXBhcmVEZXRlY3Rpb25DYWNoZSh0aGlzLl9jYWNoZSx0aGlzLnVhLHRoaXMubWF4UGhvbmVXaWR0aCksdGhpcy5fY2FjaGUucGhvbmV9LHRhYmxldDpmdW5jdGlvbiB0YWJsZXQoKXtyZXR1cm4gcy5wcmVwYXJlRGV0ZWN0aW9uQ2FjaGUodGhpcy5fY2FjaGUsdGhpcy51YSx0aGlzLm1heFBob25lV2lkdGgpLHRoaXMuX2NhY2hlLnRhYmxldH0sdXNlckFnZW50OmZ1bmN0aW9uIHVzZXJBZ2VudCgpe3JldHVybiB0aGlzLl9jYWNoZS51c2VyQWdlbnQ9PT1tJiYodGhpcy5fY2FjaGUudXNlckFnZW50PXMuZmluZE1hdGNoKHMubW9iaWxlRGV0ZWN0UnVsZXMudWFzLHRoaXMudWEpKSx0aGlzLl9jYWNoZS51c2VyQWdlbnR9LHVzZXJBZ2VudHM6ZnVuY3Rpb24gdXNlckFnZW50cygpe3JldHVybiB0aGlzLl9jYWNoZS51c2VyQWdlbnRzPT09bSYmKHRoaXMuX2NhY2hlLnVzZXJBZ2VudHM9cy5maW5kTWF0Y2hlcyhzLm1vYmlsZURldGVjdFJ1bGVzLnVhcyx0aGlzLnVhKSksdGhpcy5fY2FjaGUudXNlckFnZW50c30sb3M6ZnVuY3Rpb24gb3MoKXtyZXR1cm4gdGhpcy5fY2FjaGUub3M9PT1tJiYodGhpcy5fY2FjaGUub3M9cy5kZXRlY3RPUyh0aGlzLnVhKSksdGhpcy5fY2FjaGUub3N9LHZlcnNpb246ZnVuY3Rpb24gdmVyc2lvbih2KXtyZXR1cm4gcy5nZXRWZXJzaW9uKHYsdGhpcy51YSl9LHZlcnNpb25TdHI6ZnVuY3Rpb24gdmVyc2lvblN0cih2KXtyZXR1cm4gcy5nZXRWZXJzaW9uU3RyKHYsdGhpcy51YSl9LGlzOmZ1bmN0aW9uIGlzKHYpe3JldHVybiBvKHRoaXMudXNlckFnZW50cygpLHYpfHxuKHYsdGhpcy5vcygpKXx8bih2LHRoaXMucGhvbmUoKSl8fG4odix0aGlzLnRhYmxldCgpKXx8byhzLmZpbmRNYXRjaGVzKHMubW9iaWxlRGV0ZWN0UnVsZXMudXRpbHMsdGhpcy51YSksdil9LG1hdGNoOmZ1bmN0aW9uIG1hdGNoKHYpe3JldHVybiB2IGluc3RhbmNlb2YgUmVnRXhwfHwodj1uZXcgUmVnRXhwKHYsXCJpXCIpKSx2LnRlc3QodGhpcy51YSl9LGlzUGhvbmVTaXplZDpmdW5jdGlvbiBpc1Bob25lU2l6ZWQodil7cmV0dXJuIHIuaXNQaG9uZVNpemVkKHZ8fHRoaXMubWF4UGhvbmVXaWR0aCl9LG1vYmlsZUdyYWRlOmZ1bmN0aW9uIG1vYmlsZUdyYWRlKCl7cmV0dXJuIHRoaXMuX2NhY2hlLmdyYWRlPT09bSYmKHRoaXMuX2NhY2hlLmdyYWRlPXMubW9iaWxlR3JhZGUodGhpcykpLHRoaXMuX2NhY2hlLmdyYWRlfX0sci5pc1Bob25lU2l6ZWQ9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmd2luZG93LnNjcmVlbj9mdW5jdGlvbih2KXtyZXR1cm4gMD52P206cy5nZXREZXZpY2VTbWFsbGVyU2lkZSgpPD12fTpmdW5jdGlvbigpe30sci5faW1wbD1zLHIudmVyc2lvbj1cIjEuNC4yIDIwMTgtMDYtMTBcIixyfSl9KGZ1bmN0aW9uKCl7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMpcmV0dXJuIGZ1bmN0aW9uKG0pe21vZHVsZS5leHBvcnRzPW0oKX07aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKXJldHVybiBkZWZpbmU7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdylyZXR1cm4gZnVuY3Rpb24obSl7d2luZG93Lk1vYmlsZURldGVjdD1tKCl9O3Rocm93IG5ldyBFcnJvcihcInVua25vd24gZW52aXJvbm1lbnRcIil9KCkpOyIsIi8qXHJcbiAgICAgXyBfICAgICAgXyAgICAgICBfXHJcbiBfX198IChfKSBfX198IHwgX18gIChfKV9fX1xyXG4vIF9ffCB8IHwvIF9ffCB8LyAvICB8IC8gX198XHJcblxcX18gXFwgfCB8IChfX3wgICA8IF8gfCBcXF9fIFxcXHJcbnxfX18vX3xffFxcX19ffF98XFxfKF8pLyB8X19fL1xyXG4gICAgICAgICAgICAgICAgICAgfF9fL1xyXG5cclxuIFZlcnNpb246IDEuOC4wXHJcbiAgQXV0aG9yOiBLZW4gV2hlZWxlclxyXG4gV2Vic2l0ZTogaHR0cDovL2tlbndoZWVsZXIuZ2l0aHViLmlvXHJcbiAgICBEb2NzOiBodHRwOi8va2Vud2hlZWxlci5naXRodWIuaW8vc2xpY2tcclxuICAgIFJlcG86IGh0dHA6Ly9naXRodWIuY29tL2tlbndoZWVsZXIvc2xpY2tcclxuICBJc3N1ZXM6IGh0dHA6Ly9naXRodWIuY29tL2tlbndoZWVsZXIvc2xpY2svaXNzdWVzXHJcblxyXG4gKi9cclxuLyogZ2xvYmFsIHdpbmRvdywgZG9jdW1lbnQsIGRlZmluZSwgalF1ZXJ5LCBzZXRJbnRlcnZhbCwgY2xlYXJJbnRlcnZhbCAqL1xyXG47KGZ1bmN0aW9uKGZhY3RvcnkpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgICAgICBkZWZpbmUoWydqcXVlcnknXSwgZmFjdG9yeSk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZhY3RvcnkoalF1ZXJ5KTtcclxuICAgIH1cclxuXHJcbn0oZnVuY3Rpb24oJCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIFNsaWNrID0gd2luZG93LlNsaWNrIHx8IHt9O1xyXG5cclxuICAgIFNsaWNrID0gKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgaW5zdGFuY2VVaWQgPSAwO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBTbGljayhlbGVtZW50LCBzZXR0aW5ncykge1xyXG5cclxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzLCBkYXRhU2V0dGluZ3M7XHJcblxyXG4gICAgICAgICAgICBfLmRlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICAgICAgYWNjZXNzaWJpbGl0eTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGFkYXB0aXZlSGVpZ2h0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFwcGVuZEFycm93czogJChlbGVtZW50KSxcclxuICAgICAgICAgICAgICAgIGFwcGVuZERvdHM6ICQoZWxlbWVudCksXHJcbiAgICAgICAgICAgICAgICBhcnJvd3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhc05hdkZvcjogbnVsbCxcclxuICAgICAgICAgICAgICAgIHByZXZBcnJvdzogJzxidXR0b24gY2xhc3M9XCJzbGljay1wcmV2XCIgYXJpYS1sYWJlbD1cIlByZXZpb3VzXCIgdHlwZT1cImJ1dHRvblwiPlByZXZpb3VzPC9idXR0b24+JyxcclxuICAgICAgICAgICAgICAgIG5leHRBcnJvdzogJzxidXR0b24gY2xhc3M9XCJzbGljay1uZXh0XCIgYXJpYS1sYWJlbD1cIk5leHRcIiB0eXBlPVwiYnV0dG9uXCI+TmV4dDwvYnV0dG9uPicsXHJcbiAgICAgICAgICAgICAgICBhdXRvcGxheTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhdXRvcGxheVNwZWVkOiAzMDAwLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyTW9kZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJQYWRkaW5nOiAnNTBweCcsXHJcbiAgICAgICAgICAgICAgICBjc3NFYXNlOiAnZWFzZScsXHJcbiAgICAgICAgICAgICAgICBjdXN0b21QYWdpbmc6IGZ1bmN0aW9uKHNsaWRlciwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKCc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiAvPicpLnRleHQoaSArIDEpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZG90c0NsYXNzOiAnc2xpY2stZG90cycsXHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBlYXNpbmc6ICdsaW5lYXInLFxyXG4gICAgICAgICAgICAgICAgZWRnZUZyaWN0aW9uOiAwLjM1LFxyXG4gICAgICAgICAgICAgICAgZmFkZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBmb2N1c09uU2VsZWN0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGZvY3VzT25DaGFuZ2U6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpbml0aWFsU2xpZGU6IDAsXHJcbiAgICAgICAgICAgICAgICBsYXp5TG9hZDogJ29uZGVtYW5kJyxcclxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHBhdXNlT25Ib3ZlcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHBhdXNlT25Gb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHBhdXNlT25Eb3RzSG92ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uZFRvOiAnd2luZG93JyxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IG51bGwsXHJcbiAgICAgICAgICAgICAgICByb3dzOiAxLFxyXG4gICAgICAgICAgICAgICAgcnRsOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNsaWRlOiAnJyxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclJvdzogMSxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDUwMCxcclxuICAgICAgICAgICAgICAgIHN3aXBlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc3dpcGVUb1NsaWRlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHRvdWNoTW92ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRvdWNoVGhyZXNob2xkOiA1LFxyXG4gICAgICAgICAgICAgICAgdXNlQ1NTOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdXNlVHJhbnNmb3JtOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbFN3aXBpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgd2FpdEZvckFuaW1hdGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDEwMDBcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIF8uaW5pdGlhbHMgPSB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXV0b1BsYXlUaW1lcjogbnVsbCxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnREaXJlY3Rpb246IDAsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50TGVmdDogbnVsbCxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTbGlkZTogMCxcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogMSxcclxuICAgICAgICAgICAgICAgICRkb3RzOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgbGlzdFdpZHRoOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgbGlzdEhlaWdodDogbnVsbCxcclxuICAgICAgICAgICAgICAgIGxvYWRJbmRleDogMCxcclxuICAgICAgICAgICAgICAgICRuZXh0QXJyb3c6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAkcHJldkFycm93OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNsaWRlQ291bnQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBzbGlkZVdpZHRoOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgJHNsaWRlVHJhY2s6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAkc2xpZGVzOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgc2xpZGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzbGlkZU9mZnNldDogMCxcclxuICAgICAgICAgICAgICAgIHN3aXBlTGVmdDogbnVsbCxcclxuICAgICAgICAgICAgICAgIHN3aXBpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgJGxpc3Q6IG51bGwsXHJcbiAgICAgICAgICAgICAgICB0b3VjaE9iamVjdDoge30sXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1zRW5hYmxlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB1bnNsaWNrZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkLmV4dGVuZChfLCBfLmluaXRpYWxzKTtcclxuXHJcbiAgICAgICAgICAgIF8uYWN0aXZlQnJlYWtwb2ludCA9IG51bGw7XHJcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSBudWxsO1xyXG4gICAgICAgICAgICBfLmFuaW1Qcm9wID0gbnVsbDtcclxuICAgICAgICAgICAgXy5icmVha3BvaW50cyA9IFtdO1xyXG4gICAgICAgICAgICBfLmJyZWFrcG9pbnRTZXR0aW5ncyA9IFtdO1xyXG4gICAgICAgICAgICBfLmNzc1RyYW5zaXRpb25zID0gZmFsc2U7XHJcbiAgICAgICAgICAgIF8uZm9jdXNzZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBfLmhpZGRlbiA9ICdoaWRkZW4nO1xyXG4gICAgICAgICAgICBfLnBhdXNlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIF8ucG9zaXRpb25Qcm9wID0gbnVsbDtcclxuICAgICAgICAgICAgXy5yZXNwb25kVG8gPSBudWxsO1xyXG4gICAgICAgICAgICBfLnJvd0NvdW50ID0gMTtcclxuICAgICAgICAgICAgXy5zaG91bGRDbGljayA9IHRydWU7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlciA9ICQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlc0NhY2hlID0gbnVsbDtcclxuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gbnVsbDtcclxuICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgIF8udmlzaWJpbGl0eUNoYW5nZSA9ICd2aXNpYmlsaXR5Y2hhbmdlJztcclxuICAgICAgICAgICAgXy53aW5kb3dXaWR0aCA9IDA7XHJcbiAgICAgICAgICAgIF8ud2luZG93VGltZXIgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgZGF0YVNldHRpbmdzID0gJChlbGVtZW50KS5kYXRhKCdzbGljaycpIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgXy5vcHRpb25zID0gJC5leHRlbmQoe30sIF8uZGVmYXVsdHMsIHNldHRpbmdzLCBkYXRhU2V0dGluZ3MpO1xyXG5cclxuICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBfLm9wdGlvbnMuaW5pdGlhbFNsaWRlO1xyXG5cclxuICAgICAgICAgICAgXy5vcmlnaW5hbFNldHRpbmdzID0gXy5vcHRpb25zO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBfLmhpZGRlbiA9ICdtb3pIaWRkZW4nO1xyXG4gICAgICAgICAgICAgICAgXy52aXNpYmlsaXR5Q2hhbmdlID0gJ21venZpc2liaWxpdHljaGFuZ2UnO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudC53ZWJraXRIaWRkZW4gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBfLmhpZGRlbiA9ICd3ZWJraXRIaWRkZW4nO1xyXG4gICAgICAgICAgICAgICAgXy52aXNpYmlsaXR5Q2hhbmdlID0gJ3dlYmtpdHZpc2liaWxpdHljaGFuZ2UnO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBfLmF1dG9QbGF5ID0gJC5wcm94eShfLmF1dG9QbGF5LCBfKTtcclxuICAgICAgICAgICAgXy5hdXRvUGxheUNsZWFyID0gJC5wcm94eShfLmF1dG9QbGF5Q2xlYXIsIF8pO1xyXG4gICAgICAgICAgICBfLmF1dG9QbGF5SXRlcmF0b3IgPSAkLnByb3h5KF8uYXV0b1BsYXlJdGVyYXRvciwgXyk7XHJcbiAgICAgICAgICAgIF8uY2hhbmdlU2xpZGUgPSAkLnByb3h5KF8uY2hhbmdlU2xpZGUsIF8pO1xyXG4gICAgICAgICAgICBfLmNsaWNrSGFuZGxlciA9ICQucHJveHkoXy5jbGlja0hhbmRsZXIsIF8pO1xyXG4gICAgICAgICAgICBfLnNlbGVjdEhhbmRsZXIgPSAkLnByb3h5KF8uc2VsZWN0SGFuZGxlciwgXyk7XHJcbiAgICAgICAgICAgIF8uc2V0UG9zaXRpb24gPSAkLnByb3h5KF8uc2V0UG9zaXRpb24sIF8pO1xyXG4gICAgICAgICAgICBfLnN3aXBlSGFuZGxlciA9ICQucHJveHkoXy5zd2lwZUhhbmRsZXIsIF8pO1xyXG4gICAgICAgICAgICBfLmRyYWdIYW5kbGVyID0gJC5wcm94eShfLmRyYWdIYW5kbGVyLCBfKTtcclxuICAgICAgICAgICAgXy5rZXlIYW5kbGVyID0gJC5wcm94eShfLmtleUhhbmRsZXIsIF8pO1xyXG5cclxuICAgICAgICAgICAgXy5pbnN0YW5jZVVpZCA9IGluc3RhbmNlVWlkKys7XHJcblxyXG4gICAgICAgICAgICAvLyBBIHNpbXBsZSB3YXkgdG8gY2hlY2sgZm9yIEhUTUwgc3RyaW5nc1xyXG4gICAgICAgICAgICAvLyBTdHJpY3QgSFRNTCByZWNvZ25pdGlvbiAobXVzdCBzdGFydCB3aXRoIDwpXHJcbiAgICAgICAgICAgIC8vIEV4dHJhY3RlZCBmcm9tIGpRdWVyeSB2MS4xMSBzb3VyY2VcclxuICAgICAgICAgICAgXy5odG1sRXhwciA9IC9eKD86XFxzKig8W1xcd1xcV10rPilbXj5dKikkLztcclxuXHJcblxyXG4gICAgICAgICAgICBfLnJlZ2lzdGVyQnJlYWtwb2ludHMoKTtcclxuICAgICAgICAgICAgXy5pbml0KHRydWUpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBTbGljaztcclxuXHJcbiAgICB9KCkpO1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5hY3RpdmF0ZUFEQSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy4kc2xpZGVUcmFjay5maW5kKCcuc2xpY2stYWN0aXZlJykuYXR0cih7XHJcbiAgICAgICAgICAgICdhcmlhLWhpZGRlbic6ICdmYWxzZSdcclxuICAgICAgICB9KS5maW5kKCdhLCBpbnB1dCwgYnV0dG9uLCBzZWxlY3QnKS5hdHRyKHtcclxuICAgICAgICAgICAgJ3RhYmluZGV4JzogJzAnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYWRkU2xpZGUgPSBTbGljay5wcm90b3R5cGUuc2xpY2tBZGQgPSBmdW5jdGlvbihtYXJrdXAsIGluZGV4LCBhZGRCZWZvcmUpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mKGluZGV4KSA9PT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgIGFkZEJlZm9yZSA9IGluZGV4O1xyXG4gICAgICAgICAgICBpbmRleCA9IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpbmRleCA8IDAgfHwgKGluZGV4ID49IF8uc2xpZGVDb3VudCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy51bmxvYWQoKTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZihpbmRleCkgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCAmJiBfLiRzbGlkZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKG1hcmt1cCkuYXBwZW5kVG8oXy4kc2xpZGVUcmFjayk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWRkQmVmb3JlKSB7XHJcbiAgICAgICAgICAgICAgICAkKG1hcmt1cCkuaW5zZXJ0QmVmb3JlKF8uJHNsaWRlcy5lcShpbmRleCkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChtYXJrdXApLmluc2VydEFmdGVyKF8uJHNsaWRlcy5lcShpbmRleCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGFkZEJlZm9yZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgJChtYXJrdXApLnByZXBlbmRUbyhfLiRzbGlkZVRyYWNrKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQobWFya3VwKS5hcHBlbmRUbyhfLiRzbGlkZVRyYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy4kc2xpZGVzID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpO1xyXG5cclxuICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlVHJhY2suYXBwZW5kKF8uJHNsaWRlcyk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlcy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICQoZWxlbWVudCkuYXR0cignZGF0YS1zbGljay1pbmRleCcsIGluZGV4KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVzQ2FjaGUgPSBfLiRzbGlkZXM7XHJcblxyXG4gICAgICAgIF8ucmVpbml0KCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYW5pbWF0ZUhlaWdodCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuICAgICAgICBpZiAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA9PT0gMSAmJiBfLm9wdGlvbnMuYWRhcHRpdmVIZWlnaHQgPT09IHRydWUgJiYgXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0SGVpZ2h0ID0gXy4kc2xpZGVzLmVxKF8uY3VycmVudFNsaWRlKS5vdXRlckhlaWdodCh0cnVlKTtcclxuICAgICAgICAgICAgXy4kbGlzdC5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIGhlaWdodDogdGFyZ2V0SGVpZ2h0XHJcbiAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYW5pbWF0ZVNsaWRlID0gZnVuY3Rpb24odGFyZ2V0TGVmdCwgY2FsbGJhY2spIHtcclxuXHJcbiAgICAgICAgdmFyIGFuaW1Qcm9wcyA9IHt9LFxyXG4gICAgICAgICAgICBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5hbmltYXRlSGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMucnRsID09PSB0cnVlICYmIF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IC10YXJnZXRMZWZ0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoXy50cmFuc2Zvcm1zRW5hYmxlZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogdGFyZ2V0TGVmdFxyXG4gICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkLCBfLm9wdGlvbnMuZWFzaW5nLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogdGFyZ2V0TGVmdFxyXG4gICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkLCBfLm9wdGlvbnMuZWFzaW5nLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChfLmNzc1RyYW5zaXRpb25zID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5ydGwgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnRMZWZ0ID0gLShfLmN1cnJlbnRMZWZ0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1TdGFydDogXy5jdXJyZW50TGVmdFxyXG4gICAgICAgICAgICAgICAgfSkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbVN0YXJ0OiB0YXJnZXRMZWZ0XHJcbiAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IF8ub3B0aW9ucy5zcGVlZCxcclxuICAgICAgICAgICAgICAgICAgICBlYXNpbmc6IF8ub3B0aW9ucy5lYXNpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcDogZnVuY3Rpb24obm93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdyA9IE1hdGguY2VpbChub3cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVByb3BzW18uYW5pbVR5cGVdID0gJ3RyYW5zbGF0ZSgnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3cgKyAncHgsIDBweCknO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MoYW5pbVByb3BzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUoMHB4LCcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdyArICdweCknO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MoYW5pbVByb3BzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLmFwcGx5VHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IE1hdGguY2VpbCh0YXJnZXRMZWZ0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUzZCgnICsgdGFyZ2V0TGVmdCArICdweCwgMHB4LCAwcHgpJztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbVByb3BzW18uYW5pbVR5cGVdID0gJ3RyYW5zbGF0ZTNkKDBweCwnICsgdGFyZ2V0TGVmdCArICdweCwgMHB4KSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhhbmltUHJvcHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmRpc2FibGVUcmFuc2l0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmdldE5hdlRhcmdldCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGFzTmF2Rm9yID0gXy5vcHRpb25zLmFzTmF2Rm9yO1xyXG5cclxuICAgICAgICBpZiAoIGFzTmF2Rm9yICYmIGFzTmF2Rm9yICE9PSBudWxsICkge1xyXG4gICAgICAgICAgICBhc05hdkZvciA9ICQoYXNOYXZGb3IpLm5vdChfLiRzbGlkZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFzTmF2Rm9yO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmFzTmF2Rm9yID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBhc05hdkZvciA9IF8uZ2V0TmF2VGFyZ2V0KCk7XHJcblxyXG4gICAgICAgIGlmICggYXNOYXZGb3IgIT09IG51bGwgJiYgdHlwZW9mIGFzTmF2Rm9yID09PSAnb2JqZWN0JyApIHtcclxuICAgICAgICAgICAgYXNOYXZGb3IuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMpLnNsaWNrKCdnZXRTbGljaycpO1xyXG4gICAgICAgICAgICAgICAgaWYoIXRhcmdldC51bnNsaWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc2xpZGVIYW5kbGVyKGluZGV4LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmFwcGx5VHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHNsaWRlKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbiA9IHt9O1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25bXy50cmFuc2l0aW9uVHlwZV0gPSBfLnRyYW5zZm9ybVR5cGUgKyAnICcgKyBfLm9wdGlvbnMuc3BlZWQgKyAnbXMgJyArIF8ub3B0aW9ucy5jc3NFYXNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25bXy50cmFuc2l0aW9uVHlwZV0gPSAnb3BhY2l0eSAnICsgXy5vcHRpb25zLnNwZWVkICsgJ21zICcgKyBfLm9wdGlvbnMuY3NzRWFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3ModHJhbnNpdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlKS5jc3ModHJhbnNpdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmF1dG9QbGF5ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5hdXRvUGxheUNsZWFyKCk7XHJcblxyXG4gICAgICAgIGlmICggXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyApIHtcclxuICAgICAgICAgICAgXy5hdXRvUGxheVRpbWVyID0gc2V0SW50ZXJ2YWwoIF8uYXV0b1BsYXlJdGVyYXRvciwgXy5vcHRpb25zLmF1dG9wbGF5U3BlZWQgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYXV0b1BsYXlDbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLmF1dG9QbGF5VGltZXIpIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChfLmF1dG9QbGF5VGltZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5hdXRvUGxheUl0ZXJhdG9yID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgc2xpZGVUbyA9IF8uY3VycmVudFNsaWRlICsgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xyXG5cclxuICAgICAgICBpZiAoICFfLnBhdXNlZCAmJiAhXy5pbnRlcnJ1cHRlZCAmJiAhXy5mb2N1c3NlZCApIHtcclxuXHJcbiAgICAgICAgICAgIGlmICggXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIF8uZGlyZWN0aW9uID09PSAxICYmICggXy5jdXJyZW50U2xpZGUgKyAxICkgPT09ICggXy5zbGlkZUNvdW50IC0gMSApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5kaXJlY3Rpb24gPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCBfLmRpcmVjdGlvbiA9PT0gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVUbyA9IF8uY3VycmVudFNsaWRlIC0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIF8uY3VycmVudFNsaWRlIC0gMSA9PT0gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5kaXJlY3Rpb24gPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBfLnNsaWRlSGFuZGxlciggc2xpZGVUbyApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYnVpbGRBcnJvd3MgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmFycm93cyA9PT0gdHJ1ZSApIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHByZXZBcnJvdyA9ICQoXy5vcHRpb25zLnByZXZBcnJvdykuYWRkQ2xhc3MoJ3NsaWNrLWFycm93Jyk7XHJcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdyA9ICQoXy5vcHRpb25zLm5leHRBcnJvdykuYWRkQ2xhc3MoJ3NsaWNrLWFycm93Jyk7XHJcblxyXG4gICAgICAgICAgICBpZiggXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWhpZGRlbicpLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuIHRhYmluZGV4Jyk7XHJcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWhpZGRlbicpLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuIHRhYmluZGV4Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8uaHRtbEV4cHIudGVzdChfLm9wdGlvbnMucHJldkFycm93KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5wcmVwZW5kVG8oXy5vcHRpb25zLmFwcGVuZEFycm93cyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8uaHRtbEV4cHIudGVzdChfLm9wdGlvbnMubmV4dEFycm93KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5hcHBlbmRUbyhfLm9wdGlvbnMuYXBwZW5kQXJyb3dzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy4kcHJldkFycm93XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stZGlzYWJsZWQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5hZGQoIF8uJG5leHRBcnJvdyApXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2staGlkZGVuJylcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhcmlhLWRpc2FibGVkJzogJ3RydWUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5idWlsZERvdHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBpLCBkb3Q7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXIuYWRkQ2xhc3MoJ3NsaWNrLWRvdHRlZCcpO1xyXG5cclxuICAgICAgICAgICAgZG90ID0gJCgnPHVsIC8+JykuYWRkQ2xhc3MoXy5vcHRpb25zLmRvdHNDbGFzcyk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDw9IF8uZ2V0RG90Q291bnQoKTsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICBkb3QuYXBwZW5kKCQoJzxsaSAvPicpLmFwcGVuZChfLm9wdGlvbnMuY3VzdG9tUGFnaW5nLmNhbGwodGhpcywgXywgaSkpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgXy4kZG90cyA9IGRvdC5hcHBlbmRUbyhfLm9wdGlvbnMuYXBwZW5kRG90cyk7XHJcblxyXG4gICAgICAgICAgICBfLiRkb3RzLmZpbmQoJ2xpJykuZmlyc3QoKS5hZGRDbGFzcygnc2xpY2stYWN0aXZlJyk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5idWlsZE91dCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlcyA9XHJcbiAgICAgICAgICAgIF8uJHNsaWRlclxyXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKCBfLm9wdGlvbnMuc2xpZGUgKyAnOm5vdCguc2xpY2stY2xvbmVkKScpXHJcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLXNsaWRlJyk7XHJcblxyXG4gICAgICAgIF8uc2xpZGVDb3VudCA9IF8uJHNsaWRlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlcy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICQoZWxlbWVudClcclxuICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JywgaW5kZXgpXHJcbiAgICAgICAgICAgICAgICAuZGF0YSgnb3JpZ2luYWxTdHlsaW5nJywgJChlbGVtZW50KS5hdHRyKCdzdHlsZScpIHx8ICcnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVyLmFkZENsYXNzKCdzbGljay1zbGlkZXInKTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVUcmFjayA9IChfLnNsaWRlQ291bnQgPT09IDApID9cclxuICAgICAgICAgICAgJCgnPGRpdiBjbGFzcz1cInNsaWNrLXRyYWNrXCIvPicpLmFwcGVuZFRvKF8uJHNsaWRlcikgOlxyXG4gICAgICAgICAgICBfLiRzbGlkZXMud3JhcEFsbCgnPGRpdiBjbGFzcz1cInNsaWNrLXRyYWNrXCIvPicpLnBhcmVudCgpO1xyXG5cclxuICAgICAgICBfLiRsaXN0ID0gXy4kc2xpZGVUcmFjay53cmFwKFxyXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInNsaWNrLWxpc3RcIi8+JykucGFyZW50KCk7XHJcbiAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MoJ29wYWNpdHknLCAwKTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlIHx8IF8ub3B0aW9ucy5zd2lwZVRvU2xpZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsID0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoJ2ltZ1tkYXRhLWxhenldJywgXy4kc2xpZGVyKS5ub3QoJ1tzcmNdJykuYWRkQ2xhc3MoJ3NsaWNrLWxvYWRpbmcnKTtcclxuXHJcbiAgICAgICAgXy5zZXR1cEluZmluaXRlKCk7XHJcblxyXG4gICAgICAgIF8uYnVpbGRBcnJvd3MoKTtcclxuXHJcbiAgICAgICAgXy5idWlsZERvdHMoKTtcclxuXHJcbiAgICAgICAgXy51cGRhdGVEb3RzKCk7XHJcblxyXG5cclxuICAgICAgICBfLnNldFNsaWRlQ2xhc3Nlcyh0eXBlb2YgXy5jdXJyZW50U2xpZGUgPT09ICdudW1iZXInID8gXy5jdXJyZW50U2xpZGUgOiAwKTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5kcmFnZ2FibGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy4kbGlzdC5hZGRDbGFzcygnZHJhZ2dhYmxlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmJ1aWxkUm93cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsIGEsIGIsIGMsIG5ld1NsaWRlcywgbnVtT2ZTbGlkZXMsIG9yaWdpbmFsU2xpZGVzLHNsaWRlc1BlclNlY3Rpb247XHJcblxyXG4gICAgICAgIG5ld1NsaWRlcyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgICBvcmlnaW5hbFNsaWRlcyA9IF8uJHNsaWRlci5jaGlsZHJlbigpO1xyXG5cclxuICAgICAgICBpZihfLm9wdGlvbnMucm93cyA+IDApIHtcclxuXHJcbiAgICAgICAgICAgIHNsaWRlc1BlclNlY3Rpb24gPSBfLm9wdGlvbnMuc2xpZGVzUGVyUm93ICogXy5vcHRpb25zLnJvd3M7XHJcbiAgICAgICAgICAgIG51bU9mU2xpZGVzID0gTWF0aC5jZWlsKFxyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxTbGlkZXMubGVuZ3RoIC8gc2xpZGVzUGVyU2VjdGlvblxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgZm9yKGEgPSAwOyBhIDwgbnVtT2ZTbGlkZXM7IGErKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2xpZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgIGZvcihiID0gMDsgYiA8IF8ub3B0aW9ucy5yb3dzOyBiKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGMgPSAwOyBjIDwgXy5vcHRpb25zLnNsaWRlc1BlclJvdzsgYysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAoYSAqIHNsaWRlc1BlclNlY3Rpb24gKyAoKGIgKiBfLm9wdGlvbnMuc2xpZGVzUGVyUm93KSArIGMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9yaWdpbmFsU2xpZGVzLmdldCh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cuYXBwZW5kQ2hpbGQob3JpZ2luYWxTbGlkZXMuZ2V0KHRhcmdldCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlLmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBuZXdTbGlkZXMuYXBwZW5kQ2hpbGQoc2xpZGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXIuZW1wdHkoKS5hcHBlbmQobmV3U2xpZGVzKTtcclxuICAgICAgICAgICAgXy4kc2xpZGVyLmNoaWxkcmVuKCkuY2hpbGRyZW4oKS5jaGlsZHJlbigpXHJcbiAgICAgICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOigxMDAgLyBfLm9wdGlvbnMuc2xpZGVzUGVyUm93KSArICclJyxcclxuICAgICAgICAgICAgICAgICAgICAnZGlzcGxheSc6ICdpbmxpbmUtYmxvY2snXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmNoZWNrUmVzcG9uc2l2ZSA9IGZ1bmN0aW9uKGluaXRpYWwsIGZvcmNlVXBkYXRlKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgYnJlYWtwb2ludCwgdGFyZ2V0QnJlYWtwb2ludCwgcmVzcG9uZFRvV2lkdGgsIHRyaWdnZXJCcmVha3BvaW50ID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIHNsaWRlcldpZHRoID0gXy4kc2xpZGVyLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGggfHwgJCh3aW5kb3cpLndpZHRoKCk7XHJcblxyXG4gICAgICAgIGlmIChfLnJlc3BvbmRUbyA9PT0gJ3dpbmRvdycpIHtcclxuICAgICAgICAgICAgcmVzcG9uZFRvV2lkdGggPSB3aW5kb3dXaWR0aDtcclxuICAgICAgICB9IGVsc2UgaWYgKF8ucmVzcG9uZFRvID09PSAnc2xpZGVyJykge1xyXG4gICAgICAgICAgICByZXNwb25kVG9XaWR0aCA9IHNsaWRlcldpZHRoO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXy5yZXNwb25kVG8gPT09ICdtaW4nKSB7XHJcbiAgICAgICAgICAgIHJlc3BvbmRUb1dpZHRoID0gTWF0aC5taW4od2luZG93V2lkdGgsIHNsaWRlcldpZHRoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggXy5vcHRpb25zLnJlc3BvbnNpdmUgJiZcclxuICAgICAgICAgICAgXy5vcHRpb25zLnJlc3BvbnNpdmUubGVuZ3RoICYmXHJcbiAgICAgICAgICAgIF8ub3B0aW9ucy5yZXNwb25zaXZlICE9PSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGZvciAoYnJlYWtwb2ludCBpbiBfLmJyZWFrcG9pbnRzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXy5icmVha3BvaW50cy5oYXNPd25Qcm9wZXJ0eShicmVha3BvaW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfLm9yaWdpbmFsU2V0dGluZ3MubW9iaWxlRmlyc3QgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25kVG9XaWR0aCA8IF8uYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnQgPSBfLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbmRUb1dpZHRoID4gXy5icmVha3BvaW50c1ticmVha3BvaW50XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0QnJlYWtwb2ludCA9IF8uYnJlYWtwb2ludHNbYnJlYWtwb2ludF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRCcmVha3BvaW50ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXy5hY3RpdmVCcmVha3BvaW50ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldEJyZWFrcG9pbnQgIT09IF8uYWN0aXZlQnJlYWtwb2ludCB8fCBmb3JjZVVwZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmFjdGl2ZUJyZWFrcG9pbnQgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0QnJlYWtwb2ludDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uYnJlYWtwb2ludFNldHRpbmdzW3RhcmdldEJyZWFrcG9pbnRdID09PSAndW5zbGljaycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8udW5zbGljayh0YXJnZXRCcmVha3BvaW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBfLm9yaWdpbmFsU2V0dGluZ3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5icmVha3BvaW50U2V0dGluZ3NbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnRdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBfLm9wdGlvbnMuaW5pdGlhbFNsaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5yZWZyZXNoKGluaXRpYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJCcmVha3BvaW50ID0gdGFyZ2V0QnJlYWtwb2ludDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uYWN0aXZlQnJlYWtwb2ludCA9IHRhcmdldEJyZWFrcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKF8uYnJlYWtwb2ludFNldHRpbmdzW3RhcmdldEJyZWFrcG9pbnRdID09PSAndW5zbGljaycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy51bnNsaWNrKHRhcmdldEJyZWFrcG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBfLm9yaWdpbmFsU2V0dGluZ3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmJyZWFrcG9pbnRTZXR0aW5nc1tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IF8ub3B0aW9ucy5pbml0aWFsU2xpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5yZWZyZXNoKGluaXRpYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyQnJlYWtwb2ludCA9IHRhcmdldEJyZWFrcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXy5hY3RpdmVCcmVha3BvaW50ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5hY3RpdmVCcmVha3BvaW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMgPSBfLm9yaWdpbmFsU2V0dGluZ3M7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWwgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBfLm9wdGlvbnMuaW5pdGlhbFNsaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBfLnJlZnJlc2goaW5pdGlhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlckJyZWFrcG9pbnQgPSB0YXJnZXRCcmVha3BvaW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBvbmx5IHRyaWdnZXIgYnJlYWtwb2ludHMgZHVyaW5nIGFuIGFjdHVhbCBicmVhay4gbm90IG9uIGluaXRpYWxpemUuXHJcbiAgICAgICAgICAgIGlmKCAhaW5pdGlhbCAmJiB0cmlnZ2VyQnJlYWtwb2ludCAhPT0gZmFsc2UgKSB7XHJcbiAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignYnJlYWtwb2ludCcsIFtfLCB0cmlnZ2VyQnJlYWtwb2ludF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmNoYW5nZVNsaWRlID0gZnVuY3Rpb24oZXZlbnQsIGRvbnRBbmltYXRlKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgJHRhcmdldCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCksXHJcbiAgICAgICAgICAgIGluZGV4T2Zmc2V0LCBzbGlkZU9mZnNldCwgdW5ldmVuT2Zmc2V0O1xyXG5cclxuICAgICAgICAvLyBJZiB0YXJnZXQgaXMgYSBsaW5rLCBwcmV2ZW50IGRlZmF1bHQgYWN0aW9uLlxyXG4gICAgICAgIGlmKCR0YXJnZXQuaXMoJ2EnKSkge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgdGFyZ2V0IGlzIG5vdCB0aGUgPGxpPiBlbGVtZW50IChpZTogYSBjaGlsZCksIGZpbmQgdGhlIDxsaT4uXHJcbiAgICAgICAgaWYoISR0YXJnZXQuaXMoJ2xpJykpIHtcclxuICAgICAgICAgICAgJHRhcmdldCA9ICR0YXJnZXQuY2xvc2VzdCgnbGknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVuZXZlbk9mZnNldCA9IChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgIT09IDApO1xyXG4gICAgICAgIGluZGV4T2Zmc2V0ID0gdW5ldmVuT2Zmc2V0ID8gMCA6IChfLnNsaWRlQ291bnQgLSBfLmN1cnJlbnRTbGlkZSkgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZXZlbnQuZGF0YS5tZXNzYWdlKSB7XHJcblxyXG4gICAgICAgICAgICBjYXNlICdwcmV2aW91cyc6XHJcbiAgICAgICAgICAgICAgICBzbGlkZU9mZnNldCA9IGluZGV4T2Zmc2V0ID09PSAwID8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDogXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAtIGluZGV4T2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlcihfLmN1cnJlbnRTbGlkZSAtIHNsaWRlT2Zmc2V0LCBmYWxzZSwgZG9udEFuaW1hdGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlICduZXh0JzpcclxuICAgICAgICAgICAgICAgIHNsaWRlT2Zmc2V0ID0gaW5kZXhPZmZzZXQgPT09IDAgPyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgOiBpbmRleE9mZnNldDtcclxuICAgICAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5zbGlkZUhhbmRsZXIoXy5jdXJyZW50U2xpZGUgKyBzbGlkZU9mZnNldCwgZmFsc2UsIGRvbnRBbmltYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnaW5kZXgnOlxyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZXZlbnQuZGF0YS5pbmRleCA9PT0gMCA/IDAgOlxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEuaW5kZXggfHwgJHRhcmdldC5pbmRleCgpICogXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xyXG5cclxuICAgICAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKF8uY2hlY2tOYXZpZ2FibGUoaW5kZXgpLCBmYWxzZSwgZG9udEFuaW1hdGUpO1xyXG4gICAgICAgICAgICAgICAgJHRhcmdldC5jaGlsZHJlbigpLnRyaWdnZXIoJ2ZvY3VzJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmNoZWNrTmF2aWdhYmxlID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBuYXZpZ2FibGVzLCBwcmV2TmF2aWdhYmxlO1xyXG5cclxuICAgICAgICBuYXZpZ2FibGVzID0gXy5nZXROYXZpZ2FibGVJbmRleGVzKCk7XHJcbiAgICAgICAgcHJldk5hdmlnYWJsZSA9IDA7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gbmF2aWdhYmxlc1tuYXZpZ2FibGVzLmxlbmd0aCAtIDFdKSB7XHJcbiAgICAgICAgICAgIGluZGV4ID0gbmF2aWdhYmxlc1tuYXZpZ2FibGVzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG4gaW4gbmF2aWdhYmxlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgbmF2aWdhYmxlc1tuXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gcHJldk5hdmlnYWJsZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHByZXZOYXZpZ2FibGUgPSBuYXZpZ2FibGVzW25dO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5kZXg7XHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5jbGVhblVwRXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5kb3RzICYmIF8uJGRvdHMgIT09IG51bGwpIHtcclxuXHJcbiAgICAgICAgICAgICQoJ2xpJywgXy4kZG90cylcclxuICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrLnNsaWNrJywgXy5jaGFuZ2VTbGlkZSlcclxuICAgICAgICAgICAgICAgIC5vZmYoJ21vdXNlZW50ZXIuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCB0cnVlKSlcclxuICAgICAgICAgICAgICAgIC5vZmYoJ21vdXNlbGVhdmUuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCBmYWxzZSkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBfLiRkb3RzLm9mZigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uJHNsaWRlci5vZmYoJ2ZvY3VzLnNsaWNrIGJsdXIuc2xpY2snKTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hcnJvd3MgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICBfLiRwcmV2QXJyb3cgJiYgXy4kcHJldkFycm93Lm9mZignY2xpY2suc2xpY2snLCBfLmNoYW5nZVNsaWRlKTtcclxuICAgICAgICAgICAgXy4kbmV4dEFycm93ICYmIF8uJG5leHRBcnJvdy5vZmYoJ2NsaWNrLnNsaWNrJywgXy5jaGFuZ2VTbGlkZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdyAmJiBfLiRwcmV2QXJyb3cub2ZmKCdrZXlkb3duLnNsaWNrJywgXy5rZXlIYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdyAmJiBfLiRuZXh0QXJyb3cub2ZmKCdrZXlkb3duLnNsaWNrJywgXy5rZXlIYW5kbGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy4kbGlzdC5vZmYoJ3RvdWNoc3RhcnQuc2xpY2sgbW91c2Vkb3duLnNsaWNrJywgXy5zd2lwZUhhbmRsZXIpO1xyXG4gICAgICAgIF8uJGxpc3Qub2ZmKCd0b3VjaG1vdmUuc2xpY2sgbW91c2Vtb3ZlLnNsaWNrJywgXy5zd2lwZUhhbmRsZXIpO1xyXG4gICAgICAgIF8uJGxpc3Qub2ZmKCd0b3VjaGVuZC5zbGljayBtb3VzZXVwLnNsaWNrJywgXy5zd2lwZUhhbmRsZXIpO1xyXG4gICAgICAgIF8uJGxpc3Qub2ZmKCd0b3VjaGNhbmNlbC5zbGljayBtb3VzZWxlYXZlLnNsaWNrJywgXy5zd2lwZUhhbmRsZXIpO1xyXG5cclxuICAgICAgICBfLiRsaXN0Lm9mZignY2xpY2suc2xpY2snLCBfLmNsaWNrSGFuZGxlcik7XHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9mZihfLnZpc2liaWxpdHlDaGFuZ2UsIF8udmlzaWJpbGl0eSk7XHJcblxyXG4gICAgICAgIF8uY2xlYW5VcFNsaWRlRXZlbnRzKCk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLiRsaXN0Lm9mZigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZvY3VzT25TZWxlY3QgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgJChfLiRzbGlkZVRyYWNrKS5jaGlsZHJlbigpLm9mZignY2xpY2suc2xpY2snLCBfLnNlbGVjdEhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9mZignb3JpZW50YXRpb25jaGFuZ2Uuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsIF8ub3JpZW50YXRpb25DaGFuZ2UpO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsIF8ucmVzaXplKTtcclxuXHJcbiAgICAgICAgJCgnW2RyYWdnYWJsZSE9dHJ1ZV0nLCBfLiRzbGlkZVRyYWNrKS5vZmYoJ2RyYWdzdGFydCcsIF8ucHJldmVudERlZmF1bHQpO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykub2ZmKCdsb2FkLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLnNldFBvc2l0aW9uKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5jbGVhblVwU2xpZGVFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLiRsaXN0Lm9mZignbW91c2VlbnRlci5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIHRydWUpKTtcclxuICAgICAgICBfLiRsaXN0Lm9mZignbW91c2VsZWF2ZS5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIGZhbHNlKSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuY2xlYW5VcFJvd3MgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLCBvcmlnaW5hbFNsaWRlcztcclxuXHJcbiAgICAgICAgaWYoXy5vcHRpb25zLnJvd3MgPiAwKSB7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsU2xpZGVzID0gXy4kc2xpZGVzLmNoaWxkcmVuKCkuY2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgb3JpZ2luYWxTbGlkZXMucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuICAgICAgICAgICAgXy4kc2xpZGVyLmVtcHR5KCkuYXBwZW5kKG9yaWdpbmFsU2xpZGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5zaG91bGRDbGljayA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24ocmVmcmVzaCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uYXV0b1BsYXlDbGVhcigpO1xyXG5cclxuICAgICAgICBfLnRvdWNoT2JqZWN0ID0ge307XHJcblxyXG4gICAgICAgIF8uY2xlYW5VcEV2ZW50cygpO1xyXG5cclxuICAgICAgICAkKCcuc2xpY2stY2xvbmVkJywgXy4kc2xpZGVyKS5kZXRhY2goKTtcclxuXHJcbiAgICAgICAgaWYgKF8uJGRvdHMpIHtcclxuICAgICAgICAgICAgXy4kZG90cy5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggXy4kcHJldkFycm93ICYmIF8uJHByZXZBcnJvdy5sZW5ndGggKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRwcmV2QXJyb3dcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQgc2xpY2stYXJyb3cgc2xpY2staGlkZGVuJylcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdhcmlhLWhpZGRlbiBhcmlhLWRpc2FibGVkIHRhYmluZGV4JylcclxuICAgICAgICAgICAgICAgIC5jc3MoJ2Rpc3BsYXknLCcnKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggXy5odG1sRXhwci50ZXN0KCBfLm9wdGlvbnMucHJldkFycm93ICkpIHtcclxuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBfLiRuZXh0QXJyb3cgJiYgXy4kbmV4dEFycm93Lmxlbmd0aCApIHtcclxuXHJcbiAgICAgICAgICAgIF8uJG5leHRBcnJvd1xyXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1kaXNhYmxlZCBzbGljay1hcnJvdyBzbGljay1oaWRkZW4nKVxyXG4gICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuIGFyaWEtZGlzYWJsZWQgdGFiaW5kZXgnKVxyXG4gICAgICAgICAgICAgICAgLmNzcygnZGlzcGxheScsJycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBfLmh0bWxFeHByLnRlc3QoIF8ub3B0aW9ucy5uZXh0QXJyb3cgKSkge1xyXG4gICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYgKF8uJHNsaWRlcykge1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVzXHJcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLXNsaWRlIHNsaWNrLWFjdGl2ZSBzbGljay1jZW50ZXIgc2xpY2stdmlzaWJsZSBzbGljay1jdXJyZW50JylcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdhcmlhLWhpZGRlbicpXHJcbiAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignZGF0YS1zbGljay1pbmRleCcpXHJcbiAgICAgICAgICAgICAgICAuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignc3R5bGUnLCAkKHRoaXMpLmRhdGEoJ29yaWdpbmFsU3R5bGluZycpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpO1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5kZXRhY2goKTtcclxuXHJcbiAgICAgICAgICAgIF8uJGxpc3QuZGV0YWNoKCk7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXIuYXBwZW5kKF8uJHNsaWRlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLmNsZWFuVXBSb3dzKCk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlci5yZW1vdmVDbGFzcygnc2xpY2stc2xpZGVyJyk7XHJcbiAgICAgICAgXy4kc2xpZGVyLnJlbW92ZUNsYXNzKCdzbGljay1pbml0aWFsaXplZCcpO1xyXG4gICAgICAgIF8uJHNsaWRlci5yZW1vdmVDbGFzcygnc2xpY2stZG90dGVkJyk7XHJcblxyXG4gICAgICAgIF8udW5zbGlja2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYoIXJlZnJlc2gpIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2Rlc3Ryb3knLCBbX10pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5kaXNhYmxlVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHNsaWRlKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbiA9IHt9O1xyXG5cclxuICAgICAgICB0cmFuc2l0aW9uW18udHJhbnNpdGlvblR5cGVdID0gJyc7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3ModHJhbnNpdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlKS5jc3ModHJhbnNpdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmZhZGVTbGlkZSA9IGZ1bmN0aW9uKHNsaWRlSW5kZXgsIGNhbGxiYWNrKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8uY3NzVHJhbnNpdGlvbnMgPT09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGVJbmRleCkuY3NzKHtcclxuICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZUluZGV4KS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcclxuICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkLCBfLm9wdGlvbnMuZWFzaW5nLCBjYWxsYmFjayk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBfLmFwcGx5VHJhbnNpdGlvbihzbGlkZUluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZUluZGV4KS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcclxuICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXy5kaXNhYmxlVHJhbnNpdGlvbihzbGlkZUluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCgpO1xyXG4gICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZmFkZVNsaWRlT3V0ID0gZnVuY3Rpb24oc2xpZGVJbmRleCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLmNzc1RyYW5zaXRpb25zID09PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcclxuICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleCAtIDJcclxuICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkLCBfLm9wdGlvbnMuZWFzaW5nKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIF8uYXBwbHlUcmFuc2l0aW9uKHNsaWRlSW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxyXG4gICAgICAgICAgICAgICAgekluZGV4OiBfLm9wdGlvbnMuekluZGV4IC0gMlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmZpbHRlclNsaWRlcyA9IFNsaWNrLnByb3RvdHlwZS5zbGlja0ZpbHRlciA9IGZ1bmN0aW9uKGZpbHRlcikge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChmaWx0ZXIgIT09IG51bGwpIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlc0NhY2hlID0gXy4kc2xpZGVzO1xyXG5cclxuICAgICAgICAgICAgXy51bmxvYWQoKTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlc0NhY2hlLmZpbHRlcihmaWx0ZXIpLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spO1xyXG5cclxuICAgICAgICAgICAgXy5yZWluaXQoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmZvY3VzSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlclxyXG4gICAgICAgICAgICAub2ZmKCdmb2N1cy5zbGljayBibHVyLnNsaWNrJylcclxuICAgICAgICAgICAgLm9uKCdmb2N1cy5zbGljayBibHVyLnNsaWNrJywgJyonLCBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIHZhciAkc2YgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiggXy5vcHRpb25zLnBhdXNlT25Gb2N1cyApIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmZvY3Vzc2VkID0gJHNmLmlzKCc6Zm9jdXMnKTtcclxuICAgICAgICAgICAgICAgICAgICBfLmF1dG9QbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LCAwKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXRDdXJyZW50ID0gU2xpY2sucHJvdG90eXBlLnNsaWNrQ3VycmVudFNsaWRlID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuICAgICAgICByZXR1cm4gXy5jdXJyZW50U2xpZGU7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZ2V0RG90Q291bnQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgYnJlYWtQb2ludCA9IDA7XHJcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHZhciBwYWdlclF0eSA9IDA7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgKytwYWdlclF0eTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChicmVha1BvaW50IDwgXy5zbGlkZUNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKytwYWdlclF0eTtcclxuICAgICAgICAgICAgICAgICAgICBicmVha1BvaW50ID0gY291bnRlciArIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudGVyICs9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDogXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcGFnZXJRdHkgPSBfLnNsaWRlQ291bnQ7XHJcbiAgICAgICAgfSBlbHNlIGlmKCFfLm9wdGlvbnMuYXNOYXZGb3IpIHtcclxuICAgICAgICAgICAgcGFnZXJRdHkgPSAxICsgTWF0aC5jZWlsKChfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAvIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCk7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICB3aGlsZSAoYnJlYWtQb2ludCA8IF8uc2xpZGVDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgKytwYWdlclF0eTtcclxuICAgICAgICAgICAgICAgIGJyZWFrUG9pbnQgPSBjb3VudGVyICsgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xyXG4gICAgICAgICAgICAgICAgY291bnRlciArPSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA/IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA6IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYWdlclF0eSAtIDE7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZ2V0TGVmdCA9IGZ1bmN0aW9uKHNsaWRlSW5kZXgpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICB0YXJnZXRMZWZ0LFxyXG4gICAgICAgICAgICB2ZXJ0aWNhbEhlaWdodCxcclxuICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAwLFxyXG4gICAgICAgICAgICB0YXJnZXRTbGlkZSxcclxuICAgICAgICAgICAgY29lZjtcclxuXHJcbiAgICAgICAgXy5zbGlkZU9mZnNldCA9IDA7XHJcbiAgICAgICAgdmVydGljYWxIZWlnaHQgPSBfLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCh0cnVlKTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9IChfLnNsaWRlV2lkdGggKiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAqIC0xO1xyXG4gICAgICAgICAgICAgICAgY29lZiA9IC0xXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZWYgPSAtMS41O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2VmID0gLTJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9ICh2ZXJ0aWNhbEhlaWdodCAqIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpICogY29lZjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2xpZGVJbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA+IF8uc2xpZGVDb3VudCAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNsaWRlSW5kZXggPiBfLnNsaWRlQ291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9ICgoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAtIChzbGlkZUluZGV4IC0gXy5zbGlkZUNvdW50KSkgKiBfLnNsaWRlV2lkdGgpICogLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsT2Zmc2V0ID0gKChfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC0gKHNsaWRlSW5kZXggLSBfLnNsaWRlQ291bnQpKSAqIHZlcnRpY2FsSGVpZ2h0KSAqIC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAoKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkgKiBfLnNsaWRlV2lkdGgpICogLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsT2Zmc2V0ID0gKChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpICogdmVydGljYWxIZWlnaHQpICogLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID4gXy5zbGlkZUNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gKChzbGlkZUluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdykgLSBfLnNsaWRlQ291bnQpICogXy5zbGlkZVdpZHRoO1xyXG4gICAgICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAoKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAtIF8uc2xpZGVDb3VudCkgKiB2ZXJ0aWNhbEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9ICgoXy5zbGlkZVdpZHRoICogTWF0aC5mbG9vcihfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSkgLyAyKSAtICgoXy5zbGlkZVdpZHRoICogXy5zbGlkZUNvdW50KSAvIDIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUgJiYgXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgKz0gXy5zbGlkZVdpZHRoICogTWF0aC5mbG9vcihfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMikgLSBfLnNsaWRlV2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgXy5zbGlkZU9mZnNldCArPSBfLnNsaWRlV2lkdGggKiBNYXRoLmZsb29yKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHRhcmdldExlZnQgPSAoKHNsaWRlSW5kZXggKiBfLnNsaWRlV2lkdGgpICogLTEpICsgXy5zbGlkZU9mZnNldDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0YXJnZXRMZWZ0ID0gKChzbGlkZUluZGV4ICogdmVydGljYWxIZWlnaHQpICogLTEpICsgdmVydGljYWxPZmZzZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnZhcmlhYmxlV2lkdGggPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyB8fCBfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRTbGlkZSA9IF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLmVxKHNsaWRlSW5kZXgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U2xpZGUgPSBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS5lcShzbGlkZUluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMucnRsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0U2xpZGVbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gKF8uJHNsaWRlVHJhY2sud2lkdGgoKSAtIHRhcmdldFNsaWRlWzBdLm9mZnNldExlZnQgLSB0YXJnZXRTbGlkZS53aWR0aCgpKSAqIC0xO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gIDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gdGFyZ2V0U2xpZGVbMF0gPyB0YXJnZXRTbGlkZVswXS5vZmZzZXRMZWZ0ICogLTEgOiAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyB8fCBfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0U2xpZGUgPSBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS5lcShzbGlkZUluZGV4KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0U2xpZGUgPSBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS5lcShzbGlkZUluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdyArIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMucnRsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFNsaWRlWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSAoXy4kc2xpZGVUcmFjay53aWR0aCgpIC0gdGFyZ2V0U2xpZGVbMF0ub2Zmc2V0TGVmdCAtIHRhcmdldFNsaWRlLndpZHRoKCkpICogLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9ICAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IHRhcmdldFNsaWRlWzBdID8gdGFyZ2V0U2xpZGVbMF0ub2Zmc2V0TGVmdCAqIC0xIDogMDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ICs9IChfLiRsaXN0LndpZHRoKCkgLSB0YXJnZXRTbGlkZS5vdXRlcldpZHRoKCkpIC8gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRhcmdldExlZnQ7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZ2V0T3B0aW9uID0gU2xpY2sucHJvdG90eXBlLnNsaWNrR2V0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIF8ub3B0aW9uc1tvcHRpb25dO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmdldE5hdmlnYWJsZUluZGV4ZXMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBicmVha1BvaW50ID0gMCxcclxuICAgICAgICAgICAgY291bnRlciA9IDAsXHJcbiAgICAgICAgICAgIGluZGV4ZXMgPSBbXSxcclxuICAgICAgICAgICAgbWF4O1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBtYXggPSBfLnNsaWRlQ291bnQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYnJlYWtQb2ludCA9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAqIC0xO1xyXG4gICAgICAgICAgICBjb3VudGVyID0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICogLTE7XHJcbiAgICAgICAgICAgIG1heCA9IF8uc2xpZGVDb3VudCAqIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aGlsZSAoYnJlYWtQb2ludCA8IG1heCkge1xyXG4gICAgICAgICAgICBpbmRleGVzLnB1c2goYnJlYWtQb2ludCk7XHJcbiAgICAgICAgICAgIGJyZWFrUG9pbnQgPSBjb3VudGVyICsgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xyXG4gICAgICAgICAgICBjb3VudGVyICs9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDogXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbmRleGVzO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmdldFNsaWNrID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmdldFNsaWRlQ291bnQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBzbGlkZXNUcmF2ZXJzZWQsIHN3aXBlZFNsaWRlLCBjZW50ZXJPZmZzZXQ7XHJcblxyXG4gICAgICAgIGNlbnRlck9mZnNldCA9IF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlID8gXy5zbGlkZVdpZHRoICogTWF0aC5mbG9vcihfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMikgOiAwO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnN3aXBlVG9TbGlkZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmZpbmQoJy5zbGljay1zbGlkZScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIHNsaWRlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2xpZGUub2Zmc2V0TGVmdCAtIGNlbnRlck9mZnNldCArICgkKHNsaWRlKS5vdXRlcldpZHRoKCkgLyAyKSA+IChfLnN3aXBlTGVmdCAqIC0xKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXBlZFNsaWRlID0gc2xpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNsaWRlc1RyYXZlcnNlZCA9IE1hdGguYWJzKCQoc3dpcGVkU2xpZGUpLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKSAtIF8uY3VycmVudFNsaWRlKSB8fCAxO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHNsaWRlc1RyYXZlcnNlZDtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZ29UbyA9IFNsaWNrLnByb3RvdHlwZS5zbGlja0dvVG8gPSBmdW5jdGlvbihzbGlkZSwgZG9udEFuaW1hdGUpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLmNoYW5nZVNsaWRlKHtcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ2luZGV4JyxcclxuICAgICAgICAgICAgICAgIGluZGV4OiBwYXJzZUludChzbGlkZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGRvbnRBbmltYXRlKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oY3JlYXRpb24pIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoISQoXy4kc2xpZGVyKS5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xyXG5cclxuICAgICAgICAgICAgJChfLiRzbGlkZXIpLmFkZENsYXNzKCdzbGljay1pbml0aWFsaXplZCcpO1xyXG5cclxuICAgICAgICAgICAgXy5idWlsZFJvd3MoKTtcclxuICAgICAgICAgICAgXy5idWlsZE91dCgpO1xyXG4gICAgICAgICAgICBfLnNldFByb3BzKCk7XHJcbiAgICAgICAgICAgIF8uc3RhcnRMb2FkKCk7XHJcbiAgICAgICAgICAgIF8ubG9hZFNsaWRlcigpO1xyXG4gICAgICAgICAgICBfLmluaXRpYWxpemVFdmVudHMoKTtcclxuICAgICAgICAgICAgXy51cGRhdGVBcnJvd3MoKTtcclxuICAgICAgICAgICAgXy51cGRhdGVEb3RzKCk7XHJcbiAgICAgICAgICAgIF8uY2hlY2tSZXNwb25zaXZlKHRydWUpO1xyXG4gICAgICAgICAgICBfLmZvY3VzSGFuZGxlcigpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjcmVhdGlvbikge1xyXG4gICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignaW5pdCcsIFtfXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy5pbml0QURBKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5hdXRvcGxheSApIHtcclxuXHJcbiAgICAgICAgICAgIF8ucGF1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIF8uYXV0b1BsYXkoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmluaXRBREEgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICBudW1Eb3RHcm91cHMgPSBNYXRoLmNlaWwoXy5zbGlkZUNvdW50IC8gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyksXHJcbiAgICAgICAgICAgICAgICB0YWJDb250cm9sSW5kZXhlcyA9IF8uZ2V0TmF2aWdhYmxlSW5kZXhlcygpLmZpbHRlcihmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHZhbCA+PSAwKSAmJiAodmFsIDwgXy5zbGlkZUNvdW50KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXMuYWRkKF8uJHNsaWRlVHJhY2suZmluZCgnLnNsaWNrLWNsb25lZCcpKS5hdHRyKHtcclxuICAgICAgICAgICAgJ2FyaWEtaGlkZGVuJzogJ3RydWUnLFxyXG4gICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnXHJcbiAgICAgICAgfSkuZmluZCgnYSwgaW5wdXQsIGJ1dHRvbiwgc2VsZWN0JykuYXR0cih7XHJcbiAgICAgICAgICAgICd0YWJpbmRleCc6ICctMSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKF8uJGRvdHMgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVzLm5vdChfLiRzbGlkZVRyYWNrLmZpbmQoJy5zbGljay1jbG9uZWQnKSkuZWFjaChmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2xpZGVDb250cm9sSW5kZXggPSB0YWJDb250cm9sSW5kZXhlcy5pbmRleE9mKGkpO1xyXG5cclxuICAgICAgICAgICAgICAgICQodGhpcykuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3JvbGUnOiAndGFicGFuZWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICdpZCc6ICdzbGljay1zbGlkZScgKyBfLmluc3RhbmNlVWlkICsgaSxcclxuICAgICAgICAgICAgICAgICAgICAndGFiaW5kZXgnOiAtMVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNsaWRlQ29udHJvbEluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgdmFyIGFyaWFCdXR0b25Db250cm9sID0gJ3NsaWNrLXNsaWRlLWNvbnRyb2wnICsgXy5pbnN0YW5jZVVpZCArIHNsaWRlQ29udHJvbEluZGV4XHJcbiAgICAgICAgICAgICAgICAgICBpZiAoJCgnIycgKyBhcmlhQnV0dG9uQ29udHJvbCkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAnYXJpYS1kZXNjcmliZWRieSc6IGFyaWFCdXR0b25Db250cm9sXHJcbiAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIF8uJGRvdHMuYXR0cigncm9sZScsICd0YWJsaXN0JykuZmluZCgnbGknKS5lYWNoKGZ1bmN0aW9uKGkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtYXBwZWRTbGlkZUluZGV4ID0gdGFiQ29udHJvbEluZGV4ZXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKHtcclxuICAgICAgICAgICAgICAgICAgICAncm9sZSc6ICdwcmVzZW50YXRpb24nXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ2J1dHRvbicpLmZpcnN0KCkuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3JvbGUnOiAndGFiJyxcclxuICAgICAgICAgICAgICAgICAgICAnaWQnOiAnc2xpY2stc2xpZGUtY29udHJvbCcgKyBfLmluc3RhbmNlVWlkICsgaSxcclxuICAgICAgICAgICAgICAgICAgICAnYXJpYS1jb250cm9scyc6ICdzbGljay1zbGlkZScgKyBfLmluc3RhbmNlVWlkICsgbWFwcGVkU2xpZGVJbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAnYXJpYS1sYWJlbCc6IChpICsgMSkgKyAnIG9mICcgKyBudW1Eb3RHcm91cHMsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICd0YWJpbmRleCc6ICctMSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSkuZXEoXy5jdXJyZW50U2xpZGUpLmZpbmQoJ2J1dHRvbicpLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiAndHJ1ZScsXHJcbiAgICAgICAgICAgICAgICAndGFiaW5kZXgnOiAnMCdcclxuICAgICAgICAgICAgfSkuZW5kKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpPV8uY3VycmVudFNsaWRlLCBtYXg9aStfLm9wdGlvbnMuc2xpZGVzVG9TaG93OyBpIDwgbWF4OyBpKyspIHtcclxuICAgICAgICAgIGlmIChfLm9wdGlvbnMuZm9jdXNPbkNoYW5nZSkge1xyXG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoaSkuYXR0cih7J3RhYmluZGV4JzogJzAnfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoaSkucmVtb3ZlQXR0cigndGFiaW5kZXgnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uYWN0aXZhdGVBREEoKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0QXJyb3dFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmFycm93cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgIF8uJHByZXZBcnJvd1xyXG4gICAgICAgICAgICAgICAub2ZmKCdjbGljay5zbGljaycpXHJcbiAgICAgICAgICAgICAgIC5vbignY2xpY2suc2xpY2snLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ3ByZXZpb3VzJ1xyXG4gICAgICAgICAgICAgICB9LCBfLmNoYW5nZVNsaWRlKTtcclxuICAgICAgICAgICAgXy4kbmV4dEFycm93XHJcbiAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrLnNsaWNrJylcclxuICAgICAgICAgICAgICAgLm9uKCdjbGljay5zbGljaycsIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnbmV4dCdcclxuICAgICAgICAgICAgICAgfSwgXy5jaGFuZ2VTbGlkZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5vbigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cub24oJ2tleWRvd24uc2xpY2snLCBfLmtleUhhbmRsZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmluaXREb3RFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmRvdHMgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICAkKCdsaScsIF8uJGRvdHMpLm9uKCdjbGljay5zbGljaycsIHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdpbmRleCdcclxuICAgICAgICAgICAgfSwgXy5jaGFuZ2VTbGlkZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIF8uJGRvdHMub24oJ2tleWRvd24uc2xpY2snLCBfLmtleUhhbmRsZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmRvdHMgPT09IHRydWUgJiYgXy5vcHRpb25zLnBhdXNlT25Eb3RzSG92ZXIgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgJCgnbGknLCBfLiRkb3RzKVxyXG4gICAgICAgICAgICAgICAgLm9uKCdtb3VzZWVudGVyLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgdHJ1ZSkpXHJcbiAgICAgICAgICAgICAgICAub24oJ21vdXNlbGVhdmUuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCBmYWxzZSkpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuaW5pdFNsaWRlRXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKCBfLm9wdGlvbnMucGF1c2VPbkhvdmVyICkge1xyXG5cclxuICAgICAgICAgICAgXy4kbGlzdC5vbignbW91c2VlbnRlci5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIHRydWUpKTtcclxuICAgICAgICAgICAgXy4kbGlzdC5vbignbW91c2VsZWF2ZS5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIGZhbHNlKSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0aWFsaXplRXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5pbml0QXJyb3dFdmVudHMoKTtcclxuXHJcbiAgICAgICAgXy5pbml0RG90RXZlbnRzKCk7XHJcbiAgICAgICAgXy5pbml0U2xpZGVFdmVudHMoKTtcclxuXHJcbiAgICAgICAgXy4kbGlzdC5vbigndG91Y2hzdGFydC5zbGljayBtb3VzZWRvd24uc2xpY2snLCB7XHJcbiAgICAgICAgICAgIGFjdGlvbjogJ3N0YXJ0J1xyXG4gICAgICAgIH0sIF8uc3dpcGVIYW5kbGVyKTtcclxuICAgICAgICBfLiRsaXN0Lm9uKCd0b3VjaG1vdmUuc2xpY2sgbW91c2Vtb3ZlLnNsaWNrJywge1xyXG4gICAgICAgICAgICBhY3Rpb246ICdtb3ZlJ1xyXG4gICAgICAgIH0sIF8uc3dpcGVIYW5kbGVyKTtcclxuICAgICAgICBfLiRsaXN0Lm9uKCd0b3VjaGVuZC5zbGljayBtb3VzZXVwLnNsaWNrJywge1xyXG4gICAgICAgICAgICBhY3Rpb246ICdlbmQnXHJcbiAgICAgICAgfSwgXy5zd2lwZUhhbmRsZXIpO1xyXG4gICAgICAgIF8uJGxpc3Qub24oJ3RvdWNoY2FuY2VsLnNsaWNrIG1vdXNlbGVhdmUuc2xpY2snLCB7XHJcbiAgICAgICAgICAgIGFjdGlvbjogJ2VuZCdcclxuICAgICAgICB9LCBfLnN3aXBlSGFuZGxlcik7XHJcblxyXG4gICAgICAgIF8uJGxpc3Qub24oJ2NsaWNrLnNsaWNrJywgXy5jbGlja0hhbmRsZXIpO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbihfLnZpc2liaWxpdHlDaGFuZ2UsICQucHJveHkoXy52aXNpYmlsaXR5LCBfKSk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLiRsaXN0Lm9uKCdrZXlkb3duLnNsaWNrJywgXy5rZXlIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZm9jdXNPblNlbGVjdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAkKF8uJHNsaWRlVHJhY2spLmNoaWxkcmVuKCkub24oJ2NsaWNrLnNsaWNrJywgXy5zZWxlY3RIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQod2luZG93KS5vbignb3JpZW50YXRpb25jaGFuZ2Uuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsICQucHJveHkoXy5vcmllbnRhdGlvbkNoYW5nZSwgXykpO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS5zbGljay5zbGljay0nICsgXy5pbnN0YW5jZVVpZCwgJC5wcm94eShfLnJlc2l6ZSwgXykpO1xyXG5cclxuICAgICAgICAkKCdbZHJhZ2dhYmxlIT10cnVlXScsIF8uJHNsaWRlVHJhY2spLm9uKCdkcmFnc3RhcnQnLCBfLnByZXZlbnREZWZhdWx0KTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLnNldFBvc2l0aW9uKTtcclxuICAgICAgICAkKF8uc2V0UG9zaXRpb24pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmluaXRVSSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHByZXZBcnJvdy5zaG93KCk7XHJcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdy5zaG93KCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5kb3RzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuXHJcbiAgICAgICAgICAgIF8uJGRvdHMuc2hvdygpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUua2V5SGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuICAgICAgICAgLy9Eb250IHNsaWRlIGlmIHRoZSBjdXJzb3IgaXMgaW5zaWRlIHRoZSBmb3JtIGZpZWxkcyBhbmQgYXJyb3cga2V5cyBhcmUgcHJlc3NlZFxyXG4gICAgICAgIGlmKCFldmVudC50YXJnZXQudGFnTmFtZS5tYXRjaCgnVEVYVEFSRUF8SU5QVVR8U0VMRUNUJykpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM3ICYmIF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBfLmNoYW5nZVNsaWRlKHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IF8ub3B0aW9ucy5ydGwgPT09IHRydWUgPyAnbmV4dCcgOiAgJ3ByZXZpb3VzJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM5ICYmIF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBfLmNoYW5nZVNsaWRlKHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IF8ub3B0aW9ucy5ydGwgPT09IHRydWUgPyAncHJldmlvdXMnIDogJ25leHQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUubGF6eUxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBsb2FkUmFuZ2UsIGNsb25lUmFuZ2UsIHJhbmdlU3RhcnQsIHJhbmdlRW5kO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkSW1hZ2VzKGltYWdlc1Njb3BlKSB7XHJcblxyXG4gICAgICAgICAgICAkKCdpbWdbZGF0YS1sYXp5XScsIGltYWdlc1Njb3BlKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VTb3VyY2UgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtbGF6eScpLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlU3JjU2V0ID0gJCh0aGlzKS5hdHRyKCdkYXRhLXNyY3NldCcpLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlU2l6ZXMgID0gJCh0aGlzKS5hdHRyKCdkYXRhLXNpemVzJykgfHwgXy4kc2xpZGVyLmF0dHIoJ2RhdGEtc2l6ZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVRvTG9hZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG5cclxuICAgICAgICAgICAgICAgIGltYWdlVG9Mb2FkLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYW5pbWF0ZSh7IG9wYWNpdHk6IDAgfSwgMTAwLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1hZ2VTcmNTZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignc3Jjc2V0JywgaW1hZ2VTcmNTZXQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGltYWdlU2l6ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdzaXplcycsIGltYWdlU2l6ZXMgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignc3JjJywgaW1hZ2VTb3VyY2UpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFuaW1hdGUoeyBvcGFjaXR5OiAxIH0sIDIwMCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignZGF0YS1sYXp5IGRhdGEtc3Jjc2V0IGRhdGEtc2l6ZXMnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1sb2FkaW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignbGF6eUxvYWRlZCcsIFtfLCBpbWFnZSwgaW1hZ2VTb3VyY2VdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZVRvTG9hZC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCAnZGF0YS1sYXp5JyApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyggJ3NsaWNrLWxvYWRpbmcnIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCAnc2xpY2stbGF6eWxvYWQtZXJyb3InICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdsYXp5TG9hZEVycm9yJywgWyBfLCBpbWFnZSwgaW1hZ2VTb3VyY2UgXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZVRvTG9hZC5zcmMgPSBpbWFnZVNvdXJjZTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByYW5nZVN0YXJ0ID0gXy5jdXJyZW50U2xpZGUgKyAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIgKyAxKTtcclxuICAgICAgICAgICAgICAgIHJhbmdlRW5kID0gcmFuZ2VTdGFydCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyAyO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VTdGFydCA9IE1hdGgubWF4KDAsIF8uY3VycmVudFNsaWRlIC0gKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyICsgMSkpO1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VFbmQgPSAyICsgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyICsgMSkgKyBfLmN1cnJlbnRTbGlkZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJhbmdlU3RhcnQgPSBfLm9wdGlvbnMuaW5maW5pdGUgPyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgXy5jdXJyZW50U2xpZGUgOiBfLmN1cnJlbnRTbGlkZTtcclxuICAgICAgICAgICAgcmFuZ2VFbmQgPSBNYXRoLmNlaWwocmFuZ2VTdGFydCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyYW5nZVN0YXJ0ID4gMCkgcmFuZ2VTdGFydC0tO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJhbmdlRW5kIDw9IF8uc2xpZGVDb3VudCkgcmFuZ2VFbmQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbG9hZFJhbmdlID0gXy4kc2xpZGVyLmZpbmQoJy5zbGljay1zbGlkZScpLnNsaWNlKHJhbmdlU3RhcnQsIHJhbmdlRW5kKTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5sYXp5TG9hZCA9PT0gJ2FudGljaXBhdGVkJykge1xyXG4gICAgICAgICAgICB2YXIgcHJldlNsaWRlID0gcmFuZ2VTdGFydCAtIDEsXHJcbiAgICAgICAgICAgICAgICBuZXh0U2xpZGUgPSByYW5nZUVuZCxcclxuICAgICAgICAgICAgICAgICRzbGlkZXMgPSBfLiRzbGlkZXIuZmluZCgnLnNsaWNrLXNsaWRlJyk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJldlNsaWRlIDwgMCkgcHJldlNsaWRlID0gXy5zbGlkZUNvdW50IC0gMTtcclxuICAgICAgICAgICAgICAgIGxvYWRSYW5nZSA9IGxvYWRSYW5nZS5hZGQoJHNsaWRlcy5lcShwcmV2U2xpZGUpKTtcclxuICAgICAgICAgICAgICAgIGxvYWRSYW5nZSA9IGxvYWRSYW5nZS5hZGQoJHNsaWRlcy5lcShuZXh0U2xpZGUpKTtcclxuICAgICAgICAgICAgICAgIHByZXZTbGlkZS0tO1xyXG4gICAgICAgICAgICAgICAgbmV4dFNsaWRlKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxvYWRJbWFnZXMobG9hZFJhbmdlKTtcclxuXHJcbiAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgIGNsb25lUmFuZ2UgPSBfLiRzbGlkZXIuZmluZCgnLnNsaWNrLXNsaWRlJyk7XHJcbiAgICAgICAgICAgIGxvYWRJbWFnZXMoY2xvbmVSYW5nZSk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgaWYgKF8uY3VycmVudFNsaWRlID49IF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgY2xvbmVSYW5nZSA9IF8uJHNsaWRlci5maW5kKCcuc2xpY2stY2xvbmVkJykuc2xpY2UoMCwgXy5vcHRpb25zLnNsaWRlc1RvU2hvdyk7XHJcbiAgICAgICAgICAgIGxvYWRJbWFnZXMoY2xvbmVSYW5nZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChfLmN1cnJlbnRTbGlkZSA9PT0gMCkge1xyXG4gICAgICAgICAgICBjbG9uZVJhbmdlID0gXy4kc2xpZGVyLmZpbmQoJy5zbGljay1jbG9uZWQnKS5zbGljZShfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICogLTEpO1xyXG4gICAgICAgICAgICBsb2FkSW1hZ2VzKGNsb25lUmFuZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5sb2FkU2xpZGVyID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5zZXRQb3NpdGlvbigpO1xyXG5cclxuICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyh7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDFcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVyLnJlbW92ZUNsYXNzKCdzbGljay1sb2FkaW5nJyk7XHJcblxyXG4gICAgICAgIF8uaW5pdFVJKCk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMubGF6eUxvYWQgPT09ICdwcm9ncmVzc2l2ZScpIHtcclxuICAgICAgICAgICAgXy5wcm9ncmVzc2l2ZUxhenlMb2FkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLm5leHQgPSBTbGljay5wcm90b3R5cGUuc2xpY2tOZXh0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5jaGFuZ2VTbGlkZSh7XHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICduZXh0J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUub3JpZW50YXRpb25DaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLmNoZWNrUmVzcG9uc2l2ZSgpO1xyXG4gICAgICAgIF8uc2V0UG9zaXRpb24oKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5wYXVzZSA9IFNsaWNrLnByb3RvdHlwZS5zbGlja1BhdXNlID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5hdXRvUGxheUNsZWFyKCk7XHJcbiAgICAgICAgXy5wYXVzZWQgPSB0cnVlO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnBsYXkgPSBTbGljay5wcm90b3R5cGUuc2xpY2tQbGF5ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5hdXRvUGxheSgpO1xyXG4gICAgICAgIF8ub3B0aW9ucy5hdXRvcGxheSA9IHRydWU7XHJcbiAgICAgICAgXy5wYXVzZWQgPSBmYWxzZTtcclxuICAgICAgICBfLmZvY3Vzc2VkID0gZmFsc2U7XHJcbiAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnBvc3RTbGlkZSA9IGZ1bmN0aW9uKGluZGV4KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYoICFfLnVuc2xpY2tlZCApIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdhZnRlckNoYW5nZScsIFtfLCBpbmRleF0pO1xyXG5cclxuICAgICAgICAgICAgXy5hbmltYXRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgICAgICBfLnNldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIF8uc3dpcGVMZWZ0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmICggXy5vcHRpb25zLmF1dG9wbGF5ICkge1xyXG4gICAgICAgICAgICAgICAgXy5hdXRvUGxheSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIF8uaW5pdEFEQSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuZm9jdXNPbkNoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciAkY3VycmVudFNsaWRlID0gJChfLiRzbGlkZXMuZ2V0KF8uY3VycmVudFNsaWRlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGN1cnJlbnRTbGlkZS5hdHRyKCd0YWJpbmRleCcsIDApLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnByZXYgPSBTbGljay5wcm90b3R5cGUuc2xpY2tQcmV2ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5jaGFuZ2VTbGlkZSh7XHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdwcmV2aW91cydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5wcm9ncmVzc2l2ZUxhenlMb2FkID0gZnVuY3Rpb24oIHRyeUNvdW50ICkge1xyXG5cclxuICAgICAgICB0cnlDb3VudCA9IHRyeUNvdW50IHx8IDE7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgJGltZ3NUb0xvYWQgPSAkKCAnaW1nW2RhdGEtbGF6eV0nLCBfLiRzbGlkZXIgKSxcclxuICAgICAgICAgICAgaW1hZ2UsXHJcbiAgICAgICAgICAgIGltYWdlU291cmNlLFxyXG4gICAgICAgICAgICBpbWFnZVNyY1NldCxcclxuICAgICAgICAgICAgaW1hZ2VTaXplcyxcclxuICAgICAgICAgICAgaW1hZ2VUb0xvYWQ7XHJcblxyXG4gICAgICAgIGlmICggJGltZ3NUb0xvYWQubGVuZ3RoICkge1xyXG5cclxuICAgICAgICAgICAgaW1hZ2UgPSAkaW1nc1RvTG9hZC5maXJzdCgpO1xyXG4gICAgICAgICAgICBpbWFnZVNvdXJjZSA9IGltYWdlLmF0dHIoJ2RhdGEtbGF6eScpO1xyXG4gICAgICAgICAgICBpbWFnZVNyY1NldCA9IGltYWdlLmF0dHIoJ2RhdGEtc3Jjc2V0Jyk7XHJcbiAgICAgICAgICAgIGltYWdlU2l6ZXMgID0gaW1hZ2UuYXR0cignZGF0YS1zaXplcycpIHx8IF8uJHNsaWRlci5hdHRyKCdkYXRhLXNpemVzJyk7XHJcbiAgICAgICAgICAgIGltYWdlVG9Mb2FkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcblxyXG4gICAgICAgICAgICBpbWFnZVRvTG9hZC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW1hZ2VTcmNTZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignc3Jjc2V0JywgaW1hZ2VTcmNTZXQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGltYWdlU2l6ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdzaXplcycsIGltYWdlU2l6ZXMgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAuYXR0ciggJ3NyYycsIGltYWdlU291cmNlIClcclxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignZGF0YS1sYXp5IGRhdGEtc3Jjc2V0IGRhdGEtc2l6ZXMnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stbG9hZGluZycpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggXy5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0ID09PSB0cnVlICkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uc2V0UG9zaXRpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignbGF6eUxvYWRlZCcsIFsgXywgaW1hZ2UsIGltYWdlU291cmNlIF0pO1xyXG4gICAgICAgICAgICAgICAgXy5wcm9ncmVzc2l2ZUxhenlMb2FkKCk7XHJcblxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaW1hZ2VUb0xvYWQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggdHJ5Q291bnQgPCAzICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiB0cnkgdG8gbG9hZCB0aGUgaW1hZ2UgMyB0aW1lcyxcclxuICAgICAgICAgICAgICAgICAgICAgKiBsZWF2ZSBhIHNsaWdodCBkZWxheSBzbyB3ZSBkb24ndCBnZXRcclxuICAgICAgICAgICAgICAgICAgICAgKiBzZXJ2ZXJzIGJsb2NraW5nIHRoZSByZXF1ZXN0LlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLnByb2dyZXNzaXZlTGF6eUxvYWQoIHRyeUNvdW50ICsgMSApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMCApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCAnZGF0YS1sYXp5JyApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyggJ3NsaWNrLWxvYWRpbmcnIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCAnc2xpY2stbGF6eWxvYWQtZXJyb3InICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdsYXp5TG9hZEVycm9yJywgWyBfLCBpbWFnZSwgaW1hZ2VTb3VyY2UgXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8ucHJvZ3Jlc3NpdmVMYXp5TG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpbWFnZVRvTG9hZC5zcmMgPSBpbWFnZVNvdXJjZTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdhbGxJbWFnZXNMb2FkZWQnLCBbIF8gXSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24oIGluaXRpYWxpemluZyApIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLCBjdXJyZW50U2xpZGUsIGxhc3RWaXNpYmxlSW5kZXg7XHJcblxyXG4gICAgICAgIGxhc3RWaXNpYmxlSW5kZXggPSBfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93O1xyXG5cclxuICAgICAgICAvLyBpbiBub24taW5maW5pdGUgc2xpZGVycywgd2UgZG9uJ3Qgd2FudCB0byBnbyBwYXN0IHRoZVxyXG4gICAgICAgIC8vIGxhc3QgdmlzaWJsZSBpbmRleC5cclxuICAgICAgICBpZiggIV8ub3B0aW9ucy5pbmZpbml0ZSAmJiAoIF8uY3VycmVudFNsaWRlID4gbGFzdFZpc2libGVJbmRleCApKSB7XHJcbiAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gbGFzdFZpc2libGVJbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmIGxlc3Mgc2xpZGVzIHRoYW4gdG8gc2hvdywgZ28gdG8gc3RhcnQuXHJcbiAgICAgICAgaWYgKCBfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyApIHtcclxuICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSAwO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN1cnJlbnRTbGlkZSA9IF8uY3VycmVudFNsaWRlO1xyXG5cclxuICAgICAgICBfLmRlc3Ryb3kodHJ1ZSk7XHJcblxyXG4gICAgICAgICQuZXh0ZW5kKF8sIF8uaW5pdGlhbHMsIHsgY3VycmVudFNsaWRlOiBjdXJyZW50U2xpZGUgfSk7XHJcblxyXG4gICAgICAgIF8uaW5pdCgpO1xyXG5cclxuICAgICAgICBpZiggIWluaXRpYWxpemluZyApIHtcclxuXHJcbiAgICAgICAgICAgIF8uY2hhbmdlU2xpZGUoe1xyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdpbmRleCcsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGN1cnJlbnRTbGlkZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5yZWdpc3RlckJyZWFrcG9pbnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcywgYnJlYWtwb2ludCwgY3VycmVudEJyZWFrcG9pbnQsIGwsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmVTZXR0aW5ncyA9IF8ub3B0aW9ucy5yZXNwb25zaXZlIHx8IG51bGw7XHJcblxyXG4gICAgICAgIGlmICggJC50eXBlKHJlc3BvbnNpdmVTZXR0aW5ncykgPT09ICdhcnJheScgJiYgcmVzcG9uc2l2ZVNldHRpbmdzLmxlbmd0aCApIHtcclxuXHJcbiAgICAgICAgICAgIF8ucmVzcG9uZFRvID0gXy5vcHRpb25zLnJlc3BvbmRUbyB8fCAnd2luZG93JztcclxuXHJcbiAgICAgICAgICAgIGZvciAoIGJyZWFrcG9pbnQgaW4gcmVzcG9uc2l2ZVNldHRpbmdzICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGwgPSBfLmJyZWFrcG9pbnRzLmxlbmd0aC0xO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zaXZlU2V0dGluZ3MuaGFzT3duUHJvcGVydHkoYnJlYWtwb2ludCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QnJlYWtwb2ludCA9IHJlc3BvbnNpdmVTZXR0aW5nc1ticmVha3BvaW50XS5icmVha3BvaW50O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJyZWFrcG9pbnRzIGFuZCBjdXQgb3V0IGFueSBleGlzdGluZ1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG9uZXMgd2l0aCB0aGUgc2FtZSBicmVha3BvaW50IG51bWJlciwgd2UgZG9uJ3Qgd2FudCBkdXBlcy5cclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSggbCA+PSAwICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggXy5icmVha3BvaW50c1tsXSAmJiBfLmJyZWFrcG9pbnRzW2xdID09PSBjdXJyZW50QnJlYWtwb2ludCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludHMuc3BsaWNlKGwsMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXy5icmVha3BvaW50cy5wdXNoKGN1cnJlbnRCcmVha3BvaW50KTtcclxuICAgICAgICAgICAgICAgICAgICBfLmJyZWFrcG9pbnRTZXR0aW5nc1tjdXJyZW50QnJlYWtwb2ludF0gPSByZXNwb25zaXZlU2V0dGluZ3NbYnJlYWtwb2ludF0uc2V0dGluZ3M7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgXy5icmVha3BvaW50cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoIF8ub3B0aW9ucy5tb2JpbGVGaXJzdCApID8gYS1iIDogYi1hO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnJlaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlcyA9XHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2tcclxuICAgICAgICAgICAgICAgIC5jaGlsZHJlbihfLm9wdGlvbnMuc2xpZGUpXHJcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLXNsaWRlJyk7XHJcblxyXG4gICAgICAgIF8uc2xpZGVDb3VudCA9IF8uJHNsaWRlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgIGlmIChfLmN1cnJlbnRTbGlkZSA+PSBfLnNsaWRlQ291bnQgJiYgXy5jdXJyZW50U2xpZGUgIT09IDApIHtcclxuICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBfLmN1cnJlbnRTbGlkZSAtIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLnJlZ2lzdGVyQnJlYWtwb2ludHMoKTtcclxuXHJcbiAgICAgICAgXy5zZXRQcm9wcygpO1xyXG4gICAgICAgIF8uc2V0dXBJbmZpbml0ZSgpO1xyXG4gICAgICAgIF8uYnVpbGRBcnJvd3MoKTtcclxuICAgICAgICBfLnVwZGF0ZUFycm93cygpO1xyXG4gICAgICAgIF8uaW5pdEFycm93RXZlbnRzKCk7XHJcbiAgICAgICAgXy5idWlsZERvdHMoKTtcclxuICAgICAgICBfLnVwZGF0ZURvdHMoKTtcclxuICAgICAgICBfLmluaXREb3RFdmVudHMoKTtcclxuICAgICAgICBfLmNsZWFuVXBTbGlkZUV2ZW50cygpO1xyXG4gICAgICAgIF8uaW5pdFNsaWRlRXZlbnRzKCk7XHJcblxyXG4gICAgICAgIF8uY2hlY2tSZXNwb25zaXZlKGZhbHNlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mb2N1c09uU2VsZWN0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICQoXy4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vbignY2xpY2suc2xpY2snLCBfLnNlbGVjdEhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy5zZXRTbGlkZUNsYXNzZXModHlwZW9mIF8uY3VycmVudFNsaWRlID09PSAnbnVtYmVyJyA/IF8uY3VycmVudFNsaWRlIDogMCk7XHJcblxyXG4gICAgICAgIF8uc2V0UG9zaXRpb24oKTtcclxuICAgICAgICBfLmZvY3VzSGFuZGxlcigpO1xyXG5cclxuICAgICAgICBfLnBhdXNlZCA9ICFfLm9wdGlvbnMuYXV0b3BsYXk7XHJcbiAgICAgICAgXy5hdXRvUGxheSgpO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcigncmVJbml0JywgW19dKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgIT09IF8ud2luZG93V2lkdGgpIHtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KF8ud2luZG93RGVsYXkpO1xyXG4gICAgICAgICAgICBfLndpbmRvd0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBfLndpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICBfLmNoZWNrUmVzcG9uc2l2ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYoICFfLnVuc2xpY2tlZCApIHsgXy5zZXRQb3NpdGlvbigpOyB9XHJcbiAgICAgICAgICAgIH0sIDUwKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5yZW1vdmVTbGlkZSA9IFNsaWNrLnByb3RvdHlwZS5zbGlja1JlbW92ZSA9IGZ1bmN0aW9uKGluZGV4LCByZW1vdmVCZWZvcmUsIHJlbW92ZUFsbCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YoaW5kZXgpID09PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAgICAgcmVtb3ZlQmVmb3JlID0gaW5kZXg7XHJcbiAgICAgICAgICAgIGluZGV4ID0gcmVtb3ZlQmVmb3JlID09PSB0cnVlID8gMCA6IF8uc2xpZGVDb3VudCAtIDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW5kZXggPSByZW1vdmVCZWZvcmUgPT09IHRydWUgPyAtLWluZGV4IDogaW5kZXg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDwgMSB8fCBpbmRleCA8IDAgfHwgaW5kZXggPiBfLnNsaWRlQ291bnQgLSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8udW5sb2FkKCk7XHJcblxyXG4gICAgICAgIGlmIChyZW1vdmVBbGwgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5lcShpbmRleCkucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLiRzbGlkZXMgPSBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVUcmFjay5hcHBlbmQoXy4kc2xpZGVzKTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVzQ2FjaGUgPSBfLiRzbGlkZXM7XHJcblxyXG4gICAgICAgIF8ucmVpbml0KCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc2V0Q1NTID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBwb3NpdGlvblByb3BzID0ge30sXHJcbiAgICAgICAgICAgIHgsIHk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMucnRsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gLXBvc2l0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICB4ID0gXy5wb3NpdGlvblByb3AgPT0gJ2xlZnQnID8gTWF0aC5jZWlsKHBvc2l0aW9uKSArICdweCcgOiAnMHB4JztcclxuICAgICAgICB5ID0gXy5wb3NpdGlvblByb3AgPT0gJ3RvcCcgPyBNYXRoLmNlaWwocG9zaXRpb24pICsgJ3B4JyA6ICcwcHgnO1xyXG5cclxuICAgICAgICBwb3NpdGlvblByb3BzW18ucG9zaXRpb25Qcm9wXSA9IHBvc2l0aW9uO1xyXG5cclxuICAgICAgICBpZiAoXy50cmFuc2Zvcm1zRW5hYmxlZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MocG9zaXRpb25Qcm9wcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcG9zaXRpb25Qcm9wcyA9IHt9O1xyXG4gICAgICAgICAgICBpZiAoXy5jc3NUcmFuc2l0aW9ucyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlKCcgKyB4ICsgJywgJyArIHkgKyAnKSc7XHJcbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhwb3NpdGlvblByb3BzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlM2QoJyArIHggKyAnLCAnICsgeSArICcsIDBweCknO1xyXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MocG9zaXRpb25Qcm9wcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc2V0RGltZW5zaW9ucyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgXy4kbGlzdC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICgnMHB4ICcgKyBfLm9wdGlvbnMuY2VudGVyUGFkZGluZylcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy4kbGlzdC5oZWlnaHQoXy4kc2xpZGVzLmZpcnN0KCkub3V0ZXJIZWlnaHQodHJ1ZSkgKiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KTtcclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBfLiRsaXN0LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogKF8ub3B0aW9ucy5jZW50ZXJQYWRkaW5nICsgJyAwcHgnKVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8ubGlzdFdpZHRoID0gXy4kbGlzdC53aWR0aCgpO1xyXG4gICAgICAgIF8ubGlzdEhlaWdodCA9IF8uJGxpc3QuaGVpZ2h0KCk7XHJcblxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSAmJiBfLm9wdGlvbnMudmFyaWFibGVXaWR0aCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgXy5zbGlkZVdpZHRoID0gTWF0aC5jZWlsKF8ubGlzdFdpZHRoIC8gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyk7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2sud2lkdGgoTWF0aC5jZWlsKChfLnNsaWRlV2lkdGggKiBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS5sZW5ndGgpKSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLnZhcmlhYmxlV2lkdGggPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay53aWR0aCg1MDAwICogXy5zbGlkZUNvdW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfLnNsaWRlV2lkdGggPSBNYXRoLmNlaWwoXy5saXN0V2lkdGgpO1xyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmhlaWdodChNYXRoLmNlaWwoKF8uJHNsaWRlcy5maXJzdCgpLm91dGVySGVpZ2h0KHRydWUpICogXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykubGVuZ3RoKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG9mZnNldCA9IF8uJHNsaWRlcy5maXJzdCgpLm91dGVyV2lkdGgodHJ1ZSkgLSBfLiRzbGlkZXMuZmlyc3QoKS53aWR0aCgpO1xyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmFyaWFibGVXaWR0aCA9PT0gZmFsc2UpIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLndpZHRoKF8uc2xpZGVXaWR0aCAtIG9mZnNldCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc2V0RmFkZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIHRhcmdldExlZnQ7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlcy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRhcmdldExlZnQgPSAoXy5zbGlkZVdpZHRoICogaW5kZXgpICogLTE7XHJcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMucnRsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IHRhcmdldExlZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleCAtIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogdGFyZ2V0TGVmdCxcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiBfLm9wdGlvbnMuekluZGV4IC0gMixcclxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXMuZXEoXy5jdXJyZW50U2xpZGUpLmNzcyh7XHJcbiAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleCAtIDEsXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDFcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXRIZWlnaHQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA9PT0gMSAmJiBfLm9wdGlvbnMuYWRhcHRpdmVIZWlnaHQgPT09IHRydWUgJiYgXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0SGVpZ2h0ID0gXy4kc2xpZGVzLmVxKF8uY3VycmVudFNsaWRlKS5vdXRlckhlaWdodCh0cnVlKTtcclxuICAgICAgICAgICAgXy4kbGlzdC5jc3MoJ2hlaWdodCcsIHRhcmdldEhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNldE9wdGlvbiA9XHJcbiAgICBTbGljay5wcm90b3R5cGUuc2xpY2tTZXRPcHRpb24gPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogYWNjZXB0cyBhcmd1bWVudHMgaW4gZm9ybWF0IG9mOlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogIC0gZm9yIGNoYW5naW5nIGEgc2luZ2xlIG9wdGlvbidzIHZhbHVlOlxyXG4gICAgICAgICAqICAgICAuc2xpY2soXCJzZXRPcHRpb25cIiwgb3B0aW9uLCB2YWx1ZSwgcmVmcmVzaCApXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiAgLSBmb3IgY2hhbmdpbmcgYSBzZXQgb2YgcmVzcG9uc2l2ZSBvcHRpb25zOlxyXG4gICAgICAgICAqICAgICAuc2xpY2soXCJzZXRPcHRpb25cIiwgJ3Jlc3BvbnNpdmUnLCBbe30sIC4uLl0sIHJlZnJlc2ggKVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogIC0gZm9yIHVwZGF0aW5nIG11bHRpcGxlIHZhbHVlcyBhdCBvbmNlIChub3QgcmVzcG9uc2l2ZSlcclxuICAgICAgICAgKiAgICAgLnNsaWNrKFwic2V0T3B0aW9uXCIsIHsgJ29wdGlvbic6IHZhbHVlLCAuLi4gfSwgcmVmcmVzaCApXHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcywgbCwgaXRlbSwgb3B0aW9uLCB2YWx1ZSwgcmVmcmVzaCA9IGZhbHNlLCB0eXBlO1xyXG5cclxuICAgICAgICBpZiggJC50eXBlKCBhcmd1bWVudHNbMF0gKSA9PT0gJ29iamVjdCcgKSB7XHJcblxyXG4gICAgICAgICAgICBvcHRpb24gPSAgYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICByZWZyZXNoID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICB0eXBlID0gJ211bHRpcGxlJztcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggJC50eXBlKCBhcmd1bWVudHNbMF0gKSA9PT0gJ3N0cmluZycgKSB7XHJcblxyXG4gICAgICAgICAgICBvcHRpb24gPSAgYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB2YWx1ZSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgcmVmcmVzaCA9IGFyZ3VtZW50c1syXTtcclxuXHJcbiAgICAgICAgICAgIGlmICggYXJndW1lbnRzWzBdID09PSAncmVzcG9uc2l2ZScgJiYgJC50eXBlKCBhcmd1bWVudHNbMV0gKSA9PT0gJ2FycmF5JyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0eXBlID0gJ3Jlc3BvbnNpdmUnO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIGFyZ3VtZW50c1sxXSAhPT0gJ3VuZGVmaW5lZCcgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdzaW5nbGUnO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggdHlwZSA9PT0gJ3NpbmdsZScgKSB7XHJcblxyXG4gICAgICAgICAgICBfLm9wdGlvbnNbb3B0aW9uXSA9IHZhbHVlO1xyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ211bHRpcGxlJyApIHtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaCggb3B0aW9uICwgZnVuY3Rpb24oIG9wdCwgdmFsICkge1xyXG5cclxuICAgICAgICAgICAgICAgIF8ub3B0aW9uc1tvcHRdID0gdmFsO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAncmVzcG9uc2l2ZScgKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKCBpdGVtIGluIHZhbHVlICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCAkLnR5cGUoIF8ub3B0aW9ucy5yZXNwb25zaXZlICkgIT09ICdhcnJheScgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucy5yZXNwb25zaXZlID0gWyB2YWx1ZVtpdGVtXSBdO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGwgPSBfLm9wdGlvbnMucmVzcG9uc2l2ZS5sZW5ndGgtMTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSByZXNwb25zaXZlIG9iamVjdCBhbmQgc3BsaWNlIG91dCBkdXBsaWNhdGVzLlxyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlKCBsID49IDAgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggXy5vcHRpb25zLnJlc3BvbnNpdmVbbF0uYnJlYWtwb2ludCA9PT0gdmFsdWVbaXRlbV0uYnJlYWtwb2ludCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMucmVzcG9uc2l2ZS5zcGxpY2UobCwxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGwtLTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKCB2YWx1ZVtpdGVtXSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIHJlZnJlc2ggKSB7XHJcblxyXG4gICAgICAgICAgICBfLnVubG9hZCgpO1xyXG4gICAgICAgICAgICBfLnJlaW5pdCgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLnNldERpbWVuc2lvbnMoKTtcclxuXHJcbiAgICAgICAgXy5zZXRIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBfLnNldENTUyhfLmdldExlZnQoXy5jdXJyZW50U2xpZGUpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfLnNldEZhZGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdzZXRQb3NpdGlvbicsIFtfXSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc2V0UHJvcHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBib2R5U3R5bGUgPSBkb2N1bWVudC5ib2R5LnN0eWxlO1xyXG5cclxuICAgICAgICBfLnBvc2l0aW9uUHJvcCA9IF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gdHJ1ZSA/ICd0b3AnIDogJ2xlZnQnO1xyXG5cclxuICAgICAgICBpZiAoXy5wb3NpdGlvblByb3AgPT09ICd0b3AnKSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlci5hZGRDbGFzcygnc2xpY2stdmVydGljYWwnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfLiRzbGlkZXIucmVtb3ZlQ2xhc3MoJ3NsaWNrLXZlcnRpY2FsJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYm9keVN0eWxlLldlYmtpdFRyYW5zaXRpb24gIT09IHVuZGVmaW5lZCB8fFxyXG4gICAgICAgICAgICBib2R5U3R5bGUuTW96VHJhbnNpdGlvbiAhPT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgICAgIGJvZHlTdHlsZS5tc1RyYW5zaXRpb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnVzZUNTUyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgXy5jc3NUcmFuc2l0aW9ucyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggXy5vcHRpb25zLmZhZGUgKSB7XHJcbiAgICAgICAgICAgIGlmICggdHlwZW9mIF8ub3B0aW9ucy56SW5kZXggPT09ICdudW1iZXInICkge1xyXG4gICAgICAgICAgICAgICAgaWYoIF8ub3B0aW9ucy56SW5kZXggPCAzICkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucy56SW5kZXggPSAzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgXy5vcHRpb25zLnpJbmRleCA9IF8uZGVmYXVsdHMuekluZGV4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYm9keVN0eWxlLk9UcmFuc2Zvcm0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBfLmFuaW1UeXBlID0gJ09UcmFuc2Zvcm0nO1xyXG4gICAgICAgICAgICBfLnRyYW5zZm9ybVR5cGUgPSAnLW8tdHJhbnNmb3JtJztcclxuICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9ICdPVHJhbnNpdGlvbic7XHJcbiAgICAgICAgICAgIGlmIChib2R5U3R5bGUucGVyc3BlY3RpdmVQcm9wZXJ0eSA9PT0gdW5kZWZpbmVkICYmIGJvZHlTdHlsZS53ZWJraXRQZXJzcGVjdGl2ZSA9PT0gdW5kZWZpbmVkKSBfLmFuaW1UeXBlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChib2R5U3R5bGUuTW96VHJhbnNmb3JtICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgXy5hbmltVHlwZSA9ICdNb3pUcmFuc2Zvcm0nO1xyXG4gICAgICAgICAgICBfLnRyYW5zZm9ybVR5cGUgPSAnLW1vei10cmFuc2Zvcm0nO1xyXG4gICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gJ01velRyYW5zaXRpb24nO1xyXG4gICAgICAgICAgICBpZiAoYm9keVN0eWxlLnBlcnNwZWN0aXZlUHJvcGVydHkgPT09IHVuZGVmaW5lZCAmJiBib2R5U3R5bGUuTW96UGVyc3BlY3RpdmUgPT09IHVuZGVmaW5lZCkgXy5hbmltVHlwZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYm9keVN0eWxlLndlYmtpdFRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSAnd2Via2l0VHJhbnNmb3JtJztcclxuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJy13ZWJraXQtdHJhbnNmb3JtJztcclxuICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9ICd3ZWJraXRUcmFuc2l0aW9uJztcclxuICAgICAgICAgICAgaWYgKGJvZHlTdHlsZS5wZXJzcGVjdGl2ZVByb3BlcnR5ID09PSB1bmRlZmluZWQgJiYgYm9keVN0eWxlLndlYmtpdFBlcnNwZWN0aXZlID09PSB1bmRlZmluZWQpIF8uYW5pbVR5cGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGJvZHlTdHlsZS5tc1RyYW5zZm9ybSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSAnbXNUcmFuc2Zvcm0nO1xyXG4gICAgICAgICAgICBfLnRyYW5zZm9ybVR5cGUgPSAnLW1zLXRyYW5zZm9ybSc7XHJcbiAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSAnbXNUcmFuc2l0aW9uJztcclxuICAgICAgICAgICAgaWYgKGJvZHlTdHlsZS5tc1RyYW5zZm9ybSA9PT0gdW5kZWZpbmVkKSBfLmFuaW1UeXBlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChib2R5U3R5bGUudHJhbnNmb3JtICE9PSB1bmRlZmluZWQgJiYgXy5hbmltVHlwZSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgXy5hbmltVHlwZSA9ICd0cmFuc2Zvcm0nO1xyXG4gICAgICAgICAgICBfLnRyYW5zZm9ybVR5cGUgPSAndHJhbnNmb3JtJztcclxuICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9ICd0cmFuc2l0aW9uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgXy50cmFuc2Zvcm1zRW5hYmxlZCA9IF8ub3B0aW9ucy51c2VUcmFuc2Zvcm0gJiYgKF8uYW5pbVR5cGUgIT09IG51bGwgJiYgXy5hbmltVHlwZSAhPT0gZmFsc2UpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNldFNsaWRlQ2xhc3NlcyA9IGZ1bmN0aW9uKGluZGV4KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgY2VudGVyT2Zmc2V0LCBhbGxTbGlkZXMsIGluZGV4T2Zmc2V0LCByZW1haW5kZXI7XHJcblxyXG4gICAgICAgIGFsbFNsaWRlcyA9IF8uJHNsaWRlclxyXG4gICAgICAgICAgICAuZmluZCgnLnNsaWNrLXNsaWRlJylcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1hY3RpdmUgc2xpY2stY2VudGVyIHNsaWNrLWN1cnJlbnQnKVxyXG4gICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXNcclxuICAgICAgICAgICAgLmVxKGluZGV4KVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWN1cnJlbnQnKTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZXZlbkNvZWYgPSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICUgMiA9PT0gMCA/IDEgOiAwO1xyXG5cclxuICAgICAgICAgICAgY2VudGVyT2Zmc2V0ID0gTWF0aC5mbG9vcihfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMik7XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IGNlbnRlck9mZnNldCAmJiBpbmRleCA8PSAoXy5zbGlkZUNvdW50IC0gMSkgLSBjZW50ZXJPZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKGluZGV4IC0gY2VudGVyT2Zmc2V0ICsgZXZlbkNvZWYsIGluZGV4ICsgY2VudGVyT2Zmc2V0ICsgMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbmRleE9mZnNldCA9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyBpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKGluZGV4T2Zmc2V0IC0gY2VudGVyT2Zmc2V0ICsgMSArIGV2ZW5Db2VmLCBpbmRleE9mZnNldCArIGNlbnRlck9mZnNldCArIDIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmVxKGFsbFNsaWRlcy5sZW5ndGggLSAxIC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1jZW50ZXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSBfLnNsaWRlQ291bnQgLSAxKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZXEoXy5vcHRpb25zLnNsaWRlc1RvU2hvdylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1jZW50ZXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXNcclxuICAgICAgICAgICAgICAgIC5lcShpbmRleClcclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stY2VudGVyJyk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8PSAoXy5zbGlkZUNvdW50IC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLiRzbGlkZXNcclxuICAgICAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXgsIGluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdylcclxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFsbFNsaWRlcy5sZW5ndGggPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xyXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJylcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVtYWluZGVyID0gXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcclxuICAgICAgICAgICAgICAgIGluZGV4T2Zmc2V0ID0gXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlID8gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyArIGluZGV4IDogaW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPT0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICYmIChfLnNsaWRlQ291bnQgLSBpbmRleCkgPCBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXhPZmZzZXQgLSAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAtIHJlbWFpbmRlciksIGluZGV4T2Zmc2V0ICsgcmVtYWluZGVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXhPZmZzZXQsIGluZGV4T2Zmc2V0ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5sYXp5TG9hZCA9PT0gJ29uZGVtYW5kJyB8fCBfLm9wdGlvbnMubGF6eUxvYWQgPT09ICdhbnRpY2lwYXRlZCcpIHtcclxuICAgICAgICAgICAgXy5sYXp5TG9hZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNldHVwSW5maW5pdGUgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBpLCBzbGlkZUluZGV4LCBpbmZpbml0ZUNvdW50O1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy5vcHRpb25zLmNlbnRlck1vZGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IHRydWUgJiYgXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICBzbGlkZUluZGV4ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5maW5pdGVDb3VudCA9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyAxO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmZpbml0ZUNvdW50ID0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBfLnNsaWRlQ291bnQ7IGkgPiAoXy5zbGlkZUNvdW50IC1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5maW5pdGVDb3VudCk7IGkgLT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlSW5kZXggPSBpIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAkKF8uJHNsaWRlc1tzbGlkZUluZGV4XSkuY2xvbmUodHJ1ZSkuYXR0cignaWQnLCAnJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnLCBzbGlkZUluZGV4IC0gXy5zbGlkZUNvdW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucHJlcGVuZFRvKF8uJHNsaWRlVHJhY2spLmFkZENsYXNzKCdzbGljay1jbG9uZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpbmZpbml0ZUNvdW50ICArIF8uc2xpZGVDb3VudDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVJbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgJChfLiRzbGlkZXNbc2xpZGVJbmRleF0pLmNsb25lKHRydWUpLmF0dHIoJ2lkJywgJycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4Jywgc2xpZGVJbmRleCArIF8uc2xpZGVDb3VudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spLmFkZENsYXNzKCdzbGljay1jbG9uZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suZmluZCgnLnNsaWNrLWNsb25lZCcpLmZpbmQoJ1tpZF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignaWQnLCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmludGVycnVwdCA9IGZ1bmN0aW9uKCB0b2dnbGUgKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYoICF0b2dnbGUgKSB7XHJcbiAgICAgICAgICAgIF8uYXV0b1BsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IHRvZ2dsZTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zZWxlY3RIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgdGFyZ2V0RWxlbWVudCA9XHJcbiAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KS5pcygnLnNsaWNrLXNsaWRlJykgP1xyXG4gICAgICAgICAgICAgICAgJChldmVudC50YXJnZXQpIDpcclxuICAgICAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCcuc2xpY2stc2xpZGUnKTtcclxuXHJcbiAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQodGFyZ2V0RWxlbWVudC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JykpO1xyXG5cclxuICAgICAgICBpZiAoIWluZGV4KSBpbmRleCA9IDA7XHJcblxyXG4gICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgXy5zbGlkZUhhbmRsZXIoaW5kZXgsIGZhbHNlLCB0cnVlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uc2xpZGVIYW5kbGVyKGluZGV4KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zbGlkZUhhbmRsZXIgPSBmdW5jdGlvbihpbmRleCwgc3luYywgZG9udEFuaW1hdGUpIHtcclxuXHJcbiAgICAgICAgdmFyIHRhcmdldFNsaWRlLCBhbmltU2xpZGUsIG9sZFNsaWRlLCBzbGlkZUxlZnQsIHRhcmdldExlZnQgPSBudWxsLFxyXG4gICAgICAgICAgICBfID0gdGhpcywgbmF2VGFyZ2V0O1xyXG5cclxuICAgICAgICBzeW5jID0gc3luYyB8fCBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKF8uYW5pbWF0aW5nID09PSB0cnVlICYmIF8ub3B0aW9ucy53YWl0Rm9yQW5pbWF0ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUgJiYgXy5jdXJyZW50U2xpZGUgPT09IGluZGV4KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzeW5jID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBfLmFzTmF2Rm9yKGluZGV4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRhcmdldFNsaWRlID0gaW5kZXg7XHJcbiAgICAgICAgdGFyZ2V0TGVmdCA9IF8uZ2V0TGVmdCh0YXJnZXRTbGlkZSk7XHJcbiAgICAgICAgc2xpZGVMZWZ0ID0gXy5nZXRMZWZ0KF8uY3VycmVudFNsaWRlKTtcclxuXHJcbiAgICAgICAgXy5jdXJyZW50TGVmdCA9IF8uc3dpcGVMZWZ0ID09PSBudWxsID8gc2xpZGVMZWZ0IDogXy5zd2lwZUxlZnQ7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlICYmIF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSBmYWxzZSAmJiAoaW5kZXggPCAwIHx8IGluZGV4ID4gXy5nZXREb3RDb3VudCgpICogXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSkge1xyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRTbGlkZSA9IF8uY3VycmVudFNsaWRlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvbnRBbmltYXRlICE9PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmFuaW1hdGVTbGlkZShzbGlkZUxlZnQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZSh0YXJnZXRTbGlkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKHRhcmdldFNsaWRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlICYmIF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlICYmIChpbmRleCA8IDAgfHwgaW5kZXggPiAoXy5zbGlkZUNvdW50IC0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSkpIHtcclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U2xpZGUgPSBfLmN1cnJlbnRTbGlkZTtcclxuICAgICAgICAgICAgICAgIGlmIChkb250QW5pbWF0ZSAhPT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5hbmltYXRlU2xpZGUoc2xpZGVMZWZ0LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUodGFyZ2V0U2xpZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZSh0YXJnZXRTbGlkZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXV0b3BsYXkgKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoXy5hdXRvUGxheVRpbWVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXRTbGlkZSA8IDApIHtcclxuICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgYW5pbVNsaWRlID0gXy5zbGlkZUNvdW50IC0gKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbmltU2xpZGUgPSBfLnNsaWRlQ291bnQgKyB0YXJnZXRTbGlkZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0U2xpZGUgPj0gXy5zbGlkZUNvdW50KSB7XHJcbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIGFuaW1TbGlkZSA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbmltU2xpZGUgPSB0YXJnZXRTbGlkZSAtIF8uc2xpZGVDb3VudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFuaW1TbGlkZSA9IHRhcmdldFNsaWRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy5hbmltYXRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignYmVmb3JlQ2hhbmdlJywgW18sIF8uY3VycmVudFNsaWRlLCBhbmltU2xpZGVdKTtcclxuXHJcbiAgICAgICAgb2xkU2xpZGUgPSBfLmN1cnJlbnRTbGlkZTtcclxuICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IGFuaW1TbGlkZTtcclxuXHJcbiAgICAgICAgXy5zZXRTbGlkZUNsYXNzZXMoXy5jdXJyZW50U2xpZGUpO1xyXG5cclxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5hc05hdkZvciApIHtcclxuXHJcbiAgICAgICAgICAgIG5hdlRhcmdldCA9IF8uZ2V0TmF2VGFyZ2V0KCk7XHJcbiAgICAgICAgICAgIG5hdlRhcmdldCA9IG5hdlRhcmdldC5zbGljaygnZ2V0U2xpY2snKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggbmF2VGFyZ2V0LnNsaWRlQ291bnQgPD0gbmF2VGFyZ2V0Lm9wdGlvbnMuc2xpZGVzVG9TaG93ICkge1xyXG4gICAgICAgICAgICAgICAgbmF2VGFyZ2V0LnNldFNsaWRlQ2xhc3NlcyhfLmN1cnJlbnRTbGlkZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLnVwZGF0ZURvdHMoKTtcclxuICAgICAgICBfLnVwZGF0ZUFycm93cygpO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgaWYgKGRvbnRBbmltYXRlICE9PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy5mYWRlU2xpZGVPdXQob2xkU2xpZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIF8uZmFkZVNsaWRlKGFuaW1TbGlkZSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUoYW5pbVNsaWRlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKGFuaW1TbGlkZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXy5hbmltYXRlSGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkb250QW5pbWF0ZSAhPT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgIF8uYW5pbWF0ZVNsaWRlKHRhcmdldExlZnQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUoYW5pbVNsaWRlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy5wb3N0U2xpZGUoYW5pbVNsaWRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc3RhcnRMb2FkID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hcnJvd3MgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgXy4kcHJldkFycm93LmhpZGUoKTtcclxuICAgICAgICAgICAgXy4kbmV4dEFycm93LmhpZGUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmRvdHMgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgXy4kZG90cy5oaWRlKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy4kc2xpZGVyLmFkZENsYXNzKCdzbGljay1sb2FkaW5nJyk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc3dpcGVEaXJlY3Rpb24gPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIHhEaXN0LCB5RGlzdCwgciwgc3dpcGVBbmdsZSwgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHhEaXN0ID0gXy50b3VjaE9iamVjdC5zdGFydFggLSBfLnRvdWNoT2JqZWN0LmN1clg7XHJcbiAgICAgICAgeURpc3QgPSBfLnRvdWNoT2JqZWN0LnN0YXJ0WSAtIF8udG91Y2hPYmplY3QuY3VyWTtcclxuICAgICAgICByID0gTWF0aC5hdGFuMih5RGlzdCwgeERpc3QpO1xyXG5cclxuICAgICAgICBzd2lwZUFuZ2xlID0gTWF0aC5yb3VuZChyICogMTgwIC8gTWF0aC5QSSk7XHJcbiAgICAgICAgaWYgKHN3aXBlQW5nbGUgPCAwKSB7XHJcbiAgICAgICAgICAgIHN3aXBlQW5nbGUgPSAzNjAgLSBNYXRoLmFicyhzd2lwZUFuZ2xlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgoc3dpcGVBbmdsZSA8PSA0NSkgJiYgKHN3aXBlQW5nbGUgPj0gMCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChfLm9wdGlvbnMucnRsID09PSBmYWxzZSA/ICdsZWZ0JyA6ICdyaWdodCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKHN3aXBlQW5nbGUgPD0gMzYwKSAmJiAoc3dpcGVBbmdsZSA+PSAzMTUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoXy5vcHRpb25zLnJ0bCA9PT0gZmFsc2UgPyAnbGVmdCcgOiAncmlnaHQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKChzd2lwZUFuZ2xlID49IDEzNSkgJiYgKHN3aXBlQW5nbGUgPD0gMjI1KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKF8ub3B0aW9ucy5ydGwgPT09IGZhbHNlID8gJ3JpZ2h0JyA6ICdsZWZ0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGlmICgoc3dpcGVBbmdsZSA+PSAzNSkgJiYgKHN3aXBlQW5nbGUgPD0gMTM1KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdkb3duJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAndXAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zd2lwZUVuZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgc2xpZGVDb3VudCxcclxuICAgICAgICAgICAgZGlyZWN0aW9uO1xyXG5cclxuICAgICAgICBfLmRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgXy5zd2lwaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmIChfLnNjcm9sbGluZykge1xyXG4gICAgICAgICAgICBfLnNjcm9sbGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLmludGVycnVwdGVkID0gZmFsc2U7XHJcbiAgICAgICAgXy5zaG91bGRDbGljayA9ICggXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCA+IDEwICkgPyBmYWxzZSA6IHRydWU7XHJcblxyXG4gICAgICAgIGlmICggXy50b3VjaE9iamVjdC5jdXJYID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggXy50b3VjaE9iamVjdC5lZGdlSGl0ID09PSB0cnVlICkge1xyXG4gICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignZWRnZScsIFtfLCBfLnN3aXBlRGlyZWN0aW9uKCkgXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggPj0gXy50b3VjaE9iamVjdC5taW5Td2lwZSApIHtcclxuXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IF8uc3dpcGVEaXJlY3Rpb24oKTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAoIGRpcmVjdGlvbiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICdsZWZ0JzpcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2Rvd24nOlxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzbGlkZUNvdW50ID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnN3aXBlVG9TbGlkZSA/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmNoZWNrTmF2aWdhYmxlKCBfLmN1cnJlbnRTbGlkZSArIF8uZ2V0U2xpZGVDb3VudCgpICkgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgKyBfLmdldFNsaWRlQ291bnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50RGlyZWN0aW9uID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAncmlnaHQnOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAndXAnOlxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzbGlkZUNvdW50ID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnN3aXBlVG9TbGlkZSA/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmNoZWNrTmF2aWdhYmxlKCBfLmN1cnJlbnRTbGlkZSAtIF8uZ2V0U2xpZGVDb3VudCgpICkgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgLSBfLmdldFNsaWRlQ291bnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50RGlyZWN0aW9uID0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuXHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiggZGlyZWN0aW9uICE9ICd2ZXJ0aWNhbCcgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy5zbGlkZUhhbmRsZXIoIHNsaWRlQ291bnQgKTtcclxuICAgICAgICAgICAgICAgIF8udG91Y2hPYmplY3QgPSB7fTtcclxuICAgICAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdzd2lwZScsIFtfLCBkaXJlY3Rpb24gXSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIF8udG91Y2hPYmplY3Quc3RhcnRYICE9PSBfLnRvdWNoT2JqZWN0LmN1clggKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy5zbGlkZUhhbmRsZXIoIF8uY3VycmVudFNsaWRlICk7XHJcbiAgICAgICAgICAgICAgICBfLnRvdWNoT2JqZWN0ID0ge307XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zd2lwZUhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmICgoXy5vcHRpb25zLnN3aXBlID09PSBmYWxzZSkgfHwgKCdvbnRvdWNoZW5kJyBpbiBkb2N1bWVudCAmJiBfLm9wdGlvbnMuc3dpcGUgPT09IGZhbHNlKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmIChfLm9wdGlvbnMuZHJhZ2dhYmxlID09PSBmYWxzZSAmJiBldmVudC50eXBlLmluZGV4T2YoJ21vdXNlJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8udG91Y2hPYmplY3QuZmluZ2VyQ291bnQgPSBldmVudC5vcmlnaW5hbEV2ZW50ICYmIGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlcyAhPT0gdW5kZWZpbmVkID9cclxuICAgICAgICAgICAgZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzLmxlbmd0aCA6IDE7XHJcblxyXG4gICAgICAgIF8udG91Y2hPYmplY3QubWluU3dpcGUgPSBfLmxpc3RXaWR0aCAvIF8ub3B0aW9uc1xyXG4gICAgICAgICAgICAudG91Y2hUaHJlc2hvbGQ7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8udG91Y2hPYmplY3QubWluU3dpcGUgPSBfLmxpc3RIZWlnaHQgLyBfLm9wdGlvbnNcclxuICAgICAgICAgICAgICAgIC50b3VjaFRocmVzaG9sZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZXZlbnQuZGF0YS5hY3Rpb24pIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ3N0YXJ0JzpcclxuICAgICAgICAgICAgICAgIF8uc3dpcGVTdGFydChldmVudCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ21vdmUnOlxyXG4gICAgICAgICAgICAgICAgXy5zd2lwZU1vdmUoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlICdlbmQnOlxyXG4gICAgICAgICAgICAgICAgXy5zd2lwZUVuZChldmVudCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnN3aXBlTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgZWRnZVdhc0hpdCA9IGZhbHNlLFxyXG4gICAgICAgICAgICBjdXJMZWZ0LCBzd2lwZURpcmVjdGlvbiwgc3dpcGVMZW5ndGgsIHBvc2l0aW9uT2Zmc2V0LCB0b3VjaGVzLCB2ZXJ0aWNhbFN3aXBlTGVuZ3RoO1xyXG5cclxuICAgICAgICB0b3VjaGVzID0gZXZlbnQub3JpZ2luYWxFdmVudCAhPT0gdW5kZWZpbmVkID8gZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzIDogbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKCFfLmRyYWdnaW5nIHx8IF8uc2Nyb2xsaW5nIHx8IHRvdWNoZXMgJiYgdG91Y2hlcy5sZW5ndGggIT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3VyTGVmdCA9IF8uZ2V0TGVmdChfLmN1cnJlbnRTbGlkZSk7XHJcblxyXG4gICAgICAgIF8udG91Y2hPYmplY3QuY3VyWCA9IHRvdWNoZXMgIT09IHVuZGVmaW5lZCA/IHRvdWNoZXNbMF0ucGFnZVggOiBldmVudC5jbGllbnRYO1xyXG4gICAgICAgIF8udG91Y2hPYmplY3QuY3VyWSA9IHRvdWNoZXMgIT09IHVuZGVmaW5lZCA/IHRvdWNoZXNbMF0ucGFnZVkgOiBldmVudC5jbGllbnRZO1xyXG5cclxuICAgICAgICBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoID0gTWF0aC5yb3VuZChNYXRoLnNxcnQoXHJcbiAgICAgICAgICAgIE1hdGgucG93KF8udG91Y2hPYmplY3QuY3VyWCAtIF8udG91Y2hPYmplY3Quc3RhcnRYLCAyKSkpO1xyXG5cclxuICAgICAgICB2ZXJ0aWNhbFN3aXBlTGVuZ3RoID0gTWF0aC5yb3VuZChNYXRoLnNxcnQoXHJcbiAgICAgICAgICAgIE1hdGgucG93KF8udG91Y2hPYmplY3QuY3VyWSAtIF8udG91Y2hPYmplY3Quc3RhcnRZLCAyKSkpO1xyXG5cclxuICAgICAgICBpZiAoIV8ub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcgJiYgIV8uc3dpcGluZyAmJiB2ZXJ0aWNhbFN3aXBlTGVuZ3RoID4gNCkge1xyXG4gICAgICAgICAgICBfLnNjcm9sbGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggPSB2ZXJ0aWNhbFN3aXBlTGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpcGVEaXJlY3Rpb24gPSBfLnN3aXBlRGlyZWN0aW9uKCk7XHJcblxyXG4gICAgICAgIGlmIChldmVudC5vcmlnaW5hbEV2ZW50ICE9PSB1bmRlZmluZWQgJiYgXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCA+IDQpIHtcclxuICAgICAgICAgICAgXy5zd2lwaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBvc2l0aW9uT2Zmc2V0ID0gKF8ub3B0aW9ucy5ydGwgPT09IGZhbHNlID8gMSA6IC0xKSAqIChfLnRvdWNoT2JqZWN0LmN1clggPiBfLnRvdWNoT2JqZWN0LnN0YXJ0WCA/IDEgOiAtMSk7XHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcG9zaXRpb25PZmZzZXQgPSBfLnRvdWNoT2JqZWN0LmN1clkgPiBfLnRvdWNoT2JqZWN0LnN0YXJ0WSA/IDEgOiAtMTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBzd2lwZUxlbmd0aCA9IF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGg7XHJcblxyXG4gICAgICAgIF8udG91Y2hPYmplY3QuZWRnZUhpdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAoKF8uY3VycmVudFNsaWRlID09PSAwICYmIHN3aXBlRGlyZWN0aW9uID09PSAncmlnaHQnKSB8fCAoXy5jdXJyZW50U2xpZGUgPj0gXy5nZXREb3RDb3VudCgpICYmIHN3aXBlRGlyZWN0aW9uID09PSAnbGVmdCcpKSB7XHJcbiAgICAgICAgICAgICAgICBzd2lwZUxlbmd0aCA9IF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggKiBfLm9wdGlvbnMuZWRnZUZyaWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgXy50b3VjaE9iamVjdC5lZGdlSGl0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBjdXJMZWZ0ICsgc3dpcGVMZW5ndGggKiBwb3NpdGlvbk9mZnNldDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfLnN3aXBlTGVmdCA9IGN1ckxlZnQgKyAoc3dpcGVMZW5ndGggKiAoXy4kbGlzdC5oZWlnaHQoKSAvIF8ubGlzdFdpZHRoKSkgKiBwb3NpdGlvbk9mZnNldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBjdXJMZWZ0ICsgc3dpcGVMZW5ndGggKiBwb3NpdGlvbk9mZnNldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gdHJ1ZSB8fCBfLm9wdGlvbnMudG91Y2hNb3ZlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5hbmltYXRpbmcgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLnNldENTUyhfLnN3aXBlTGVmdCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc3dpcGVTdGFydCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgdG91Y2hlcztcclxuXHJcbiAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmIChfLnRvdWNoT2JqZWN0LmZpbmdlckNvdW50ICE9PSAxIHx8IF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgIF8udG91Y2hPYmplY3QgPSB7fTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV2ZW50Lm9yaWdpbmFsRXZlbnQgIT09IHVuZGVmaW5lZCAmJiBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0b3VjaGVzID0gZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy50b3VjaE9iamVjdC5zdGFydFggPSBfLnRvdWNoT2JqZWN0LmN1clggPSB0b3VjaGVzICE9PSB1bmRlZmluZWQgPyB0b3VjaGVzLnBhZ2VYIDogZXZlbnQuY2xpZW50WDtcclxuICAgICAgICBfLnRvdWNoT2JqZWN0LnN0YXJ0WSA9IF8udG91Y2hPYmplY3QuY3VyWSA9IHRvdWNoZXMgIT09IHVuZGVmaW5lZCA/IHRvdWNoZXMucGFnZVkgOiBldmVudC5jbGllbnRZO1xyXG5cclxuICAgICAgICBfLmRyYWdnaW5nID0gdHJ1ZTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS51bmZpbHRlclNsaWRlcyA9IFNsaWNrLnByb3RvdHlwZS5zbGlja1VuZmlsdGVyID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8uJHNsaWRlc0NhY2hlICE9PSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICBfLnVubG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpO1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVzQ2FjaGUuYXBwZW5kVG8oXy4kc2xpZGVUcmFjayk7XHJcblxyXG4gICAgICAgICAgICBfLnJlaW5pdCgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUudW5sb2FkID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgJCgnLnNsaWNrLWNsb25lZCcsIF8uJHNsaWRlcikucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIGlmIChfLiRkb3RzKSB7XHJcbiAgICAgICAgICAgIF8uJGRvdHMucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy4kcHJldkFycm93ICYmIF8uaHRtbEV4cHIudGVzdChfLm9wdGlvbnMucHJldkFycm93KSkge1xyXG4gICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy4kbmV4dEFycm93ICYmIF8uaHRtbEV4cHIudGVzdChfLm9wdGlvbnMubmV4dEFycm93KSkge1xyXG4gICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLiRzbGlkZXNcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1zbGlkZSBzbGljay1hY3RpdmUgc2xpY2stdmlzaWJsZSBzbGljay1jdXJyZW50JylcclxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKVxyXG4gICAgICAgICAgICAuY3NzKCd3aWR0aCcsICcnKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS51bnNsaWNrID0gZnVuY3Rpb24oZnJvbUJyZWFrcG9pbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG4gICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCd1bnNsaWNrJywgW18sIGZyb21CcmVha3BvaW50XSk7XHJcbiAgICAgICAgXy5kZXN0cm95KCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUudXBkYXRlQXJyb3dzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgY2VudGVyT2Zmc2V0O1xyXG5cclxuICAgICAgICBjZW50ZXJPZmZzZXQgPSBNYXRoLmZsb29yKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyKTtcclxuXHJcbiAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmXHJcbiAgICAgICAgICAgIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgJiZcclxuICAgICAgICAgICAgIV8ub3B0aW9ucy5pbmZpbml0ZSApIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHByZXZBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ2ZhbHNlJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5jdXJyZW50U2xpZGUgPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cuYWRkQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmN1cnJlbnRTbGlkZSA+PSBfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICYmIF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5hZGRDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ2ZhbHNlJyk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uY3VycmVudFNsaWRlID49IF8uc2xpZGVDb3VudCAtIDEgJiYgXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cuYWRkQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUudXBkYXRlRG90cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLiRkb3RzICE9PSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRkb3RzXHJcbiAgICAgICAgICAgICAgICAuZmluZCgnbGknKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stYWN0aXZlJylcclxuICAgICAgICAgICAgICAgICAgICAuZW5kKCk7XHJcblxyXG4gICAgICAgICAgICBfLiRkb3RzXHJcbiAgICAgICAgICAgICAgICAuZmluZCgnbGknKVxyXG4gICAgICAgICAgICAgICAgLmVxKE1hdGguZmxvb3IoXy5jdXJyZW50U2xpZGUgLyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnZpc2liaWxpdHkgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5hdXRvcGxheSApIHtcclxuXHJcbiAgICAgICAgICAgIGlmICggZG9jdW1lbnRbXy5oaWRkZW5dICkge1xyXG5cclxuICAgICAgICAgICAgICAgIF8uaW50ZXJydXB0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLmludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgICQuZm4uc2xpY2sgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIG9wdCA9IGFyZ3VtZW50c1swXSxcclxuICAgICAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXHJcbiAgICAgICAgICAgIGwgPSBfLmxlbmd0aCxcclxuICAgICAgICAgICAgaSxcclxuICAgICAgICAgICAgcmV0O1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHQgPT0gJ29iamVjdCcgfHwgdHlwZW9mIG9wdCA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIF9baV0uc2xpY2sgPSBuZXcgU2xpY2soX1tpXSwgb3B0KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0ID0gX1tpXS5zbGlja1tvcHRdLmFwcGx5KF9baV0uc2xpY2ssIGFyZ3MpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJldCAhPSAndW5kZWZpbmVkJykgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIF87XHJcbiAgICB9O1xyXG5cclxufSkpO1xyXG4iXX0=
