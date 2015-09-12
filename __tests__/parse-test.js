'use strict'
jest.autoMockOff()
const parse = require('../libs/parse')

let debugStore = []
const debug = (label, arg) => {
  debugStore.push([label, arg])
}

describe('parse', () => {
  beforeEach(() => {
    debugStore = []
  })

  it('skips empty input', () => {
    const given = ''
    const expectedReturn = {}
    const expectedDebug = []

    const actual = parse(given, debug)
    expect(actual).toEqual(expectedReturn)
    expect(debugStore).toEqual(expectedDebug)
  })

  it('single un-nested pair', () => {
    const given = 'a=b'
    const expectedReturn = {a: 'b'}
    const expectedDebug = [
      ['delimited pairs', ['a=b']]
    ]

    const actual = parse(given, debug)
    expect(actual).toEqual(expectedReturn)
    expect(debugStore).toEqual(expectedDebug)
  })
})
