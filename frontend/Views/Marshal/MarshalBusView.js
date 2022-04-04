import React, { Component } from "react";
import { FlatList, StyleSheet, View, Text, Alert, TouchableOpacity, Image, TextInput, Button } from "react-native";


import APIKit, { setClientToken } from "../../shared/APIKit";

const initialState = {
    dataSource: [],
    childDetail: null,
};

class MarshalBus extends Component {
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

        APIKit.get("marshal_bus/").then(onSuccess).catch(onFailure);

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
        this.props.navigation.navigate("MarshalRide", { busId: item.bus_id , routeId : item.default_route})
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
                                <Button title='Ride' onPress={this.getListViewItem.bind(this, item)} />
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

export default MarshalBus;
