import React, { useEffect, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { Icons } from "../../../components/icons";
import { p2d } from "../../../util/pixel";
const { height, width } = Dimensions.get("window");
enum ClickedArea {
  AVATAR = "AVATAR",
  COVER = "COVER",
}
const AVATAR_IMAGE_SIZE = 133;
const COVER_IMAGE_HEIGHT = height / 3;
const COVER_VERTICAL_POSITION = -COVER_IMAGE_HEIGHT / 4;
const AVATAR_VERTICAL_POSITION =
  COVER_IMAGE_HEIGHT + COVER_VERTICAL_POSITION - AVATAR_IMAGE_SIZE / 2;
const defaultSource = require("../../../../assets/bg/app_icon.png");
type AvatarViewProps = {
  source?: string;
  onAvatarPress: (type: ClickedArea) => void;
};

const AvatarImageView = (props: AvatarViewProps) => {
  const { source, onAvatarPress } = props;

  return (
    <>
      <View
        style={[
          styles.container,
          {
            width: p2d(AVATAR_IMAGE_SIZE),
            height: p2d(AVATAR_IMAGE_SIZE),
            top: p2d(AVATAR_VERTICAL_POSITION),
            left: (width - p2d(AVATAR_IMAGE_SIZE)) / 2,
          },
        ]}
      >
        <Image
          resizeMethod={"auto"}
          source={source ? { uri: source } : defaultSource}
          style={styles.avatar}
        />
      </View>
      <Pressable
        onPress={() => onAvatarPress(ClickedArea.AVATAR)}
        style={[
          styles.bottomContainer,
          { right: (width - p2d(AVATAR_IMAGE_SIZE)) / 2 },
        ]}
      >
        <View style={[styles.avatarPickButton]}>
          <Icons
            type="photo"
            size={28}
            onPress={() => onAvatarPress(ClickedArea.AVATAR)}
          />
        </View>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    overflow: "hidden",
    borderRadius: AVATAR_IMAGE_SIZE / 2,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarPickButton: {
    backgroundColor: "#D4C1F8",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    width: p2d(42),
    height: p2d(42),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 42 / 2,
  },
  bottomContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    position: "absolute",
    top: p2d(COVER_IMAGE_HEIGHT + COVER_VERTICAL_POSITION),
    width: p2d(AVATAR_IMAGE_SIZE / 2),
    height: p2d(AVATAR_IMAGE_SIZE / 2),
  },
});

export default AvatarImageView;
