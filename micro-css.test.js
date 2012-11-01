var test = require('tap').test

var microCss = require('./micro-css')

test("object with rules", function(t){
  
  var mcss = "Document {\n  background-color: silver\n  color:gray\n }"
  var expected = ".Document { background-color: silver; color: gray; } "
  
  t.equal(microCss(mcss), expected)
  
  t.end()
})

test("root element with rules", function(t){
  
  var mcss = ("h1 {\n  font-size: 10pt\n  color:#356\n }")
  var expected = "h1 { font-size: 10pt; color: #356; } "
  
  t.equal(microCss(mcss), expected)

  t.end()
})

test("element with pseudo class", function(t){
  
  var mcss = ("a {\n  :hover {\n    text-decoration: underline\n  }\n}")
  var expected = "a:hover { text-decoration: underline; } "
  
  t.equal(microCss(mcss), expected)
  
  t.end()
})

test("root multi element with rules", function(t){
  
  var mcss = ("h1, h2, h3, h4, h5, h6 {\n  margin-bottom: 10px }")
  var expected = "h1, h2, h3, h4, h5, h6 { margin-bottom: 10px; } "
  
  t.equal(microCss(mcss), expected)

  t.end()
})

test("mixin with rules", function(t){
  
  var mcss = ("$noticeMe {\n  background-color: fuchsia\n  color:lime\n }")
  var expected = ".\\$noticeMe { background-color: fuchsia; color: lime; } "
  
  t.equal(microCss(mcss), expected)
  
  t.end()
  
})

test("mixin to another rule", function(t){
  
  var mcss = (
    "$noticeMe { " + 
      "-fancy { " + 
        "background: green \n" + 
        "div.stuff { color: white } " + 
      "} " + 
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
    ".Item { color: green; } " +
    ".Item.-fancy { background: green; } " +
    ".Item.-fancy > div.\\.stuff { color: white; } " + 
    ".Item { border: solid gray 1px; } " + 
    ".Item > div { color: gray; } " + 
    ".\\$noticeMe { color: green; } " +
    ".\\$noticeMe.-fancy { background: green; } " + 
    ".\\$noticeMe.-fancy > div.\\.stuff { color: white; } "
  )
  
  t.equal(microCss(mcss), expected)
  
  t.end()
  
})

test("mixin with flags and inner rules", function(t){
  
  var mcss = ("$noticeMe { -fancy { background: green \n div.stuff { color: white } } }")
  var expected = ".\\$noticeMe.-fancy { background: green; } .\\$noticeMe.-fancy > div.\\.stuff { color: white; } "
  
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
  
  var expected = ".Document { background-color: silver; color: gray; } .Document.-wide { width: 700px; padding: 30px; } "
    
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
  
  var expected = ".Document { background-color: silver; color: gray; } " + 
                 ".Document.-main { padding: 30px; } " +
                 ".Document.-main > heading { background-color: silver; color: black; } "
    
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
  
  var expected = ".Document { background-color: silver; color: gray; } " + 
                 ".Document.-main { padding: 30px; } " +
                 ".Document.-main > heading { border-bottom: 1px solid gray; background-color: silver; } " +
                 ".Document.-main > heading > h1 { color: black; } "
    
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
  
  var expected = ".Document > span.\\.name { color: red; } "
    
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
  
  var expected = ".Document.-large.-red { color: red; } .Document.-notice { color: red; } "
    
  t.equal(microCss(mcss), expected)
  
  t.end()
})