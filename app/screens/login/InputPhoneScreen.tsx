import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  View,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeOutDown,
  Layout,
} from "react-native-reanimated";
import PhoneInput from "react-native-phone-number-input-forked/lib/index";
import { t } from "react-native-tailwindcss";
import { p2d } from "../../util/pixel";
import { CLEAR_BUTTON, SHAKE_TO_LINK_BG } from "../../../assets/icon";
import GradientText from "../../components/text";
import SMSCodeView from "../../components/view/SMSCode";
import loginRequest from "../../api/login";
import { Icons } from "../../components/icons";
import NumberUtility from "../../util/Utilities/NumberUtility";

const InputPhoneScreen = (props) => {
  const { navigation } = props;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [tips, setTips] = useState("");
  const [sendPressed, setSendPressed] = useState(false);

  //phoneNumber
  const [countryCode, setCountryCode] = useState("1");
  const phoneInput = useRef<PhoneInput>(null);
  // 清除输入框
  const onClear = useCallback(() => {
    phoneInput.current?.setState({ number: "" });
  }, []);
  // 国家代码改变
  const SetCountryCode = useCallback(
    (countryCode: string) => {
      setCountryCode(countryCode);
    },
    [phoneNumber]
  );
  // 手机号输入框改变
  const memorizedOnChangeText = useCallback(
    (string: string) => {
      setPhoneNumber(string);
      // 当输入的手机号的尾数达到 9以上时候进行验证 验证手机号及对应的国家代码是否合法
      // 优化的点，是根据当前国家代码来判断该国家的手机号是多少，再决定从哪个位数开始
      if (string.length >= 10) {
        const res = NumberUtility.validatePhoneNumber(countryCode, string);
        if (res) {
          setTips("");
        } else {
          setTips("Error - Invalid phone number");
        }
        setIsValid(res);
      }
    },
    [countryCode]
  );
  // 请求验证码
  const getCode = useCallback(async () => {
    setSendPressed(true);
    await loginRequest.sendSMSCode(phoneNumber, countryCode);
  }, [phoneNumber, countryCode]);

  return (
    <SafeAreaView style={[t.flex1, t.bgWhite]}>
      <ScrollView contentContainerStyle={[t.flex1]}>
        <View style={[styles.header]}>
          <View style={styles.buttonAndTitle}>
            <Pressable style={styles.button} onPress={navigation.goBack}>
              <Icons
                type="headerBarArrow"
                size={24}
                onPress={navigation.goBack}
              />
            </Pressable>
            <View style={styles.textContainer}>
              <GradientText
                textStyle={styles.gradientText}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                location={[0, 0.5]}
                colorSet={["#7B45E7", "#52E1FD"]}
              >
                SIGN IN
              </GradientText>
            </View>
          </View>
          <View style={styles.imgContainer}>
            <Image style={styles.img} source={SHAKE_TO_LINK_BG} />
          </View>
        </View>
        {sendPressed ? (
          <SMSCodeView
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            navigation={navigation}
          />
        ) : (
          <Animated.View
            style={styles.container}
            exiting={FadeOutDown.duration(500)}
            layout={Layout}
          >
            <Text style={styles.text}>Enter Your Phone Number</Text>
            <View style={styles.inputContainer}>
              <PhoneInput
                ref={phoneInput}
                defaultValue={phoneNumber}
                defaultCode="US"
                layout="first"
                onChangeText={memorizedOnChangeText}
                onChangeCountry={(country) => {
                  SetCountryCode(country.callingCode[0]);
                }}
                textContainerStyle={{
                  backgroundColor: "rgba(0,0,0,0)",
                }}
                textInputProps={{ maxLength: countryCode == "61" ? 9 : 10 }}
                containerStyle={{
                  width: "100%",
                  height: "100%",
                }}
                textInputStyle={[
                  styles.numberStyle,
                  {
                    letterSpacing: 0.7,
                    height: p2d(50),
                    textAlignVertical: "center",
                  },
                ]}
                countryPickerButtonStyle={{
                  width: "18%",
                  justifyContent: "space-around",
                  flexDirection: "row-reverse",
                }}
                codeTextStyle={[
                  styles.codeStyle,
                  {
                    height: p2d(23),
                    width: p2d(2),
                    backgroundColor: "#7B45E7",
                    color: "rgba(0,0,0,0)",
                  },
                ]}
                autoFocus
              />
              <Pressable onPress={onClear} style={styles.clearButton}>
                <Image
                  style={{
                    resizeMode: "contain",
                    width: p2d(40),
                    height: p2d(40),
                    display: phoneNumber ? "flex" : "none",
                  }}
                  source={CLEAR_BUTTON}
                />
              </Pressable>
              <LinearGradient
                colors={["#7B45E7", "#52E1FD", "#7B45E7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                locations={[0, 0.5, 0.9]}
                style={styles.underLine}
              />
            </View>
            <View style={styles.errorLabel}>
              <Text style={styles.errorText}>{tips}</Text>
            </View>
            {isValid ? (
              <Animated.View
                style={styles.sendButton}
                entering={FadeInDown}
                exiting={FadeOutDown}
                layout={Layout.duration(500)}
                onTouchEnd={getCode}
              >
                <LinearGradient
                  colors={["#7B45E7", "#52E1FD"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  locations={[0, 1]}
                  style={styles.sendButton}
                >
                  <Text style={styles.message}>Send verification code</Text>
                </LinearGradient>
              </Animated.View>
            ) : null}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: p2d(25),
    height: "50%",
  },
  codeStyle: {
    fontStyle: "normal",
    fontSize: p2d(18),
    fontWeight: "700",
    fontFamily: "Quantico",
    // height: 'auto',
  },
  numberStyle: {
    fontStyle: "normal",
    fontSize: p2d(18),
    fontWeight: "700",
    fontFamily: "Quantico",
    height: 40,
  },
  clearButton: {
    position: "absolute",
    width: p2d(50),
    height: p2d(40),
    justifyContent: "center",
    alignItems: "center",
    right: 0,
  },
  text: {
    fontStyle: "normal",
    fontSize: p2d(18),
    fontWeight: "700",
    fontFamily: "Quantico",
    lineHeight: p2d(22),
    width: "100%",
    textAlign: "left",
  },
  inputContainer: {
    height: p2d(50),
    justifyContent: "center",
  },
  underLine: {
    position: "absolute",
    width: "100%",
    height: p2d(3),
    bottom: 0,
    borderRadius: 5,
  },
  errorLabel: {
    width: "100%",
    height: p2d(50),
    justifyContent: "center",
  },
  errorText: {
    fontStyle: "normal",
    fontFamily: "Quantico",
    fontSize: 18,
    fontWeight: "700",
    color: "#EB5545",
    letterSpacing: 0.7,
  },
  sendButton: {
    width: "100%",
    height: p2d(57),
    borderRadius: p2d(57) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    color: "#FFFFFF",
    fontSize: p2d(18),
    fontFamily: "Quantico",
    fontWeight: "700",
  },
  header: {
    height: p2d(280),
    width: "100%",
    flexDirection: "row",
    paddingStart: p2d(25),
    backgroundColor: "white",
  },
  imgContainer: {
    flex: 1.4,
    // backgroundColor: 'red',
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: p2d(250),
    height: p2d(250),
    resizeMode: "contain",
  },
  buttonAndTitle: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  button: {
    height: p2d(60),
    width: p2d(60),
    alignItems: "flex-start",
    justifyContent: "center",
  },
  textContainer: {
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
  },
  gradientText: {
    fontWeight: "700",
    fontSize: p2d(40),
    lineHeight: p2d(50),
    fontFamily: "Quantico",
  },
});

export default InputPhoneScreen;
