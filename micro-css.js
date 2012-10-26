var tokenizer = require('./tokenizer')

module.exports = function(text){
 
 var style = tokenizer(text)
 
 var result = getRules(style)
 
 if (style.mixins){
   
   eachGroup(style.mixins, function(name, innerStyle){
     var selector = getSelector(name)
     if (innerStyle.rules){
       result += getCssBlock(selector, innerStyle.rules)
     }
     result += getRules(innerStyle, root, selector)
   })

 }
 
 return result
}


function getRules(style, root, prepend){
  
  var root = root || style
  
  var result = ""
  
  if (style.objects){
    
    eachGroup(style.objects, function(name, innerStyle){
      var selector = getSelector(name)
      if (innerStyle.rules){
        result += getCssBlock(selector, innerStyle.rules)
      }
      result += getRules(innerStyle, root, selector)
    })
    
  }
  
  if (style.flags){
    
    eachGroup(style.flags, function(name, innerStyle){
      name.split(',').forEach(function(n){
        var selector = getSelector(n.trim(), prepend)
        if (innerStyle.rules){
          result += getCssBlock(selector, innerStyle.rules)
        }
        result += getRules(innerStyle, root, selector)
      })
      
    })
    
  }
  
  if (style.pseudos){
    
    eachGroup(style.pseudos, function(name, innerStyle){
      name.split(',').forEach(function(n){
        var selector = getPseudoSelector(n.trim(), prepend)
        if (innerStyle.rules){
          result += getCssBlock(selector, innerStyle.rules)
        }
        result += getRules(innerStyle, root, selector)
      })
      
    })
    
  }
  
  if (style.elements){
    
    eachGroup(style.elements, function(name, innerStyle){
      
      var selectors = []
      var subItems = ""
      
      name.split(',').forEach(function(n){
      
        var parts = n.trim().split('.')
        var selector = getElementSelector(parts[0], parts[1], prepend)

        subItems += getRules(innerStyle, root, selector)
        selectors.push(selector)
      })
      
      if (innerStyle.rules){
        result += getCssBlock(selectors.join(', '), innerStyle.rules)
      }
      result += subItems
      
      
    })

  }
  
  return result
  
}

function getCssBlock(selector, rules, root){
  var result = selector + " { "
  eachGroup(rules, function(name, value){
    result += name + ': ' + value + '; ' 
  })
  return result + '} '
}


function getSelector(name, prepend){
  var selector = ""
  name.split(' ').forEach(function(n){
    if (n){
      selector += '.' + escapeClass(n)
    }
  })
  if (prepend){
    selector = prepend + selector
  }
  return selector  
}

function getPseudoSelector(name, prepend){
  var selector = ""
  name.split(' ').forEach(function(n){
    if (n){
      selector += n
    }
  })
  if (prepend){
    selector = prepend + selector
  }
  return selector  
}

function getElementSelector(name, filter, prepend){
  var selector = escapeClass(name)
  
  if (filter){
    selector += ".\\." + escapeClass(filter)
  }
  
  if (prepend){
    selector = prepend + ' > ' + selector
  }
  
  return selector
}

function escapeClass(name){
  return name.replace(/([\$\.])/g, "\\$1")
}

function eachGroup(groups, iterator){
  Object.keys(groups).forEach(function(key){
    iterator(key, groups[key])
  })
}