var tagMatcher = /^(\.?[a-z0-9]+)/

// pass a hyperscript ctor to wrap with mcss parsing
module.exports = function (h) {
  return function (tag, props, children) {
    if (!children && props && isChildren(props)) {
      children = props
      props = null
    }

    var parts = tag.split(' ')
    var tagName = parts.filter(isTagName)[0] || 'div'
    var classes = parts.filter(isNotTagName).join(' ')

    if (classes) {
      props = props || {}
      if (props.className) {
        props.className = classes + ' ' + props.className
      } else {
        props.className = classes
      }
    }

    return h(tagName, props, children)
  }
}

function isChildren (object) {
  return Array.isArray(object) || !(object instanceof Object) || Object.getPrototypeOf(object) !== Object.prototype
}

function isTagName (name) {
  return !!tagMatcher.exec(name)
}

function isNotTagName (name) {
  return !isTagName(name)
}
