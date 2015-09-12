'use strict'
const noop = () => {}

const parse = function(qs, debug) {
  if (!qs) return {}
  // 'a=b&c=d' -> ['a=b', 'c=d']
  let pairs = qs.split('&')
  debug('delimited pairs', pairs)

  // ['a=b', 'c=d'] -> [['a', 'b'], ['c', 'd']]
  pairs = pairs.map((pair) => {
    return pair.split('=')
  })
  debug('split pairs', pairs)

  // [['a', 'b'], ['c', 'd']] -> {a: 'b', c: 'd'}
  return pairs.reduce((memo, [fieldKey, fieldValue]) => {
    memo[fieldKey] = fieldValue
    return memo
  }, {})
}

module.exports = parse
