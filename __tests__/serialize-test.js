'use strict'
jest.autoMockOff()
const serialize = require('../libs/serialize')

let debugStore = []
const debug = (label, arg) => {
  debugStore.push([label, arg])
}

describe('serialize', () => {
  beforeEach(() => {
    debugStore = []
  })

  it('skips empty input', () => {
    const given = {}
    const expectedReturn = ''
    const expectedDebug = []

    const actual = serialize(given, debug)
    expect(actual).toEqual(expectedReturn)
    expect(debugStore).toEqual(expectedDebug)
  })

})
