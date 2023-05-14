import { Dimensions, PixelRatio, Platform } from "react-native";
// Design size hieght: 844 / windth: 390
const DESIGN_SIZE_HEIGHT = 844;
const DESIGN_SIZE_WIDTH = 390;
const { height, width } = Dimensions.get("window");
const CURRENT_RESOLUTION = Math.sqrt(height * height + width * width);

export const p2dFactory = (designSize = { width: 390, height: 844 }) => {
  if (
    !designSize ||
    !designSize.width ||
    !designSize.height ||
    typeof designSize.width !== "number" ||
    typeof designSize.height !== "number"
  ) {
    throw new Error(
      "react-native-pixel-perfect | create function | Invalid design size object! must have width and height fields of type Number."
    );
  }
  const DESIGN_RESOLUTION = Math.sqrt(
    designSize.height * designSize.height + designSize.width * designSize.width
  );
  const RESOLUTIONS_PROPORTION = CURRENT_RESOLUTION / DESIGN_RESOLUTION;
  return (size: number) => RESOLUTIONS_PROPORTION * size;
};

// The loose version, which determines pixel size only by device width, is used when the height is not fixed
export const p2dLooseFactory = ({ designWidth }: any) => {
  return (size: number) => (size * width) / designWidth;
};

export const p2d = p2dFactory({
  width: DESIGN_SIZE_WIDTH || 375,
  height: DESIGN_SIZE_HEIGHT || 812,
});

export function responseFontSize(fontSize: number) {
  return Platform.OS === "android"
    ? fontSize / PixelRatio.getFontScale()
    : fontSize;
}
