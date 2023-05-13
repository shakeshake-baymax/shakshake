import React, { createContext, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { t } from "react-native-tailwindcss";
import { User } from "../api/models/User";
import LoadingView from "../components/LoadingView";

interface ViewObject {
  show: () => void;
  hide: () => void;
}

export interface ViewContextData {
  loadingView: ViewObject;
}

const ViewContext = createContext<ViewContextData>({} as ViewContextData);

export type AuthResult = { user?: User; error?: any };

const ViewProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [showLoading, setShowLoading] = useState(false);

  const loadingView = {
    show: () => {
      setShowLoading(true);
    },
    hide: () => {
      setShowLoading(false);
    },
  };

  return (
    <SafeAreaProvider>
      <ViewContext.Provider
        value={{
          loadingView,
        }}
      >
        {children}
        <View
          style={[
            t.wFull,
            t.hFull,
            t.justifyCenter,
            t.itemsCenter,
            t.absolute,
            t.bgTransparent,
            {
              display: showLoading ? "flex" : "none",
              backgroundColor: "rgba(0,0,0,0.4)",
            },
          ]}
        >
          <LoadingView />
        </View>
      </ViewContext.Provider>
    </SafeAreaProvider>
  );
};

export { ViewProvider, ViewContext };
