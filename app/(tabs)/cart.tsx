import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import useCardStore from "@/zustand/shop-card";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { CartComponent } from "@/components/card";
import { useEffect, useState } from "react";
import { NumberFormat } from "@/hooks";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const { height } = Dimensions.get("window");
export default function Cart() {
  const { cards } = useCardStore();
  const [subTotal, setSubtotal] = useState<number>(0);
  const root = useRouter();
  useEffect(() => {
    const totalSubtotal = cards.reduce((acc, item) => {
      return acc + item?.realPrice * item?.count;
    }, 0);
    setSubtotal(totalSubtotal);
  }, [cards]);

  return (
    <>
      {cards?.length > 0 ? (
        <>
          <GestureHandlerRootView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <View style={styles.cards}>
                  {cards?.map((el, i) => (
                    <CartComponent key={i} product={el} />
                  ))}
                </View>
              </View>
            </ScrollView>
          </GestureHandlerRootView>
          <View style={styles.orders}>
            <Text style={styles.sub_total}>{NumberFormat(subTotal)} so'm</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.orders_btn}
              onPress={() => root.push("/checkout/products")}
            >
              <Text style={styles.orders_text}>Rasmiylashtrish</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.cart_w_not}>
          <Image
            source={require("@/assets/images/assets_images_cart.png")}
            style={styles.cart_img}
          />
          <Text style={styles.cart_h2}>Savatda hozircha mahsulot yo'q.</Text>
          <Text style={styles.cart_p}>
            Mahsulotdagi{" "}
            <Feather name="shopping-cart" style={styles.cartIcon} /> belgisi
            bilan qo'shing️
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: height,
    backgroundColor: "#fff",
    paddingLeft: 15,
    paddingRight: 15,
  },
  cards: {
    paddingBottom: 210,
  },
  orders: {
    width: "100%",
    height: 70,
    backgroundColor: "rgb(255, 255, 255)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: "rgba(255, 255, 255",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orders_btn: {
    width: 150,
    height: 50,
    backgroundColor: "rgba(60, 0, 188, 0.854)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  orders_text: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  sub_total: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  cart_h2: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  cart_p: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  cart_w_not: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  cart_img: {
    width: 130,
    height: 130,
    resizeMode: "contain",
  },
  cartIcon: {
    fontSize: 20,
    color: "rgb(130, 0, 211)",
  },
});
