import {ImageSourcePropType} from 'react-native';
import {SocialMedia} from '../utilities/constants';
export interface Profile {
  description: string;
  avatarImageUrl: string;
  coverImageUrl: string;
}
export type SocialMediaLink = {
  url: string;
  type: SocialMedia;
  logo: ImageSourcePropType;
};
export type NearByUser = {
  name: string;
  id: string;
  bio: string;
  photoURL: string;
  links: SocialMediaLink[];
  confirmed: boolean;
  beConfirmed: boolean;
};
export interface Contact {
  id: string;
  userName: string;
  profile: Profile;
  socialMediaLinks: SocialMediaLink[];
  permissionToThisContact: string[];
}
interface ImageInterface {
  filename: string | null;
  extension: string | null;
  uri: string;
  height: number;
  width: number;
  fileSize: number | null;
  playableDuration: number;
}
export interface ImageNode {
  type: string;
  group_name: string;
  image: ImageInterface;
  timestamp: number;
  location: {} | null;
}
export {SocialMedia};
