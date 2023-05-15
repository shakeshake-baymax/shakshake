import React, { createContext, useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { t } from "react-native-tailwindcss";
import { User } from "../api/models/User";
import ConfirmView from "../components/Comfirm";
import LoadingView from "../components/LoadingView";

interface ViewObject {
  show: () => void;
  hide: () => void;
}

interface ConfirmObject {
  show: (props: Confirm) => void;
  hide: () => void;
}

export interface ViewContextData {
  loadingView: ViewObject;
  confirmView: ConfirmObject;
}

const ViewContext = createContext<ViewContextData>({} as ViewContextData);

export type AuthResult = { user?: User; error?: any };

interface Confirm {
  title?: string;
  context: string;
  onYes: () => void;
  onNo: () => void;
}
const ViewProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [showLoading, setShowLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState<Confirm>({
    title: "",
    context: "",
    onNo: () => {},
    onYes: () => {},
  });
  const loadingView = {
    show: () => {
      setShowLoading(true);
    },
    hide: () => {
      setShowLoading(false);
    },
  };

  const confirmView = useMemo(() => {
    return {
      show: ({ onYes, onNo, context, title }: Confirm) => {
        setConfirmData({
          title,
          context,
          onYes,
          onNo,
        });
        setShowConfirm(true);
      },
      hide: () => {
        setShowConfirm(false);
      },
    };
  }, []);
  const handlerYes = useCallback(() => {
    confirmData.onYes();
    setShowConfirm(false);
  }, [confirmView, confirmData]);
  const handlerNo = useCallback(() => {
    confirmData.onNo();
    setShowConfirm(false);
  }, [confirmView, confirmData]);

  return (
    <SafeAreaProvider>
      <ViewContext.Provider
        value={{
          loadingView,
          confirmView,
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
        <View
          style={[
            t.wFull,
            t.hFull,
            t.justifyCenter,
            t.itemsCenter,
            t.absolute,
            t.bgTransparent,
            {
              display: showConfirm ? "flex" : "none",
              backgroundColor: "rgba(0,0,0,0.4)",
            },
          ]}
        >
          <ConfirmView
            onNo={handlerNo}
            onYes={handlerYes}
            context={confirmData.context}
            title={confirmData.title}
          />
        </View>
      </ViewContext.Provider>
    </SafeAreaProvider>
  );
};

export { ViewProvider, ViewContext };
