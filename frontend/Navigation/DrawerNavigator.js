
import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { MarshalStackNavigator ,ParentStackNavigator} from "./Navigator";


const Drawer = createDrawerNavigator();

const screenOptionStyle={
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
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;