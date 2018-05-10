# Markup Starter Kit

- 使用 node v5.4.1
- 使用 Jade,Pug
- 使用 Scss
- 使用 Gulp

# 安裝

安裝全域工具gulp(裝過一次即可)
```
$ npm install gulp -g
```

安裝切版環境(每個新專案都要執行)
```
$ npm install 
```

## 檔案結構
- /src: 主要開發目錄
- /dist: gulp生成的最終結果，為自動產生的檔案，切版人員可以無視。

## Gulp Task

啟用gulp(gulp default)

```
$gulp
```

#更新日誌

## 2017/1/25

- gulp新增htmlbeautify 將產出的html重新編譯成縮排4格
- 新增src/css資料夾，放入css直接拷貝至dist/css
- 新增lib資料夾，放入js直接拷貝至dist/js
- 新增sample.jade 加入部分常用開發行為參考範例

## 2017/12/18
- 更新 html gulp 流程
- 安裝 sourcemaps
- 新增 sciprt 相關task
  - 資料結構新增 vendor 資料夾，放 js framework (例:jquery,vue,gsap...)
  - 資料結構 lib 放置所使用的plugin 
- 開發時可直接執行gulp dev即可
  ```
  $ npm gulp dev
  ```
- 套版所需的打包檔可須執行 gulp build
  ```
  $ npm gulp build
  ```
- 若js開發完成單純將js uglify 可直接執行
  ```
  $ npm gulp js
  ```
- html本地的js只需load vendor.js, lib.js, app.js