import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";

import Spinner from "react-native-loading-spinner-overlay";

import APIKit, { setClientToken } from "../../shared/APIKit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {

  Platform,
  StyleSheet,
  StatusBar,
  Alert
} from 'react-native';


const initialState = {
  username: "",
  password: "",
  errors: {},
  isAuthorized: false,
  isLoading: false,
  secureTextEntry: true,
};

class Login extends Component {
  state = initialState;

  componentWillUnmount() { }

  onUsernameChange = (username) => {
    this.setState({ username });
  };

  onPasswordChange = (password) => {
    this.setState({ password });
  };

  onPressSignUp = () => {
    this.props.navigation.push("Register")
  };

  storeData = async (key,value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {

    }
  }

  onPressLogin() {
    const { username, password } = this.state;
    const payload = { user: { email: username, password: password } };

    const onSuccess = ({ data }) => {
      // Set JSON Web Token on success
      setClientToken(data.token);
      this.props.navigation.navigate("DrawerParent")

      this.setState({ isLoading: false, isAuthorized: true });
      this.storeData('username',data.username)
      this.storeData('email',data.email)
      this.storeData('name',data.name)

    };

    const onFailure = (error) => {
      console.log(error.response);
      this.setState({ errors: error.response.data, isLoading: false });
    };

    // Show spinner when call is made
    this.setState({ isLoading: true });

    APIKit.post("login/", payload).then(onSuccess).catch(onFailure);
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

  updateSecureTextEntry = () => {
    this.setState({ secureTextEntry: !this.state.secureTextEntry });
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
    const { isLoading, errors } = this.state;

    return (
      <View style={styles.container}>
        <Spinner visible={isLoading} />

        <View style={styles.header}>
          <Text style={styles.text_header_app}>CYCLE BUS </Text>
          
        </View>
        <Animatable.View animation="fadeInUpBig" style={[styles.footer]}>

          <Text style={styles.text_footer}>Email</Text>

          <View style={styles.action}>

            <FontAwesome name="envelope-o" color="blue" size={20} />
            <TextInput
              style={styles.textInput}
              value={this.state.username}
              maxLength={256}
              placeholder="Your Email"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              // onSubmitEditing={(event) =>
              //   this.passwordInput.wrappedInstance.focus()
              // }

              onChangeText={this.onUsernameChange}
              underlineColorAndroid="transparent"
              placeholderTextColor="#999"
            />

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
              placeholder="Your Password"
              onChangeText={this.onPasswordChange}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              blurOnSubmit
              onSubmitEditing={this.onPressLogin.bind(this)}
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
          </View>

          <TouchableOpacity>
            <Text style={styles.forgot_password}>Forgot password?</Text>
          </TouchableOpacity>
          
          <View style={styles.button}>
            {this.getErrorMessageByField("username")}
            {this.getErrorMessageByField("password")}
            {this.getNonFieldErrorMessage()}
            <TouchableOpacity
              style={styles.signIn}
              onPress={this.onPressLogin.bind(this)}
            >
              <LinearGradient colors={['#1E90FF', '#1E90FF']} style={styles.signIn}>
                <Text style={styles.textSign}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signUP}
              onPress={this.onPressSignUp.bind(this)}
            >
              <Text style={styles.textSignUP}>Sign Up</Text>
            </TouchableOpacity>

          </View>

        </Animatable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E90FF'
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    justifyContent: 'flex-start',
  },
  text_header_app: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: "center",
    textShadowColor : '#fff'
  },
  text_footer: {
    color: { primaryColor: "blue" },
    marginTop: 35,
    fontSize: 18
  },
  forgot_password: {
    color: '#1E90FF',
    marginTop: 15
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
  actionError: {
    flexDirection: 'row',
    paddingBottom: 5,
    marginBottom: 4,
    backgroundColor: "#fee8e6",
    padding: 8,
    borderRadius: 4,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 30,
    color: '#1E90FF',
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    color: '#1E90FF',
  },
  errorMessageTextStyle: {
    color: "#db2828",
    textAlign: "center",
    fontSize: 12,
  },
  errorMessageContainerStyle: {
    //marginBottom: 4,
    backgroundColor: "#fee8e6",
    //padding: 8,
    //borderRadius: 4,
  },
  signUP: {
    borderColor: '#1E90FF',
    borderWidth: 1,
    marginTop: 15,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSignUP: {
    color: '#1E90FF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  }
});

export default Login;
