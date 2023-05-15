import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinkContainer from "../../components/containers/LinkContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import { t } from "react-native-tailwindcss";
import { Icons } from "../../components/icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { p2d } from "../../util/pixel";
import {
  PHONE_LOGO,
  EMAIL_LOGO,
  INSTAGRAM_LOGO,
  TWITTER_LOGO,
  LINKEDIN_LOGO,
  FACEBOOK_LOGO,
  TIKTOK_LOGO,
  DISCORD_LOGO,
  SNAPCHAT_LOGO,
} from "../../../assets/single_color_logo";
import BoxSize from "../../components/BoxSize";
import NavigationBar from "../../components/NavigationBar";
import GradientText from "../../components/text";
import { SocialMedia } from "../../util/concat";
import LinkItem from "../../components/LinkItem";
import WaterDrop from "../../components/WaterDrop";
import userStorage from "../../util/storage/user";
import linksStateStorage from "../../util/storage/linksState";
import loginRequest from "../../api/login";
import StringUtility from "../../util/Utilities/StringUtility";
import { useView } from "../../hook/useView";
import { Screens } from "../Screens";
import systemStorage from "../../util/storage/system";
import { useAuth } from "../../hook/useAuth";

const EditLinkScreen = (props) => {
  const { navigation } = props;
  const { loadingView, confirmView } = useView();
  const [delVisible, setDelVisible] = useState(false); // 是否显示删除
  const [socialMediaLinks, setSocialMediaLinks] = useState({}); // 所有的社交链接， 先从后台获取
  const { setIsUpdate } = useAuth();
  useEffect(() => {
    // 获取本地存储的数据
    const asyncEffect = async () => {
      const res = await userStorage.get();
      setSocialMediaLinks(res.socialMediaLinks || {});
    };
    asyncEffect();
  }, []);

  const hasInvalidInput = useRef(false);
  const savePress = useCallback(
    async (next: boolean) => {
      setIsUpdate(true);
      loadingView.show();
      // 修改本地存储， 发起请求修改后端存储
      const userData = await userStorage.get();
      const token = userData.token;
      const newData = {
        ...userData,
        socialMediaLinks,
      };
      userStorage.set(newData).then(async () => {
        // 注意这个验证的时候需要传递token
        loginRequest.updateSMLinks(socialMediaLinks, token).then((res) => {
          loadingView.hide();
          // 返回还是跳转主页
          if (next) {
            // 跳转主页前表示用户已经完成所有的步骤设置为0
            systemStorage.set({ step: 0 }).then(() => {
              loginRequest.newUserSetNameFinished(userData.token).then(() => {
                props.navigation.navigate(Screens.ROOT);
              });
            });
          } else {
            props.navigation.goBack();
          }
        });
      });
    },
    [socialMediaLinks]
  );

  const onBack = useCallback(() => {
    confirmView.show({
      onNo: () => {
        navigation.goBack();
      },
      onYes() {
        savePress(false);
      },
      context: "Whether to save your actions",
    });
  }, [navigation, savePress]);

  const onTextChange = useCallback(
    (text: string | null, socialMedia: string) => {
      const socialName = StringUtility.toLowerCase(socialMedia);
      setSocialMediaLinks(() => {
        return {
          ...socialMediaLinks,
          [socialName]: {
            ...socialMediaLinks[socialName],
            link: text,
          },
        };
      });
    },
    [socialMediaLinks]
  );
  const checkError = useCallback((hasError: boolean) => {
    hasInvalidInput.current = hasError;
  }, []);

  const RanderRight = () => (
    <Pressable onPress={() => savePress(true)}>
      <Text style={{ fontSize: p2d(16), fontWeight: "500", color: "#7B45E7" }}>
        Next
      </Text>
    </Pressable>
  );
  // 设置link是否显示
  const delSocialLinks = (name: string) => {
    const origin = socialMediaLinks[name];
    setSocialMediaLinks({
      ...socialMediaLinks,
      [name]: {
        ...origin,
        isExposed: false,
        link: "",
      },
    });
  };

  const dataForUI = useMemo(() => {
    const dataArr = [
      {
        value: socialMediaLinks?.["phone_number"]?.link || "",
        iconUrl: PHONE_LOGO,
        title: SocialMedia.PHONE_NUMBER,
        placeHolder: "+1 1234567890",
        defaultValue: undefined,
        visible: true,
      },
      {
        value: socialMediaLinks?.["email"]?.link || "",
        defaultValue: "",
        iconUrl: EMAIL_LOGO,
        title: SocialMedia.EMAIL,
        placeHolder: "Your email address",
        visible: socialMediaLinks?.["email"]?.isExposed || false,
        delSocialLinks: () => delSocialLinks("email"),
      },
      {
        value: socialMediaLinks?.["instagram"]?.link || "",
        defaultValue: "",
        iconUrl: INSTAGRAM_LOGO,
        title: SocialMedia.INSTAGRAM,
        placeHolder: "@ Your instagram's user name",
        visible: socialMediaLinks?.["instagram"]?.isExposed || false,
        delSocialLinks: () => delSocialLinks("instagram"),
      },
      {
        value: socialMediaLinks?.["twitter"]?.link || "",
        defaultValue: "",
        iconUrl: TWITTER_LOGO,
        title: SocialMedia.TWITTER,
        placeHolder: "@ Your twitter's username",
        visible: socialMediaLinks?.["twitter"]?.isExposed || false,
        delSocialLinks: () => delSocialLinks("twitter"),
      },
      {
        value: socialMediaLinks?.["linkedin"]?.link || "",
        defaultValue: "",
        iconUrl: LINKEDIN_LOGO,
        title: SocialMedia.LINKEDIN,
        placeHolder: "Link to your linkedin profile",
        visible: socialMediaLinks?.["linkedin"]?.isExposed || false,
        delSocialLinks: () => delSocialLinks("linkedin"),
      },
      {
        value: socialMediaLinks?.["facebook"]?.link || "",
        defaultValue: "",
        iconUrl: FACEBOOK_LOGO,
        title: SocialMedia.FACEBOOK,
        placeHolder: "Link to your facebook profile",
        visible: socialMediaLinks?.["facebook"]?.isExposed || false,
        delSocialLinks: () => delSocialLinks("facebook"),
      },
      {
        value: socialMediaLinks?.["tiktok"]?.link || "",
        defaultValue: "",
        iconUrl: TIKTOK_LOGO,
        title: SocialMedia.TIKTOK,
        placeHolder: "@ Your tiktok's username",
        visible: socialMediaLinks?.["tiktok"]?.isExposed || false,
        delSocialLinks: () => delSocialLinks("tiktok"),
      },
      {
        value: socialMediaLinks?.["discord"]?.link || "",
        defaultValue: "",
        iconUrl: DISCORD_LOGO,
        title: SocialMedia.DISCORD,
        placeHolder: "Link to your discord channel",
        visible: socialMediaLinks?.["discord"]?.isExposed || false,
        delSocialLinks: () => delSocialLinks("discord"),
      },
      {
        value: socialMediaLinks?.["snapchat"]?.link || "",
        defaultValue: "",
        iconUrl: SNAPCHAT_LOGO,
        title: SocialMedia.SNAPCHAT,
        placeHolder: "@ Your snapchat's username",
        visible: socialMediaLinks?.["snapchat"]?.isExposed || false,
        delSocialLinks: () => delSocialLinks("snapchat"),
      },
    ];
    // Whether to obtain data for the first time
    // want to get an unordered list
    return dataArr
      .filter((i) => i.visible)
      .map((item) => {
        return {
          ...item,
          hasError: checkError,
          onTextChange: onTextChange,
          delVisible: delVisible,
        };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delVisible, socialMediaLinks]);
  return (
    <>
      <SafeAreaView edges={["bottom"]} style={[styles.scrollContainer]}>
        <NavigationBar
          title="Edit Social Links"
          renderRight={RanderRight}
          onPressLeft={onBack}
        />
        <View style={{ flex: 1, paddingHorizontal: p2d(16) }}>
          <LinkContainer>
            {dataForUI.map((data) => {
              return (
                <LinkItem
                  key={data.title}
                  value={data.value}
                  iconUrl={data.iconUrl}
                  title={data.title}
                  placeHolder={data.placeHolder}
                  onTextChange={data.onTextChange}
                  defaultValue={data.defaultValue}
                  visible={data.visible}
                  delVisible={data.delVisible}
                  delSocialLinks={data?.delSocialLinks || undefined}
                />
              );
            })}
            <BoxSize height={50} />
            <EditLinkButton
              links={{ data: socialMediaLinks, setData: setSocialMediaLinks }}
              setDelVisible={(visiable) => {
                setDelVisible(visiable);
              }}
            />
            <BoxSize height={50} />
          </LinkContainer>
        </View>
        {/* list */}
      </SafeAreaView>
    </>
  );
};
type EditLinkButtonProps = {
  links: any;
  setDelVisible: (visiable: boolean) => void;
};

const EditLinkButton = (props: EditLinkButtonProps) => {
  const { links, setDelVisible } = props;

  const [vis, setVis] = useState<"none" | "flex">("none");
  const [vis2, setVis2] = useState<"none" | "flex">("none");
  const [vis3, setVis3] = useState<"none" | "flex">("none");
  const downWaterDrop = useRef<any>();
  const upWaterDrop = useRef<any>();

  const offset = useSharedValue(1);
  const offsetWaterDrop = useSharedValue(1);
  const offsetScroll = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(offset.value),
    };
  });

  const animatedStylesHide = useAnimatedStyle(() => {
    return {
      opacity: withTiming(offsetWaterDrop.value),
    };
  });

  const animatedScroll = useAnimatedStyle(() => {
    return {
      opacity: offsetScroll.value,
    };
  });

  const handleClick = () => {
    setDelVisible(true);
    offset.value = 0;
    setVis("flex");
    setVis3("flex");
    offsetScroll.value = withTiming(1, {
      duration: 1500,
    });
    downWaterDrop.current.start();
  };
  //After the drop animation is complete   show list
  const dropDownCallback = () => {
    //
  };
  // dropDown click
  const dropDownClick = () => {
    offsetScroll.value = withTiming(0, {
      duration: 1500,
    });
    setDelVisible(false);
    setVis("none");
    setVis2("flex");
    setVis3("none");
    upWaterDrop.current.start();
  };

  const dropUpCallback = () => {
    offsetWaterDrop.value = 0;
    offset.value = 1;
    setVis2("none");
    offsetWaterDrop.value = 1;
  };

  const blockOnPress = (name: string) => {
    const origin = links.data[name];
    links.setData({
      ...links.data,
      [name]: {
        ...origin,
        isExposed: true,
      },
    });
  };

  return (
    <View style={[t.itemsCenter, t.relative, { height: p2d(160) }]}>
      {/* button */}
      <Animated.View style={[t.itemsCenter, animatedStyles]}>
        <Icons type={"addLinks"} size={59} onPress={handleClick} />
        <BoxSize height={p2d(16)} />
        <GradientText
          textStyle={{}}
          location={[0, 0.65]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          colorSet={["#52E1FD", "#7B45E7"]}
        >
          Edit social links selection
        </GradientText>
      </Animated.View>
      {/* scrollView */}
      <Animated.ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          t.justifyCenter,
          { paddingHorizontal: p2d(20) },
        ]}
        style={[
          {
            height: p2d(100),
            width: "100%",
            position: "absolute",
            zIndex: 10,
            display: vis3,
          },
          animatedScroll,
        ]}
      >
        <AddedBlock
          iconUrl={EMAIL_LOGO}
          visiable={links.data?.["email"]?.isExposed}
          click={() => blockOnPress("email")}
        />
        <AddedBlock
          iconUrl={INSTAGRAM_LOGO}
          visiable={links.data?.["instagram"]?.isExposed}
          click={() => blockOnPress("instagram")}
        />
        <AddedBlock
          iconUrl={TWITTER_LOGO}
          visiable={links.data?.["twitter"]?.isExposed}
          click={() => blockOnPress("twitter")}
        />
        <AddedBlock
          iconUrl={LINKEDIN_LOGO}
          visiable={links.data?.["linkedin"]?.isExposed}
          click={() => blockOnPress("linkedin")}
        />
        <AddedBlock
          iconUrl={FACEBOOK_LOGO}
          visiable={links.data?.["facebook"]?.isExposed}
          click={() => blockOnPress("facebook")}
        />
        <AddedBlock
          iconUrl={TIKTOK_LOGO}
          visiable={links.data?.["tiktok"]?.isExposed}
          click={() => blockOnPress("tiktok")}
        />
        <AddedBlock
          iconUrl={DISCORD_LOGO}
          visiable={links.data?.["discord"]?.isExposed}
          click={() => blockOnPress("discord")}
        />
        <AddedBlock
          iconUrl={SNAPCHAT_LOGO}
          visiable={links.data?.["snapchat"]?.isExposed}
          click={() => blockOnPress("snapchat")}
        />
      </Animated.ScrollView>
      {/* water drop */}
      <View style={{ display: vis, position: "absolute" }}>
        <WaterDrop
          onRef={downWaterDrop}
          direction={"down"}
          callback={dropDownCallback}
          onPress={dropDownClick}
        />
      </View>
      <Animated.View
        style={[animatedStylesHide, { display: vis2, position: "absolute" }]}
      >
        <WaterDrop
          onRef={upWaterDrop}
          direction={"up"}
          callback={dropUpCallback}
          onPress={() => {}}
        />
      </Animated.View>
    </View>
  );
};

