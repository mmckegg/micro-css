/* eslint-disable no-redeclare */

module.exports = function (text) {
  var rootStyles = {}
  eachToken(text, rootHandler, rootStyles)
  return rootStyles
}

function rootHandler (token, target) {
  if (isObject(token.group)) {
    var styles = define('objects', token.group, target)
    eachToken(token.inner, objectHandler, styles)
  }

  if (isElement(token.group)) {
    var styles = define('elements', token.group, target)
    eachToken(token.inner, objectHandler, styles)
  }

  if (isMixin(token.group)) {
    var styles = define('mixins', token.group, target)
    eachToken(token.inner, objectHandler, styles)
  }

  if (isEntity(token.group)) {
    var styles = define('entities', token.group, target)
    eachToken(token.inner, objectHandler, styles)
  }

  if (isPseudo(token.group)) {
    var styles = define('pseudos', token.group, target)
    eachToken(token.inner, objectHandler, styles)
  }
}

function objectHandler (token, target) {
  if (!defineRule(token, target)) {
    var deep = isDeep(token.group)
    if (deep) {
      token.group = token.group.slice(1, -1)
    }

    if (isPseudo(token.group)) {
      var styles = define('pseudos', token.group, target)
      eachToken(token.inner, objectHandler, styles)
    } else if (isElement(token.group)) {
      var styles = define('elements', token.group, target)
      eachToken(token.inner, objectHandler, styles)
    } else if (isFlag(token.group)) {
      var styles = define('flags', token.group, target)
      eachToken(token.inner, objectHandler, styles)
    } else if (isMixin(token.group)) {
      var styles = define('mixins', token.group, target)
      eachToken(token.inner, objectHandler, styles)
    } else if (isEntity(token.group)) {
      var styles = define('entities', token.group, target)
      eachToken(token.inner, objectHandler, styles)
    }

    if (styles && deep) {
      styles.deep = true
    }
  }
}

function define (type, name, target) {
  target[type] = target[type] || {}
  target[type][name] = target[type][name] || {}
  return target[type][name]
}

function defineRule (token, target) {
  if (token.rule) {
    target.rules = target.rules || {}
    target.rules[token.rule] = token.value
    return true
  } else {
    return false
  }
}

function isDeep (name) {
  return name && name.charAt(0) === '(' && name.charAt(name.length - 1) === ')'
}

function isFlag (name) {
  return name && name.charAt(0) === '-'
}

function isObject (name) {
  return name && name.charAt(0) !== name.charAt(0).toLowerCase()
}

function isElement (name) {
  return name && (name.charAt(0) !== name.charAt(0).toUpperCase() || name.charAt(0) === '*' || isFinite(name.charAt(0)))
}

function isPseudo (name) {
  // includes attribute selectors
  return name && (name.charAt(0) === ':' || name.charAt(0) === '[' && name.charAt(name.length - 1) === ']')
}

function isMixin (name) {
  return name && name.charAt(0) === '_'
}

function isEntity (name) {
  return name && name.charAt(0) === '@'
}

function eachToken (text, each, context) {
  var mode = 'search' // name
  var capture = {start: 0, end: 0}
  var currentName = null

  function captureName () {
    currentName = text.slice(capture.start, capture.end + 1).trim()
  }

  for (var i = 0; i < text.length; i++) {
    var prevChar = text.charAt(i - 1)
    var nextChar = text.charAt(i + 1)
    var char = text.charAt(i)

    if (mode === 'search') {
      if (isNameChar(char)) {
        capture.start = i
        mode = 'name'
      }
    }

    if (mode === 'name') {
      var isShortName = isAttrChar(prevChar) && char === ':' && nextChar !== ':'
      if (isShortName || (capture.end > capture.start && ((char === ':' && prevChar !== ' ') || char === '{'))) {
        captureName()
        var start = i + 1
        if (char === ':') {
          i = endPosition(text, start) || text.length
          each({rule: currentName, value: text.slice(start, i).trim()}, context)
        } else if (char === '{') {
          i = closePosition(text, start) || text.length
          each({group: currentName, inner: text.slice(start, i).trim()}, context)
        }

        mode = 'search'
        currentName = null
      } else if (char === '\n' || char === ';') {
        captureName()
        if (isMixin(currentName)) {
          context.extensions = context.extensions || []
          setAdd(context.extensions, currentName)
        }
        mode = 'search'
        currentName = null
      } else {
        capture.end = i
      }
    }
  }

  // clean up any dangling names
  if (mode === 'name') {
    captureName()
    if (isMixin(currentName)) {
      context.extensions = context.extensions || []
      setAdd(context.extensions, currentName)
    }
  }
}

function isNameChar (char) {
  return char && char !== ' ' && char !== '{' && char !== '}' && char !== '\n' && char !== ';'
}

function isAttrChar (char) {
  return char && isNameChar(char) && char !== ':'
}

function endPosition (text, start) {
  var inParans = false
  for (var i = start; i < text.length; i++) {
    var char = text.charAt(i)

    // dirty hack for dealing with semicolons in data-urls
    if (char === '(') {
      inParans = true
    } else if (char === ')') {
      inParans = false
    }

    if ((char === ';' && !inParans) || char === '\n') {
      return i
    }
  }
}

function closePosition (text, start) {
  var depth = 0

  for (var i = start; i < text.length; i++) {
    var char = text.charAt(i)
    if (char === '{') {
      depth += 1
    }
    if (char === '}') {
      if (depth === 0) {
        return i
      } else {
        depth -= 1
      }
    }
  }
}

function setAdd (array, item) {
  if (array.indexOf(item) < 0) {
    array.push(item)
  }
}
