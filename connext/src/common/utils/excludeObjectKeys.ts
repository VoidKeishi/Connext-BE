const excludeObjectKeys = (obj, excludeKeys: string[]) => {
  let newObj = {}
  Object.keys(obj).forEach((key) => { 
    if (!excludeKeys.includes(key)) {
      newObj[key] = obj[key]
    }
  })

  return newObj
}

export default excludeObjectKeys
