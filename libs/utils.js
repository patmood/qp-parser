'use strict'

module.exports = {
  parseKey: (key) => {
    return key.replace(/]/g, '').split('[')
  }
}
