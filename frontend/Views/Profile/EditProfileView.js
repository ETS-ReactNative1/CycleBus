// const initialState = {
//   username: "", // Store `username` when user enters their username
//   password: "", // Store `password` when user enters their password
//   errors: {}, // Store error data from the backend here
//   isAuthorized: false, // If auth is successful, set this to `true`
//   isLoading: false, // Set this to `true` if You want to show spinner
// };
// <ROOT>/App/Views/Login/LoginView.js

import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";

import Spinner from "react-native-loading-spinner-overlay";

import APIKit, { setClientToken } from "../../shared/APIKit";

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

const initialState = {
  telephone_no1: "",
  telephone_no2: "",
  address: "",
  name: "",
  email: "",
  userId: "",
  errors: {},
  isLoading: false,

};

class EditProfile extends Component {
  state = initialState;

  constructor(props) {
    super(props)
    this.state = {
      userId: props.route.params.userID,
      name: props.route.params.userName,
      email: props.route.params.userEmail,
      address: props.route.params.userAddress,
      telephone_no1: props.route.params.telephoneNo1,
      telephone_no2: props.route.params.telephoneNo2
    };
  }

  componentWillUnmount() { }

  onNameChange = (name) => {
    this.setState({ name });
  };

  onEmailChange = (email) => {
    this.setState({ email });
  };

  onTelephone_no1Change = (telephone_no1) => {
    this.setState({ telephone_no1 });
  };

  onTelephone_no2Change = (telephone_no2) => {
    this.setState({ telephone_no2 });
  };

  onAddressChange = (address) => {
    this.setState({ address });
  };

  onPressSubmit() {
    const { userId, address, telephone_no1, telephone_no2 } = this.state;
    const payload = { profile: { address: address, telephone_no1: telephone_no1, telephone_no2: telephone_no2 } };

    const onSuccess = ({ data }) => {
      this.setState({ isLoading: false });
      this.props.navigation.push("Profile")
    };

    const onFailure = (error) => {
      this.setState({ errors: error.response.data, isLoading: false });
    };

    // Show spinner when call is made
    this.setState({ isLoading: true });

    APIKit.put("profile/" + userId + '/', payload).then(onSuccess).catch(onFailure);
    console.log(payload);
  }

  getNonFieldErrorMessage() {
    let message = null;
    const { errors } = this.state;
    if (errors.non_field_errors) {
      message = (
        <View style={styles.actionError}>
          {errors.non_field_errors.map((item) => (
            <Text style={styles.errorMessageTextStyle} key={item}>
              {item}
            </Text>
          ))}
        </View>
      );
    }
    return message;
  }

  getErrorMessageByField(field) {
    // Checks for error message in specified field
    // Shows error message from backend
    let message = null;
    if (this.state.errors[field]) {
      message = (
        <View style={styles.actionError}>
          {this.state.errors[field].map((item) => (
            <Text style={styles.errorMessageTextStyle} key={item}>
              {item}
            </Text>
          ))}
        </View>
      );
    }
    return message;
  }


  render() {
    const { isLoading } = this.state;

    return (
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>

            <View style={styles.header}>
              <Text style={styles.text_header}>Edit Profile</Text>
            </View>
          </View>

          <View style={[styles.footer]}>
            <Text style={styles.text_footer}>Name</Text>

            <View style={styles.action}>

              <FontAwesome name="user-o" color="blue" size={20} />

              <TextInput
                style={styles.textInput}
                value={this.state.name}
                maxLength={256}
                placeholder="Enter name..."
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={this.onNameChange}
                underlineColorAndroid="transparent"
                placeholderTextColor="#999"
                editable = {false}
              />

              {/* {this.getErrorMessageByField("name")} */}
            </View>

            <Text style={styles.text_footer}>Email</Text>

            <View style={styles.action}>

              <FontAwesome name="envelope-o" color="blue" size={20} />
              <TextInput
                style={styles.textInput}
                value={this.state.email}
                maxLength={256}
                placeholder="Enter email..."
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={this.onEmailChange}
                underlineColorAndroid="transparent"
                placeholderTextColor="#999"
                editable = {false}
              />

              {/* {this.getErrorMessageByField("email")} */}
            </View>

            <Text style={styles.text_footer}>Address</Text>

            <View style={styles.action}>

              <FontAwesome name="home" color="blue" size={20} />
              <TextInput
                style={styles.textInput}
                value={this.state.address}
                maxLength={256}
                placeholder="Enter address..."
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={this.onAddressChange}
                underlineColorAndroid="transparent"
                placeholderTextColor="#999"
              />

              {/* {this.getErrorMessageByField("address")} */}
            </View>

            <Text style={styles.text_footer}>Primary Telephone Number</Text>

            <View style={styles.action}>

              <FontAwesome name="phone" color="blue" size={20} />
              <TextInput
                style={styles.textInput}
                value={this.state.telephone_no1}
                maxLength={256}
                placeholder="Enter telephone number..."
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={this.onTelephone_no1Change}
                underlineColorAndroid="transparent"
                placeholderTextColor="#999"
              />

              {/* {this.getErrorMessageByField("telephone_no1")} */}
            </View>

            <Text style={styles.text_footer}>Secondary Telephone Number</Text>

            <View style={styles.action}>

              <FontAwesome name="phone" color="blue" size={20} />
              <TextInput
                style={styles.textInput}
                value={this.state.telephone_no2}
                maxLength={256}
                placeholder="Enter telephone number..."
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={this.onTelephone_no2Change}
                underlineColorAndroid="transparent"
                placeholderTextColor="#999"
              />

              {/* {this.getErrorMessageByField("telephone_no2")} */}
            </View>

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signUp}
                onPress={this.onPressSubmit.bind(this)}
              >
                <LinearGradient colors={['#1E90FF', '#1E90FF']} style={styles.signUp}>
                  <Text style={styles.textSign}>Submit </Text>
                </LinearGradient>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = {

  container: {
    flex: 1,
    backgroundColor: "#1E90FF",
  },

  text_footer: {
    color: { primaryColor: "blue" },
    marginTop: 30,
    fontSize: 18
  },

  footer: {
    flex: 8,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },

  action: {
    flexDirection: 'row',
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },

  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },

  button: {
    alignItems: 'center',
    marginTop: 60,
    color: '#1E90FF',
  },

  signUp: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    color: '#1E90FF',
  },

  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  errorMessageTextStyle: {
    color: "#db2828",
    textAlign: "center",
    fontSize: 12,
  },

  actionError: {
    flexDirection: 'row',
    paddingBottom: 5,
    marginBottom: 4,
    backgroundColor: "#fee8e6",
    padding: 8,
    borderRadius: 4,
  },

  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 100
  },

  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30
  },
};

export default EditProfile;
