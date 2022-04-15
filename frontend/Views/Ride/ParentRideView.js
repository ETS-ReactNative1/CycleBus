
import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, Button, Alert, SectionList } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { decode } from "@mapbox/polyline";
import MapViewDirections from "react-native-maps-directions";
import { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import APIKit from "../../shared/APIKit";
import Icon from 'react-native-vector-icons/FontAwesome';
import GeoMarker from "./Marker";
import axios from "axios";

import BottomDrawer from "react-native-bottom-drawer-view";
import Spinner from "react-native-loading-spinner-overlay";
import { color } from "../Common/Colors";
import { keys } from "../../shared/Keys";

const TAB_BAR_HEIGHT = 49;


const galway = {
  latitude: 53.270962,
  longitude: -9.06269,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

class ParentRide extends Component {

  constructor(props) {
    super(props)
    this.state = {
      rideId: props.route.params.rideId,
      busId: props.route.params.busId,
      routeId: props.route.params.routeId,
      childId: props.route.params.childDetail.child_id,
      startLocation: {
        latitude: parseFloat(props.route.params.childDetail.start_location.latitude),
        longitude: parseFloat(props.route.params.childDetail.start_location.longitude),
      },
      endLocation: {
        latitude: parseFloat(props.route.params.childDetail.end_location.latitude),
        longitude: parseFloat(props.route.params.childDetail.end_location.longitude),
      },
      joinLocation: {
        latitude: parseFloat(props.route.params.childDetail.join_location.latitude),
        longitude: parseFloat(props.route.params.childDetail.join_location.longitude),
      },
      errors: {},
      isLoading: false,
      count: 0,
      isStarted: false,
      marshalLocation: null,
      isDrawerVisible: false,
      time: 0,
      stat: { ride: [], time: [], weather: [] },
      insidentMsg: "Swipe Up for More Information"
    };


    if (this.state.rideId != null) {

      this.ws = new WebSocket(keys.WS_URL + "/ws/ride/" + this.state.rideId + "/");

      this.ws.onopen = () => { };
      this.ws.onclose = (e) => { };
      this.ws.onerror = (e) => { };
      this.ws.onmessage = (e) => {
        const received = JSON.parse(e.data);
        const data = received.data;
        const type = received.type;
        if (type === 'loc') {
          this.setState({
            marshalLocation: {
              latitude: parseFloat(data.split(",")[0]),
              longitude: parseFloat(data.split(",")[1]),
            },
          });
        } else if (type == 'ins') {
          this.setState({
            insidentMsg: "Incident:" + data
          });
        }

      };
    }
  }

  ShowHideTimeComponentView = () => {

    if (this.state.isDrawerVisible == true) {
      this.getTravelTime()
    }
    else {
      this.setState({ isDrawerVisible: true })
      this.getTravelTime()
    }
  }


  componentDidMount() {

    const { busId, routeId } = this.state;

    const onSuccess = ({ data }) => {
      data = data.locations.map(({ location }) => ({ longitude: parseFloat(location.longitude), latitude: parseFloat(location.latitude) }));
      this.setState({
        start: data[0],
        waypoints: data.slice(1, -1),
        end: data[data.length - 1],
        isLoading: false
      });
    };
    const onFailure = (error) => {
      console.log(error)
      this.setState({ errors: error.response.data, isLoading: false });
    };

    // Show spinner when call is made
    this.setState({ isLoading: true });

    APIKit.get("bus/" + busId + "/route/" + routeId).then(onSuccess).catch(onFailure);


    // this.getLocation();
  }

  rideInfo = () => {
    this.setState({ isDrawerVisible: true })
    const { rideId, childId } = this.state;
    const onSuccess = ({ data }) => {
      this.setState({
        stat: data.stat
      })
    };
    
    const onFailure = (error) => {
      console.log(error)
      this.setState({ errors: error.response.data, isLoading: false });
    };

    APIKit.get("ride/" + rideId + '/?child=' + childId).then(onSuccess).catch(onFailure);
  }

  inform = async (status) => {
    const { childId, rideId } = this.state;
    const payload = [
      {
        status: status,
        attendee: childId
      }
    ];

    const onSuccess = ({ data }) => {
      console.log(data)

    };

    const onFailure = (error) => {
      console.log(error)
      this.setState({ errors: error, isLoading: false });
    };

    APIKit.put("ride/" + rideId + "/attendence/", { attendence: payload }).then(onSuccess).catch(onFailure);

  }

  onPressInform = () => {
    Alert.alert(
      "Participation",
      "Would your child join the bus today? ",
      [
        {
          text: "Yes",
          onPress: () => { this.inform("Coming") },
          style: "yes",
        },
        {
          text: "No",
          onPress: () => { this.inform("Not Coming") },
          style: "no",
        },
        {
          text: "Cancel",
          onPress: () => { },
          style: "cancel",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => { }
      },
    );

  }
  

  render() {
    const { insidentMsg, stat, isLoading, isDrawerVisible, marshalLocation, startLocation, endLocation, joinLocation } = this.state;

    return (
      <View style={styles.container}>
        <Spinner visible={isLoading} />

        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={galway}
          >
            <MapViewDirections
              origin={this.state.start}
              destination={this.state.end}
              waypoints={this.state.waypoints}
              lineDashPattern={[0]}
              apikey={keys.GOOGLE_MAP_KEY}
              strokeWidth={4}
              strokeColor="#111111"
              mode="BICYCLING"
              optimizeWaypoints={false}
            />
            {marshalLocation &&
              <GeoMarker
                key={Math.floor(Math.random() * 100) + 1}
                coords={marshalLocation}
                icon="chevron-circle-down"
                color="red"
                size={20}
              />
            }

            {startLocation &&
              <GeoMarker
                coords={startLocation}
                icon="home"
                color="red"
                size={20}
              />
            }

            {endLocation &&
              <GeoMarker
                coords={endLocation}
                icon="chevron-circle-down"

                size={20}
              />
            }

            {joinLocation &&
              <GeoMarker
                coords={joinLocation}
                icon="hand-stop-o"
                color="red"
                size={20}
              />
            }

          </MapView>
        </View>
        <BottomDrawer
          containerHeight={410}
          offset={50}
          onExpanded={() => this.rideInfo()}
          onCollapsed={() => this.setState({ isDrawerVisible: false })}
          startUp={false}
          borderRadius={100}
          roundedEdges={true}
        >
          <View>
            <View style={styles.msg}>
              <Icon name="caret-up" color={"#FFFFFF"} size={10} />
              <Text style={styles.msgTxt}>{insidentMsg}</Text>
            </View>
            <View style={styles.btnView}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.onPressInform.bind(this)}
                >
                  <Text style={styles.textButton}>Inform</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}

                >
                  <Text style={styles.textButton}>Call</Text>
                </TouchableOpacity>

              </View>
              <View style={styles.stat}>
                {isDrawerVisible && stat &&
                  <SectionList
                    sections={[
                      { title: 'Ride', data: stat.ride },
                      { title: 'Bus Arrival Time', data: stat.time },
                      { title: 'Weather', data: stat.weather },
                    ]}
                    renderItem={({ item }) => {
                      return <StatData item={item} />
                    }}
                    renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                    keyExtractor={(item, index) => index}
                  />
                }
              </View>
            </View>
          </View>
        </BottomDrawer>

      </View>
    );
  }
}

StatData = (item) => {
  const key = Object.keys(item.item)[0]
  const val = Object.values(item.item)[0]

  return(
  <View style={{ flexDirection: 'row' }}>
    <Text style={styles.statTxtKey}>{key}:</Text>
    <Text style={styles.statTxt}>{val}</Text>
  </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  stat: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E90FF',
    width: "80%"
  },
  item: {
    paddingTop: 5,
    paddingLeft: 10,
    fontSize: 18,
    height: 44,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 12,
    fontWeight: 'bold',
    color: "#fff",
    backgroundColor: '#1e90ff',
  },
  msg: {
    width: "100%",
    alignItems: 'center',
    backgroundColor: '#1E90FF',
  },
  msgTxt: {
    width: "100%",
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  button: {
    width: '40%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#1E90FF',
    elevation: 2,
    margin: 10,
  },
  textButton: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statTxt: {
    fontSize: 15,
    color: color.DARK_BLUE,
    margin: 2,
    fontWeight: "bold"
  },
  statTxtKey: {
    fontSize: 15,
    color: color.DARK_BLUE,
    margin: 2,
    
  },
  btnView: {
    alignItems: 'center',
    color: '#1E90FF',
  },
});

export default ParentRide;
