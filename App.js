import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet } from "react-native";

// import { createStackNavigator } from '@react-navigation/stack';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomePage from "./src/screens/MapView";

const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home Page" screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home Page" component={HomePageUser}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
