import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
} from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { decode } from "@mapbox/polyline";
import MapViewDirections from "react-native-maps-directions";
import { Marker } from "react-native-maps";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { StyleSheet } from "react-native";

const userLocation = [
  "53.279685388066596, -9.07893079275496",
  "53.278335647001484, -9.078207504195282",
  "53.27592351102866, -9.082756531119678",
  "53.274050162588814, -9.081039917426422",
  "53.273331596197195, -9.07288600238346",
  "53.26886594857719, -9.071770203482844",
  "53.268070295734994, -9.076190483742975",
];

const initialState = {
  count: 0,
  isStarted: false,
};

class Ride extends Component {
  state = initialState;
  ws = new WebSocket("ws://192.168.0.140:8000/ws/channel/");

  componentDidMount() {
    this.timer = setInterval(() => {
      if (this.state.isStarted) {
        this.submitMessage();
      }
    }, 1000);
    this.ws.onopen = () => {};
    this.ws.onclose = (e) => {};
    this.ws.onerror = (e) => {};
    this.ws.onmessage = (e) => {};
  }

  onButtonClick() {
    this.setState({ isStarted: true });
  }

  async submitMessage() {
    count = this.state.count;
    this.ws.send(userLocation[count].toString());
    this.setState({
      count: count + 1,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.onButtonClick.bind(this)} title="Start" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
});

export default Ride;
