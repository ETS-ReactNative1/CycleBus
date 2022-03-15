// const initialState = {
//   username: "", // Store `username` when user enters their username
//   password: "", // Store `password` when user enters their password
//   errors: {}, // Store error data from the backend here
//   isAuthorized: false, // If auth is successful, set this to `true`
//   isLoading: false, // Set this to `true` if You want to show spinner
// };
// <ROOT>/App/Views/Login/LoginView.js

import React, { Component } from "react";
import { FlatList, StyleSheet, View, Text, Alert, TouchableOpacity, Image, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

import Spinner from "react-native-loading-spinner-overlay";

import APIKit, { setClientToken } from "../../shared/APIKit";

const initialState = {
    dataSource: []
};



class Home extends Component {
    state = initialState;

    async componentDidMount() {

        const onSuccess = ({ data }) => {
            this.setState({ dataSource: data.data, isLoading: false });
        };

        const onFailure = (error) => {
            this.setState({ errors: error.response.data, isLoading: false });
        };

        // Show spinner when call is made
        this.setState({ isLoading: true });

        APIKit.get("child/").then(onSuccess).catch(onFailure);

    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#000",
                }}
            />
        );
    };
    //handling onPress action  
    getListViewItem = (item) => {
        this.props.navigation.navigate("ChildDetail", {childId:item.user.id});
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({ item }) =>
                        <Text style={styles.item}
                            onPress={this.getListViewItem.bind(this, item)}>{item.user.name}</Text>}
                    ItemSeparatorComponent={this.renderSeparator}
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
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
})

export default Home;
