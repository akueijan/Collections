class Person
  status: '健康'
  
  constructor: (@name) ->

  toString: ->
    "#{@name}是#{@status}的。"

class BusinessPerson extends Person
  work: (type) ->
    window.alert "#{@name}正#{type}工作中。"
    return
    
  toString: ->
    "SOHO族#{super()}"

bp = new BusinessPerson '郁文'
bp.work '努力'
window.alert bp.toString()