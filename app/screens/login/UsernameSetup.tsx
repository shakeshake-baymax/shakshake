import {
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Screens } from "../Screens";
import GradientText from "../../components/text";
import { p2d } from "../../util/pixel";
import { LinearGradient } from "expo-linear-gradient";
import { SHAKE_TO_LINK_BG } from "../../../assets/icon";
import loginRequest from "../../api/login";
import userStorage from "../../util/storage/user";
import systemStorage from "../../util/storage/system";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

function UsernameSetupScreen(props) {
  const [usernameInput, setUserNameInput] = useState<string>("");
  const [emptyInput, setEmptyInput] = useState<boolean>(false);
  const [user, setUser] = useState({});
  const navigation = useNavigation<any>();

  useEffect(() => {
    // 从本地获取用户数据 / 把这个步骤存在本地
    const asyncEffect = async () => {
      const res = await userStorage.get();
      setUserNameInput(res?.userName || "");
      await systemStorage.set({ step: 1 });
      setUser(res);
    };
    asyncEffect();
  }, []);

  const nextPress = useCallback(async () => {
    const username = usernameInput.trim();
    if (username.length === 0) {
      setUserNameInput("");
      setEmptyInput(true);
      return;
    }
    const res = await loginRequest.newUserSetName(username, user["token"]);
    if (res.status === 200) {
      user["userName"] = username;
      navigation.navigate(Screens.CHOOSE_SOCIAL_LINKS, user);
    }
  }, [navigation, user, usernameInput]);

  const onGoback = () => {
    systemStorage.set({ step: 0 });
    if (navigation.getState().routes.length <= 1) {
      navigation.reset({
        index: 0,
        routes: [{ name: Screens.WELCOME }],
      });
    } else {
      navigation.popToTop();
      // navigation.goBack();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.root}>
        <View style={[styles.header]}>
          <View style={styles.buttonAndTitle}>
            <View style={styles.topHeader}>
              <Pressable style={styles.button} onPress={onGoback}>
                <FontAwesome
                  color={"#7C5BE0"}
                  name={"angle-left"}
                  size={p2d(32)}
                />
              </Pressable>
              <Pressable style={[styles.buttonContainer]} onPress={nextPress}>
                <Text style={styles.buttonTitle}>Next</Text>
              </Pressable>
            </View>

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
        {/* ----- */}
        <View style={[{ paddingHorizontal: p2d(27) }]}>
          <Text style={styles.text}>Your name is</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={usernameInput}
              placeholder={emptyInput ? "Empty name is not allowed!" : ""}
              placeholderTextColor={"red"}
              onChangeText={(text: string) => {
                setUserNameInput(text);
                setEmptyInput(false);
              }}
              autoFocus={true}
              style={emptyInput ? styles.placeHolderText : styles.inputText}
            />
            <LinearGradient
              colors={["#7B45E7", "#52E1FD", "#7B45E7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.5, 0.9]}
              style={styles.underLine}
            />
          </View>
          <View>
            <Text style={styles.subtext}>
              You could modify the user name from settings
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    padding: "5%",
  },
  inputText: {
    paddingLeft: 5,
    fontSize: p2d(20),
    fontFamily: "Quantico",
    color: "black",
  },
  placeHolderText: {
    paddingLeft: 5,
    fontSize: p2d(20),
    opacity: 0.4,
    fontFamily: "Quantico",
  },
  text: {
    fontStyle: "normal",
    fontSize: p2d(24),
    fontWeight: "700",
    fontFamily: "Quantico",
    color: "#7B45E7",
    lineHeight: p2d(25),
    width: "100%",
    textAlign: "left",
  },
  underLine: {
    width: "100%",
    height: p2d(3),
    bottom: 0,
    borderRadius: p2d(5),
  },
  inputContainer: {
    height: height / 13,
    justifyContent: "center",
  },
  subtext: {
    color: "#7B45E7",
    fontSize: p2d(14),
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
  topHeader: {
    width: width,

    justifyContent: "space-between",
    paddingEnd: width / 9,
    alignContent: "center",
    flexDirection: "row",
  },
  imgContainer: {
    zIndex: 1,

    position: "relative",
    flex: 1.4,
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
    zIndex: 2,
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
  buttonContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
    width: p2d(60),
    height: p2d(60),
  },
  buttonTitle: {
    fontSize: p2d(16),
    fontWeight: "600",
    fontStyle: "normal",
    fontFamily: "Quantico",
    color: "#7C5BE0",
  },
});

export default UsernameSetupScreen;
