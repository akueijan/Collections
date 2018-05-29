<?php
try {
  $db = new PDO('mysql:dbname=recipe;host=127.0.0.1;charset=utf8', 
    'jsusr', 'jspass');
  //根據輸入值，以前方一致的方式搜尋keyword表單的value行
  $stt = $db->prepare('SELECT * FROM keywords WHERE value LIKE ?');
  $stt->bindValue(1, $_GET['term'].'%', PDO::PARAM_STR);
  $stt->execute();
  //以JSON格式輸出結果集
  print(json_encode($stt->fetchAll(PDO::FETCH_ASSOC)));
} catch(PDOException $ex) {
  die($ex->getMessage());
}
