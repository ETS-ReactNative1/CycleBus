
import React from "react";

import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import { MarshalStackNavigator, ParentStackNavigator, ProfileStackNavigator } from "./Navigator";
import { ScreenContainer } from "react-native-screens";
import { View } from "react-native";

const Drawer = createDrawerNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#9AC4F8",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
}

const DrawerNavigator = () => {
  return (

    
    <Drawer.Navigator screenOptions={screenOptionStyle}>
      
      <Drawer.Screen name="Children" component={ParentStackNavigator} />
      <Drawer.Screen name="Marshal View" component={MarshalStackNavigator} />
      <Drawer.Screen name="Profile" component={ProfileStackNavigator} />
    </Drawer.Navigator>

  );
}
export default DrawerNavigator;



