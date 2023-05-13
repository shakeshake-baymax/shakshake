import { AppStorage } from ".";
import { StorageKey } from "./keys";

type photoData = {
  photo?: string;
  bg?: string;
};

class PhotoStorage {
  storage: AppStorage;
  constructor() {
    this.storage = new AppStorage();
  }
  set(data: photoData) {
    return this.storage.setItem(StorageKey.PHOTO, JSON.stringify(data));
  }
  get() {
    return this.storage.getItem(StorageKey.PHOTO);
  }
}

const photoStorage = new PhotoStorage();

export default photoStorage;
