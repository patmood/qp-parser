'use strict'
const noop = () => {}

const parse = function(qs, debug) {
  if (!qs) return {}
  let pairs = qs.split('&')
  debug('delimited pairs', pairs)

  let qsList = qs.split('=')
  let qsObj = {}
  qsObj[qsList[0]] = qsList[1]
  return qsObj
}

module.exports = parse
