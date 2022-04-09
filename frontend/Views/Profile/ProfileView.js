
import React, { Component, useReducer } from "react";
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Spinner from "react-native-loading-spinner-overlay";
import APIKit from "../../shared/APIKit";
import { color } from "../Common/Colors";
import ProfileIcon from "../Common/Icon";

const initialState = {
    name: "",
    email: "",
    address: "",
    telephone_no1: "",
    telephone_no2: "",
    user_id: "",
    errors: {},
    isLoading: false,
};

class Profile extends Component {
    state = initialState;

    async componentDidMount() {

        const onSuccess = ({ data }) => {

            this.setState({
                name: data.data.user.name,
                email: data.data.user.email,
                address: data.data.address,
                user_id: data.data.user.id,
                telephone_no1: data.data.telephone_no1,
                telephone_no2: data.data.telephone_no2,
            });
        };

        const onFailure = (error) => {
            console.log(error)
            this.setState({ errors: error.response.data, isLoading: false });
        };

        // Show spinner when call is made
        this.setState({ isLoading: true });

        APIKit.get("profile/").then(onSuccess).catch(onFailure);
    }

    onPressEditProfile() {

        const { user_id, name, email, address, telephone_no1, telephone_no2 } = this.state;
        this.props.navigation.navigate("EditProfile", { userID: user_id, userName: name, userEmail: email, userAddress: address, telephoneNo1: telephone_no1, telephoneNo2: telephone_no2 })

        // Show spinner when call is made
        this.setState({ isLoading: true });

    };

    render() {
        const { name, email, address, telephone_no1, telephone_no2 } = this.state;

        return (
            <View style={styles.main}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={styles.container}>
                        <Image source={require("../../assets/back.png")}
                            style={styles.image}></Image>
                    </View>
                    <View style={styles.components}>
                        <View style={styles.profileImage}>
                            <ProfileIcon name={name} size={65} font={50}/>
                        </View>
                        <Text style={styles.nameField}>{name}</Text>
                        <TouchableOpacity onPress={this.onPressEditProfile.bind(this)} >
                            <FontAwesome name="edit" color={color.MEDIUM_BLUE} size={20} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.components}>

                        <View style={styles.field}>
                            <FontAwesome name="envelope-o" color={color.MEDIUM_BLUE} size={20} />
                            <Text style={styles.fieldValues}> {email} </Text>
                        </View>

                        <View style={styles.field}>
                            <FontAwesome name="home" color={color.MEDIUM_BLUE} size={20} />
                            {!!address && <Text style={styles.fieldValues}> {address} </Text>}
                        </View>

                        <View style={styles.field}>
                            <FontAwesome name="phone" color={color.MEDIUM_BLUE} size={20} />
                            {!!telephone_no1 && <Text style={styles.fieldValues}> {telephone_no1}</Text>}
                        </View>

                        <View style={styles.field}>
                            <FontAwesome name="phone" color={color.MEDIUM_BLUE} size={20} />
                            {!!telephone_no2 && <Text style={styles.fieldValues}>{telephone_no2}</Text>}
                        </View>

                    </View>

                </ScrollView>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    main:{
        backgroundColor: 'white',
        height: "100%"

    },
    container: {
        width: '100%',
        backgroundColor: '#000',
        height: 150
    },
    image: {
        width: '100%',
        height: 170,
        backgroundColor:'white'
    },
    components: {
        flex: 1,
        padding: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 100,
        marginTop: -70
    },
    nameField: {
        fontSize: 25,
        fontWeight: 'bold',
        padding: 10
    },
    field: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        width: '80%',
        padding: 20,
        borderRadius: 10,
        shadowOpacity: 80,
        elevation: 15,
        marginBottom: 10,
        shadowColor: color.LIGHT_BLUE
    },
    fieldValues: {
        fontSize: 15,
        color: color.DARK_BLUE,
        fontWeight: 'bold',
        marginLeft: 10
    },

    button: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        width: '90%',
        padding: 20,
        paddingBottom: 22,
        borderRadius: 10,
        shadowOpacity: 80,
        elevation: 15,
        marginTop: 20,
        marginBottom: 40,
        backgroundColor: '#1E90FF'
    },
    buttonText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10
    },
});
export default Profile;
