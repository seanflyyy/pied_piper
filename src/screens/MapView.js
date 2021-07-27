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
  LogBox,
} from "react-native";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
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
  apiKey: "AIzaSyA2hxPW1qn6BscvSLmH5UA4ZacRtpDLwy4",
  authDomain: "code-exp-moh-database.firebaseapp.com",
  databaseURL: "https://code-exp-moh-database-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "code-exp-moh-database",
  storageBucket: "code-exp-moh-database.appspot.com",
  messagingSenderId: "122734261014",
  appId: "1:122734261014:web:db8ec1c916ac542bbc1637"
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
      eventMarker: [],
      covidMarker: [],
      CovidMarkerss : [],
      region: {
        latitude: 1.3753687228060716,
        longitude: 103.80715617460423,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      },
      allTheMarkers: [],
      covidCases: 300,
      selectedMarker: [],
      showEventSheet: false,
      showCovidSheet: false,
      scaleAmount: 1,
      provider: null,
      _isMounted: false,
      categories: [], 
    };
    this.animation = new Animated.Value(0);
    this.getLocationAsync();
    this.setProvider();
    this.storeHighScore(1, 1);
    this.setupHighscoreListener();
    LogBox.ignoreLogs(['Setting a timer'])
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
    this.setState({ region: region });
    console.log(region)
  };


  storeHighScore(userId, score) {
    firebase
      .database()
      .ref("users/" + userId)
      .set({
        highscore: score,
      });
  }

  setupHighscoreListener() {
    const attractionsData = firebase.database().ref("/attractions");
    const covid_locations = firebase.database().ref("/covid_locations")
    const covid_data = firebase.database().ref("/covid_data");

    attractionsData.once("value").then((snapshot) => {
      // snapshot.val() is the dictionary with all your keys/values from the '/store' path
      let results_lst = []
      for(const [key,index] of Object.entries(snapshot.val())){
        results_lst.push(index)
      }
      console.log("results are", results_lst)
      this.setState({ eventMarker: results_lst });
    });
    covid_locations.once("value").then((snapshot) => {
      let results_lst = []
      for(const [key,index] of Object.entries(snapshot.val())){
        results_lst.push(index)
      }
      console.log("covid markers are", results_lst)
      // snapshot.val() is the dictionary with all your keys/values from the '/store' path
      this.setState({ covidMarker: results_lst});
    });

    covid_data.once("value").then((snapshot) => {
      // snapshot.val() is the dictionary with all your keys/values from the '/store' path
      let results = [];
      for(const [key, index] of Object.entries(snapshot.val())){
        results.push(index)
      }
      this.setState({ categories: results});
    });
  }


  centerMap() {
    console.log('the region that center map would center to is', this.state.region)
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
      // const convertDictionary = () => {
      //   console.log(this.state.covidMarkerss)
      //   for(const [key,index] of Object.entries(this.state.covidMarkerss)){
      //     console.log(key, index)
      //   }
    console.log("categories are", this.state.categories)
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
              // console.log("marker is", Object.keys(marker))
              // const key = Object.keys(marker)
              // const marker_key = String(key[index])
              // console.log(Object(this.state.eventMarker).items())
              // console.log(marker_key)
              // console.log(String(key[index]))
              // console.log(key[index])
              // console.log("coordinate is", marker[marker_key])

              // console.log("coordinate is", marker[marker_key].coordinate)
              // console.log("longitude is", marker[String(key[index])].coordinate.latitude)

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
              const key = Object.keys(marker)
              // console.log(marker.length)
              return (
                <MapView.Marker
                  key={index}
                  coordinate={marker.coordinates}
                  onPress={() => {
                    this.map.animateToRegion({
                      latitude: marker.coordinates.latitude,
                      longitude: marker.coordinates.longitude,
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
          <CovidData categories={this.state.categories}/>
        </View>
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
