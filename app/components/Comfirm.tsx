import React from "react";

import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { t } from "react-native-tailwindcss";
import { p2d } from "../util/pixel";
import BoxSize from "./BoxSize";

type ConfirmViewProps = {
  title?: string;
  context?: number | string;
  onNo: () => void;
  onYes: () => void;
};

const ConfirmView = (props: ConfirmViewProps) => {
  const { title, context, onNo, onYes } = props;
  return (
    <View style={[t.bgWhite, { width: p2d(286), borderRadius: p2d(20) }]}>
      <View style={[t.itemsCenter, { paddingVertical: p2d(30) }]}>
        <Text style={styles.text}>{title}</Text>
        <Text style={styles.text}>{context}</Text>
      </View>
      <BoxSize height={p2d(1)} bgColor={"#A6A6A6"} />
      <View style={[t.wFull, t.flexRow]}>
        <TouchableOpacity
          style={[
            t.flex1,
            t.justifyCenter,
            t.itemsCenter,
            { paddingVertical: p2d(15) },
          ]}
          onPress={onNo}
        >
          <Text style={styles.text}>No</Text>
        </TouchableOpacity>
        <BoxSize width={p2d(1)} bgColor={"#A6A6A6"} />
        <TouchableOpacity
          style={[
            t.flex1,
            t.justifyCenter,
            t.itemsCenter,
            { paddingVertical: p2d(15) },
          ]}
          onPress={onYes}
        >
          <Text style={[styles.text, { color: "#EB5545" }]}> Yes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    fontFamily: "Quantico",
    fontSize: 20,
  },
});

export default ConfirmView;
