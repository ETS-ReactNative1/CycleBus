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
import { Picker } from '@react-native-picker/picker';

import Spinner from "react-native-loading-spinner-overlay";

import APIKit, { setClientToken } from "../../shared/APIKit";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from "react-native-gesture-handler";

const initialState = {
  name: "",
  email: "",
  username: "",
  password: "",
  password2: "",
  errors: {},
  isAuthorized: false,
  isLoading: false,
  selectedValue: 0,
  secureTextEntry: true,
};

class Register extends Component {
  state = initialState;

  componentWillUnmount() { }

  onNameChange = (name) => {
    this.setState({ name });
  };

  onEmailChange = (email) => {
    this.setState({ email });
  };

  onUsernameChange = (username) => {
    this.setState({ username });
  };

  onPasswordChange = (password) => {
    this.setState({ password });
  };

  onPassword2Change = (password2) => {
    this.setState({ password2 });
  };

  onPressRegister() {
    const { name, email, username, password, password2 } = this.state;
    const payload = { user: { name: name, email: email, username: username, password: password, password2: password2 } };

    console.log(payload)

    const onSuccess = ({ data }) => {
      this.setState({ isLoading: false });
      setClientToken(data.token);
      this.props.navigation.navigate("ChildRegister")
    };

    const onFailure = (error) => {
      this.setState({ errors: error.response.data, isLoading: false });
    };

    // Show spinner when call is made
    this.setState({ isLoading: true });

    APIKit.post("api/register/", payload).then(onSuccess).catch(onFailure);
  }

  getNonFieldErrorMessage() {
    // Return errors that are served in `non_field_errors`
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

  updateSecureTextEntry = () => {
    this.setState({ secureTextEntry: !this.state.secureTextEntry });
  }

  render() {
    const { isLoading } = this.state;

    return (
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>

            <View style={styles.header}>
              <Text style={styles.text_header}>Register</Text>
            </View>
          </View>

          <View style={styles.footer}>

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
                onSubmitEditing={(event) =>
                  this.passwordInput.wrappedInstance.focus()
                }
                onChangeText={this.onNameChange}
                underlineColorAndroid="transparent"
                placeholderTextColor="#999"
              />

              {this.getErrorMessageByField("name")}
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
                onSubmitEditing={(event) =>
                  this.passwordInput.wrappedInstance.focus()
                }
                onChangeText={this.onEmailChange}
                underlineColorAndroid="transparent"
                placeholderTextColor="#999"
              />

              {this.getErrorMessageByField("email")}

            </View>
            <Text style={styles.text_footer}>Username</Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color="blue" size={20} />
              <TextInput
                style={styles.textInput}
                value={this.state.username}
                maxLength={256}
                placeholder="Enter username..."
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
            </View>
            <Text style={styles.text_footer}>Password</Text>
            <View style={styles.action}>
              <Feather name="lock" color="blue" size={20} />


              <TextInput
                ref={(node) => {
                  this.passwordInput = node;
                }}
                style={styles.textInput}
                value={this.state.password}
                maxLength={40}
                placeholder="Enter password..."
                onChangeText={this.onPasswordChange}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={this.onPressRegister.bind(this)}
                secureTextEntry={this.state.secureTextEntry ? true : false}
                underlineColorAndroid="transparent"
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={this.updateSecureTextEntry}
              >
                {this.state.secureTextEntry ?
                  <Feather
                    name="eye-off"
                    color="grey"
                    size={20}
                  />
                  :
                  <Feather
                    name="eye"
                    color="grey"
                    size={20}
                  />
                }
              </TouchableOpacity>
              {this.getErrorMessageByField("password")}

              {this.getNonFieldErrorMessage()}
            </View>
            <Text style={styles.text_footer}>Confirm Password</Text>
            <View style={styles.action}>
              <Feather name="lock" color="blue" size={20} />

              <TextInput
                ref={(node) => {
                  this.password2Input = node;
                }}
                style={styles.textInput}
                value={this.state.password2}
                maxLength={40}
                placeholder="Reenter password..."
                onChangeText={this.onPassword2Change}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={this.onPressRegister.bind(this)}
                secureTextEntry={this.state.secureTextEntry ? true : false}
                underlineColorAndroid="transparent"
                placeholderTextColor="#999"
              />

              <TouchableOpacity
                onPress={this.updateSecureTextEntry}
              >
                {this.state.secureTextEntry ?
                  <Feather
                    name="eye-off"
                    color="grey"
                    size={20}
                  />
                  :
                  <Feather
                    name="eye"
                    color="grey"
                    size={20}
                  />
                }
              </TouchableOpacity>

              {this.getErrorMessageByField("password2")}

              {this.getNonFieldErrorMessage()}
            </View>

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signUp}
                onPress={this.onPressRegister.bind(this)}
              >
                <LinearGradient colors={['#1E90FF', '#1E90FF']} style={styles.signUp}>
                  <Text style={styles.textSign}>Next</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </View >
    );
  }
}

// Define styles here
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
    flex: 3,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 30
  },

  action: {
    flexDirection: 'row',
    marginTop: 10,
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
    marginTop: 50,
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

  containerStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f6f6",
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
    fontSize: 30,
    marginTop: 65,
  },
};

export default Register;
