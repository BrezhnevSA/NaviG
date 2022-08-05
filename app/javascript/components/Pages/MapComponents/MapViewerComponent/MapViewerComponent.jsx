import React, { Component } from 'react';
import { connect }          from "react-redux";
import queryString          from 'query-string';
import ScrollContainer      from 'react-indiana-drag-scroll';
import { toast }            from 'react-toastify';

import ObjectItem   from '../Elements/ObjectComponent';
import LocationItem from '../Elements/LocationComponent';
import InfoSidebar  from '../MapViewerComponent/InfoSidebarComponent';

import { getLocationTypes } from '../../../../actions/LocationTypesActions';
import { getObjectTypes } from '../../../../actions/ObjectTypesActions';
import { 
    getFloorDetails, 
    selectNewElement,
    setSidebarMarkUpState,
    setShowObjects,
    setShowLocationNames,
    setShowDsLight,
    setShowObjectsNames,
}  from '../../../../actions/FloorActions';

import { getAvailableDates } from '../../../../actions/AvailableDatesForParkingActions';
import { getPageOfBookings } from '../../../../actions/BookingsActions';

import * as settings from '../../../../constants/AppSettings';

import Loading from '../../Loading/LoadingComponent';

import LocalizedStrings from 'react-localization';
import LegendSidebar from './LegendSidebarComponent';
import "./MapViewerComponent.css";

import * as emp_sts from '../../../../constants/EmployeeStatuses';

let strings = new LocalizedStrings({
    en:{
        comment:"Comment",
        markup: "Filter",
        legend: "Legend",
        show_ds_light_filter: "Enabling / disabling available places is in the filter"
    },
    ru: {
        comment:"Комментарий",
        markup: "Фильтр",
        legend: "Легенда",
        show_ds_light_filter: "Включение/отключение доступных мест есть в фильтре"
    },
    de: {
        comment:"Comment",
        markup: "Filter",
        legend: "Legende",
        show_ds_light_filter: "Das Aktivieren / Deaktivieren verfügbarer Orte befindet sich im Filter"
    }
});

class MapViewer extends Component {

