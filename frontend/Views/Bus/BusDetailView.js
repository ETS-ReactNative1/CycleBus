import React, { Component } from 'react';
import { FlatList, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import APIKit from '../../shared/APIKit';

const initialState = {
    busId:null,
    busDetail:null,
};

class BusDetail extends Component {

    state = initialState;

    constructor(props) {
        super(props)
        this.state = {    
            busId:props.route.params.busId,
            busDetail:null,
        };
        console.log(props);
    }

    
    async componentDidMount() {
        const {busId} = this.state;
        const onSuccess = ({ data }) => {
            this.setState({ busDetail: data.data, isLoading: false });
        };

        const onFailure = (error) => {
            this.setState({ errors: error.response.data, isLoading: false });
        };

        // Show spinner when call is made
        this.setState({ isLoading: true });
        APIKit.get("bus/"+busId).then(onSuccess).catch(onFailure);

    }

    onPressAddToBus() {

    }

    getListViewItem = (item) => {
        this.props.navigation.navigate("RouteMap", {geoPoints:item.locations});
    }


    render() {

        const { busDetail } = this.state;

        return (
            <View style={styles.container}>
                <SectionList
                    sections={[
                        { title: 'Name', data: [busDetail?.bus_name] },
                        { title: 'Area', data: [busDetail?.area] },
                        { title: 'County', data: [busDetail?.county]},
                    ]}
                    renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
                    renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                    keyExtractor={(item, index) => index}
                />
                <Text style={styles.sectionHeader}>Routes</Text>
                <FlatList
                    data={this.state.busDetail?.routes}
                    renderItem={({ item }) =>
                        <Text style={styles.item}
                            onPress={this.getListViewItem.bind(this, item)}>{item.route_name}</Text>}
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

export default BusDetail;