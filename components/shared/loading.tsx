import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
const { width, height } = Dimensions.get("window");
export default function Loading() {
  const loading = [{}, {}, {}, {}];
  return (
    <>
      {loading?.map((_, i) => (
        <View style={cls.loading_w} key={i}>
          <View style={cls.loading_item1}></View>
          <View style={cls.loading_item2}></View>
          <View style={cls.loading_item3}></View>
          <View style={cls.loading_item4}></View>
        </View>
      ))}
    </>
  );
}

const cls = StyleSheet.create({
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
  loading_item1: {
    width: "100%",
    height: "60%",
    borderRadius: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: "rgb(245, 247, 250)",
  },
  loading_item2: {
    width: "100%",
    height: "6%",
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "rgb(245, 247, 250)",
  },
  loading_item3: {
    width: "85%",
    height: "6%",
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "rgb(245, 247, 250)",
  },
  loading_item4: {
    width: "65%",
    height: "6%",
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "rgb(245, 247, 250)",
  },
});
