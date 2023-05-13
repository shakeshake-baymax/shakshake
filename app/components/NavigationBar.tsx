import React, { useMemo } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  Text,
  ViewStyle,
} from "react-native";
import { t } from "react-native-tailwindcss";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { p2d } from "../util/pixel";
import { Icons } from "./icons";
type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  bothSideContainerStyle?: StyleProp<ViewStyle>;
  useLeftIconFallback?: boolean;

  left?: string;
  leftStyle?: StyleProp<TextStyle>;
  renderLeft?: (() => JSX.Element) | boolean;
  onPressLeft?: Function;
  leftContainerStyle?: StyleProp<ViewStyle>;
  leftIcon?: () => JSX.Element;

  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  renderTitle?: (() => JSX.Element) | boolean;
  onPressTitle?: Function;
  titleContainerStyle?: StyleProp<ViewStyle>;

  right?: string;
  rightStyle?: StyleProp<TextStyle>;
  renderRight?: (() => JSX.Element) | boolean;
  onPressRight?: Function;
  rightContainerStyle?: StyleProp<ViewStyle>;
  rightIcon?: () => JSX.Element;

  textTransform?: "none" | "capitalize" | "uppercase" | "lowercase" | undefined;
};

const ArrowBack = () => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <TouchableOpacity
      style={[
        t.justifyCenter,
        t.itemsCenter,
        { height: p2d(32), width: p2d(32) },
      ]}
      onPress={goBack}
    >
      <Icons type="headerBarArrow" onPress={goBack} size={20} />
      {/* <FontAwesome
        color={'#7C5BE0'}
        name={'angle-left'}
        size={p2d(32)}
        onPress={goBack}
      /> */}
    </TouchableOpacity>
  );
};

/**
 * Toolbar components
 *
 * @param containerStyle          - container styles
 * @param bothSideContainerStyle  - Left and right container styles
 * @param useLeftIconFallback     - Using the default handling of leftIcon, passing false does not show the return arrow
 *
 * @param left                    - Text on the left
 * @param leftStyle               - The text style on the left
 * @param renderLeft              - If you don't want to use the default, then pass a component render through this parameter
 * @param onPressLeft             - The left side is clicked
 * @param leftContainerStyle      - left ContainerStyle
 * @param leftIcon                - left icon - of course, In fact, any JSXNode passed in will be rendered
 *
 * Same thing as up here ↑
 * @param title                   - title text
 * @param titleStyle              - title style
 * @param renderTitle             - Custom rendering
 * @param onPressTitle            - Click on the title
 * @param titleContainerStyle     - title Container style
 *
 * Same thing as up here ↑
 * @param right
 * @param rightStyle
 * @param renderRight
 * @param onPressRight
 * @param rightContainerStyle
 * @param rightIcon
 *
 * @param textTransform           - First Capital letter
 * @returns {*}
 * @constructor
 */
const NavigationBar = ({
  containerStyle = {},
  bothSideContainerStyle = {},
  useLeftIconFallback = true,
  left,
  leftStyle = {},
  renderLeft,
  onPressLeft,
  leftContainerStyle = {},
  leftIcon,
  title,
  titleStyle = {},
  renderTitle,
  onPressTitle,
  titleContainerStyle = {},

  right,
  rightStyle = {},
  renderRight,
  onPressRight,
  rightContainerStyle = {},
  rightIcon,

  textTransform = "capitalize",
}: Props) => {
  const edgeInsets = useSafeAreaInsets();
  const navigation = useNavigation();
  let canGoBack = false;
  try {
    canGoBack = navigation.canGoBack();
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canGoBack = true;
  }

  const Left = () => {
    return (
      <>
        {leftIcon && leftIcon()}
        {useLeftIconFallback && navigation.canGoBack() && ArrowBack()}
        <Text style={[t.pL3, leftStyle]}>{left}</Text>
      </>
    );
  };

  const Title = () => {
    return (
      <>
        <Text
          // native
          style={[
            t.textBlack,
            t.textBase,
            t.textCenter,
            titleStyle,
            styles.defaultTitleStyle,
            {
              textTransform: textTransform,
            },
          ]}
        >
          {title}
        </Text>
      </>
    );
  };

  const Right = () => {
    return (
      <>
        <Text style={[rightStyle, t.textRight]}>{right}</Text>
        {rightIcon && rightIcon()}
      </>
    );
  };

  const showLeft = useMemo(() => {
    return left || renderLeft || leftIcon || useLeftIconFallback;
  }, [left, leftIcon, renderLeft, useLeftIconFallback]);

  const showTitle = useMemo(() => {
    return title || renderTitle;
  }, [title, renderTitle]);

  const showRight = useMemo(() => {
    return right || renderRight;
  }, [right, renderRight]);

  return (
    <View
      style={[
        styles.containerStyle,
        { paddingTop: edgeInsets.top },
        containerStyle,
      ]}
    >
      <TouchableOpacity
        style={[
          t.itemsCenter,
          t.flexRow,
          t.justifyStart,
          t.flex,
          bothSideContainerStyle,
          leftContainerStyle,
          { paddingLeft: p2d(10), paddingVertical: p2d(10), width: "15%" },
        ]}
        onPress={(_) => (onPressLeft ? onPressLeft() : navigation.goBack())}
      >
        {showLeft &&
          (renderLeft ? (
            React.isValidElement(renderLeft) ? (
              renderLeft
            ) : (
              (renderLeft as () => JSX.Element)()
            )
          ) : (
            <Left />
          ))}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          t.flexRow,
          t.flex1,
          t.itemsCenter,
          t.justifyCenter,
          titleContainerStyle,
          { width: "70%" },
        ]}
        onPress={(_) => onPressTitle && onPressTitle()}
      >
        {showTitle &&
          (renderTitle ? (
            React.isValidElement(renderTitle) ? (
              renderTitle
            ) : (
              (renderTitle as () => JSX.Element)()
            )
          ) : (
            <Title />
          ))}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          t.itemsCenter,
          t.flexRow,
          t.justifyEnd,
          t.flex,
          bothSideContainerStyle,
          rightContainerStyle,
          { paddingRight: renderLeft ? 0 : p2d(6.25), width: "15%" },
        ]}
        onPress={(_) => onPressRight && onPressRight()}
      >
        {showRight ? (
          renderRight ? (
            React.isValidElement(renderRight) ? (
              renderRight
            ) : (
              (renderRight as () => JSX.Element)()
            )
          ) : (
            <Right />
          )
        ) : (
          <View style={{ width: p2d(32) }} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default NavigationBar;

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: "center",
    paddingBottom: p2d(5),
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: p2d(15),
    height: p2d(85),
  },
  defaultTitleStyle: {
    width: "auto",
    overflow: "visible",
    fontWeight: "700",
    fontSize: p2d(24),
    textAlign: "center",
    fontFamily: "Quantico",
  },
});
