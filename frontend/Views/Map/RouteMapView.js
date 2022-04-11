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
import GeoMarker from "../Ride/Marker";
import { keys } from "../../shared/Keys";

const initialState = {
    geoPoints: [],
    isLoading: false,
    start: null,
    waypoints: [],
    end: null,
    home:null
};

const galway = {
    latitude: 53.270962,
    longitude: -9.06269,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

class RouteMap extends Component {
    state = initialState;

    componentDidMount() {
        this.setGeoPoints(this.props.geoPoints,this.props.home)
    }

    setGeoPoints = (geoPoints,home) => {
        this.setState({
            home: home,
            start: geoPoints[0],
            waypoints: geoPoints.slice(1, -1),
            end: geoPoints[geoPoints.length - 1]
        });
    }

    render() {
        const { isLoading, start, waypoints, end } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    {/*Render our MapView*/}
                    <MapView
                        style={styles.map}
                        initialRegion={galway}

                    >
                        {start && end && waypoints && <MapViewDirections
                            origin={{ longitude: parseFloat(start.longitude), latitude: parseFloat(start.latitude) }}
                            destination={{ longitude: parseFloat(end.longitude), latitude: parseFloat(end.latitude) }}
                            waypoints={waypoints.map(({ longitude, latitude }) => ({ longitude: parseFloat(longitude), latitude: parseFloat(latitude) }))}
                            lineDashPattern={[1]}
                            apikey={keys.GOOGLE_MAP_KEY}
                            strokeWidth={2}
                            strokeColor="#111111"
                            mode="BICYCLING"
                            optimizeWaypoints={false}
                        />}
                        {start && <GeoMarker
                            coords={{ longitude: start.longitude, latitude: start.latitude }}
                            icon="chevron-circle-down"
                            onClick={this.props.onMarkerClick}
                            color="red"
                            location_id={start.location_id}
                            size={20}
                        />}
                        {end && <GeoMarker
                            coords={{ longitude: end.longitude, latitude: end.latitude }}
                            icon="chevron-circle-down"
                            onClick={this.props.onMarkerClick}
                            color="red"
                            location_id={end.location_id}
                            size={20}
                        />}

                        {waypoints && waypoints.map((point, key) => {
                            return <GeoMarker
                                key={key}
                                coords={{ longitude: point.longitude, latitude: point.latitude }}
                                icon="chevron-circle-down"
                                name={point.location_name}
                                onClick={this.props.onMarkerClick}
                                location_id={point.location_id}
                                color="blue"
                                size={15}
                            />
                        })}

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
