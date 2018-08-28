module.exports = (tokens) => {
  let result = ''

  let indent = 0
  const indentSpaces = 2

  const print = (text) => {
    result += Array(indent + 1).join(' ')
    result += text
    result += '\n'
  }

  const walk = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key]) {
        if (key === 'objects' || key === 'flags' || key === 'pseudos' || key === 'entities' || key === 'elements' || key === 'mixins') {
          walk(obj[key])
        } else if (key === 'deep') {
          // XXX: ignore? not sure what to do here
        } else if (key === 'extensions') {
          Object.values(obj[key]).forEach((extension) => {
            print(extension)
          })
          // XXX: ignore? not sure what to do here
        } else if (key === 'rules') {
          Object.keys(obj[key]).forEach((rule) => {
            const value = obj[key][rule]
            if (value !== undefined) {
              print(`${rule}: ${value}`)
            }
          })
        } else {
          if (obj[key].deep) {
            print(`(${key}) {`)
          } else {
            print(`${key} {`)
          }
          indent += indentSpaces
          walk(obj[key])
          indent -= indentSpaces
          print('}')
        }
      }
    })
  }

  walk(tokens)
  return result
}
