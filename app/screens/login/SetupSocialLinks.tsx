import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  PHONE_LOGO,
  EMAIL_LOGO,
  INSTAGRAM_LOGO,
  SNAPCHAT_LOGO,
  TWITTER_LOGO,
  FACEBOOK_LOGO,
  LINKEDIN_LOGO,
  DISCORD_LOGO,
  TIKTOK_LOGO,
} from "../../../assets/single_color_logo";
import loginRequest from "../../api/login";
import LinkContainer from "../../components/containers/LinkContainer";
import LinkItem from "../../components/LinkItem";
import NavigationBar from "../../components/NavigationBar";
import { SocialMedia } from "../../util/concat";
import { p2d } from "../../util/pixel";
import userStorage from "../../util/storage/user";
import StringUtility from "../../util/Utilities/StringUtility";
import { Screens } from "../Screens";

const SetupSocialLinks = (props) => {
  const [socialLinks, setSocialLinks] = useState({});
  const [socialMediaLinks, setSocialMediaLinks] = useState({});
  // 获取需要显示的链接
  const socialState = props.route.params.links;
  useEffect(() => {
    // 获取本地用户存储数据
    const asyncEffect = async () => {
      const res = await userStorage.get();
      setSocialMediaLinks(res.socialMediaLinks);
      setSocialLinks(res.socialMediaLinks);
    };
    asyncEffect();
  }, []);

  const savePress = useCallback(async () => {
    // 修改本地存储， 发起请求修改后端存储
    const userData = await userStorage.get();
    const token = userData.token;
    const newData = {
      ...userData,
      socialMediaLinks,
    };
    userStorage.set(newData).then(async () => {
      console.log(1);
      // 注意这个验证的时候需要传递token
      loginRequest.updateSMLinks(socialMediaLinks, token).then((res) => {
        if (res.status === 200) {
          // 跳转到主页
          props.navigation.navigate(Screens.ROOT);
        }
      });
    });
  }, [socialMediaLinks]);

  const onTextChange = useCallback(
    (text: string | null, socialMedia: SocialMedia) => {
      const name = StringUtility.toLowerCase(socialMedia);
      // 页面的更改
      setSocialLinks(() => {
        return {
          ...socialLinks,
          [name]: {
            ...socialLinks[name],
            link: text,
          },
        };
      });
      // 修改从本地获取的数据 将名称全部转换为小写
      setSocialMediaLinks(() => {
        return {
          ...socialMediaLinks,
          [name]: {
            ...socialMediaLinks[name],
            link: text,
          },
        };
      });
    },
    [socialMediaLinks, socialLinks]
  );
  const checkError = useCallback((hasError: boolean) => {
    // hasInvalidInput.current = hasError;
  }, []);

  const RanderRight = () => (
    <Pressable onPress={savePress}>
      <Text style={{ fontSize: p2d(16), fontWeight: "500", color: "#7B45E7" }}>
        Next
      </Text>
    </Pressable>
  );

  return (
    <>
      <SafeAreaView edges={["bottom"]} style={[styles.scrollContainer]}>
        <NavigationBar title="Edit Social Links" renderRight={RanderRight} />
        <View style={{ flex: 1, paddingHorizontal: p2d(16) }}>
          <LinkContainer>
            <LinkItem
              hasError={checkError}
              value={socialMediaLinks?.["phone_number"] || ""}
              iconUrl={PHONE_LOGO}
              title={SocialMedia.PHONE_NUMBER}
              placeHolder={"+1 1234567890"}
              onTextChange={onTextChange}
              defaultValue={undefined}
              visible={true}
              delVisible={false}
            />
            <LinkItem
              hasError={checkError}
              value={socialLinks?.["email"]?.link || ""}
              defaultValue={""}
              iconUrl={EMAIL_LOGO}
              title={SocialMedia.EMAIL}
              placeHolder={"Your email address"}
              onTextChange={onTextChange}
              visible={socialState?.["email"] || false}
              delVisible={false}
            />
            <LinkItem
              hasError={checkError}
              value={socialLinks?.["instagram"]?.link || ""}
              defaultValue={""}
              iconUrl={INSTAGRAM_LOGO}
              title={SocialMedia.INSTAGRAM}
              placeHolder={"@ Your instagram's user name"}
              onTextChange={onTextChange}
              visible={socialState?.["instagram"] || false}
              delVisible={false}
            />
            <LinkItem
              hasError={checkError}
              value={socialLinks?.["snapchat"]?.link || ""}
              defaultValue={""}
              iconUrl={SNAPCHAT_LOGO}
              title={SocialMedia.SNAPCHAT}
              placeHolder={"@ Your snapchat's username"}
              onTextChange={onTextChange}
              visible={socialState?.["snapchat"] || false}
              delVisible={false}
            />
            <LinkItem
              hasError={checkError}
              value={socialLinks?.["tiktok"]?.link || ""}
              defaultValue={""}
              iconUrl={TIKTOK_LOGO}
              title={SocialMedia.TIKTOK}
              placeHolder={"@ Your tiktok's username"}
              onTextChange={onTextChange}
              visible={socialState?.["tiktok"] || false}
              delVisible={false}
            />
            <LinkItem
              hasError={checkError}
              value={socialLinks?.["twitter"]?.link || ""}
              defaultValue={""}
              iconUrl={TWITTER_LOGO}
              title={SocialMedia.TWITTER}
              placeHolder={"@ Your twitter's username"}
              onTextChange={onTextChange}
              visible={socialState?.["twitter"] || false}
              delVisible={false}
            />
            <LinkItem
              hasError={checkError}
              value={socialLinks?.["facebook"]?.link || ""}
              defaultValue={""}
              iconUrl={FACEBOOK_LOGO}
              title={SocialMedia.FACEBOOK}
              placeHolder={"Link to your facebook profile"}
              onTextChange={onTextChange}
              visible={socialState?.["facebook"] || false}
              delVisible={false}
            />
            <LinkItem
              hasError={checkError}
              value={socialLinks?.["linkedin"]?.link || ""}
              defaultValue={""}
              iconUrl={LINKEDIN_LOGO}
              title={SocialMedia.LINKEDIN}
              placeHolder={"Link to your linkedin profile"}
              onTextChange={onTextChange}
              visible={socialState?.["linkedin"] || false}
              delVisible={false}
            />
            <LinkItem
              hasError={checkError}
              value={socialLinks?.["discord"]?.link || ""}
              defaultValue={""}
              iconUrl={DISCORD_LOGO}
              title={SocialMedia.DISCORD}
              placeHolder={"Link to your discord channel"}
              onTextChange={onTextChange}
              visible={socialState?.["discord"] || false}
              delVisible={false}
            />
          </LinkContainer>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

export default SetupSocialLinks;
