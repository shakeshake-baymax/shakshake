import { SocialMedia } from "./concat";
import StringUtility from "./Utilities/StringUtility";

class Verified {
  verifiedLink(link: string, title: SocialMedia) {
    switch (title) {
      case SocialMedia.EMAIL: {
        return Promise.resolve(StringUtility.isEmail(link));
      }
    }
    return Promise.resolve(true);
  }
}

const verified = new Verified();

export default verified;
