// 所有国家手机号对应的正则
export const phoneRegex = {
  "1": /^(\+1|1)?([2-9][0-9]{2})\)?([2-9][0-9]{2})([0-9]{4})$/,
  "86": /^(\+86|86)?1[3456789]\d{9}$/,
  "81": /^(\+81|81)?[789]0\d{8}$/,
  // 其他国家的正则表达式...
};