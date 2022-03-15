// const initialState = {
//   username: "", // Store `username` when user enters their username
//   password: "", // Store `password` when user enters their password
//   errors: {}, // Store error data from the backend here
//   isAuthorized: false, // If auth is successful, set this to `true`
//   isLoading: false, // Set this to `true` if You want to show spinner
// };
// <ROOT>/App/Views/Login/LoginView.js

import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import {Picker} from '@react-native-picker/picker';

import Spinner from "react-native-loading-spinner-overlay";

import APIKit, { setClientToken } from "../../shared/APIKit";

const initialState = {
  bus_name: "",
  country: "",
  area: "",
  child: "",
};

class BusRegister extends Component {
  state = initialState;

  componentWillUnmount() { }

  onBusNameChange = (bus_name) => {
    this.setState({ bus_name });
  };

  onCountryChange = (country) => {
    this.setState({ country });
  };

  onAreaChange = (area) => {
    this.setState({ area });
  };

  onChildChange = (chld) => {
    this.setState({ child });
  };

  onPressBusRegister() {
    const { bus_name, country, area, child } = this.state;
    const payload = { busRegister: { bus_name: bus_name, country: country, area: area, child: child } };

    const onSuccess = ({ data }) => {
      this.setState({ isLoading: false});
      this.props.navigation.navigate("HomeView")
    };

    const onFailure = (error) => {
      this.setState({ errors: error.response.data, isLoading: false });
    };

    // Show spinner when call is made
    this.setState({ isLoading: true });

    // APIKit.post("api/bus_register/", payload).then(onSuccess).catch(onFailure);
    this.props.navigation.navigate("Home")
  }

  getNonFieldErrorMessage() {
    // Return errors that are served in `non_field_errors`
    let message = null;
    const { errors } = this.state;
    if (errors.non_field_errors) {
      message = (
        <View style={styles.errorMessageContainerStyle}>
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
        <View style={styles.errorMessageContainerStyle}>
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

  // onSelectedValueChange = (value) => {
  //   this.setState({ selectedValue: value });
  // };

  render() {
    const { isLoading } = this.state;

    return (
      <View style={styles.containerStyle}>
        <Spinner visible={isLoading} />

          <View>
            <TextInput
              style={styles.input}
              value={this.state.bus_name}
              maxLength={256}
              placeholder="Select country..."
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={(event) =>
                this.passwordInput.wrappedInstance.focus()
              }
              onChangeText={this.onBusNameChange}
              underlineColorAndroid="transparent"
              placeholderTextColor="#999"
            />

            {/* {this.getErrorMessageByField("bus_name")} */}

            <TextInput
              style={styles.input}
              value={this.state.country}
              maxLength={256}
              placeholder="Select area..."
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={(event) =>
                this.passwordInput.wrappedInstance.focus()
              }
              onChangeText={this.onCountryChange}
              underlineColorAndroid="transparent"
              placeholderTextColor="#999"
            />

            {/* {this.getErrorMessageByField("country")} */}

            {/* <Picker
              style={styles.dropdown}
              selectedValue={selectedValue}
              style={{ height: 50, width: 150 }}
              onValueChange={this.onSelectedValueChange}
            >
              <Picker.Item label="Parent" value="parent" />
              <Picker.Item label="Child" value="child" />
              <Picker.Item label="Marshal" value="marshal" />
            </Picker> */}

            <TextInput
              style={styles.input}
              value={this.state.area}
              maxLength={256}
              placeholder="Select bus..."
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={(event) =>
                this.passwordInput.wrappedInstance.focus()
              }
              onChangeText={this.onAreaChange}
              underlineColorAndroid="transparent"
              placeholderTextColor="#999"
            />

            {/* {this.getErrorMessageByField("area")} */}

            <TextInput
              ref={(node) => {
                this.passwordInput = node;
              }}
              style={styles.input}
              value={this.state.child}
              maxLength={40}
              placeholder="Select child..."
              onChangeText={this.onChildChange}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              blurOnSubmit
              // onSubmitEditing={this.onPressBusRegister.bind(this)}
              secureTextEntry
              underlineColorAndroid="transparent"
              placeholderTextColor="#999"
            />
{/* 
            {this.getErrorMessageByField("child")}

            {this.getNonFieldErrorMessage()} */}

            <TouchableOpacity
              style={styles.busRegisterButton}
              onPress={this.onPressBusRegister.bind(this)}
            >
              <Text style={styles.busRegisterButtonText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
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
const styles = {
  innerContainer: {
    marginBottom: 32,
  },
  logotypeContainer: {
    alignItems: "center",
  },
  logotype: {
    maxWidth: 280,
    maxHeight: 100,
    resizeMode: "contain",
    alignItems: "center",
  },
  containerStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f6f6",
  },
  input: {
    height: 50,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: utils.dimensions.defaultPadding,
  },
  busRegisterButton: {
    borderColor: utils.colors.primaryColor,
    borderWidth: 2,
    padding: utils.dimensions.defaultPadding,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  busRegisterButtonText: {
    color: utils.colors.primaryColor,
    fontSize: utils.fonts.mediumFontSize,
    fontWeight: "bold",
  },
  errorMessageContainerStyle: {
    marginBottom: 8,
    backgroundColor: "#fee8e6",
    padding: 8,
    borderRadius: 4,
  },
  errorMessageTextStyle: {
    color: "#db2828",
    textAlign: "center",
    fontSize: 12,
  },
  dropdown: {
    height: 50,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: utils.dimensions.defaultPadding,
  },
};

export default BusRegister;
