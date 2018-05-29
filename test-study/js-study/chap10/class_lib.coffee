class Person
  status: '健康'
  
  constructor: (@name) ->

  toString: ->
    window.alert "#{@name}很#{@status}喔。"

window.Person = Person
