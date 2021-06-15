import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Modal,
  Animated
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { EvilIcons } from "@expo/vector-icons";
import { ProgressBar, Colors } from "react-native-paper";

export default class CovidData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      section: {
        cases_section: {
          active_cases: 373,
          cases_date_updated: "14 June 2021",
          deaths: 34,
          discharged: 61894,
          hospitalised_critical: 2,
          hospitalised_stable: 136,
          in_community_facilities: 235,
        },
        imported_cases_section: {
          imported_cases: 4728,
          imported_cases_change: "+6",
          imported_cases_date_updated: "14 June 2021",
        },
        swab_section: {
          avg_daily_swab: 59900,
          total_swab: 12366898,
          total_swab_one_mil: 2169600,
        },
        vax_section: {
          full_vax: 1888253,
          total_vax: 4392067,
          vax_first_dose: 2503814,
          vaxx_percentage: 42.46137576258936,
        },
      },
      categories: [
        {
          active_cases: 373,
          cases_date_updated: "14 June 2021",
          deaths: 34,
          discharged: 61894,
          hospitalised_critical: 2,
          hospitalised_stable: 136,
          in_community_facilities: 235,
        },
        {
          imported_cases: 4728,
          imported_cases_change: "+6",
          imported_cases_date_updated: "14 June 2021",
        },
        {
          avg_daily_swab: 59900,
          total_swab: 12366898,
          total_swab_one_mil: 2169600,
        },
        {
          full_vax: 1888253,
          total_vax: 4392067,
          vax_first_dose: 2503814,
          vaxx_percentage: 42.46137576258936,
        },
      ],
      dataToDisplay: [],
      key: 0,
      dataVisible: false,
    };
  }

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
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
       separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
       separateWord[i].substring(1);
    }
    return separateWord.join(' ');
  }

  render() {
    let lst = this.state.categories;
    lst = lst.slice(0, 3);
    console.log(this.state.dataToDisplay);

    return (
      <View>
        <TouchableOpacity style={styles.vaccinatedBar}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: "bold" }}>Vaccinated individuals</Text>
            <Text style={{ fontWeight: "bold", color: "red" }}>
              {this.state.section.vax_section.vaxx_percentage.toFixed(2)}%
            </Text>
          </View>
          <ProgressBar
            style={{ position: "absolute" }}
            progress={this.state.section.vax_section.vaxx_percentage / 100}
            color={Colors.red800}
          />
        </TouchableOpacity>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.chipsItem}
            onPress={() => this.displayExtraData(0, true)}
          >
            <Text style={styles.boxName}>Active Cases: </Text>
            <Text style={styles.boxElement}>
              {this.state.section.cases_section.active_cases}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chipsItem}
            onPress={() => this.displayExtraData(1, true)}
          >
            <Text style={styles.boxName}>Imported Cases: </Text>
            <Text style={styles.boxElement}>
              {this.state.section.imported_cases_section.imported_cases_change}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chipsItem}
            onPress={() => this.displayExtraData(2, true)}
          >
            <Text style={styles.boxName}>Swabbed: </Text>
            <Text style={styles.boxElement}>
              {this.state.section.swab_section.total_swab.toLocaleString()}
            </Text>
          </TouchableOpacity>
        </View>
        {/*
           <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                this.displayExtraData(!this.state.modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Hi!</Text>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() =>
                      this.displayExtraData(!this.state.modalVisible)
                    }
                  >
                    <Text style={styles.textStyle}>Hide Modal</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View> */}
        {this.state.dataVisible && (
          <Animated.View>
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
                      <View style={styles.extraInfoContainer}>
                        <Text style={{fontWeight: 'bold'}}>{this.capitalizeTheFirstLetterOfEachWord((chips[0]).replace(/_/g, ' '))} : </Text>
                        <Text style={{ color: "red" }}>{chips[1]}</Text>
                      </View>
                    );
                  })}
                </View>
                <TouchableOpacity onPress={() => {this.displayExtraData(this.state.key,)}}>
                  <EvilIcons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
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
  extraInfoContainer: {
    flexDirection: "row",
    elevation: 10,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 5,
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
    borderRadius: 5,
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
    fontSize: 10,
    fontWeight: "bold",
  },
  boxElement: {
    fontSize: 10,
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
    borderRadius: 5,
    padding: 7,
    backgroundColor: "#fff",
    height: "auto",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  vaccinatedBar: {
    position: "relative",
    marginTop: 9,
    flexDirection: "column",
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
    borderRadius: 5,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
});
