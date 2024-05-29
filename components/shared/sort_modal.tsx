import React, { useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const radioButtons = [
  {
    id: "1",
    label: "Ommabop ",
    value: "defolt",
  },
  {
    id: "2",
    label: "Arzon",
    value: "asc",
  },
  {
    id: "3",
    label: "Qimmat",
    value: "desc",
  },
];
export default function SortModal({ state }: any) {
  const { setModalVisible, selectedId, setSelectedId, slugString } = state;
  const sheetRef = useRef<BottomSheet>(null);
  const [ID, setID] = useState(selectedId);
  const [value, setvalue] = useState("");
  const [snapPoints, setSnapPoints] = useState(["55%"]);

  function getSubstringFromKeywords(input: string, keywords: string[]) {
    for (let keyword of keywords) {
      const startIndex = input.indexOf(keyword);
      if (startIndex !== -1) {
        return input.substring(startIndex);
      }
    }
    return "";
  }

  const keywords = ["kompyuter", "telifon"];

  const handelSort = (v: string) => {
    setSnapPoints(["1%"]);
    const api = getSubstringFromKeywords(slugString, keywords);
    AsyncStorage.setItem("category", JSON.stringify(`sort/${api}?sort=${v}`));
    setSelectedId(ID);
    setTimeout(() => {
      setModalVisible(false);
    }, 300);
  };

  const handelClose = () => {
    setSnapPoints(["1%"]);
    setTimeout(() => {
      setModalVisible(false);
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
          onClose={() => setModalVisible(false)}
        >
          <BottomSheetView style={{ width: "100%", height: "100%" }}>
            <View style={cls.sort_modal_item}>
              <Text style={cls.sort_text}>Saralash</Text>
              {radioButtons?.map((el, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    cls.btns_group,
                    {
                      borderBottomWidth: el?.id === "3" ? 0.4 : 0,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => (setID(el.id), setvalue(el?.value))}
                >
                  <Text style={{ fontSize: 16 }}>{el?.label}</Text>
                  <View style={cls.radio_w}>
                    {el?.id === ID ? (
                      <AntDesign name="checkcircle" size={25} />
                    ) : null}
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => handelSort(value)}
                activeOpacity={0.8}
                style={cls.btn_sort}
              >
                <Text style={{ color: "#fff", fontSize: 18 }}>Qo'llash</Text>
              </TouchableOpacity>
            </View>
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
  sort_modal_item: {
    width: "100%",
    padding: 20,
    position: "relative",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    height: "100%",
  },
  btns_group: {
    width: "100%",
    height: 50,
    borderTopColor: "#55555592",
    borderBottomColor: "#55555592",
    borderTopWidth: 0.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
  },
  radio_w: {
    width: Platform.OS === "ios" ? 26 : 25,
    height: Platform.OS === "ios" ? 26 : 25,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(108, 108, 108, 0.912)",
    backgroundColor: "rgba(255, 255, 255, 0.912)",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  sort_text: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgb(51, 51, 51)",
    paddingBottom: 10,
  },
  btn_sort: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(60, 0, 188, 0.854)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 25,
  },
});
