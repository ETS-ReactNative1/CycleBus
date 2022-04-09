import { LinearGradient } from 'expo-linear-gradient';
import React, { Component } from 'react';
import { Button, FlatList, Modal, SectionList, StyleSheet, Text, TouchableOpacity, View, ModalWrapper } from 'react-native';
import { Feather } from 'react-native-feather';
import APIKit from '../../shared/APIKit';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BusList from '../Bus/BusListView';

class ChildDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            childId: props.route.params.childId,
            childDetail: null,
            isBusListVisible: false,

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
        this.setState({ isBusListVisible: true })
    }

    closeModal = ()=> {
        this.setState({ isBusListVisible: false })
    }

    render() {

        const { childId, childDetail, isBusListVisible } = this.state;

        return (
            <View style={styles.container}>
                <SectionList
                    sections={[
                        { title: 'Name', data: [childDetail?.user.name] },
                        { title: 'Email', data: [childDetail?.user.email] },
                        { title: 'Start Location', data: [childDetail?.start_location.eircode, childDetail?.start_location.location_name] },
                        { title: 'End Location', data: [childDetail?.end_location.eircode, childDetail?.end_location.location_name] },
                    ]}
                    renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
                    renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                    keyExtractor={(item, index) => index}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.sectionHeaderBus}>Registered Buses</Text>
                    <TouchableOpacity style={styles.button} onPress={this.onPressAddToBus.bind(this)}>
                        <Text style={styles.textButton}> + </Text>
                    </TouchableOpacity>
                </View>



                <FlatList
                    data={this.state.childDetail?.buses}
                    renderItem={({ item }) =>
                        <View style={styles.busListItems}>
                            <Text style={styles.item}>{item.bus_name}</Text>
                            {/* <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                                {item.ride_id && <Button title='Ride' onPress={this.getListViewItem.bind(this, item)} />}
                                <Button title='Select' onPress={this.selectListViewItem.bind(this, item)} />
                            </View> */}
                        </View>

                    }

                    ItemSeparatorComponent={this.renderSeparator}
                    keyExtractor={(item, index) => index.toString()}
                />

                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={isBusListVisible}
                    swipeDirection={['up', 'left', 'right', 'down']}
                    onRequestClose={() => {
                        this.setState({ isBusListVisible: false })
                    }}>
                    <View style={styles.modal}>
                        <Text style={styles.sectionHeader}>Select a bus</Text>
                        <BusList {...this.props} childId={childId} closeModal={this.closeModal} />
                    </View>
                </Modal>

            </View >
        );
    }
}


const utils = {
    colors: { primaryColor: "blue" },
    dimensions: { defaultPadding: 12 },
    fonts: { largeFontSize: 18, mediumFontSize: 16, smallFontSize: 12 },
};

const styles = StyleSheet.create({
    modal: {
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: "#FFFAFA",
        height: '50%',
        width: '80%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#1E90FF',
        marginTop: 90,
        marginLeft: 40,
        padding: 20
        // alignItems: 'center',

    },


    modalText: {
        color: '#3f2949',
        marginTop: 30
    },
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

    buttonv: {
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

export default ChildDetail;