import React from "react";
import { Image, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { p2d } from "../../util/pixel";
// import {t} from 'react-native-tailwindcss';
import * as iconList from "./images";
export interface IconsProps {
  size?: "default" | "small" | "large" | number | number[]; // size
  type: keyof typeof iconList;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  h?: number;
  w?: number;
}

export const Icons: React.FC<IconsProps> = (props) => {
  const {
    type,
    size = "default",
    style,
    onPress,
    disabled = false,
    w,
    h,
  } = props;
  const sizeMap = new Map([
    ["default", 20],
    ["small", 15],
    ["large", 25],
  ]);
  let height = sizeMap.get(size as string) || (size as number);
  let width = sizeMap.get(size as string) || (size as number);
  if (typeof size === "object") {
    height = size[0];
    width = size[1];
  }
  const handleClick = () => {
    onPress?.();
  };
  return (
    <TouchableOpacity
      onPress={handleClick}
      activeOpacity={0.85}
      disabled={disabled}
      style={style}
    >
      <Image
        source={iconList[type]}
        style={{
          height: p2d(h || height),
          width: p2d(w || width),
        }}
      />
    </TouchableOpacity>
  );
};
