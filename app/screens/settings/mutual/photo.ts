import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

export namespace Photo {
  // 检测权限
  const requestCameraAndMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return false;
    }
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== "granted") {
      return false;
    }
    return true;
  };
  // 打开相册
  export const openPhoto = async () => {
    const res = await requestCameraAndMediaLibraryPermissions();
    if (!res) {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result) {
      return;
    }

    return result?.assets[0];
  };
  // 打开相机
  export const openTakePicture = async () => {
    const res = await requestCameraAndMediaLibraryPermissions();
    if (!res) {
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result) {
      return;
    }

    return result?.assets[0];
  };
  // 剪辑图片
  export const manipulate = async (uri) => {
    const manipulatedImage = await manipulateAsync(
      uri,
      [
        { resize: { width: 300 } },
        {
          crop: {
            originX: 0,
            originY: 0,
            width: 300,
            height: 300,
          },
        },
      ],
      { compress: 1, base64: true }
    );
    return manipulatedImage;
  };
}
