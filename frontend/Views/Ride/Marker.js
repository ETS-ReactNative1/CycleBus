
import React, { Component } from "react";
import { Marker } from "react-native-maps";
import Icon from 'react-native-vector-icons/FontAwesome';

const galway = {
    latitude: 53.270962,
    longitude: -9.06269,
};

class GeoMarker extends Component {

    constructor(props) {
        super(props)
        this.state = {
            icon: props.icon,
            coords: props.coords||galway,
            size:props.size,
            name:props.name,
            color:props.color,
            location_id:props.location_id
        };
    }

    render() {
        const { icon, coords, location_id, name, size,color } = this.state;
        return (
            <Marker 
                coordinate={{ latitude: parseFloat(coords.latitude), longitude: parseFloat(coords.longitude) }} 
                onPress={() => { this.props.onClick(location_id) }}>
                <Icon name={icon} size={size} color={color} />
            </Marker>

        );
    }

}
export default GeoMarker;
