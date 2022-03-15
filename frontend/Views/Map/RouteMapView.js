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
    geoPoints: [],
    isLoading: false,
};

const galway = {
    latitude: 53.270962,
    longitude: -9.06269,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

class RouteMap extends Component {
    state = initialState;

    constructor(props) {
        super(props)
        data = props.route.params.geoPoints.map(({ longitude, latitude }) => ({ longitude: parseFloat(longitude), latitude: parseFloat(latitude) }));

        this.state = {
            geoPoints: data
        };

        console.log(data)
    }

    render() {
        const { isLoading, geoPoints } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    {/*Render our MapView*/}
                    <MapView
                        style={styles.map}
                        initialRegion={galway}

                    >
                        <MapViewDirections
                           origin = {geoPoints[0]}
                           destination= {geoPoints[geoPoints.length - 1]}
                            waypoints={geoPoints}
                            lineDashPattern={[0]}
                            apikey="AIzaSyCBiU4oYll98xI7IocNOONCCgvkJr3dTZA"
                            strokeWidth={4}
                            strokeColor="#111111"
                            
                        />
                        <Marker coordinate={geoPoints[0]} />
                        <Marker coordinate={geoPoints[geoPoints.length - 1]} />
                        
                        {/* <Polyline
                            coordinates={geoPoints}
                            strokeColor="#000"
                            strokeColors={['#7F0000']}
                            strokeWidth={6}
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

export default RouteMap;
