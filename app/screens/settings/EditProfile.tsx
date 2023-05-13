/*eslint-disable*/
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import Animated from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { User } from "../../api/models/User";
import { p2d } from "../../util/pixel";
import NavigationBar from "../../components/NavigationBar";
import BoxSize from "../../components/BoxSize";
import InputUserInfoField from "../../components/custom_inputs/InputUserInfoField";
import AvatarImageView from "./mutual/base";
import userStorage from "../../util/storage/user";
import { t } from "react-native-tailwindcss";
import BottomSheetModal from "@gorhom/bottom-sheet";
import { Icons } from "../../components/icons";
import { Screens } from "../Screens";
import settingRequest from "../../api/setting";
import { Photo } from "./mutual/photo";
import { useView } from "../../hook/useView";
import photoStorage from "../../util/storage/photo";

export enum ClickedArea {
  AVATAR = "AVATAR",
  COVER = "COVER",
}
export type ProfileState = {
  name: string;
  bio: string;
  avatar: string;
  cover: string;
};

const { height, width } = Dimensions.get("window");
const AVATAR_IMAGE_SIZE = 133;
const COVER_IMAGE_HEIGHT = height / 3;
const COVER_VERTICAL_POSITION = -COVER_IMAGE_HEIGHT / 4;
const INPUT_CONTAINER_VERTICAL =
  COVER_VERTICAL_POSITION + AVATAR_IMAGE_SIZE / 2 + COVER_IMAGE_HEIGHT;
const defaultSource = require("../../../assets/bg/background.png");
type BGImageViewProps = {
  source?: string;
  onCoverPress: (type: ClickedArea) => void;
};

const CoverImageView = (props: BGImageViewProps) => {
  const { source = "", onCoverPress } = props;
  return (
    <Pressable
      onPress={() => {
        onCoverPress(ClickedArea.COVER);
      }}
      style={[
        styles.container,
        {
          height: p2d(COVER_IMAGE_HEIGHT),
          top: p2d(COVER_VERTICAL_POSITION),
        },
      ]}
    >
      <Image
        style={styles.coverImage}
        resizeMode={"cover"}
        source={source ? { uri: source } : defaultSource}
      />
    </Pressable>
  );
};

