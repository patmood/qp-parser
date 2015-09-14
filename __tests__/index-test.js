/* global jest, it, expect, describe */

jest.autoMockOff()

const QS = require('../libs/index')

describe('integration', () => {
  it('roundtrip un-nested pair', () => {
    const given = 'a=b'
    const actual = QS.serialize(QS.parse(given))
    const expected = given
    expect(actual).toEqual(expected)
  })

  it('roundtrip multiple un-nested pair', () => {
    const given = 'a=b&b=c'
    const actual = QS.serialize(QS.parse(given))
    const expected = given
    expect(actual).toEqual(expected)
  })

  it('roundtrip multiple nested pair', () => {
    const given = 'a[b]=b&b[g][w]=c'
    const actual = QS.serialize(QS.parse(given))
    const expected = given
    expect(actual).toEqual(expected)
  })

})
