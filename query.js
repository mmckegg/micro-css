module.exports = function (query) {
  // objects
  query = query.replace(/(^| )([A-Z])/, '$1.$2')

  // flags
  query = query.replace(/ \-/g, '.-')

  var parts = query.split(',')
  var results = parts.map(handleDepth)
  return results.join(', ')
}

function handleDepth (query) {
  var result = []
  var parts = query.trim().split(' ')
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i]
    var deepQuery = getDeepQuery(part)
    part = deepQuery || part

    if (!deepQuery && i > 0) {
      result.push('>')
    }

    result.push(part)
  }
  return result.join(' ')
}

function getDeepQuery (query) {
  if (query.slice(0, 1) === '(' && query.slice(-1) === ')') {
    return query.slice(1, -1)
  }
}
