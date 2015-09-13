'use strict'
const noop = () => {}

const Utils = require('./utils')

const serialize = function(queryObject, debug) {
  if (Object.keys(queryObject).length === 0) return ''

  let qs

  let pairs = Utils.objectToArray(queryObject)
  debug('pairs', pairs)

  pairs = pairs.map(([key, value]) => {
    return `${key}=${value}`
  })

  qs = pairs.join('&')

  return qs
}

module.exports = serialize