    notify = (text) => {
        toast.success(text, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        let parsed_params = queryString.parse(this.props.location.search);
        // let hash = !!this.props.location.hash ? this.props.location.hash.replace('#', '') : null;

        this.state = {
            current_floor_id:    this.props.match.params.id,
            // floor_breadcrumbs:   null,
            zoom:                100,
            firstLoad:           true,
            object_id:           parsed_params.object_id,
            // object_name:         hash,
            opened_by_hash:      false,
            location_id:         parsed_params.location_id,
            objScale:            settings.OBJ_DEFAULT_SCALE,
            legendSidebarShow:   false
        }
    }

    componentDidMount() {
        const parsed_params        = queryString.parse(this.props.location.search);
        const object_id            = parsed_params.object_id;
        const book_from            = parsed_params.book_from;
        const book_to              = parsed_params.book_to;
        const location_id          = parsed_params.location_id;
        // const hash                 = this.state.object_name;
        const { floor, user }      = this.props;
        const { current_floor_id } = this.state;
        const show_object_items    = localStorage.getItem("show_object_items");
        const show_location_names  = localStorage.getItem("show_location_names");
        const show_ds_light        = localStorage.getItem("show_ds_light");
        const show_object_names    = localStorage.getItem("show_object_names");

        this.props.getFloorDetails(current_floor_id);

        this.props.getAvailableDates();

        if ((object_id !== undefined) && floor.object_items) {
            this.props.selectNewElement({ 
                data: {
                    data: floor.object_items.find(
                        (data) => parseInt(data.id) === parseInt(object_id)
                    ),
                    type: 'object'
                }
            });
        } else if (location_id !== undefined && floor.locations) {
            this.props.selectNewElement({ 
                data: {
                    data: floor.locations.find(
                        (data) => parseInt(data.id) === parseInt(location_id)
                    ),
                    type: 'location'
                }
            });
        }

        if (show_object_items != '') {
            this.props.setShowObjects(show_object_items == "true");
        }

        if (show_location_names != '') {
            this.props.setShowLocationNames(show_location_names == "true");
        }
        if ((!show_ds_light == 'true' || !show_ds_light) && user && user.user && !user.isFetching && (user.user.data.work_type == "H" ||
        !user.user.data.work_type || user.user.data.status == emp_sts.MATERNITY)) {
            this.props.setShowDsLight("true");
            this.notify(strings.show_ds_light_filter);
        } else if (user && user.user && !user.isFetching) {
            this.props.setShowDsLight(show_ds_light == "true");
        }

        if (show_object_names != '') {
            this.props.setShowObjectsNames(show_object_names == "true");
        }

        this.props.getLocationTypes();

        this.props.getObjectTypes();

        this.props.getPageOfBookings(0, 0, [ { field: "floor_id", value: current_floor_id } ], "", "");
    }

    componentDidUpdate(prevProps) {
        let { lang, match } = this.props;   
        if (prevProps.match.params.id !== match.params.id) {            
            this.setState({ firstLoad: true })
            this.props.getFloorDetails(match.params.id);
            this.props.getAvailableDates();
        }
        if (this.props.floor !== prevProps.floor && !this.props.floor.is_Fetching) {

            let objScale = this.state.objScale;
            let bgscale = this.state.bgscale;
            let bgurl = this.state.bgurl;
            let bgoriginalsize = this.state.bgoriginalsize;
            if (!!this.props.floor.floor.parameters) {
                const params = JSON.parse(this.props.floor.floor.parameters);
                if (!!params['objScale']) {
                    objScale = params['objScale'];
                }
                if (!!params['bgscale']) {
                    bgscale = params['bgscale'];
                }
                if (!!params['bgurl']) {
                    bgurl = params['bgurl'];
                }
                if (!!params['bgoriginalsize']) {
                    bgoriginalsize = params['bgoriginalsize'];
                }
            }

            this.setState({
                objScale: objScale,
                bgscale: bgscale,
                bgurl: bgurl,
                bgoriginalsize: bgoriginalsize,
            });

            let hash = !!this.props.location.hash ? this.props.location.hash.replace('#', '') : null;
            if (!!hash && !this.state.opened_by_hash) {
                const named_object = this.props.floor.object_items.find(
                    (data) => data.name == hash
                )
                if (!!named_object && 
                        (!!this.props.floor.selected_item ? //if there is selected item - check that selected and object from hash is different
                            this.props.floor.selected_item['id'] != named_object['id'] : true)) {
                    this.props.selectNewElement({ 
                        data: {
                            data: named_object,
                            type: 'object'
                        }
                    });
                    this.setState({
                        opened_by_hash: true
                    });
                    
                }
            }
        }
    }

    componentWillUpdate(nextProps, nextState) {
        let { floor }     = this.props;
        let { 
            firstLoad,
            object_id, 
            location_id
        }                 = this.state;
        let parsed_params = queryString.parse(this.props.location.search);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        if (!floor.is_Fetching && floor.locations && floor.object_items &&
            floor.locations.length > 0 && floor.object_items.length > 0 ) {
            
            if ((parsed_params.object_id !== undefined && firstLoad) || 
                (object_id !== parsed_params.object_id && parsed_params.object_id !== undefined) ||
                (object_id !== parsed_params.object_id && parsed_params.object_id !== undefined &&
                    parsed_params.book_from !== undefined && parsed_params.book_to !== undefined)) {    
                this.props.selectNewElement({ 
                    data: {
                        data: floor.object_items.find(
                            (data) => data.id == parsed_params.object_id
                        ),
                        type: 'object'
                    }
                });
                this.props.getLocationTypes();
                this.props.getObjectTypes();
                this.setState({ 
                    firstLoad:   false,
                    object_id:   parsed_params.object_id,
                    location_id: undefined
                });
            } else if ((parsed_params.location_id !== undefined && firstLoad) ||
                        (location_id !== parsed_params.location_id && parsed_params.location_id !== undefined)) { 
                this.props.selectNewElement({ 
                    data: {
                        data: floor.locations.find(
                            (data) => data.id == parsed_params.location_id
                        ),
                        type: 'location'
                    }
                });
                this.props.getLocationTypes();
                this.props.getObjectTypes();
                this.setState({ 
                    firstLoad:   false,
                    location_id: parsed_params.location_id,
                    object_id:   undefined
                });
            }
        }
    }

    zoomMap(e) {
        
        if ((e.deltaY < 0) && (this.state.zoom < 180)) {
            this.setState({zoom: (this.state.zoom + 20)})
        }
        if ((e.deltaY > 0) && (this.state.zoom > 60)) {
            this.setState({zoom: (this.state.zoom - 20)})
        }
        e.stopPropagation();
    }

    getMinMaxDots(dots) {
        let dots_array = dots;

        if (!Array.isArray(dots_array) && !!dots_array) {

            // nil sometimes get here, have no idea why
            dots_array = dots_array.replaceAll('nil,','');
            dots_array = dots_array.replaceAll(', nil','');
            dots_array = dots_array.replaceAll('nil','');
            dots_array = dots_array.split("=>").join(":")
            
            dots_array = JSON.parse(dots_array);
        }

        const firstItem = dots_array.filter(d => typeof d !== undefined).shift();

        if (!!firstItem) {
            const min_x = dots_array.reduce((min, p) => p.x < min ? p.x : min, firstItem['x']);
            const max_x = dots_array.reduce((max, p) => p.x > max ? p.x : max, firstItem['x']);

            const min_y = dots_array.reduce((min, p) => p.y < min ? p.y : min, firstItem['y']);
            const max_y = dots_array.reduce((max, p) => p.y > max ? p.y : max, firstItem['y']);

            return {min_x: min_x, max_x: max_x, min_y: min_y, max_y: max_y};
        }
        else {
            return {min_x: 0, max_x: 0, min_y: 0, max_y: 0};
        }
        
    }

    handleLegendSideBarOpen = () => {
        this.setState({legendSidebarShow: !this.state.legendSidebarShow});
    };

    switchOffLegendSidebar = () => {
        this.setState({legendSidebarShow: false})
    }

    render() {
        let { floor } = this.props;
        let objScale = this.state.objScale;
        let current_zoom = this.state.zoom;

        // floor_breadcrumbs

        if (!floor.is_Fetching && !!floor.object_items > 0  && !!floor.locations) {
            
            return (
                <div className="container-fluid correct-padding-on-no-footer-page">
                    <div className="row">
                        <div id="mapViewer"
                            className={(!!floor.selected_type 
                                && (floor.selected_type !== 'location') ? "with-sidebar" : "") + " scroller"}> 

                            <div className="open_sidebar_button">
                                <button 
                                    className="button-magenta button-simple" 
                                    onClick={() => { this.setState({legendSidebarShow: true})}}
                                >{strings.legend}</button>
                            </div>
                            <div className="map-viewer-legend-sidebar-button open_sidebar_button">
                                <button 
                                    className="button-magenta button-simple" 
                                    onClick={() => { this.props.setSidebarMarkUpState(true); }}
                                >{strings.markup}</button>
                            </div>
                            <ScrollContainer className="scroll-container">
                                <div id="mapZoom"
                                onWheel={(e) => this.zoomMap(e)}
                                style={{
                                    zoom: this.state.zoom + "%"
                                }} >
                                    <div id="viewerBG">
                                        <img alt="" src={`${this.state.bgurl}?${Math.random()}`} width={(this.state.bgoriginalsize * this.state.bgscale) / 100} />
                                    </div>   
                                    <svg 
                                        id="locations-layer-viewer"
                                        width={settings.EDITOR_SVG_SIZE_X}
                                        height={settings.EDITOR_SVG_SIZE_Y} >

                                        { floor.locations.length > 0 ? 
                                            <>
                                                <LocationItem
                                                    viewMode={ true }
                                                    zoom={ current_zoom }
                                                    key='outer'
                                                    data={ floor.locations.find(data => data['location_type_id'] === settings.OUTER_WALLS_TYPE_ID) } 
                                                    closeLegendSideBar={this.switchOffLegendSidebar}/>
                                                
                                                {floor.locations.map((data, index) => {
                                                    if (data['location_type_id'] !== settings.OUTER_WALLS_TYPE_ID) {
                                                        return <LocationItem
                                                            viewMode={ true }
                                                            zoom={ current_zoom }
                                                            key={ index }
                                                            data={ data } 
                                                            closeLegendSideBar={this.switchOffLegendSidebar}/>
                                                    }
                                                })}
                                            </>
                                        : null }
                                        
                                    </svg>                               
                                    <div id="objects-layer"
                                        className="objects layer">                                            
                                        { floor.object_items.length > 0 ? 
                                            <>
                                                {floor.object_items.filter(e => settings.OI_LIST_NOT_SHOW.find(oi => oi === e.object_type_id ) !== undefined || floor.show_object_items )
                                                  .map((data, index) => {
                                                    return <ObjectItem
                                                            editor={ false }
                                                            key={ index }
                                                            zoom={ this.state.zoom }
                                                            objScale={ objScale }
                                                            data={ data } 
                                                            closeLegendSideBar={this.switchOffLegendSidebar}/>
                                                })}
                                            </>
                                        : null }
                                    </div>

                                    <div id="location-names-layer"
                                        className="location-names layer">
                                        { floor.locations.length > 0 ? 
                                            <>
                                                {floor.locations.map((data, index) => {

                                                    if (data['location_type_id'] !== settings.OUTER_WALLS_TYPE_ID) {
                                                        const corners = this.getMinMaxDots(data['dots']);
                                                        let show = false;
                                                        if (floor.show_location_names) {
                                                            show = true;
                                                        }
                                                        else {
                                                            if (!!floor.selected_item) {
                                                                if ((floor.selected_item['id'] === data['id']) &&
                                                                    (floor.selected_type === "location")) {
                                                                        // show = true;
                                                                    }
                                                            }
                                                        }

                                                        // centermiddle default
                                                        let left = (corners['max_x'] + corners['min_x'])/2 - data['name'].length * 3 - 10;
                                                        let top = (corners['max_y'] + corners['min_y'])/2 - 20;

                                                        if (data['name_position'] === 'lefttop') {
                                                            left = corners['min_x'] + 20;
                                                            top = corners['min_y'] + 20;
                                                        }
                                                        if (data['name_position'] === 'righttop') {
                                                            left = corners['max_x'] - 50 - data['name'].length * 6;
                                                            top = corners['min_y'] + 20;
                                                        }
                                                        if (data['name_position'] === 'centertop') {
                                                            left = (corners['max_x'] + corners['min_x'])/2 - data['name'].length * 3 - 10;
                                                            top = corners['min_y'] + 20;
                                                        }
                                                        if (data['name_position'] === 'leftmiddle') {
                                                            left = corners['min_x'] + 20;
                                                            top = (corners['max_y'] + corners['min_y'])/2 - 20;
                                                        }
                                                        if (data['name_position'] === 'rightmiddle') {
                                                            left = corners['max_x'] - 50 - data['name'].length * 6;
                                                            top = (corners['max_y'] + corners['min_y'])/2 - 20;
                                                        }
                                                        if (data['name_position'] === 'leftbottom') {
                                                            left = corners['min_x'] + 20;
                                                            top = corners['max_y'] - 50;
                                                        }
                                                        if (data['name_position'] === 'centerbottom') {
                                                            left = (corners['max_x'] + corners['min_x'])/2 - data['name'].length * 3 - 10;
                                                            top = corners['max_y'] - 50;
                                                        }
                                                        if (data['name_position'] === 'rightbottom') {
                                                            left = corners['max_x'] - 50 - data['name'].length * 6;
                                                            top = corners['max_y'] - 50;
                                                        }

                                                        return <>{ !!data['name'] ?
                                                            <div className="location-name"
                                                                key={`${data['id']}`}
                                                                style={{
                                                                    zIndex: 15,
                                                                    display: show ? 'block' : 'none',
                                                                    position: 'absolute',
                                                                    left: left,
                                                                    top: top
                                                                    }}>
                                                                    { data['name'] }
                                                            </div>
                                                        : <></> }</>
                                                    }
                                                })}
                                            </>
                                        : null }
                                        
                                    </div>
                                </div>
                            </ScrollContainer>
                                
                        </div>
                        <InfoSidebar {...this.props} lang={this.props.lang} />  
                        <LegendSidebar isOpen={this.state.legendSidebarShow} handleOpen={this.handleLegendSideBarOpen}/>                    
                    </div>
                </div>
            );
        } else {
            return(<Loading/>);
        }
    }
}

const mapStateToProps = state => {
    return {
        floor:          state.floor,
        user:           state.user,
        search:         state.search,
        object_types:   state.object_types,
        location_types: state.location_types,
        cities:         state.cities,
        buildings:      state.buildings,
        offices:        state.offices,
        floors:         state.floors,
        available_dates_for_parking: state.available_dates_for_parking
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getFloorDetails:       (id) => dispatch(getFloorDetails(id)),
        selectNewElement:      (object) => dispatch(selectNewElement(object)),
        getLocationTypes:      () => dispatch(getLocationTypes()),
        getObjectTypes:        () => dispatch(getObjectTypes()),
        setSidebarMarkUpState: (val) => dispatch(setSidebarMarkUpState(val)),
        getPageOfBookings:     (page, per_page, filters, sortField, sortOrder) => dispatch(getPageOfBookings(page, per_page, filters, sortField, sortOrder)), 
        setShowObjects:        (val) => dispatch(setShowObjects(val)),
        setShowLocationNames:  (val) => dispatch(setShowLocationNames(val)),
        setShowObjectsNames:   (val) => dispatch(setShowObjectsNames(val)),
        setShowDsLight:        (val) => dispatch(setShowDsLight(val)),
        getAvailableDates:     () => dispatch(getAvailableDates()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(MapViewer);