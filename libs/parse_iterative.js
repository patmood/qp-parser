'use strict'
const noop = () => {}

const Utils = require('./utils')

const parseIterative = function(qs, debug) {
  if (!qs) return {}

  let pairs = qs.split('&')
  debug('delimited pairs', pairs)

  pairs = pairs.map((pair) => {
    return pair.split('=')
  })
  debug('split pairs', pairs)

  pairs = pairs.map(([fieldKey, fieldValue]) => {
    return [Utils.parseKey(fieldKey), fieldValue]
  })
  debug('parse keys', pairs)

  return Utils.pairListToObjectIterative(pairs)
}

module.exports = parseIterative
