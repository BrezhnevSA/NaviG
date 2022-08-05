import React, { Component } from 'react';
import { connect } from "react-redux";

import { getLocationTypes } from '../../../../actions/LocationTypesActions';
import { selectNewElement } from '../../../../actions/FloorActions';

import * as settings from '../../../../constants/AppSettings';

class LocationItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            areaSize_w: 800,
            areaSize_h: 500,
            imageIsReady: false,
            bg: ''
        }

        this.selectElement = this.selectElement.bind(this);
    }

    componentDidMount() {
        if (!!this.props.location_types) {
            const current_type = this.getCurrentType();
            
            if (!!current_type.bg) {
                this.setState({
                    imageIsReady: true,
                    bg: current_type.bg
                })
            }
        }
    }

    componentDidUpdate(prevProps) {
        
        if (this.props.location_types !== prevProps.location_types) {
            // current location type
            const current_type = this.getCurrentType();

            const bg_img = new Image();
            bg_img.src = current_type.bg;

            bg_img.onload = () => {
                this.setState({
                    imageIsReady: true,
                    bg: bg_img.src
                })
            }
        }
    }

    selectElement(data, e) {
        if (e.target.tagName === 'polyline') {
            this.props.selectNewElement({data});
        }
    }

    getCurrentType() {
        let current_type = { bg: settings.LOCATION_DEFAULT_BG }
        let { floor, data } = this.props;
        let current_type_arr = this.props.location_types.filter(v => v.id == data['location_type_id']);
        if (!!current_type_arr[0]) {
            current_type = current_type_arr[0];
        }

        return current_type;
    }

    render() {
        
        let { floor, data } = this.props;

        const current_type = this.getCurrentType();

        let pointsitems = '';
        let circleitems = [];

        let dots = data.dots;
        
        if (!Array.isArray(dots) && !!dots) {
            // nil sometimes get here, have no idea why
            dots = dots.replaceAll('nil,','');
            dots = dots.replaceAll(', nil','');
            dots = dots.replaceAll('nil','');
            dots = dots.split("=>").join(":")
            
            dots = JSON.parse(dots);
        }

        dots.map((value, index) => {
            pointsitems = pointsitems + ' ' + value['x'] + ',' + value['y'];

            circleitems.push(<circle 
                key={index}
                itemID={data.id}
                entity-type="location-dot"
                dot-id={index}
                cx={value['x']}
                cy={value['y']}
                r="10"
                stroke="#5aa0a0"
                strokeWidth="5"
                fill="transparent" 
                className=""></circle>);
        });

        let transparency = null;
        if (!!data) {
            let transparency_att = floor.attributes.find(a => a.metable_type == 'Location' && a.meta_field_id == settings.TRANSPARENCY_ID && a.metable_id == data.id)
            if (transparency_att !== undefined && parseFloat(transparency_att.value)) {
                transparency = parseFloat(transparency_att.value)
            }
        }

        let not_open_sidebar = null;
        if (!!data) {
            let not_open_sidebar_att = floor.attributes.find(a => a.metable_type == 'Location' && a.meta_field_id == settings.NOT_OPEN_SIDEBAR_ID && a.metable_id == data.id)
            if (not_open_sidebar_att !== undefined) {
                not_open_sidebar = not_open_sidebar_att.value == 'on'
            }
        }

        let x = 0;
        let y = 0;
        return (
            <>
                { (this.state.imageIsReady === true) ?
                <>
                    <defs xmlns="http://www.w3.org/2000/svg">

                        <pattern id={"pattern" + data.id}
                                width="50"
                                height="50"
                                onClick={ (e) => this.selectElement({data: data, type: 'location'}, e) }
                                patternUnits="userSpaceOnUse">
                            <image xlinkHref={ this.state.bg } width="50" height="50"/>
                        </pattern>
                        
                    </defs>

                    <polyline
                        onClick={(e) => { 
                            if ((!not_open_sidebar && this.props.editor === false) || this.props.editor === true) { 
                                this.selectElement({data: data, type: 'location'}, e); 
                                this.props.closeLegendSideBar(); 
                            }
                        }}
                        opacity={`${ !!transparency ? transparency : '' }`}
                        itemID={data.id}
                        entity-type="location"
                        subtype={data.location_type_id}
                        entity-name={data.name}
                        stroke={settings.LOCATION_LINE_STROKE}
                        strokeWidth={settings.LOCATION_LINE_STROKE_WIDTH}
                        fill={"url(#pattern" + data.id + ")"}
                        points={pointsitems}    
                    />
                    
                    { (this.props.editor === true) && !!floor.selected_item && (floor.selected_type == 'location') ?
                        <>
                            { (floor.selected_item.id === data.id) ?
                                circleitems
                            : <></>}
                        </>
                    : <></> }
                            
                </>
                : <></> }
            </>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        selectNewElement: location => dispatch(selectNewElement(location)),
        getLocationTypes: () => dispatch(getLocationTypes())
    };
}

const mapStateToProps = state => {
    
    return {
        location_types: state.location_types,
        floor:          state.floor
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(LocationItem);