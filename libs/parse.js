
const noop = () => {}

const Utils = require('./utils')

export const parse = function(qs, debug = noop) {
  if (!qs) return {}
  // 'a[b]=c&c=d' -> ['a[b]=c', 'c=d']
  let pairs = qs.split('&')
  debug('delimited pairs', pairs)

  // ['a[b]=c', 'c=d'] -> [['a[b]', 'c'], ['c', 'd']]
  pairs = pairs.map((pair) => {
    return pair.split('=')
  })
  debug('split pairs', pairs)

  // [['a[b]', 'c'], ['c', 'd']] -> [[['a', 'b'], 'c'], ['c, 'd']]
  pairs = pairs.map(([fieldKey, fieldValue]) => {
    return [Utils.parseKey(fieldKey), fieldValue]
  })
  debug('parse keys', pairs)

  // [[['a', 'b'], 'c']] -> [['a', ['b', 'c']]]
  pairs = pairs.reduce(Utils.appendNestedValue, [])
  debug('flat to nested', pairs)

  // [['a', [['b', 'c']]]] -> {a: [b: 'c']}
  return Utils.pairListToObject(pairs)
}

export default parse
module.exports = parse
