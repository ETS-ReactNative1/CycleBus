import React, { useState, useEffect, } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Button, Image } from 'react-native';
import Login from "./Views/Login/LoginView";
import Register from "./Views/Register/RegisterView";
import ChildRegister from "./Views/Register/ChildRegisterView";
import Parent from "./Views/Parent/ParentView";
import BusRegister from "./Views/Home/BusRegisterView";
import Home from "./Views/Home/HomeView";
import ChildDetail from "./Views/Child/ChildDetailView";
import BusList from "./Views/Bus/BusListView";
import BusDetail from "./Views/Bus/BusDetailView";
import RouteMap from "./Views/Map/RouteMapView";
import MarshalRide from "./Views/Ride/MarshalRideView";
import ParentRide from "./Views/Ride/ParentRideView";

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
        <Stack.Screen name="Register" component={Register} options={{ title: "Register" }} />
        <Stack.Screen name="ChildRegister" component={ChildRegister} options={{ title: "Register Child" }} />
        <Stack.Screen name="Parent" component={Parent} options={{ title: "Parent" }} />
        <Stack.Screen name="BusRegister" component={BusRegister} options={{ title: "Register to a Bus" }} />
        <Stack.Screen name="ChildDetail" component={ChildDetail} options={{ title: "Child Detail" }} />
        <Stack.Screen name="BusList" component={BusList} options={{ title: "Bus List " }} />
        <Stack.Screen name="MarshalRide" component={MarshalRide} options={{ title: "Marshal View " }} />
        <Stack.Screen name="ParentRide" component={ParentRide} options={{ title: "Ride View " }} />
        <Stack.Screen name="Home" component={Home} options={({ navigation }) =>({headerRight: () => (
              // <view>
              // <Button
              //   onPress={()=>navigation.navigate("ChildRegister")}
              //   title="Register New"
              //   color="#0000FF"
              // />  
              <Button
                onPress={()=>navigation.navigate("MarshalRide")}
                title="Marshal Dashboard"
                color="#0000FF"
              />
              // </view>
              
            ),})} />
        <Stack.Screen name="Map" component={Map} />
        {/* <Stack.Screen name="Ride" component={Ride} /> */}
        <Stack.Screen name="BusDetail" component={BusDetail} />
        <Stack.Screen name="RouteMap" component={RouteMap} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
