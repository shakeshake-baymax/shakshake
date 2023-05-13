namespace StringUtility {
  export function toLowerCase(str: string) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      // 如果字符是大写字母，则将其转换为小写字母并添加到结果字符串中
      if (code >= 65 && code <= 90) {
        result += String.fromCharCode(code + 32);
      } else {
        result += str.charAt(i);
      }
    }
    return result;
  }
}

export default StringUtility;
