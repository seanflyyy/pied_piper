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
import CovidData from "./CovidData";

const SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
};

const CovidDataTab = (props) => {
  useEffect(function () {
    console.log(props.showBottomSheet)
    if (props.showBottomSheet || props.showCovidSheet) {
      top.value = withSpring(dimensions.height / 2 + 30, SPRING_CONFIG);
      fadeAnim = new Animated.Value(0);
    } else {
      top.value = withSpring(dimensions.height, SPRING_CONFIG);
    }
  });

  const markerInfo = props.markerInfo;

//   const fadeIn = () => {
//     // Will change fadeAnim value to 1 in 5 seconds
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 200,
//       useNativeDriver: true,
//     }).start();
//   };

//   const fadeOut = () => {
//     // Will change fadeAnim value to 0 in 3 seconds
//     Animated.timing(fadeAnim, {
//       toValue: 0,
//       duration: 200,
//       useNativeDriver: true,
//     }).start();
//   };

  const dimensions = useWindowDimensions();

  const top = useSharedValue(dimensions.height);

  const style = useAnimatedStyle(() => {
    return {
      top: withSpring(top.value, SPRING_CONFIG),
    };
  });

  

  const styles = StyleSheet.create({
    centeredView: {
        position: "relative",
        marginTop: 9,
        backgroundColor: "#fff",
        width: "100%",
        alignSelf: "center",
        borderRadius: 5,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
        flexDirection: "column",
        justifyContent: "space-between",
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
      extraInfoContainer: {
        flexDirection: "row",
        elevation: 10,
        marginTop: 4,
      },
      boxName: {
        fontSize: 13,
        fontWeight: "bold",
      },
      boxElement: {
        fontSize: 13,
        color: "red",
      },
  });

  displayExtraData = (index, visible) => {
    const chip = this.state.categories[index];
    const values = Object.values(chip);
    const keys = Object.keys(chip);
    const lst = [];
    for (let i = 0; i < values.length; i++) {
      lst.push([keys[i], values[i]]);
    }
    this.setState({
      dataToDisplay: lst,
      key: index,
      dataVisible: visible,
    });
  };

  // const openSheet = () => {
  //   top.value = withSpring(dimensions.height / 2 + 30, SPRING_CONFIG);
  //   console.log("props marker info", markerInfo);
  // };

  return (
    <>
    <Animated.View style={[styles.Animated, style]}>
        <Animated.View style={{ opacity: this.fadeAnim }}>
            <View style={styles.centeredView}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "column" }}>
                  {this.state.dataToDisplay.map((chips, index) => {
                    return (
                      <View style={styles.extraInfoContainer} key={index}>
                        <Text style={styles.boxName}>
                          {this.capitalizeTheFirstLetterOfEachWord(
                            chips[0].replace(/_/g, " ")
                          )}{" "}
                          :{" "}
                        </Text>
                        <Text style={styles.boxElement}>
                          {chips[1].toLocaleString()}
                        </Text>
                      </View>
                    );
                  })}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.displayExtraData(this.state.key, false);
                    this.fadeOut();
                    this.setState({ selectedButton: "" });
                  }}
                >
                  <EvilIcons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
    </Animated.View>
  
    </>
  );
};

export default CovidDataTab;
