namespace ObjectUtility {
  // 替换当前对象的某个属性
  export function modifyObjectProperty(obj, key, value) {
    if (!obj || !key) {
      return obj;
    }

    const newObj = { ...obj };
    const keys = Array.isArray(key) ? key : key.split(".");
    let prop = keys.shift();

    if (keys.length === 0) {
      newObj[prop] = value;
      return newObj;
    }

    if (!newObj.hasOwnProperty(prop)) {
      return newObj;
    }

    if (typeof newObj[prop] !== "object" || newObj[prop] === null) {
      return newObj;
    }

    newObj[prop] = modifyObjectProperty(newObj[prop], keys, value);
    return newObj;
  }
}
export default ObjectUtility;
