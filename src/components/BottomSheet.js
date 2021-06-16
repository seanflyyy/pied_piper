import React from "react";
import { View, Button, Text, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

const SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
};

export default (props) => {
  const markerInfo = props.markerInfo;
  
  const dimensions = useWindowDimensions();

  const top = useSharedValue(dimensions.height);

  const style = useAnimatedStyle(() => {
    return {
      top: withSpring(top.value, SPRING_CONFIG),
    };
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
        top.value = dimensions.height / 2;
      }
    },
  });

  const openSheet = () => {
    top.value = withSpring(dimensions.height / 2 + 30, SPRING_CONFIG);
    console.log("props marker info", markerInfo);
  };

  // const openSheet = props => {
  //   console.log(props.showSheet)
  //   useCallback(() => {
  //     top.value = withSpring(dimensions.height / 2 + 30, SPRING_CONFIG);
  //     console.log("props marker info", markerInfo);
  //   }, [props.showSheet]);
  // }

  return (
    <>
      <View
        style={{
          position: "absolute",
          marginTop: 50,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button title="Open Sheet" onPress={openSheet}/>
      </View>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={[
            {
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
              padding: 20,
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.9,
            },
            style,
          ]}
        >
          <View>
            <Text style={{fontSize: 32}}>{markerInfo.location}</Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};
