jest.dontMock('../libs/parse');

describe('parse', function() {
  it('does anything', function() {
    const parse = require('../libs/parse')
    expect(parse(4)).toBe(3)
  })
})
