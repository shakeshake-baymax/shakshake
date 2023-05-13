import React from "react";
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
} from "react-native";
import { SMModel } from "../../api/models/User";
import { SocialMedia } from "../../util/concat";
import { p2d } from "../../util/pixel";
import { Icons } from "../icons";

type LogoButtonProps = {
  onPress: (isCheck: boolean, logo: SocialMedia) => void;
  smLink: SMModel;
  visible: boolean;
  logo: ImageSourcePropType;
};

function LogoButton(props: LogoButtonProps) {
  const { onPress, smLink, visible, logo } = props;
  if (visible) {
    return (
      <Pressable
        style={{ width: p2d(60), height: p2d(60) }}
        onPress={() => onPress(!smLink?.isExposed, smLink?.smName)}
      >
        <ImageBackground
          source={logo}
          resizeMode={"contain"}
          style={styles.backGround}
        >
          {smLink?.isExposed && <Icons type="check" />}
        </ImageBackground>
      </Pressable>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  check: {
    position: "absolute",
    width: "30%",
    height: "30%",
  },
  backGround: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flex: 1,
  },
});

export default LogoButton;
