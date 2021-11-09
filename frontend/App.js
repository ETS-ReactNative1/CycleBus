import { StatusBar } from "expo-status-bar";
import React from "react";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
} from "react-native";

export default function App() {
  const [userLocation, setUserLocation] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [serverState, setServerState] = React.useState("Loading...");
  const [disableButton, setDisableButton] = React.useState(true);
  const [serverMessage, setServerMessage] = React.useState("");
  var ws = React.useRef(
    new WebSocket("ws://192.168.0.140:8000/ws/channel/")
  ).current;

  React.useEffect(() => {
    //geolocation
    const getLocation = async () => {
      try {
        const { granted } = await Location.requestForegroundPermissionsAsync();

        if (!granted) {
          return Alert.alert(
            "Permissions needed",
            "This app does not currently have permission to access your location",
            [{ text: "Ok", style: "cancel" }]
          );
        }
        const {
          coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync();

        setUserLocation([longitude, latitude]);
      } catch (error) {
        console.error(error);
      }
    };

    getLocation();

    ws.onopen = () => {
      setServerState("Connected to the server");
      setDisableButton(false);
    };
    ws.onclose = (e) => {
      setServerState(e.message);
      setDisableButton(true);
    };
    ws.onerror = (e) => {
      setServerState(e.message);
    };
    ws.onmessage = (e) => {
      //serverMessagesList.push(e.data);
      //setServerMessage([...serverMessagesList]);
      setServerMessage(e.data);
    };
  }, []);
  const submitMessage = () => {
    ws.send(userLocation.toString());
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>{serverState}</Text>
      </View>
      <View style={styles.myloc}>
        <Text>Child Location: {serverMessage}</Text>
      </View>

      <View
        style={{
          flexDirection: "column",
          marginTop: 100,
        }}
      >
        <Text>My Location: </Text>
        <Text>Longitude : {userLocation[0]}</Text>
        <Text>Latitude : {userLocation[1]}</Text>
        <Button
          onPress={submitMessage}
          title={"Submit"}
          disabled={disableButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    marginTop: 300,
    // alignItems: "center",
    // justifyContent: "center",
  },
  container: {
    marginTop: 100,
    // alignItems: "center",
    // justifyContent: "center",
  },
});
