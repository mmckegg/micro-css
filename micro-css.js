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
      result += getCssForSelector(selector, innerStyle, root)
    })
    
  }
  
  if (style.flags){
    
    eachGroup(style.flags, function(name, innerStyle){
      name.split(',').forEach(function(n){
        var selector = getSelector(n.trim(), prepend)
        result += getCssForSelector(selector, innerStyle, root)
      })
      
    })
    
  }
  
  if (style.pseudos){
    
    eachGroup(style.pseudos, function(name, innerStyle){
      name.split(',').forEach(function(n){
        var selector = getPseudoSelector(n.trim(), prepend)
        result += getCssForSelector(selector, innerStyle, root)
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
            
      result += getCssForSelector(selectors.join(', '), innerStyle, root, subItems)      
      
    })

  }
  
  return result
  
}

function getCssForSelector(selector, innerStyle, root, overrideSubItems){
  var result = ""
  if (innerStyle.extensions){
    result += getExtensions(selector, innerStyle.extensions, root)
  }
  if (innerStyle.rules){
    result += getCssBlock(selector, innerStyle.rules)
  }
  if (overrideSubItems == null){
    result += getRules(innerStyle, root, selector)
  } else {
    result += overrideSubItems
  }
  return result
}

function getExtensions(selector, extensions, root){
  // TODO: should find a way that allows extensions to be grouped together with the original mixin - that way no duplication of rules
  // handle extensions
  var result = ""
  if (extensions){
    extensions.forEach(function(extension){
      if (root.mixins && root.mixins[extension]){
        var innerStyle = root.mixins[extension]
        result += getCssForSelector(selector, innerStyle, root)
      }
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