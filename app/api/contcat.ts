import { CustomRequest } from "./models/CustomRequest";
import { HttpHeader } from "./models/HttpHeader";
import { Contact, SocialMediaLink } from "./models/types";
import { APIMethods, ContentType } from "./type";
import axios from "axios";

function convertToContacts(list: any[]): Contact[] {
  list.sort((a, b) => {
    return b.update_at - a.update_at;
  });
  return list.map((friend) => {
    let tempList: SocialMediaLink[] = [];
    // if (friend.Links) {
    //   for (const [smType, smUrl] of Object.entries(friend.Links)) {
    //     const socialMedia: SocialMediaLink = smLinkGenerate(
    //       typeof smUrl === "string" ? smUrl : "",
    //       smType
    //     );
    //     tempList.push(socialMedia);
    //   }
    // }
    const contact: Contact = {
      id: friend.ID,
      userName: friend.Username,
      profile: {
        avatarImageUrl: friend.Profile.Avatar,
        description: friend.Profile.Introduction,
        coverImageUrl: friend.Profile.CoverImage,
      },
      socialMediaLinks: tempList,
      permissionToThisContact: friend.PermissionToThisUser,
    };
    return contact;
  });
}
class ContcatRequest {
  // 请求连接
  async getContactList(token) {
    const config = {
      headers: {
        "Content-Type": ContentType.MULTI_FORM_DATA,
        authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      "https://api.shakeshake.app/user/getFriendsList",
      config
    );
    if (response.status === 200) {
      return response.data.friends_list;
    } else {
      return [];
    }
  }
  async deleteContact(otherUserID: string, token: string) {
    let data = new FormData();
    data.append("other_id", otherUserID);
    const config = {
      headers: {
        "Content-Type": ContentType.MULTI_FORM_DATA,
        authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      "https://api.shakeshake.app/user/deleteFromContacts",
      data,
      config
    );
    return response;
  }
}

const contcatRequest = new ContcatRequest();

export default contcatRequest;
