import React, {
  createContext,
  Dispatch,
  useCallback,
  useEffect,
  useState,
} from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Profile } from "../api/models/types";
import { User } from "../api/models/User";
import userStorage from "../util/storage/user";

export interface UserContextData {
  currentUser: User | null;
  isUpdate: boolean;
  setIsUpdate: (value: boolean) => void;
  signOut(): void;
  setCurrentUser: Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

export type AuthResult = { user?: User; error?: any };

const UserProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  useEffect(() => {
    if (currentUser && !currentUser.isNewUser) {
      userStorage.set(currentUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.isNewUser]);

  const signOut = useCallback(() => {
    setCurrentUser(null);
  }, []);
  // 更新本地用户的配置 头像 / 背景 / 简介
  const updateUserProfile = useCallback((profile) => {}, [currentUser]);
  // 更新本地用户的社交链接状态
  const updateUserLinks = useCallback((links) => {}, [currentUser]);

  return (
    <SafeAreaProvider>
      <UserContext.Provider
        value={{
          currentUser,
          setCurrentUser,
          signOut,
          isUpdate,
          setIsUpdate,
        }}
      >
        {children}
      </UserContext.Provider>
    </SafeAreaProvider>
  );
};

export { UserProvider, UserContext };
