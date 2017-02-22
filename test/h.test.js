/* eslint-disable no-redeclare */

var test = require('tape')
var ctor = require('../h.js')

test('parsing classes', function (t) {
  var h = ctor(innerH)
  var res = h('div.class Object -flag -anotherFlag')

  t.deepEqual(res, [
    'div.class', {
      className: 'Object -flag -anotherFlag'
    }, undefined
  ])

  t.end()
})

test('add classes to specified', function (t) {
  var h = ctor(innerH)
  var res = h('div.class', {className: 'another'})

  t.deepEqual(res, [
    'div.class',
    { className: 'another' },
    undefined
  ])

  t.end()
})

test('no element specified with class', function (t) {
  var h = ctor(innerH)
  var res = h('.class', {className: 'another'})

  t.deepEqual(res, [
    '.class',
    { className: 'another' },
    undefined
  ])

  t.end()
})

test('children but no properties', function (t) {
  var h = ctor(innerH)

  var res = h('div.class', ['children'])
  t.deepEqual(res, [
    'div.class', null, ['children']
  ])

  var res = h('div.class', new FakeVnode('span'))
  t.deepEqual(res, [
    'div.class',
    null,
    { type: 'vnode', tag: 'span' }
  ])

  var res = h('div.class', 'text')
  t.deepEqual(res, [
    'div.class',
    null,
    'text'
  ])

  var res = h('div', 'text')
  t.deepEqual(res, [
    'div', null, 'text'
  ])

  t.end()
})

function innerH (tagName, properties, children) {
  return [tagName, properties, children]
}

function FakeVnode (tag) {
  this.tag = tag
  this.type = 'vnode'
}
