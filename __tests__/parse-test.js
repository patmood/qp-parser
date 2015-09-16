/* global jest, it, expect, describe */

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
      ['delimited pairs', ['a=b']],
      ['split pairs', [['a','b']] ],
      ['parse keys', [[['a'],'b']] ],
      ['flat to nested', [['a','b']] ]
    ]

    const actual = parse(given, debug)
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
      ['flat to nested', [['a','b'], ['c','d']] ]
    ]

    const actual = parse(given, debug)
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
      ['flat to nested', [['a', [['b', 'c']]]] ]
    ]

    const actual = parse(given, debug)
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
      ['flat to nested', [['a', [['b', [['c', 'd']]]]]] ]
    ]

    const actual = parse(given, debug)
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
      ['flat to nested', [['a', [['b', [['c', 'd']]], ['b', 'x']]]] ]
    ]

    const actual = parse(given, debug)
    expect(actual).toEqual(expectedReturn)
    expect(debugStore).toEqual(expectedDebug)
  })

  it('number key pair', () => {
    const given = '0=foo'
    const expectedReturn = {'0': 'foo'}

    const actual = parse(given)
    expect(actual).toEqual(expectedReturn)
  })

  it('values with + symbols', () => {
    const given = 'foo=c++'
    const expectedReturn = {'foo': 'c  '}

    const actual = parse(given)
    expect(actual).toEqual(expectedReturn)
  })

  it('encoded = symbols', () => {
    const given = 'he%3Dllo=th%3Dere'
    const expectedReturn = { 'he=llo': 'th=ere' }

    const actual = parse(given)
    expect(actual).toEqual(expectedReturn)
  })

  it('un encoded symbols', () => {
    const given = 'a[>=]=23'
    const expectedReturn = { a: { '>=': '23' }}

    const actual = parse(given)
    expect(actual).toEqual(expectedReturn)
  })

  it('equal sign in value', () => {
    const given = 'a[<=>]==23'
    const expectedReturn = { a: { '<=>': '=23' }}
    const actual = parse(given)
    expect(actual).toEqual(expectedReturn)
  })

  it('unencoded equal in nested key', () => {
    const given = 'a[==]=23'
    const expectedReturn = { a: { '==': '23' }}
    const actual = parse(given)
    expect(actual).toEqual(expectedReturn)
  })

  it('single key no value', () => {
    const given = 'foo'
    const expectedReturn = { foo: ''}
    const actual = parse(given)
    expect(actual).toEqual(expectedReturn)
  })

  it('simple key value', () => {
    const given = 'foo=bar'
    const expectedReturn = { foo: 'bar'}
    const actual = parse(given)
    expect(actual).toEqual(expectedReturn)
  })

  it('split on first equal unless in bracket', () => {
    const given = 'foo=bar=baz'
    const expectedReturn = { foo: 'bar=baz'}
    const actual = parse(given)
    expect(actual).toEqual(expectedReturn)
  })

})


// ​
// ​
// 'foo=bar&bar=baz' -> { foo: 'bar', bar: 'baz' });
// ​
// 'foo=bar&baz' -> { foo: 'bar', baz: '' });
// ​
// 'cht=p3&chd=t:60,40&chs=250x100&chl=Hello|World' -> {
//       cht: 'p3'
//     , chd: 't:60,40'
//     , chs: '250x100'
//     , chl: 'Hello|World'
//   }
// ^^ all valid, not escaped
