import React, { useState } from "react";
import {
  TouchableHighlight,
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Pressable,
  Modal,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationProp } from "@react-navigation/core";
import ButtonContainer from "../../components/containers/ButtonContainer";
import { t } from "react-native-tailwindcss";
import { useAuth } from "../../hook/useAuth";
import { Screens } from "../Screens";
import NavigationBar from "../../components/NavigationBar";
import { p2d } from "../../util/pixel";
import { Icons } from "../../components/icons";
import { ButtonTitle } from "./mutual/constants";
import {
  EDIT_LINKS,
  EDIT_PROFILE,
  TERMS,
  PRIVACY,
  FEEDBACK,
} from "../../../assets/settings_icons";
import BoxSize from "../../components/BoxSize";

const { height, width } = Dimensions.get("window");
const SettingItem = (props: {
  title: ButtonTitle;
  icon: any;
  handlePress: (title: ButtonTitle) => void;
}) => {
  const { title, handlePress, icon } = props;
  return (
    <TouchableHighlight
      style={styles.highlightView}
      underlayColor={"rgba(212, 193, 248, 0.5)"}
      onPress={() => {
        handlePress(title);
      }}
    >
      <View style={styles.button}>
        <Image style={{ width: p2d(24), height: p2d(24) }} source={icon} />
        <View style={styles.contentText}>
          <Text
            style={{
              textAlign: "left",
              fontSize: p2d(20),
              fontWeight: "400",
              fontStyle: "normal",
              fontFamily: "Quantico",
            }}
          >
            {title}
          </Text>
        </View>
        <Icons type="RightArrow" size={20} />
      </View>
    </TouchableHighlight>
  );
};

const CustomButton = (props: {
  title: ButtonTitle;
  handlePress: (title: ButtonTitle) => void;
  top?: number;
}) => {
  const { title, handlePress, top } = props;
  return (
    <View style={[styles.topContainer, { top: top ? top : undefined }]}>
      <Pressable
        onPress={() => {
          handlePress(title);
        }}
        style={[styles.container, { height: p2d(49), borderRadius: p2d(49) }]}
      >
        <Text style={styles.text}>{title}</Text>
      </Pressable>
    </View>
  );
};

type DialogBoxProps = {
  visible: boolean;
  content: string;
  buttons?: boolean;
  confirmText?: string;
  cancelText?: string;
  randerButtonGroup?: React.ReactNode;
  noPressed?: () => void;
  yesPressed?: () => void;
};

const DialogBox = (props: DialogBoxProps) => {
  const {
    noPressed,
    yesPressed,
    visible,
    content,
    confirmText,
    cancelText,
    randerButtonGroup,
  } = props;
  const leftButton = (
    <Pressable onPress={yesPressed} style={styles.button2}>
      <Text style={styles.yesText}>{confirmText || "Yes"}</Text>
    </Pressable>
  );
  const rightButton = (
    <Pressable
      onPress={noPressed}
      style={[
        t.flex1,
        t.justifyCenter,
        t.itemsCenter,
        {
          padding: p2d(12),
          fontSize: p2d(20),
        },
      ]}
    >
      <Text style={styles.noText}>{cancelText || "No"}</Text>
    </Pressable>
  );
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.bgView}>
        <View style={styles.popUpView}>
          <View style={styles.content}>
            <Text style={styles.titleText}>{content}</Text>
          </View>
          <View style={{ width: "100%", height: p2d(50) }}>
            {randerButtonGroup ? (
              randerButtonGroup
            ) : (
              <>
                <BoxSize height={1} bgColor={"#a6a6a6"} />
                <View style={styles.buttonContainer}>
                  {leftButton}
                  <BoxSize width={1} bgColor={"#a6a6a6"} />
                  {rightButton}
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

function SettingsScreen(props: { navigation: NavigationProp<any> }) {
  const { navigation } = props;
  const { signOut } = useAuth();
  const edgeInsets = useSafeAreaInsets();
  const [modalOpen, setModal] = useState(false);

  // click confirm
  const handleConfirm = () => {
    setModal(false);
    signOut();
    navigation.navigate(Screens.WELCOME);
  };
  // click cancel
  const handleCancel = () => {
    setModal(false);
  };

  const handlePress = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <View style={[t.flex1, t.bgWhite, { paddingBottom: edgeInsets.bottom }]}>
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <NavigationBar title="Settings" />
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            paddingBottom: p2d(30),
          }}
        >
          <View>
            <ButtonContainer title={null}>
              <SettingItem
                title={ButtonTitle.UPDATE_LINKS}
                icon={EDIT_LINKS}
                handlePress={() => handlePress(Screens.EDIT_LINKS)}
              />
              <SettingItem
                title={ButtonTitle.EDIT_PROFILE}
                icon={EDIT_PROFILE}
                handlePress={() => handlePress(Screens.EDIT_PROFILE)}
              />
            </ButtonContainer>
            <ButtonContainer title={"About"}>
              <SettingItem
                title={ButtonTitle.TERM_OF_SERVICES}
                icon={TERMS}
                handlePress={() =>
                  Linking.openURL("https://forms.gle/JW7FiRuSxA15FLCU8")
                }
              />
              <SettingItem
                title={ButtonTitle.PRIVACY}
                icon={PRIVACY}
                handlePress={() =>
                  Linking.openURL("https://www.shakeshake.io/privacy-policy")
                }
              />
              <SettingItem
                title={ButtonTitle.FEEDBACK}
                icon={FEEDBACK}
                handlePress={() =>
                  Linking.openURL("https://www.shakeshake.io/terms-of-service")
                }
              />
            </ButtonContainer>
          </View>
          <ButtonContainer title={" "}>
            <CustomButton
              title={ButtonTitle.LOGOUT}
              handlePress={() => setModal(true)}
            />
          </ButtonContainer>
        </View>
      </View>
      <DialogBox
        visible={modalOpen}
        yesPressed={handleConfirm}
        noPressed={handleCancel}
        content={"Are you sure to log out?"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  highlightView: {
    marginBottom: p2d(5),
    justifyContent: "center",
    height: p2d(height / 15),
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: p2d(10),
    marginBottom: p2d(5),
    maxHeight: p2d(50),
  },
  contentText: {
    flex: 1,
    paddingStart: p2d(10),
  },
  text: {
    fontStyle: "normal",
    fontSize: p2d(20),
    fontWeight: "500",
    color: "#FFFFFF",
    fontFamily: "Quantico",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7B45E7",
    width: "90%",
  },
  topContainer: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
    maxHeight: p2d(50),
  },
  bgView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: p2d(52),
  },
  popUpView: {
    width: "100%",
    height: p2d(177),
    backgroundColor: "white",
    borderRadius: p2d(24),
  },
  content: {
    height: p2d(127),
    justifyContent: "center",
  },
  titleText: {
    fontSize: p2d(20),
    fontWeight: "400",
    fontFamily: "Quantico",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row-reverse",
  },
  yesText: {
    fontSize: p2d(20),
    fontWeight: "400",
    fontFamily: "Quantico",
    color: "red",
  },
  noText: {
    fontSize: p2d(20),
    fontWeight: "400",
    fontFamily: "Quantico",
  },
  button2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: p2d(12),
    fontSize: p2d(20),
  },
});

export default SettingsScreen;
