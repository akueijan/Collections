###
CoffeeScript的基本語法
###

x = 60
y = 
80

#定義total函數
total= (sub1, sub2) ->
  sub1 + sub2

if total(x, y) >= 120
  window.alert '及格'