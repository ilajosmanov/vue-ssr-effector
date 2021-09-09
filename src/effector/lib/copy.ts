// @ts-nocheck
function find(list, f) {
  return list.filter(f)[0]
}

export function copy<T>(obj, cache = []): T {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  let hit = find(cache, (c) => c.original === obj)
  if (hit) {
    return hit.copy
  }

  let _copy = Array.isArray(obj) ? [] : {}
  cache.push({
    original: obj,
    copy: _copy,
  })

  Object.keys(obj).forEach((key) => {
    _copy[key] = deepCopy(obj[key], cache)
  })

  return _copy
}
