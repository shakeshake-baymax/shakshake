import {Profile, SocialMedia} from './types';
import {ImageSourcePropType} from 'react-native';

export interface SMModel {
  isExposed: boolean;
  link: string | null;
  smName: SocialMedia;
  logo: ImageSourcePropType;
}

export interface SocialMediaLinks {
  facebook: SMModel;
  instagram: SMModel;
  snapchat: SMModel;
  twitter: SMModel;
  discord: SMModel;
  linkedin: SMModel;
  tiktok: SMModel;
  email: SMModel;
  phone_number: SMModel;
}

export interface User {
  readonly token: string;
  readonly id: string;
  userName: string;
  phoneNumber: string;
  profile: Profile;
  socialMediaLinks: SocialMediaLinks;
  isNewUser: boolean;
  confirmed?: boolean;
  beConfirmed?: boolean;
}
