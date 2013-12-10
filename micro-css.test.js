var test = require('tap').test

var microCss = require('./micro-css')

test("object with rules", function(t){
  
  var mcss = "Document {\n  background-color: silver\n  color:gray\n }"
  var expected = ".Document { background-color: silver; color: gray; }\n"
  
  t.equal(microCss(mcss), expected)
  
  t.end()
})

test("root element with rules", function(t){
  
  var mcss = ("h1 {\n  font-size: 10pt\n  color:#356\n }")
  var expected = "h1 { font-size: 10pt; color: #356; }\n"
  
  t.equal(microCss(mcss), expected)

  t.end()
})

test("element with pseudo class", function(t){
  
  var mcss = ("a {\n  :hover {\n    text-decoration: underline\n  }\n}")
  var expected = "a:hover { text-decoration: underline; }\n"
  
  t.equal(microCss(mcss), expected)
  
  t.end()
})

test("element with multi pseudo class", function(t){
  
  var mcss = ("a {\n  :before, :after {\n    content: '-'\n  }\n}")
  var expected = "a:before { content: '-'; }\na:after { content: '-'; }\n"
  
  t.equal(microCss(mcss), expected)
  
  t.end()
})


test("root multi element with rules", function(t){
  
  var mcss = ("h1, h2, h3, h4, h5, h6 {\n  margin-bottom: 10px }")
  var expected = "h1, h2, h3, h4, h5, h6 { margin-bottom: 10px; }\n"
  
  t.equal(microCss(mcss), expected)

  t.end()
})

test("mixin with rules", function(t){
  
  var mcss = ("$noticeMe {\n  background-color: fuchsia\n  color:lime\n }")
  var expected = ".\\$noticeMe { background-color: fuchsia; color: lime; }\n"
  
  t.equal(microCss(mcss), expected)
  
  t.end()
  
})

test("mixin to another rule", function(t){
  
  var mcss = (
    "$noticeMe { " + 
      "-fancy { " + 
        "background: green \n" + 
        "div.stuff { color: white }\n" + 
      "}\n" + 
      "color: green " +
    "}" +
    "Item { " +
      "$noticeMe \n" +
      "border: solid gray 1px \n" +
      "div { " +
        "color: gray " +
      "}" +
    "}"
  )
  
  var expected = (
    ".Item { color: green; }\n" +
    ".Item.-fancy { background: green; }\n" +
    ".Item.-fancy > div.\\.stuff { color: white; }\n" + 
    ".Item { border: solid gray 1px; }\n" + 
    ".Item > div { color: gray; }\n" + 
    ".\\$noticeMe { color: green; }\n" +
    ".\\$noticeMe.-fancy { background: green; }\n" + 
    ".\\$noticeMe.-fancy > div.\\.stuff { color: white; }\n"
  )
  
  t.equal(microCss(mcss), expected)
  
  t.end()
  
})

test("mixin with flags and inner rules", function(t){
  
  var mcss = ("$noticeMe { -fancy { background: green \n div.stuff { color: white } } }")
  var expected = ".\\$noticeMe.-fancy { background: green; }\n.\\$noticeMe.-fancy > div.\\.stuff { color: white; }\n"
  
  t.equal(microCss(mcss), expected)
 
  t.end()
})

test("object with flags", function(t){
  
  var mcss = (
    "Document {\n" +  
    "  background-color: silver\n" + 
    "  color:gray\n" + 
    "  -wide {\n" + 
    "    width: 700px\n" + 
    "    padding:30px\n" + 
    "  }\n" + 
    "}"
  )
  
  var expected = ".Document { background-color: silver; color: gray; }\n.Document.-wide { width: 700px; padding: 30px; }\n"
    
  t.equal(microCss(mcss), expected)
  
  t.end()
})

test("object with flags and nested elements", function(t){
  
  var mcss = (
    "Document {\n" +  
    "  background-color: silver\n" + 
    "  color:gray\n" + 
    "  -main {\n" + 
    "    padding:30px\n" + 
    "    heading {\n" +
    "      background-color: silver\n" +
    "      color: black\n" +
    "    }\n" +
    "  }\n" + 
    "}"
  )
  
  var expected = ".Document { background-color: silver; color: gray; }\n" + 
                 ".Document.-main { padding: 30px; }\n" +
                 ".Document.-main > heading { background-color: silver; color: black; }\n"
    
  t.equal(microCss(mcss), expected)
  
  t.end()
})

