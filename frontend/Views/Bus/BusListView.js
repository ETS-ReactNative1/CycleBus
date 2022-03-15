// const initialState = {
//   username: "", // Store `username` when user enters their username
//   password: "", // Store `password` when user enters their password
//   errors: {}, // Store error data from the backend here
//   isAuthorized: false, // If auth is successful, set this to `true`
//   isLoading: false, // Set this to `true` if You want to show spinner
// };
// <ROOT>/App/Views/Login/LoginView.js

import React, { Component } from "react";
import { FlatList, StyleSheet, View, Text, Alert, TouchableOpacity, Image, TextInput, Button } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

import Spinner from "react-native-loading-spinner-overlay";

import APIKit, { setClientToken } from "../../shared/APIKit";

const initialState = {
    dataSource: [],
    childDetail: null,
};

class BusList extends Component {
    state = initialState;

    constructor(props) {
        super(props)
        this.state = {
            childId: props.route.params.childId
        };
    }

    async componentDidMount() {

        const onSuccess = ({ data }) => {
            this.setState({ dataSource: data.data, isLoading: false });
        };

        const onFailure = (error) => {
            this.setState({ errors: error.response.data, isLoading: false });
        };

        // Show spinner when call is made
        this.setState({ isLoading: true });

        APIKit.get("bus/").then(onSuccess).catch(onFailure);

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

    getListViewItem = (item) => {
        this.props.navigation.navigate("BusDetail", { busId: item.bus_id })
    }

    selectListViewItem = (item) => {

        const { childId } = this.state;

        const payload = { child: { registered_buses: [item.bus_id] } };

        const onSuccess = ({ data }) => {
            this.setState({ isLoading: false });
            this.props.navigation.push("ChildDetail", { childId: childId })
        };

        const onFailure = (error) => {
            this.setState({ errors: error.response.data, isLoading: false });
        };

        // Show spinner when call is made
        this.setState({ isLoading: true });

        APIKit.put("child/" + childId + '/', payload).then(onSuccess).catch(onFailure);
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({ item }) =>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.item}>{item.bus_name}</Text>
                            <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                                <Button title='View' onPress={this.getListViewItem.bind(this, item)} />
                                <Button title='Select' onPress={this.selectListViewItem.bind(this, item)} />
                            </View>
                        </View>
                    }
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

export default BusList;
