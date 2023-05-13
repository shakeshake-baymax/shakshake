import React, { useCallback, useRef } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
const CODE_LENGTH = 5;
const { height } = Dimensions.get("window");
function CodeInput(props: {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  authSucceeded: boolean;
}) {
  const { code, setCode, authSucceeded } = props;
  const codeDigitsArray = new Array(CODE_LENGTH).fill(0);
  const ref = useRef<TextInput>(null);

  // const [containerIsFocused, setContainerIsFocused] = useState(false);

  const handleOnPress = useCallback(() => {
    // setContainerIsFocused(true);
    ref?.current?.focus();
  }, []);

  const toDigitInput = useCallback(
    (_value: number, idx: number) => {
      const emptyInputChar = " ";
      const digit = code[idx] || emptyInputChar;
      return (
        <View style={styles.inputContainer} key={idx}>
          <Text style={styles.inputText}>{digit}</Text>
        </View>
      );
    },
    [code]
  );
  const toDigitInputError = useCallback(
    (_value: number, idx: number) => {
      const emptyInputChar = " ";
      const digit = code[idx] || emptyInputChar;
      return (
        <View
          style={[styles.inputContainer, { borderBottomColor: "#EB5545" }]}
          key={idx}
        >
          <Text style={[styles.inputText, { color: "#EB5545" }]}>{digit}</Text>
        </View>
      );
    },
    [code]
  );
  return (
    <View style={[styles.container, { height: height / 10 }]}>
      <Pressable style={styles.inputsContainer} onPress={handleOnPress}>
        {authSucceeded
          ? codeDigitsArray.map(toDigitInput)
          : codeDigitsArray.map(toDigitInputError)}
      </Pressable>
      <TextInput
        ref={ref}
        value={code}
        autoFocus={true}
        onChangeText={(text) => {
          const newText = text.replace(/[^\d]+/, "");
          //setState({ skuNumber: newText });
          setCode(newText);
        }}
        keyboardType="number-pad"
        returnKeyType="done"
        textContentType="oneTimeCode"
        maxLength={CODE_LENGTH}
        style={styles.hiddenCodeInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  hiddenCodeInput: {
    position: "absolute",
    height: 0,
    width: 0,
    opacity: 0,
  },
  inputsContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    borderBottomColor: "#7B45E7",
    borderBottomWidth: 2,
    height: 60,
    width: 55,
    alignItems: "center",
  },
  inputText: {
    fontSize: 50,
    // fontFamily: 'Inter',
    color: "#7B45E7",
  },
});

export default CodeInput;
