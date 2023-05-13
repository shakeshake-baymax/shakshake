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

const loadFonts = async () => {
  await Font.loadAsync({
    Quantico: require("./assets/fonts/Quantico-Regular.ttf"),
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
    if (res?.isNewUser || JSON.stringify(res) === "{}") {
      setInitialRouteName(Screens.WELCOME);
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
    <View style={[t.flex1]}>
      <UserProvider>
        <ViewProvider>
          <Navigation initialRouteName={routeNameRef.current} />
        </ViewProvider>
      </UserProvider>
    </View>
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
