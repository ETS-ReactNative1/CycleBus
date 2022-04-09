import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./Navigation/DrawerNavigator";
import Login from "./Views/Login/LoginView";
import ChildDetail from "./Views/Child/ChildDetailView";
import Register from "./Views/Register/RegisterView";
import ChildRegister from "./Views/Register/ChildRegisterView";
import Parent from "./Views/Parent/ParentView";
import BusRegister from "./Views/Home/BusRegisterView";
import BusList from "./Views/Bus/BusListView";
import BusDetail from "./Views/Bus/BusDetailView";
import RouteMap from "./Views/Map/RouteMapView";
import MarshalRide from "./Views/Ride/MarshalRideView";
import ParentRide from "./Views/Ride/ParentRideView";
import EditProfile from "./Views/Profile/EditProfileView";

const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerShown: false
}
const headerStyle = {
  headerStyle: {
    backgroundColor: "#1E90FF",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
}
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={headerStyle} initialRouteName="login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="DrawerParent" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="ChildDetail" component={ChildDetail} options={{ title: "Child Detail" }} />
        <Stack.Screen name="Register" component={Register} options={/**{ title: "Register" }**/ { headerShown: false }} />
        <Stack.Screen name="ChildRegister" component={ChildRegister} options={{ headerShown: false }} />
        <Stack.Screen name="Parent" component={Parent} options={{ title: "Parent" }} />
        <Stack.Screen name="BusRegister" component={BusRegister} options={{ title: "Register to a Bus" }} />
        <Stack.Screen name="BusList" component={BusList} options={{ title: "Bus List " }} />
        <Stack.Screen name="ParentRide" component={ParentRide} options={{ title: "Ride View " }} />
        <Stack.Screen name="MarshalRide" component={MarshalRide} options={{ title: "Ride View " }} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="BusDetail" component={BusDetail} />
        <Stack.Screen name="RouteMap" component={RouteMap} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App