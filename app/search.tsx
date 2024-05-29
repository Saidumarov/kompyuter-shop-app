import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  Animated,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";
import { getData } from "@/api/fetching.service";
import { ProductCard } from "@/components/card/card";
export default function Search() {
  const [isSearchActive, setSearchActive] = useState(false);
  const searchWidth = useRef(new Animated.Value(45)).current;
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["search", debouncedSearchText],
    queryFn: () => getData(`search?query=${debouncedSearchText}`),
    enabled: !!debouncedSearchText,
  });

  const handleSearchPress = () => {
    setSearchActive(true);
    Animated.timing(searchWidth, {
      toValue: 300,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleCancelPress = () => {
    Animated.timing(searchWidth, {
      toValue: 45,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setSearchActive(false));
  };

  return (
    <>
      <View style={styles.header}>
        <Animated.View style={[styles.searchContainer, { width: searchWidth }]}>
          {isSearchActive ? (
            <TextInput
              keyboardType="web-search"
              clearButtonMode="never"
              onChangeText={setSearchText}
              value={searchText}
              placeholder="Mahsulotlar qidirish..."
              autoFocus={true}
            />
          ) : (
            <TouchableOpacity onPress={handleSearchPress}>
              <AntDesign name="search1" size={24} color="black" />
            </TouchableOpacity>
          )}
        </Animated.View>
        {isSearchActive && (
          <TouchableOpacity
            onPress={handleCancelPress}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>
              <AntDesign name="close" size={24} color="black" />
            </Text>
          </TouchableOpacity>
        )}
        {!isSearchActive && (
          <Text style={styles.searchText}>Mahsulotlarni izlash...</Text>
        )}
      </View>
      <GestureHandlerRootView style={styles.body}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator style={styles.loading_indicator} />
            </View>
          ) : null}
          <View style={styles.products}>
            {data && data?.length > 0 ? (
              data?.map((el, i) => <ProductCard key={i} product={el} />)
            ) : (
              <>
                {!isLoading ? (
                  <Image
                    source={require("@/assets/images/searchres.png")}
                    alt="not"
                    style={styles.image}
                  />
                ) : null}
              </>
            )}
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: "#ffffff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    height: 45,
  },
  cancelButton: {
    marginLeft: 10,
    padding: 10,
  },
  cancelText: {
    color: "#007BFF",
  },
  searchText: {
    fontSize: 18,
    color: "#000",
    marginLeft: 10,
  },
  body: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },

  back: {
    fontSize: 50,
    color: "#000",
  },
  input: {
    width: "100%",
    height: 40,
    borderRadius: 20,
    paddingLeft: 15,
    backgroundColor: "rgba(90, 93, 250, 0.071)",
    borderWidth: 0,
    borderColor: "transparent",
    marginTop: 25,
  },

  clearButton: {
    position: "absolute",
    right: 30,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginTop: 10,
  },
  clearIcon: {
    fontSize: 20,
    color: "#000",
  },
  image: {
    width: "100%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  products: {
    width: "93%",
    padding: 10,
    position: "relative",
    paddingBottom: 70,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: "space-between",
    marginLeft: "auto",
    marginRight: "auto",
  },
  resultText: {
    width: "93%",
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 15,
    position: "relative",
    fontSize: 19,
  },
  loading: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    position: "absolute",
    zIndex: 2,
  },
  loading_indicator: {
    width: 50,
    height: 50,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    top: 50,
  },
});
