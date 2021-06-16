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
    if (props.showBottomSheet) {
      top.value = withSpring(dimensions.height / 2 + 30, SPRING_CONFIG);
    } else {
      top.value = withSpring(dimensions.height, SPRING_CONFIG);
    }
  });

  const markerInfo = props.markerInfo;
  const markerLink = String(markerInfo.bookingLink);
  const markerImage = markerInfo.locationImage
  const urlReact = "https://reactnative.dev/img/tiny_logo.png";

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
      if (top.value > dimensions.height / 2 + 200) {
        top.value = dimensions.height;
      } else {
        top.value = dimensions.height / 2 + 30;
      }
    },
  });

  // const openSheet = () => {
  //   top.value = withSpring(dimensions.height / 2 + 30, SPRING_CONFIG);
  //   console.log("props marker info", markerInfo);
  // };

  return (
    <>
    {console.log(markerLink, typeof(String(markerLink)), 'https://reactjs.org/logo-og.png', typeof('https://reactjs.org/logo-og.png'))}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styleSheetStyles.Animated, style]}>
          <View>
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
            style={{position: 'relative', padding: 70, marginTop: 10}}
              source={{
                uri: 'https://www.' + String(markerImage),
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
          </View>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};

export default BottomSheet;
