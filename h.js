var tagMatcher = /^([a-z0-9]+)?(.*)$/

// pass a hyperscript ctor to wrap with mcss parsing 
module.exports = function(h){
  return function(tag, props, children){
    if (!children && props && isChildren(props)){
      children = props
      props = null
    }

    var parts = tagMatcher.exec(tag)
    var tagName = parts[1] || 'div'
    var classes = parts[2].trim()

    if (classes){
      props = props || {}
      if (props.className){
        props.className = classes + ' ' + props.className
      } else {
        props.className = classes
      }
    }

    return h(tagName, props, children)
  }
}

function isChildren(object){
  return Array.isArray(object) || !(object instanceof Object) || Object.getPrototypeOf(object) !== Object.prototype
}