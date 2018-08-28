var test = require('tape')

var serializer = require('../lib/serializer')
var tokenizer = require('../lib/tokenizer')

// back and forth
var baf = (mcss) => serializer(tokenizer(mcss))

test('object with rules', function (t) {
  var input = `Document {
  background-color: silver
  color: gray
}
`
  t.equals(baf(input), input)
  t.end()
})

test('root element with rules', function (t) {
  var input = `h1 {
  font-size: 10pt
  color: #356
}
`

  t.equals(baf(input), input)
  t.end()
})

test('test preceded by operator', function (t) {
  var input = `p + p {
  font-size: 10pt
  color: #356
}
`

  t.equals(baf(input), input)
  t.end()
})

test('element with pseudo class', function (t) {
  var input = `a {
  :hover {
    text-decoration: underline
  }
}
`
  t.equals(baf(input), input)
  t.end()
})

test('element with multiple pseudo classes', function (t) {
  var input = `a {
  :before, :after {
    content: '-'
  }
}
`

  t.equal(baf(input), input)
  t.end()
})

test('mixin with rules', function (t) {
  var input = `$noticeMe {
  background-color: fuchsia
  color: lime
}
`

  t.equal(baf(input), input)
  t.end()
})

test('nested mixin', function (t) {
  var input = `Object {
  div {
    $mixin
  }
  $mixin {
    color: red
  }
}
`

  t.equal(baf(input), input)
  t.end()
})

test('mixin to another rule', function (t) {
  var input = `$noticeMe {
  -fancy {
    background: green
    div.stuff {
      color: white
    }
  }
}
Item {
  $noticeMe
  div {
    color: gray
  }
}
`

  t.equal(baf(input), input)
  t.end()
})

test('mixin extending element with no rules', function (t) {
  var input = `div {
  $mixin
}
`
  t.equal(baf(input), input)
  t.end()
})

test('mixin with flags and inner rule', function (t) {
  var input = `$noticeMe {
  -fancy {
    background: green
    div.stuff {
      color: white
    }
  }
}
`

  t.equal(baf(input), input)
  t.end()
})

test('object with flags', function (t) {
  var input = `Document {
  background-color: silver
  color: gray
  -wide {
    width: 700px
    padding: 30px
  }
}
`

  t.equal(baf(input), input)
  t.end()
})

test('object with deep element', function (t) {
  var input = `Document {
  (strong) {
    font-weight: bold
    color: blue
  }
}
`

  t.equal(baf(input), input)
  t.end()
})

test('element with attribute match', function (t) {
  var input = `div {
  [contenteditable] {
    outline: dotted 1px silver
  }
}
`

  t.equal(baf(input), input)
  t.end()
})

test('root attribute match', function (t) {
  var input = `[hidden] {
  display: none
}
`

  t.equal(baf(input), input)
  t.end()
})

test('object with flags and nested elements', function (t) {
  var input = `Document {
  background-color: silver
  color: gray
  -main {
    padding: 30px
    heading {
      border-bottom: 1px solid gray
      background-color: silver
      color: black
    }
  }
}
`

  t.equal(baf(input), input)
  t.end()
})

test('object with flags and multiple nested elements', function (t) {
  var input = `Document {
  background-color: silver
  color: gray
  -main {
    padding: 30px
    heading {
      border-bottom: 1px solid gray
      background-color: silver
      h1 {
        color: black
      }
    }
  }
}
`

  t.equal(baf(input), input)
  t.end()
})

test('object with filtered elements', function (t) {
  var input = `Document {
  span.name {
    color: red
  }
}
`

  t.equals(baf(input), input)
  t.end()
})

test('object with multi flags', function (t) {
  var input = `Document {
  -large -red, -notice {
    color: red
  }
}
`
  t.equals(baf(input), input)
  t.end()
})

test('wildcard root', function (t) {
  var input = `* {
  box-sizing: border-box
}
`

  t.equals(baf(input), input)
  t.end()
})

test('pseudos elements', function (t) {
  var input = `Document {
  ::-webkit-placeholder {
    color: red
  }
}
`

  t.equals(baf(input), input)
  t.end()
})

test('svg entity', function (t) {
  var input = `@svg test {
  content: '<ellipse/>
  width: 16px
  height: 16px
  ellipse {
    fill: green
  }
}
`

  t.equals(baf(input), input)
  t.end()
})

test('nested svg entity', function (t) {
  var input = `Object {
  @svg test {
    content: '<ellipse/>
  }
}
`

  t.equals(baf(input), input)
  t.end()
})

test('css entity with nesting', function (t) {
  var input = `@keyframes test {
  from {
    background-color: red
  }
  50% {
    background-color: green
  }
  to {
    background-color: blue
  }
}
`

  t.equals(baf(input), input)
  t.end()
})
