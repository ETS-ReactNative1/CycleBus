// const initialState = {
//   username: "", // Store `username` when user enters their username
//   password: "", // Store `password` when user enters their password
//   errors: {}, // Store error data from the backend here
//   isAuthorized: false, // If auth is successful, set this to `true`
//   isLoading: false, // Set this to `true` if You want to show spinner
// };
// <ROOT>/App/Views/Login/LoginView.js

import React, { Component } from "react";
import { FlatList, StyleSheet, View, Text, Alert, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import APIKit, { setClientToken } from "../../shared/APIKit";
import Icon from 'react-native-vector-icons/FontAwesome';

const initialState = {
    dataSource: [],
    childId:null
};

class BusList extends Component {
    state = initialState;

    async componentDidMount() {

        this.setState({
            childId:this.props.childId
        })
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
                style={styles.seperator}
            />
        );
    };

    getListViewItem = (item) => {
        this.props.closeModal()
        this.props.navigation.navigate("BusDetail", { busId: item.bus_id, childId:this.state.childId})
    }

    render() {
        return (
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({ item }) =>

                            <TouchableWithoutFeedback style={styles.itemBlock} onPress={() => this.getListViewItem(item)}>

                                <View style={styles.itemMeta}>
                                    <Text style={styles.itemName}>{item.bus_name}</Text>
                                    <Text style={styles.itemLastMessage}>{item.area}</Text>
                                </View>

                            </TouchableWithoutFeedback>
                    }
                    ItemSeparatorComponent={this.renderSeparator}
                    keyExtractor={(item, index) => index.toString()}
                />
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemBlock: {
        flexDirection: 'row',
    },
    seperator:{
        height: 2,
        width: "100%",
        backgroundColor: "#1E90FF",
    },
    itemMeta: {
        justifyContent: 'flex-start',
    },
    itemName: {
        fontSize: 20,
    },
    itemLastMessage: {
        fontSize: 14,
        color: "#111",
    },
});
export default BusList;
