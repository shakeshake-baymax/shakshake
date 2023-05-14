import { phoneRegex } from "./phoneRegx";

namespace NumberUtility {
  export function validatePhoneNumber(countryCodeStr, phoneNumber) {
    // 检查国家代码是否有效
    if (!(countryCodeStr in phoneRegex)) {
      return false;
    }
    // 转换国家代码为正式格式
    const countryCode = countryCodeStr.toUpperCase();
    // 删除手机号中的空格、括号和破折号等分隔符
    const cleanedNumber = phoneNumber.replace(/[\s()\-]+/g, "");
    // 使用正则表达式检查手机号是否匹配
    if (!phoneRegex[countryCode].test(cleanedNumber)) {
      return false;
    }
    return true;
  }
}
export default NumberUtility;
