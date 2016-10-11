/**
 * 判断对象或者数组是否为空
 * @param  {Object} value Object or Array
 * @return {Boolean}       true or false
 */
export const isEmpty = (value) => {
  return value === undefined || value === null || (Array.isArray(value) && value.length === 0) || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);
}
