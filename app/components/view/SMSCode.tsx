import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CodeInput from "../custom_inputs/CodeInput";
import Animated, {
  FadeInDown,
  FadeOutDown,
  Layout,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import CircleProgressBar from "./CircleProgressBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { p2d } from "../../util/pixel";
import GradientText from "../text";
import { useAuth } from "../../hook/useAuth";
import useCountdown from "../../hook/useCountDown";
import loginRequest from "../../api/login";
import { User } from "../../api/models/User";
import { AuthResult } from "../../context/userContext";
import { Screens } from "../../screens/Screens";
import userStorage from "../../util/storage/user";
type SMSCodeViewProps = {
  phoneNumber: string;
  countryCode: string;
  navigation: NativeStackNavigationProp<any>;
};

const CODE_LENGTH = 5;

const SMSCodeView = ({
  phoneNumber,
  countryCode,
  navigation,
}: SMSCodeViewProps) => {
  const [code, setCode] = useState("");
  const { bottom } = useSafeAreaInsets();
  const { setCurrentUser } = useAuth();
  const userRef = useRef<User | null>(null);
  const [authSucceeded, setAuthSucceeded] = useState(true);
  const [shouldPlay, setShouldPlay] = useState(false);
  const { timeRemaining, resetTimer, startCounting, stopTimer } =
    useCountdown(30);
  const resendButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: timeRemaining < 0 ? withTiming(1) : withTiming(0.3),
      transform: [
        {
          scale:
            timeRemaining < 0 ? withSpring(1, { mass: 0.1 }) : withSpring(0.9),
        },
      ],
    };
  });
  // 重新发送
  const resendCode = useCallback(() => {
    setCode("");
    setAuthSucceeded(true);
    loginRequest.sendSMSCode(phoneNumber.replace(/\s/g, ""), countryCode);
    resetTimer();
    startCounting();
  }, [phoneNumber, countryCode]);

  // 进入到这个组件，当监听到input输入超过5，那么直接请求
  useEffect(() => {
    if (code.length === CODE_LENGTH) {
      Keyboard.dismiss();
      loginRequest
        .authenticateWithSMS(phoneNumber.replace(/\s/g, ""), code, countryCode)
        .then(({ user, error }: AuthResult) => {
          if (user !== undefined && error === undefined) {
            stopTimer();
            userRef.current = user;
            setAuthSucceeded(true);
            setShouldPlay(true);
          } else {
            setAuthSucceeded(false);
          }
        });
    }
  }, [code, phoneNumber, countryCode]);

  const memorizedText = useMemo(() => {
    return (
      <Text
        style={{
          fontWeight: "700",
          fontSize: p2d(18),
          color: "#7B45E7",
          lineHeight: p2d(25),
          fontFamily: "Quantico",
        }}
      >
        {`A verification code has been sent to\n+${countryCode} ${phoneNumber}`}
      </Text>
    );
  }, [phoneNumber, countryCode]);
  // 点击了下一步
  const onNext = useCallback(() => {
    if (userRef.current) {
      // 更新全局/本地的用户数据
      setCurrentUser(userRef.current);
      userStorage.set(userRef.current).then(() => {
        // 判断是新用户还是老用户 如果是新用户，那么此刻发起请求将它变为老用户
        if (userRef.current.isNewUser) {
          navigation.navigate(Screens.USERNAME_SETUP);
        } else {
          navigation.navigate(Screens.ROOT);
        }
      });
    }
  }, [userRef.current]);
  return (
    <>
      <Animated.View
        entering={FadeInDown.delay(700)}
        layout={Layout}
        style={styles.codeInputContainer}
      >
        {memorizedText}
        <CodeInput
          authSucceeded={authSucceeded}
          code={code}
          setCode={setCode}
        />
        <View style={styles.errorLabel}>
          {!authSucceeded ? (
            <Text style={styles.errorText}>
              Please check your phone number and try again
            </Text>
          ) : undefined}
        </View>
        {shouldPlay ? null : (
          <Animated.View
            style={resendButtonStyle}
            exiting={FadeOutDown.duration(500)}
            layout={Layout}
          >
            <Pressable
              onPress={resendCode}
              style={[
                styles.resendButton,
                { borderColor: timeRemaining < 0 ? "#7B45E7" : "#A6A6A6" },
              ]}
              disabled={timeRemaining > 0}
            >
              <Text
                style={{
                  color: timeRemaining < 0 ? "#7B45E7" : "#A6A6A6",
                  fontFamily: "Quantico",
                  fontWeight: "700",
                  fontSize: p2d(18),
                }}
              >
                {timeRemaining < 0
                  ? "Resend a code"
                  : "Resend a code in " + timeRemaining + " s"}
              </Text>
            </Pressable>
          </Animated.View>
        )}
        <CircleProgressBar
          onNext={onNext}
          shouldPlay={shouldPlay}
          width={"100%"}
          height={p2d(100)}
        />
      </Animated.View>
      {shouldPlay && (
        <View style={{ position: "absolute", width: "100%", bottom: bottom }}>
          <Text style={styles.agreementText}>
            By continuing you agree to SHAKESHAKE’s
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://www.shakeshake.io/terms-of-service")
              }
            >
              <GradientText
                textStyle={{ fontSize: 12, fontWeight: "700" }}
                location={[0, 1]}
                colorSet={["#7B45E7", "#52E1FD"]}
              >
                Terms of Service
              </GradientText>
            </TouchableOpacity>
            <Text
              style={{ fontSize: 12, fontWeight: "700", marginHorizontal: 7 }}
            >
              and
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://www.shakeshake.io/privacy-policy")
              }
            >
              <GradientText
                textStyle={{ fontSize: 12, fontWeight: "700" }}
                location={[0, 1]}
                colorSet={["#7B45E7", "#52E1FD"]}
              >
                Privacy Policy
              </GradientText>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  codeInputContainer: {
    // position: 'absolute',
    paddingHorizontal: p2d(25),
    height: "50%",
    width: "100%",
  },
  errorLabel: {
    width: "100%",
    height: p2d(80),
    justifyContent: "center",
  },
  errorText: {
    fontStyle: "normal",
    fontFamily: "Quantico",
    fontSize: p2d(18),
    fontWeight: "700",
    color: "#EB5545",
  },
  resendButton: {
    width: "100%",
    height: p2d(57),
    borderRadius: p2d(57) / 2,
    borderColor: "#7B45E7",
    borderWidth: p2d(4),
    alignItems: "center",
    justifyContent: "center",
  },
  agreementText: {
    textAlign: "center",
    fontSize: p2d(12),
    fontWeight: "700",
    marginBottom: 5,
  },
});

export default SMSCodeView;
