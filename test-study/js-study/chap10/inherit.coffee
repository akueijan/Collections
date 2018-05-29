class Person
  status: '健康'
  
  constructor: (@name) ->

  toString: ->
    "#{@name}是#{@status}的。"

class BusinessPerson extends Person
  work: (type) ->
    window.alert "#{@name}是#{type}工作中。"
    return
    
  toString: ->
    "SOHO族#{super()}"

bp = new BusinessPerson '郁文'
bp.work '勤奮地'
window.alert bp.toString()
