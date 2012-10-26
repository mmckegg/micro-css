var test = require('tap').test

var tokenizer = require('./tokenizer')

test("object with rules", function(t){
  
  var tokens = tokenizer("Document {\n  background-color: silver\n  color:gray\n }")
  
  t.deepEquals({
    objects: {
      'Document': {
        rules: {
          'background-color': 'silver',
          'color': 'gray'
        }
      }
    }
  }, tokens)
  
  t.end()
})

test("root element with rules", function(t){
  
  var tokens = tokenizer("h1 {\n  font-size: 10pt\n  color:#356\n }")
  
  t.deepEquals({
    elements: {
      'h1': {
        rules: {
          'font-size': '10pt',
          'color': '#356'
        }
      }
    }
  }, tokens)
  
  t.end()
})

test("element with pseudo class", function(t){
  
  var tokens = tokenizer("a {\n  :hover {\n    text-decoration: underline\n  }\n}")
  
  t.deepEquals(tokens, {
    elements: {
      'a': {
        pseudos: {
          ':hover': {
            rules: {
              'text-decoration': 'underline'
            }
          }
        }
      }
    }
  })
  
  t.end()
})

test("mixin with rules", function(t){
  
  var tokens = tokenizer("$noticeMe {\n  background-color: fuchsia\n  color:lime\n }")
  
  t.deepEquals({
    mixins: {
      '$noticeMe': {
        rules: {
          'background-color': 'fuchsia',
          'color': 'lime'
        }
      }
    }
  }, tokens)
  
  t.end()
})

test("mixin with flags and inner rule", function(t){
  
  var tokens = tokenizer("$noticeMe { -fancy { background: green \n div.stuff { color: white } } }")
  
  t.deepEquals({
    mixins: {
      '$noticeMe': {
        flags: {
          '-fancy': {
            rules: {
              'background': 'green'
            },
            elements: {
              'div.stuff': {
                rules: {
                  'color': 'white'
                }
              }
            }
          }
        }
      }
    }
  }, tokens)
  
  t.end()
})

test("object with flags", function(t){
  
  var tokens = tokenizer(
    "Document {\n" +  
    "  background-color: silver\n" + 
    "  color:gray\n" + 
    "  -wide {\n" + 
    "    width: 700px\n" + 
    "    padding:30px\n" + 
    "  }\n" + 
    "}"
  )
    
  t.deepEquals({
    objects: {
      'Document': {
        rules: {
          'background-color': 'silver',
          'color': 'gray'
        },
        flags: {
          '-wide': {
            rules: {
              'width': '700px',
              'padding': '30px'
            }
          }
        }
      }
    }
  }, tokens)
  
  t.end()
})

test("object with flags and nested elements", function(t){
  
  var tokens = tokenizer(
    "Document {\n" +  
    "  background-color: silver\n" + 
    "  color:gray\n" + 
    "  -main {\n" + 
    "    padding:30px\n" + 
    "    heading {\n" +
    "      border-bottom: 1px solid gray\n" +
    "      background-color: silver\n" +
    "      color: black\n" +
    "    }\n" +
    "  }\n" + 
    "}"
  )
    
  t.deepEquals({
    objects: {
      'Document': {
        rules: {
          'background-color': 'silver',
          'color': 'gray'
        },
        flags: {
          '-main': {
            rules: {
              'padding': '30px'
            },
            elements: {
              'heading': {
                rules: {
                  'border-bottom': '1px solid gray',
                  'background-color': 'silver',
                  'color': 'black'
                }
              }
            }
          }
        }
      }
    }
  }, tokens)
  
  t.end()
})

test("object with flags and multiple nested elements", function(t){
  
  var tokens = tokenizer(
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
    
  t.deepEquals({
    objects: {
      'Document': {
        rules: {
          'background-color': 'silver',
          'color': 'gray'
        },
        flags: {
          '-main': {
            rules: {
              'padding': '30px'
            },
            elements: {
              'heading': {
                rules: {
                  'border-bottom': '1px solid gray',
                  'background-color': 'silver',
                },
                elements: {
                  h1: {
                    rules: {
                      'color': 'black'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }, tokens)
  
  t.end()
})

test("object with filtered elements", function(t){
  
  var tokens = tokenizer(
    "Document {\n" +  
    "  span.name {\n" + 
    "    color: red\n" +
    "  }\n" + 
    "}"
  )
    
  t.deepEquals({
    objects: {
      'Document': {
        elements: {
          'span.name': {
            rules: {
              'color': 'red'
            }
          }
        }
      }
    }
  }, tokens)
  
  t.end()
})

test("object with multi flags", function(t){
  
  var tokens = tokenizer(
    "Document {\n" +  
    "  -large -red, -notice {\n" + 
    "    color: red\n" +
    "  }\n" + 
    "}"
  )
    
  t.deepEquals({
    objects: {
      'Document': {
        flags: {
          '-large -red, -notice': {
            rules: {
              'color': 'red'
            }
          }
        }
      }
    }
  }, tokens)
  
  t.end()
})