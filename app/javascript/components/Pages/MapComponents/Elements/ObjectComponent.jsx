import React, { Component } from 'react';
import { connect } from "react-redux";

import { toast } from 'react-toastify';
import { selectNewElement, getObjectInfo, updateOneMetaValue, setSidebarMarkUpState } from '../../../../actions/FloorActions';
import { getObjectTypes } from '../../../../actions/ObjectTypesActions';
import ReactTooltip from 'react-tooltip';
import * as settings from '../../../../constants/AppSettings';
import * as object_item_status from '../../../../constants/ObjectItemsStatus';

import LocalizedStrings from 'react-localization';

import * as rbac from '../../../../rbac/rbac';
import * as rights from '../../../../constants/Rights';

let strings = new LocalizedStrings({
    en:{     
        shareddesk: "DS table",
        markedready: "has been already marked as ready",
        markednotready: "has been already marked as unready",
    },
    ru: {      
        shareddesk: "DS стол",
        markedready: "отмечен как готовый",
        markednotready: "отмечен как неготовый",
    },
    de: {    
        shareddesk: "DS-Tabelle",
        markedready: "ist bereits als fertig markiert",
        markednotready: "has been already marked as ready",
    }
});

const default_angles = [
    0,
    15,
    30,
    45,
    60,
    75,
    90,
    105,
    120,
    135,
    150,
    165,
    180,
    195,
    210,
    225,
    240,
    255,
    270,
    285,
    300,
    315,
    330,
    345
];

class ObjectItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            onHover: false,
            availablesDatesChecked: false
        }

        this.selectElement = this.selectElement.bind(this);
        this.getPlaceInfo = this.getPlaceInfo.bind(this);
        this.handleDSReadyChange = this.handleDSReadyChange.bind(this);
        
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const { floor, data, user } = nextProps;
        if (!this.state.availablesDatesChecked && user && user.user && user.user.data) {
            if (floor.attributes && floor.attributes.length > 0) {
                const employee_parking = floor.attributes.find(a => a.metable_type == 'ObjectItem' && a.metable_id == data.id && a.meta_field_id == settings.EMPLOYEE_SD_ID);
                if (employee_parking !== undefined && user.user.data.id !== parseInt(employee_parking.value)) {
                }
                this.setState({ availablesDatesChecked: true });
            }
        }
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    notify = (name, new_value) => {
        toast.success(`${strings.shareddesk} ${name} ${new_value === 'on' ? strings.markedready : strings.markednotready}`, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    getPlaceInfo(id) {

        this.setState({
            onHover: true
        });

        this.props.getObjectInfo(id);
    }

    resetPlaceInfo() {

        this.setState({
            onHover: false
        });

        // this.props.resetTooltipInfo();
    }

    selectElement(data) {
        this.props.selectNewElement({data})
        this.props.setSidebarMarkUpState(false);
    }

    handleDSReadyChange(e) {
        e.stopPropagation();
        let attribute = this.props.floor.attributes.find(a => a.metable_type === 'ObjectItem' && a.meta_field_id === settings.DS_READY_ID && a.metable_id === this.props.data.id);
        const new_value = attribute !== undefined && attribute.value === 'on' ? 'off' : 'on';
        this.props.updateOneMetaValue({
            id: attribute !== undefined ? attribute.id : null,
            value: new_value,
            // need to set correct id for ready field !!!
            meta_field_id: 9,
            metable_type: 'ObjectItem',
            metable_id: this.props.data.id
        });
        this.notify(this.props.data.name, new_value);
    }

    render() {
        const { data, floor, editor, user, bookings, available_dates_for_parking } = this.props;
        let user_rights = [];
        let notactive_attribute = false;
        let notactive = false;
        let parking = false;
        let attributes_oi = floor.attributes ? floor.attributes.filter(a => a.metable_id == data.id && a.metable_type == 'ObjectItem') : [];
        const employee_p = attributes_oi.find(a => a.meta_field_id == settings.EMPLOYEE_SD_ID && !!a.value);
        const employee_parking_id = employee_p !== undefined  && !isNaN(parseInt(employee_p.value)) ? parseInt(employee_p.value) : null;
        const show_ds_light = floor.show_ds_light;

        if (user && user.loggingIn && user.user.rights) {
            user_rights = user.user.rights;
        }

        const current_type = this.props.object_types.filter(v => v.id == this.props.data['object_type_id'])[0];

        let bg = 'transparent';

        if (!!floor.costcenters && floor.costcenters_backlight) {
            const color = floor.costcenters.find(c => c.show && (parseInt(c.attributes.number) == parseInt(data.costcenter_num) || parseInt(c.attributes.number) == parseInt(data.employee_costcenter_num)));

            if (!!color) bg = color.color;

        }

        if (!!floor.projects && floor.projects_backlight) {
            const color = floor.projects.find(p => p.show && p.employees.indexOf(parseInt(data.employee_id)) !== -1);
            
            if (!!color) bg = color.color;
        }

        if (floor.show_desk_type.tab_active) {
            if (data.status === "SHARING" && floor.show_desk_type.sharing) {
                bg = 'rgb(154, 238, 84)';
            } else if (data.status === "EMPLOYEE" && floor.show_desk_type.employee) {
                bg = 'rgb(233, 80, 80)';
            } else if (data.status === "GUEST" && floor.show_desk_type.guest) {
                bg = 'rgb(228, 238, 82)';
            } else if (data.status === "RESERVED" && floor.show_desk_type.reserved) {
                bg = 'rgb(208, 109, 238)';
            } else if (data.status === "NOT_ACTIVE" && floor.show_desk_type.not_active) {
                bg = 'rgb(255, 192, 203)';
            }
        }
        if (!!current_type) {
            let icon_styles = "";
            let checked = false; 
            let p = floor.attributes ? floor.attributes.find(a => a.metable_type === 'ObjectItem' && a.meta_field_id === settings.PARKING_PLACE_ID && a.metable_id === data.id) : undefined;
            parking = p !== undefined ? p.value === 'on' : false;
            let available_dates_filtered = [];
            if (!data.status && data.object_type_id && data.object_type_id === 1) {
                current_type.icon =  parking 
                    ? 'car_grey.svg'
                    : 'desk.svg';   
            } else if (!!data.status && data.status === object_item_status.SHARING) {      
                let f = floor.attributes ? floor.attributes.find(a => a.metable_type === 'ObjectItem' && a.meta_field_id === settings.DS_READY_ID && a.metable_id === data.id) : undefined;
                checked = f !== undefined ? f.value === 'on' : false;    
                // Math.ceil(moment(b.book_from).diff(today, 'days', true) <= 0)
                // third parameter true means that return value will be with float
                // and round up to ceil this value               
                current_type.icon = checked 
                    ? parking 
                        ? employee_parking_id == user.user.data.id
                            ? 'car_blue.svg'
                            : data.occupied == 't'
                                ? 'car_pink.svg'
                                : data.have_opportunity_to_book == 't'
                                    ? 'car_green.svg'
                                    : 'car_grey.svg'
                        : data.have_opportunity_to_book == 't'
                            ? 'desk_ready.svg' 
                            : show_ds_light
                                ? 'desk_grey.svg'
                                : 'desk.svg'
                    : parking 
                        ? 'car_grey.svg'
                        : show_ds_light
                            ? 'desk_grey.svg'
                            : 'desk.svg';
            } else if (!!data.status && data.status !== object_item_status.SHARING) {
                notactive_attribute = floor.attributes ? floor.attributes.find(a => a.metable_type === 'ObjectItem' && a.meta_field_id === settings.NOTACTIVE_DESK_ID && a.metable_id === data.id) : undefined;
                notactive = notactive_attribute !== undefined && !!notactive_attribute && !!notactive_attribute.value;  
                current_type.icon = parking 
                    ? 'car_grey.svg' 
                    : notactive 
                        ? editor && (!!notactive_attribute && parseInt(notactive_attribute.value) > 0)
                            ? 'notactive_hidden.svg'
                            : show_ds_light
                                ? 'notactive_grey.svg' 
                                : 'notactive.svg' 
                        : parking 
                            ? 'car_grey.svg'
                            : show_ds_light
                                ? 'desk_grey.svg'
                                : 'desk.svg';
            }
            if (!editor && (!notactive_attribute || notactive_attribute && (parseInt(notactive_attribute.value) == 0 || !notactive_attribute.value))) {
                if (!!data.status) {
                    let angle_bigger = 0;
                    let angle = parseInt(data.angle);
                    if (default_angles.find(da => da == parseInt(angle)) == undefined) {
                        for(let i = 0; i < default_angles.length; i++) {
                            if (default_angles[i] < angle) {
                                angle_bigger = default_angles[i];
                            } else {
                                break;
                            }
                        }
                        if (angle_bigger == 0) {
                            angle = (angle - angle_bigger) > 7 ? angle_bigger : 15; 
                        } else if (angle_bigger == 345) {
                            angle = angle_bigger; 
                        } else {
                            angle = (angle - angle_bigger) > 7 ? angle_bigger : (angle_bigger - 15); 
                        }
                    }
                    icon_styles = `icon_desk statis-icon desk_${angle}_d`;
                }
                
                return (
                    <>
                        <div
                            style={{
                                top: data.top + "px",
                                left: data.left + "px",
                                width: data.width * (this.props.objScale * 0.01) * (this.props.data.scale * 0.01) + "px",
                                height: data.height * (this.props.objScale * 0.01) * (this.props.data.scale * 0.01) + "px",
                                transform: 'rotate(' + this.props.data.angle + 'deg)',
                                backgroundColor: bg,
                                backgroundImage: (current_type.icon != null)  ? "url('/img/editor-icons/objects/" + current_type.icon + "')" : '' 
                            }}
                            itemID={this.props.data.id}
                            entity-type="object"
                            className={"object" + " " +
                                (!!floor.selected_item 
                                    ? (((this.props.data.id === floor.selected_item['id']) 
                                       && ('object' === floor.selected_type)) 
                                        ? floor.selected_item['status'] === object_item_status.EMPLOYEE
                                            ?  parking
                                                ? "selected_ds_parking"
                                                : "selected_e"
                                            : floor.selected_item['status'] === object_item_status.SHARING
                                                ? parking
                                                    ? "selected_ds_parking"
                                                    : "selected_ds"
                                                : floor.selected_item['status'] === object_item_status.GUEST
                                                    ? "selected_g"
                                                    : floor.selected_item['status'] === object_item_status.RESERVED
                                                        ? "selected_r"
                                                        : floor.selected_item['status'] === object_item_status.NOT_ACTIVE
                                                            ? "selected_n"
                                                            : "selected"
                                        : ''
                                      ) 
                                    : ''
                                ) + " " + (current_type['resizable'] ? 'resizable' : '') + " " +
                                (data.object_type_id === settings.DESK_OBJECT_TYPE_ID ? 'desk' : (data.object_type_id === settings.NOT_SAFE_PLACE_ID ? ' safe-place' : ' not-desk')) +
                                (data.object_type_id === settings.NOT_SAFE_PLACE_ID  ? ' not_safe ' : '')
                            }
                            subtype={data['object_type_id']}
                            onMouseEnter={() => this.getPlaceInfo(data['id'])}
                            onMouseLeave={() => this.resetPlaceInfo()}
                            onClick={(e) => { 
                                if (!floor.mark_ds_ready && (!notactive || (notactive && user_rights.length > 0 && rbac.isSatisfied([rights.UPDATE_OBJECT_ITEM], user_rights)))) { 
                                    if (!data.can_book && !!employee_parking_id && parseInt(employee_parking_id) !== user.user.data.id &&
                                        !rbac.isSatisfied([rights.BOOK_ALL_PLACES], user_rights)) {
                                        // do not open sidebar if you can't book shared parking place by someone
                                    } else if (settings.OI_LIST_BLOCK.find(oi => oi == data['object_type_id']) == undefined &&
                                        data.object_type_id != settings.NOT_SAFE_PLACE_ID) {
                                        this.selectElement({data: data, type: 'object'}); 
                                        this.props.closeLegendSideBar();
                                    }
                                }
                                else if (floor.mark_ds_ready && data.status === 'SHARING') { 
                                    this.handleDSReadyChange(e);  
                                    this.props.closeLegendSideBar();
                                } 
                            }} >
                                
                                <p data-tip data-for={"obj_tooltip_" + data.id}
                                    data-effect="solid"
                                    itemID={data.id}
                                    entity-type="object"
                                    className="object-name noselect"
                                    style={{
                                        transform: 'rotate(-' + data.angle + 'deg)'
                                    }}
                                    >
                                    { (!!data.status || data.object_type_id !== 1) && !floor.mark_ds_ready && 
                                      data.object_type_id !== settings.NOT_SAFE_PLACE_ID ?
                                        <ReactTooltip id={"obj_tooltip_" + data.id}
                                            overridePosition = {({ left, top }) => {
                                                left = -35;
                                                if (!!data.employee_id) {
                                                    top = -45;
                                                }
                                                else if (data.object_type_id === settings.NOT_SAFE_PLACE_ID) {
                                                    top = -65;
                                                } else {
                                                    top = -25;
                                                }
                                                return { top, left };
                                            }}
                                        >
                                    
                                            <span>
                                                { data.object_type_id === 1 ?
                                                    <>
                                                        { !!data.employee_id ? data.tooltip : data.status }
                                                    </>
                                                :
                                                    <>
                                                        { data.type_name } { data.name }
                                                    </>
                                                }
                                                
                                            </span>
                                        </ReactTooltip>
                                    : <></> }

                                    { (!!data.comment && data.comment.length > 0) && !editor ?
                                        <i className="fa fa-comment-o comment-icon"></i>
                                    : <></> }

                                    { !!data.status && !editor && !parking ?
                                        <>
                                            
                                            { data.status == object_item_status.EMPLOYEE ?
                                                <img 
                                                    className={icon_styles}
                                                    alt="User Avatar" 
                                                    src={`/img/pics/em.png`} 
                                                />
                                            : <></> }

                                            { data.status == object_item_status.SHARING ?
                                                data.occupied != 't'
                                                    ? <img 
                                                        className={icon_styles}
                                                        alt="User Avatar" 
                                                        src={`/img/pics/ds.png`} 
                                                    />
                                                    : <img 
                                                        className={icon_styles}
                                                        alt="User Avatar" 
                                                        src={`/img/pics/ds_pink.svg`} 
                                                    />
                                            : <></> }
                                            {/* { data.status == object_item_status.SHARING && rbac.isSatisfied([rights.UPDATE_META_VALUE], user_rights) ?
                                                <Input type="checkbox"
                                                    className="statis-icon ds_ready_checkbox"
                                                    name="ready"
                                                    id={`ready_${data.id}`}
                                                    // need to set correct id for ready field !!!
                                                    checked={checked}
                                                    value={checked}
                                                    disabled={!floor.mark_ds_ready} />
                                            : <></> } */}

                                            { data.status == object_item_status.RESERVED ?
                                                <img 
                                                    className={icon_styles}
                                                    alt="User Avatar" 
                                                    src={`/img/pics/rs.png`} 
                                                />
                                            : <></> }

                                            { data.status == object_item_status.GUEST ?
                                                <img 
                                                    className={icon_styles}
                                                    alt="User Avatar" 
                                                    src={`/img/pics/gu.png`} 
                                                />
                                            : <></> }

                                        </>
                                    : <></> }

                                    <span className={`${floor.show_object_names ? parking ? "not-show-object-names" : "" : "not-show-object-names"} ${data.object_type_id === settings.NOT_SAFE_PLACE_ID ? "not-safe" : ""} short-name`}>
                                    {/* className={`${floor.show_object_names ? parking ? "parking-object" : "" : "not-show-object-names"} ${data.object_type_id === settings.NOT_SAFE_PLACE_ID ? "not-safe" : ""} short-name`} */}
                                        { data.name }
                                    </span>

                                </p>
                        </div>
                    </>
                );
            }
            else if (editor) {              
                return (
                        <div
                            itemID={this.props.data.id}
                            entity-type="object"
                            className={"object" + " " +
                                (!!floor.selected_item ? (
                                    ((this.props.data.id === floor.selected_item['id'])
                                    && ('object' === floor.selected_type)) ? "selected" : '' ) :
                                    ''
                                ) + " " + (current_type['resizable'] ? 'resizable' : '') +
                                (data.object_type_id === settings.DESK_OBJECT_TYPE_ID ? 'desk' : (data.object_type_id === settings.NOT_SAFE_PLACE_ID ? ' safe-place' : ' not-desk')) +
                                (data.object_type_id === settings.NOT_SAFE_PLACE_ID  ? ' not_safe ' : '')
                            }
                            subtype={this.props.data['object_type_id']}
                            style={{
                                top: this.props.data.top + "px",
                                left: this.props.data.left + "px",
                                width:
                                //  data.object_type_id === settings.NOT_SAFE_PLACE_ID 
                                //     ? "25px"
                                //     : 
                                    data.width * (this.props.objScale * 0.01) * (this.props.data.scale * 0.01) + "px",
                                height: data.height * (this.props.objScale * 0.01) * (this.props.data.scale * 0.01) + "px",
                                transform: 'rotate(' + this.props.data.angle + 'deg)',
                                backgroundImage: (current_type.icon != null)  ? "url('/img/editor-icons/objects/" + current_type.icon + "')" : '' 
                                
                            }}
                            onClick={(e) => this.selectElement({data: this.props.data, type: 'object'})}
                            >
                                <p
                                    itemID={this.props.data.id}
                                    entity-type="object"
                                    className={`object-name noselect ${parking ? "parking-object" : ""}`}
                                    style={{
                                        transform: 'rotate(-' + this.props.data.angle + 'deg)'
                                    }}
                                    >
                                    { data.object_type_id === settings.DESK_OBJECT_TYPE_ID ?
                                        <>{ data.name }</>
                                    : <></> }
                                </p>
                        </div>
                );
            } else {
                return (<></>);
            }
        } else {
            return (<></>);
        }
    }

}

function mapDispatchToProps(dispatch) {
    return {
        selectNewElement: object => dispatch(selectNewElement(object)),
        getObjectTypes: () => dispatch(getObjectTypes()),
        getObjectInfo: (id) => dispatch(getObjectInfo(id)),
        updateOneMetaValue: (data) => dispatch(updateOneMetaValue(data)),
        setSidebarMarkUpState: (val) => dispatch(setSidebarMarkUpState(val)),
    };
}

const mapStateToProps = state => {
    
    return {
        object_types: state.object_types,
        floor: state.floor,
        user: state.user,
        bookings: state.bookings,
        available_dates_for_parking: state.available_dates_for_parking
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(ObjectItem);