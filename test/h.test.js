var test = require('tape')
var ctor = require('../h.js')

test('parsing classes', function(t){

  var h = ctor(innerH)
  var res = h('div.class Object -flag -anotherFlag $mixin')

  t.deepEqual(res, [
    'div', {
      className: '.class Object -flag -anotherFlag $mixin'
    }, undefined
  ])

  t.end()
})

test('add classes to specified', function(t){

  var h = ctor(innerH)
  var res = h('div.class', {className: 'another'})

  t.deepEqual(res, [
    'div', 
    { className: '.class another' }, 
    undefined
  ])

  t.end()
})

test('children but no properties', function(t){

  var h = ctor(innerH)

  var res = h('div.class', ['children'])
  t.deepEqual(res, [
    'div', 
    { className: '.class' }, 
    ['children']
  ])

  var res = h('div.class', new FakeVnode('span'))
  t.deepEqual(res, [
    'div', 
    { className: '.class' }, 
    { type: 'vnode', tag: 'span' }
  ])

  var res = h('div.class', 'text')
  t.deepEqual(res, [
    'div', 
    { className: '.class' }, 
    'text'
  ])

  var res = h('div', 'text')
  t.deepEqual(res, [
    'div', null, 'text'
  ])

  t.end()
})


function innerH(tagName, properties, children){
  return [tagName, properties, children]
}

function FakeVnode(tag){
  this.tag = tag
  this.type = 'vnode'
}