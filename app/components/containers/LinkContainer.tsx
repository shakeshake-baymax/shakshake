import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const LinkContainer = (props: { children: React.ReactNode }) => {
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      enableResetScrollToCoords={false}
      style={[styles.container]}
    >
      {props.children}
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default memo(LinkContainer);
