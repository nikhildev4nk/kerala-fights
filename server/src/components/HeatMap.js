import React, { Component } from 'react'; 
import { connect } from 'react-redux';
import {NavLink,withRouter,Switch,Route} from 'react-router-dom';
import {HeaderSection,Reveal} from './Helper';
import axios from 'axios';   
import AppMessage from './AppMessage.js';

import DetailsModal from './DetailsModal';
class HeatMap extends Component {
    constructor(arg){
        super(arg);
        this.state = {
            modal:null
        }
        this.map = null;
        this.markerCluster = null;
        this.markers =[];
    }

    fetchData(){

        if(this.markerCluster){ 
            this.markerCluster.removeMarkers(this.markers);
            this.markerCluster.repaint();
        }

        this.markers.map(item =>{
            item.setMap(null);
        });
        this.markers = [];
        const {status = 'new'} = this.props.match.params;
        axios.get(`/api/v1/rescue-list?location=1&per_page=3000&status=${status}`).then(resp => {
            resp.data.data.list.map(item => {
                let lat = null,lng = null;
                if(item.latLng && item.latLng.coordinates && item.latLng.coordinates.length == 2) {
                    lat = item.latLng.coordinates[0], 
                    lng = item.latLng.coordinates[1]
                } else if (item.json.location){
                    lat = parseFloat(""+item.json.location.lat);
                    lng = parseFloat(""+item.json.location.lon);
                }
                var marker = new google.maps.Marker({
                    position: {
                        lat:lat,
                        lng:lng
                    },
                    map: this.map
                }); 
                this.attachInfo(marker, item);
                this.markers.push(marker); 
            });

            this.markerCluster = new MarkerClusterer(this.map, this.markers, {
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            });
            
        });
    }
    hideModal(msg){
        this.setState({modal:null})
    }

    componentDidUpdate(nextProps,nextState){
        if (nextProps.match.params.status != this.props.match.params.status){
            this.fetchData();
        }
    }

    showDetailModal(item){
        this.setState({modal:<Reveal onClose={this.hideModal.bind(this)}>
            <DetailsModal item={item}   hideModal={this.hideModal.bind(this)} 
            />
            </Reveal>});
    }

    attachInfo(marker,item){

        marker.addListener('click', () => {
           this.showDetailModal(item);
        });
    }
    componentDidMount () {
        this.initialiseGMap(10.10,76.65);
    }
    initialiseGMap (latitude,longitude) {
        if (!this.map){
            this.map = new google.maps.Map(document.getElementById('google-map'), {
                center: {lat: latitude, lng: longitude},
                zoom: 5,
                zoomControl: true,
                scaleControl:true,
                styles: [{
                    featureType: 'poi',
                    stylers: [{ visibility: 'off' }]  // Turn off points of interest.
                }, {
                    featureType: 'transit.station',
                    stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
                }],
            }); 
            setTimeout(()=>{
                this.fetchData();
            },2000)
        
        }  
    }
    render() {
        return <div>
            <AppMessage />
            <HeaderSection authUser={this.props.authUser}>
            <div className="w3-bar w3-teal  kf-top-bar">
                <div className="w3-right "> 
                    {this.props.statusList.map(item=>{
                            return <NavLink key={item.key}
                            activeClassName="active" 
                            className={`w3-bar-item w3-button w3-small ${item.cls}`}
                            to={`/heatmap/${item.key}`}>
                                {item.title}
                        </NavLink>
                    })} 
                </div>
            </div>
            </HeaderSection>
            {this.state.modal}
            <div id="google-map" style={{width:"100vw",height:"90vh"}}></div>
        </div>
    }
}

function mapStateToProps(state) {  
    return {
        statusList:state.statusList,
       authUser:state.authUser
    }
}

export default connect(mapStateToProps)(withRouter(HeatMap))