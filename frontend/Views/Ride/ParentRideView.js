// const initialState = {
//   username: "", // Store `username` when user enters their username
//   password: "", // Store `password` when user enters their password
//   errors: {}, // Store error data from the backend here
//   isAuthorized: false, // If auth is successful, set this to `true`
//   isLoading: false, // Set this to `true` if You want to show spinner
// };
// <ROOT>/App/Views/Login/LoginView.js

import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, Button } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { decode } from "@mapbox/polyline";
import MapViewDirections from "react-native-maps-directions";
import { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import APIKit from "../../shared/APIKit";
import Icon from 'react-native-vector-icons/FontAwesome';
import GeoMarker from "./Marker";
import axios from "axios";


const GOOGLE_MAPS_API_KEY = "AIzaSyCBiU4oYll98xI7IocNOONCCgvkJr3dTZA";
const galway = {
  latitude: 53.270962,
  longitude: -9.06269,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

class ParentRide extends Component {

  constructor(props) {
    super(props)
    this.state = {
      rideId: props.route.params.rideId,
      busId: props.route.params.busId,
      routeId: props.route.params.routeId,
      startLocation: {
        latitude: parseFloat(props.route.params.childDetail.start_location.latitude),
        longitude: parseFloat(props.route.params.childDetail.start_location.longitude),
      },
      endLocation: {
        latitude: parseFloat(props.route.params.childDetail.end_location.latitude),
        longitude: parseFloat(props.route.params.childDetail.end_location.longitude),
      },
      joinLocation: {
        latitude: parseFloat(props.route.params.childDetail.join_location.latitude),
        longitude: parseFloat(props.route.params.childDetail.join_location.longitude),
      },
      errors: {},
      isLoading: false,
      count: 0,
      isStarted: false,
      marshalLocation: null,
      status: false,
      time: 0,
      timeInMin : 0,
    
      

    };


    this.DisplayTime();


    this.ws = new WebSocket("ws://192.168.0.54:8000/ws/ride/" + this.state.rideId + "/");

    this.ws.onopen = () => { };
    this.ws.onclose = (e) => { };
    this.ws.onerror = (e) => { };
    this.ws.onmessage = (e) => {
      const location = JSON.parse(e.data);
      this.setState({
        marshalLocation: {
          latitude: parseFloat(location.split(",")[0]),
          longitude: parseFloat(location.split(",")[1]),
        },
      });
    };
  }

  getTravelTime() {
    const { marshalLocation, joinLocation } = this.state
    if (marshalLocation) {
      const origin = marshalLocation.latitude + ',' + marshalLocation.longitude;
      const destination = joinLocation.latitude+','+joinLocation.longitude;
      const mode = "bicycling";
      const key = GOOGLE_MAPS_API_KEY;
      var axios = require('axios');
      const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + [origin] + '&destinations=' + [destination] + '&units=imperial&key=' + key +'&mode=' + [mode];
      console.log(url)
      var config = {
        method: 'get',
        url: url,
        headers: {}
      };

      axios(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          const jsonObj = JSON.parse(JSON.stringify(response.data));
          console.log(jsonObj.rows.elements);
          this.setState({ time: jsonObj.rows[0].elements[0].duration.value});
          
          
        })
        .catch(function (error) {
          console.log(error);
        });
      // const service = new google.maps.DistanceMatrixService();
      // const origin = this.state.currentLoc;
      // const destination = this.state.joinLocation;
      // url = 'https://maps.googleapis.com/maps/api/distancematrix/json'
      // key = GOOGLE_MAPS_API_KEY
      // params = {'key': key, 'origins': [origin], 'destinations': [destination]}

      // req = requests.get(url=url, params=params)
      // res = json.loads(req.content)
      //   console.log(res)

      // const request = {
      //   origins: [origin],
      //   destinations: [destination],
      //   travelMode: google.maps.TravelMode.BICYCLING,
      //   unitSystem: google.maps.UnitSystem.METRIC,
      //   avoidHighways: false,
      //   avoidTolls: false,
      // };
      // // get distance matrix response
      // service.getDistanceMatrix([origin], [destination], google.maps.TravelMode.BICYCLING, (res, error) => {
      //   console.log(res)
      //   // put response

      // });
    }
  }

  DisplayTime(){
    
    this.timer = setInterval(() => {
      const time = this.state.time;
      this.setState({ time : (time-3) })
    },3000);
  }


  ShowHideTextComponentView = () => {

    if (this.state.status == true) {
      this.getTravelTime()


    }
    else {
      this.setState({ status: true })
      this.getTravelTime()
    }
  }
  async componentDidMount() {

    const { busId, routeId } = this.state;

    const onSuccess = ({ data }) => {

      data = data.locations.map(({ latitude, longitude }) => ({ longitude: parseFloat(longitude), latitude: parseFloat(latitude) }));
      this.setState({
        start: data[0],
        waypoints: data.slice(1, -1),
        end: data[data.length - 1],
        isLoading: false
      });
    };

    const onFailure = (error) => {
      console.log(error)
      this.setState({ errors: error.response.data, isLoading: false });
    };

    // Show spinner when call is made
    this.setState({ isLoading: true });

    APIKit.get("bus/" + busId + "/route/" + routeId).then(onSuccess).catch(onFailure);


    // this.getLocation();
  }

  render() {
    const { isLoading, marshalLocation, startLocation, endLocation, joinLocation } = this.state;

    console.log("marshal", marshalLocation);
    return (
      <View style={styles.container}>
        <Button onPress={this.ShowHideTextComponentView} title="Show Iime" />

        {this.state.status && <Text style={{ fontSize: 25, color: "#000", textAlign: 'center' }}> {Math.round(this.state.time) + "s"} </Text>}


        <View style={styles.container}>
          {/*Render our MapView*/}
          <MapView
            style={styles.map}
            //specify our coordinates.
            initialRegion={galway}
          >
            <MapViewDirections
              origin={this.state.start}
              destination={this.state.end}
              waypoints={this.state.waypoints}
              lineDashPattern={[0]}
              apikey="AIzaSyCBiU4oYll98xI7IocNOONCCgvkJr3dTZA"
              strokeWidth={4}
              strokeColor="#111111"
              mode="BICYCLING"
              optimizeWaypoints={false}
            />
            {marshalLocation &&
              <GeoMarker
                key={Math.floor(Math.random() * 100) + 1}
                coords={marshalLocation}
                icon="chevron-circle-down"
                color="red"
                size={20}
              />
            }

            {startLocation &&
              <GeoMarker
                coords={startLocation}
                icon="home"
                color="red"
                size={20}
              />
            }

            {endLocation &&
              <GeoMarker
                coords={endLocation}
                icon="building-o"
                color="red"
                size={20}
              />
            }

            {joinLocation &&
              <GeoMarker
                coords={joinLocation}
                icon="hand-stop-o"
                color="red"
                size={20}
              />
            }

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

export default ParentRide;
