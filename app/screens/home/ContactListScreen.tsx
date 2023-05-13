import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { t } from "react-native-tailwindcss";
import { Icons } from "../../components/icons";
import ContactsHeader from "./base/ContactHeader";
import { Swipeable } from "react-native-gesture-handler";
import { p2d } from "../../util/pixel";
import BoxSize from "../../components/BoxSize";
import GradientText from "../../components/text";
import contcatRequest from "../../api/contcat";
import userStorage from "../../util/storage/user";

const ConcatListScreen = () => {
  const insets = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [scrollY, setScrollY] = useState(() => insets.top);
  const [contcatList, setContcatList] = useState([]);
  const flatListRef = useRef(null);

  // 请求一次联系人
  const asyncEffect = async () => {
    const user = await userStorage.get();
    const res = await contcatRequest.getContactList(user.token);
    setContcatList(res);
  };
  useEffect(() => {
    // 首次进入请求
    asyncEffect();
  }, []);
  const rotaValue = useSharedValue(0);
  const rotaStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotaValue.value}deg` }],
    };
  });

  const onRefresh = useCallback(async () => {
    // 设置下拉刷新状态为 true
    setIsRefreshing(true);
    // 刷新完成后将下拉刷新状态设回 false
    const user = await userStorage.get();
    contcatRequest.getContactList(user.token).then((res) => {
      setContcatList(res);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    });
  }, []);
  // 对刷新器监听
  useEffect(() => {
    if (isRefreshing) {
      rotaValue.value = withTiming(720000, {
        duration: 2000000,
        easing: Easing.linear,
      });
    } else {
      rotaValue.value = withTiming(0);
    }
  }, [isRefreshing]);
  // 设置刷新中的自定义组件
  const renderRefreshControl = () => {
    return (
      <View
        style={{
          height: scrollY,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        {isRefreshing ? (
          <Animated.View style={[rotaStyle]}>
            <Icons type="refresh" size={"large"} />
          </Animated.View>
        ) : (
          <Icons type="down" size={"large"} />
        )}
      </View>
    );
  };
  // 假设回来的数据
  const dataForUI = useMemo(() => {
    if (contcatList.length != 0) {
      return contcatList;
    }
    return [];
  }, [contcatList]);
  // 搜索的时候数据筛选
  const handlerSearchResult = useCallback(
    (data) => {
      if (searchText) {
        const res = data.filter(
          (item) => item.Username.indexOf(searchText) !== -1
        );
        return res;
      }
      return data;
    },
    [searchText]
  );
  // 每一项
  const RanderItem = ({ data, onDelete }) => {
    const [show, setShow] = useState(true);
    const handlerDelete = () => {
      setShow(false);
      onDelete();
    };
    const renderRightActions = () => {
      return (
        <TouchableOpacity
          style={[
            t.flex1,
            t.justifyCenter,
            t.itemsCenter,
            {
              maxWidth: p2d(100),
              // height: p2d(50),
              backgroundColor: "#EB5545",
            },
          ]}
          onPress={handlerDelete}
        >
          <Text style={[t.textWhite]}>Delete</Text>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{ paddingVertical: p2d(12.5), display: show ? "flex" : "none" }}
      >
        <Swipeable
          renderRightActions={renderRightActions}
          containerStyle={{ paddingLeft: p2d(30) }}
        >
          <View
            style={[
              t.itemsCenter,
              t.bgWhite,
              {
                width: "100%",
                height: p2d(50),
                flexDirection: "row",
              },
            ]}
          >
            <Image
              source={{
                uri: data?.Profile?.Avatar,
              }}
              style={{
                height: p2d(46),
                width: p2d(46),
                borderRadius: p2d(50),
              }}
            />
            <Text style={[{ marginLeft: p2d(17), fontFamily: "Quantico" }]}>
              {data.Username}
            </Text>
          </View>
        </Swipeable>
      </View>
    );
  };
  // 点击了删除按钮
  const onDelete = async (id: string) => {
    const user = await userStorage.get();
    const res = await contcatRequest.deleteContact(id, user.token);
    if (res.status === 200) {
      contcatRequest.getContactList(user.token).then((res) => {
        setContcatList(res);
      });
    }
  };
  // 如果没有数据显示的内容
  const EmtpyView = () => {
    return (
      <View style={styles.textContainer}>
        <GradientText
          textStyle={styles.textStyle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          location={[0, 0.7]}
          colorSet={["#7B45E7", "#52E1FD"]}
        >
          No result found
        </GradientText>
      </View>
    );
  };
  return (
    <View style={[t.flex1]}>
      <ContactsHeader
        value={searchText}
        onTextChange={(text: string) => setSearchText(text)}
      />
      <FlatList
        data={handlerSearchResult(dataForUI)}
        ref={flatListRef}
        keyExtractor={(item) => item?.ID?.toString()}
        style={[t.bgWhite]}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmtpyView}
        renderItem={({ item }) => (
          <RanderItem
            data={item}
            onDelete={() => {
              onDelete(item?.ID);
            }}
            key={item.ID}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["red"]}
            tintColor={"white"}
            progressBackgroundColor={"white"}
          >
            {renderRefreshControl()}
          </RefreshControl>
        }
        contentContainerStyle={{
          marginTop: -insets.top,
          flex: 1,
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  textStyle: {
    fontStyle: "normal",
    fontFamily: "Quantico",
    fontSize: p2d(20),
    fontWeight: "700",
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: p2d(30),
    backgroundColor: "#FFFFFF",
  },
});
export default ConcatListScreen;
