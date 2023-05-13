import { Dimensions, Image, Keyboard, StyleSheet, Text } from "react-native";
import React, { useCallback, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  FadeOutRight,
  Layout,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/core";
import SearchInputField from "./SearchInputField";
import { p2d } from "../../../util/pixel";
import { CANCEL_BUTTON } from "../../../../assets/icon";
import { Icons } from "../../../components/icons";
import { Screens } from "../../Screens";

type Props = {
  onTextChange?: (text: string) => void;
  value?: string;
};

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = HEIGHT / 9;
function ContactsHeader(props: Props) {
  const { onTextChange, value } = props;
  const insets = useSafeAreaInsets();
  const [isFocus, setIsFocus] = useState(false);
  const buttonOpacity = useSharedValue(1);
  const navigation = useNavigation();
  const opaStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(buttonOpacity.value),
    };
  }, []);
  const goToSettings = useCallback(() => {
    navigation.navigate(Screens.SETTINGS);
  }, [navigation]);
  const onFocus = useCallback(() => {
    buttonOpacity.value = 0;
    setIsFocus(true);
  }, []);
  const onBlur = useCallback(() => {
    buttonOpacity.value = 1;
    setIsFocus(false);
  }, []);
  const onCancel = useCallback(() => {
    Keyboard.dismiss();
    if (onTextChange) {
      onTextChange("");
    }
  }, [onTextChange]);

  return (
    <Animated.View style={[styles.container, { paddingTop: insets.top }]}>
      <SearchInputField
        onFocus={onFocus}
        onBlur={onBlur}
        placeHolder={"Search Contcats"}
        defaultValue={""}
        value={value}
        onTextChange={onTextChange}
      />
      <Animated.View
        onTouchStart={goToSettings}
        style={[styles.bottom, opaStyle]}
      >
        <Icons type="settings" w={26} h={20} />
        <Text
          style={{
            fontWeight: "400",
            fontStyle: "normal",
            fontFamily: "Quantico",
            fontSize: p2d(14),
            marginTop: p2d(4),
          }}
        >
          Settings
        </Text>
      </Animated.View>
      {isFocus && (
        <Animated.View
          entering={SlideInRight}
          exiting={FadeOutRight}
          onTouchEnd={onCancel}
          layout={Layout.duration(500).easing(Easing.linear)}
          style={[styles.cancelButton, { top: insets.top }]}
        >
          <Image style={styles.img} source={CANCEL_BUTTON} />
        </Animated.View>
      )}
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  title: {
    fontSize: 10,
  },
  bottom: {
    width: WIDTH / 5,
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  cancelButton: {
    position: "absolute",
    width: WIDTH / 5,
    height: p2d(40),
    bottom: 0,
    right: 0,
  },
  img: {
    width: p2d(76),
    height: p2d(40),
  },
  textStyle: {
    height: p2d(50),
    top: HEADER_HEIGHT,
    position: "absolute",
    justifyContent: "center",
    left: p2d(10),
  },
  gradientText: {
    fontSize: p2d(16),
    fontFamily: "Quantico",
    fontWeight: "700",
  },
});
export default ContactsHeader;
