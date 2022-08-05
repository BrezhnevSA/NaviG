import React, { Component } from 'react';
import { connect }          from "react-redux";
import { toast }              from 'react-toastify';
import { Accordion  }         from "react-bootstrap";
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { Button, Label } from 'reactstrap';

import LocalizedStrings from 'react-localization';

import * as app_settings from '../../../constants/AppSettings';

let strings = new LocalizedStrings({
    en:{
        filter: "Filter",
        all: "All",
        show: "Show",
        bdandoffcie: "Office and building",
        reserve: "Reserve",
        sharing: "Sharing",
        employee: "Employee",
        nullstatus: "Object",
        sharing_ready: "Sharing (ready)",
        reset: "Reset",
        objects: "Objects",
        objectype: "Object type",
        status: "Status",
        status_fix: "Fixing",
        status_work: "Works",
        placeholder_loc: "Enter location name",
        location_name: "Location"
    },
    ru: {
        filter: "Фильтр",
        all: "Все",
        show: "Показать",
        bdandoffcie: "БЦ и Корпус",
        reserve: "Резерв",
        sharing: "Sharing",
        employee: "Employee",
        nullstatus: "Object",
        sharing_ready: "Sharing (готов)",
        reset: "Сбросить",
        objects: "Объекты",
        objectype: "Тип объекта",
        status: "Состояние",
        status_fix: "В ремонте",
        status_work: "Работает",
        placeholder_loc: "Введите помещение",
        location_name: "Помещение"
    },
    de: {
        filter: "Filter",
        all: "Alles",
        show: "Zeigen",
        bdandoffcie: "Office and building",
        reserve: "Reservieren",
        sharing: "Sharing",
        employee: "Employee",
        nullstatus: "Object",
        sharing_ready: "Sharing (bereit)",
        reset: "Zurücksetzen",
        objects: "Objects",
        objectype: "Objekttyp",
        status: "Status",
        status_fix: "Behebung",
        status_work: "Funktioniert",
        placeholder_loc: "Raumname eingeben",
        location_name: "Raum"
    }
});


const Placeholder = props => {
    return <components.Placeholder {...props} />;
};

class ObjectItemsFilterSidebar extends Component {

