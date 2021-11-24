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
const Stack = createNativeStackNavigator();

export default function App() {
  var ws = React.useRef(
    new WebSocket("ws://192.168.0.140:8000/ws/channel/")
  ).current;

  // React.useEffect(() => {
  //   //geolocation
  //   const getLocation = async () => {
  //     try {
  //       const { granted } = await Location.requestForegroundPermissionsAsync();

  //       if (!granted) {
  //         return Alert.alert(
  //           "Permissions needed",
  //           "This app does not currently have permission to access your location",
  //           [{ text: "Ok", style: "cancel" }]
  //         );
  //       }
  //       const {
  //         coords: { latitude, longitude },
  //       } = await Location.getCurrentPositionAsync();

  //       setUserLocation([longitude, latitude]);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //     // getDirections(
  //     //   // `${userLocation[1]},${userLocation[0]}`,
  //     //   "53.270962,-9.06269",
  //     //   "53.275031785328125,-9.06261966239833"
  //     // )
  //     //   .then((coords) => setCoords(coords))
  //     //   .catch((err) => console.log("Something went wrong"));
  //     // console.log(coords);
  //   };

  //   getLocation();

  //   ws.onopen = () => {
  //     setServerState("Connected to the server");
  //     setDisableButton(false);
  //   };
  //   ws.onclose = (e) => {
  //     setServerState(e.message);
  //     setDisableButton(true);
  //   };
  //   ws.onerror = (e) => {
  //     setServerState(e.message);
  //   };
  //   ws.onmessage = (e) => {
  //     //serverMessagesList.push(e.data);
  //     //setServerMessage([...serverMessagesList]);
  //     setServerMessage(e.data);
  //   };
  // }, []);

  const submitMessage = () => {
    ws.send(userLocation.toString());
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen name="Map" component={Map} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
