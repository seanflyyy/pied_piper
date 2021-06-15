import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { ProgressBar, Colors } from "react-native-paper";
import firebase from "../database/firebaseDB"

export default class CovidData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      some_data:
        {'active_cases': '373',
        'avg_daily_swab': '~59,900',
        'cases_date': '13 June 2021',
        'deaths': '34',
        'discharged': '61,869',
        'full_vax': '1,888,253',
        'hospitalised_critical': '1',
        'hospitalised_stable': '129',
        'imported_cases': '4,722 ',
        'imported_cases_change': '+3',
        'imported_cases_date': '13 June 2021',
        'in_community_facilities': '243',
        'total_swab': '12,366,898',
        'total_swab_one_mil': '~2,169,600',
        'total_vax': '4,392,067',
        'vax_first_dose': '2,503,814',
        'vaxx_percentage': 42.46137576258936}
      };
    this.snapshot();
  }

  snapshot = () => {
    let unsubscribe = firebase.firestore().collection("categories").onSnapshot((pull) => {
        const updatedNotes = pull.docs.map((doc)=> doc.data());
        this.setState({categories: updatedNotes})
      })
  }


  render() {
    return (
        <View> 
            <View style={styles.vaccinatedBar}>
                <Text>Vaccinated individuals</Text> 
                <ProgressBar style={{position: 'absolute'}} progress={this.state.some_data.vaxx_percentage / 100} color={Colors.red800}/>
            </View>
            <ScrollView
                horizontal
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                height={30}
                style={styles.chipsScrollView}> 
                <View style={styles.chipsItem}> 
                    <Text>Active Cases: </Text>
                    <Text style={{color: 'red'}}>{this.state.some_data.active_cases}</Text>
                </View>
                <View style={styles.chipsItem}> 
                    <Text>Deaths: </Text>
                    <Text style={{color: 'red'}}>{this.state.some_data.deaths}</Text>
                </View>
                <View style={styles.chipsItem}> 
                    <Text>Imported Case Change: </Text>
                    <Text style={{color: 'red'}}>{this.state.some_data.imported_cases_change}</Text>
                </View>
                <View style={styles.chipsItem}> 
                    <Text>Hospitalized Critical: </Text>
                    <Text style={{color: 'red'}}>{this.state.some_data.hospitalised_critical}</Text>
                </View>
            </ScrollView>
            {/* <View style={styles.covidIndicator}>
                <Text>Hospitalized Critical: </Text> 
                <Text style={{color: 'red'}}>{this.state.some_data.hospitalised_critical}</Text> 
            </View> */}

        </View>
    );
  }
}

const styles = StyleSheet.create({
    chipsScrollView: {
        position: 'relative',
        marginTop: 8,
    },
    chipsIcon: {
        marginRight: 5, 
    },
    chipsItem: {
        flexDirection: "row",
        borderRadius: 20, 
        padding: 7,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        backgroundColor: '#fff',
        height: 30, 
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5, 
        shadowRadius: 5, 
        elevation: 10,
    },
    vaccinatedBar: {
        position: 'relative',
        marginTop: 9, 
        flexDirection: "column",
        backgroundColor: '#fff',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 5, 
        padding: 8, 
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
    covidIndicator: {
        position: 'relative',
        marginTop: 8, 
        flexDirection: 'row',
        width: '40%',
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        borderRadius: 5, 
        padding: 8, 
        shadowColor: '#ccc',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5, 
        shadowRadius: 5, 
        elevation: 10, 
    },
});