    notify = () => {
        toast.success("Changes Saved!", {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);
        this.state= {
            active_office: null,
            active_building: null,
            checkbox_offices: this.props.checkbox_offices.filter(f => !f.active),
            checkbox_buildings: this.props.checkbox_buildings.filter(f => !f.active),
            checkbox_floors: this.props.checkbox_floors.filter(f => !f.active),
            selected_tab_id: this.props.key_ == undefined ? -1 : this.props.key_,
            objects_opened: true,
            status_: this.props.status_ && this.props.status_.length > 0 ? this.props.status_ : [ {header: 'status_fix', value: true}, {header: 'status_work', value: true}],
            location_name: ""
        }

        this.handleTabChangeChange        = this.handleTabChangeChange.bind(this);
        this.handleOfficeCheckboxChange   = this.handleOfficeCheckboxChange.bind(this);
        this.handleBuildingCheckboxChange = this.handleBuildingCheckboxChange.bind(this);
        this.handleFloorCheckboxChange    = this.handleFloorCheckboxChange.bind(this);
        this.handleObjectsChange          = this.handleObjectsChange.bind(this);
        this.handleStatusChange           = this.handleStatusChange.bind(this);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const { offices, buildings, floors } = this.props;
        const { checkbox_offices, checkbox_buildings, checkbox_floors } = this.state;
        
        if (checkbox_offices.length === 0 && offices && offices.length > 0) {
            let checkbox_offices = [];
            offices.filter(f => f.active).map(office => checkbox_offices.push({id: office.id, value: true}));
            this.setState({ checkbox_offices: checkbox_offices });
        }

        if (checkbox_buildings.length === 0 && buildings && buildings.length > 0) {
            let checkbox_buildings = [];
            buildings.filter(f => f.active).map(building => checkbox_buildings.push({id: building.id, value: true, office_id: building.office_id}));
            this.setState({ checkbox_buildings: checkbox_buildings });
        }

        if (checkbox_floors.length === 0 && floors && floors.length > 0) {
            let checkbox_floors = [];
            floors.filter(f => f.active).map(floor => checkbox_floors.push({id: floor.id, value: true, building_id: floor.building_id}));
            this.setState({ checkbox_floors: checkbox_floors });
        }

        if (this.props.key_ !== nextProps.key_) {
            this.setState({ selected_tab_id: nextProps.key_ })
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    filterRenderer_(tabId, column) {
        const { filtersVal } = this.props;
        const fv = filtersVal.find(e => e.field === column && e.tabId === tabId);
        if (fv == undefined && tabId == -1) {
            
        }
        return  <Label
                    className='filter-label fl-lb'
                    for={`text-filter-column-${column}`}
                    onClick={(e) => { e.stopPropagation();e.nativeEvent.stopImmediatePropagation(); }}
                >
                    <input
                        name={`text-filter-column-${column}-${tabId}`}
                        ref={(ref) => { this[`ref_${column}_${tabId}`] = ref; }}
                        type="text"
                        className="filter text-filter form-control"
                        id={`text-filter-column-${column}-${tabId}`}
                        defaultValue={fv ? fv.value : ""}
                        meta={true}
                        placeholder={fv ? fv.preview : ""}
                    />
                </Label>
    }

    closeSidebarClick() {
        this.props.closeSidebar();
    }

    handleTabChangeChange(tab) {
        this.setState({
            selected_tab_id: tab
        })
    }

    handleStatusChange(header) {
        this.setState({
            status_: this.state.status_.map(f => {
                if (f.header == header) {
                    f.value = !f.value;
                }
                return f;
            })
        })
    
    }

    reset() {
        const { checkbox_offices, checkbox_buildings, checkbox_floors } = this.state;
        this.setState({
            selected_tab_id: this.props.key_ == undefined ? -1 : this.props.key_,
            checkbox_offices: checkbox_offices.map(c => { c.value = false; return c; }),
            checkbox_buildings: checkbox_buildings.map(c => { c.value = false; return c; }),
            checkbox_floors: checkbox_floors.map(c => { c.value = false; return c; }),
            status_: [ {header: 'status_fix', value: false}, {header: 'status_work', value: false}],
            location_name: ""
        })
    }

    show() {
        const { floors } = this.props;
        const { checkbox_offices, checkbox_buildings, checkbox_floors, selected_tab_id, status_, location_name } = this.state;
        let statuses = status_.map(s => {
            let s_ = JSON.parse(JSON.stringify(s))
            return s_.header == 'status_fix' && s_.value 
                ? 'on'
                : s_.header == 'status_work' && s_.value
                    ? 'off'
                    : ''
        }).filter(o => o)
        let filtered_filters = this.props.filtersVal
            .filter(e => e.tabId == selected_tab_id && e.field != "floor_id" && 
                e.field != `${app_settings.OBJECT_STATE_ID}-ObjectItem` && 
                e.field != "location_name")
            .map(e => {
                e.value = this[`ref_${e.field}_${e.tabId}`] ? this[`ref_${e.field}_${e.tabId}`].value : e.value;
                return e;})
            .filter(e => e.value)
        let filters = [
            ...filtered_filters,
            floors.length == (checkbox_floors.filter(c => c.value).length - 1) 
                ? null
                : { field: "floor_id", value: checkbox_floors.map(s => s.value ? s.id : null).filter(s => s).join(','), tabId: selected_tab_id},
                { 
                    field: `${app_settings.OBJECT_STATE_ID}-ObjectItem`, 
                    value: statuses.toString(),
                    tabId: selected_tab_id
                },
            !!location_name ? { field: "location_name", value: location_name, tabId: selected_tab_id} : null,
        ].filter(f => f);
        this.props.filterObjectItems(filters, checkbox_offices, checkbox_buildings, checkbox_floors, selected_tab_id, status_); 
        this.closeSidebarClick();
    }

    handleBuildingCheckboxChange(id) {
        let all_false = 0;
        let all_true = 0;
        let all = 0;
        let office_id = this.state.checkbox_buildings.find(e => e.id == id).office_id;
        let building_val = false;
        this.setState({
            checkbox_buildings: this.state.checkbox_buildings.map(e => {
                if (e.id == id) { 
                    e.value = building_val = !e.value; 
                    office_id = e.office_id;
                    this.state.checkbox_buildings.map(o => {
                        if (o.office_id == e.office_id && ((o.value && o.id !== e.id) || (o.value && o.id == e.id) )) {
                            all_false++;
                        }
                        if (o.office_id == e.office_id && ((o.value && o.id !== e.id) || (!o.value && o.id == e.id) )) {
                            all_true++;
                        }
                    })
                }
                if (e.office_id == office_id) { all++; }
                return e;
            }),
            checkbox_offices: all_true == all && all_true > 0
                ? this.state.checkbox_offices.map(o => { 
                     if (o.id == office_id) {
                         o.value = false;
                     }
                     return o;
                  })
                : all_false == all && all_false > 0
                    ? this.state.checkbox_offices.map(o => { 
                        if (o.id == office_id) {
                            o.value = true;
                        }
                        return o;
                      })
                    : this.state.checkbox_offices,
            checkbox_floors: this.state.checkbox_floors.map(f => {
                if (f.building_id == id) {
                    f.value = building_val;
                }
                return f;
            })
        })
    }

    handleOfficeCheckboxChange(id) {
        this.setState({
            checkbox_offices: this.state.checkbox_offices.map(e => {
                if (e.id == id) { 
                    e.value = !e.value; 
                    let buf_floors = this.state.checkbox_floors;
                    this.setState({
                        checkbox_buildings: this.state.checkbox_buildings.map(p => {
                            if (p.office_id == e.id) {
                                p.value = e.value;
                                buf_floors = buf_floors.map(f => {
                                    if (f.building_id == p.id) {
                                        f.value = p.value;
                                    }
                                    return f;
                                })
                            }
                            return p;
                        }),
                        checkbox_floors: buf_floors
                    });
                }
                return e;
            })
        })
    }

    handleFloorCheckboxChange(id) {
        let all_floors_false = 0;
        let all_floors_true = 0;
        let all_floors = 0;
        let all_buildings_false = 0;
        let all_buildings_true = 0;
        let all_buildings = 0;
        let building_id = this.state.checkbox_floors.find(e => e.id == id).building_id;
        let office_id = this.state.checkbox_buildings.find(e => e.id == building_id).office_id;
        let floor_val = false;

        let checkbox_floors = this.state.checkbox_floors.map(e => {
            if (e.id == id) { 
                e.value = floor_val = !e.value; 
                building_id = e.building_id;
                this.state.checkbox_buildings.map(o => {
                    if (o.building_id == e.building_id && ((o.value && o.id != e.id) || (o.value && o.id == e.id) )) {
                        all_floors_false++;
                    }
                    if (o.building_id == e.building_id && ((o.value && o.id != e.id) || (!o.value && o.id == e.id) )) {
                        all_floors_true++;
                    }
                })
            }
            if (e.building_id == building_id) { all_floors++; }
            return e;
        })

        let checkbox_buildings = all_floors_true == all_floors && all_floors_true > 0
            ? this.state.checkbox_buildings.map(o => { 
                if (o.id == office_id) {
                    o.value = false;
                }
                return o;
            })
            : all_floors_false == all_floors && all_floors_false > 0
                ? this.state.checkbox_buildings.map(o => { 
                    if (o.id == office_id) {
                        o.value = true;
                    }
                    return o;
                })
                : this.state.checkbox_buildings
        checkbox_buildings = this.state.checkbox_buildings.map(e => {
            if (e.id == building_id) { 
                // e.value = floor_val; 
                // office_id = e.office_id;
                this.state.checkbox_offices.map(o => {
                    if (o.office_id == e.office_id && ((o.value && o.id != e.id) || (o.value && o.id == e.id) )) {
                        all_buildings_false++;
                    }
                    if (o.office_id == e.office_id && ((o.value && o.id != e.id) || (!o.value && o.id == e.id) )) {
                        all_buildings_true++;
                    }
                })
            }
            if (e.office_id == office_id) { all_buildings++; }
            return e;
        })

        let checkbox_offices = all_buildings_true == all_buildings && all_buildings_true > 0
            ? this.state.checkbox_offices.map(o => { 
                if (o.id == office_id) {
                    o.value = false;
                }
                return o;
            })
            : all_buildings_false == all_buildings && all_buildings_false > 0
                ? this.state.checkbox_offices.map(o => { 
                    if (o.id == office_id) {
                        o.value = true;
                    }
                    return o;
                })
                : this.state.checkbox_offices

        this.setState({
            checkbox_floors: checkbox_floors,
            checkbox_buildings: checkbox_buildings,
            checkbox_offices: checkbox_offices,
        })
    }

    handleObjectsChange(objects_opened) {
        this.setState({ objects_opened })
    }

    render() {
        const { filter_sidebar_show, offices, buildings, floors, tabs, key_, columns } = this.props;
        const { active_office, active_building, checkbox_offices, checkbox_buildings, checkbox_floors, selected_tab_id, objects_opened, status_, location_name } = this.state;
        if (checkbox_offices.length > 0 && checkbox_buildings.length > 0 && checkbox_floors.length > 0) {
            const CustomToggleOffice = ({ children, eventKey }) => {
                const decoratedOnClick = useAccordionToggle(eventKey, () =>
                    this.setState({ active_office: active_office == eventKey ? null : eventKey })
                );            
                return (
                    <div className="tab_accordion" onClick={decoratedOnClick}>                    
                        <img 
                            id={ children.id + "_office_checkbox" }
                            src={`/img/pics/checkbox_${checkbox_offices.find(e => e.id == children.id).value}.svg`} 
                            className="input_checkbox" 
                            onClick={ (e) => { e.stopPropagation(); this.handleOfficeCheckboxChange(children.id); } }
                        ></img>
                        <span
                            type="button"
                            className="tab_button text-left"
                        >
                            {children.name}
                        </span>
                        <img 
                            src="/img/pics/vector_up.svg" 
                            className={`vector_accordion ${active_office !== children.id ? "rotate_vector" : " " }`}
                        ></img>
                    </div>
                );
            }
            const CustomToggleBuilding = ({ children, eventKey }) => {
                const decoratedOnClick = useAccordionToggle(eventKey, () =>
                    this.setState({ active_building: active_building == eventKey ? null : eventKey })
                );            
                return (
                    <div className="tab_accordion" onClick={decoratedOnClick}>                    
                        <img 
                            id={ children.id + "_building_checkbox" }
                            src={`/img/pics/checkbox_${checkbox_buildings.find(e => e.id == children.id).value}.svg`} 
                            className="input_checkbox" 
                            onClick={ (e) => { e.stopPropagation(); this.handleBuildingCheckboxChange(children.id); } }
                        ></img>
                        <span
                            type="button"
                            className="tab_button text-left"
                        >
                            {children.name}
                        </span>
                        <img 
                            src="/img/pics/vector_up.svg" 
                            className={`vector_accordion ${active_building !== children.id ? "rotate_vector" : " " }`}
                        ></img>
                    </div>
                );
            }
            const CustomToggleObject = ({ children, eventKey }) => {
                const decoratedOnClick = useAccordionToggle(eventKey, () =>
                    this.setState({ objects_opened: !objects_opened })
                );             
                return (
                    <div className="tab_accordion" onClick={decoratedOnClick}>                    
                        <div id="secondHeaderSidebar" style={{'display': 'inline-block'}} onClick={ (e) => { this.handleObjectsChange(!objects_opened); } }>
                            <span>{strings.objectype}</span>
                        </div> 
                        <img 
                            src="/img/pics/vector_up.svg" 
                            className={`vector_accordion ${objects_opened ? "rotate_vector" : " " }`}
                            onClick={ (e) => { this.handleObjectsChange(!objects_opened); } }
                        ></img>
                    </div>
                );
            }

            return (            
                <div id="InfoSidebar"
                    className={filter_sidebar_show ? "" : "d-none"}>
                    
                    {filter_sidebar_show ? 
                        <>
                            <div id="closeSidebar" onClick={() => this.closeSidebarClick()}>
                                <img id="close_icon" src="/img/pics/close_sidebar.svg"></img>
                            </div>  
                            <h1 id="headerSidebar">{strings.filter}</h1>    
                            <div style={{marginTop: "40px"}}>
                                <Accordion>
                                    <CustomToggleObject  eventKey={'object'} >
                                     {tabs}
                                    </CustomToggleObject>
                                    <Accordion.Collapse eventKey={'object'} className="tab_content text-left">
                                        <>
                                            {this.props.tabs.map(tab => {
                                                return <div style={{ marginBottom: '5px' }}>
                                                    <img 
                                                        id={`object_type_${tab.id}_radio`}
                                                        src={`/img/pics/radio_${tab.id === selected_tab_id}.svg`} 
                                                        className="input_checkbox" 
                                                        onClick={ (e) => { e.stopPropagation(); this.handleTabChangeChange(tab.id); } }
                                                    ></img>
                                                    <span 
                                                        className="building_item_a" 
                                                        onClick={ (e) => { e.stopPropagation(); this.handleTabChangeChange(tab.id); } }
                                                    >{tab.name}</span>
                                                </div>   
                                            })}
                                        </>
                                    </Accordion.Collapse>
                                </Accordion>
                            </div>
                            {offices && offices.length > 0 ?
                                <div style={{marginTop: "20px"}}>
                                    <div id="secondHeaderSidebar"><span>{strings.bdandoffcie}</span></div>
                                    <Accordion>
                                            {offices.filter(office => office.active).map(office =>
                                                <>
                                                    <CustomToggleOffice  eventKey={office.id} >
                                                        {office}
                                                    </CustomToggleOffice>
                                                    <Accordion.Collapse eventKey={office.id} className="tab_content text-left">
                                                    <Accordion>
                                                        {buildings.filter(building => building.active && building.office_id == office.id).map(building =>
                                                            <>
                                                                <CustomToggleBuilding  eventKey={building.id} >
                                                                    {building}
                                                                </CustomToggleBuilding>
                                                                <Accordion.Collapse eventKey={building.id} className="tab_content text-left">
                                                                <Accordion>
                                                                        {floors.filter(floor => floor.active && floor.building_id == building.id).map(floor =>
                                                                            <p>
                                                                                <img 
                                                                                    id={ floor.id + "_floor_checkbox" }
                                                                                    src={`/img/pics/checkbox_${checkbox_floors.find(e => e.id == floor.id).value}.svg`} 
                                                                                    className="input_checkbox" 
                                                                                    onClick={ (e) => { this.handleFloorCheckboxChange(floor.id); } }
                                                                                ></img>
                                                                                <span className="building_item_a">
                                                                                    {floor.name}
                                                                                </span>
                                                                            </p>
                                                                        )}
                                                                </Accordion>
                                                                </Accordion.Collapse>
                                                            </>
                                                        )}
                                                    </Accordion>
                                                    </Accordion.Collapse>
                                                </>
                                            )}
                                    </Accordion>                                    
                                </div>
                            : <></>}                       
                            {/* <div style={{marginTop: "40px"}}>
                                <div id="secondHeaderSidebar"><span id="secondHeaderSidebar">{strings.desk_status}</span></div>
                                <div style={{ marginBottom: '5px' }}>
                                    <img 
                                        id="archive_booking_checkbox"
                                        src={`/img/pics/checkbox_${desk_status.find(f => f.status == "RESERVED").value}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleDeskStatusChange("RESERVED"); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleDeskStatusChange("RESERVED"); } }
                                    >{strings.reserve}</span>
                                </div>   
                                <div style={{ marginBottom: '5px' }}>
                                    <img 
                                        id="archive_booking_checkbox"
                                        src={`/img/pics/checkbox_${desk_status.find(f => f.status == "SHARING").value}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleDeskStatusChange("SHARING"); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleDeskStatusChange("SHARING"); } }
                                    >{strings.sharing}</span>
                                </div>   
                                <div style={{ marginBottom: '5px' }}>
                                    <img 
                                        id="archive_booking_checkbox"
                                        src={`/img/pics/checkbox_${desk_status.find(f => f.status == "EMPLOYEE").value}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleDeskStatusChange("EMPLOYEE"); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleDeskStatusChange("EMPLOYEE"); } }
                                    >{strings.employee}</span>
                                </div> 
                                <div>
                                    <img 
                                        id="current_booking__checkbox"
                                        src={`/img/pics/checkbox_${desk_status.find(f => f.status == "SHARING_READY").value}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleDeskStatusChange("SHARING_READY"); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleDeskStatusChange("SHARING_READY"); } }
                                    >{strings.sharing_ready}</span>
                                </div>
                            </div>               */}
                            <div style={{marginTop: "40px"}}>
                                <div id="secondHeaderSidebar"><span>{strings.status}</span></div>
                                <div style={{ marginBottom: '5px' }}>
                                    <img 
                                        id="archive_booking_checkbox"
                                        src={`/img/pics/checkbox_${status_.find(f => f.header == "status_fix").value}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleStatusChange("status_fix"); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleStatusChange("status_fix"); } }
                                    >{strings.status_fix}</span>
                                </div>   
                                <div style={{ marginBottom: '5px' }}>
                                    <img 
                                        id="archive_booking_checkbox"
                                        src={`/img/pics/checkbox_${status_.find(f => f.header == "status_work").value}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleStatusChange("status_work"); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleStatusChange("status_work"); } }
                                    >{strings.status_work}</span>
                                </div>
                            </div>
                            { columns.find(c => c.id == selected_tab_id) 
                                ? columns.find(c => c.id == selected_tab_id).items.filter(function({dataField}) {
                                        var key = `${dataField}`;
                                        return !this.has(key) && this.add(key);
                                    }, new Set).map(i => {
                                        if (i.filter_external) {
                                            return <div style={{marginTop: "40px"}}>  
                                                    <div id="secondHeaderSidebar"><span>{i.text}</span></div>
                                                        {this.filterRenderer_(selected_tab_id, i.dataField)}
                                                    </div>
                                    } else {
                                        return null;
                                    }
                                    }).filter(o => o)
                                : <></>
                            }
                            <div style={{marginTop: "40px"}}>
                                <div id="secondHeaderSidebar"><span id="secondHeaderSidebar">{strings.location_name}</span></div>
                                <div className="div-input-filter">
                                    <input type="text"
                                        name="location_name"
                                        id="location_name"
                                        value={location_name}
                                        className={`input-employee-not-in-app ${!!location_name ? "black_text" : ""} input-filter`}
                                        placeholder={strings.placeholder_loc}
                                        onChange={(e) => { this.setState({ location_name: e.target.value })}} />
                                </div>
                            </div>      
                            <div className="show_div_filter_bbokings" style={{marginTop: "40px"}}>
                                <button 
                                    onClick={() => { this.show(); }} 
                                    className="btn button_show_bookings button-filter"
                                >
                                    {strings.show}
                                </button>
                                <button className="btn button_decline button-filter right_button" onClick={() => { this.reset(); }}>
                                    {strings.reset}
                                </button>
                            </div>                            
                        </>
                    : null }
                </div>
            );
        } else {
         return (<></>);
        }
    }

}

const mapStateToProps = state => {
    return {
        offices:   state.offices,
        buildings: state.buildings,
        floors:    state.floors
    };
};

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(ObjectItemsFilterSidebar);