class Person
  constructor: (@nickname) ->
    btn = document.getElementById 'btn'
    btn.onclick = =>
      window.alert "最近好嗎，#{@nickname}。"

p = new Person('郁文')

