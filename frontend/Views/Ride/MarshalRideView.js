import React, { Component } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import APIKit from '../../shared/APIKit';
import * as Location from 'expo-location';

import { StyleSheet } from "react-native";
import GeoMarker from "./Marker";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { INCIDENTS } from "../Common/Incidents";
import { Picker } from "@react-native-picker/picker";

const galway = {
  latitude: 53.270962,
  longitude: -9.06269,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

class MarshalRide extends Component {

  constructor(props) {
    super(props)
    this.state = {
      busId: props.route.params.busId,
      routeId: props.route.params.routeId,
      rideId: -1,
      count: 0,
      isStarted: false,
      isModalVisible: false,
      children: [],
      routeLocations: [],
      currentPoint: null,
      currentLoc: null,
      start: null,
      waypoints: null,
      end: null,
      incident: INCIDENTS[0],
    };

  }


  async onStart() {
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


  onIncident() {
    const {incident} = this.state
    console.log(incident);
    this.ws.send(
      JSON.stringify(
        {
          type: 'ins',
          data: incident
        }
      )
    )
  }

  toggleModal() {
    this.setState({ isModalVisible: !this.state.isModalVisible })
  }

  async componentDidMount() {

    const { busId, routeId } = this.state;

    const onSuccess = ({ data }) => {

      this.setState({
        start: data.locations[0],
        waypoints: data.locations.slice(1, -1),
        end: data.locations[data.locations.length - 1],
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
              this.ws.send(
                JSON.stringify(
                  {
                    type: 'loc',
                    data: location.coords.latitude + ',' + location.coords.longitude
                  }
                )
              )
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

  async getFencedWayPoint(current) {
    const { count, waypoints } = this.state
    const init = Math.max(count - 2, 0)
    for (let i = init; i < waypoints.length; i++) {
      point1 = current
      point2 = waypoints[i].location
      var lat1 = point1.latitude;
      var lon1 = point1.longitude;
      var lat2 = point2.latitude;
      var lon2 = point2.longitude;

      var p = 0.017453292519943295;
      var c = Math.cos;
      var a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;

      const dist = 12742 * Math.asin(Math.sqrt(a));
      if (dist < 0.1) {
        this.setState({ count: i });
        return waypoints[i]
      }
    }
    return null
  }

  async getByProximity(currentLoc) {

    const { count, waypoints, end } = this.state;
    var fencedpoint = await this.getFencedWayPoint(currentLoc)
    if (fencedpoint != null) {
      if (fencedpoint.is_join_location && waypoints[count].location.location_id !== fencedpoint.location.location_id) {
        this.onMarkerClick(fencedpoint.location.location_id);
      }
      if (count == waypoints.length) {
        this.onModalClose();
        this.endRide();
      }
    }

  }

  getListViewItem = (item) => {
    this.props.navigation.navigate("MarshalRide");
  }

  onMarkerClick = async (location_id) => {
    const { routeId, rideId } = this.state;
    const onSuccess = ({ data }) => {
      this.setState({ children: data.data, isLoading: false, currentPoint: location_id });
      this.setState({ isModalVisible: true });
    };

    const onFailure = (error) => {
      this.setState({ errors: error, isLoading: false });
    };

    APIKit.get("route/" + routeId + "/children/" + location_id + "/?ride=" + rideId).then(onSuccess).catch(onFailure);

  }


  onJoined = async () => {
    const { children, rideId, currentLoc, currentPoint } = this.state;
    // this.setState({ isStarted: false })
    const payload = children.filter(
      (child) => { return child.isSelected }
    ).map((child) => {
      return {
        join_location: currentPoint,
        join_geo: currentLoc?.longitude + ',' + currentLoc?.latitude,
        status: "Joined",
        attendee: child.child.id
      }
    });

    const onSuccess = ({ data }) => {
      this.onModalClose();
    };

    const onFailure = (error) => {
      console.log(error)
      this.setState({ errors: error, isLoading: false });
    };

    APIKit.put("ride/" + rideId + "/attendence/", { attendence: payload }).then(onSuccess).catch(onFailure);

  }

  onModalClose = async () => {
    this.setState({ isModalVisible: false, children: [] });
  }


  //https://betterprogramming.pub/how-to-highlight-and-multi-select-items-in-a-flatlist-component-react-native-1ca416dec4bc
  selectItem = child => {
    child.isSelected = child.isSelected ? false : true;

    const index = this.state.children.findIndex(
      item => child.child.id === item.child.id
    );

    this.state.children[index] = child;

    this.setState({
      children: this.state.children,
    });

  };


  render() {

    const { end, start, waypoints, currentLoc, rideId, incident } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={galway}
          >
            {start && end && waypoints && <MapViewDirections
              origin={{ longitude: parseFloat(start.location.longitude), latitude: parseFloat(start.location.latitude) }}
              destination={{ longitude: parseFloat(end.location.longitude), latitude: parseFloat(end.location.latitude) }}
              waypoints={waypoints.map(({ location }) => ({ longitude: parseFloat(location.longitude), latitude: parseFloat(location.latitude) }))}
              lineDashPattern={[1]}
              apikey="AIzaSyCBiU4oYll98xI7IocNOONCCgvkJr3dTZA"
              strokeWidth={2}
              strokeColor="#111111"
              mode="BICYCLING"
              optimizeWaypoints={false}
            />}

            {currentLoc && <GeoMarker
              key={Math.floor(Math.random() * 1000) + 1}
              coords={{ longitude: currentLoc.longitude, latitude: currentLoc.latitude }}
              icon="map-marker"
              // onClick={this.onMarkerClick}
              color="red"
              size={20}
            />
            }

            {start && <GeoMarker
              key={Math.floor(Math.random() * 1000) + 1}
              coords={{ longitude: start.location.longitude, latitude: start.location.latitude }}
              icon="chevron-circle-down"
              onClick={this.onMarkerClick}
              location_id={start.location.location_id}
              color="blue"
              size={15}
            />
            }

            {end && <GeoMarker
              key={Math.floor(Math.random() * 1000) + 1}
              coords={{ longitude: end.location.longitude, latitude: end.location.latitude }}
              icon="chevron-circle-down"
              onClick={this.onMarkerClick}
              location_id={end.location.location_id}
              color="blue"
              size={15}
            />
            }

            {waypoints && waypoints.map((point, key) => {
              if (point.is_join_location == true) {
                return <GeoMarker
                  key={key}
                  coords={{ longitude: point.location.longitude, latitude: point.location.latitude }}
                  icon="chevron-circle-down"
                  name={point.location.location_name}
                  onClick={this.onMarkerClick}
                  location_id={point.location.location_id}
                  color="blue"
                  size={15}
                />
              }

            })}
          </MapView>
        </View>

        <View>
          {!this.state.isStarted && <Button onPress={this.onStart.bind(this)} title="Start" />}
          {this.state.isStarted &&
            <View style={styles.picker}>
              <Picker
                mode="dropdown"
                selectedValue={incident}
                onValueChange={(item) => {
                  this.setState({ incident: item });
                }}>
                {INCIDENTS.map((item, index) => {
                  return (<Picker.Item label={item} value={item} key={index} />)
                })}
              </Picker>
              <Button onPress={this.onIncident.bind(this)} title="Incident" />
            </View>}
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => { this.onModalClose() }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPressOut={() => { this.onModalClose() }}
          >

            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <FlatList
                  scrollEnabled={false}
                  data={this.state.children}
                  renderItem={({ item }) =>
                    <Text
                      style={item.isSelected ? styles.selected : styles.item}
                      onPress={() => this.selectItem(item)}
                    >
                      {item.child.name} - {item.status}
                    </Text>}
                  ItemSeparatorComponent={this.renderSeparator}
                  keyExtractor={(item, index) => index.toString()}
                />
                {rideId && <Button title="Add" onPress={() => { this.onJoined() }} />}
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  modal: {
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: "#FFFAFA",
    height: '50%',
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E90FF',
    marginTop: 90,
    marginLeft: 40,
    padding: 20
    // alignItems: 'center',

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
