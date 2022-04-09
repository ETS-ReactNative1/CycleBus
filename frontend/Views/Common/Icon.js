import React, { Component } from "react";
import { FlatList, StyleSheet, View, Text, Alert, TouchableOpacity, Image, TextInput } from "react-native";

class ProfileIcon extends Component {
    render() {
        return (
            <View style={{
                backgroundColor: '#1E90FF',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                width: this.props.size|50,
                height: this.props.size|50,
            }}>
                <Text style={{ color: '#FFFFFF', fontSize: this.props.font|30 }}>{this.props.name?.charAt(0).toUpperCase()}</Text>
            </View>
        )
    }
}

export default ProfileIcon