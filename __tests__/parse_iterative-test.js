/* global jest, it, expect, describe */
jest.autoMockOff()
const parseIterative = require('../libs/parse_iterative')

let debugStore = []
const debug = (label, arg) => {
  debugStore.push([label, arg])
}

describe('parseIterative', () => {
  beforeEach(() => {
    debugStore = []
  })

  it('skips empty input', () => {
    const given = ''
    const expectedReturn = {}
    const expectedDebug = []

    const actual = parseIterative(given, debug)
    expect(actual).toEqual(expectedReturn)
    expect(debugStore).toEqual(expectedDebug)
  })

  it('single un-nested pair', () => {
    const given = 'a=b'
    const expectedReturn = {a: 'b'}
    const expectedDebug = [
      ['delimited pairs', ['a=b']],
      ['split pairs', [['a','b']] ],
      ['parse keys', [[['a'],'b']] ],
    ]

    const actual = parseIterative(given, debug)
    expect(actual).toEqual(expectedReturn)
    expect(debugStore).toEqual(expectedDebug)
  })

  it('multiple un-nested pair', () => {
    const given = 'a=b&c=d'
    const expectedReturn = {a: 'b', c: 'd'}
    const expectedDebug = [
      ['delimited pairs', ['a=b', 'c=d'] ],
      ['split pairs', [['a','b'], ['c', 'd']] ],
      ['parse keys', [[['a'],'b'], [['c'], 'd']] ],
    ]

    const actual = parseIterative(given, debug)
    expect(actual).toEqual(expectedReturn)
    expect(debugStore).toEqual(expectedDebug)
  })

  it('single nested pair', () => {
    const given = 'a[b]=c'
    const expectedReturn = {a: {b: 'c'}}
    const expectedDebug = [
      ['delimited pairs', ['a[b]=c'] ],
      ['split pairs', [['a[b]','c']] ],
      ['parse keys', [[['a','b'], 'c']] ],
    ]

    const actual = parseIterative(given, debug)
    expect(actual).toEqual(expectedReturn)
    expect(debugStore).toEqual(expectedDebug)
  })

  it('deep nested pair', () => {
    const given = 'a[b][c]=d'
    const expectedReturn = {a: {b: {c: 'd'}}}
    const expectedDebug = [
      ['delimited pairs', ['a[b][c]=d'] ],
      ['split pairs', [['a[b][c]','d']] ],
      ['parse keys', [[['a','b', 'c'], 'd']] ],
    ]

    const actual = parseIterative(given, debug)
    expect(actual).toEqual(expectedReturn)
    expect(debugStore).toEqual(expectedDebug)
  })

  it('multiple deep nested coliding pairs', () => {
    const given = 'a[b][c]=d&a[b]=x'
    const expectedReturn = {a: {b: 'x'}}
    const expectedDebug = [
      ['delimited pairs', ['a[b][c]=d', 'a[b]=x'] ],
      ['split pairs', [['a[b][c]','d'], ['a[b]', 'x']] ],
      ['parse keys', [[['a','b', 'c'], 'd'], [['a', 'b'], 'x']] ],
    ]

    const actual = parseIterative(given, debug)
    expect(actual).toEqual(expectedReturn)
    expect(debugStore).toEqual(expectedDebug)
  })

})
