// 'a[b][c]' -> ['a', 'b', 'c']
export const parseKey = (key) => {
  return key.replace(/]/g, '').split('[')
}

// ([], [['a', 'b'], 'c']) -> [['a', [['b', 'c']]]]
// ([['a', [['b', 'c']]]], [['a, 'e'], f])
//   -> [['a', [ ['b','c'], ['e','f'] ]]]
const appendNestedValue = (listOfPairs = [], [fieldPath, fieldValue]) => {
  let [head, ...rest] = fieldPath
  const indexOfHead = listOfPairs.findIndex(([key, valOrListOfPairs]) => {
    return key === head
  })

  if (indexOfHead > -1) {
    // head of path already in list, concat our new pair
    const [head, valOrlistOfPairs] = listOfPairs[indexOfHead]

    if (rest.length === 0) {
      // have final value, concat this pair
      return listOfPairs.concat([[head, fieldValue]])
    }


    if (Array.isArray(valOrlistOfPairs)) {
      listOfPairs[indexOfHead] = [head, appendNestedValue(valOrlistOfPairs, [rest, fieldValue])]
      return listOfPairs
    } else {
      const val = valOrlistOfPairs  // << is this relevant?
      return listOfPairs.concat([[head, appendNestedValue([], [rest, fieldValue])]])
    }
  } else {
    // head of path not in list, concat to parent list
    if (rest.length === 0) {
      // we are at bottom level so add pair
      return listOfPairs.concat([[head, fieldValue]])
    } else {
      // append the next nested pair
      return listOfPairs.concat([[head, appendNestedValue([], [rest, fieldValue])]])
    }
  }
}

const pairListToObject = (pairList) => {
  return pairList.reduce((memo, [fieldKey, fieldValue]) => {
    if (Array.isArray(fieldValue)) {
      memo[fieldKey] = pairListToObject(fieldValue)
    } else {
      memo[fieldKey] = fieldValue
    }
    return memo
  }, {})
}

const pairListToObjectIterative = (pairList) => {
  return pairList.reduce((memo, [path, value]) => {
    let nested = memo

    path.forEach((key, i) => {
      if (i === path.length - 1) {
        // Save/overwrite value when at the end of the path
        nested[key] = value
      } else {
        // Get existing value or create new object at this key
        nested[key] = nested[key] || {}
      }
      // Save reference to the value at this key for next iteration
      nested = nested[key]
    })

    return memo
  }, {})
}

const objectToPairs = (obj) => {
  let pairs = []
  for(let key in obj) {
    pairs = typeof obj[key] === 'object'
      ? pairs.concat([[key, objectToPairs(obj[key])]])
      : pairs.concat([[key, obj[key]]])
  }
  return pairs
}

// ([], ['a', 'b'], []) -> [[['a'], 'b']]
// ([], ['a', [['b','c']]], []) -> [[['a', 'b'], 'c']]
//    ([], ['b','c'], ['a']) -> [[['a','b'], 'c']]

const nestedToFlatPairs = (flatPairs = [], [fieldKey, valOrListOfPairs], _index, _arr, path = []) => {
    if (Array.isArray(valOrListOfPairs)) {
      const listOfPairs = valOrListOfPairs
      let [head, ...rest] = listOfPairs

      flatPairs = flatPairs.concat(nestedToFlatPairs([], head, _index, _arr, path.concat([fieldKey])))

      return rest.length === 0
        ? flatPairs
        : flatPairs.concat(nestedToFlatPairs([], [fieldKey, rest], _index, _arr, path))
    } else {
      const val = valOrListOfPairs
      return flatPairs.concat([[path.concat([fieldKey]), val]])
    }
}

const arrayPathToString = (arrayPath) => {
  return arrayPath.length === 1
    ? arrayPath[0].toString()
    : arrayPath.join('][').replace(/]/, '') + ']'
}

const splitPair = (pair) => {
  if (pair.match(/^(\w+)$/)) {
    return [pair, '']
  } else {
    const match = pair.match(/^([^\[]+|.+\[.+\])=(.+)$/)
    return match.slice(1,3)

  }
}

module.exports = {
  parseKey: parseKey,
  appendNestedValue: appendNestedValue,
  pairListToObject: pairListToObject,
  pairListToObjectIterative: pairListToObjectIterative,
  objectToPairs: objectToPairs,
  nestedToFlatPairs: nestedToFlatPairs,
  arrayPathToString: arrayPathToString,
  splitPair: splitPair
}
