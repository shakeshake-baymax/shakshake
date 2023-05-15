import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { t } from "react-native-tailwindcss";
import { p2d } from "../../util/pixel";
import { Icons } from "../../components/icons";
import BoxSize from "../../components/BoxSize";
import GradientText from "../../components/text";
import NavigationBar from "../../components/NavigationBar";
import {
  PHONE_LOGO,
  EMAIL_LOGO,
  INSTAGRAM_LOGO,
  DISCORD_LOGO,
  TIKTOK_LOGO,
  FACEBOOK_LOGO,
  TWITTER_LOGO,
  LINKEDIN_LOGO,
  SNAPCHAT_LOGO,
} from "../../../assets/single_color_logo";
import userStorage from "../../util/storage/user";
import { Screens } from "../Screens";
import systemStorage from "../../util/storage/system";
import { useNavigation } from "@react-navigation/native";
import { User } from "../../api/models/User";

type SocialItmeProps = {
  handlerCheck: (links: string, result: boolean) => void;
  links: string;
  imgUri: ImageSourcePropType;
  active: boolean;
};
const SocialItme = (props: SocialItmeProps) => {
  const { imgUri, links, handlerCheck, active } = props;
  const [visiable, setVisiable] = useState(active);

  useEffect(() => {
    setVisiable(active);
  }, [active]);

  const onPress = () => {
    handlerCheck(links, !visiable);
    setVisiable(!visiable);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        height: p2d(65),
        width: p2d(65),
        marginHorizontal: p2d(5),
      }}
    >
      <Image source={imgUri} style={[t.wFull, t.hFull]} />
      <Icons
        type="check"
        style={[
          t.absolute,
          t.bottom0,
          t.right0,
          { display: visiable ? "flex" : "none" },
        ]}
      />
    </TouchableOpacity>
  );
};

export default function ChooseSocialLinks(props) {
  const [socailLinksData, setSocailLinksData] = useState({});
  const [user, setUser] = useState({});
  const [phoneNumber, setPhoneNumber] = useState();
  const navigation = useNavigation<any>();
  const handlerSocialLinks = (links: string, result: boolean) => {
    setSocailLinksData({
      ...socailLinksData,
      [links]: { ...socailLinksData[links], isExposed: result },
    });
  };
  // click next
  const onPressNext = useCallback(() => {
    setTimeout(() => {
      userStorage.set({ ...user, socialMediaLinks: socailLinksData } as User);
      props.navigation.navigate(Screens.EDIT_LINKS);
    }, 0);
  }, [socailLinksData]);

  // 获取用户已经保存的数据
  const asyncEffect = async () => {
    const res = await userStorage.get();
    setUser(res);
    setSocailLinksData(res.socialMediaLinks);
    setPhoneNumber(res.phoneNumber);
    systemStorage.set({ step: 2 });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // 进入时获取用户已经保存的数据
      asyncEffect();
    });
    return unsubscribe;
  }, [navigation]);
  const onGoback = () => {
    systemStorage.set({ step: 1 });
    if (navigation.getState().routes.length <= 1) {
      navigation.reset({
        index: 0,
        routes: [{ name: Screens.USERNAME_SETUP }],
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[t.flex1, t.bgWhite, t.itemsCenter]}>
      <NavigationBar
        title="Select Social Links"
        right="Next"
        rightStyle={{ fontSize: p2d(16), color: "#7B45E7", fontWeight: "500" }}
        onPressRight={onPressNext}
        onPressLeft={onGoback}
      />
      <BoxSize height={p2d(80)} />
      <View style={[t.flexRow, { width: p2d(300) }]}>
        <Image
          source={PHONE_LOGO}
          style={{ height: p2d(65), width: p2d(65) }}
        />
        <View style={[t.justifyBetween]}>
          <Text style={styles.phoneStyle}>Phone Number</Text>
          <Text>{phoneNumber}</Text>
        </View>
      </View>
      <BoxSize height={p2d(110)} />
      <View style={[t.justifyCenter, t.itemsCenter]}>
        {/* Upper half */}
        <View style={[t.flexRow]}>
          <SocialItme
            imgUri={EMAIL_LOGO}
            links="email"
            handlerCheck={handlerSocialLinks}
            active={socailLinksData?.["email"]?.isExposed || false}
          />
          <SocialItme
            imgUri={INSTAGRAM_LOGO}
            links="instagram"
            handlerCheck={handlerSocialLinks}
            active={socailLinksData?.["instagram"]?.isExposed || false}
          />
          <SocialItme
            imgUri={DISCORD_LOGO}
            links="discord"
            handlerCheck={handlerSocialLinks}
            active={socailLinksData?.["discord"]?.isExposed || false}
          />
          <SocialItme
            imgUri={TIKTOK_LOGO}
            links="tiktok"
            handlerCheck={handlerSocialLinks}
            active={socailLinksData?.["tiktok"]?.isExposed || false}
          />
        </View>
        <BoxSize height={p2d(24)} />
        {/* Lower half */}
        <View style={[t.flexRow]}>
          <SocialItme
            imgUri={FACEBOOK_LOGO}
            links="facebook"
            handlerCheck={handlerSocialLinks}
            active={socailLinksData?.["facebook"]?.isExposed || false}
          />
          <SocialItme
            imgUri={TWITTER_LOGO}
            links="twitter"
            handlerCheck={handlerSocialLinks}
            active={socailLinksData?.["twitter"]?.isExposed || false}
          />
          <SocialItme
            imgUri={LINKEDIN_LOGO}
            links="linkedin"
            handlerCheck={handlerSocialLinks}
            active={socailLinksData?.["linkedin"]?.isExposed || false}
          />
          <SocialItme
            imgUri={SNAPCHAT_LOGO}
            links="snapchat"
            handlerCheck={handlerSocialLinks}
            active={socailLinksData?.["snapchat"]?.isExposed || false}
          />
        </View>
      </View>
      <BoxSize height={p2d(40)} />
      <GradientText
        textStyle={styles.textStyle}
        location={[0, 1]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        colorSet={["#7B45E7", "#52E1FD"]}
      >
        Tick the social media you wanna
      </GradientText>
      <GradientText
        textStyle={styles.textStyle}
        location={[0, 1]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        colorSet={["#7B45E7", "#52E1FD"]}
      >
        share with SHAKESHAKE
      </GradientText>
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontWeight: "700",
    fontSize: p2d(18),
    fontFamily: "Quantico",
  },
  phoneStyle: {
    fontWeight: "700",
    fontSize: p2d(20),
    fontFamily: "Quantico",
    color: "#18181C",
  },
  phoneTextStyle: {
    fontSize: p2d(12),
    fontFamily: "Quantico",
    color: "rgba(0, 0, 0, 0.4)",
  },
});

// soclink -> linkedin:true
