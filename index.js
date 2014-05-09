var tokenizer = require('./lib/tokenizer')
var query = require('./query')

module.exports = function(text){
 
 var style = tokenizer(text)
 
 var result = getRules(style)
 
 if (style.mixins){
   
   eachGroup(style.mixins, function(name, innerStyle){
     var selector = getSelector(name)
     if (innerStyle.rules){
       result += getCssBlock(selector, innerStyle)
     }
     result += getRules(innerStyle, selector)
   })

 }
 
 return result
}

module.exports.query = query

function addParent(style, parent){
  if (style !== parent){
    style.parent = parent
  }
}

function getRules(style, prepend){
    
  var result = ""
  

  
  if (style.objects){
    
    eachGroup(style.objects, function(name, innerStyle){
      addParent(innerStyle, style)
      var selector = getSelector(name)
      result += getCssForSelector(selector, innerStyle)
    })
    
  }
  
  if (style.flags){
    
    eachGroup(style.flags, function(name, innerStyle){
      addParent(innerStyle, style)
      name.split(',').forEach(function(n){
        var selector = getSelector(n.trim(), prepend)
        result += getCssForSelector(selector, innerStyle)
      })
      
    })
    
  }
  
  if (style.pseudos){
    
    eachGroup(style.pseudos, function(name, innerStyle){
      addParent(innerStyle, style)
      name.split(',').forEach(function(n){
        var selector = getPseudoSelector(n.trim(), prepend)
        result += getCssForSelector(selector, innerStyle)
      })
      
    })
    
  }
  
  if (style.elements){
    
    eachGroup(style.elements, function(name, innerStyle){
      addParent(innerStyle, style)
      
      var selectors = []
      var subItems = ""
      
      name.split(',').forEach(function(n){
      
        var parts = n.trim().split('.')
        var selector = getElementSelector(parts[0], parts[1], prepend, innerStyle.deep)

        subItems += getRules(innerStyle, selector)
        selectors.push(selector)
      })
            
      result += getCssForSelector(selectors.join(', '), innerStyle, subItems)      
      
    })

  }
  
  return result
  
}

function getCssForSelector(selector, innerStyle, overrideSubItems){
  var result = ""
  if (innerStyle.extensions){
    result += getExtensions(selector, innerStyle)
  }
  if (innerStyle.rules){
    result += getCssBlock(selector, innerStyle)
  }
  if (overrideSubItems == null){
    result += getRules(innerStyle, selector)
  } else {
    result += overrideSubItems
  }
  return result
}

function getExtensions(selector, style){
  // TODO: should find a way that allows extensions to be grouped together with the original mixin - that way no duplication of rules
  // handle extensions
  var result = ""
  if (style.extensions){
    style.extensions.forEach(function(name){
      var innerStyle = find('mixins', style, name)
      addParent(innerStyle, style)
      if (innerStyle){
        result += getCssForSelector(selector, innerStyle)
      }
    })
  }
  return result
}

function find(key, style, extensionName){
  var result = null
  while (style && !result){
    if (style[key] && style[key][extensionName]){
      result = style[key][extensionName]
    }
    style = style.parent
  }
  return result
}

function getCssBlock(selector, style){
  var result = selector + " { "
  eachGroup(style.rules, function(name, value){
    result += name + ': ' + handleValue(value, style) + '; ' 
  })
  return result + '}\n'
}

function handleValue(value, style){
  return value.replace(/(\W|^)(svg)\((.+)\)(\W|$)/g, function(match, prefix, type, name, suffix){
    if (type == 'svg'){
      var url = getSvgDataUrl(name, style)
      return prefix + 'url("' + url + '")' + suffix
    } else {
      return ' '
    }
  })
}

function getSvgDataUrl(name, style){
  var parts = name.split(' ')
  var style = find('entities', style, '@svg ' + parts[0])
  if (style){

    var innerStyles = getRules(style)
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

function mergeClone(){
  var result = {}
  for (var i=0;i<arguments.length;i++){
    var obj = arguments[i]
    if (obj){
      Object.keys(obj).forEach(function(key){
        result[key] = obj[key]
      })
    }
  }
  return result
}