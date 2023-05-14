import { useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "react-native";
import { t } from "react-native-tailwindcss";
import BoxSize from "../../components/BoxSize";
import { Icons } from "../../components/icons";
import GradientText from "../../components/text";
import { p2d } from "../../util/pixel";

interface RanderTitleProps {
  globalState: "wait" | "success" | "error";
}
// 渲染头部标题
export const RanderTitle = (props: RanderTitleProps) => {
  const { globalState } = props;
  return (
    <View>
      {globalState === "error" ? (
        <Text style={styles.text}>Uh-oh</Text>
      ) : (
        <GradientText
          textStyle={[
            { fontSize: p2d(24), fontFamily: "Quantico", fontWeight: "700" },
          ]}
          colorSet={["#7B45E7", "#52E1FD"]}
          location={[0, 0.5]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          Let’s SHAKE together
        </GradientText>
      )}
    </View>
  );
};

// 摇一摇页面
interface ShakeViewProps {
  finish: () => void;
  restart: boolean;
}
let timer = null;
export const ShakeView = (props: ShakeViewProps) => {
  const { restart, finish } = props;
  const [timeNumber, setTimeNumber] = useState<string | number>("");

  const hanlderShakeShake = () => {
    let i = 5;
    timer = setInterval(() => {
      if (i === 0) {
        setTimeNumber("");
        clearInterval(timer);
        finish();
        return;
      }
      setTimeNumber(i);
      i--;
    }, 1000);
  };

  useEffect(() => {
    if (restart) {
      hanlderShakeShake();
    }
  }, [restart]);

  return (
    <View style={[t.flex1]}>
      <View style={[t.flexRow, t.itemsCenter, { paddingLeft: p2d(87) }]}>
        <Icons type="shakeshake" size={p2d(100)} />
        <Text
          style={[{ fontSize: p2d(36), fontWeight: "700", color: "#7B45E7" }]}
        >
          {timeNumber}
        </Text>
      </View>
    </View>
  );
};

// 错误页面
interface ErrorViewProps {
  errorText: string;
  hanlderAgain: () => void;
}
export const ErrorView = (props: ErrorViewProps) => {
  const { errorText, hanlderAgain } = props;
  return (
    <View style={[t.flex1]}>
      <BoxSize height={p2d(40)} />
      <View style={[t.itemsCenter, t.justifyCenter]}>
        <Icons type="shake_close" size={p2d(240)} />
      </View>
      <BoxSize height={p2d(40)} />
      <View style={{ paddingLeft: p2d(40) }}>
        <Text style={styles.text}>It seems there’s no match.</Text>
        <BoxSize height={p2d(15)} />
        <Text style={styles.errorText}>{errorText}</Text>
        <BoxSize height={p2d(10)} />
        <Text style={styles.errorText}>SHAKE with your friends together</Text>
      </View>
      <BoxSize height={p2d(40)} />
      <View style={[t.itemsCenter]}>
        <GradientText
          textStyle={[
            { fontSize: p2d(24), fontFamily: "Quantico", fontWeight: "700" },
          ]}
          colorSet={["#7B45E7", "#52E1FD"]}
          location={[0, 0.5]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          SHAKE your phone again!
        </GradientText>
        <BoxSize height={p2d(15)} />
        <TouchableOpacity onPress={hanlderAgain}>
          <GradientText
            textStyle={[
              {
                fontSize: p2d(24),
                fontFamily: "Quantico",
                fontWeight: "700",
                textDecorationLine: "underline",
              },
            ]}
            colorSet={["#7B45E7", "#52E1FD"]}
            location={[0, 0.5]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            Try Again
          </GradientText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: { fontSize: p2d(24), fontFamily: "Quantico", fontWeight: "700" },
  errorText: {
    fontSize: p2d(12),
    fontFamily: "Quantico",
    fontWeight: "700",
    color: "#7B45E7",
  },
});
