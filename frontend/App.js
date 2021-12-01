import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
} from "react-native";

import Login from "./Views/Login/LoginView";
import Map from "./Views/Map/MapView";
import Ride from "./Views/Ride/RideView";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="Ride" component={Ride} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