const EditProfileScreen = (props) => {
  const { navigation } = props;
  const [userData, setUserData] = useState<User | {}>({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [photoURL, setPhotoURL] = useState();
  const [bottomSheetShow, setBottomSheetShow] = useState(false);
  const [bio, setBio] = useState("");
  const [userName, setUserName] = useState("");
  const { loadingView } = useView();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    // 从本地获取用户信息
    const asyncEffect = async () => {
      const res = await userStorage.get();
      const photo = await photoStorage.get();
      setPhotoURL(photo?.photo || res.profile.avatarImageUrl);
      setUserData(res || {});
      setBio(res.profile.description);
      setUserName(res.userName);
    };
    asyncEffect();
  }, []);
  // 选择头像
  const onImagePress = useCallback(() => {
    setBottomSheetShow(true);
  }, [bottomSheetRef]);
  // 选择背景
  const onCoverPress = () => {
    navigation.navigate(Screens.SELECT_PHOTO);
  };

  const onSave = useCallback(async () => {
    const user = await userStorage.get();
    loadingView.show();
    // 判断是否需要更新名称和简介
    if (true) {
    }
    // 更新个人名称和简介
    const res1 = await settingRequest.updateProfile(userName, bio, user.token);
    const res2 = await settingRequest.uploadImages(
      "avatar",
      selectedImage,
      user.token
    );
    if (res1.status === 200) {
      // 昵称和简介更新成功 更新本地数据
      const newData = {
        ...user,
        userName: userName,
        profile: {
          ...user.profile,
          description: bio,
          avatarImageUrl: res2.data.url,
        },
      };
      userStorage.set(newData);
      photoStorage.set({ photo: selectedImage });
    }
    navigation.goBack();
    loadingView.hide();
  }, [bio, userName, selectedImage]);
  // 设置名称和简介
  const onUserNameChange = (text: string) => {
    setUserName(text);
  };
  const onUserBioChange = (text: string) => {
    setBio(text);
  };
  // 关闭弹出
  const handleOverlayPress = () => {
    // 处理点击遮罩层事件
    setBottomSheetShow(false);
    bottomSheetRef.current?.close();
  };
  // 点击相册
  const openPhotoAlbum = async () => {
    const result = await Photo.openPhoto();
    if (!result) {
      return;
    }
    const manipulatedImage = await Photo.manipulate(result.uri);
    if (!manipulatedImage) {
      return;
    }
    setSelectedImage(manipulatedImage.uri);
    setBottomSheetShow(false);
    bottomSheetRef.current?.close();
  };
  // 点击拍照
  const openTakePicture = async () => {
    const result = await Photo.openTakePicture();
    if (!result) {
      return;
    }
    const manipulatedImage = await Photo.manipulate(result.uri);
    if (!manipulatedImage) {
      return;
    }
    setSelectedImage(manipulatedImage.uri);
    setBottomSheetShow(false);
    bottomSheetRef.current?.close();
  };

  const RanderRight = (
    <Pressable onPress={onSave}>
      <Text style={{ fontSize: p2d(16), color: "#7B45E7", fontWeight: "500" }}>
        Save
      </Text>
    </Pressable>
  );

  return (
    <>
      <NavigationBar title="Edit Profile" renderRight={() => RanderRight} />
      <Animated.View style={[{ flex: 1 }]}>
        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <CoverImageView
            source={userData?.["profile"]?.coverImageUrl}
            onCoverPress={onCoverPress}
          />
          <AvatarImageView
            source={selectedImage ? selectedImage : photoURL}
            onAvatarPress={onImagePress}
          />
          <View
            style={{
              top: p2d(INPUT_CONTAINER_VERTICAL),
              height: p2d(height / 1.4),
            }}
          >
            <Pressable
              onPress={(event) => {
                console.log("got...");
              }}
            >
              <InputUserInfoField
                height={p2d(height / 7)}
                onTextChange={onUserNameChange}
                defaultValue={userData?.["userName"] || ""}
                title={"Name"}
                inputHeight={p2d(42)}
                editiable={true}
              />
            </Pressable>
            <InputUserInfoField
              height={p2d(height / 4)}
              onTextChange={onUserBioChange}
              defaultValue={userData?.["profile"]?.description || ""}
              title={"Bio"}
              placeHolder={"Tell your friends about yourself..."}
              inputHeight={p2d(138)}
              editiable={true}
            />
          </View>
        </KeyboardAwareScrollView>
      </Animated.View>
      <Modal style={[t.flex1]} visible={bottomSheetShow} transparent>
        <TouchableOpacity
          style={[t.flex1, { backgroundColor: "rgba(0,0,0,0.3)" }]}
          onPress={handleOverlayPress}
        >
          <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={["20%"]}
            handleIndicatorStyle={{
              backgroundColor: "#D4C1F8",
              width: p2d(50),
              height: p2d(4),
            }}
          >
            <View style={[t.flex1]}>
              <TouchableOpacity
                style={[t.flexRow, t.itemsCenter, { height: "30%" }]}
                onPress={openPhotoAlbum}
              >
                <BoxSize width={p2d(33)} />
                <Icons type="sheet_1" size={25} />
                <Text style={{ marginLeft: p2d(5) }}>Choose from library</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[t.flexRow, t.itemsCenter, { height: "30%" }]}
                onPress={openTakePicture}
              >
                <BoxSize width={p2d(33)} />
                <Icons type="sheet_2" size={25} />
                <Text style={{ marginLeft: p2d(5) }}>Take photo</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetModal>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  bgView: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.3)",
    width: width,
    height: height,
  },
  container: {
    width: "100%",
    position: "absolute",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: p2d(30),
    borderBottomRightRadius: p2d(30),
  },
});

export default EditProfileScreen;
