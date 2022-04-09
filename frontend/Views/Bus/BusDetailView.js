import React, { Component } from 'react';
import { Alert, FlatList, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import APIKit from '../../shared/APIKit';
import RouteMap from '../Map/RouteMapView';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class BusDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            busId: props.route.params.busId,
            childId: props.route.params.childId,
            busDetail: null,
            route: null,
            joinLocations: {}
        };
    }


    async componentDidMount() {
        const { busId } = this.state;
        const onSuccess = ({ data }) => {
            this.setState({ busDetail: data.data, isLoading: false, route: data.data.routes[0] });

        };

        const onFailure = (error) => {
            this.setState({ errors: error.response.data, isLoading: false });
        };

        // Show spinner when call is made
        this.setState({ isLoading: true });
        APIKit.get("bus/" + busId).then(onSuccess).catch(onFailure);

    }

    onPressAddToBus() {
        const { busId, joinLocations, childId, busDetail } = this.state;
        if (Object.keys(joinLocations).length != busDetail.routes.length) {
            Alert.alert("Set join locations for all routes and click on tick.")
        } else {
            const payload = Object.keys(joinLocations).map(function (key, index) {
                return { route: parseInt(key), join_location: parseInt(joinLocations[key]) }
            });

            const onSuccess = ({ data }) => {
                this.setState({ isLoading: false });
                this.props.navigation.navigate("ChildDetail", { childId: childId })
            };

            const onFailure = (error) => {
                this.setState({ errors: error.response.data, isLoading: false });
            };

            // Show spinner when call is made
            this.setState({ isLoading: true });
            APIKit.post("child/" + childId + '/join/', {locations:payload}).then(onSuccess).catch(onFailure);
        }

    }




    onSetJoinLocation = (location_id) => {
        locs = this.state.joinLocations

        locs[this.state.route.route_id] = location_id
        this.setState({ joinLocations: locs });
    };

    getListViewItem = (item) => {
        this.props.navigation.navigate("RouteMap", { geoPoints: item.locations });
    }


    render() {

        const { busDetail, route, joinLocations } = this.state;

        return (
            <View style={styles.container}>
                <SectionList
                    sections={[
                        { title: 'Details', data: [busDetail?.bus_name, busDetail?.area, busDetail?.county] },
                        // { title: 'Area', data: [busDetail?.area] },
                        // { title: 'County', data: [busDetail?.county] },
                    ]}
                    renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
                    renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                    keyExtractor={(item, index) => index}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.sectionHeaderBus}>Join Location for Routes</Text>
                    <TouchableOpacity style={styles.button} onPress={this.onPressAddToBus.bind(this)}>
                        <FontAwesome name="check" color="white" size={15} />
                    </TouchableOpacity>
                </View>
                <View style={styles.picker}>
                    {busDetail && <Picker
                        mode="dropdown"
                        selectedValue={route}
                        onValueChange={(item) => {
                            this.setState({ route: item });
                        }}>
                        {busDetail.routes.map((item, index) => {
                            let label = item.route_name
                            if (joinLocations[item.route_id + '']) {
                                label = label + "- join at " + joinLocations[item.route_id + '']
                            }
                            return (<Picker.Item label={label} value={item} key={index} />)
                        })}
                    </Picker>}
                </View>
                {route && <RouteMap key={route.route_id} geoPoints={route.locations} onMarkerClick={this.onSetJoinLocation} />}

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F8FF",
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 22,
        fontWeight: 'bold',
        color: "#fff",
        backgroundColor: '#1e90ff',
    },
    sectionHeaderBus: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 22,
        fontWeight: 'bold',
        color: "#fff",
        backgroundColor: '#1e90ff',
        flex: 4,
    },
    item: {
        paddingTop: 5,
        paddingLeft: 10,
        fontSize: 18,
        height: 44,
    },

    picker: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#1E90FF",
    },
    busListItems: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    button: {
        flex: 1,
        color: '#1E90FF',
        alignItems: 'center',
        backgroundColor: '#1E90FF',
        justifyContent: "center",
        elevation: 6,

    },
    textButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    buttonStyles: {
        alignItems: 'center',
        marginTop: 30,
        color: '#1E90FF',
    },
})

export default BusDetail;