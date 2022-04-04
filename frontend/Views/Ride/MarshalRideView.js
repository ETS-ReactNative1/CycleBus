import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  FlatList,
} from "react-native";

import APIKit from '../../shared/APIKit';
import * as Location from 'expo-location';

import { StyleSheet } from "react-native";
import GeoMarker from "./Marker";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const galway = {
  latitude: 53.270962,
  longitude: -9.06269,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const maxDistanceInKM = 0.1; // 100m distance


class MarshalRide extends Component {

  constructor(props) {
    super(props)
    this.state = {
      busId:props.route.params.busId,
      routeId:props.route.params.routeId,
      modalItem: null,
      rideId: null,
      count: 0,
      isStarted: false,
      isModalVisible: false,
      children: [],
      routeLocations: [],
      currentLoc: null,
      passedLoc: 0,
      start: null,
      waypoints: null,
      end: null,
      action: null,

    };

  }


  async onButtonClick() {
    const { busId, routeId } = this.state;

    const payload = { ride: { weather: "Sunny", wind_speed: 23.5, bus: busId, route: routeId } };

    const onSuccess = ({ data }) => {
      this.setState({
        isStarted: true,
        rideId: data.ride_id,
        routeLocations: data.route.locations,
      });

      this.ws = new WebSocket("ws://192.168.0.54:8000/ws/ride/" + data.ride_id + "/");
      this.ws.onopen = () => { this.getGeoLoc() };
      this.ws.onclose = (e) => { };
      this.ws.onerror = (e) => { console.log(e) };
      this.ws.onmessage = (e) => { };

    };

    const onFailure = (error) => {
      console.log(error);
      this.setState({ errors: error, isLoading: false });
    };

    APIKit.post("ride/", payload).then(onSuccess).catch(onFailure);

  }

  toggleModal() {
    this.setState({ isModalVisible: !this.state.isModalVisible })
  }



  async componentDidMount() {

    const { busId, routeId } = this.state;

    const onSuccess = ({ data }) => {

      filtered_data = data.locations.filter((x) =>
        x.location_name !== ""
      )

      this.setState({
        start: filtered_data[0],
        waypoints: filtered_data.slice(1, -1),
        end: filtered_data[filtered_data.length - 1],
        isLoading: false
      });
    };

    const onFailure = (error) => {
      this.setState({ errors: error.response.data, isLoading: false });
    };

    APIKit.get("bus/" + busId + "/route/" + routeId).then(onSuccess).catch(onFailure);
  }

  async endRide() {
    const { rideId } = this.state;
    this.setState({ isStarted: false })
    const payload = {};

    const onSuccess = ({ data }) => {
      console.log("ride end " + data)
    };

    const onFailure = (error) => {
      console.log(error)
      this.setState({ errors: error, isLoading: false });
    };

    APIKit.put("ride/" + rideId + "/end/", payload).then(onSuccess).catch(onFailure);

  }


  async getGeoLoc() {

    this.timer = setInterval(() => {
      if (this.state.isStarted) {
        try {
          Location.requestForegroundPermissionsAsync().then(res => console.log(""))

          Location.getCurrentPositionAsync({}).then((location) => {
            if (location) {
              this.ws.send(location.coords.latitude + ',' + location.coords.longitude);
              this.setState({
                currentLoc: location.coords,
              });
              this.getByProximity(location.coords);

            }

          }
          )
        } catch (error) {
          console.log(error);
        }
      }
    }, 3000);
  }

  distanceInKM(point1, point2) {
    var lat1 = point1.latitude;
    var lon1 = point1.longitude;
    var lat2 = point2.latitude;
    var lon2 = point2.longitude;

    var p = 0.017453292519943295;
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
      c(lat1 * p) * c(lat2 * p) *
      (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a));
  }

  getByProximity(currentLoc) {

    const { count, waypoints, end } = this.state;

    console.log("count", count , "waypoints", waypoints.length);

    if (count < waypoints.length) {

      var distance = this.distanceInKM(waypoints[count], currentLoc)
      if (distance < maxDistanceInKM) {

        if (!this.state.isModalVisible) {
          
          this.onMarkerClick(waypoints[count].location_id);
          this.setState({
            count: count + 1,
          });

        }
      }
      if ((distance > maxDistanceInKM) && (this.state.isModalVisible)) {

        this.onModalClose();
      }

    }

    else{
      this.onModalClose();
      var distance = this.distanceInKM(end, currentLoc);
      console.log(distance);

      if (distance < 0.05)  {
        
        
        this.endRide();
      }
    }

    // if((currentLoc == this.state.end.coords) && (distance < maxDistanceInKM)){
    //   this.setState({
    //     action : "ended"
    //   })
    //   this.onMarkerClick(this.state.waypoints[count].location_id);
    // }


  }

  getListViewItem = (item) => {
    this.props.navigation.navigate("MarshalRide");
  }

  onMarkerClick = (location_id) => {
    const { busId } = this.state;


    const onSuccess = ({ data }) => {

      this.setState({ children: data.data, isLoading: false });
    };

    const onFailure = (error) => {
      this.setState({ errors: error, isLoading: false });
    };

    APIKit.get("bus/" + busId + "/children/?start=" + location_id).then(onSuccess).catch(onFailure);
    this.setState({ isModalVisible: true });

  }


  onModalClose = () => {
    this.setState({ isModalVisible: false });
  }


  //https://betterprogramming.pub/how-to-highlight-and-multi-select-items-in-a-flatlist-component-react-native-1ca416dec4bc
  selectItem = child => {
    child.isSelected = child.isSelected ? false : true;

    const index = this.state.children.findIndex(
      item => child.user.id === item.user.id
    );

    this.state.children[index] = child;

    this.setState({
      children: this.state.children,
    });

  };


  render() {

    const { end, start, waypoints, currentLoc } = this.state;

    return (
      <View style={styles.container}>
        {!this.state.isStarted && <Button onPress={this.onButtonClick.bind(this)} title="Start" />}
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={galway}
          >
            {start && end && waypoints && <MapViewDirections
              origin={{ longitude: parseFloat(start.longitude), latitude: parseFloat(start.latitude) }}
              destination={{ longitude: parseFloat(end.longitude), latitude: parseFloat(end.latitude) }}
              waypoints={waypoints.map(({ longitude, latitude }) => ({ longitude: parseFloat(longitude), latitude: parseFloat(latitude) }))}
              lineDashPattern={[1]}
              apikey="AIzaSyCBiU4oYll98xI7IocNOONCCgvkJr3dTZA"
              strokeWidth={2}
              strokeColor="#111111"
              mode="BICYCLING"
              optimizeWaypoints={false}
            />}

            {currentLoc && <GeoMarker
              key={Math.floor(Math.random() * 100) + 1}
              coords={{ longitude: currentLoc.longitude, latitude: currentLoc.latitude }}
              icon="chevron-circle-down"
              onClick={this.onMarkerClick}
              color="red"
              size={20}
            />
            }

            {waypoints && waypoints.map((point, key) => {
              return <GeoMarker
                key={key}
                coords={{ longitude: point.longitude, latitude: point.latitude }}
                icon="chevron-circle-down"
                name={point.location_name}
                onClick={this.onMarkerClick}
                color="blue"
                size={15}
              />
            })}
          </MapView>
          {/* <FlatList
          data={this.state.dataSource}
          renderItem={({ item }) =>
            <Text style={this.state.currentLoc?.location_id === item.location_id ? styles.selected : styles.item}
              onPress={() => { this.onModalOpen(item) }} >{item.location_name}</Text>}
          ItemSeparatorComponent={this.renderSeparator}
          keyExtractor={(item, index) => index.toString()}
        /> */}
          <Modal
            animationType={"fade"}
            transparent={false}
            visible={this.state.isModalVisible}
            onRequestClose={() => { console.log("Modal has been closed.") }}>
            
              <View style={styles.modal}>
                <Text style={styles.text}>Mark Participants </Text>
                <FlatList
                  data={this.state.children}
                  renderItem={({ item }) =>
                    <Text style={item.isSelected ? styles.selected : styles.item} onPress={() => this.selectItem(item)} >{item.user.name}</Text>}
                  ItemSeparatorComponent={this.renderSeparator}
                  keyExtractor={(item, index) => index.toString()}
                />
                <Button title="Joined" onPress={() => { this.onJoined() }} />
                <Button title="Back" onPress={() => { this.onModalClose() }} />
              </View> 

              
          </Modal>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },

  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  selected: {
    backgroundColor: "#FA7B5F",
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MarshalRide;
