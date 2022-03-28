import React, { Component } from 'react';
import { Button, FlatList, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import APIKit from '../../shared/APIKit';

const initialState = {
    childId: null,
    childDetail: null,
};

class ChildDetail extends Component {


    state = initialState;

    constructor(props) {
        super(props)
        this.state = {
            childId: props.route.params.childId,
            childDetail: null,
        };
    }


    async componentDidMount() {
        const { childId } = this.state;
        const onSuccess = ({ data }) => {
            this.setState({ childDetail: data.child, isLoading: false });
        };

        const onFailure = (error) => {
            this.setState({ errors: error.response.data, isLoading: false });
        };

        // Show spinner when call is made
        this.setState({ isLoading: true });
        APIKit.get("child/" + childId).then(onSuccess).catch(onFailure);

    }

    onPressAddToBus() {
        this.props.navigation.replace("BusList", { childId: this.state.childId })
    }

    getListViewItem = (item) => {
        
        this.props.navigation.navigate("ParentRide", {
            rideId: item.ride_id,
            routeId: item.route_id,
            busId: item.bus_id,
            childDetail: this.state.childDetail
        });
    }


    render() {

        const { childDetail } = this.state;

        return (
            <View style={styles.container}>
                <SectionList
                    sections={[
                        { title: 'Name', data: [childDetail?.user.name] },
                        { title: 'Email', data: [childDetail?.user.email] },
                        { title: 'Start Location', data: [childDetail?.start_location.location_id] },
                        { title: 'End Location', data: [childDetail?.end_location.location_id] },
                    ]}
                    renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
                    renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                    keyExtractor={(item, index) => index}
                />
                <Text style={styles.sectionHeader}>Registered Buses</Text>
                <FlatList
                    data={this.state.childDetail?.registered_buses}
                    renderItem={({ item }) =>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.item}>{item.bus_name}</Text>
                            <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                                {item.ride_id && <Button title='Ride' onPress={this.getListViewItem.bind(this, item)} />}
                                {/* <Button title='Select' onPress={this.selectListViewItem.bind(this, item)} /> */}
                            </View>
                        </View>

                    }

                    ItemSeparatorComponent={this.renderSeparator}
                    keyExtractor={(item, index) => index.toString()}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.onPressAddToBus.bind(this)}
                >
                    <Text style={styles.buttonText}>ADD TO BUS</Text>
                </TouchableOpacity>
            </View>
        );
    }
}


const utils = {
    colors: { primaryColor: "blue" },
    dimensions: { defaultPadding: 12 },
    fonts: { largeFontSize: 18, mediumFontSize: 16, smallFontSize: 12 },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F8FF"
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 22,
        fontWeight: 'bold',
        color: "#fff",
        backgroundColor: '#4169E1',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },

    button: {
        borderColor: utils.colors.primaryColor,
        borderWidth: 2,
        padding: utils.dimensions.defaultPadding,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
    },

    buttonText: {
        color: utils.colors.primaryColor,
        fontSize: utils.fonts.mediumFontSize,
        fontWeight: "bold",
    }
})

export default ChildDetail;