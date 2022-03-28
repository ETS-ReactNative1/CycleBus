import 'react-native-gesture-handler';
import React, { useState, useEffect, } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../Views/Home/HomeView";
import MarshalRide from "../Views/Ride/MarshalRideView";


const Stack = createNativeStackNavigator();

const screenOptionStyle={
  headerShown: false
}

const ParentStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Home" component={Home}  />
    </Stack.Navigator>
  );
}

const MarshalStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="MarshalRide" component={MarshalRide} />
    </Stack.Navigator>
  );
}

export { MarshalStackNavigator,ParentStackNavigator };