import MaskedView from "@react-native-community/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";

import { StyleProp, Text, TextStyle } from "react-native";
import Animated from "react-native-reanimated";
type GradientTextProps = {
  textStyle: StyleProp<TextStyle>;
  location: number[];
  colorSet: string[];
  children: React.ReactNode;
  shouldChangeColor?: boolean;
  sizeAnim?: { fontSize: number };
  start?: { x: number; y: number };
  end?: { x: number; y: number };
};
interface MaskedViewFix extends React.Component {}
const MaskView = MaskedView as any as {
  new (): MaskedViewFix;
};

const GradientText = (props: GradientTextProps) => {
  const {
    textStyle,
    colorSet,
    location,
    shouldChangeColor,
    sizeAnim,
    end,
    start,
    children,
  } = props;
  const maskProps: any = {
    maskElement: (
      <Animated.Text
        children={children}
        style={[textStyle, sizeAnim && sizeAnim]}
      />
    ),
  };
  const colorProvider = useMemo(() => {
    if (shouldChangeColor != undefined) {
      if (shouldChangeColor) {
        return colorSet;
      } else {
        return ["black", "black"];
      }
    } else {
      return colorSet;
    }
  }, [colorSet, shouldChangeColor]);

  return (
    <MaskView {...maskProps}>
      <LinearGradient
        locations={location}
        colors={colorProvider}
        start={start}
        end={end}
      >
        <Text children={children} style={[textStyle, { opacity: 0 }]} />
      </LinearGradient>
    </MaskView>
  );
};

export default GradientText;