test("object with flags and multiple nested elements", function(t){
  
  var mcss = (
    "Document {\n" +  
    "  background-color: silver\n" + 
    "  color:gray\n" + 
    "  -main {\n" + 
    "    padding:30px\n" + 
    "    heading {\n" +
    "      border-bottom: 1px solid gray\n" +
    "      background-color: silver\n" +
    "      h1 {\n" + 
    "       color: black\n" +
    "      }\n" +
    "    }\n" +
    "  }\n" + 
    "}"
  )
  
  var expected = ".Document { background-color: silver; color: gray; }\n" + 
                 ".Document.-main { padding: 30px; }\n" +
                 ".Document.-main > heading { border-bottom: 1px solid gray; background-color: silver; }\n" +
                 ".Document.-main > heading > h1 { color: black; }\n"
    
  t.equal(microCss(mcss), expected)
  
  
  t.end()
})

test("object with filtered elements", function(t){
  
  var mcss = (
    "Document {\n" +  
    "  span.name {\n" + 
    "    color: red\n" +
    "  }\n" + 
    "}"
  )
  
  var expected = ".Document > span.\\.name { color: red; }\n"
    
  t.equal(microCss(mcss), expected)
  
  t.end()
})

test("object with deep element", function(t){
  
  var mcss = (
    "Document {\n" +  
    "  (strong) {\n" + 
    "    font-weight: bold\n" + 
    "    color: blue\n" + 
    "  }\n" + 
    "}"
  )
  
  var expected = ".Document strong { font-weight: bold; color: blue; }\n"
    
  t.equal(microCss(mcss), expected)
  
  t.end()
})

test("element with attribute match", function(t){
  
  var mcss = (
    "div {\n" +  
    "  [contenteditable] {\n" + 
    "    outline: dotted 1px silver\n" + 
    "  }\n" + 
    "}"
  )
  
  var expected = "div[contenteditable] { outline: dotted 1px silver; }\n"

  t.equal(microCss(mcss), expected)
  
  t.end()
})

test("object with multi flags", function(t){
  
  var mcss = (
    "Document {\n" +  
    "  -large -red, -notice {\n" + 
    "    color: red\n" +
    "  }\n" + 
    "}"
  )
  
  var expected = ".Document.-large.-red { color: red; }\n.Document.-notice { color: red; }\n"
    
  t.equal(microCss(mcss), expected)
  
  t.end()
})

test("test inline svg", function(t){
  
  var mcss = (
    "@svg test {\n" +  
    "  content: '<ellipse/>'\n" +
    "  width: 16px\n" +
    "  height: 16px \n" +
    "  ellipse { \n" +
    "    fill: green  \n " +
    "  } \n" +
    "  -sub { \n" + 
    "    ellipse {\n" +
    "      fill: blue \n" +
    "    }\n" +
    "  }\n" +
    "} \n" +
    "body {\n" +
    "  background: svg(test) no-repeat left \n" +
    "}\n" +
    "div {\n" +
    "  background: svg(test -sub) \n" +
    "}"
  )
  
  var expected = 'body { background: url("data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48IVtDREFUQVsuLXN1YiA+IGVsbGlwc2UgeyBmaWxsOiBibHVlOyB9CmVsbGlwc2UgeyBmaWxsOiBncmVlbjsgfQpdXT48L3N0eWxlPjwvZGVmcz48ZWxsaXBzZS8+PC9zdmc+") no-repeat left; }\n' +
                 'div { background: url("data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgY2xhc3M9Ii1zdWIiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbLi1zdWIgPiBlbGxpcHNlIHsgZmlsbDogYmx1ZTsgfQplbGxpcHNlIHsgZmlsbDogZ3JlZW47IH0KXV0+PC9zdHlsZT48L2RlZnM+PGVsbGlwc2UvPjwvc3ZnPg=="); }\n'
    
  t.equal(microCss(mcss), expected)
  
  t.end()
})
