import React, { useCallback } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Pressable,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import KeyboardAwareScrollView from "react-native-keyboard-aware-scroll-view";
import Animated, { SharedValue } from "react-native-reanimated";
const KeyBoardAvoidingWrapper = (props: {
  children: any;
  animationStyle?: { opacity: number };
  sharedValue?: SharedValue<number>;
  isSaving: boolean;
}) => {
  const { children, animationStyle, sharedValue, isSaving } = props;
  const onFocusEffect = useCallback(() => {
    // AvoidSoftInput.setAdjustPan();
    // return () => {
    //   AvoidSoftInput.setDefaultAppSoftInputMode();
    // };
  }, []);

  useFocusEffect(onFocusEffect);
  return (
    <Animated.View
      style={[
        styles.screenContainer,
        animationStyle && animationStyle,
        { opacity: isSaving ? 0.5 : 1 },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyBoardAvoidingView}
        behavior={"position"}
      >
        <ScrollView
          style={styles.scrollTo}
          contentContainerStyle={styles.scrollContainer}
        >
          <Pressable
            style={{ height: "100%", alignSelf: "stretch" }}
            onPress={() => {
              if (sharedValue && sharedValue.value === 0.5) {
                sharedValue.value = 1;
              }
              Keyboard.dismiss();
            }}
          >
            {children}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  scrollTo: {
    height: "100%",
  },
  screenContainer: {
    alignItems: "center",
    alignSelf: "stretch",
    flex: 1,
  },
  keyBoardAvoidingView: {
    alignSelf: "stretch",
  },
});

export default KeyBoardAvoidingWrapper;
