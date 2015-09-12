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
