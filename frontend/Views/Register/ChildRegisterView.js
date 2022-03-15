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

import Spinner from "react-native-loading-spinner-overlay";

import APIKit, { setClientToken } from "../../shared/APIKit";

const initialState = {
  childName: "",
  childUsername: "",
  childEmail: "",
  childPassword: "",
  childPassword2: "",
  childStartLocation: "",
  childEndLocation: "",
  errors: {},
  isLoading: false,
};

class ChildRegister extends Component {
  state = initialState;

  componentWillUnmount() { }

  onNameChange = (childName) => {
    this.setState({ childName });
  };

  onEmailChange = (childEmail) => {
    this.setState({ childEmail });
  };

  onStartLocationChange = (childStartLocation) => {
    this.setState({ childStartLocation });
  };

  onEndLocationChange = (childEndLocation) => {
    this.setState({ childEndLocation });
  };

  onUsernameChange = (childUsername) => {
    this.setState({ childUsername });
  };

  onPasswordChange = (childPassword) => {
    this.setState({ childPassword });
  };

  onPassword2Change = (childPassword2) => {
    this.setState({ childPassword2 });
  };

  onPressSkip() {
    this.props.navigation.navigate("Login")
  }

  onPressAdd() {
    //this.state = initialState
    this.setState(initialState)
  }


  onPressRegister() {
    const { childName, childEmail, childStartLocation,childEndLocation, childUsername, childPassword, childPassword2 } = this.state;
    const payload = { 
      child: { 
        user:{
          name: childName,
          email: childEmail,
          username: childUsername, 
          password: childPassword, 
          password2: childPassword2
        },
        start_location:childStartLocation,
        end_location:childEndLocation
      }
    };

    console.log(payload)
    const onSuccess = ({ data }) => {
      this.setState({ isLoading: false });
      //this.props.navigation.navigate("Login")
    };

    const onFailure = (error) => {
      this.setState({ errors: error.response.data, isLoading: false });
    };

    // Show spinner when call is made
    this.setState({ isLoading: true });

    APIKit.post("child/", payload).then(onSuccess).catch(onFailure);
  }

  getNonFieldErrorMessage() {
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

  render() {
    const { isLoading } = this.state;

    return (
      <View style={styles.containerStyle}>
        <Spinner visible={isLoading} />

        <View>
          <TextInput
            style={styles.input}
            value={this.state.childName}
            maxLength={256}
            placeholder="Enter child's name..."
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={(event) =>
              this.passwordInput.wrappedInstance.focus()
            }
            onChangeText={this.onNameChange}
            underlineColorAndroid="transparent"
            placeholderTextColor="#999"
          />

          {this.getErrorMessageByField("name")}

          <TextInput
            style={styles.input}
            value={this.state.childEmail}
            maxLength={256}
            placeholder="Enter child's email..."
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={(event) =>
              this.passwordInput.wrappedInstance.focus()
            }
            onChangeText={this.onEmailChange}
            underlineColorAndroid="transparent"
            placeholderTextColor="#999"
          />

          {this.getErrorMessageByField("email")}

          <TextInput
            style={styles.input}
            value={this.state.childStartLocation}
            maxLength={256}
            placeholder="Enter start location eircode..."
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={(event) =>
              this.passwordInput.wrappedInstance.focus()
            }
            onChangeText={this.onStartLocationChange}
            underlineColorAndroid="transparent"
            placeholderTextColor="#999"
          />

          {this.getErrorMessageByField("childStartLocation")}

          <TextInput
            style={styles.input}
            value={this.state.childEndLocation}
            maxLength={256}
            placeholder="Enter end location eircode..."
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={(event) =>
              this.passwordInput.wrappedInstance.focus()
            }
            onChangeText={this.onEndLocationChange}
            underlineColorAndroid="transparent"
            placeholderTextColor="#999"
          />

          {this.getErrorMessageByField("childEndLocation")}

          <TextInput
            style={styles.input}
            value={this.state.childUsername}
            maxLength={256}
            placeholder="Enter child's username..."
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={(event) =>
              this.passwordInput.wrappedInstance.focus()
            }
            onChangeText={this.onUsernameChange}
            underlineColorAndroid="transparent"
            placeholderTextColor="#999"
          />

          {this.getErrorMessageByField("username")}

          <TextInput
            ref={(node) => {
              this.passwordInput = node;
            }}
            style={styles.input}
            value={this.state.childPassword}
            maxLength={40}
            placeholder="Enter child's password..."
            onChangeText={this.onPasswordChange}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={this.onPressRegister.bind(this)}
            secureTextEntry
            underlineColorAndroid="transparent"
            placeholderTextColor="#999"
          />

          {this.getErrorMessageByField("password")}

          {this.getNonFieldErrorMessage()}

          <TextInput
            ref={(node) => {
              this.password2Input = node;
            }}
            style={styles.input}
            value={this.state.childPassword2}
            maxLength={40}
            placeholder="Reenter password..."
            onChangeText={this.onPassword2Change}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={this.onPressRegister.bind(this)}


            secureTextEntry
            underlineColorAndroid="transparent"
            placeholderTextColor="#999"
          />

          {this.getErrorMessageByField("childPassword2")}

          {this.getNonFieldErrorMessage()}

          <TouchableOpacity
            style={styles.registerButton}
            onPress={this.onPressRegister.bind(this)}
          >
            <Text style={styles.registerButtonText}>REGISTER</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={this.onPressAdd.bind(this)}
          >
            <Text style={styles.registerButtonText}>ADD NEW</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={this.onPressSkip.bind(this)}
          >
            <Text style={styles.registerButtonText}>DONE</Text>
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
  registerButton: {
    borderColor: utils.colors.primaryColor,
    borderWidth: 2,
    padding: utils.dimensions.defaultPadding,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  registerButtonText: {
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

export default ChildRegister;
