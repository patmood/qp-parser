'use strict'

// 'a[b][c]' -> ['a', 'b', 'c']
const parseKey = (key) => {
  return key.replace(/]/g, '').split('[')
}

// ([], [['a', 'b'], 'c']) -> [['a', [['b', 'c']]]]
// ([['a', [['b', 'c']]]], [['a, 'e'], f])
//   -> [['a', [ ['b','c'], ['e','f'] ]]]
const flatToNestedPairs = (listOfPairs = [], [fieldPath, fieldValue]) => {
  let [head, ...rest] = fieldPath
  const indexOfHead = listOfPairs.findIndex(([key, valOrListOfPairs]) => {
    return key === head
  })

  if (indexOfHead > -1) {
    // head of path already in list, concat to its valOrlistOfPairs
    const exist = listOfPairs[indexOfHead]
    rest.push(fieldValue)
    listOfPairs[indexOfHead] = [exist[0], exist[1].concat([rest])]

    return listOfPairs
  } else {
    // head of path not in list, concat to parent list
    rest.push(fieldValue)
    return listOfPairs.concat([head, [rest]])
  }

}

module.exports = {
  parseKey: parseKey,
  flatToNestedPairs: flatToNestedPairs
}
