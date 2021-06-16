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
          cases_date_updated: "14 June 2021",
          active_cases: 373,
          deaths: 34,
          discharged: 61894,
          hospitalised_critical: 2,
          hospitalised_stable: 136,
          in_community_facilities: 235,
        },
        imported_cases_section: {
          imported_cases_date_updated: "14 June 2021",
          imported_cases: 4728,
          imported_cases_change: "+6",
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
      selectedButton: '',
    };
    this.fadeAnim = new Animated.Value(0)
  }

   fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(this.fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
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

    return (
      <View>
        <View style={styles.vaccinatedBar}
        // onPress={() => this.setState({ selectedButton: 'button1' })}
        >
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
        </View>

        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.chipsItem, {borderColor: this.state.selectedButton==='button2' ? '#26b99d' : 'white'}]}
            onPress={() => {
              this.displayExtraData(0, true)
              this.fadeIn()
              this.setState({ selectedButton: 'button2' })
            }
          }
          >
            <Text style={styles.boxName}>Active: </Text>
            <Text style={styles.boxElement}>
              {this.state.section.cases_section.active_cases}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chipsItem, {borderColor: this.state.selectedButton==='button3' ? '#26b99d' : 'white'}]}
            onPress={() => {
              this.displayExtraData(1, true)
              this.fadeIn()
              this.setState({ selectedButton: 'button3' })
            }
          }          >
            <Text style={styles.boxName}>Imported: </Text>
            <Text style={styles.boxElement}>
              {this.state.section.imported_cases_section.imported_cases_change}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chipsItem, {borderColor: this.state.selectedButton==='button4' ? '#26b99d' : 'white'}]}
            onPress={() => {
              this.displayExtraData(2, true)
              this.fadeIn()
              this.setState({ selectedButton: 'button4' })
            }
          }
          >
            <Text style={styles.boxName}>Swabbed: </Text>
            <Text style={styles.boxElement}>
              {this.state.section.swab_section.total_swab.toLocaleString()}
            </Text>
          </TouchableOpacity>
        </View>
          <Animated.View style={{opacity: this.fadeAnim}}> 
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
                        <Text style={styles.boxName}>{this.capitalizeTheFirstLetterOfEachWord((chips[0]).replace(/_/g, ' '))} : </Text>
                        <Text style={styles.boxElement}>{chips[1].toLocaleString()}</Text>
                      </View>
                    );
                  })}
                </View>
                <TouchableOpacity onPress={() => {
                  this.displayExtraData(this.state.key,false)
                  this.fadeOut()
                  this.setState({selectedButton: ''})}}>
                  <EvilIcons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
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
    // borderColor: '#26b99d',
    // borderWidth: 1,
  },
  extraInfoContainer: {
    flexDirection: "row",
    elevation: 10,
    marginTop: 4,
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
    fontSize: 13,
    fontWeight: "bold",
  },
  boxElement: {
    fontSize: 13,
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
    padding: 5,
    height: "auto",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  vaccinatedBar: {
    position: "relative",
    marginTop: 9,
    flexDirection: "column",
    backgroundColor: "#fff",
    width: "100%",
    alignSelf: "center",
    borderRadius: 5,
    padding: 11,
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
