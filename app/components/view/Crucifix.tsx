import { View } from "react-native";
import { t } from "react-native-tailwindcss";
import { p2d } from "../../util/pixel";

export const Crucifix = ({ color }) => {
  return (
    <View style={[t.relative, { height: p2d(30), width: p2d(30) }]}>
      <View
        style={[
          {
            width: p2d(29),
            height: p2d(3),
            backgroundColor: color,
            borderRadius: p2d(10),
            position: "absolute",
            top: p2d(13.5),
          },
        ]}
      />
      <View
        style={[
          {
            width: p2d(29),
            height: p2d(3),
            backgroundColor: color,
            borderRadius: p2d(10),
            position: "absolute",
            transform: [{ rotate: "90deg" }],
            top: p2d(13.5),
          },
        ]}
      />
    </View>
  );
};
