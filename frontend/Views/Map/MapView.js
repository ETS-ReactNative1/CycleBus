// const initialState = {
//   username: "", // Store `username` when user enters their username
//   password: "", // Store `password` when user enters their password
//   errors: {}, // Store error data from the backend here
//   isAuthorized: false, // If auth is successful, set this to `true`
//   isLoading: false, // Set this to `true` if You want to show spinner
// };
// <ROOT>/App/Views/Login/LoginView.js

import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { decode } from "@mapbox/polyline";
import MapViewDirections from "react-native-maps-directions";
import { Marker } from "react-native-maps";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { StyleSheet } from "react-native";

const initialState = {
  startLocation: { latitude: "", longitude: "" },
  endLocation: { latitude: "", longitude: "" },
  marshalLocation: null,
  errors: {},
  isLoading: false,
};

const galway = {
  latitude: 53.270962,
  longitude: -9.06269,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

class Map extends Component {
  ws = new WebSocket("ws://192.168.0.140:8000/ws/channel/");
  state = initialState;

  getLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();

      if (!granted) {
        return Alert.alert(
          "Permissions needed",
          "This app does not currently have permission to access your location",
          [{ text: "Ok", style: "cancel" }]
        );
      }

      const { latitude, longitude } = await Location.getCurrentPositionAsync();
      this.setState({
        startLocation: { latitude: latitude, longitude: longitude },
      });
    } catch (error) {
      console.error(error);
    }
  };
  componentDidMount() {
    this.ws.onopen = () => {};
    this.ws.onclose = (e) => {};
    this.ws.onerror = (e) => {};
    this.ws.onmessage = (e) => {
      const location = JSON.parse(e.data);
      console.log(location);

      this.setState({
        marshalLocation: {
          latitude: parseFloat(location.split(",")[0]),
          longitude: parseFloat(location.split(",")[1]),
        },
      });
    };
    this.getLocation();
  }

  render() {
    const { isLoading, marshalLocation } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.container}>
          {/*Render our MapView*/}
          <MapView
            style={styles.map}
            //specify our coordinates.
            initialRegion={galway}
          >
            <MapViewDirections
              origin={{
                latitude: 53.279685388066596,
                longitude: -9.07893079275496,
              }}
              destination={{
                latitude: 53.268070295734994,
                longitude: -9.076190483742975,
              }}
              waypoints={[
                {
                  latitude: 53.27289232102828,
                  longitude: -9.070615803690446,
                },
              ]}
              lineDashPattern={[0]}
              apikey="AIzaSyA3-5ynktBhfyiWds08Jp2Bqn9hcDvYeH4"
              strokeWidth={4}
              strokeColor="#111111"
            />
            {marshalLocation && <Marker coordinate={marshalLocation} />}
            {/* <Marker
              coordinate={{
                latitude: 53.26955995702022,
                longitude: -9.103588614577953,
              }}
            />
            <Marker
              coordinate={{
                latitude: 53.270962,
                longitude: -9.06269,
              }}
            /> */}
          </MapView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;
