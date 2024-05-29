import { View, StyleSheet, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";
import { getData } from "@/api/fetching.service";
import {
  GestureHandlerRootView,
  RefreshControl,
  ScrollView,
} from "react-native-gesture-handler";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { AntDesign, EvilIcons, Octicons } from "@expo/vector-icons";
import { ProductCard } from "@/components/card/card";
import Loading from "@/components/shared/loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SortModal, { radioButtons } from "@/components/shared/sort_modal";
import FilterModal from "@/components/shared/filter_modal";

export default function Category() {
  const { slug } = useGlobalSearchParams<any>();
  const slugString = slug?.join("/");
  const [url, setUrl] = useState(slugString);
  const [refreshing, setRefreshing] = useState(false);
  const root = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModal, setfilterModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("1");
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: [slug, slugString, url, selectedId],
    queryFn: () => getData(url),
  });

  const headerTitle =
    slug && slug.length >= 2
      ? slug[1]?.charAt(0)?.toUpperCase() +
        slug[1]?.slice(1)?.toLowerCase() +
        "lar"
      : "Kategorialar";

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getData(url);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const getUrl = async () => {
      try {
        const category = await AsyncStorage.getItem("category");
        if (category !== null) {
          setUrl(JSON.parse(category));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUrl();
  }, [slugString, slug, selectedId, filterModal]);

  return (
    <>
      <Stack.Screen
        options={{
          presentation: "card",
          headerShown: true,
          headerTransparent: false,
          headerTitle: headerTitle,
          headerLeft: () => (
            <TouchableOpacity activeOpacity={0.8} onPress={() => root.back()}>
              <EvilIcons name="chevron-left" size={55} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setfilterModal(true)}
              activeOpacity={0.8}
            >
              <Octicons name="filter" size={27} />
            </TouchableOpacity>
          ),
          headerBackground() {
            return (
              <View
                style={{
                  backgroundColor:
                    modalVisible || filterModal
                      ? "rgba(0, 0, 0, 0.5)"
                      : "#ffffff",
                  width: "100%",
                  height: "100%",
                }}
              />
            );
          },
        }}
      />
      <GestureHandlerRootView style={cls.wrapper}>
        <View style={cls.sort_w}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={cls.sort}
            onPress={() => setModalVisible(true)}
          >
            {radioButtons?.map((el, i) => {
              if (el?.id === selectedId) {
                return <Text key={i}>{el.label}</Text>;
              }
            })}
            <AntDesign name="down" size={15} />
          </TouchableOpacity>
        </View>
        <ScrollView
          scrollEnabled={!isLoading}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={cls.products}>
            {!data ? (
              <Loading />
            ) : (
              data?.map((el, i) => <ProductCard key={i} product={el} />)
            )}
          </View>
        </ScrollView>
        {modalVisible && (
          <SortModal
            state={{
              modalVisible,
              setModalVisible,
              selectedId,
              setSelectedId,
              slugString,
            }}
          />
        )}
        {filterModal && (
          <FilterModal
            state={{
              filterModal,
              setfilterModal,
              slugString,
            }}
          />
        )}
      </GestureHandlerRootView>
    </>
  );
}

const cls = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  products: {
    width: "93%",
    padding: 20,
    position: "relative",
    paddingBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: "space-between",
    marginLeft: "auto",
    marginRight: "auto",
    paddingTop: 5,
  },
  sort: {
    width: 100,
    padding: 5,
    position: "relative",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    cursor: "pointer",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 0.5,
    borderColor: "rgba(3, 5, 23, 0.34)",
    marginLeft: 5,
  },
  sort_w: {
    width: "93%",
    marginRight: "auto",
    marginLeft: "auto",
    paddingBottom: 5,
    paddingTop: 10,
  },
});
