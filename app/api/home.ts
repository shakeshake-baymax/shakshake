import axios from "axios";
import { CustomRequest } from "./models/CustomRequest";
import { HttpHeader } from "./models/HttpHeader";
import { APIMethods, ContentType } from "./type";

class HomeRequest {
  // 请求连接
  async getTempPageUrl(links: string[], token) {
    const config = {
      headers: {
        "Content-Type": ContentType.MULTI_FORM_DATA,
        authorization: `Bearer ${token}`,
      },
    };
    let data = new FormData();
    links.forEach((value) => {
      const socialMedia = value.toLocaleLowerCase();
      data.append("permission", socialMedia);
    });
    const response = await axios.post(
      "https://api.shakeshake.app/user/tempHomePage",
      data,
      config
    );
    return response;
  }
}

const homeRequest = new HomeRequest();

export default homeRequest;
