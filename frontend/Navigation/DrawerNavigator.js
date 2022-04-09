
import React from "react";

import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import { ChildrenStackNavigator, HomeStackNavigator, MarshalStackNavigator, ParentStackNavigator, ProfileStackNavigator } from "./Navigator";
import { ScreenContainer } from "react-native-screens";
import { View } from "react-native";
import { DrawerContent } from "./DrawerContent";
import { NavigationContainer } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#1E90FF",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
}


const DrawerNavigator = () => {


  return (

      <Drawer.Navigator screenOptions={screenOptionStyle} drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={HomeStackNavigator} />
        <Drawer.Screen name="Children" component={ChildrenStackNavigator} />
        <Drawer.Screen name="Marshal View" component={MarshalStackNavigator} />
        <Drawer.Screen name="Profile" component={ProfileStackNavigator} />
      </Drawer.Navigator>

  );
}
export default DrawerNavigator;



