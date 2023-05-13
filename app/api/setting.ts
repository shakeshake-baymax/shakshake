import axios from "axios";
import { Platform } from "react-native";
import { useAuth } from "../hook/useAuth";
import userStorage from "../util/storage/user";
import { createUser } from "../util/user";
import { CustomRequest } from "./models/CustomRequest";
import { HttpHeader } from "./models/HttpHeader";
import { User } from "./models/User";
import { APIMethods, ContentType } from "./type";

class SettingsRequest {
  // 修改用户信息
  async updateProfile(username: string, description: string, token: string) {
    const data = new FormData();
    data.append("username", username);
    data.append("introduction", description);
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
  // 修改背景图像
  async uploadImages(type: "cover" | "avatar", url: string, token: string) {
    const body = new FormData();
    body.append("file", {
      name: "test.jpg",
      type: "image/jpg",
      uri: Platform.OS == "android" ? url : url.replace("file://", ""),
    });
    const config = {
      headers: {
        "Content-Type": ContentType.MULTI_FORM_DATA,
        authorization: `Bearer ${token}`,
      },
    };
    const baseURL = "https://api.shakeshake.app/user/";
    const response = await axios.post(
      `${baseURL}${type === "cover" ? "uploadCoverImage" : "uploadAvatar"}`,
      body,
      config
    );
    return response;
  }
}

const settingRequest = new SettingsRequest();

export default settingRequest;
