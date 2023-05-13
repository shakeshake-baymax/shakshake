import React, { useCallback, useEffect, useRef } from "react";

import { Image, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { CircularProgressBase } from "react-native-circular-progress-indicator";
import { CODE_CONFIRMED, GO_NEXT } from "../../../assets/icon";

const SIZE = 80;
type ProgressBarProps = {
  width: string;
  height: string | number;
  shouldPlay: boolean;
  onNext: () => void;
};
const CircleProgressBar = (props: ProgressBarProps) => {
  const { shouldPlay, onNext } = props;
  const progressRef = useRef<any>(null);
  const scale = useSharedValue(0);
  const scaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value) }],
    };
  });
  const checkOpacity = useSharedValue(1);
  const arrowOpacity = useSharedValue(0);
  const checkStyle = useAnimatedStyle(() => {
    return {
      opacity: checkOpacity.value,
    };
  });
  const arrowStyle = useAnimatedStyle(() => {
    return {
      opacity: arrowOpacity.value,
    };
  });
  useEffect(() => {
    if (shouldPlay) {
      progressRef.current?.play();
    } else {
    }
    return () => {};
  }, [shouldPlay]);

  const onAnimationComplete = useCallback(() => {
    scale.value = withSpring(1, { mass: 0.4, stiffness: 120 }, () => {
      arrowOpacity.value = withTiming(1, { duration: 900 }, () => {
        checkOpacity.value = withTiming(0, { duration: 700 });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onPress = useCallback(() => {
    onNext();
  }, [onNext]);

  return (
    <View {...props} style={{ alignItems: "center", justifyContent: "center" }}>
      <CircularProgressBase
        ref={progressRef}
        value={100}
        duration={1000}
        strokeLinecap={"round"}
        radius={40}
        startInPausedState={true}
        inActiveStrokeOpacity={0}
        // showProgressValue={false}
        activeStrokeColor={"#7B45E7"}
        activeStrokeSecondaryColor={"#52E1FD"}
        onAnimationComplete={onAnimationComplete}
      />
      <Animated.View
        onTouchEnd={onPress}
        style={[styles.gradientView, scaleAnimation]}
      >
        <>
          <Animated.View style={[{ position: "absolute" }, checkStyle]}>
            <Image
              source={CODE_CONFIRMED}
              style={{ resizeMode: "contain", width: SIZE, height: SIZE }}
            />
          </Animated.View>
          <Animated.View style={[{ position: "absolute" }, arrowStyle]}>
            <Image
              source={GO_NEXT}
              style={{ resizeMode: "contain", width: SIZE, height: SIZE }}
            />
          </Animated.View>
        </>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientView: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    position: "absolute",
    overflow: "hidden",
  },
  innerView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default CircleProgressBar;
