var tokenizer = require('./lib/tokenizer')
var query = require('./query')

module.exports = function(text){
 
 var style = tokenizer(text)
 
 var result = getRules(style)
 
 if (style.mixins){
   
   eachGroup(style.mixins, function(name, innerStyle){
     var selector = getSelector(name)
     if (innerStyle.rules){
       result += getCssBlock(selector, innerStyle.rules, style)
     }
     result += getRules(innerStyle, root, selector)
   })

 }
 
 return result
}

module.exports.query = query

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
        var selector = getElementSelector(parts[0], parts[1], prepend, innerStyle.deep)

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
    result += getCssBlock(selector, innerStyle.rules, root)
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
    result += name + ': ' + handleValue(value, root) + '; ' 
  })
  return result + '}\n'
}

function handleValue(value, root){
  return value.replace(/(\W|^)(svg)\((.+)\)(\W|$)/g, function(match, prefix, type, name, suffix){
    if (type == 'svg'){
      var url = getSvgDataUrl(name, root)
      return prefix + 'url("' + url + '")' + suffix
    } else {
      return ' '
    }
  })
}

function getSvgDataUrl(name, root){
  var parts = name.split(' ')
  var style = root.entities && root.entities['@svg ' + parts[0]]
  if (style){

    var innerStyles = getRules(style, root)
    var svg = getSvgBlock(style.rules, innerStyles, parts.slice(1))

    var encoded = new Buffer(svg).toString('base64')
    return 'data:image/svg+xml;charset=utf-8;base64,' + encoded
  }
}

function getSvgBlock(attributes, styles, classes){
  var result = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"'
  var content = ''
  Object.keys(attributes).forEach(function(name){
    if (name == 'content'){
      content = attributes[name].replace(/^["' ]+|["' ]+$/g, '')
    } else {
      result += ' ' + name + '="' + attributes[name] + '"'
    }
  })

  if (classes && classes.length){
    result += ' class="' + classes.join(' ') + '"' 
  }

  result += '>'

  result += '<defs><style type="text/css"><![CDATA[' + styles + ']]></style></defs>'
  result += content
  result += '</svg>'

  return result
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

function getElementSelector(name, filter, prepend, isDeep){
  var selector = escapeClass(name)
  
  if (filter){
    selector += ".\\." + escapeClass(filter)
  }
  
  if (prepend){
    if (isDeep){
      selector = prepend + ' ' + selector
    } else {
      selector = prepend + ' > ' + selector
    }
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