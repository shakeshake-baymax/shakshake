/*eslint-disable*/
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Accelerometer } from "expo-sensors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SocialMedia } from "../../util/concat";
import GradientText from "../../components/text";
import { LinearGradient } from "expo-linear-gradient";
import QRCodeView from "../../components/QRCodeView";
import { Icons } from "../../components/icons";
import { p2d } from "../../util/pixel";
import {
  PHONE_LOGO,
  EMAIL_LOGO,
  INSTAGRAM_LOGO,
  TWITTER_LOGO,
  LINKEDIN_LOGO,
  DISCORD_LOGO,
  TIKTOK_LOGO,
  SNAPCHAT_LOGO,
  FACEBOOK_LOGO,
} from "../../../assets/single_color_logo";
import LogoButton from "../../components/button/LogoButton";
import userStorage from "../../util/storage/user";
import StringUtility from "../../util/Utilities/StringUtility";
import { useAuth } from "../../hook/useAuth";
import { Screens } from "../Screens";
import _Location from "../../util/system/locationPermission";
import { t } from "react-native-tailwindcss";
import { Crucifix } from "../../components/view/Crucifix";
export const PROD_MODE = true;
export const VERSION_NUMBER = "0.701";

function HomeScreen(props) {
  const { navigation } = props;
  const [selectWindowOpened, setSelectWindow] = useState(false);
  const { isUpdate, setIsUpdate, currentUser } = useAuth();
  //permission
  const [isLocation, setIsLocation] = useState(true);
  //QR modal
  const [modalOpen, setModal] = useState(false);
  const [socialMediaLinks, setSocialMediaLinks] = useState({});
  const [userData, setUserData] = useState({});

  navigation.addListener("focus", () => {
    if (isUpdate) {
      userStorage.get().then((res) => {
        setUserData(res);
        setSocialMediaLinks(res?.socialMediaLinks);
      });
      setIsUpdate(false);
    }
  });

  const ApplyPermission = async () => {
    // 申请位置权限
    const location = await _Location.apply();
    setIsLocation(location);
    // 申请蓝牙权限
    // console.log(location);
  };

  const tipsColor = useMemo(() => {
    if (!isLocation) {
      return "#EB5545";
    }
    if (selectWindowOpened) {
      return "#FFF";
    } else {
      return "#7B45E7";
    }
  }, [selectWindowOpened, isLocation]);

  useEffect(() => {
    // 首次进入页面请求一次
    ApplyPermission();
    userStorage.get().then((res) => {
      setUserData(res);
      setSocialMediaLinks(res?.socialMediaLinks);
    });
  }, []);

  //Platform Select Animation
  const PlatformSelectOpened = useSharedValue(false);
  const PlatformScale = useSharedValue(0);
  const PlatformStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: PlatformScale.value }],
    };
  });

  //Button Select Animation
  const PlatformButtonY = useSharedValue(-100);
  const PlatformButtonRotate = useSharedValue(0);
  const PlatformButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: PlatformButtonY.value },
        { rotateZ: PlatformButtonRotate.value + "deg" },
      ],
    };
  });

  const QRButtonStyle = useAnimatedStyle(() => {
    return {
      // display: isLinkChosen ? "flex" : "none",
      opacity: PlatformSelectOpened.value
        ? withTiming(1, { duration: 500 })
        : withTiming(0),
      transform: [
        {
          translateY: PlatformSelectOpened.value
            ? withSpring(0)
            : withSpring(50),
        },
      ],
    };
  }, [PlatformSelectOpened.value]);

  //the tip of Set your sharing links
  const TipOpacity = useSharedValue(1);
  const TipAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: PlatformButtonY.value + 16 }],
      opacity: TipOpacity.value,
    };
  });

  const onCheck = useCallback(
    (isCheck: boolean, name: SocialMedia) => {
      const newName = StringUtility.toLowerCase(name);
      const newData = {
        ...userData,
        socialMediaLinks: {
          ...socialMediaLinks,
          [newName]: {
            ...socialMediaLinks?.[newName],
            isExposed: isCheck,
          },
        },
      };
      setUserData(newData);
    },
    [userData]
  );

  const movePlatform = useCallback(() => {
    if (!isLocation) {
      return;
    }
    if (!PlatformSelectOpened.value) {
      //Open
      PlatformScale.value = withSpring(1);
      PlatformButtonY.value = withSpring(0);
      PlatformButtonRotate.value = withTiming(225);
      PlatformSelectOpened.value = true;
      TipOpacity.value = withTiming(0);
      setSelectWindow(true);
    } else {
      //Close
      PlatformScale.value = withTiming(0);
      PlatformButtonY.value = withSpring(-100);
      PlatformButtonRotate.value = withTiming(0);
      TipOpacity.value = withTiming(1);
      PlatformSelectOpened.value = false;
      setSelectWindow(false);
    }
  }, [PlatformSelectOpened.value]);

  //# shake shake

  useEffect(() => {
    Accelerometer.addListener(({ x, y, z }) => {
      if (x > 1.5 || y > 1.5 || z > 1.5) {
        console.log("摇一摇");
        if (isLocation) {
          props.navigation.navigate(Screens.SHAKESHAKE);
        }
      }
    });

    return () => {
      Accelerometer.removeAllListeners();
    };
  }, []);

  //# The indicator of the
  const [indicatorMaxValue, setIndicatorMaxValue] = useState(0);
  const [indicatorViewValue, setIndicatorViewValue] = useState(0);
  const indicatorNowValue = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const indicatorViewSValue = useSharedValue(0);
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      width: indicatorWidth.value,
      transform: [{ translateX: indicatorNowValue.value }],
    };
  });

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      <GradientText
        textStyle={styles.topText}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colorSet={["#7B45E7", "#52E1FD"]}
        location={[0, 1]}
      >
        Let's SHAKE together
      </GradientText>
      <View
        style={{
          height: "100%",
          width: "100%",
          flex: 1,
          alignItems: "center",
        }}
      >
        <Animated.Image
          source={require("../../../assets/img/shakelogo.png")}
          resizeMode={"contain"}
          style={styles.logo}
        />
        <View style={{ width: "100%", alignItems: "center" }}>
          <Animated.View style={[styles.platform, PlatformStyle]}>
            <View
              key={indicatorViewValue}
              style={{ width: indicatorViewValue, overflow: "hidden" }}
            >
              <Animated.View
                style={[
                  indicatorStyle,
                  {
                    height: 5,
                    marginBottom: 15,
                  },
                ]}
              >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["#7B45E7", "#52E1FD"]}
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                    borderRadius: 12,
                  }}
                />
              </Animated.View>
            </View>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              indicatorStyle={"white"}
              onContentSizeChange={(x, y) => {
                setIndicatorMaxValue(x);
                if (x < indicatorViewValue) {
                  setIndicatorViewValue(x);
                  indicatorViewSValue.value = x;
                }
                indicatorWidth.value = x - indicatorViewSValue.value;
              }}
              onLayout={({
                nativeEvent: {
                  layout: { width },
                },
              }) => {
                setIndicatorViewValue(width);
                indicatorViewSValue.value = width;
                indicatorWidth.value = (indicatorMaxValue - width) * 2;
              }}
              scrollEventThrottle={16}
              onScroll={(width) => {
                indicatorNowValue.value = width.nativeEvent.contentOffset.x;
              }}
              style={{ flexGrow: 0 }}
              contentContainerStyle={{ paddingRight: 0 }}
            >
              <LogoButton
                smLink={socialMediaLinks?.["phone_number"]}
                visible={true}
                onPress={onCheck}
                logo={PHONE_LOGO}
              />
              <LogoButton
                smLink={socialMediaLinks?.["email"]}
                visible={socialMediaLinks?.["email"]?.isExposed || false}
                onPress={onCheck}
                logo={EMAIL_LOGO}
              />
              <LogoButton
                smLink={socialMediaLinks?.["instagram"]}
                onPress={onCheck}
                visible={socialMediaLinks["instagram"]?.isExposed || false}
                logo={INSTAGRAM_LOGO}
              />
              <LogoButton
                smLink={socialMediaLinks?.["twitter"]}
                onPress={onCheck}
                visible={socialMediaLinks["twitter"]?.isExposed || false}
                logo={TWITTER_LOGO}
              />
              <LogoButton
                smLink={socialMediaLinks?.["linkedin"]}
                onPress={onCheck}
                visible={socialMediaLinks["linkedin"]?.isExposed || false}
                logo={LINKEDIN_LOGO}
              />
              <LogoButton
                smLink={socialMediaLinks?.["discord"]}
                onPress={onCheck}
                visible={socialMediaLinks["discord"]?.isExposed || false}
                logo={DISCORD_LOGO}
              />
              <LogoButton
                smLink={socialMediaLinks?.["tiktok"]}
                onPress={onCheck}
                visible={socialMediaLinks["tiktok"]?.isExposed || false}
                logo={TIKTOK_LOGO}
              />
              <LogoButton
                smLink={socialMediaLinks?.["snapchat"]}
                onPress={onCheck}
                visible={socialMediaLinks["snapchat"]?.isExposed || false}
                logo={SNAPCHAT_LOGO}
              />
              <LogoButton
                smLink={socialMediaLinks?.["facebook"]}
                onPress={onCheck}
                visible={socialMediaLinks["facebook"]?.isExposed || false}
                logo={FACEBOOK_LOGO}
              />
            </ScrollView>
          </Animated.View>
          <Animated.View style={PlatformButtonStyle}>
            <Pressable onPress={movePlatform}>
              <Animated.View>
                <LinearGradient
                  colors={
                    selectWindowOpened
                      ? ["#7B45E7", "#52E1FD"]
                      : ["#FFFFFF00", "#FFFFFF"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 80,
                    width: p2d(60),
                    height: p2d(60),
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: tipsColor,
                    borderWidth: 4,
                  }}
                >
                  <Crucifix color={tipsColor} />
                </LinearGradient>
              </Animated.View>
            </Pressable>
          </Animated.View>
          {/* tips 提示 */}
          <Animated.View style={[TipAnimationStyle, t.itemsCenter]}>
            {isLocation ? (
              <GradientText
                textStyle={{
                  fontSize: p2d(18),
                  fontWeight: "700",
                  fontFamily: "Teko",
                }}
                location={[0, 1]}
                start={{ x: -0.5, y: 1 }}
                end={{ x: 1, y: 0 }}
                colorSet={["#52E1FD", "#7B45E7"]}
              >
                Set your sharing links
              </GradientText>
            ) : (
              <View>
                <Text style={styles.settingsPrivacyLocation}>
                  We cannot read your location.
                </Text>
                <Text style={styles.settingsPrivacyLocation}>
                  Setting - Privacy - Location
                </Text>
              </View>
            )}
          </Animated.View>
        </View>

        <TouchableOpacity
          disabled={!PlatformSelectOpened.value}
          onPress={() => {
            setModal(true);
          }}
          style={{ width: "100%", alignItems: "center" }}
        >
          <Animated.View style={[QRButtonStyle]}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={["#7B45E7", "#52E1FD"]}
              style={{
                flexDirection: "column",
                justifyContent: "center",
                height: 53,
                width: 180,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontWeight: "700",
                  fontSize: 18,
                  fontFamily: "Quantico",
                }}
              >
                Generate QR Code
              </Text>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        <QRCodeView
          visible={modalOpen}
          close={function (): void {
            setModal(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    bottom: 0,
  },
  logo: {
    height: "50%",
  },
  topText: {
    fontFamily: "Quantico_Bold",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 25,
  },
  cannotLocation: {
    color: "#EB5545",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
  settingsPrivacyLocation: {
    color: "#EB5545",
    fontWeight: "700",
    fontSize: p2d(18),
    marginTop: p2d(18),
    textAlign: "center",
    fontFamily: "Quantico",
  },
  closeCircle: {
    alignSelf: "center",
    textAlign: "center",
    marginBottom: 23,
  },
  platform: {
    position: "relative",
    bottom: -20,
    paddingBottom: 50,
    paddingHorizontal: 30,
    overflow: "hidden",
    paddingTop: 25,
    borderRadius: 20,
    borderBottomStartRadius: 70,
    borderBottomEndRadius: 70,
    marginHorizontal: 40,
    backgroundColor: "rgba(212, 193, 248, 0.4)",
  },
});

export default HomeScreen;
