import React from "react";

import { StyleSheet, ActivityIndicator, Text, View } from "react-native";

type LoadingViewProps = {
  flex?: number;
  height?: number | string;
  color?: string;
  position?: "absolute" | "relative";
  width?: number | string;
  saved?: boolean;
};

const LoadingView = (props: LoadingViewProps) => {
  const { flex, height, color, position, width } = props;
  return (
    <View
      style={[
        { flex: flex, height: height, width: width, position: position },
        styles.loaderContainer,
      ]}
    >
      <View style={styles.innerContainer}>
        <ActivityIndicator size={"large"} color={color && color} />
        <Text style={styles.text}>{"Saving..."}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
  },
  innerContainer: {
    backgroundColor: "#FFFFFF",
    width: 100,
    height: 100,
    justifyContent: "center",
    borderRadius: 20,
    alignItems: "center",
  },
  text: {
    fontFamily: "Quantico",
    fontSize: 20,
  },
});

export default LoadingView;
