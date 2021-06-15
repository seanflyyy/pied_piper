import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, Modal} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

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
      modalVisible: false,
    };
  }

  setModalVisible = (key, visible) => {
      this.setState({modalVisible: visible})
  };
  render() {
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
          <TouchableOpacity style={styles.chipsItem} onPress={()=>this.setModalVisible(!this.state.setModalVisible)}>
            <Text style={styles.boxName}>Active Cases: </Text>
            <Text style={styles.boxElement}>
              {this.state.section.cases_section.active_cases}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chipsItem} onPress={()=>this.setModalVisible(!this.state.setModalVisible)}>
            <Text style={styles.boxName}>Imported Cases: </Text>
            <Text style={styles.boxElement}>
              {this.state.section.imported_cases_section.imported_cases_change}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chipsItem} onPress={()=>this.setModalVisible(!this.state.setModalVisible)}>
            <Text style={styles.boxName}>Swabbed: </Text>
            <Text style={styles.boxElement}>
              {this.state.section.swab_section.total_swab.toLocaleString()}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hi!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setModalVisible(!this.state.modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {/* <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => this.setModalVisible(true)}
        >
          <Text style={styles.textStyle}>Show Modal</Text>
        </Pressable> */}
      </View>
        {/* <ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          height={30}
          style={styles.chipsScrollView}
        >
          {this.state.categories.map((chip, index) => {
            console.log(Object.keys(chip));
            return (
              <View style={styles.chipsItem} key={index}>
                <Text>{Object.keys(chip)}</Text>
                <Text>{}</Text>
              </View>
            );
          })}
        </ScrollView> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    centeredView: {
        position: 'relative',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 9
      },
      modalView: {
        backgroundColor: "white",
        borderRadius: 5,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1},
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
        width: '100%',
      },
      button: {
        borderRadius: 5,
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
    shadowOffset: { width: 0, height: 1},
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
    shadowOffset: { width: 0, height: 1},
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
    shadowOffset: { width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
});
