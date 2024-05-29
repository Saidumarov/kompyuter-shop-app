import { CategoryData } from "@/db";
import { EvilIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";

const Katalog = () => {
  const root = useRouter();
  const handleCategory = (v: string) => {
    root.push(`/category/filter/${v}`);
    const url = `filter/${v}`;
    AsyncStorage.setItem("category", JSON.stringify(url));
  };

  const handleCategoryType = (v: string) => {
    root.push(`/category/filter/${v}`);
    const url = `filter/${v}`;
    AsyncStorage.setItem("category", JSON.stringify(url));
  };

  return (
    <GestureHandlerRootView style={cls.container}>
      <ScrollView>
        <View style={cls.kompyuter}>
          <Text style={cls.kompyuter_text_h2}>Kompyuterlar</Text>
          <TouchableOpacity
            activeOpacity={0.6}
            style={cls.text_w}
            onPress={() => handleCategory("kompyuter")}
          >
            <Text style={cls.kompyuter_text_h3}>Barchasi</Text>
            <EvilIcons
              name="chevron-right"
              size={40}
              style={{ opacity: 0.7 }}
            />
          </TouchableOpacity>
          {CategoryData?.map(
            (el, i) =>
              el?.type === "kompyuter" && (
                <TouchableOpacity
                  activeOpacity={0.6}
                  key={i}
                  style={cls.kompyuter_text_w}
                  onPress={() => handleCategoryType(`kompyuter/${el?.path}`)}
                >
                  <View style={cls.logo_w}>
                    <Image
                      alt="no logo "
                      source={el?.image}
                      style={{
                        height: 40,
                        resizeMode: "contain",
                        width: el?.width,
                        borderRadius: 50,
                        position: "absolute",
                        left: i == 0 ? 8 : i == 5 ? 4 : 0,
                      }}
                    />
                    <Text style={cls.kompyuter_text}>{el.title}</Text>
                  </View>
                  <EvilIcons
                    name="chevron-right"
                    size={40}
                    style={{ opacity: 0.7 }}
                  />
                </TouchableOpacity>
              )
          )}
          <Text style={cls.telefonlar_text_h2}>Telefonlar</Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleCategory("telifon")}
            style={cls.text_w}
          >
            <Text style={cls.kompyuter_text_h3}>Barchasi</Text>
            <EvilIcons
              name="chevron-right"
              size={40}
              style={{ opacity: 0.7 }}
            />
          </TouchableOpacity>
          {CategoryData?.map(
            (el, i) =>
              el?.type === "telifon" && (
                <TouchableOpacity
                  activeOpacity={0.6}
                  key={i}
                  style={cls.kompyuter_text_w}
                  onPress={() => handleCategoryType(`telifon/${el?.path}`)}
                >
                  <View style={cls.logo_w}>
                    <Image
                      alt="no logo "
                      source={el?.image}
                      style={{
                        height: 40,
                        resizeMode: "contain",
                        width: el?.width,
                        borderRadius: 50,
                        position: "absolute",
                        left: el?.left,
                      }}
                    />
                    <Text style={cls.kompyuter_text}>{el.title}</Text>
                  </View>
                  <EvilIcons
                    name="chevron-right"
                    size={40}
                    style={{ opacity: 0.7 }}
                  />
                </TouchableOpacity>
              )
          )}
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const cls = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  kompyuter: {
    width: "100%",
    height: "auto",
    padding: 20,
    paddingTop: 5,
    paddingRight: 0,
  },
  kompyuter_text_h2: {
    color: "black",
    fontSize: 22,
    fontWeight: "500",
    paddingTop: 5,
  },
  kompyuter_text: {
    color: "#1d1c1c",
    fontSize: 16,
    paddingLeft: 40,
  },
  kompyuter_text_w: {
    borderBottomColor: "#6d6a6a",
    borderBottomWidth: 0.4,
    height: 40,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 10,
  },
  kompyuter_text_h3: {
    color: "#0d0c0c",
    fontSize: 16,
    paddingLeft: 10,
    fontWeight: "600",
    paddingTop: 10,
  },
  telefonlar_text_h2: {
    color: "black",
    fontSize: 22,
    fontWeight: "500",
    marginTop: 20,
  },
  text_w: {
    borderBottomColor: "#6d6a6a",
    borderBottomWidth: 0.4,
    paddingBottom: 10,
    paddingTop: 5,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 10,
  },
  kompyuter_img: {
    height: 40,
    resizeMode: "contain",
    borderRadius: 50,
  },
  logo_w: {
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    position: "relative",
  },
});

export default Katalog;
