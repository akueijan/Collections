# Markup Starter Kit

- 使用 node v5.4.1
- 使用 pug(jade)
- 使用 Scss
- 使用 Gulp

# 安裝

安裝全域工具gulp(裝過一次即可)
```
$ npm install gulp -g
```

於最外層安裝切版環境(每個新專案都要執行)
```
$ npm install 
```
# 注意專案資料夾須取正式名稱
## 檔案結構
- /src: 主要開發目錄
- /src/vondor: 主要使用的framework，在打包時會合併為vendor.js
- /src/lib: 擴充的plugin js放置位置，在打包時會合併為lib.js
- /src/static: 複製所有檔案至 dist 資料夾，(ex: sitemap.xml，或需要使用.json格式檔案，可放置於此
- /dist: gulp生成的最終結果，為自動產生的檔案，切版人員可以無視。

## gulpfile 參數說明

```
var pordApi = "https://cmpnapi.friendo.com.tw/api/",
    devApi = "https://devapi.friendo.com.tw/api/",

var isDev, destPath,
    projectName = parentName(),
    port = 2001,
    jsFolder = "js/",
    buildPath = `../../deploy/${projectName}/`,
    devPath = `./dist/`;
```
- ### prodApi: 正式模式下js所呼叫的API位置
- ### devApi: 開發模式下js所呼要的API位置
- isDev: 判定是否為開發中，無需特別設定會也gulp task 判定
- port: 為gulp server 的網址poot
- jsFolder: pug 產生的 html 所需要的JS路徑

## Gulp Task

啟用gulp(gulp default 開發狀態)
```
$gulp
```

打包指令(會將apiUrl切換成正式機，且會將開者工具全部關閉)
```
$gulp build
```

## 注意事項 
### 若在開發上有使用新的 package 請更新至最外層的 package.json
### 使用[tinypng](https://tinypng.com/) 壓縮圖片再打包
### 使用sprites產生圖片及scss

- 至少先執行`$ gulp defulat`一次
- 再將main.scss裡的註解打開

before
``` scss
//1.utils
@import "utils/_bemify.scss"; //A set of Sass mixins to write well-structured, maintainable, idiomatic BEM-style .scss source:
@import "utils/_variables.scss";
@import "utils/_mixins.scss";
@import "utils/_grid.scss";
//sprite scss import 至少要啟用gulp一次
//@import "_sprite.scss";
```

after

``` scss
//1.utils
@import "utils/_bemify.scss"; //A set of Sass mixins to write well-structured, maintainable, idiomatic BEM-style .scss source:
@import "utils/_variables.scss";
@import "utils/_mixins.scss";
@import "utils/_grid.scss";
//sprite scss import 至少要啟用gulp一次
@import "_sprite.scss";
```

# pug 使用說明

## _head.pug
```
- if(dev_mode)
        //- debug tool
        script(src="//console.re/connector.js" data-channel="friendo" id="consolerescript")
    - else
        //- log tools
        script(type="text/javascript" src="//cloudfront.loggly.com/js/loggly.tracker-latest.min.js" async)
        script.
            var _LTracker = _LTracker || [];
                _LTracker.push({'logglyKey': '8016ea6d-fa64-4c93-bddb-461c5e78fd99',
                'sendConsoleErrors' : true,
                'tag' : 'familyTree'  });
    script.
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': 
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], 
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); 
        })(window,document,'script','dataLayer','GTM-KTS8XH2');
```
- console.re: 可遠端觀看console，reference: https://console.re/
- loggly: 紀錄log工具，reference: https://o2ofriendo.loggly.com/login/?next=/search (此為公司loggly 後台)
- GTM code: 載入GTM，且也須至body內新增code，要根據專案而修改GTM ID (ex: GTM-KTS8XH2)

## _layout.pug
```
body
    noscript
        iframe(src="https://www.googletagmanager.com/ns.html?id=GTM-5W6ZPBT" height="0" width="0" style="display:none;visibility:hidden")
```
- GTM code: body需載入

## sample.pug  (依照個page而且取名)
```
//- page laytout name
extends _layout.pug
//- page customized Information
block pageInfo
    - var pageTitle = "pageTitle"
    - var pageDesc = "pageDesc"
    - var pageJs = "sample.js";
//- page html
block page_main
```
- pageTitle: 各頁面的 Title
- pageDesc: 各頁面的 description
- pageJs: 各頁面獨自載入的js
