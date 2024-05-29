import React, { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { CategoryData } from "@/db";
import { EvilIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FilterModal({ state }: any) {
  const { filterModal, setfilterModal, slugString } = state;
  const sheetRef = useRef<BottomSheet>(null);
  const [snapPoints, setSnapPoints] = useState(["80%"]);
  const url = slugString?.split("/");
  const api = url[1];

  const handelClose = () => {
    setSnapPoints(["1%"]);
    setTimeout(() => {
      setfilterModal(false);
    }, 300);
  };

  const handleCategoryType = (v: string) => {
    const url = `filter/${v}`;
    AsyncStorage.setItem("category", JSON.stringify(url));
    setSnapPoints(["1%"]);
    setTimeout(() => {
      setfilterModal(false);
    }, 300);
  };
  return (
    <>
      <GestureHandlerRootView style={[cls.container]}>
        <TouchableOpacity
          onPress={handelClose}
          style={cls.button}
        ></TouchableOpacity>
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => setfilterModal(false)}
        >
          <BottomSheetView style={{ width: "100%", height: "100%" }}>
            <Text style={cls.sort_text}>Turkumlar</Text>
            <GestureHandlerRootView style={cls.filter_modal_item}>
              <ScrollView style={{ padding: 20 }}>
                {CategoryData?.map((el, i) => {
                  if (el?.type === api) {
                    return (
                      <View key={i}>
                        <TouchableOpacity
                          activeOpacity={0.6}
                          key={i}
                          style={cls.kompyuter_text_w}
                          onPress={() =>
                            handleCategoryType(`${api}/${el?.path}`)
                          }
                        >
                          <View style={cls.logo_w}>
                            <Image
                              alt="no logo "
                              source={el?.image}
                              style={{
                                height: 40,
                                resizeMode: "contain",
                                width: el?.width,
                                borderRadius: 50,
                                position: "absolute",
                                left: el?.left,
                              }}
                            />
                            <Text style={cls.kompyuter_text}>{el.title}</Text>
                          </View>
                          <EvilIcons
                            name="chevron-right"
                            size={40}
                            style={{ opacity: 0.7 }}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            </GestureHandlerRootView>
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </>
  );
}

const cls = StyleSheet.create({
  container: {
    width: "100%",
    position: "absolute",
    height: "100%",
    zIndex: 105,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 15,
    width: "100%",
    height: "100%",
  },
  filter_modal_item: {
    width: "100%",
    position: "relative",
    height: "95%",
  },
  sort_text: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgb(51, 51, 51)",
    paddingBottom: 10,
    textAlign: "center",
  },
  filter_text: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgb(51, 51, 51)",
    paddingBottom: 10,
    textAlign: "center",
  },
  kompyuter_text: {
    color: "#1d1c1c",
    fontSize: 16,
    paddingLeft: 40,
  },
  kompyuter_text_w: {
    borderBottomColor: "#6d6a6a",
    borderBottomWidth: 0.4,
    height: 40,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 10,
  },
  kompyuter_img: {
    height: 40,
    resizeMode: "contain",
    borderRadius: 50,
  },
  logo_w: {
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    position: "relative",
  },
});
