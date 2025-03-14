import { View, Image, StyleSheet, Text, Dimensions } from "react-native";
import React from "react";
import Carousel from "react-native-snap-carousel";

const data = [
  { id: "1", image: require("../assets/anh1.png") },
  { id: "2", image: require("../assets/anh2.png") },
  { id: "3", image: require("../assets/anh3.png") },
];

const ImageSlide = () => {
  const renderItem = ({ item }: { item: { image: number } }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  return (
    <Carousel
      data={data}
      renderItem={renderItem}
      sliderWidth={Dimensions.get("window").width}
      itemWidth={200}
      loop
      autoplay
      layout="default"
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    backgroundColor: "#ffcccb",
    borderRadius: 10,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 105,
    resizeMode: "cover",
  },
});

export default ImageSlide;
