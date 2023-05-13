import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import Svg, { Defs, Mask, Rect, Circle } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import { t } from "react-native-tailwindcss";
import { Icons } from "../../components/icons";
import NavigationBar from "../../components/NavigationBar";
import { p2d } from "../../util/pixel";
import { useState } from "react";
const { width, height } = Dimensions.get("window");
const defaultPhoto = require("../../../assets/img/logo.png");
const WrappedSvg = () => {
  return (
    <View style={{ width: "100%", height: "100%", aspectRatio: 1 }}>
      <Svg height={"100%"} width={"100%"} viewBox={"0 0 100 100"}>
        <Defs>
          <Mask id={"mask"} height={width} width={width} x={0} y={0}>
            <Rect width={"100%"} height={"100%"} fill={"#ffffff"} />
            <Circle r={"50%"} cx={"50%"} cy={"50%"} fill={"black"} />
          </Mask>
        </Defs>
        <Rect
          width={"100%"}
          height={"100%"}
          mask="url(#mask)"
          fill={"rgba(217,217,217,0.3)"}
          fillOpacity={1}
        />
      </Svg>
    </View>
  );
};
export const SelectPhoto = () => {
  const onSelectPhoto = () => {
    handleChoosePhotoPress();
  };
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChoosePhotoPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("需要访问您的媒体库才能选择照片！");
      return;
    }

    // 打开图像库并允许用户选择图像
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // 剪裁所选图像
      const manipulatedImage = await manipulateAsync(
        result.assets[0].uri,
        [
          { resize: { width: 300 } },
          {
            crop: {
              originX: 0,
              originY: 0,
              width: 300,
              height: 300,
            },
          },
        ],
        { compress: 1, base64: true }
      );
      setSelectedImage(manipulatedImage.uri);
    }
  };
  return (
    <View>
      <NavigationBar title="Library" />
      <View style={[styles.container]}>
        <ImageBackground
          resizeMode={"cover"}
          style={[styles.imageBG]}
          source={selectedImage ? { uri: selectedImage } : defaultPhoto}
        >
          <WrappedSvg />
        </ImageBackground>
        <View
          style={[
            t.wFull,
            t.flexRow,
            t.itemsCenter,
            {
              height: p2d(50),
              paddingVertical: p2d(16),
              paddingHorizontal: p2d(21),
            },
          ]}
        >
          <Text
            style={{ color: "#7B45E7", fontSize: p2d(16) }}
            onPress={onSelectPhoto}
          >
            Recents
          </Text>
          <Icons
            type="headerBarArrow"
            style={{ marginLeft: p2d(24), transform: [{ rotate: "270deg" }] }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBG: {
    width: width,
    height: width,
  },
  innerItem: {
    alignItems: "center",
  },
  textStyle: {
    flex: 1,
    textAlign: "center",
    fontSize: p2d(20),
    fontWeight: "700",
  },
  buttonTile: {
    fontSize: p2d(16),
    fontWeight: "500",
    color: "#7B45E7",
  },
});
