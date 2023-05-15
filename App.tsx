import { View, StyleSheet, Image, Animated } from "react-native";
import { t } from "react-native-tailwindcss";
import { UserProvider } from "./app/context/userContext";
import { ViewProvider } from "./app/context/viewContext";
import Navigation from "./app/navigation";
import { Screens } from "./app/screens/Screens";
import * as Font from "expo-font";
import { useEffect, useRef, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { p2d } from "./app/util/pixel";
import userStorage from "./app/util/storage/user";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import systemStorage from "./app/util/storage/system";

const loadFonts = async () => {
  await Font.loadAsync({
    Quantico: require("./assets/fonts/Quantico-Regular.ttf"),
    Quantico_Bold: require("./assets/fonts/Quantico-Bold.ttf"),
    Teko_Bold: require("./assets/fonts/Teko-Bold-5.ttf"),
    Teko: require("./assets/fonts/Teko-Regular-2.ttf"),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState(Screens.ROOT);
  const routeNameRef = useRef<string>();
  const opacity = new Animated.Value(1);
  routeNameRef.current = initialRouteName;
  // 加载字体
  const loadAppData = () => {
    loadFonts().then(() => {
      setFontsLoaded(true);
    });
  };
  const prepareApp = async () => {
    try {
      // 防止加载屏幕自动隐藏
      await SplashScreen.preventAutoHideAsync();
      // 隐藏加载屏幕以显示内容
      await SplashScreen.hideAsync();
      setIsLoadingComplete(true);
    } catch (e) {
      console.warn(e);
    }
  };
  const isNewUser = async () => {
    const res = await userStorage.get();
    const step = await systemStorage.get();
    if (JSON.stringify(res) === "{}") {
      systemStorage.set({ step: 0 });
      setInitialRouteName(Screens.WELCOME);
      return;
    }
    // 如果用户存在，并且还是新用户的情况
    if (res?.isNewUser) {
      // 查看他在本地的第几个步骤，为 1 在设置名称，为2在设置链接，其他情况直接返回欢迎
      if (JSON.stringify(step) === "{}" || step?.step === 0) {
        systemStorage.set({ step: 0 });
        setInitialRouteName(Screens.WELCOME);
        return;
      }
      if (step?.step === 1) {
        setInitialRouteName(Screens.USERNAME_SETUP);
        return;
      }
      if (step?.step === 2) {
        setInitialRouteName(Screens.CHOOSE_SOCIAL_LINKS);
        return;
      }
      if (step?.step === 0) {
        setInitialRouteName(Screens.WELCOME);
      }
    }
  };
  useEffect(() => {
    loadAppData();
    prepareApp();
    isNewUser();
    Animated.timing(opacity, {
      toValue: 0,
      duration: 1000, // 淡出持续时间（单位：毫秒）
      useNativeDriver: true,
    }).start();
  }, []);

  if (!isLoadingComplete || !fontsLoaded) {
    return (
      <Animated.View style={[styles.container, { opacity }]}>
        <Image
          source={require("./assets/bg/background.png")}
          style={{ width: "100%", height: "100%" }}
        />
      </Animated.View>
    );
  }

  return (
    <GestureHandlerRootView style={[t.flex1]}>
      <UserProvider>
        <ViewProvider>
          <Navigation initialRouteName={routeNameRef.current} />
        </ViewProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  icon: {
    width: "100%",
    maxHeight: p2d(200),
    maxWidth: p2d(200),
  },
});
