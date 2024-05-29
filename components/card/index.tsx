import { NumberFormat } from "@/hooks";
import { Product } from "@/types";
import useCardStore from "@/zustand/shop-card";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, Image, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export const CartComponent = ({ product }: { product: Product }) => {
  const { cards, removeCard, updateCard } = useCardStore();

  const increment = (el: Product, type: string) => {
    if (type === "inc") {
      const obj = {
        ...el,
        count: el.count + 1,
      };
      updateCard(obj);
    } else {
      const obj = {
        ...el,
        count: el.count - 1,
      };
      updateCard(obj);
    }
  };

  return (
    <>
      <View style={cls.cart_w}>
        <Image source={{ uri: product?.imgags[0].img }} style={cls.img} />
        <View style={cls.cart_dis}>
          <View style={cls.price}>
            <Text style={cls.realPrice}>
              {NumberFormat(product.realPrice)} so'm
            </Text>
            <Text style={cls.oldPrice}>
              {NumberFormat(product.oldPrice)} so'm{" "}
            </Text>
          </View>
          <Text style={cls.description}>
            {product?.description.length > 50
              ? product.description.substring(0, 50) + "..."
              : product.description}
          </Text>
          <View style={cls.counter}>
            <View style={cls.counter_item}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => increment(product, "dic")}
                style={cls.counter_item_btn}
                disabled={cards.some(
                  (c) => c._id === product._id && c.count === 1
                )}
              >
                <Text>
                  <AntDesign name="minus" size={16} />
                </Text>
              </TouchableOpacity>
              <Text>{product.count}</Text>
              <TouchableOpacity
                onPress={() => increment(product, "inc")}
                activeOpacity={0.8}
                style={cls.counter_item_btn}
                disabled={cards.some(
                  (c) => c._id === product._id && product.piece === c.count
                )}
              >
                <Text>
                  <AntDesign size={16} name="plus" />
                </Text>
              </TouchableOpacity>
            </View>
            <View style={cls.display}>
              <TouchableOpacity
                onPress={() => removeCard(product._id)}
                activeOpacity={0.6}
                style={cls.like}
              >
                <AntDesign name="delete" style={cls.delete} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const cls = StyleSheet.create({
  cart_w: {
    width: "100%",
    height: 170,
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(3, 5, 23, 0.34)",
    borderTopColor: "rgba(3, 5, 23, 0.34)",
    position: "relative",
  },

  img: {
    height: 110,
    width: "30%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  cart_dis: {
    justifyContent: "space-between",
    paddingLeft: 10,
    width: "70%",
  },
  price: {
    width: "100%",
    display: "flex",
    flexDirection: "row",

    gap: 5,
  },
  realPrice: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -1,
  },
  oldPrice: {
    textDecorationLine: "line-through",
    fontSize: 12,
    letterSpacing: -1,
    color: "rgba(3, 5, 23, 0.34)",
  },
  description: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 15,
    paddingTop: 5,
    position: "relative",
    width: "100%",
  },
  counter: {
    width: "100%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    gap: 40,
    alignItems: "center",
    position: "relative",
  },
  counter_item: {
    width: 110,
    height: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    paddingLeft: 4,
    paddingRight: 4,
    backgroundColor: "rgb(240, 240, 240)",
  },

  counter_item_btn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.912)",
    borderRadius: 10,
    position: "relative",
  },
  like: {
    backgroundColor: "transparent",
  },
  heart: {
    fontSize: 22,
    color: "red",
  },
  hearto: {
    fontSize: 22,
    color: "#555",
  },
  delete: {
    fontSize: 20,
    color: "red",
  },
  display: {
    display: "flex",
    flexDirection: "row",
  },
});
