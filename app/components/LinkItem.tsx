import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import * as Ico from "../components/icons";
import Animated, {
  Easing,
  FadeInLeft,
  FadeOutRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
// @ts-ignore
// import isEmail from "validator/lib/isEmail";
import { t } from "react-native-tailwindcss";
import { Icons } from "../components/icons";
import GradientText from "./text";
import { SocialMedia, SocialMediaLinkPrefix } from "../util/concat";
import BoxSize from "./BoxSize";
import { p2d } from "../util/pixel";

const checkButtonContext = () => {
  return (
    <View style={{ alignItems: "center" }}>
      <>
        {/* {Icons.ANGLE_RIGHT} */}
        <GradientText
          textStyle={styles.gradientText}
          location={[0, 0.7]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colorSet={["#FCA2D5", "#7B45E7"]}
        >
          Check
        </GradientText>
      </>
    </View>
  );
};
interface LinkItemProps {
  value: string | null;
  iconUrl: any;
  title: SocialMedia;
  placeHolder: string;
  onTextChange: (text: string | null, title: SocialMedia) => void;
  defaultValue: string | null | undefined;
  hasError: (hasError: boolean) => void;
  visible: boolean;
  delVisible: boolean;
  delSocialLinks?: () => void;
}

type inputStatus = "valid" | "invalid" | "empty";
function textColorProvider(isFocus: boolean, inputStatus: inputStatus) {
  if (isFocus) {
    if (inputStatus === "invalid") {
      return "#EB5545";
    } else {
      return "black";
    }
  } else {
    return "#636c72";
  }
}
function validateDefault(
  title: SocialMedia,
  defaultVal: string | null | undefined
): inputStatus {
  if (title === SocialMedia.PHONE_NUMBER) {
    return "valid";
  }
  if (defaultVal === undefined || defaultVal === null) {
    return "empty";
  } else {
    return defaultVal.includes(" ") ? "invalid" : "valid";
  }
}
const LinkItem = (props: LinkItemProps) => {
  const {
    hasError,
    iconUrl,
    value,
    title,
    placeHolder,
    onTextChange,
    defaultValue,
    visible,
    delVisible,
    delSocialLinks,
  } = props;

  const [inputStatus, setInputStatus] = useState<inputStatus>(
    validateDefault(title, defaultValue)
  );
  const inputRef = useRef<TextInput>(null);
  const [isFocus, setIsFocus] = useState(false);
  const size = useSharedValue(1);
  const sizeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(size.value) }],
    };
  }, [size.value]);
  const fontSize = useSharedValue(20);
  const fontStyle = useAnimatedStyle(() => {
    return {
      fontSize: withTiming(fontSize.value),
    };
  }, [fontSize.value]);
  //
  const [deleteDisplay, setDeleteDisplay] = useState(false);

  const smLinkTextValidation = useCallback(
    (text: string) => {
      if (text.includes(" ")) {
        return true;
      }
      if (title === SocialMedia.EMAIL) {
        return true;
      }
      if (
        title === SocialMedia.LINKEDIN &&
        !text.startsWith(SocialMediaLinkPrefix.LINKEDIN_PREFIX)
      ) {
        return true;
      }
      if (
        title === SocialMedia.FACEBOOK &&
        !text.startsWith(SocialMediaLinkPrefix.FACEBOOK_PREFIX)
      ) {
        return true;
      }

      return (
        title === SocialMedia.DISCORD &&
        !text.startsWith(SocialMediaLinkPrefix.DISCORD_PREFIX)
      );
    },
    [title]
  );

  const memorisedTextChanged = useCallback(
    (text: string) => {
      if (text === "") {
        hasError(false);
        setInputStatus("empty");
      } else if (smLinkTextValidation(text)) {
        hasError(true);
        setInputStatus("invalid");
      } else {
        hasError(false);
        setInputStatus("valid");
      }
      if (text === "") {
        onTextChange(null, title);
      } else {
        onTextChange(text, title);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onTextChange, title, smLinkTextValidation]
  );

  const markerProvider = useMemo(() => {
    if (inputStatus === "empty") {
      return null;
    } else {
      if (inputStatus === "valid") {
        // return Icons.CHECK;
      } else {
        // return Icons.ERROR;
      }
      return <View />;
    }
  }, [inputStatus]);

  const onFocus = useCallback(() => {
    setIsFocus(true);
    size.value = 1.5;
    fontSize.value = 24;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBlur = useCallback(() => {
    setIsFocus(false);
    size.value = 1;
    fontSize.value = 20;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const colorProvider = useMemo(() => {
    return {
      borderBottomColor: isFocus ? "black" : "#636c72",
      color: textColorProvider(isFocus, inputStatus),
    };
  }, [isFocus, inputStatus]);
  const openLinkToCheck = useCallback(() => {
    if (value) {
      // openLink(value, title);
    }
  }, [value, title]);

  const checkButtonProvider = useMemo(() => {
    return (
      <TouchableHighlight
        underlayColor={"#D4C1F86D"}
        disabled={
          title === SocialMedia.PHONE_NUMBER ||
          inputStatus === "invalid" ||
          inputStatus === "empty"
        }
        style={{
          width: 49,
          height: 61,
          borderRadius: 10,
          justifyContent: "center",
        }}
        onPress={openLinkToCheck}
      >
        {inputStatus === "valid" && title !== SocialMedia.PHONE_NUMBER ? (
          checkButtonContext()
        ) : (
          <></>
        )}
      </TouchableHighlight>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inputStatus]);
  const bringKeyboard = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef.current]);

  const rota = useSharedValue(0);
  const left = useSharedValue(-20);
  const opacity = useSharedValue(0);

  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rota.value}deg` }],
      opacity: opacity.value,
    };
  });

  const leftStyle = useAnimatedStyle(() => {
    return {
      marginLeft: left.value,
    };
  });

  const excludeOnPress = () => {
    rota.value = 135;
    setDeleteDisplay(true);
  };

  const excludeConfirmOnpress = () => {
    console.log(delSocialLinks);
    delSocialLinks?.();
    rota.value = 0;
    setDeleteDisplay(false);
  };

  useEffect(() => {
    if (delVisible) {
      left.value = withTiming(0, {
        duration: 500,
        easing: Easing.elastic(1.1),
      });
      opacity.value = withTiming(1, {
        duration: 500,
      });
    } else {
      //
      left.value = -20;
      opacity.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delVisible]);

  useEffect(() => {
    if (visible) {
    }
  }, [visible]);

  return (
    <Animated.View
      entering={FadeInLeft}
      exiting={FadeOutRight}
      style={[
        styles.itemContainer,
        leftStyle,
        { display: visible ? "flex" : "none" },
      ]}
    >
      <View style={[t.itemsCenter, t.relative, t.justifyCenter, t.flex1]}>
        {title === SocialMedia.PHONE_NUMBER ? (
          <></>
        ) : (
          <>
            <Animated.View
              pointerEvents={"box-none"}
              style={[
                rotationStyle,
                {
                  display: deleteDisplay ? "none" : "flex",
                },
              ]}
            >
              <Ico.Icons type={"exclude"} onPress={excludeOnPress} />
            </Animated.View>
            <Ico.Icons
              type={"excludeConfirm"}
              style={{
                display: deleteDisplay ? "flex" : "none",
                // backgroundColor: 'red',
              }}
              onPress={excludeConfirmOnpress}
            />
            <BoxSize height={p2d(35)} />
          </>
        )}
      </View>
      <Pressable onPress={bringKeyboard} style={styles.logoContainer}>
        <Animated.View style={[sizeStyle, styles.animatedView]}>
          <Image source={iconUrl} style={styles.image} />
        </Animated.View>
      </Pressable>
      <View style={styles.titleAndInput}>
        <Pressable onPress={bringKeyboard} style={styles.titleContainer}>
          <GradientText
            textStyle={styles.titleText}
            colorSet={["#7B45E7", "#52E1FD"]}
            location={[0, 0.5]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            shouldChangeColor={isFocus}
            sizeAnim={fontStyle}
          >
            {title}
          </GradientText>
        </Pressable>
        <View style={styles.inputContainer}>
          <TextInput
            value={value ? value : ""}
            ref={inputRef}
            onFocus={onFocus}
            editable={title !== SocialMedia.PHONE_NUMBER}
            onBlur={onBlur}
            defaultValue={
              defaultValue !== undefined && defaultValue
                ? defaultValue
                : undefined
            }
            placeholder={placeHolder}
            placeholderTextColor={"#636c72"}
            style={[
              styles.textField,
              colorProvider,
              Platform.OS === "ios" ? { height: p2d(20) } : { height: p2d(50) },
            ]}
            onChangeText={memorisedTextChanged}
          />
          {markerProvider}
        </View>
      </View>
      <View style={styles.checkButtonContainer}>{checkButtonProvider}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    height: p2d(90),
    justifyContent: "center",
    alignItems: "center",
  },
  titleAndInput: {
    flexDirection: "column",
    flex: 5,
  },
  checkButtonContainer: {
    alignItems: "center",
    flex: 2,
    alignSelf: "stretch",
    justifyContent: "flex-end",
  },
  logoContainer: {
    flex: 2,
    alignSelf: "stretch",
    alignItems: "center",
    paddingTop: p2d(5),
    justifyContent: "flex-start",
  },
  titleText: {
    lineHeight: p2d(30),
    fontStyle: "normal",
    fontWeight: "700",
    fontFamily: "Quantico",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  animatedView: {
    width: p2d(42),
    height: p2d(42),
  },
  image: {
    height: "100%",
    width: "100%",
  },
  gradientText: {
    fontWeight: "700",
    fontSize: p2d(10),
    fontFamily: "Quantico",
  },
  textField: {
    borderBottomWidth: 1,
    fontSize: p2d(12),
    paddingStart: p2d(5),
    fontWeight: "400",
    fontStyle: "normal",
    fontFamily: "Quantico",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
});

export default LinkItem;
