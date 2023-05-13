import { AppStorage } from ".";
import { User } from "../../api/models/User";
import { StorageKey } from "./keys";

class UserStorage {
  storage: AppStorage;
  constructor() {
    this.storage = new AppStorage();
  }
  set(data: User) {
    return this.storage.setItem(StorageKey.USER, JSON.stringify(data));
  }
  get() {
    return this.storage.getItem(StorageKey.USER);
  }
}

const userStorage = new UserStorage();

export default userStorage;
