import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  SafeAreaView,
  Image,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { EvilIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Viloyatlar } from "@/db";
import useCardStore from "@/zustand/shop-card";
import { NumberFormat } from "@/hooks";
import { Product } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");

interface ChekCard extends Product {
  term?: string;
  monthly_payment?: string;
}
export default function Checkout() {
  const root = useRouter();
  const { id } = useGlobalSearchParams<any>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const { cards } = useCardStore();
  const [data, setData] = useState<ChekCard[]>();
  const [isLoading, setisLoading] = useState(false);
  const [inputError, setInputError] = useState({
    full_name: false,
    phone: false,
    region: false,
    city: false,
  });
  const [user, setUser] = useState({
    full_name: "",
    phone: "",
    region: "",
    city: "",
  });

  const handlePhoneChange = (text: string) => {
    // Remove all non-numeric characters except for the leading +998-
    let cleaned = text.replace(/[^0-9]/g, "");

    // Ensure the prefix +998- stays in place
    if (cleaned.startsWith("998")) {
      cleaned = cleaned.slice(3);
    } else {
      cleaned = "";
    }

    // Apply formatting
    if (cleaned.length > 2) {
      cleaned = cleaned.replace(/^(\d{2})(\d)/, "$1-$2");
    }
    if (cleaned.length > 5) {
      cleaned = cleaned.replace(/(\d{3})(\d{2})(\d)/, "$1-$2-$3");
    }
    if (cleaned.length > 9) {
      cleaned = cleaned.replace(/(\d{2})(\d{3})(\d{2})(\d)/, "$1-$2-$3-$4");
    }
    setPhoneNumber(`+998-${cleaned}`);
    setUser((prevUser) => ({ ...prevUser, phone: phoneNumber }));
    setInputError((prevInputError) => ({
      ...prevInputError,
      phone: false,
    }));
  };

  // fetch data
  useEffect(() => {
    let checkout_card: Product[] = [];
    const fetchCheckoutCard = async () => {
      try {
        const data = await AsyncStorage.getItem("installment_payment");
        if (data) {
          checkout_card = JSON.parse(data);
        }
        // Set data only after fetching and parsing
        if (id === "products") {
          setData(cards);
        } else {
          setData(checkout_card);
        }
      } catch (error) {
        console.error("Error fetching installment payment:", error);
      }
    };

    fetchCheckoutCard();
  }, [id]);

  // subtotal
  useEffect(() => {
    const totalSubtotal = data?.reduce((acc, item) => {
      return acc + item?.realPrice * item?.count;
    }, 0);
    setSubtotal(totalSubtotal || 0);
  }, [cards, data]);

  // user info
  const handleChange = (fieldName: string) => (text: string) => {
    setUser({ ...user, [fieldName]: text });
    setInputError((prevInputError) => ({
      ...prevInputError,
      [fieldName]: false,
    }));
  };
  // bot api token
  const botToken = "6229717040:AAH25e0ViIbOVvb0njOkVVElFf_H7Ol3lGA";
  const chatId = 1121426146;

  // Ma'lumotlarni Telegramga yuborish
  const handleSubmit = async () => {
    const { full_name, phone, region, city } = user;
    let hasError = false;
    // Check for missing fields and update inputError state
    const newInputError = { ...inputError };
    if (!full_name) {
      newInputError.full_name = true;
      hasError = true;
    }
    if (!phone) {
      newInputError.phone = true;
      hasError = true;
    }
    if (!region) {
      newInputError.region = true;
      hasError = true;
    }
    if (!city) {
      newInputError.city = true;
      hasError = true;
    }

    // Update the inputError state
    setInputError(newInputError);

    // If there are errors, stop the function
    if (hasError) {
      console.log("To'liq ma'lumotlarni kiriting!");
      return;
    }

    setisLoading(true);
    try {
      if (data) {
        for (const product of data) {
          const imageUrl = product?.imgags[0]?.img;
          const imageCaption = `Xaridor: ${full_name}\nTelefon: ${phone}\nViloyat: ${region}\nTuman: ${city}\n\nMahsulotlar:\n\Nomi: ${
            product?.titel
          }\nNarxi: ${product?.realPrice
            ?.toString()
            ?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} so'm\nTa'rif: ${
            product?.description
          }\nTo'lov turi: ${product?.term || "Naxt"}\nOylik to'lov: ${
            product?.monthly_payment || 0
          } so'm\n\n`;

          const response = await fetch(
            `https://api.telegram.org/bot${botToken}/sendPhoto`,
            {
              method: "POST",
              body: JSON.stringify({
                chat_id: chatId,
                photo: imageUrl,
                caption: imageCaption,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            console.log("Xabar yuborishda xatolik yuz berdi!");
            return;
          }
        }
      }

      setUser({
        full_name: "",
        phone: "",
        city: "",
        region: "",
      });
      setPhoneNumber("");
    } catch (error) {
      console.error("Rasm yuborishda xatolik yuz berdi:", error);
      // toast.error("Rasm yuborishda xatolik yuz berdi!");
    } finally {
      setisLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          presentation: "card",
          headerShown: true,
          headerTransparent: false,
          headerTitle: "Buyurtmalarni rasmilashtrish",
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => root.back()}>
              <EvilIcons name="chevron-left" size={50} />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView>
        <GestureHandlerRootView style={cls.form_w}>
          <ScrollView>
            <View style={cls.products_order}>
              <Text style={{ fontSize: 17 }}>{data?.length} ta mahsulot.</Text>
              <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                {data &&
                  data?.map((c, i) => (
                    <View key={i} style={cls.img_chek_w}>
                      <Image
                        style={cls.img_chek}
                        source={{ uri: c?.imgags[0]?.img }}
                      />
                    </View>
                  ))}
              </ScrollView>
            </View>
            <View style={cls.form_container}>
              <Text style={cls.text_order}>Buyurtma qabul qiluvchi</Text>
              <TextInput
                placeholder="F.I.O *"
                keyboardType="default"
                style={[
                  cls.input,
                  {
                    borderBottomColor: inputError.full_name
                      ? "red"
                      : "rgb(217, 217, 217)",
                  },
                ]}
                onChangeText={handleChange("full_name")}
                value={user.full_name}
                placeholderTextColor={
                  inputError.full_name ? "red" : "rgb(217, 217, 217)"
                }
              />

              <TextInput
                keyboardType="phone-pad"
                style={[
                  cls.input,
                  {
                    borderBottomColor: inputError.phone
                      ? "red"
                      : "rgb(217, 217, 217)",
                  },
                ]}
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                maxLength={17}
                placeholder="+998-00-000-00-00"
                placeholderTextColor={
                  inputError.phone ? "red" : "rgb(217, 217, 217)"
                }
              />
              <RNPickerSelect
                onValueChange={(value) => (
                  setUser((prevUser) => ({ ...prevUser, region: value })),
                  setInputError((prevInputError) => ({
                    ...prevInputError,
                    region: false,
                  }))
                )}
                items={Viloyatlar}
                style={{
                  inputAndroid: [
                    pickerSelectStyles.inputAndroid,
                    {
                      borderBottomColor: inputError.region
                        ? "red"
                        : "rgb(217, 217, 217)",
                    },
                  ],
                  inputIOS: [
                    pickerSelectStyles.inputIOS,
                    {
                      borderBottomColor: inputError.region
                        ? "red"
                        : "rgb(217, 217, 217)",
                    },
                  ],
                }}
                value={user.region}
                placeholder={{
                  label: "Viloyat/tanlang *",
                  color: "rgb(217, 217, 217",
                }}
              />
              <TextInput
                placeholder="Tuman/kriting *"
                keyboardType="default"
                style={[
                  cls.input,
                  {
                    borderBottomColor: inputError.city
                      ? "red"
                      : "rgb(217, 217, 217)",
                  },
                ]}
                onChangeText={handleChange("city")}
                value={user.city}
                placeholderTextColor={
                  inputError.city ? "red" : "rgb(217, 217, 217)"
                }
              />

              <Text style={{ opacity: 0.7, paddingTop: 20 }}>
                Siz koʻrsatgan telefon raqamiga buyurtma holati haqida
                bildirishnoma yuboramiz. Yetkazib berish vaqtini aniqlashtirish
                uchun kuryer siz bilan telefon orqali bogʻlanadi.
              </Text>
            </View>
            <View style={cls.order_count}>
              <Text style={cls.order_count_text}>Jami:</Text>
              <Text style={cls.order_count_text}>
                {NumberFormat(subtotal)} so'm
              </Text>
            </View>
          </ScrollView>
        </GestureHandlerRootView>
        <View style={cls.orders_w}>
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.8}
            style={cls.orders_btn}
          >
            <Text style={cls.orders_btn_text}>
              {isLoading ? <ActivityIndicator /> : "Buyurtma berish"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const cls = StyleSheet.create({
  form_w: {
    width: width,
    height: "88%",
    backgroundColor: "rgb(245, 245, 245)",
  },
  form_container: {
    width: "100%",
    height: 380,
    paddingTop: 20,
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    height: 45,
    borderBottomWidth: 1,
    borderColor: "#fff",
    paddingLeft: 5,
    fontSize: 16,
    marginTop: 10,
    borderBottomColor: "rgb(217, 217, 217)",
    backgroundColor: "#fff",
  },
  text_order: {
    fontSize: 20,
    fontWeight: "500",
  },
  orders_w: {
    width: "100%",
    height: "12%",
    backgroundColor: "rgb(255, 255, 255)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    shadowColor: "rgba(255, 255, 255",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orders_btn: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(60, 0, 188, 0.854)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  orders_btn_text: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgb(255, 255, 255)",
  },
  products_order: {
    width: "100%",
    height: 140,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#fff",
  },
  img_chek: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  img_chek_w: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: "contain",
    marginRight: 10,
    overflow: "hidden",
    backgroundColor: "rgb(240, 240, 240)",
    marginTop: 8,
  },
  order_count: {
    width: "100%",
    height: 80,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#fff",
    marginBottom: 50,
    marginTop: 10,
  },
  order_count_text: {
    fontSize: 20,
    fontWeight: "500",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
    color: "black",
    height: 52,
    paddingRight: 30, // to ensure the text is never behind the icon
    borderBottomColor: "rgb(217, 217, 217)",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: "purple",
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    borderBottomColor: "rgb(217, 217, 217)",
  },
});
