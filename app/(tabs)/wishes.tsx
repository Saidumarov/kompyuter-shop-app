import { ProductCard } from "@/components/card/card";
import useLikeStore from "@/zustand/likes";
import { AntDesign } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
export default function Wishes() {
  const { likes } = useLikeStore();

  return (
    <>
      {likes && likes?.length > 0 ? (
        <GestureHandlerRootView style={cls.container}>
          <ScrollView>
            <View style={cls.products}>
              {likes?.map((el, i) => (
                <ProductCard key={i} product={el} />
              ))}
            </View>
          </ScrollView>
        </GestureHandlerRootView>
      ) : (
        <View style={cls.like_w}>
          <Image
            source={require("@/assets/images/liki.png")}
            style={cls.like_img}
          />
          <Text style={cls.like_h2}>Sevimli mahsulotlar yo'q</Text>
          <Text style={cls.like_p}>
            Mahsulotdagi <AntDesign name="heart" style={cls.heart} /> belgisi
            bilan qo'shing️
          </Text>
        </View>
      )}
    </>
  );
}

const cls = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffff",
  },
  products: {
    width: "93%",
    padding: 20,
    position: "relative",
    paddingBottom: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: "space-between",
    marginLeft: "auto",
    marginRight: "auto",
  },
  heart: {
    fontSize: 17,
    color: "red",
    marginTop: 10,
  },
  like_h2: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  like_p: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  like_img: {
    width: 130,
    height: 130,
    resizeMode: "contain",
  },
  like_w: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
