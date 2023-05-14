import { useEffect, useMemo, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Clipboard,
  Linking,
} from "react-native";
import { t } from "react-native-tailwindcss";
import SwiperFlatList from "react-native-swiper-flatlist";
import BoxSize from "../../components/BoxSize";
import { Icons } from "../../components/icons";
import NavigationBar from "../../components/NavigationBar";
import { p2d } from "../../util/pixel";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import GradientText from "../../components/text";
const defaultSource = require("../../../assets/bg/background.png");
export const ContactInfoScreen = (props) => {
  const [data, setData] = useState({});
  const [socialLinks, setSocialLinks] = useState({});

  useEffect(() => {
    setData(props.route.params.data);
    setSocialLinks(props.route.params.data?.Links || {});
  }, [props.route.params]);

  // 处理需要的数据
  const linksForUI = useMemo(() => {
    const showLinks = [];
    Object.keys(socialLinks).map((key) => {
      showLinks.push({ name: key, value: socialLinks[key] });
    });
    const pages = [];
    while (showLinks.length > 0) {
      pages.push(showLinks.splice(0, 4));
    }
    return pages;
  }, [socialLinks]);

  // links的每一项
  const RenderItem = (data) => {
    const { name, value } = data?.data;
    const [active, setActive] = useState(false);
    const opacity = useSharedValue(0);
    const isPhone = name === "phoneNumber";
    const phone = isPhone ? value.toString().split("!")[1] : "";
    const fadeStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
      };
    });
    // 点击了复制
    const onCopy = () => {
      Clipboard.setString(phone);
      opacity.value = withSequence(
        withTiming(1, {
          duration: 500,
        }),
        withTiming(0, {
          duration: 1000,
        })
      );
    };

    return (
      <TouchableOpacity
        onPress={() => {
          if (isPhone) {
            Linking.openURL(`tel:${phone}`);
            return;
          }
          setActive(!active);
        }}
        style={[
          t.flexRow,
          t.itemsCenter,
          {
            height: p2d(61),
            width: p2d(304),
            borderWidth: p2d(1),
            borderColor: "#7B45E7",
            borderRadius: p2d(20),
            backgroundColor: active ? "rgb(234,224,252)" : "#fff",
            paddingHorizontal: p2d(20),
          },
        ]}
      >
        <Icons type={isPhone ? "phone_number" : name} size={38} />
        <View style={{ marginLeft: p2d(20) }}>
          <GradientText
            textStyle={styles.titleText}
            colorSet={active ? ["#7B45E7", "#52E1FD"] : ["#000", "#000"]}
            location={[0, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isPhone ? phone : name}
          </GradientText>
          {!isPhone && <Text style={styles.itemContext}>{value}</Text>}
        </View>
        <View style={[t.absolute, { right: p2d(20) }]}>
          {name === "phoneNumber" && (
            <>
              <Icons type="copy" size={40} onPress={onCopy} />
              <Animated.View
                style={[
                  {
                    height: p2d(30),
                    width: p2d(65),
                    position: "absolute",
                    top: p2d(35),
                    left: p2d(-15),
                  },
                  fadeStyle,
                ]}
              >
                <LinearGradient
                  colors={["#7B45E7", "#52E1FD"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: p2d(30),
                    width: p2d(65),
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: p2d(6),
                  }}
                >
                  <Text style={[styles.linkText, { color: "#FFF" }]}>
                    Copied!
                  </Text>
                </LinearGradient>
              </Animated.View>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={[t.flex1, t.bgWhite]}>
      {/* header */}
      <View>
        <View style={[t.relative, { height: p2d(240), width: "100%" }]}>
          <NavigationBar title="" containerStyle={[t.absolute, t.z10]} />
          <Image
            source={data ? { uri: data?.Profile?.CoverImage } : defaultSource}
            style={{ height: p2d(192), width: "100%", position: "absolute" }}
          />
          <View
            style={[
              t.wFull,
              t.justifyCenter,
              t.itemsCenter,
              t.absolute,
              t.bottom0,
              { height: p2d(96) },
            ]}
          >
            <Image
              source={data ? { uri: data?.Profile?.Avatar } : defaultSource}
              style={[{ height: p2d(96), width: p2d(96) }]}
            />
          </View>
        </View>
        <BoxSize height={p2d(15)} />
        <View
          style={[
            t.justifyCenter,
            t.itemsCenter,
            { paddingHorizontal: p2d(36) },
          ]}
        >
          <Text style={styles.titleText}>{data?.Username || ""}</Text>
          <BoxSize height={p2d(15)} />
          <Text
            style={[
              styles.linkText,
              t.wFull,
              { lineHeight: p2d(24), fontSize: p2d(12) },
            ]}
            numberOfLines={2}
          >
            {data?.Profile?.Introduction ||
              "The user has not yet been introduced"}
          </Text>
        </View>
      </View>
      {/* social links */}
      <BoxSize height={p2d(41)} />
      <View style={[t.wFull, { paddingHorizontal: p2d(22) }]}>
        <ScrollView
          horizontal
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: p2d(25),
          }}
          showsHorizontalScrollIndicator={false}
        >
          <Text style={styles.linkText}>You shared these social links:</Text>
          {Object.keys(socialLinks).map((key: any, index: number) => {
            return (
              <>
                <BoxSize width={p2d(5)} />
                <Icons
                  type={key === "phoneNumber" ? "phone_number" : key}
                  size={16}
                  key={key + index}
                />
                <BoxSize width={p2d(5)} />
              </>
            );
          })}
        </ScrollView>
        <BoxSize height={p2d(9)} />
        <BoxSize height={p2d(1)} bgColor={"#7B45E7"} />
      </View>
      {/* links */}
      <BoxSize height={p2d(41)} />
      <SwiperFlatList
        data={linksForUI}
        renderItem={({ item, index }) => (
          <FlatList
            data={item}
            renderItem={({ item }) => {
              return <RenderItem data={item} />;
            }}
            contentContainerStyle={[
              t.flex1,
              t.itemsCenter,
              { width: p2d(390) },
            ]}
            ItemSeparatorComponent={() => <BoxSize height={p2d(15)} />}
            key={index}
          />
        )}
        style={[t.flex1, t.wFull]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontFamily: "Quantico",
    fontSize: p2d(24),
    fontWeight: "700",
  },
  linkText: {
    fontFamily: "Quantico",
  },
  itemTitle: {
    fontFamily: "Quantico",
    fontSize: p2d(20),
    fontWeight: "700",
  },
  itemContext: {
    fontFamily: "Quantico",
    fontSize: p2d(12),
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.4)",
  },
});
