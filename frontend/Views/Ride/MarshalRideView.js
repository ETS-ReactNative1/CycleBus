import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
} from "react-native";

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

class MarshalRide extends Component {

  state = initialState;
  ws = new WebSocket("ws://192.168.0.54:8000/ws/bus/?id="+id);

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
    APIKit.post("ride/", payload).then(onSuccess).catch(onFailure);
  }

  async submitMessage() {
    count = this.state.count;
    if(count<=6){
      console.log(count)
      this.ws.send(userLocation[count].toString());
      this.setState({
        count: count + 1,
      });
    }
    
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

export default MarshalRide;
