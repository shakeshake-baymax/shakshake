import * as SecureStore from "expo-secure-store";
interface AppStorageInterface {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string>;
  // clear(): Promise<void>;
  removeItem(key: string): void;
}

export class AppStorage implements AppStorageInterface {
  async getItem(key: string) {
    const res = await SecureStore.getItemAsync(key);
    return Promise.resolve(JSON.parse(res || "{}"));
  }

  removeItem(key: string) {
    return Promise.resolve(SecureStore.deleteItemAsync(key));
  }

  setItem(key: string, value: string) {
    return Promise.resolve(SecureStore.setItemAsync(key, value));
  }
}
