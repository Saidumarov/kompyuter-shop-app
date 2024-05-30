import { ProductCard } from "@/components/card/card";
import { NotfoundLike } from "@/components/shared/not-found";
import useLikeStore from "@/zustand/likes";
import { StyleSheet, View } from "react-native";
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
        <NotfoundLike />
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
});
