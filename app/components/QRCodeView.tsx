import React, { FC, useCallback, useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { LinearGradient } from "expo-linear-gradient";
import { Icons } from "./icons";
import linksStateStorage from "../util/storage/linksState";
import homeRequest from "../api/home";
import userStorage from "../util/storage/user";
import { useAuth } from "../hook/useAuth";

const QRCodeView: FC<{ visible: boolean; close: () => void }> = (props) => {
  const { visible, close } = props;
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("ShakeShake.io");

  const generateUrl = useCallback(async () => {
    const arr = [];
    const res = await linksStateStorage.get();
    const user = await userStorage.get();
    for (const [key, value] of Object.entries(res)) {
      if (value) {
        arr.push(key);
      }
    }
    const response = await homeRequest.getTempPageUrl(arr, user.token);
    setUrl(response?.data?.url || "");
    setLoading(false);
  }, []);

  useEffect(() => {
    generateUrl();
  }, [generateUrl, visible]);

  //QR style
  const QRStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: visible ? withSpring(1) : withSpring(0) }],
    };
  });

  //Close button
  const CloseButton = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: visible
            ? withSpring(0, { stiffness: 150 })
            : withSpring(100),
        },
      ],
    };
  });

  return (
    <Modal visible={visible} transparent={true} animationType={"fade"}>
      <Animated.View style={styles.qrContainer}>
        <Animated.View style={QRStyle}>
          <LinearGradient
            colors={["#7B45E7", "#52E1FD"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ padding: 27, borderRadius: 40 }}
          >
            {loading ? (
              <ActivityIndicator
                size={"large"}
                style={{ width: 230, height: 230 }}
                color={"white"}
              />
            ) : (
              <QRCode
                size={230}
                color={"white"}
                logoBackgroundColor={"transparent"}
                backgroundColor={"transparent"}
                value={url}
                logo={require("../../assets/img/logo.png")}
              />
            )}
          </LinearGradient>
          <Text style={styles.scanThis}>Scan this to follow me!</Text>
        </Animated.View>
        <TouchableOpacity onPress={close}>
          <Animated.View style={CloseButton}>
            <LinearGradient
              colors={["#7B45E7", "#52E1FD"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 90,
                width: 90,
                height: 90,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icons type="close_white" size={50} onPress={close} />
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  qrContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
  },
  scanThis: {
    marginTop: 21,
    fontSize: 24,
    fontFamily: "Quantico",
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
});

export default QRCodeView;
