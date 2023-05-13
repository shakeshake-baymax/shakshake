import React from "react";

import { Text, View, StyleSheet } from "react-native";
import { p2d } from "../../util/pixel";

const ButtonContainer = (props: {
  title: string | null;
  children: React.ReactNode;
}) => {
  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <View style={{ alignItems: "flex-start", width: "90%" }}>
        {props.title ? <Text style={styles.title}>{props.title}</Text> : null}
      </View>
      {props.title ? <View style={styles.separator} /> : null}
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#000000",
    fontWeight: "500",
    fontSize: p2d(20),
    fontStyle: "normal",
    textAlign: "left",
    paddingVertical: p2d(10),
    fontFamily: "Quantico",
  },
  separator: {
    borderBottomWidth: 2,
    borderBottomColor: "#7B45E7",
    backgroundColor: "red",
    width: "90%",
    marginBottom: p2d(10),
  },
});

export default ButtonContainer;
