import React, { useCallback, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import {
  ScrollView,
  GestureHandlerRootView,
  RefreshControl,
} from "react-native-gesture-handler";
import Banner from "@/components/shared/banner";
import { EvilIcons } from "@expo/vector-icons";
import { ProductCard } from "@/components/card/card";
import { Product } from "@/types";
import { getData } from "@/api/fetching.service";
import { StatusBar } from "expo-status-bar";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/shared/loading";
import * as Updates from "expo-updates";
const { width, height } = Dimensions.get("window");

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["product"],
    queryFn: () => getData("products"),
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getData("products");
    setRefreshing(false);
  }, []);

  const handleReload = async () => {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      console.error("Error reloading app:", e);
    }
  };

  if (error) {
    return (
      <View style={cls.errors}>
        <TouchableOpacity
          onPress={handleReload}
          style={cls.reflesh_btn}
          activeOpacity={0.8}
        >
          <Text style={cls.reflesh_text}>Yangilash</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor="#ffff" />
      {/* <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} /> */}
      <GestureHandlerRootView>
        <ScrollView
          scrollEnabled={!isLoading}
          style={{ backgroundColor: "#ffff" }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Banner />
          <View style={cls.container}>
            {!isLoading ? (
              <>
                <View style={cls.kompyuter}>
                  <Text style={cls.kompyuterText}>Kompyuterlar</Text>
                  <EvilIcons name="chevron-right" style={cls.right} />
                </View>
                <View style={cls.products}>
                  {data?.map((el, i) => {
                    if (el?.category === "kompyuter") {
                      return <ProductCard key={i} product={el} />;
                    }
                  })}
                </View>
                <View style={cls.telifon}>
                  <Text style={cls.telifin_text}>Aralash</Text>
                  <EvilIcons name="chevron-right" style={cls.right2} />
                </View>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  style={cls.products_A}
                >
                  {data?.map((el, i) => (
                    <ProductCard key={i} product={el} style={{ length: 30 }} />
                  ))}
                </ScrollView>
                <View style={cls.telifon}>
                  <Text style={cls.telifin_text}>Telifonlar</Text>
                  <EvilIcons name="chevron-right" style={cls.right2} />
                </View>
                <View style={cls.products}>
                  {data?.map((el, i) => {
                    if (el?.category === "telifon") {
                      return <ProductCard key={i} product={el} />;
                    }
                  })}
                </View>
              </>
            ) : (
              <>
                <View style={cls.loading_header}></View>
                <View style={cls.products}>
                  <Loading />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </>
  );
}

const cls = StyleSheet.create({
  container: {
    width: "100%",
  },
  kompyuter: {
    width: "100%",
    paddingTop: 20,
    paddingLeft: 20,
    backgroundColor: "#ffff",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  right: {
    fontSize: 35,
    paddingTop: -10,
  },
  kompyuterText: {
    fontSize: 20,
  },
  telifon: {
    width: "100%",
    padding: 20,
    backgroundColor: "#ffff",
    position: "relative",
    paddingBottom: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 0,
  },
  right2: {
    fontSize: 35,
    paddingTop: -10,
  },
  telifin_text: {
    fontSize: 20,
  },
  products: {
    width: "93%",
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

  // loading indicator
  loading_w: {
    width: "47%",
    height: height * 0.5,
    borderRadius: 10,
    overflow: "hidden",
    marginLeft: 3,
    marginRight: 3,
    // marginTop: 10,
  },

  loading_header: {
    width: "50%",
    height: "4%",
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "rgb(245, 247, 250)",
    marginLeft: 20,
  },
  banner_loading: {
    width: Dimensions.get("window").width,
    height: 190,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginTop: 10,
  },
  banner_loading_item: {
    width: "93%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
    backgroundColor: "rgb(245, 247, 250)",
    margin: "auto",
  },
  products_A: {
    width: "100%",
    position: "relative",
    paddingTop: 10,
    marginLeft: 4,
  },
  // error message
  errors: {
    width: width,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffff",
  },
  reflesh_btn: {
    width: "70%",
    height: 50,
    backgroundColor: "rgb(0, 47, 255)",
    marginRight: "auto",
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    // marginTop: 10,
    // marginBottom: 10,
  },
  reflesh_text: {
    color: "#ffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
