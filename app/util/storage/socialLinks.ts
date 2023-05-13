import { AppStorage } from ".";
import { StorageKey } from "./keys";

type SocialMediaData = {
  facebook?: string;
  snapchat?: string;
  tiktok?: string;
  instagram?: string;
  twitter?: string;
  linkedIn?: string;
  phoneNumber?: string;
  discord?: string;
  email?: string;
};

class SocialLinksStorage {
  storage: AppStorage;
  constructor() {
    this.storage = new AppStorage();
  }
  set(data: SocialMediaData) {
    return this.storage.setItem(StorageKey.SOCIAL_LINKS, JSON.stringify(data));
  }
  get() {
    return this.storage.getItem(StorageKey.SOCIAL_LINKS);
  }
}

const socialLinksStorage = new SocialLinksStorage();

export default socialLinksStorage;
