import { AppStorage } from ".";
import { StorageKey } from "./keys";

type LinksState = {
  facebook?: boolean;
  snapchat?: boolean;
  tiktok?: boolean;
  instagram?: boolean;
  twitter?: boolean;
  linkedIn?: boolean;
  phoneNumber?: boolean;
  discord?: boolean;
  email?: boolean;
};

class LinksStateStorage {
  storage: AppStorage;
  constructor() {
    this.storage = new AppStorage();
  }
  set(data: LinksState) {
    return this.storage.setItem(StorageKey.LINKS_STATE, JSON.stringify(data));
  }
  get() {
    return this.storage.getItem(StorageKey.LINKS_STATE);
  }
}

const linksStateStorage = new LinksStateStorage();

export default linksStateStorage;
