import React, { useImperativeHandle, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { t } from "react-native-tailwindcss";
import { p2d } from "../util/pixel";

type WaterDropProps = {
  direction: "up" | "down"; // water Droplet direction
  onRef: any;
  callback: () => void; // The callback after the animation is complete
  onPress: () => void; // click the button event
};

export default function WaterDrop(props: WaterDropProps) {
  const { direction, callback, onPress } = props;

  let stretch = p2d(2);
  const radius = p2d(30);
  const M = 0.551915024494;
  const tangentLineLength = radius * M;

  const percent = 1;
  // const stretch = useRef(new Animated.Value(2)).current;
  const [p2, setP2] = useState(
    `${radius * 2 + radius * stretch * percent} ${radius}`
  );
  const [p2L, setP2L] = useState(
    `${radius * 2 + radius * stretch * percent} ${radius - tangentLineLength}`
  );
  const [p2R, setP2R] = useState(
    `${radius * 2 + radius * stretch * percent} ${radius + tangentLineLength}`
  );

  let p1 = `${radius},0`;
  // let p2 = `${radius * 2 + displacementDistance * percent} ${radius}`;
  let p3 = `${radius},${radius * 2}`;
  let p4 = `0,${radius}`;

  let p1L = `${radius - tangentLineLength} 0`;
  let p1R = `${radius + tangentLineLength} 0`;

  // let p2L = `${radius * 2 + displacementDistance * percent} ${
  //   radius - tangentLineLength
  // }`;
  // let p2R = `${radius * 2 + displacementDistance * percent} ${
  //   radius + tangentLineLength
  // }`;

  let p3L = `${radius - tangentLineLength} ${radius * 2}`;
  let p3R = `${radius + tangentLineLength} ${radius * 2}`;

  let p4L = `0 ${radius + tangentLineLength}`;
  let p4R = `0 ${radius - tangentLineLength}`;

  let time: NodeJS.Timer | null;

  useImperativeHandle(props.onRef, () => {
    return {
      start: handleAnim,
    };
  });

  //  const stretch2 = useRef(new Animated.Value(2)).current;
  //  const AnimatedWaterDrop = Animated.createAnimatedComponent(Path);
  // const rotation = useSharedValue('0deg');
  // const animatedStyles = useAnimatedStyle(() => {
  //   return {
  //     transform: [{rotate: withTiming(rotation.value)}],
  //   };
  // });

  const handleAnim = () => {
    clearInterval(time);
    time = setInterval(() => {
      stretch -= 0.3;
      if (stretch < 0.1) {
        stretch = 0;
        callback();
        clearInterval(time);
      }
      const distance = radius * stretch * percent;
      setP2(`${radius * 2 + distance} ${radius}`);
      setP2L(`${radius * 2 + distance} ${radius - tangentLineLength}`);
      setP2R(`${radius * 2 + distance} ${radius + tangentLineLength}`);
    }, 1);
  };

  return (
    <View style={[t.justifyCenter, t.itemsCenter, { height: p2d(160) }]}>
      <Svg
        height={p2d(62)}
        width={p2d(160)}
        style={{
          transform: [{ rotate: direction === "down" ? "270deg" : "90deg" }],
        }}
      >
        <Path
          d={`M${p1}
          C${p1R} ${p2L} ${p2} ${p2R} ${p3R} ${p3} ${p3L} ${p4L} ${p4} ${p4R} ${p1L} ${p1} z`}
          fill="url(#grad)"
          onPress={onPress}
        />
        {/* # want Optimization Animated*/}
        <Animated.View
          style={[
            t.absolute,
            t.itemsCenter,
            t.justifyCenter,
            {
              width: p2d(62),
              height: p2d(62),
            },
          ]}
        >
          <View
            style={[
              styles.xbase,
              {
                transform: [{ rotate: "135deg" }],
              },
            ]}
          />
          <View
            style={[
              styles.xbase,
              {
                transform: [{ rotate: "45deg" }],
              },
            ]}
          />
        </Animated.View>
        <Defs>
          <LinearGradient
            id="grad"
            x1={p2d(-291.881)}
            y1={p2d(-1.72243)}
            x2={p2d(-291.881)}
            y2={p2d(58.1508)}
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#52E1FD" />
            <Stop offset="1" stopColor="#7B45E7" />
          </LinearGradient>
        </Defs>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  xbase: {
    width: 2.5,
    height: p2d(29),
    backgroundColor: "#fff",
    position: "absolute",
    borderRadius: 1.25,
  },
});
