import React, { useEffect, useState } from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, StyleSheet } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { setClientToken } from "../shared/APIKit";
import ProfileIcon from "../Views/Common/Icon";
import { Seperator } from "../Views/Common/List";

export function DrawerContent(props) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const signOut = async () => {

        try {
            setClientToken(null);
            await AsyncStorage.removeItem("username");
            await AsyncStorage.removeItem("email");
            await AsyncStorage.removeItem("name");
        } catch (error) {
            console.log(error);
        }

        props.navigation.navigate("Login")
    }


    useEffect(() => {
        const fetchData = async () => {
            const username = await AsyncStorage.getItem('username')
            const email = await AsyncStorage.getItem('email')
            setUsername(username);
            setEmail(email);
        }
        fetchData()
    }, []);


    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <ProfileIcon name={username} />
                            <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                                <Title style={styles.title}>{username}</Title>
                                <Caption style={styles.caption}>{email}</Caption>
                            </View>
                        </View>
                    </View>
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome name="home" color="#1E90FF" size={20} />
                            )}
                            label="Home"
                            onPress={() => { props.navigation.navigate('DrawerParent', { screen: 'Home' }) }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome name="child" color="#1E90FF" size={20} />
                            )}
                            label="Children"
                            onPress={() => { props.navigation.navigate('DrawerParent', { screen: 'Children' }) }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome name="user" color="#1E90FF" size={20} />
                            )}
                            label="Profile"
                            onPress={() => { props.navigation.navigate('DrawerParent', { screen: 'Profile' }) }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome name="street-view" color="#1E90FF" size={22} />
                            )}
                            label="Marshal View"
                            onPress={() => { props.navigation.navigate('DrawerParent', { screen: 'Marshal View' }) }}
                        />

                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome name="question" color="#1E90FF" size={22} />
                            )}
                            label="Support"
                            onPress={() => { props.navigation.navigate('SupportScreen') }}
                        />
                    </Drawer.Section>

                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <FontAwesome name="sign-out" color="#1E90FF" size={22} />
                    )}
                    label="Sign Out"
                    onPress={() => { signOut() }}
                />
            </Drawer.Section>
        </View>
    )
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});