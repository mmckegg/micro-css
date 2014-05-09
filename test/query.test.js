var test = require('tape')
var query = require('../query')

test('test', function(t){
  t.equal(query('Object'), '.Object')
  t.equal(query('Object -cat'), '.Object.-cat')
  t.equal(query('Object -cat div.title'), '.Object.-cat > div.\\.title')
  t.equal(
    query('Object -cat div.title, div, div.thing, span -large'), 
    '.Object.-cat > div.\\.title, div, div.\\.thing, span.-large'
  )
  t.end()
})