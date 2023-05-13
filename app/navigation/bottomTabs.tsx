import React, { useState } from "react";
// import { Screens } from "../utilities/constants";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { t } from "react-native-tailwindcss";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";
// import HomeScreen from "@/src/screens/home/HomeScreen";
// import ContactsListScreen from "@/src/screens/userInfo/ContactListScreen";
import { p2d } from "../util/pixel";
import ConcatListScreen from "../screens/home/ContactListScreen";
import { Screens } from "../screens/Screens";
import HomeScreen from "../screens/home/homeScreen";

const { height, width } = Dimensions.get("window");

const Tab = createBottomTabNavigator();

const TabBarLabel = ({ label, navigation, focused }) => {
  // 1
  const bookUri = require("../../assets/img/bottomTab/book.png");
  const bookActiveUri = require("../../assets/img/bottomTab/book_active.png");
  const phone = require("../../assets/img/bottomTab/phone_iphone.png");

  const [bedeckState, setBedeckState] = useState(false);
  const rotaValue = useSharedValue(0);
  const zoomValue = useSharedValue(1);
  const fixed = p2d(50);
  const rotaStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotaValue.value}deg` }],
    };
  });
  const zoomStyele = useAnimatedStyle(() => {
    return {
      height: fixed * zoomValue.value,
      width: fixed * zoomValue.value,
    };
  });
  const duration = {
    duration: 100,
  };

  const handlerPhoneClick = () => {
    if (!focused) {
      setBedeckState(true);
      navigation.navigate(Screens.HOME);
      rotaValue.value = withSequence(
        withTiming(15, duration),
        withTiming(-15, duration),
        withTiming(0, duration)
      );
      setTimeout(() => {
        setBedeckState(false);
      }, 450);
    }
  };

  const handleContactsClick = () => {
    if (!focused) {
      navigation.navigate(Screens.CONTACT);
      zoomValue.value = withSequence(
        withTiming(1.25, duration),
        withTiming(0.75, duration),
        withTiming(1, duration)
      );
    }
  };

  const RotaView = (
    <TouchableOpacity
      activeOpacity={0.95}
      style={[
        t.hFull,
        t.wFull,
        t.justifyCenter,
        t.itemsCenter,
        styles.xContent,
        {
          backgroundColor: focused ? "#fff" : "rgba(0,0,0,0)",
        },
      ]}
      onPress={handlerPhoneClick}
    >
      <Animated.View
        style={[rotaStyle, { height: p2d(40), width: p2d(40) }]}
        pointerEvents={"none"}
      >
        <Image style={[t.wFull, t.hFull]} source={phone} />
        <View
          style={[
            styles.xBase,
            { left: p2d(2), display: bedeckState ? "flex" : "none" },
          ]}
        />
        <View
          style={[
            styles.xBase,
            { right: p2d(2), display: bedeckState ? "flex" : "none" },
          ]}
        />
      </Animated.View>
      <Text style={[styles.xText, { display: focused ? "none" : "flex" }]}>
        Shake
      </Text>
    </TouchableOpacity>
  );

  const ZoomView = (
    <TouchableOpacity
      activeOpacity={0.95}
      style={[
        t.hFull,
        t.wFull,
        t.justifyCenter,
        t.itemsCenter,
        styles.xContent,
        {
          backgroundColor: focused ? "#fff" : "rgba(0,0,0,0)",
        },
      ]}
      onPress={handleContactsClick}
    >
      <Animated.View style={[zoomStyele]} pointerEvents={"none"}>
        <Image
          style={[t.wFull, t.hFull]}
          source={focused ? bookActiveUri : bookUri}
        />
      </Animated.View>
      <Text style={[styles.xText, { display: focused ? "none" : "flex" }]}>
        Contacts
      </Text>
    </TouchableOpacity>
  );

  const currentView = label === Screens.HOME ? RotaView : ZoomView;
  return (
    <View
      style={[
        t.flex1,
        t.justifyCenter,
        t.itemsCenter,
        {
          height: p2d(80),
        },
      ]}
    >
      <View
        style={[
          t.itemsCenter,
          t.justifyCenter,
          {
            height: p2d(60),
            width: "100%",
          },
        ]}
      >
        {currentView}
      </View>
    </View>
  );
};

const TabBarView = (props: BottomTabBarProps) => {
  let deviceHeight = Dimensions.get("screen").height;
  let windowHeight = Dimensions.get("window").height;
  // ios or android
  const isIos = Platform.OS === "ios";
  const isIPhoneX = Math.floor(Number(height / width) * 100) === 216;
  const isVirtualKey = deviceHeight - windowHeight > 0;
  let defaultHeight = 80;
  // android Virtual key
  if (!isIos && isVirtualKey) {
    defaultHeight = p2d(140);
  }
  // ios not iphone X and above
  if (isIos && isIPhoneX) {
    defaultHeight = p2d(125);
  }
  return (
    <View
      style={[
        t.justifyAround,
        t.flexRow,
        {
          backgroundColor: "rgba(212, 193, 248, .5)",
          height: p2d(defaultHeight),
          paddingTop: isIos ? p2d(10) : p2d(0),
          paddingVertical:
            (isIos && !isIPhoneX) || (!isIos && !isVirtualKey)
              ? p2d(10)
              : p2d(0),
        },
      ]}
    >
      {props?.state?.routeNames.map((item, index) => {
        return (
          <TabBarLabel
            label={item}
            key={index}
            navigation={props.navigation}
            focused={props.state.index === index}
          />
        );
      })}
    </View>
  );
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName={Screens.HOME}
      tabBar={TabBarView}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name={Screens.HOME} component={HomeScreen} />
      <Tab.Screen name={Screens.CONTACT} component={ConcatListScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  xBase: {
    height: p2d(16),
    backgroundColor: "#7B45E7",
    position: "absolute",
    width: p2d(3),
    borderRadius: p2d(3),
    top: p2d(12),
  },
  xText: {
    fontSize: p2d(16),
    fontWeight: "700",
    color: "#7B45E7",
    fontFamily: "Quantico",
  },
  xContent: {
    width: p2d(160),
    borderRadius: p2d(40),
  },
});

export default BottomTabs;
