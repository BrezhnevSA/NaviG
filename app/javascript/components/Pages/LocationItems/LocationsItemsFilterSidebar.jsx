import React, { Component }   from 'react';
import { connect }            from "react-redux";
import { toast }              from 'react-toastify';
import { Accordion  }         from "react-bootstrap";
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { Button, Label }      from 'reactstrap';
import { Multiselect }        from 'multiselect-react-dropdown';

import { getPageOfContracts } from '../../../actions/ContractActions';

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
        locationtype: "Location type",
        company: "Company",
        status_fix: "Fixing",
        status_work: "Works",
        dt: "DT (Deutsche Telekom)",
        ts: "TS (T-Systems)",
        dt_gbs: "DT GBS",
        not_set_company: "Not set",
        selectAll: "Select all",
        selected: "Selected ",
        select_contract: "Select Contract",
        contract: "Contract",
        square: "Square"
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
        locationtype: "Тип помещения",
        company: "Компания",
        status_fix: "В ремонте",
        status_work: "Работает",
        dt: "DT (Deutsche Telekom)",
        ts: "TS (T-Systems)",
        dt_gbs: "DT GBS",
        not_set_company: "Не заполнено",
        selectAll: "Выбрать все",
        selected: "Выбрано ",
        select_contract: "Выберите Контракт",
        contract: "Название Контракта",
        square: "Площадь"
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
        locationtype: "Orttyp",
        company: "Begleitung",
        status_fix: "Behebung",
        status_work: "Funktioniert",
        dt: "DT (Deutsche Telekom)",
        ts: "TS (T-Systems)",
        dt_gbs: "DT GBS",
        not_set_company: "Nicht eingestellt",
        selectAll: "",
        selected: "Ausgewählt ",
        select_contract: "Vertrag auswählen",
        contract: "Vertrag",
        square: "Quadrat"
    }
});


const Placeholder = props => {
    return <components.Placeholder {...props} />;
};

const NOT_SET = "not_set"; 

const companies = [
    ...app_settings.COMPANIES.map(el => { return { header: el, value: true } }),
    { header: NOT_SET, value: true }
]

class LocationsItemsFilterSidebar extends Component {

