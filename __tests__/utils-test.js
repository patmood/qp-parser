'use strict'
jest.autoMockOff()

const Utils = require('../libs/utils')

describe('parseKey', () => {
  it('returns single item list', () => {
    const given = 'a'
    const actual = Utils.parseKey(given)
    const expected = ['a']
    expect(actual).toEqual(expected)
  })

  it('returns a list of nested keys', () => {
    const given = 'a[b]'
    const actual = Utils.parseKey(given)
    const expected = ['a', 'b']
    expect(actual).toEqual(expected)
  })

  it('returns a path list of multiple nested keys', () => {
    const given = 'a[b][c][d]'
    const actual = Utils.parseKey(given)
    const expected = ['a', 'b', 'c', 'd']
    expect(actual).toEqual(expected)
  })
})

describe('appendNestedValue', () => {
  // ([], [['a'], 'b']) -> [['a', [['b']]]]
  it('handles un-nested', () => {
    const listOfPairs = []
    const flatPair = [['a'], 'b']
    const actual = Utils.appendNestedValue(listOfPairs, flatPair)
    const expected = [['a', 'b']]

    expect(actual).toEqual(expected)
  })

  // ([], [['a', 'b'], 'c']) -> [['a', [['b', 'c']]]]
  it('adds a new single pair', () => {
    const given = [['a', 'b'], 'c']
    const actual = Utils.appendNestedValue([], given)
    const expected = [['a', [['b', 'c']]]]

    expect(actual).toEqual(expected)
  })

  // ([['a', [['b', 'c']]]], [['a, 'e'], f]) -> [['a', [ ['b','c'], ['e','f'] ]]]
  it('adds to listOfPairs for existing head', () => {
    const listOfPairs = [['a', [['b', 'c']]]]
    const flatPair = [['a', 'e'], 'f']
    const actual = Utils.appendNestedValue(listOfPairs, flatPair)
    const expected = [['a', [ ['b','c'], ['e','f'] ]]]

    expect(actual).toEqual(expected)
  })
})
