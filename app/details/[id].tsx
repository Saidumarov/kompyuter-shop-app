import { useEffect, useState } from "react";
import { NumberFormat } from "@/hooks/index";
import { getData } from "@/api/fetching.service";
import { Product } from "@/types";
import useCardStore from "@/zustand/shop-card";
import { AntDesign, Entypo, EvilIcons, Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { ProductCard } from "@/components/card/card";
import useLikeStore from "@/zustand/likes";
import BottomShate from "@/components/shared/bottom-sheet";
import ParallaxScrollView from "@/components/native-components/ParallaxScrollView";
const { width, height } = Dimensions.get("window");
interface BannerItem {
  img: string;
}

export default function Detailes() {
  const { id } = useGlobalSearchParams<any>();
  const { cards, addCard, loadCards } = useCardStore();
  const { likes, addLike, removeLike } = useLikeStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollY, setScrollY] = useState(false);
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: [id],
    queryFn: () => getData("products"),
  });
  const root = useRouter();
  const navigation = useRouter();
  const [isactive, setisActive] = useState(false);

  // carausel img
  const renderItem = ({ item }: { item: BannerItem }) => (
    <Image
      source={{ uri: item?.img }}
      style={{
        width: "100%",
        height: "100%",
        resizeMode: "contain",
      }}
    />
  );

  const arry = [{}, {}, {}, {}, {}, {}];

  // Add To Cart

  // pagenation img
  const pagination = (index: number) => (
    <Pagination
      dotsLength={index}
      activeDotIndex={activeSlide}
      dotStyle={{
        width: 40,
        height: 4,
        borderRadius: 5,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
      }}
    />
  );

  const addToCart = (el: Product) => {
    addCard(el);
    loadCards();
  };
  // Cart active item
  useEffect(() => {
    const isActive = cards?.some((el) => el?._id === id);
    setisActive(isActive);
  }, [cards]);

  const Like = likes?.find((el) => el._id === id);
  const handleLike = (id: string) => {
    const likedata = data?.find((el) => el?._id === id);
    if (likedata) {
      addLike(likedata);
    }
  };

  return (
    <>
      {isLoading ? (
        <View style={cls.loading}>
          <ActivityIndicator style={cls.loading_item} color={"#fff"} />
        </View>
      ) : null}
      <Stack.Screen
        options={{
          presentation: "card",
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerBackground() {
            return (
              <View
                style={{
                  backgroundColor: scrollY ? "#fff" : "transparent",
                  width: "100%",
                  height: "100%",
                }}
              />
            );
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.back()}>
              <EvilIcons name="chevron-left" size={50} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => (Like ? removeLike(Like._id) : handleLike(id))}
              activeOpacity={0.8}
            >
              <AntDesign
                name={Like ? "heart" : "hearto"}
                style={Like ? cls.hearto : cls.heart}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {data?.map((el, i) => {
        if (el?._id === id) {
          return (
            <View key={i}>
              <ParallaxScrollView
                headerBackgroundColor={{
                  light: "rgb(240, 240, 240)",
                  dark: "rgb(240, 240, 240)",
                }}
                headerImage={
                  <View style={{ position: "relative" }}>
                    <Carousel
                      layout="default"
                      data={el?.imgags}
                      renderItem={renderItem}
                      sliderWidth={width}
                      itemWidth={width}
                      loop
                      autoplay
                      autoplayInterval={3000}
                      onSnapToItem={(index) => setActiveSlide(index)}
                    />
                    <View style={cls.pagenationW}>
                      {pagination(el?.imgags?.length)}
                    </View>
                  </View>
                }
                scroll={{ setScrollY }}
              >
                <GestureHandlerRootView style={cls.wrapper_w}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={cls.wrapper}>
                      <View style={cls.details_container}>
                        <Text style={cls.title}>{el?.titel}</Text>
                        <Text style={cls.realPrice}>
                          {NumberFormat(el?.realPrice) + " so'm"}
                        </Text>
                        <Text style={cls.oldrealPrice}>
                          {NumberFormat(el?.realPrice) + " so'm"}
                        </Text>
                        <View style={el?.isDiscounts ? cls.chegirma_w : null}>
                          <Text style={cls.chegirma}>
                            {el?.isDiscounts ? "Chegirma" : ""}
                          </Text>
                        </View>
                        <TouchableOpacity
                          activeOpacity={0.6}
                          style={cls.touchable_opacity}
                          onPress={() => setModalVisible(true)}
                        >
                          <View style={cls.touchable_opacity_item}>
                            <Text style={cls.touchable_text}>
                              Muddatli to'lov
                            </Text>
                          </View>

                          <EvilIcons name="chevron-right" size={35} />
                        </TouchableOpacity>
                        <View style={cls.description_w}>
                          <Text
                            style={{
                              fontWeight: "500",
                              fontSize: 18,
                              paddingTop: 10,
                              paddingBottom: 10,
                            }}
                          >
                            Mahsulot tavsivfi
                          </Text>
                          {arry?.map((_, i) => (
                            <Text key={i} style={cls.description}>
                              <Entypo name="dot-single" size={15} />{" "}
                              {el?.description}
                            </Text>
                          ))}
                          <Text style={cls.type_h2}>O'xshash mahsulotlar</Text>
                          <View style={cls.products}>
                            {data?.map((product, i) => {
                              if (product?.category === el?.category) {
                                return (
                                  <ProductCard key={i} product={product} />
                                );
                              }
                            })}
                          </View>
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                </GestureHandlerRootView>
              </ParallaxScrollView>
              <View style={cls.addToCart}>
                <View style={cls.addToCart_btn}>
                  <View>
                    <Text style={cls.bottom_realP}>
                      {NumberFormat(el?.realPrice)} so'm
                    </Text>
                    <Text style={cls.bottom_oldP}>
                      {NumberFormat(el?.oldPrice)} so'm
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      isactive ? root.push("/cart") : addToCart(el)
                    }
                    activeOpacity={0.8}
                    style={isactive ? cls.add_btn_w_active : cls.add_btn_w}
                  >
                    <Text style={isactive ? null : cls.addToCart_btn_text}>
                      {isactive ? (
                        <View style={cls.addToCart_btn_text_w}>
                          <Feather
                            name="shopping-cart"
                            size={20}
                            color={"rgb(60, 0, 188)"}
                          />
                          <Text style={cls.addToCart_btn_text_active}>
                            O'tish
                          </Text>
                        </View>
                      ) : (
                        "Savatga"
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {modalVisible ? (
                <BottomShate
                  state={{ modalVisible, setModalVisible, el, setScrollY }}
                />
              ) : null}
            </View>
          );
        }
      })}
    </>
  );
}

const cls = StyleSheet.create({
  wrapper: {
    backgroundColor: "rgb(240, 240, 240)",
    position: "relative",
  },
  wrapper_w: {
    backgroundColor: "rgb(240, 240, 240)",
  },
  details_container: {
    width: width,
    height: "100%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  realPrice: {
    fontSize: 25,
    fontWeight: "bold",
    paddingTop: 25,
  },
  oldrealPrice: {
    fontSize: 16,
    paddingTop: 0,
    fontWeight: "600",
    textDecorationLine: "line-through",
  },

  chegirma: {
    position: "relative",
    fontSize: 12,
    color: "#fff",
    padding: 4,
    textAlign: "center",
  },

  chegirma_w: {
    width: 90,
    backgroundColor: "rgb(156, 0, 252)",
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 10,
    marginTop: 15,
  },
  touchable_opacity: {
    width: "100%",
    height: 50,
    backgroundColor: "rgb(242, 244, 247)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  touchable_text: {
    backgroundColor: "rgb(242, 255, 0)",
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  touchable_opacity_item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  description: {
    fontSize: 14,
    paddingTop: 8,
    paddingLeft: 10,
    paddingRight: 10,
    fontWeight: "400",
    letterSpacing: 0.5,
  },
  description_w: {
    paddingTop: 15,
    paddingBottom: 100,
  },
  addToCart: {
    position: "absolute",
    height: 60,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "rgb(243, 243, 243)",
    zIndex: 80,
    shadowColor: "rgba(255, 255, 255",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  bottom_realP: {
    fontSize: 18,
    fontWeight: "500",
  },
  bottom_oldP: {
    fontSize: 13,
    fontWeight: "400",
    textDecorationLine: "line-through",
  },
  addToCart_btn: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
  },
  add_btn_w: {
    width: 130,
    height: 40,
    backgroundColor: "rgb(130, 0, 211)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  add_btn_w_active: {
    width: 130,
    height: 40,
    borderColor: "rgb(60, 0, 188)",
    borderWidth: 1.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  addToCart_btn_text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  addToCart_btn_text_active: {
    color: "rgb(60, 0, 188)",
    fontSize: 16,
    fontWeight: "500",
  },
  pagenationW: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  addToCart_btn_text_w: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 10,
    height: "100%",
    paddingTop: 5,
  },
  loading: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "relative",
    zIndex: 1000,
  },
  loading_item: {
    height: 50,
    width: 50,
    backgroundColor: "rgb(83, 56, 255)",
    borderRadius: 10,
  },
  type_h2: {
    fontSize: 18,
    fontWeight: "600",
    paddingTop: 40,
    paddingBottom: 10,
  },
  products: {
    width: "100%",
    padding: 10,
    position: "relative",
    paddingBottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: "space-between",
    marginLeft: "auto",
    marginRight: "auto",
  },
  telifin_text: {
    fontSize: 20,
    paddingLeft: 15,
  },
  products_A: {
    width: "100%",
    position: "relative",
    paddingTop: 10,
    marginLeft: 4,
  },
  heart: {
    fontSize: 25,
    color: "rgb(48, 41, 41)",
  },
  hearto: {
    fontSize: 25,
    color: "red",
  },
});