    notify = () => {
        toast.success("Changes Saved!", {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);
        this.state= {
            active_office: null,
            checkbox_offices: this.props.checkbox_offices,
            checkbox_buildings: this.props.checkbox_buildings,
            selected_tab_id: this.props.key_ == undefined ? -1 : this.props.key_,
            objects_opened: true,
            company_: this.props.company_ && this.props.company_.length > 0 
                ? this.props.company_ 
                : companies,
            contract_selected: [],
            firstLoad: true,
            square_from: 0.0,
            square_to: 0.0,
        }

        this.handleTabChangeChange        = this.handleTabChangeChange.bind(this);
        this.handleOfficeCheckboxChange   = this.handleOfficeCheckboxChange.bind(this);
        this.handleBuildingCheckboxChange = this.handleBuildingCheckboxChange.bind(this);
        this.handleObjectsChange          = this.handleObjectsChange.bind(this);
        this.handleCompanyChange          = this.handleCompanyChange.bind(this);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        this.props.getPageOfContracts(0, 0, {}, "", "");
    }

    componentWillReceiveProps(nextProps) {
        const { offices, buildings } = this.props;
        const { firstLoad, checkbox_offices, checkbox_buildings } = this.state;
        
        if (checkbox_offices.length === 0 && offices && offices.length > 0) {
            let checkbox_offices = [];
            offices.map(office => checkbox_offices.push({id: office.id, value: true}));
            this.setState({ checkbox_offices: checkbox_offices, contract_selected: [] });
        }

        if (checkbox_buildings.length === 0 && buildings && buildings.length > 0) {
            let checkbox_buildings = [];
            buildings.map(building => checkbox_buildings.push({id: building.id, value: true, office_id: building.office_id}));
            this.setState({ checkbox_buildings: checkbox_buildings, contract_selected: [] });
        }

        if (firstLoad && !nextProps.contracts.isFetching) {
            this.setState({
                contract_selected: this.props.contract_selected == null 
                    ? [
                        { id: -1, name: strings.selectAll },
                        ...nextProps.contracts.items.map(v => { return { id: v['id'], name: v['name'] } })
                      ]
                    : this.props.contract_selected
                ,
                firstLoad: false
            })
        }

        if (this.props.key_ !== nextProps.key_) {
            this.setState({ selected_tab_id: nextProps.key_ })
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

     
    handleCostcenterChange(selectedList, selectedItem) {
        if (selectedItem.id == -1) {
            this.setState({ contract_selected: [
                { id: -1, name: strings.selectAll },
                ...this.props.contracts.items.filter(v => v['id'] !== 1).map(v => {
                    return { id: v['id'], name: v['name'] }
                })
            ] });
        } else {
            this.setState({ contract_selected: selectedList });
        }
    }

    deleteCostcenterChange(selectedList, removedItem) {
        if (removedItem.id == -1) {
            this.setState({ contract_selected: [] });
        } else {
            this.setState({ contract_selected: selectedList });
        }
    }

    filterRenderer_(tabId, column) {
        const { filtersVal } = this.props;
        const fv = filtersVal.find(e => e.field === column && e.tabId === tabId);
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
                        id={`text-filter-column-${column}-${tabId}-${Math.random()}`}
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

    handleCompanyChange(header) {
        this.setState({
            company_: this.state.company_.map(f => {
                if (f.header == header) {
                    f.value = !f.value;
                }
                return f;
            })
        })
    
    }

    reset() {
        const { checkbox_offices, checkbox_buildings } = this.state;
        this.setState({
            selected_tab_id: this.props.key_ == undefined ? -1 : this.props.key_,
            checkbox_offices: checkbox_offices.map(c => { c.value = true; return c; }),
            checkbox_buildings: checkbox_buildings.map(c => { c.value = true; return c; }),
            company_: companies,
            contract_selected: [
                { id: -1, name: strings.selectAll },
                ...this.props.contracts.items.filter(v => v['id'] !== 1).map(v => {
                    return { id: v['id'], name: v['name'] }
                })
            ],
            square_from: 0.0,
            square_to: 0.0,
        })
    }

    show() {
        const { buildings, key_ } = this.props;
        const { checkbox_offices, checkbox_buildings, selected_tab_id, company_,contract_selected, square_from, square_to } = this.state;
        let companies = company_.map(s => {
            let s_ = JSON.parse(JSON.stringify(s))
            return s_.header == app_settings.COMPANIES[0] && s_.value 
                ? app_settings.COMPANIES[0]
                : s_.header == app_settings.COMPANIES[1] && s_.value
                    ? app_settings.COMPANIES[1]
                    :  s_.header == app_settings.COMPANIES[2] && s_.value
                        ? s_.header == app_settings.COMPANIES[2]
                        : s_.header == NOT_SET && s_.value
                            ? 'null_on'
                            : 'null_off'
        })
        let filtered_filters = this.props.filtersVal.filter(e => e.tabId == key_).map(e => {
            e.value = this[`ref_${e.field}_${e.tabId}`] ? this[`ref_${e.field}_${e.tabId}`].value : e.value;
            return e;
        }).filter(e => e.value)
        let filters = [
            ...filtered_filters,
            buildings.length == (checkbox_buildings.filter(c => c.value).length - 1) 
                ? null
                : { field: "building_id", value: checkbox_buildings.map(s => s.value ? s.id : null).filter(s => s).join(',')},
                { 
                    field: `${app_settings.COMPANY_ID}-Location`, 
                    value: companies.toString()
                },
                contract_selected.length <= 0 
                    ? null
                    : { 
                        field: `${app_settings.CONTRACT_ID}-Location`, 
                        value: contract_selected.find(s => s.id == "-1") !== undefined
                            ? "-1"
                            : contract_selected.map(s => s.id).join(',')
                      },
                      ,
                !!square_from && !!square_to && square_from > 0.0 && square_to > 0.0 
                    ? { field: `${app_settings.SQUARE_ID}-Location`, value: `${square_from},${square_to}`} 
                    : null,
        ].filter(f => f);
        this.props.filterLocationsItems(filters, checkbox_offices, checkbox_buildings, selected_tab_id, company_, contract_selected); 
        this.closeSidebarClick();
    }

    handleOfficeCheckboxChange(id) {
        this.setState({
            checkbox_offices: this.state.checkbox_offices.map(e => {
                if (e.id === id) { 
                    e.value = !e.value; 
                    this.setState({
                        checkbox_buildings: this.state.checkbox_buildings.map(p => {
                            if (p.office_id === e.id) {
                                p.value = e.value;
                            }
                            return p;
                        })
                    });
                }
                return e;
            })
        })
    }

    handleBuildingCheckboxChange(id) {
        let all_false = 0;
        let all_true = 0;
        let all = 0;
        let office_id = this.state.checkbox_buildings.find(e => e.id === id).office_id;
        this.setState({
            checkbox_buildings: this.state.checkbox_buildings.map(e => {
                if (e.id === id) { 
                    e.value = !e.value; 
                    office_id = e.office_id;
                    this.state.checkbox_buildings.map(o => {
                        if (o.office_id === e.office_id && ((o.value && o.id !== e.id) || (o.value && o.id === e.id) )) {
                            all_false++;
                        }
                        if (o.office_id === e.office_id && ((o.value && o.id !== e.id) || (!o.value && o.id === e.id) )) {
                            all_true++;
                        }
                    })
                }
                if (e.office_id === office_id) { all++; }
                return e;
            }),
            checkbox_offices: all_true === all && all_true > 0
                ? this.state.checkbox_offices.map(o => { 
                     if (o.id === office_id) {
                         o.value = false;
                     }
                     return o;
                  })
                : all_false === all && all_false > 0
                    ? this.state.checkbox_offices.map(o => { 
                        if (o.id === office_id) {
                            o.value = true;
                        }
                        return o;
                      })
                    : this.state.checkbox_offices
        })
    }

    handleObjectsChange(objects_opened) {
        this.setState({ objects_opened })
    }

    render() {
        const { 
            filter_sidebar_show, 
            offices, 
            buildings, 
            tabs, 
            key_, 
            columns, 
            contracts 
        } = this.props;
        const { 
            contract_selected, 
            active_office, 
            checkbox_offices, 
            checkbox_buildings, 
            selected_tab_id, 
            objects_opened, 
            company_ , 
            square_from, 
            square_to 
        } = this.state;

        if (checkbox_offices.length > 0 && checkbox_buildings.length > 0 && !contracts.isFetching) {
            let contract_options = [ 
                { id: -1, name: strings.selectAll }, 
                ...contracts.items.map(v => { return { id: v['id'], name: v['name']} }) 
            ];

            const CustomToggleOffice = ({ children, eventKey }) => {
                const decoratedOnClick = useAccordionToggle(eventKey, () =>
                    this.setState({ active_office: active_office === eventKey ? null : eventKey })
                );            
                return (
                    <div className="tab_accordion" onClick={decoratedOnClick}>                    
                        <img 
                            id={ children.id + "_office_checkbox" }
                            src={`/img/pics/checkbox_${checkbox_offices.find(e => e.id === children.id).value}.svg`} 
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
            const CustomToggleObject = ({ children, eventKey }) => {
                const decoratedOnClick = useAccordionToggle(eventKey, () =>
                    this.setState({ objects_opened: !objects_opened })
                );             
                return (
                    <div className="tab_accordion" onClick={decoratedOnClick}>                    
                        <div id="secondHeaderSidebar" style={{'display': 'inline-block'}} onClick={ (e) => { this.handleObjectsChange(!objects_opened); } }>
                            <span>{strings.locationtype}</span>
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
                                            {offices.map(office =>
                                                <>
                                                    <CustomToggleOffice  eventKey={office.id} >
                                                        {office}
                                                    </CustomToggleOffice>
                                                    <Accordion.Collapse eventKey={office.id} className="tab_content text-left">
                                                    <Accordion>
                                                            {buildings.filter(building => building.office_id === office.id).map(building =>
                                                                <p>
                                                                    <img 
                                                                        id={ building.id + "_building_checkbox" }
                                                                        src={`/img/pics/checkbox_${checkbox_buildings.find(e => e.id === building.id).value}.svg`} 
                                                                        className="input_checkbox" 
                                                                        onClick={ (e) => { this.handleBuildingCheckboxChange(building.id); } }
                                                                    ></img>
                                                                    <span className="building_item_a">
                                                                        {building.name}
                                                                    </span>
                                                                </p>
                                                            )}
                                                    </Accordion>
                                                    </Accordion.Collapse>
                                                </>
                                            )}
                                    </Accordion>                                    
                                </div>
                            : <></>}                             
                            <div style={{marginTop: "40px"}}>
                                <div id="secondHeaderSidebar"><span>{strings.company}</span></div>
                                <div style={{ marginBottom: '5px' }}>
                                    <img 
                                        id="archive_booking_checkbox"
                                        src={`/img/pics/checkbox_${company_.find(f => f.header == app_settings.COMPANIES[0]).value}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleCompanyChange(app_settings.COMPANIES[0]); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleCompanyChange(app_settings.COMPANIES[0]); } }
                                    >{strings.dt}</span>
                                </div>   
                                <div style={{ marginBottom: '5px' }}>
                                    <img 
                                        id="archive_booking_checkbox"
                                        src={`/img/pics/checkbox_${company_.find(f => f.header == app_settings.COMPANIES[1]).value}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleCompanyChange(app_settings.COMPANIES[1]); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleCompanyChange(app_settings.COMPANIES[1]); } }
                                    >{strings.ts}</span>
                                </div> 
                                <div style={{ marginBottom: '5px' }}>
                                    <img 
                                        id="archive_booking_checkbox"
                                        src={`/img/pics/checkbox_${company_.find(f => f.header == app_settings.COMPANIES[2]).value}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleCompanyChange(app_settings.COMPANIES[2]); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleCompanyChange(app_settings.COMPANIES[2]); } }
                                    >{strings.dt_gbs}</span>
                                </div> 
                                <div style={{ marginBottom: '5px' }}>
                                    <img 
                                        id="archive_booking_checkbox"
                                        src={`/img/pics/checkbox_${company_.find(f => f.header == NOT_SET).value}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleCompanyChange(NOT_SET); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleCompanyChange(NOT_SET); } }
                                    >{strings.not_set_company}</span>
                                </div>
                            </div>
                            {/* { columns.find(c => c.id === key_) 
                                ? columns.find(c => c.id === key_).items.filter(function({dataField}) {
                                        var key = `${dataField}`;
                                        return !this.has(key) && this.add(key);
                                    }, new Set).map(i => {
                                        if (i.filter_external) {
                                            return <div style={{marginTop: "40px"}}>  
                                                    <div id="secondHeaderSidebar"><span>{i.text}</span></div>
                                                        {this.filterRenderer_(key_, i.dataField)}
                                                    </div>
                                    } else {
                                        return null;
                                    }
                                    }).filter(o => o)
                                : <></>
                            } */}
                            <div style={{marginTop: "20px"}}>
                                <div id="secondHeaderSidebar"><span>{strings.contract}</span></div>
                                <div className="select_custom_">
                                    <Multiselect
                                        options={contract_options} 
                                        selectedValues={contract_selected} 
                                        onSelect={(selectedList, selectedItem) => { this.handleCostcenterChange(selectedList, selectedItem) }} 
                                        onRemove={(selectedList, removedItem) => { this.deleteCostcenterChange(selectedList, removedItem) }} 
                                        displayValue="name" 
                                        showCheckbox={true}
                                        closeOnSelect={false}
                                        showArrow={true}
                                        style={{ chips: { display: "none" }, option: { fontSize: "14pt" } }}
                                        placeholder={`${contract_selected.length > 0 
                                            ? strings.selected + " " + contract_selected.length
                                            : strings.select_contract}`
                                        }
                                    />
                                </div>
                            </div>
                            <div style={{marginTop: "20px"}}>
                                <div id="secondHeaderSidebar"><span id="secondHeaderSidebar">{strings.square}</span></div>
                                <div className="div-input-filter">
                                    <input type="number"
                                        name="square_from"
                                        id="square_from"
                                        value={square_from}
                                        className={`input-employee-not-in-app ${!!square_from ? "black_text" : ""} input-filter nums-filter nums-filter-left`}
                                        placeholder={strings.placeholder_sqrfrom}
                                        onChange={(e) => { this.setState({ square_from: e.target.value })}} />
                                    <input type="number"
                                        name="square_to"
                                        id="square_to"
                                        value={square_to}
                                        className={`input-employee-not-in-app ${!!square_to ? "black_text" : ""} input-filter nums-filter `}
                                        placeholder={strings.placeholder_sqrto}
                                        onChange={(e) => { this.setState({ square_to: e.target.value })}} />
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
        contracts: state.contracts
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getPageOfContracts: (page, sizePerPage, filters, sortField, sortOrder) => dispatch(getPageOfContracts(page, sizePerPage, filters, sortField, sortOrder)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(LocationsItemsFilterSidebar);