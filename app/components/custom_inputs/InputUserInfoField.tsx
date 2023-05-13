import React, { useCallback, useMemo, useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { p2d } from "../../util/pixel";

type InputUserInfoFieldProps = {
  value?: string;
  title: string;
  defaultValue?: string;
  inputHeight: number;
  flex?: number;
  onTextChange: (text: string) => void;
  placeHolder?: string;
  height?: number;
  editiable?: boolean;
};

const MAX_LENGTH = 120;
function colorProvider(length?: number) {
  if (length != undefined && (length == 0 || length <= MAX_LENGTH)) {
    return {
      color: "rgba(0, 0, 0, 0.4)",
    };
  } else {
    return {
      color: "rgba(255, 0, 0, 0.5)",
    };
  }
}
const InputUserInfoField = (props: InputUserInfoFieldProps) => {
  const {
    title,
    flex,
    defaultValue,
    placeHolder,
    inputHeight,
    onTextChange,
    height,
    editiable,
  } = props;
  const [textLength, setTextLength] = useState(defaultValue?.length);

  const memorizedText = useMemo(() => {
    return (
      <Text style={[styles.lengthIndicator, colorProvider(textLength)]}>
        {`${textLength && textLength}/${MAX_LENGTH}`}
      </Text>
    );
  }, [textLength]);
  const onChangeText = useCallback(
    (text: string) => {
      setTextLength(text.length);
      onTextChange(text);
    },
    [onTextChange, title]
  );
  return (
    <View
      style={[
        styles.container,
        { flex: flex, justifyContent: "flex-start", height: height },
      ]}
    >
      <Text style={styles.titleText}>{title}</Text>
      <View style={{ height: inputHeight }}>
        <TextInput
          defaultValue={defaultValue}
          onChangeText={onChangeText}
          placeholder={placeHolder && placeHolder}
          editable={editiable}
          autoCapitalize={"sentences"}
          multiline={title == "Bio"}
          style={styles.inputField}
        />
        {title == "Bio" ? memorizedText : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingStart: p2d(20),
    paddingEnd: p2d(20),
  },
  titleText: {
    fontSize: p2d(20),
    marginBottom: p2d(10),
    fontStyle: "normal",
    fontFamily: "Quantico",
  },
  inputField: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.4)",
    padding: p2d(10),
    fontSize: p2d(16),
    fontFamily: "Quantico",
    textAlignVertical: "top",
  },
  lengthIndicator: {
    fontSize: 10,
    fontWeight: "400",
    position: "absolute",
    paddingRight: 8,
    paddingBottom: 8,
    right: 0,
    lineHeight: 13,
    fontFamily: "Quantico",
    letterSpacing: 0.5,
    bottom: 0,
  },
});

export default InputUserInfoField;
