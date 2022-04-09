// const initialState = {
//   username: "", // Store `username` when user enters their username
//   password: "", // Store `password` when user enters their password
//   errors: {}, // Store error data from the backend here
//   isAuthorized: false, // If auth is successful, set this to `true`
//   isLoading: false, // Set this to `true` if You want to show spinner
// };
// <ROOT>/App/Views/Login/LoginView.js

import React, { Component } from "react";
import { FlatList, StyleSheet, TouchableWithoutFeedback, View, Text, Alert } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import APIKit from "../../shared/APIKit";
import { FlatItem } from "../Common/List";

const initialState = {
    dataSource: []
};



class Home extends Component {
    state = initialState;

    componentDidMount() {

        const onSuccess = ({ data }) => {
            this.setState({ dataSource: data.data, isLoading: false });
        };

        const onFailure = (error) => {
            this.setState({ errors: error.response.data, isLoading: false });
        };

        // Show spinner when call is made
        this.setState({ isLoading: true });

        APIKit.get("rides/").then(onSuccess).catch(onFailure);

    }

    onRideClick(item) {
        const onSuccess = ({ data }) => {
            this.setState({ dataSource: data.data, isLoading: false });
            data = data.data.find(x => x.route === item.route)

            if (data.rideId !== null) {
                this.props.navigation.navigate("ParentRide", {
                    rideId: data.active_ride,
                    routeId: data.route,
                    busId: data.bus,
                    joinLocation: data.join_location,
                    childDetail: data.child
                });
            } else {
                Alert.alert("No active ride found.")
            }
        };

        const onFailure = (error) => {
            this.setState({ errors: error.response.data, isLoading: false });
        };

        this.setState({ isLoading: true });

        APIKit.get("rides/").then(onSuccess).catch(onFailure);

    }

    render() {
        const { isLoading, dataSource } = this.state
        return (
            <View style={styles.container}>
                <Spinner visible={isLoading} />

                <FlatList
                    data={dataSource.filter((item) => item.active_ride !== null)}
                    renderItem={({ item }) =>
                        <TouchableWithoutFeedback onPress={() => this.onRideClick(item)}>
                            <View>
                                <FlatItem title={item.child.name} subtitle={item.child.school} />
                            </View>
                        </TouchableWithoutFeedback>
                    }
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

// Define some colors and default sane values
const utils = {
    colors: { primaryColor: "blue" },
    dimensions: { defaultPadding: 12 },
    fonts: { largeFontSize: 18, mediumFontSize: 16, smallFontSize: 12 },
};

// Define styles here
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:10,
        justifyContent:"center"
    },
})

export default Home;
