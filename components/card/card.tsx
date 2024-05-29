import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";

import { Product } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { NumberFormat } from "@/hooks/index";
import { NumberFormatMonth } from "@/hooks/index";
import useCardStore from "@/zustand/shop-card";
import useLikeStore from "@/zustand/likes";

type Styles = {
  length: number;
};

const { width, height } = Dimensions.get("window");
export const ProductCard = ({
  product,
  style,
}: {
  product: Product;
  style?: Styles;
}) => {
  const preMonth = product?.realPrice / 12;
  const router = useRouter();
  const { cards, updateCard } = useCardStore();
  const { likes, addLike, removeLike } = useLikeStore();

  const handleLike = (el: Product) => {
    addLike(el);
  };

  const handleRemove = (id: string) => {
    removeLike(id);
  };
  const isLiked = likes.some((c) => c._id === product._id);
  const onPressHandler = isLiked
    ? () => handleRemove(product?._id)
    : () => handleLike(product);

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => router.push(`/details/${product?._id}`)}
      >
        <View style={style ? cls.card_Mixsed : cls.card}>
          <View style={style ? cls.card_img_IS : cls.card_img}>
            <Image
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                objectFit: "contain",
              }}
              source={{ uri: product?.imgags[0]?.img }}
            />

            <TouchableOpacity
              onPress={onPressHandler}
              activeOpacity={0.6}
              style={cls.like}
            >
              {isLiked ? (
                <AntDesign name="heart" style={cls.heart} />
              ) : (
                <AntDesign name="hearto" style={cls.hearto} />
              )}
            </TouchableOpacity>

            <View style={product?.isDiscounts ? cls.chegrimaW : null}>
              <Text style={cls.chegrima}>
                {product.isDiscounts ? "Chegirma" : ""}
              </Text>
            </View>
          </View>
          <View style={style ? cls.card_contentIS : cls.card_content}>
            <Text style={cls.card_title}>
              {style
                ? product.titel.length > style?.length
                  ? product.titel.substring(0, style?.length) + "..."
                  : product.titel
                : product.titel.length > 35
                ? product.titel.substring(0, 35) + "..."
                : product.titel}
            </Text>
            <View style={cls.card_price}>
              <Text style={cls.card_price_text}>
                {NumberFormatMonth(preMonth)}
                so'm/oyiga
              </Text>
            </View>
            <Text style={cls.oldPrice}>
              {NumberFormat(product?.oldPrice)} so'm
            </Text>
            <Text style={cls.realPrice}>
              {NumberFormat(product.realPrice)} so'm
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

const cls = StyleSheet.create({
  card: {
    width: "48%",
    height: 360,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 5,
  },
  card_Mixsed: {
    width: 145,
    height: 330,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 5,
    marginLeft: 10,
  },
  card_img_IS: {
    width: "100%",
    height: "57%",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgb(240, 240, 240)",
  },
  card_img: {
    width: "100%",
    height: "62%",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgb(240, 240, 240)",
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  card_content: {
    width: "100%",
    height: "38%",
    paddingLeft: 7,
  },
  card_contentIS: {
    width: "100%",
    height: "43%",
    paddingLeft: 7,
  },
  card_title: {
    paddingTop: 8,
  },
  chegrima: {
    fontSize: 12,
    color: "white",
  },
  chegrimaW: {
    backgroundColor: "rgb(156, 0, 252)",
    position: "absolute",
    left: 10,
    bottom: 10,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 10,
  },
  card_price: {
    width: width * 0.36,
    borderRadius: 8,
    backgroundColor: "rgb(242, 255, 0)",
    marginTop: 5,
  },
  card_price_text: {
    fontSize: 12,
    color: "black",
    padding: 4,
  },
  oldPrice: {
    paddingTop: 5,
    paddingBottom: 1,
    textDecorationLine: "line-through",
  },
  realPrice: {
    fontWeight: "bold",
    fontSize: 16,
  },
  like: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 10,
    right: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 10,
  },
  heart: {
    fontSize: 20,
    color: "red",
  },
  hearto: {
    color: "#555",
    fontSize: 20,
  },
});
