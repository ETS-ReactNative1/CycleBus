import 'react-native-gesture-handler';
import React, { useState, useEffect, } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../Views/Home/HomeView";
import MarshalBus from "../Views/Marshal/MarshalBusView";
import Profile from '../Views/Profile/ProfileView';
import Children from '../Views/Child/Children';


const Stack = createNativeStackNavigator();

const screenOptionStyle={
  headerShown: false
}

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="HomeView" component={Home}  />
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
      <Stack.Screen name="ProfileView" component={Profile}  />
    </Stack.Navigator>
  );
}

const ChildrenStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="ChildrenView" component={Children}  />
    </Stack.Navigator>
  );
}
export { MarshalStackNavigator,HomeStackNavigator ,ProfileStackNavigator,ChildrenStackNavigator};