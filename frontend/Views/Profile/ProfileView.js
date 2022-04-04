
import React, { Component } from "react";
import { View, ScrollView, Text, TouchableOpacity, Image, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

class Profile extends Component {

    render() {
        
        return (
            <View>
                <ScrollView showsVerticalScrollIndicator = {false}>
                    <View style ={{ width:'100%',backgroundColor:'#000',height:150}}>
                      
                          <Image source={require("../../assets/backimage.jpg")}
                          style={{width:'100%', height:150}}></Image>
                           
                          
                    </View>
                    <View style ={{alignItems:'center'}}>
                      
                          <Image source={require("../../assets/profile.png")} style ={{width:140, height:140, borderRadius:100, marginTop:-70}}></Image>
                           <Text style = {{fontSize :25 , fontWeight : 'bold', padding:10}}>Theresa Sean</Text>
                           <Text style = {{fontSize :15 , fontWeight : 'bold', padding:10}}>25.09.1985</Text>
                    </View>
                    <View style ={{alignItems:'center'}}>
                    <View style ={{alignItems:'center', flexDirection :'row', justifyContent : 'center', backgroundColor : '#fff',
                                   width:'90%', padding:20, paddingBottom :22, borderRadius : 10, shadowOpacity:80, elevation :15, marginTop :20}}>
                      
                      <Image source={require("../../assets/email.png")} style ={{width:20, height:20}}></Image>
                       <Text style = {{fontSize :15 ,color:'#818181', fontWeight : 'bold', marginLeft:10}}>theresa@email.com</Text>
                       
                    </View>
                    <View style ={{alignItems:'center', flexDirection :'row', justifyContent : 'center', backgroundColor : '#fff',
                                   width:'90%', padding:20, paddingBottom :22, borderRadius : 10, shadowOpacity:80, elevation :15, marginTop :20}}>
                      
                      <Image source={require("../../assets/home.png")} style ={{width:20, height:20}}></Image>
                      <Text style = {{fontSize :15 ,color:'#818181', fontWeight : 'bold', marginLeft:10}}>NewCastle, Galway</Text>
                       
                    </View>
                    <View style ={{alignItems:'center', flexDirection :'row', justifyContent : 'center', backgroundColor : '#fff',
                                   width:'90%', padding:20, paddingBottom :22, borderRadius : 10, shadowOpacity:80, elevation :15, marginTop :20}}>
                      
                      <Image source={require("../../assets/phone.png")} style ={{width:20, height:20}}></Image>
                      <Text style = {{fontSize :15 ,color:'#818181', fontWeight : 'bold', marginLeft:10}}>08925555555</Text>
                       
                    </View>
                    <View style ={{alignItems:'center', flexDirection :'row', justifyContent : 'center', backgroundColor : '#fff',
                                   width:'90%', padding:20, paddingBottom :22, borderRadius : 10, shadowOpacity:80, elevation :15, marginTop :20}}>
                      
                      <Image source={require("../../assets/phone.png")} style ={{width:20, height:20}}></Image>
                      <Text style = {{fontSize :15 ,color:'#818181', fontWeight : 'bold', marginLeft:10}}>0892666666</Text>
                       
                    </View>
                    <TouchableOpacity style ={{alignItems:'center', flexDirection :'row', justifyContent : 'center', backgroundColor : '#fff',
                                   width:'90%', padding:20, paddingBottom :22, borderRadius : 10, shadowOpacity:80, elevation :15, marginTop :20,
                                   marginBottom : 40, backgroundColor:'#1E90FF'}}>
                      
                       <Text style = {{fontSize :15 ,color:'#fff', fontWeight : 'bold', marginLeft:10}}>Logout</Text>
                       
                    </TouchableOpacity>
                    </View>
                </ScrollView>

            </View>

        );
    }

}
export default Profile;
