import React, { useRef } from "react";

import { View, StyleSheet, Dimensions, TextInput } from "react-native";
import { Icons } from "../../../components/icons";
import { p2d } from "../../../util/pixel";
// import Ionicons from "react-native-vector-icons/Ionicons";

type SearchBarProps = {
  placeHolder: string;
  value: string;
  defaultValue: string;
  onTextChange?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};
const { width, height } = Dimensions.get("window");

function SearchInputField(props: SearchBarProps) {
  const { placeHolder, defaultValue, onTextChange, onFocus, onBlur, value } =
    props;
  const inputTextRef = useRef<TextInput>(null);
  return (
    <View style={styles.container}>
      <Icons type="search" size={30} />
      <TextInput
        ref={inputTextRef}
        onBlur={() => {
          // inputTextRef.current?.clear();
          if (onBlur) {
            onBlur();
          }
        }}
        value={value}
        onFocus={onFocus}
        style={styles.textInput}
        placeholder={placeHolder}
        defaultValue={defaultValue}
        onChangeText={onTextChange}
        placeholderTextColor="rgba(0, 0, 0, 0.4)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: p2d(40),
    borderWidth: 1,
    borderColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    width: width / 1.3,
    height: height / 20,
    paddingLeft: p2d(5),
  },
  textInput: {
    flex: 9,
    fontSize: p2d(16),
    fontFamily: "Quantico",
    fontWeight: "400",
    padding: 0,
  },
  icon: {
    flex: 1,
    paddingHorizontal: p2d(10),
  },
});

export default SearchInputField;