type AddedBlockProps = {
  iconUrl: any;
  visiable: boolean;
  click: () => void;
};

const AddedBlock = (props: AddedBlockProps) => {
  const { iconUrl, visiable, click } = props;
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);
  const wraperBoxStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      marginTop: offset.value,
      marginLeft: -offset.value,
    };
  });
  const transition = {
    duration: 1500,
  };
  const beforeHiding = () => {
    opacity.value = withTiming(0, transition);
    offset.value = withTiming(40, transition);
    setTimeout(() => {
      click();
    }, 750);
  };

  useEffect(() => {
    if (visiable) {
      offset.value = 0;
      setTimeout(() => {
        opacity.value = 1;
      }, 750);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visiable]);

  return (
    <Animated.View style={[wraperBoxStyle]}>
      <TouchableOpacity
        onPress={beforeHiding}
        activeOpacity={0.85}
        style={[
          t.relative,
          {
            height: p2d(65),
            width: p2d(65),
            display: visiable ? "none" : "flex",
          },
        ]}
      >
        <Image source={iconUrl} style={{ height: "100%", width: "100%" }} />
        <Icons
          type={"added"}
          size={20}
          style={[t.absolute, { right: 0, bottom: p2d(5) }]}
          onPress={beforeHiding}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

export default EditLinkScreen;
