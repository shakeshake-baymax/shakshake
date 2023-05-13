import {
  DISCORD_LOGO,
  EMAIL_LOGO,
  FACEBOOK_LOGO,
  INSTAGRAM_LOGO,
  LINKEDIN_LOGO,
  PHONE_LOGO,
  SNAPCHAT_LOGO,
  TIKTOK_LOGO,
  TWITTER_LOGO,
} from "../../assets/single_color_logo";
import { User } from "../api/models/User";
import { SocialMedia } from "./concat";

export function createUser(obj: any): User {
  return {
    token: obj.token,
    userName: obj.user.Username,
    id: obj.user.ID,
    phoneNumber: obj.user.PhoneNumber,
    isNewUser: obj.is_new_user,
    profile: {
      description: obj.user.Profile.Introduction,
      avatarImageUrl: obj.user.Profile.Avatar,
      coverImageUrl: obj.user.Profile.CoverImage,
    },
    socialMediaLinks: {
      facebook: {
        isExposed: false,
        link: obj.user.Links.facebook !== "" ? obj.user.Links.facebook : null,
        smName: SocialMedia.FACEBOOK,
        logo: FACEBOOK_LOGO,
      },
      email: {
        isExposed: false,
        link: obj.user.Links.email !== "" ? obj.user.Links.email : null,
        smName: SocialMedia.EMAIL,
        logo: EMAIL_LOGO,
      },
      instagram: {
        isExposed: false,
        link: obj.user.Links.instagram !== "" ? obj.user.Links.instagram : null,
        smName: SocialMedia.INSTAGRAM,
        logo: INSTAGRAM_LOGO,
      },
      twitter: {
        isExposed: false,
        link: obj.user.Links.twitter !== "" ? obj.user.Links.twitter : null,
        smName: SocialMedia.TWITTER,
        logo: TWITTER_LOGO,
      },
      linkedin: {
        isExposed: false,
        link: obj.user.Links.linkedin !== "" ? obj.user.Links.linkedin : null,
        smName: SocialMedia.LINKEDIN,
        logo: LINKEDIN_LOGO,
      },
      snapchat: {
        isExposed: false,
        link: obj.user.Links.snapchat !== "" ? obj.user.Links.snapchat : null,
        smName: SocialMedia.SNAPCHAT,
        logo: SNAPCHAT_LOGO,
      },
      tiktok: {
        isExposed: false,
        link: obj.user.Links.tiktok !== "" ? obj.user.Links.tiktok : null,
        smName: SocialMedia.TIKTOK,
        logo: TIKTOK_LOGO,
      },
      phone_number: {
        isExposed: true,
        link: obj.user.PhoneNumber,
        smName: SocialMedia.PHONE_NUMBER,
        logo: PHONE_LOGO,
      },
      discord: {
        isExposed: false,
        link: obj.user.Links.discord !== "" ? obj.user.Links.discord : null,
        smName: SocialMedia.DISCORD,
        logo: DISCORD_LOGO,
      },
    },
  };
}
