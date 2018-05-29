class Person

  constructor: (@name) ->

p = new Person '郁文'

Person::work = (type) ->
  window.alert "#{@name}是#{type}工作中。"
  return

p.work '勤奮地'