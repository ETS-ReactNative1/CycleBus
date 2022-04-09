
import React, { Component } from "react";
import { FlatList, StyleSheet, View, Text, Alert, TouchableOpacity, Image, TextInput } from "react-native";
import { color } from "./Colors";
import ProfileIcon from "./Icon";

class FlatItem extends Component {

    render() {
        return (
            <View style={styles.field} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 2 }} >
                        <ProfileIcon name={this.props.title} />
                    </View>
                    <View style={{ flex: 10 }} >
                        <Text style={{ color: color.DARK_BLUE, fontSize: 18 }}>{this.props.title}</Text>
                        <Text style={{ color: color.DARK_BLUE, fontSize: 12 }}>{this.props.subtitle}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    flatText: {
        color: '#1E90FF',
        fontSize: 18,
        fontWeight: 'bold',
        margin: 5
    },
    field: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        width: '100%',
        padding: 20,
        borderRadius: 10,
        shadowOpacity: 80,
        elevation: 15,
        marginBottom: 5,
        shadowColor: color.LIGHT_BLUE
    }
})

class Seperator extends Component {
    render() {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#005fbb",
                }}
            />
        );
    }
}

export {Seperator,FlatItem}
