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

import MapView from "react-native-maps";
import { CurrentLocationButton } from "../components/CurrentLocationButton.js";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import CovidData from "../components/CovidData.js";

import firebase from "../database/firebaseDB"

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

export default class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markers: [],
      region: null,
      covidCases: 300,
    };
    this.animation = new Animated.Value(0);
    this.getLocationAsync();
  }

  getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied.");
    }
    let location = await Location.getCurrentPositionAsync({});
    let region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    };
    this.setState({ region: region });
  };

  centerMap() {
    const { latitude, longitude, latitudeDelta, longitudeDelta } =
      this.state.region;
    this.map.animateToRegion({
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
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

        <CurrentLocationButton
          cb={() => {
            this.centerMap();
          }}
          />
        <MapView
          showsCompass={false}
          rotateEnable={false}
          showsUserLocation={true}
          ref={(map) => (this.map = map)}
          initialRegion={this.state.region}
          style={styles.container}>
          {this.state.markers.map((marker, index) => {
            return (
              <MapView.Marker
                key={index}
                coordinate={marker.coordinate}
                onPress={() => {this.animateToRegion(
                  {
                    latitude: marker.coordinate.latitude,
                    longitude: marker.coordinate.longitude,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitude,
                  });
                }} >
                {/* <Animated.View style={[styles.markerWrap, opacityStyle]}>
                  <Animated.View style={[styles.ring, scaleStyle]} />
                  <View style={styles.marker} />
                </Animated.View> */}
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
              style={{flex:1, padding: 0}}
            />
          </View>
          <CovidData/>
      </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_top: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 60 : 20, 
    width: '90%',
    alignSelf: 'center',
  },
  searchBox : {
    position: 'relative',
    flexDirection: "row",
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: 5, 
    padding: 18, 
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5, 
    shadowRadius: 5, 
    elevation: 10, 
  },
  scrollView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10, 
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
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
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
