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
  it('handles un-nested', () => {
    const listOfPairs = []
    const flatPair = [['a'], 'b']
    const actual = Utils.appendNestedValue(listOfPairs, flatPair)
    const expected = [['a', 'b']]

    expect(actual).toEqual(expected)
  })

  it('adds a new single pair', () => {
    const given = [['a', 'b'], 'c']
    const actual = Utils.appendNestedValue([], given)
    const expected = [['a', [['b', 'c']]]]

    expect(actual).toEqual(expected)
  })

  it('adds to listOfPairs for existing head', () => {
    const listOfPairs = [['a', [['b', 'c']]]]
    const flatPair = [['a', 'e'], 'f']
    const actual = Utils.appendNestedValue(listOfPairs, flatPair)
    const expected = [['a', [ ['b','c'], ['e','f'] ]]]

    expect(actual).toEqual(expected)
  })

  it('adds deep nested pairs to listOfPairs for new head', () => {
    const listOfPairs = []
    const flatPair = [['a', 'b', 'c'], 'd']
    const actual = Utils.appendNestedValue(listOfPairs, flatPair)
    const expected = [['a', [['b',[['c', 'd']]]]]]

    expect(actual).toEqual(expected)
  })

  it('adds deep nested pairs to listOfPairs to existing head', () => {
    const listOfPairs = [['a', [['b',[['c', 'd']]]]]]
    const flatPair = [['a', 'b', 'g'], 'h']
    const actual = Utils.appendNestedValue(listOfPairs, flatPair)
    const expected = [['a', [['b',[['c', 'd'], ['g', 'h']]]]]]

    expect(actual).toEqual(expected)
  })

  it('doesnt replace existing keys', () => {
    const listOfPairs = [['a', [['b', 'c']]]]
    const flatPair = [['a', 'b'], 'f']
    const actual = Utils.appendNestedValue(listOfPairs, flatPair)
    const expected = [['a', [['b','c'], ['b', 'f']]]]

    expect(actual).toEqual(expected)
  })
})

describe('pairListToObject', () => {
  it('single un-nested', () => {
    const given = [['a', 'b']]
    const actual = Utils.pairListToObject(given)
    const expected = {a: 'b'}

    expect(actual).toEqual(expected)
  })

  it('multiple un-nested', () => {
    const given = [['a', 'b'], ['c', 'd']]
    const actual = Utils.pairListToObject(given)
    const expected = {a: 'b', c: 'd'}

    expect(actual).toEqual(expected)
  })

  it('single nested', () => {
    const given = [['a', [['b', 'c']]]]
    const actual = Utils.pairListToObject(given)
    const expected = {a: {b: 'c'}}

    expect(actual).toEqual(expected)
  })

  it('multiple nested pairs', () => {
    const given = [['a', [['b', 'c'], ['d', 'e']]]]
    const actual = Utils.pairListToObject(given)
    const expected = {a: {b: 'c', d: 'e'}}

    expect(actual).toEqual(expected)
  })

  it('multiple nested top level pairs', () => {
    const given = [['a', [['b', 'c']]], ['b', [['f','g']]]]
    const actual = Utils.pairListToObject(given)
    const expected = {a: {b: 'c'}, b: {f: 'g'}}

    expect(actual).toEqual(expected)
  })

  it('multiple deep nested', () => {
    const given = [['a', [['b', [['c', 'd']]]]]]
    const actual = Utils.pairListToObject(given)
    const expected = {a: {b: {c: 'd'}}}

    expect(actual).toEqual(expected)
  })
})
