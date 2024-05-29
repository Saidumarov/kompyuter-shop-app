import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Product } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NumberFormatMonth } from "@/hooks";
export default function BottomShate({ state }: any) {
  const { modalVisible, setModalVisible, el, setScrollY } = state;
  const sheetRef = useRef<BottomSheet>(null);
  const [snapPoints, setSnapPoints] = useState(["55%"]);
  const [month, setMonth] = useState(3);
  const [subtotal, setSubtotal] = useState(0);
  const root = useRouter();

  useEffect(() => {
    //  3,  6 ,  12 oy to'lov
    if (month === 3) {
      setSubtotal(el?.realPrice / 3);
    }
    if (month === 6) {
      setSubtotal(el?.realPrice / 6);
    }
    if (month === 12) {
      setSubtotal(el?.realPrice / 12);
    }
  }, [month, modalVisible]);

  useEffect(() => {
    if (modalVisible) {
      sheetRef.current?.expand();
      setScrollY(false);
    } else {
      sheetRef.current?.close();
    }
  }, [modalVisible]);

  const handelPlay = (el: Product) => {
    const narx = NumberFormatMonth(subtotal);
    const card = {
      term: month + "oy",
      monthly_payment: narx,
      count: 1,
    };
    const newCard = [{ ...el, ...card }];
    AsyncStorage.setItem("installment_payment", JSON.stringify(newCard));
    root.push(`/checkout/${el?._id}`);
    setModalVisible(false);
  };

  const handelClose = () => {
    setSnapPoints(["1%"]);
    setTimeout(() => {
      setModalVisible(false);
    }, 300);
  };

  return (
    <>
      <GestureHandlerRootView style={[styles.container]}>
        <TouchableOpacity
          onPress={handelClose}
          style={styles.button}
        ></TouchableOpacity>
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => setModalVisible(false)}
        >
          <BottomSheetView>
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={styles.modalView}
            >
              <View style={styles.modal}>
                <Text style={styles.modalText}>Muddatli to'lov</Text>
              </View>
              <View style={styles.btnGroup}>
                <TouchableOpacity
                  onPress={() => setMonth(3)}
                  activeOpacity={0.8}
                  style={styles.month_3}
                >
                  <View
                    style={
                      month === 3 ? styles.month_text_w : styles.month_text_w3
                    }
                  >
                    <Text style={{ color: month === 3 ? "white" : "black" }}>
                      3 oy
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setMonth(6)}
                  style={styles.month_6}
                  activeOpacity={0.8}
                >
                  <View
                    style={
                      month === 6 ? styles.month_text_w : styles.month_text_w6
                    }
                  >
                    <Text style={{ color: month === 6 ? "white" : "black" }}>
                      6 oy
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setMonth(12)}
                  style={styles.month_12}
                  activeOpacity={0.8}
                >
                  <View
                    style={
                      month === 12 ? styles.month_text_w : styles.month_text_w12
                    }
                  >
                    <Text style={{ color: month === 12 ? "white" : "black" }}>
                      12 oy
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.price}>
                  {subtotal.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                  so'm
                </Text>
              </View>
              <View style={styles.pay_w}>
                <TouchableOpacity
                  onPress={() => handelPlay(el)}
                  activeOpacity={0.8}
                  style={styles.pay}
                >
                  <Text style={styles.pay_text}>To'lov</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </>
  );
}

const btnStyles = {
  width: 60,
  height: 60,
  backgroundColor: "rgb(240, 240, 240)",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 50,
  paddingLeft: 10,
  paddingRight: 10,
  marginTop: 10,
  borderWidth: 1,
};

const btnText = {
  color: "white",
  height: 40,
  width: 40,
  borderRadius: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transform: [{ rotate: "-45deg" }],
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#00000090",
    position: "absolute",
    height: "100%",
    zIndex: 105,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 15,
    width: "100%",
    height: "100%",
  },
  modalView: {
    width: "100%",
    height: "100%",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    color: "rgb(60, 0, 188)",
  },
  modal: {
    width: "100%",
    height: 50,
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 25,
  },
  month_3: {
    ...(btnStyles as ViewStyle),
    transform: [{ rotate: "45deg" }],
    borderTopColor: "rgb(60, 0, 188)",
    borderLeftColor: "rgb(255, 255, 255)",
    borderRightColor: "rgb(255, 255, 255)",
    borderBottomColor: "rgb(255, 255, 255)",
  },
  month_6: {
    ...(btnStyles as ViewStyle),
    transform: [{ rotate: "45deg" }],
    borderTopColor: "rgb(60, 0, 188)",
    borderLeftColor: "rgb(255, 255, 255)",
    borderRightColor: "rgb(60, 0, 188)",
    borderBottomColor: "rgb(255, 255, 255)",
  },
  month_12: {
    ...(btnStyles as ViewStyle),
    transform: [{ rotate: "45deg" }],
    borderTopColor: "rgb(60, 0, 188)",
    borderLeftColor: "rgb(60, 0, 188)",
    borderRightColor: "rgb(60, 0, 188)",
    borderBottomColor: "rgb(60, 0, 188)",
  },
  month_text_w: {
    ...(btnText as ViewStyle),
    backgroundColor: "rgb(60, 0, 188)",
  },
  month_text_w3: {
    ...(btnText as ViewStyle),
  },
  month_text_w6: {
    ...(btnText as ViewStyle),
  },
  month_text_w12: {
    ...(btnText as ViewStyle),
  },
  btnGroup: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 25,
    paddingBottom: 10,
  },
  price: {
    fontSize: 25,
    fontWeight: "500",
    textAlign: "center",
    color: "rgb(32, 32, 32)",
    paddingTop: 20,
  },
  pay_w: {
    width: "100%",
    height: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
    top: 30,
  },
  pay: {
    width: "90%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(60, 0, 188)",
    borderRadius: 15,
    paddingLeft: 15,
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  pay_text: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
