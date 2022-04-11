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



class Participants extends Component {
    state = initialState;

    componentDidMount() {

        const onSuccess = ({ data }) => {
            this.setState({ dataSource: data.data, isLoading: false });
        };

        const onFailure = (error) => {
            this.setState({ errors: error.response.data, isLoading: false });
        };

        this.setState({ isLoading: true });

        APIKit.get("ride/"+this.props.route.params.rideId+"/attendence/").then(onSuccess).catch(onFailure);

    }

    render() {
        const { isLoading, dataSource } = this.state
        return (
            <View style={styles.container}>
                <Spinner visible={isLoading} />

                <FlatList
                    data={dataSource.filter((item) => item.active_ride !== null)}
                    renderItem={({ item }) =>
                        <FlatItem title={item.attendee.name} subtitle={item.status} />
                    }
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: "center"
    },
})

export default Participants;
