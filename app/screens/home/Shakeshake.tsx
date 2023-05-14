import { useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native";
import { t } from "react-native-tailwindcss";
import NavigationBar from "../../components/NavigationBar";
import GradientText from "../../components/text";
import { p2d } from "../../util/pixel";
import { ErrorView, RanderTitle, ShakeView } from "./shakeshakeBase";

export const ShakeShake = () => {
  const [globalState, setGlobalState] = useState<"wait" | "success" | "error">(
    "wait"
  );
  const [restart, setRestart] = useState(true); // wait 是否重新启动

  // wait 页面摇一摇结束
  const shakeshakeFinish = () => {
    console.log("finish");
    setRestart(false);
    setGlobalState("error");
  };

  // error页面的重新摇一摇
  const hanlderAgain = () => {
    setGlobalState("wait");
    setRestart(true);
  };
  return (
    <View style={[t.flex1]}>
      <NavigationBar
        title="shake"
        renderTitle={() => <RanderTitle globalState={globalState} />}
      />
      {globalState === "wait" && (
        <ShakeView finish={shakeshakeFinish} restart={restart} />
      )}
      {globalState === "error" && (
        <ErrorView
          errorText={"Check your network connection"}
          hanlderAgain={hanlderAgain}
        />
      )}
    </View>
  );
};
