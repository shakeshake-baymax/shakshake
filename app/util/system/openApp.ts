import { Linking } from "react-native";
import { SocialMedia } from "../concat";
import StringUtility from "../Utilities/StringUtility";

// const getFackbookID = async (username: string) => {
//   try {
//     const response = await fetch(
//       `https://graph.facebook.com/${username}?fields=id&access_token=${YOUR_ACCESS_TOKEN}`
//     );
//     const data = await response.json();
//     return data.id;
//   } catch (err) {
//     console.error("An error occurred", err);
//   }
// };

export const openSocialMediaApp = (
  socialMedia: SocialMedia,
  username: string
) => {
  const social = StringUtility.toLowerCase(socialMedia);
  let appUrl;
  let webUrl;
  switch (social) {
    case "facebook":
      appUrl = `fb://profile?id=${username}`;
      webUrl = `https://www.facebook.com/profile.php?id=${username}`;
      break;
    case "snapchat":
      appUrl = `snapchat://add/${username}`;
      webUrl = `https://www.snapchat.com/add/${username}`;
      break;
    case "tiktok":
      appUrl = `tiktok://user/${username}`;
      webUrl = `https://www.tiktok.com/@${username}`;
      break;
    case "instagram":
      appUrl = `instagram://user?username=${username}`;
      webUrl = `https://www.instagram.com/${username}`;
      break;
    case "twitter":
      appUrl = `twitter://user?screen_name=${username}`;
      webUrl = `https://www.twitter.com/${username}`;
      break;
    case "linkedin":
      appUrl = `linkedin://profile/${username}`;
      webUrl = `https://www.linkedin.com/in/${username}/`;
      break;
    case "discord":
      appUrl = `discord://users/${username}`;
      webUrl = `https://discord.com/users/${username}`;
      break;
    default:
      console.log(`Unsupported social media: ${socialMedia}`);
      return;
  }
  Linking.canOpenURL(appUrl)
    .then((supported) => {
      if (supported) {
        Linking.openURL(appUrl);
      } else {
        Linking.openURL(webUrl);
      }
    })
    .catch((err) => console.error("An error occurred", err));
};
