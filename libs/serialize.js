
const noop = () => {}

const Utils = require('./utils')

const serialize = function(queryObject, debug = noop) {
  if (Object.keys(queryObject).length === 0) return ''

  let qs

  let pairs = Utils.objectToPairs(queryObject)
  debug('nested pairs', pairs)

  pairs = pairs.reduce(Utils.nestedToFlatPairs, [])
  debug('flat pairs', pairs)

  pairs = pairs.map(([path, value]) => {
    return `${Utils.arrayPathToString(path)}=${value}`
  })

  qs = pairs.join('&')

  return qs
}

module.exports = serialize

//
// const serializeFlow = (queryObject, debug = debug) => {
//   // guard
//   flow(
//     objectToPairs,
//     tap( item => debug('nested pairs', item) ),
//     nestedToFlatPairs,
//     flatPairsToQs
//   )(queryObject)
// }
//
// const tap (fn) => (item) => {
//   fn(item)
//   return item
// }
