# 家樂福翻轉新年

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

套版打包

```
$gulp build
```

js uglify

```
$gulp js
```


