import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Platform,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { withSpring } from "react-native-reanimated";

import MapView from "react-native-maps";
import { CurrentLocationButton } from "../components/CurrentLocationButton.js";
import * as Location from "expo-location";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import CovidData from "../components/CovidData.js";
import { color } from "react-native-reanimated";
// import CovidSheet from "../components/CovidSheetEvents.js"
import BottomSheet from "../components/BottomSheetEvents.js";
const eventsData = require("../data/eventsNew.json");
const covidMarkerData = require("../data/covid_locations.json");

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const colorOfEvent = {
  nature: "#26b99d",
  animal: "#26b99d",
  museum: "#89dbfb",
  war: "#f2ab23",
  airport: "#89dbfb",
  attractions: "#ffb0b2",
  science: "#924646",
};
const sizeOfIcons = 14;

const typesOfEvents = {
  nature: <FontAwesome5 name="tree" size={sizeOfIcons} color="white" />,
  animal: (
    <MaterialCommunityIcons name="elephant" size={sizeOfIcons} color="white" />
  ),
  museum: <MaterialIcons name="museum" size={sizeOfIcons} color="white" />,
  war: (
    <MaterialCommunityIcons name="bullet" size={sizeOfIcons} color="white" />
  ),
  airport: (
    <MaterialIcons name="local-airport" size={sizeOfIcons} color="white" />
  ),
  attractions: (
    <MaterialIcons name="attractions" size={sizeOfIcons} color="white" />
  ),
  science: <MaterialIcons name="science" size={sizeOfIcons} color="white" />,
};

export default class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventMarker: eventsData,
      covidMarker: covidMarkerData,
      region: null,
      covidCases: 300,
      selectedMarker: [],
      showEventSheet: false,
      showCovidSheet: false, 
    };
    this.animation = new Animated.Value(0);
    this.getLocationAsync();
  }

  // get the location on Press
  getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied.");
    }
    let location = await Location.getCurrentPositionAsync({});
    let region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0464195044303443,
      longitudeDelta: 0.040142817690068,
    };
    this.setState({ region: region });
  };

  centerMap() {
    const { latitude, longitude, latitudeDelta, longitudeDelta } =
      this.state.region;
    this.map.animateToRegion({
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
      latitudeDelta: this.state.region.latitudeDelta,
      longitudeDelta: this.state.region.longitudeDelta,
    });
  }

  onMarkerPress = (mapEventData, marker) => {
    const markerID = mapEventData._targetInst.return.key;
    console.log(markerID);
    let x = markerID * CARD_WIDTH + markerID * 20;
    if (Platform.OS === "ios") {
      x = x - SPACING_FOR_CARD_INSET;
    }

    this.scroll.scrollTo({ x: x, y: 0, animated: false });
  };

  render() {
    // const interpolations = this.state.eventMarker.map((marker, index) => {
    //   const inputRange = [
    //     (index - 1),
    //     index ,
    //     (index + 1),
    //   ];
    //   const scale = this.animation.interpolate({
    //     inputRange,
    //     outputRange: [1, 1.5, 1],
    //     extrapolate: "clamp",
    //   });
    //   return scale;
    // });
    return (
      <View style={styles.container}>
        {/* <BottomSheetScreen style={{position: 'absolute'}}/> */}
        <MapView
          showsCompass={false}
          rotateEnable={false}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsPointsOfInterest={false}
          ref={(map) => (this.map = map)}
          followsUserLocation={true}
          initialRegion={this.state.region}
          style={styles.container}
        >
          {
          
          this.state.eventMarker.map((marker, index) => {
            // const scaleStyle = {
            //   transform: [{ scale: interpolations[index].scale }],
            // };
            return (
              <MapView.Marker
                key={index}
                coordinate={marker.coordinate}
                onPress={() => {
                  this.map.animateToRegion({
                    latitude: marker.coordinate.latitude,
                    longitude: marker.coordinate.longitude,
                    latitudeDelta: 0.03864195044303443,
                    longitudeDelta: 0.030142817690068,
                  });
                  this.setState({ selectedMarker: marker, showEventSheet: true, showCovidSheet: false});
                }}>
                <Animated.View
                  style={[
                    styles.ring, 
                    // scaleStyle,
                    { backgroundColor: colorOfEvent[marker.type]}]}>
                  {typesOfEvents[marker.type]}
                  {/* <Text style={{fontSize: 8, fontWeight: 'bold', color: colorOfEvent[marker.type]}}>{marker.location}</Text> */}
                </Animated.View>
              </MapView.Marker>
            );
          })}
          {this.state.covidMarker.map((marker, index) => {
            return (
              <MapView.Marker
                key={index}
                coordinate={marker.coordinate}
                onPress={() => {
                  this.map.animateToRegion({
                    latitude: marker.coordinate.latitude,
                    longitude: marker.coordinate.longitude,
                    latitudeDelta: 0.03864195044303443,
                    longitudeDelta: 0.030142817690068,
                  });
                  this.setState({ selectedMarker: marker, showCovidSheet: true, showEventSheet: false});
                }}
              >
                <View
                  style={[
                    styles.ring,
                    { backgroundColor: 'red' },
                  ]}
                >
                  <MaterialIcons name="coronavirus" size={14} color="white" />
                </View>
              </MapView.Marker>
            );
          })}
        </MapView>

        <View style={styles.container_top}>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Search here"
              placeholderTextColor="#000"
              autoCapitalize="none"
              style={{ flex: 1, padding: 0 }}
            />
          </View>
          <CovidData />
        </View>
        <CurrentLocationButton
          cb={() => {
            this.centerMap(), this.setState({ showCovidSheet: false, showCovidSheet: false });
          }}
        />
        {/* <CovidSheet markerInfo={this.state.selectedMarker}
          showCovidSheet={this.state.showCovidSheet}
        /> */}
        <BottomSheet
          markerInfo={this.state.selectedMarker}
          showBottomSheet={this.state.showEventSheet}
          showCovidSheet={this.state.showCovidSheet}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_top: {
    position: "absolute",
    marginTop: Platform.OS === "ios" ? 60 : 20,
    width: "90%",
    alignSelf: "center",
  },
  searchBox: {
    position: "relative",
    flexDirection: "row",
    backgroundColor: "#fff",
    alignSelf: "center",
    borderRadius: 5,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  // marker: {
  //   width: 8,
  //   height: 8,
  //   borderRadius: 4,
  //   backgroundColor: "rgba(130,4,150, 0.9)",
  // },
  marker: {
    padding: 2,
    borderRadius: 20,
    borderColor: "white",
    borderWidth: 2,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  coronavirusRing: {
    width: 18,
    height: 18,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  markerText: {
    borderWidth: 2,
    borderColor: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
