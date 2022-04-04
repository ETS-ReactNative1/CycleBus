import React, { Component } from "react";
import { View, ScrollView, Text, TouchableOpacity, Image, TextInput } from "react-native";


const ProfileDetails =() =>{
  return(
    <View style ={{alignItems:'center'}}>
                      
                          <Image source={require("../../assets/profile.png")} style ={{width:140, height:140, borderRadius:100, marginTop:-70}}></Image>
                           <Text style = {{fontSize :25 , fontWeight : 'bold', padding:10}}>Theresa Sean</Text>
                           <Text style = {{fontSize :15 , fontWeight : 'bold', padding:10}}>25.09.1985</Text>
                    </View>
  );
}
export default ProfileDetails;