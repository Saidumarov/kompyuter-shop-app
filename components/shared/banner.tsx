import { Dimensions, Image, StyleSheet, View } from "react-native";
import { getData } from "@/api/fetching.service";
import { useQuery } from "@tanstack/react-query";
import Carousel from "react-native-snap-carousel";
interface BannerItem {
  img: string;
  id: string;
}

export default function Banner() {
  const { data, isLoading, error } = useQuery<BannerItem[]>({
    queryKey: ["banners"],
    queryFn: () => getData("banners"),
  });

  const renderItem = ({ item }: { item: BannerItem }) => (
    <View style={cls.item}>
      <Image src={item?.img} style={cls.image} />
    </View>
  );

  return (
    <View>
      {isLoading ? (
        <View style={cls.banner_loading}>
          <View style={cls.banner_loading_item}></View>
        </View>
      ) : (
        <Carousel
          layout="default"
          data={data || []}
          renderItem={renderItem}
          sliderWidth={Dimensions.get("window").width}
          itemWidth={Dimensions.get("window").width}
          loop
          autoplay
          autoplayInterval={3000}
        />
      )}
    </View>
  );
}

const cls = StyleSheet.create({
  item: {
    width: Dimensions.get("window").width,
    height: 190,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  image: {
    width: "94%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
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
});
