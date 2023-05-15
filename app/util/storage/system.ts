import { AppStorage } from ".";
import { StorageKey } from "./keys";

type systemData = {
  step?: number;
};

class SystemStorage {
  storage: AppStorage;
  constructor() {
    this.storage = new AppStorage();
  }
  set(data: systemData) {
    return this.storage.setItem(StorageKey.SYSTEM, JSON.stringify(data));
  }
  get() {
    return this.storage.getItem(StorageKey.SYSTEM);
  }
}

const systemStorage = new SystemStorage();

export default systemStorage;
