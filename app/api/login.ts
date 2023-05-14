import axios from "axios";
import userStorage from "../util/storage/user";
import { createUser } from "../util/user";
import { CustomRequest } from "./models/CustomRequest";
import { HttpHeader } from "./models/HttpHeader";
import { User } from "./models/User";
import { APIMethods, ContentType } from "./type";
// interface LoginRequestAPI {
//   sendSMSCode: (phoneNumber: string, countryCode: string) => void;
//   authenticateWithSMS: (
//     phoneNumber: string,
//     authCode: string,
//     areaCode: string
//   ) => { user: User } | { error: {} };
//   newUserSetName: (username: string, token: string) => void;
// }
class LoginRequest {
  // 发送短信
  async sendSMSCode(phoneNumber: string, countryCode: string) {
    const url = `https://api.shakeshake.app/user/sendCode?phone_number=${phoneNumber}&area_code=${countryCode}`;
    const res = await axios.get(url);
    return res.data;
  }
  // 验证短信
  async authenticateWithSMS(
    phoneNumber: string,
    authCode: string,
    areaCode: string
  ) {
    let data = new FormData();
    data.append("phone_number", phoneNumber);
    data.append("authcode", authCode);
    data.append("area_code", areaCode);

    const config = {
      headers: {
        "Content-Type": ContentType.MULTI_FORM_DATA,
      },
    };
    try {
      const response = await axios.post(
        "https://api.shakeshake.app/user/loginOrRegister",
        data,
        config
      );
      if (response.data.token) {
        const user: User = createUser(response.data);
        userStorage.set(user);
        return { user: user };
      } else {
        return { error: {} };
      }
    } catch (error) {
      return { error: {} };
    }
  }
  async newUserSetNameFinished(token: string) {
    let data = new FormData();
    const config = {
      headers: {
        "Content-Type": ContentType.MULTI_FORM_DATA,
        authorization: `Bearer ${token}`,
      },
    };
    const response = await axios
      .post("https://api.shakeshake.app/user/finishGuide", data, config)
      .catch(function (error) {
        console.log(
          "There has been a problem with your fetch operation: " + error
        );
      });
    return response;
  }
  // 更新用户名
  async newUserSetName(username: string, token: string) {
    const data = new FormData();
    data.append("username", username);
    data.append("introduction", "");
    const config = {
      headers: {
        "Content-Type": ContentType.MULTI_FORM_DATA,
        authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      "https://api.shakeshake.app/user/setProfile",
      data,
      config
    );
    return response;
  }
  // 更新社交链接
  async updateSMLinks(data, token) {
    const body = new FormData();
    const links = {
      facebook: data.facebook?.link || "",
      discord: data.discord?.link || "",
      snapchat: data.snapchat?.link || "",
      twitter: data.twitter?.link || "",
      tiktok: data.tiktok?.link || "",
      instagram: data.instagram?.link || "",
      linkedIn: data.linkedIn?.link || "",
      email: data.email?.link || "",
    };
    body.append("data", JSON.stringify(links));
    console.log(body, token);
    const config = {
      headers: {
        "Content-Type": ContentType.MULTI_FORM_DATA,
        authorization: `Bearer ${token}`,
      },
    };
    const httpHeader = new HttpHeader(ContentType.MULTI_FORM_DATA, token);
    const request = new CustomRequest(APIMethods.POST, httpHeader, body);
    console.log(request);

    const response = await axios.post(
      "https://api.shakeshake.app/user/setLinks",
      body,
      config
    );
    return response;
  }
}

const loginRequest = new LoginRequest();

export default loginRequest;
