import React, { useEffect } from "react";
import {
  View,
  Button,
  Text,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  SafeAreaView, 
  SectionList,
  ScrollView,
} from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

const SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
};

const BottomSheet = (props) => {
  useEffect(function () {
    console.log(props.showBottomSheet, props.showCovidSheet);
    if (props.showBottomSheet || props.showCovidSheet) {
      top.value = withSpring(dimensions.height / 2 + 30, SPRING_CONFIG);
    } else {
      top.value = withSpring(dimensions.height, SPRING_CONFIG);
    }
  });

  const markerInfo = props.markerInfo;
  const markerLocation = props.showCovidSheet
    ? markerInfo.location.split(/[()]+/).filter(function (e) {
        return e;
      })
    : [0, 0];

  const markerLink = String(markerInfo.bookingLink);
  const markerImage = markerInfo.locationImage;
  const markerDates = props.showCovidSheet
    ? markerInfo.list_of_dates.reverse()
    : [0, 0];

  const dimensions = useWindowDimensions();

  const top = useSharedValue(dimensions.height);

  const style = useAnimatedStyle(() => {
    return {
      top: withSpring(top.value, SPRING_CONFIG),
    };
  });

  const styleSheetStyles = StyleSheet.create({
    centeredView: {
      marginTop: 9,
      backgroundColor: "#3232ff",
      width: "100%",
      alignSelf: "center",
      alignContent: "center",
      borderRadius: 10,
      paddingVertical: 18,
      elevation: 10,
      flexDirection: "column",
      justifyContent: "center",
      opacity: 1,
    },
    Animated: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "white",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      paddingVertical: 0,
      paddingHorizontal: 20,
    },
    listData: {
      fontSize: 15,
      fontWeight: "bold",
    },
    datesSection: {
      position: "relative",
      marginHorizontal: 12,
      marginVertical: 6,
      backgroundColor: "#fff",
      borderRadius: 5,
      padding: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      elevation: 10,
      flexDirection: "row",
      justifyContent: "flex-start",
      flex: 1,
    },
    datesSectionContainer: {
      position: "relative",
      zIndex: 1,
      // backgroundColor: "#000",
      width: "100%",
      borderRadius: 5,
      height: dimensions.height / 3,
      shadowColor: "#000",
      flexDirection: "column",
    },


    container: {
      flex: 1,
      marginHorizontal: 16
    },
    item: {
      backgroundColor: "#f9c2ff",
      padding: 20,
      marginVertical: 8
    },
    header: {
      fontSize: 32,
      backgroundColor: "#fff"
    },
    title: {
      fontSize: 24
    }
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart(_, context) {
      context.startTop = top.value;
    },
    onActive(event, context) {
      top.value = context.startTop + event.translationY;
    },
    onEnd() {
      // Dismissing snap point
      if (top.value > dimensions.height / 2) {
        top.value = dimensions.height;
      } else {
        top.value = dimensions.height / 2 + 30; 
      }
    },
  });

  const DATA = [
    {
      title: "Main dishes",
      data: ["Pizza", "Burger", "Risotto"]
    },
    {
      title: "Sides",
      data: ["French Fries", "Onion Rings", "Fried Shrimps"]
    },
    {
      title: "Drinks",
      data: ["Water", "Coke", "Beer"]
    },
    {
      title: "Desserts",
      data: ["Cheese Cake", "Ice Cream"]
    }
  ];
  
  const Item = ({ title }) => (
    <View style={styleSheetStyles.item}>
      <Text style={styleSheetStyles.title}>{title}</Text>
    </View>
  );
  // const openSheet = () => {
  //   top.value = withSpring(dimensions.height / 2 + 30, SPRING_CONFIG);
  //   console.log("props marker info", markerInfo);
  // };
  return (
    <>
    {console.log(markerDates)}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styleSheetStyles.Animated, style]}>
          {props.showBottomSheet && (
            <>
              <AntDesign
                name="minus"
                size={40}
                color="black"
                style={{ alignSelf: "center" }}
              />
              <Text style={{ fontSize: 28, fontWeight: "bold" }}>
                {markerInfo.location}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Price: ${markerInfo.price}
              </Text>
              <Image
                style={{ position: "relative", padding: 70, marginTop: 10 }}
                source={{
                  uri: "https://www." + String(markerImage),
                }}
              />
              <TouchableOpacity
                style={styleSheetStyles.centeredView}
                onPress={() => Linking.openURL(String(markerLink))}
              >
                <Text
                  style={{ color: "white", alignSelf: "center", fontSize: 15 }}
                >
                  Book Event
                </Text>
              </TouchableOpacity>
            </>
          )}

          {props.showCovidSheet && (
            <>
            <AntDesign
                name="minus"
                size={40}
                color="black"
                style={{ alignSelf: "center" }}
              />
              <Text style={{ fontSize: 28, fontWeight: "bold" }}>
                {markerLocation[0]}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "gray" }}>
                {markerLocation[1]}
              </Text>
              <View style={{ flexDirection: "row", paddingVertical: 10 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    paddingVertical: 2,
                  }}
                >
                  Number of Cases:
                </Text>
                <Text> </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    paddingVertical: 2,
                    color: "red",
                  }}
                >
                  {markerInfo.count}
                </Text>
              </View>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", paddingVertical: 2 }}
              >
                Date(s) Of Occurence:
              </Text>
              <ScrollView
            style={styleSheetStyles.datesSectionContainer}
            // contentContainerStyle={{ justifyContent: "space-around" }}
            onTouchMove={()=>{
              console.log("moving1")
            console.log("moving2")}
            }
            showsVerticalScrollIndicator={false}
          >
            {markerDates.map((thing, index) => {
              return (
                <View key={index} style={styleSheetStyles.datesSection}>
                  <Text style={styleSheetStyles.listData}>{thing[1]}</Text>
                  <Text style={styleSheetStyles.listData}> (</Text>
                  <Text style={styleSheetStyles.listData}>{thing[0]}</Text>
                  <Text style={styleSheetStyles.listData}> 2021) </Text>
                </View>
              );
            })}
          </ScrollView>
              {/* // <SafeAreaView style={styleSheetStyles.container}>
              //   <SectionList
              //     sections={DATA}
              //     keyExtractor={(item, index) => item + index}
              //     renderItem={({ item }) => <Item title={item} />}
              //     renderSectionHeader={({ section: { title } }) => (
              //       <Text style={styleSheetStyles.header}>{title}</Text>
              //     )}
              //   />
              // </SafeAreaView> */}
            </>
          )}
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};

export default BottomSheet;
