
import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";

import Spinner from "react-native-loading-spinner-overlay";

import APIKit, { setClientToken } from "../../shared/APIKit";

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from "react-native-gesture-handler";

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
  secureTextEntry: true,
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

  onPressRegister() {
    const { childName, childEmail, childStartLocation, childEndLocation, childUsername, childPassword, childPassword2 } = this.state;
    const payload = {
      child: {
        user: {
          name: childName,
          email: childEmail,
          username: childUsername,
          password: childPassword,
          password2: childPassword2
        },
        start_location: {eircode:childStartLocation},
        end_location: {eircode:childEndLocation}
      }
    };

    console.log(payload);

    const onSuccess = ({ data }) => {
      
      this.setState(initialState);
     
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
                value={this.state.childName}
                maxLength={256}
                placeholder="Enter child's name..."
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
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
                value={this.state.childEmail}
                maxLength={256}
                placeholder="Enter child's email..."
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={this.onEmailChange}
                underlineColorAndroid="transparent"
                placeholderTextColor="#999"
              />

              {this.getErrorMessageByField("email")}
            </View>
            <Text style={styles.text_footer}>Home</Text>

            <View style={styles.action}>

              <FontAwesome name="home" color="blue" size={20} />
              <TextInput
                style={styles.textInput}
                value={this.state.childStartLocation}
                maxLength={256}
                placeholder="Enter home eircode..."
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={this.onStartLocationChange}
                underlineColorAndroid="transparent"
                placeholderTextColor="#999"
              />

              {this.getErrorMessageByField("childStartLocation")}
            </View>
            <Text style={styles.text_footer}>End Location</Text>

            <View style={styles.action}>

              <FontAwesome name="building-o" color="blue" size={20} />
              <TextInput
                style={styles.textInput}
                value={this.state.childEndLocation}
                maxLength={256}
                placeholder="Enter school eircode..."
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={this.onEndLocationChange}
                underlineColorAndroid="transparent"
                placeholderTextColor="#999"
              />

              {this.getErrorMessageByField("childEndLocation")}
            </View>
            <Text style={styles.text_footer}>Username</Text>

            <View style={styles.action}>

              <FontAwesome name="user-o" color="blue" size={20} />
              <TextInput
                style={styles.textInput}
                value={this.state.childUsername}
                maxLength={256}
                placeholder="Enter child's username..."
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={this.onUsernameChange}
                underlineColorAndroid="transparent"
                placeholderTextColor="#999"
              />

              {this.getErrorMessageByField("username")}
            </View>
            <Text style={styles.text_footer}>Password</Text>

            <View style={styles.action}>

              <FontAwesome name="lock" color="blue" size={20} />
              <TextInput
                ref={(node) => {
                  this.passwordInput = node;
                }}
                style={styles.textInput}
                value={this.state.childPassword}
                maxLength={40}
                placeholder="Enter child's password..."
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

              <FontAwesome name="lock" color="blue" size={20} />
              <TextInput
                ref={(node) => {
                  this.password2Input = node;
                }}
                style={styles.textInput}
                value={this.state.childPassword2}
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
              {this.getErrorMessageByField("childPassword2")}

              {this.getNonFieldErrorMessage()}
            </View>

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signUp}
                onPress={this.onPressRegister.bind(this)}
              >
                <LinearGradient colors={['#1E90FF', '#1E90FF']} style={styles.signUp}>
                  <Text style={styles.textSign}>Register </Text>
                </LinearGradient>
              </TouchableOpacity>


              <TouchableOpacity
                style={styles.signUp}
                onPress={this.onPressSkip.bind(this)}
              >
                <LinearGradient colors={['#1E90FF', '#1E90FF']} style={styles.signUp}>
                  <Text style={styles.textSign}>Done</Text>
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
    marginTop: 25,
    fontSize: 18
  },

  footer: {
    flex: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  action: {
    flexDirection: 'row',
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 2
  },

  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },

  button: {
    alignItems: 'center',
    marginTop: 30,
    color: '#1E90FF',
  },

  signUp: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    color: '#1E90FF',
    marginTop: 5,
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
    paddingBottom: 10,
    marginTop: 0
  },

  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 50,
  },
};

export default ChildRegister;
