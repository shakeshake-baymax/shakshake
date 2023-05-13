import React, { useEffect } from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
// import {Icons} from 'components/icons';
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Screens } from "@/src/utilities/constants";
import MaskedView from "@react-native-community/masked-view";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { p2d } from "../../util/pixel";
import { LinearGradient } from "expo-linear-gradient";
import { Screens } from "../Screens";
const { height } = Dimensions.get("window");

const WelcomeScreen = (props) => {
  const insets = useSafeAreaInsets();
  const buttonBG = useSharedValue(0);
  //Logo
  const LogoHeight = useSharedValue(-height / 2);
  const LogoRotate = useSharedValue("0deg");
  const LogoOpacity = useSharedValue(0);
  const LogoAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: LogoOpacity.value,
      marginVertical: LogoHeight.value,
      transform: [{ rotateZ: LogoRotate.value }],
    };
  });
  //LogoText
  const LogoTextOpacity = useSharedValue(0);
  const LogoTextFontSize = useSharedValue(p2d(40));
  const LogoTextStyle = useAnimatedStyle(() => {
    return {
      opacity: LogoTextOpacity.value,
      fontSize: LogoTextFontSize.value,
    };
  });
  //Sign-in Button
  const SigninButtonScale = useSharedValue(0);
  const ButtonTextStyle = useAnimatedStyle(() => {
    return {
      color: !buttonBG.value ? "#7B45E7" : "white",
    };
  });

  const SigninButtonBGStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(1),
      backgroundColor: `rgba(0, 0, 0, ${buttonBG.value})`,
    };
  });

  const SigninButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: SigninButtonScale.value }],
    };
  });

  const size = p2d(35);
  useEffect(() => {
    LogoOpacity.value = withTiming(1, { duration: 500 });
    LogoHeight.value = withSpring(
      insets.top + height / 6,
      { mass: 1, damping: 7, stiffness: 120 },
      () => {
        LogoRotate.value = withRepeat(
          withTiming("-30deg", { duration: 400 }),
          4,
          true,
          () => {
            LogoTextFontSize.value = withSpring(size, {
              mass: 0.7,
              stiffness: 100,
            });
            SigninButtonScale.value = withSpring(1, { mass: 0.7 });
          }
        );
        LogoTextOpacity.value = withTiming(1, { duration: 1500 });
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { navigation } = props;

  function logIn() {
    navigation.navigate(Screens.INPUT_PHONE);
  }
  return (
    <LinearGradient colors={["#7B45E7", "#FFFFFF"]} style={styles.container}>
      <Animated.Image
        style={[styles.icon, LogoAnimStyle]}
        source={require("../../../assets/icon/app_icon.png")}
      />
      <Animated.View
        style={[
          SigninButtonStyle,
          {
            flex: 1,
            flexDirection: "column",
            height: "100%",
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            alignSelf: "flex-start",
          },
        ]}
      >
        <MaskedView
          style={{ flex: 1, flexDirection: "row", height: "100%" }}
          androidRenderingMode={"software"}
          maskElement={
            <View
              style={{
                // Transparent background because mask is based off alpha channel.
                backgroundColor: "transparent",
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Animated.View
                style={[
                  styles.loginButtonBG,
                  SigninButtonBGStyle,
                  { height: height / 10 },
                ]}
              />
            </View>
          }
        >
          <LinearGradient
            colors={["#7B45E7", "#52E1FD"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, height: "100%" }}
          />
        </MaskedView>
        <Pressable
          onPress={logIn}
          onPressIn={() => {
            buttonBG.value = withTiming(1);
          }}
          onPressOut={() => {
            buttonBG.value = withTiming(0);
          }}
          style={[
            styles.loginButton,
            { height: height / 10 },
            { position: "absolute", alignSelf: "center", top: 0 },
          ]}
        >
          <Animated.Text style={[styles.text, ButtonTextStyle]}>
            SIGN-IN
          </Animated.Text>
        </Pressable>
      </Animated.View>

      <MaskedView
        style={[{ flex: 2, flexDirection: "row" }]}
        maskElement={
          <View
            style={{
              backgroundColor: "transparent",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Animated.Text
              style={[
                LogoTextStyle,
                {
                  fontWeight: "bold",
                },
              ]}
            >
              S H A K E S H A K E
            </Animated.Text>
          </View>
        }
      >
        <LinearGradient
          colors={["#7B45E7", "#52E1FD"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, height: "100%" }}
        />
      </MaskedView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  icon: {
    width: "100%",
    maxHeight: p2d(200),
    maxWidth: p2d(200),
  },
  shakeshkae: {
    width: "80%",
  },
  loginButtonBG: {
    borderWidth: 2,
    width: "85%",
    maxHeight: p2d(60),
    borderRadius: p2d(40),
    marginBottom: p2d(20),
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton: {
    width: "85%",
    maxHeight: p2d(60),
    borderRadius: p2d(40),
    marginBottom: p2d(20),
    alignItems: "center",
    justifyContent: "center",
  },
  accountButton: {
    width: "80%",
    borderRadius: 40,
    maxHeight: p2d(60),
    marginBottom: p2d(20),
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: p2d(18),
    fontStyle: "normal",
    fontWeight: "700",
    fontFamily: "Quantico",
  },
});

export default WelcomeScreen;
