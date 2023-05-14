import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInLeft,
  FadeOutRight,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { t } from "react-native-tailwindcss";
import { Icons } from "../components/icons";
import GradientText from "./text";
import { SocialMedia } from "../util/concat";
import BoxSize from "./BoxSize";
import { p2d } from "../util/pixel";
import verified from "../util/verified";
import { openSocialMediaApp } from "../util/system/openApp";

interface LinkItemProps {
  value: string | null;
  iconUrl: any;
  title: SocialMedia;
  placeHolder: string;
  onTextChange: (text: string | null, title: SocialMedia) => void;
  defaultValue: string | null | undefined;
  visible: boolean;
  delVisible: boolean;
  delSocialLinks?: () => void;
}
let timer;
const LinkItem = (props: LinkItemProps) => {
  const {
    iconUrl,
    value,
    title,
    placeHolder,
    onTextChange,
    visible,
    delVisible,
    delSocialLinks,
  } = props;

  const inputRef = useRef<TextInput>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [inputValue, setInputValue] = useState(() => value || "");
  const [refresh, setRefresh] = useState(false);
  const [deleteDisplay, setDeleteDisplay] = useState(false);
  const [showErr, setShowErr] = useState(false);
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

  const changeText = (text: string) => {
    setInputValue(text);
    if (text === "") {
      onTextChange(text, title);
      setShowErr(false);
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      // 设置最终的值
      onTextChange(text, title);
      // 设置动画显示转圈 检测是否为合法 => 合法则为✔ 不合法则为 × 并提示红色字体
      setRefresh(true);
      verified.verifiedLink(text, title).then((res) => {
        setRefresh(false);
        setShowErr(!res);
      });
    }, 500);
  };

  // 获取焦点
  const onFocus = useCallback(() => {
    setIsFocus(true);
    size.value = 1.5;
    fontSize.value = 24;
  }, []);
  // 失去焦点
  const onBlur = useCallback(() => {
    setIsFocus(false);
    size.value = 1;
    fontSize.value = 20;
  }, []);

  const bringKeyboard = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef.current]);

  const rota = useSharedValue(0);
  const left = useSharedValue(-20);
  const opacity = useSharedValue(0);
  const spin = useSharedValue(0);

  const spinStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${spin.value}deg` }],
    };
  });

  // 无限循环刷新动画，后期考虑使用lottie替代，所以先弄出来了
  const rotateAnimated = () => {
    spin.value = withTiming(
      360,
      {
        duration: 1000,
      },
      () => {
        spin.value = 0;
        runOnJS(rotateAnimated)();
      }
    );
  };
  useEffect(() => {
    runOnJS(rotateAnimated)();
  }, []);

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
      left.value = -40;
      opacity.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delVisible]);
  const handlerCheck = () => {
    if (inputValue === "") {
      return;
    }
    openSocialMediaApp(title, inputValue);
  };
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
        {title !== SocialMedia.PHONE_NUMBER && (
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
              <Icons type={"exclude"} onPress={excludeOnPress} />
            </Animated.View>
            <Icons
              type={"excludeConfirm"}
              style={{
                display: deleteDisplay ? "flex" : "none",
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
            value={inputValue}
            ref={inputRef}
            onFocus={onFocus}
            editable={title !== SocialMedia.PHONE_NUMBER}
            onBlur={onBlur}
            placeholder={placeHolder}
            placeholderTextColor={"#636c72"}
            style={[
              styles.textField,
              { borderColor: showErr ? "#FF0000" : "#000000" },
              { color: showErr ? "#FF0000" : "#000000" },
              Platform.OS === "ios" ? { height: p2d(20) } : { height: p2d(50) },
            ]}
            onChangeText={changeText}
          />
          <View
            style={[
              t.absolute,
              t.right0,
              { bottom: p2d(2), display: refresh ? "flex" : "none" },
            ]}
          >
            {/* 是否显示转圈圈 */}
            <Animated.View style={[spinStyle]}>
              {/* 这里是需要旋转的元素 */}
              <Icons type="refresh" size={14} />
            </Animated.View>
          </View>
        </View>
      </View>
      <BoxSize width={p2d(10)} />
      {["Phone number", "Email"].indexOf(title) === -1 ? (
        <TouchableOpacity
          style={[t.hFull, t.justifyEnd, { width: p2d(30) }]}
          activeOpacity={0.85}
          onPress={handlerCheck}
        >
          <Icons type="RightArrow" onPress={handlerCheck} />
          <GradientText
            textStyle={styles.gradientText}
            location={[0, 0.7]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colorSet={["#FCA2D5", "#7B45E7"]}
          >
            Check
          </GradientText>
        </TouchableOpacity>
      ) : (
        <BoxSize width={p2d(30)} />
      )}
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
