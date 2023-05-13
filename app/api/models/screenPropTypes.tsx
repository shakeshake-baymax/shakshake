import {ClickedArea} from '@/src/screens/userInfo/EditProfileScreen';
import {Screens} from '../utilities/constants';
import {Contact} from './types';
import {StackScreenProps} from '@react-navigation/stack';

export type ContactsStackParamList = {
  ContactsList: undefined;
  EditProfile: {selectedPhoto?: string};
  Settings: undefined;
  EditLinks: undefined;
  UsernameSetup: undefined;
  SelectPhoto: {clickedArea?: ClickedArea; onDone: (uri: string) => void};
  ContactInfo: {user?: Contact};
  EditingPhoto: any;
};
export type SelectPhotoScreenProps = StackScreenProps<
  ContactsStackParamList,
  Screens.SELECT_PHOTO
>;
export type ContactInfoScreenProps = StackScreenProps<
  ContactsStackParamList,
  Screens.CONTACT_INFO
>;
export type EditProfileScreenProps = StackScreenProps<
  ContactsStackParamList,
  Screens.EDIT_PROFILE
>;
export type ContactListScreenProps = StackScreenProps<
  ContactsStackParamList,
  Screens.CONTACT_LIST
>;
export type EditLinksScreenProps = StackScreenProps<
  ContactsStackParamList,
  Screens.EDIT_LINKS
>;
