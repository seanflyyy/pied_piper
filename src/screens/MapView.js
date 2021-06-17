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

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { color } from "react-native-reanimated";

// import database from '@react-native-firebase/database';
import { CurrentLocationButton } from "../components/CurrentLocationButton.js";
// import { db } from "../database/realTimeDatabase.js";
import CovidData from "../components/CovidData.js";
import BottomSheet from "../components/BottomSheetEvents.js";
import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCqE2tkNt2KbBNiyKuZnR_LNOn1bS4we0A",
  authDomain: "pied-piper-818c9.firebaseapp.com",
  databaseURL: "https://pied-piper-818c9-default-rtdb.firebaseio.com",
  projectId: "pied-piper-818c9",
  storageBucket: "pied-piper-818c9.appspot.com",
  messagingSenderId: "97675999272",
  appId: "1:97675999272:web:60b6333232814d9f5d1d1d",
  measurementId: "G-RPCQJQS1B6",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const eventsData = require("../data/eventsNew.json");
const covidMarkerData = require("../data/covid_locations (1).json");

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
  war: <MaterialCommunityIcons name="tank" size={sizeOfIcons} color="white" />,
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
      allTheMarkers: [],
      covidCases: 300,
      selectedMarker: [],
      showEventSheet: false,
      showCovidSheet: false,
      scaleAmount: 1,
      provider: null,
      _isMounted: false,
    };
    this.animation = new Animated.Value(0);
    this.getLocationAsync();
    this.setProvider();
    this.storeHighScore(1, 1);
    this.setupHighscoreListener("38");
  }

  componentDidMount() {
    this._isMounted = true;
  }

  setProvider = () => {
    if (this._isMounted) {
      if (Platform.OS === "ios") {
        this.setState({ provider: null });
      } else {
        this.setState({ provider: PROVIDER_GOOGLE });
      }
    }
  };

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
    if (this._isMounted) {
      this.setState({ region: region });
    }
  };

  storeHighScore(userId, score) {
    firebase
      .database()
      .ref("users/" + userId)
      .set({
        highscore: score,
      });
  }

  setupHighscoreListener(userId) {
    var recentPostsRef = firebase.database().ref();
    recentPostsRef.once("value").then((snapshot) => {
      // snapshot.val() is the dictionary with all your keys/values from the '/store' path
      this.setState({ allTheMarkers: snapshot.val() });
    });

    console.log(recentPostsRef);
    firebase.database().ref(userId).on('value', (snapshot) => {
      const data = snapshot.val();
      this.setState({allTheMarkers : {
        coordinate: data.coordinate,
        count: data.count,
        image_url: data.image_url,
        list_of_dates: data.list_of_dates,
        location: data.location,
        scale: data.scale
      }})
      console.log("New high score: " + data.count);
    });
  }

  centerMap() {
    const { latitude, longitude, latitudeDelta, longitudeDelta } =
      this.state.region;
    this.map.animateToRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta,
    });
  }

  render() {
    {
      console.log(this.state.allTheMarkers);
    }
    const interpolations = this.state.eventMarker.map((marker, index) => {
      const inputRange = [index - 1, index, index + 1];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2, 1],
        extrapolate: "clamp",
      });
      return scale;
    });
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        {/* <BottomSheetScreen style={{position: 'absolute'}}/> */}
        <MapView
          showsCompass={false}
          rotateEnable={false}
          showsUserLocation={true}
          showsPointsOfInterest={false}
          initialRegion={this.state.region}
          provider={this.state.provider}
          ref={(map) => (this.map = map)}
          style={styles.container}
          initial
          customMapStyle={[
            {
              featureType: "administrative",
              elementType: "geometry",
              stylers: [
                {
                  visibility: "off",
                },
              ],
            },
            {
              featureType: "poi",
              stylers: [
                {
                  visibility: "off",
                },
              ],
            },
            {
              featureType: "road",
              elementType: "labels.icon",
              stylers: [
                {
                  visibility: "off",
                },
              ],
            },
            {
              featureType: "transit",
              stylers: [
                {
                  visibility: "off",
                },
              ],
            },
          ]}
        >
          {this.state.eventMarker.map((marker, index) => {
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
                  this.setState({
                    selectedMarker: marker,
                    showEventSheet: true,
                    showCovidSheet: false,
                  });
                  // this.setState({marker:{scale: 2}})
                }}
              >
                <View
                  style={[
                    styles.ring,
                    { backgroundColor: colorOfEvent[marker.type] },
                  ]}
                >
                  {typesOfEvents[marker.type]}
                  {/* <Text style={{fontSize: 8, fontWeight: 'bold', color: colorOfEvent[marker.type]}}>{marker.location}</Text> */}
                </View>
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
                  this.setState({
                    selectedMarker: marker,
                    showCovidSheet: true,
                    showEventSheet: false,
                  });
                  // this.setState({marker:{scale: 2}})
                }}
              >
                <View
                  style={[
                    styles.ring,
                    {
                      backgroundColor: "red",
                      // transform: [{ scale: marker.scale}]
                    },
                  ]}
                >
                  <MaterialIcons name="coronavirus" size={14} color="white" />
                </View>
              </MapView.Marker>
            );
          })}
        </MapView>

        <View style={styles.container_top}>
          {/* <View style={styles.searchBox}>
            <TextInput
              placeholder="Search here"
              placeholderTextColor="#000"
              autoCapitalize="none"
              style={{ flex: 1, padding: 0 }}
            />
          </View> */}
          <CovidData />
        </View>
        {/* <CurrentLocationButton
          cb={() => {
            this.centerMap(), this.setState({ showEventSheet: false, showCovidSheet: false });
          }}
        /> */}
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => {
            this.centerMap();
            this.setState({ showEventSheet: false, showCovidSheet: false });
          }}
        >
          <MaterialIcons name="my-location" color="#000000" size={25} />
        </TouchableOpacity>
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
  locationButton: {
    zIndex: 3,
    position: "absolute",
    width: 45,
    height: 45,
    backgroundColor: "#fff",
    left: width - 70,
    top: height - 170,
    borderRadius: 30,
    shadowColor: "#000000",
    elevation: 7,
    shadowRadius: 1,
    shadowOpacity: 0.2,
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 60 : 20,
  },
  container_top: {
    position: "absolute",
    marginTop: Platform.OS === "ios" ? 50 : 20,
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
    alignItems: "center",
    justifyContent: "space-evenly",
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
