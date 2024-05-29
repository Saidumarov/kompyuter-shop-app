import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useHooks/useColorScheme";
import {
  AntDesign,
  EvilIcons,
  Feather,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useCardStore from "@/zustand/shop-card";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const root = useRouter();
  const { cards } = useCardStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 60,
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: 5,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Bosh sahifa",
          headerTitle: "Kompyuter-shop",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "left",
          },
          headerBackground() {
            return (
              <View
                style={{
                  backgroundColor: "#ffffff",
                  width: "100%",
                  height: "100%",
                }}
              />
            );
          },
          headerStatusBarHeight: 25,
          tabBarInactiveTintColor: "#8b8e99",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={25} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => root.push("/search")}
              activeOpacity={0.8}
            >
              <EvilIcons name="search" style={cls.searchBtn} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="katalog"
        options={{
          title: "Katalog",
          headerStatusBarHeight: 25,
          headerTitle: "Katagoriyalar",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerBackground() {
            return (
              <View
                style={{
                  backgroundColor: "#ffffff",
                  width: "100%",
                  height: "100%",
                }}
              />
            );
          },
          tabBarInactiveTintColor: "#8b8e99",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={28} name="searchengin" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Savat",
          headerTitle: `Savatda ${cards?.length} ta mahsulot`,
          headerStatusBarHeight: 25,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerBackground() {
            return (
              <View
                style={{
                  backgroundColor: "#ffffff",
                  width: "100%",
                  height: "100%",
                }}
              />
            );
          },
          tabBarInactiveTintColor: "#8b8e99",
          tabBarIcon: ({ color }) => (
            <>
              {cards?.length > 0 ? (
                <View style={cls.cartCount}>
                  <Text style={cls.cartCount_text}>{cards?.length}</Text>
                </View>
              ) : (
                ""
              )}
              <Feather name="shopping-cart" size={25} color={color} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="wishes"
        options={{
          title: "Saralangan",
          headerStatusBarHeight: 25,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerBackground() {
            return (
              <View
                style={{
                  backgroundColor: "#ffffff",
                  width: "100%",
                  height: "100%",
                }}
              />
            );
          },
          tabBarInactiveTintColor: "#8b8e99",
          tabBarIcon: ({ color }) => (
            <AntDesign size={25} name="hearto" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const cls = StyleSheet.create({
  searchBtnW: {
    width: "100%",
    height: 58,
    display: "flex",
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  searchBtn: {
    fontSize: 35,
    right: 25,
  },
  cartCount: {
    position: "absolute",
    backgroundColor: "rgb(41, 40, 41)",
    width: 20,
    height: 20,
    borderRadius: 50,
    zIndex: 2,
    top: -10,
    right: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cartCount_text: {
    color: "white",
  },
});
