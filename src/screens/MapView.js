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
import {
  withSpring,
} from "react-native-reanimated";

import MapView from "react-native-maps";
import { CurrentLocationButton } from "../components/CurrentLocationButton.js";
import * as Location from "expo-location";
import { MaterialIcons, Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import CovidData from "../components/CovidData.js";
import { color } from "react-native-reanimated";
import BottomSheet from "../components/BottomSheet.js";

// import BottomSheetScreen from "@gorhom/bottom-sheet";

// const events = require("../data/events.json")
const customData = require("../data/eventsNew.json");
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;


const colorOfEvent = {
  "nature": "#26b99d",
  "animal": "#26b99d",
  "museum": "#89dbfb",
  "war": "#f2ab23",
  "airport" : "#89dbfb", 
  "attractions": "#ffb0b2",
  "science": "#924646",
}
const sizeOfIcons = 14;

const typesOfEvents = {
  "nature": <FontAwesome5 name="tree" size={sizeOfIcons} color="white" />,
  "animal": <MaterialCommunityIcons name="elephant" size={sizeOfIcons} color="white" />,
  "museum": <MaterialIcons name="museum" size={sizeOfIcons} color="white" />,
  "war": <MaterialCommunityIcons name="bullet" size={sizeOfIcons} color="white"/>,
  "airport" : <MaterialIcons name="local-airport" size={sizeOfIcons} color="white" />, 
  "attractions": <MaterialIcons name="attractions" size={sizeOfIcons} color="white" />,
  "science": <MaterialIcons name="science" size={sizeOfIcons} color="white" />,
}

export default class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markers: customData,
      region: null,
      covidCases: 300,
      selectedMarker: [],
      showSheet: false,
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
          {this.state.markers.map((marker, index) => {
            console.log(marker)
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
                  this.setState({selectedMarker: marker, showSheet: true});
                }}>
                <View style={[styles.ring, {backgroundColor: colorOfEvent[marker.type]}]}>
                  {typesOfEvents[marker.type]}
                  {/* <Text style={{fontSize: 8, fontWeight: 'bold', color: colorOfEvent[marker.type]}}>{marker.location}</Text> */}
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

        </View >
        <CurrentLocationButton
          cb={() => {this.centerMap(), this.setState({showSheet: false}) 
          }}/>

          <BottomSheet markerInfo={this.state.selectedMarker} showBottomSheet={this.state.showSheet}/>

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
    flexWrap:'wrap',
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
    borderColor: 'white',
    borderWidth: 2,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: "white",
  },
  markerText: {
    borderWidth: 2, 
    borderColor: 'white'
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
