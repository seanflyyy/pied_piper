import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export const CurrentLocationButton = function (props) {
  // if props.cb is passed, used it. If not, console.log when cb() is called.
  const cb = props.cb
    ? props.cb
    : () =>
        console.log("Callback function not passed to CurrentLocationButton!");
  console.log(cb);
  // if props.bottom is passed, use it. If not, set bottom to 65.
  /* Ternary operator on next line, if props.bottom exists, then 
    set it to the variable after the question mark, else set it 
    to the variable after the colon. */
  const bottom = props.bottom ? props.bottom : 130 + 40;

  return (
    <View
      style={[styles.locationButton, { top: HEIGHT - bottom }]}
      onPress={() => {
        cb();
      }}
    >
      <MaterialIcons name="my-location" color="#000000" size={25} />
    </View>
  );
};

const styles = StyleSheet.create({
  locationButton: {
    zIndex: 3,
    position: "absolute",
    width: 45,
    height: 45,
    backgroundColor: "#fff",
    left: WIDTH - 70,
    borderRadius: 30,
    shadowColor: "#000000",
    elevation: 7,
    shadowRadius: 3,
    shadowOpacity: 0.3,
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 60 : 20,
  },
});
