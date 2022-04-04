import 'react-native-gesture-handler';
import React, { useState, useEffect, } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../Views/Home/HomeView";
import MarshalBus from "../Views/Marshal/MarshalBusView";
import Profile from '../Views/Profile/ProfileView';


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
      <Stack.Screen name="MarshalBus" component={MarshalBus} />
    </Stack.Navigator>
  );
}

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Profile" component={Profile}  />
    </Stack.Navigator>
  );
}

export { MarshalStackNavigator,ParentStackNavigator ,ProfileStackNavigator};