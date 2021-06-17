import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Modal,
  Animated,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { EvilIcons } from "@expo/vector-icons";
import { ProgressBar, Colors } from "react-native-paper";
// import Animated, {useSharedValue, useAnimatedStyle } from 'react-native-reanimated'
import firebase from "firebase/app";
import "firebase/database";

const borderRadius = 10;

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
export default class CovidData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      section: [],
      categoriesOld : [
        {
          "Last Updated": "15 June 2021",
          "Active Cases": 370,
          Discharged: 61911,
          "In Community Facilities": 233,
          "Hospitalised (Stable)": 135,
          "Hospitalised (Critical)": 2,
          Deaths: 34,
        },
        {
          "Last Updated": "15 June 2021",
          "Total Number of Imported Cases": 4728,
          "Increase in Imported Cases": "+0",
        },

        {
          "Last Updated": "14 June 2021",
          "Average Daily Swabs Per Week": 63200,
          "Total Swabs Tested": 12809152,
        },
        {
          "Last Updated": "14 June 2021",
          "Received at least First Dose": 2700446,
          "% of Population Vaccinated": 45.795,
          "Completed Full Vaccination": 1990940,
          "Total Doses Administered": 4691386,
        },
      ],
      categories : [
        {
          "Last Updated": "17 June 2021",
          "Active Cases": 372,
          "Deaths": 34,
          "Discharged": 61960,
          "Hospitalised (Critical)": 1,
          "Hospitalised (Stable)": 150,
          "In Community Facilities": 221,
        },
        {
          "Last Updated": "17 June 2021",
          "Increase in Imported Cases": "+7",
          "Total Number of Imported Cases": 4740,
        },
        {
          "Last Updated": "14 Jun 2021",
          "Average Daily Swabs Per Week": 63200,
          "Total Swabs Per 1,000,000 Total Population": 2247200,
          "Total Swabs Tested": 12809152,
        },
        {
          "Last Updated": "14 Jun 2021",
          "Completed Full Vaccination Regimen": 1990940,
          "% of Population Vaccinated": 45.795,
          "Received at least First Dose": 2700446,
          "Total Doses Administered": 4691386,
        },
      ],
      dataToDisplay: [],
      key: 0,
      dataVisible: false,
      selectedButton: "",
    };
    this.fadeAnim = new Animated.Value(0);
    this.setupHighscoreListener();
  }

  setupHighscoreListener() {
    const attractionsData = firebase.database().ref("/covid_data");
    attractionsData.once("value").then((snapshot) => {
      // snapshot.val() is the dictionary with all your keys/values from the '/store' path
      let results_lst = []
      for(const [key,index] of Object.entries(snapshot.val())){
        results_lst.push(index)
      }
      console.log(results_lst)
      this.setState({ section: results_lst });
    });
  }

  fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(this.fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.spring(this.fadeAnim, {
      toValue: 0,
      delay: 0, 
      useNativeDriver: true,
    })
  };

  fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(this.fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

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



  capitalizeTheFirstLetterOfEachWord = (words) => {
    var separateWord = words.toLowerCase().split(" ");
    for (var i = 0; i < separateWord.length; i++) {
      separateWord[i] =
        separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
    }
    return separateWord.join(" ");
  };

  render() {
    let lst = this.state.categories;
    lst = lst.slice(0, 3);
    return (
      <View>
        <TouchableOpacity
          style={[
            styles.vaccinatedBar,
            {
              borderColor:
                this.state.selectedButton === "button1" ? "#26b99d" : "white",
            },
          ]}
          onPress={() => {
            this.setState({ selectedButton: "button1" });
            this.displayExtraData(3, true);
            this.fadeIn();
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: "bold" }}>Population Vaccinated</Text>
            <Text style={{ fontWeight: "bold", color: "red" }}>
              {this.state.categories[3][
                "% of Population Vaccinated"
              ].toFixed(2)}
              %
            </Text>
          </View>
          <ProgressBar
            style={{ position: "absolute" }}
            progress={
              this.state.categories[3]["% of Population Vaccinated"] /
              100
            }
            color={Colors.red800}
          />
        </TouchableOpacity>

        <View style={styles.container}>
          <TouchableOpacity
            style={[
              styles.chipsItem,
              {
                borderColor:
                  this.state.selectedButton === "button2" ? "#26b99d" : "white",
              },
            ]}
            onPress={() => {
              this.displayExtraData(0, true);
              this.fadeIn();
              this.setState({ selectedButton: "button2" });
            }}
          >
            <Text style={styles.boxName}>Active: </Text>
            <Text style={styles.boxElement}>
              {this.state.categories[0]["Active Cases"]}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.chipsItem,
              {
                borderColor:
                  this.state.selectedButton === "button3" ? "#26b99d" : "white",
              },
            ]}
            onPress={() => {
              this.displayExtraData(1, true);
              this.fadeIn();
              this.setState({ selectedButton: "button3" });
            }}
          >
            <Text style={styles.boxName}>Imported: </Text>
            <Text style={styles.boxElement}>
              {this.state.categories[1]["Increase in Imported Cases"]}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.chipsItem,
              {
                borderColor:
                  this.state.selectedButton === "button4" ? "#26b99d" : "white",
              },
            ]}
            onPress={() => {
              this.displayExtraData(2, true);
              this.fadeIn();
              this.setState({ selectedButton: "button4" });
            }}
          >
            <Text style={styles.boxName}>Daily Swabs: </Text>
            <Text style={styles.boxElement}>
              {this.state.categories[2][
                "Average Daily Swabs Per Week"
              ].toLocaleString()}
            </Text>
          </TouchableOpacity>
        </View>
          {this.state.dataVisible && <Animated.View style={{ opacity: this.fadeAnim }}>
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
          </Animated.View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    position: "relative",
    marginTop: 9,
    backgroundColor: "#fff",
    width: "100%",
    alignSelf: "center",
    borderRadius: borderRadius,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    // borderColor: '#26b99d',
    // borderWidth: 1,
  },
  extraInfoContainer: {
    flexDirection: "row",
    elevation: 10,
    marginVertical: 5,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: borderRadius,
    padding: 9,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    width: "90%",
  },
  button: {
    borderRadius: borderRadius,
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
  container: {
    flexDirection: "row",
    position: "relative",
    justifyContent: "space-between",
    marginTop: 9,
  },
  dropDown: {
    flexDirection: "column",
    position: "relative",
    marginTop: 9,
  },
  boxName: {
    fontSize: 13,
    fontWeight: "bold",
  },
  boxElement: {
    fontSize: 13,
    fontWeight: "bold",
    color: "red",
  },
  chipsScrollView: {
    position: "relative",
    marginTop: 8,
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection: "row",
    borderRadius: borderRadius,
    padding: 5,
    paddingVertical: 10,
    height: "auto",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
    borderWidth: 1,
    backgroundColor: "white",
  },
  vaccinatedBar: {
    position: "relative",
    marginTop: 9,
    flexDirection: "column",
    backgroundColor: "#fff",
    width: "100%",
    alignSelf: "center",
    borderRadius: borderRadius,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
    borderWidth: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  covidIndicator: {
    position: "relative",
    marginTop: 8,
    flexDirection: "row",
    width: "40%",
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderRadius: borderRadius,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
});
