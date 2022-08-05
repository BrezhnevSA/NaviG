import React, { Component }   from 'react';
import { connect }            from "react-redux";
import { Button, Label }      from 'reactstrap';
import { toast }              from 'react-toastify';
import { Accordion  }         from "react-bootstrap";
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { Multiselect } from 'multiselect-react-dropdown';
import { searchAllCostcenters } from '../../../../../actions/SearchActions';
import DatePicker from "react-datepicker";

import LocalizedStrings from 'react-localization';

import './FilterSidebar.css';

let strings = new LocalizedStrings({
    en:{
        filter: "Filter",
        bdandoffcie: "BC and Corps",
        status: "Status",
        archieve: "Archieve",
        current: "Current",
        costcenter: "Costcenter",
        all: "All",
        show: "Show",
        selected: "Selected ",
        select_costcenter: "Select Costcenter",
        selectAll: "Select all",
        dateStart: "Start date",
        dateEnd: "End date",
        changeDate: "Date of changes",
        employeeFilter: "Last name and First name",
        input_ns: "Enter last name, first name"
    },
    ru: {
        filter: "Фильтр",
        bdandoffcie: "БЦ и Корпус",
        status: "Статус",
        archieve: "Архив",
        current: "Текущее",
        costcenter: "МВЗ",
        all: "Все",
        show: "Показать",
        selected: "Выбрано ",
        select_costcenter: "Выберите МВЗ",
        selectAll: "Выбрать все",
        dateStart: "Дата начала",
        dateEnd: "Дата окончания",
        changeDate: "Дата изменений",
        employeeFilter: "Фамилия и Имя",
        input_ns: "Введите фамилию, имя"
    },
    de: {
        filter: "Filter",
        bdandoffcie: "BC und Corps",
        status: "Status",
        archieve: "Archiv",
        current: "Aktuell",
        costcenter: "Costcenter",
        all: "Alles",
        show: "Zeigen",
        selected: "Ausgewählt ",
        select_costcenter: "Costcenter auswählen",
        selectAll: "",
        dateStart: "Anfangsdatum",
        dateEnd: "Endtermin",
        changeDate: "Datum der Änderungen",
        employeeFilter: "Nachname und Vorname",
        input_ns: "Geben Sie Nachname, Vorname ein"
    }
});


const Placeholder = props => {
    return <components.Placeholder {...props} />;
};

class FilterSidebar extends Component {

    notify = () => {
        toast.success("Changes Saved!", {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        this.state= {
            active_office: null,
            checkbox_offices: [],
            checkbox_buildings: [],
            archive_booking: true,
            current_booking: true,
            costcenter_selected: [],
            firstLoad: true,
            dateStart: '',
            dateEnd: '',
            name_surname: ''
        }

        this.handleOfficeCheckboxChange   = this.handleOfficeCheckboxChange.bind(this);
        this.handleBuildingCheckboxChange = this.handleBuildingCheckboxChange.bind(this);
        this.handleCostcenterChange       = this.handleCostcenterChange.bind(this);
        this.deleteCostcenterChange       = this.deleteCostcenterChange.bind(this);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        this.props.searchAllCostcenters();
    }

    componentWillReceiveProps(nextProps) {
        const { offices, buildings } = this.props;
        const { checkbox_offices, checkbox_buildings, firstLoad } = this.state;
        
        if (checkbox_offices.length === 0 && offices && offices.length > 0) {
            let checkbox_offices = [];
            offices.map(office => checkbox_offices.push({id: office.id, value: true}));
            this.setState({ checkbox_offices: checkbox_offices, costcenter_selected: [] });
        }

        if (checkbox_buildings.length === 0 && buildings && buildings.length > 0) {
            let checkbox_buildings = [];
            buildings.map(building => checkbox_buildings.push({id: building.id, value: true, office_id: building.office_id}));
            this.setState({ checkbox_buildings: checkbox_buildings, costcenter_selected: [] });
        }

        if (firstLoad && nextProps.search.costcenters_all && nextProps.search.costcenters_all.length > 0) {
            this.setState({
                costcenter_selected: [
                    { id: -1, name: strings.selectAll },
                    ...nextProps.search.costcenters_all.filter(v => v['id'] !== 1).map(v => {
                        return { id: v['number'], name: `${v['name']} (${v['number']})` }
                    })
                ],
                firstLoad: false
            })
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    closeSidebarClick() {
        this.props.closeSidebar();
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

    handleArchieveBookingCheckboxChange() {
        this.setState({ archive_booking: !this.state.archive_booking });
    }

    handleCurrentBookingCheckboxChange() {
        this.setState({ current_booking: !this.state.current_booking });
    }

    handleCostcenterChange(selectedList, selectedItem) {
        if (selectedItem.id == -1) {
            this.setState({ costcenter_selected: [
                { id: -1, name: strings.selectAll },
                ...this.props.search.costcenters_all.filter(v => v['id'] !== 1).map(v => {
                    return { id: v['number'], name: `${v['name']} (${v['number']})` }
                })
            ] });
        } else {
            this.setState({ costcenter_selected: selectedList });
        }
    }

    deleteCostcenterChange(selectedList, removedItem) {
        if (removedItem.id == -1) {
            this.setState({ costcenter_selected: [] });
        } else {
            this.setState({ costcenter_selected: selectedList });
        }
    }

    onDateStartChange(dateStart) {
        this.setState({dateStart: dateStart})
    }

    onDateEndChange(dateEnd) {
        this.setState({dateEnd: dateEnd});
    }

    render() {
        const { filter_sidebar_show, offices, buildings, search } = this.props;
        const { 
            active_office, 
            checkbox_offices, 
            checkbox_buildings, 
            archive_booking, 
            current_booking, 
            costcenter_selected,
            dateStart,
            dateEnd,
            name_surname
         } = this.state;

        if (checkbox_offices.length > 0 && checkbox_buildings.length > 0 && search.costcenters_all && search.costcenters_all.length > 0) {
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
                            className={`vector_accordion ${active_office === children.id ? "rotate_vector" : " " }`}
                        ></img>
                    </div>
                );
            }

            let costcenters_options = [ { id: -1, name: strings.selectAll } ];
            costcenters_options.push(...search.costcenters_all.filter(v => v['id'] !== 1).map(v => {
                return { id: v['number'], name: `${v['name']} (${v['number']})` }
            }));
            return (            
                <div id="InfoSidebar"
                    className={filter_sidebar_show ? "" : "d-none"}>
                    
                    {filter_sidebar_show ? 
                        <>
                            <div id="closeSidebar" onClick={() => this.closeSidebarClick()}>
                                <img id="close_icon" src="/img/pics/close_sidebar.svg"></img>
                            </div>  
                            <h1 id="headerSidebar">{strings.filter}</h1>
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
                                <div id="secondHeaderSidebar"><span id="secondHeaderSidebar">{strings.status}</span></div>
                                <div style={{ marginBottom: '5px' }}>
                                    <img 
                                        id="archive_booking_checkbox"
                                        src={`/img/pics/checkbox_${archive_booking}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleArchieveBookingCheckboxChange(); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleArchieveBookingCheckboxChange(); } }
                                    >{strings.archieve}</span>
                                </div>
                                <div>
                                    <img 
                                        id="current_booking__checkbox"
                                        src={`/img/pics/checkbox_${current_booking}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleCurrentBookingCheckboxChange(); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleCurrentBookingCheckboxChange(); } }
                                    >{strings.current}</span>
                                </div>
                            </div>
                            <div style={{marginTop: "40px"}}>
                                <h2 id="secondHeaderSidebar">{strings.employeeFilter}</h2>
                                <Label
                                    className='filter-label fl-lb'
                                    for="text-filter-employee_label"
                                    onClick={(e) => { e.stopPropagation();e.nativeEvent.stopImmediatePropagation(); }}
                                >
                                    <input
                                        name="text-filter-employee_label"
                                        type="text"
                                        className="filter text-filter form-control"
                                        id="text-filter-employee_label"
                                        defaultValue=""
                                        value={name_surname}
                                        onChange={(e) => {this.setState({name_surname: e.target.value})}}
                                        placeholder={strings.input_ns}
                                    />
                                </Label>
                            </div>
                            <div style={{marginTop: "40px"}}>
                                <h2 id="secondHeaderSidebar">{strings.changeDate}</h2>
                                <span className="heart-beats-filter-sidebar-date-container">
                                    <DatePicker
                                        dateFormat="dd.MM.yyyy"
                                        selected={dateStart}
                                        onChange={date => {this.onDateStartChange(date)}}
                                        popper
                                        selectsStart
                                        startDate={dateStart}
                                        isClearable
                                        locale={localStorage.getItem('lang') === 'RU'
                                            ? 'ru'
                                            : localStorage.getItem('lang') === 'US'
                                                ? 'en'
                                                : localStorage.getItem('lang') === 'DE'
                                                    ? 'de'
                                                    : 'ru'
                                        }
                                        placeholderText={strings.dateStart}
                                    />
                                    <span className="heart-beats-filter-sidebar-date-container-end">
                                        <DatePicker
                                            dateFormat="dd.MM.yyyy"
                                            selected={dateEnd}
                                            onChange={date => {this.onDateEndChange(date)}}
                                            popperPlacement="left-start"
                                            popperModifiers={{
                                                offset:{
                                                    enabled: true,
                                                    offset: "35px, -5px"
                                                }
                                            }}
                                            selectsEnd
                                            startDate={dateStart}
                                            isClearable
                                            locale={localStorage.getItem('lang') === 'RU'
                                                ? 'ru'
                                                : localStorage.getItem('lang') === 'US'
                                                    ? 'en'
                                                    : localStorage.getItem('lang') === 'DE'
                                                        ? 'de'
                                                        : 'ru'
                                            }
                                            placeholderText={strings.dateEnd}
                                        />
                                    </span>
                                </span>
                            </div>
                            <div style={{marginTop: "20px"}}>
                                <div id="secondHeaderSidebar"><span>{strings.costcenter}</span></div>
                                <div className="select_custom_">
                                    <Multiselect
                                        options={costcenters_options} 
                                        selectedValues={costcenter_selected} 
                                        onSelect={(selectedList, selectedItem) => { this.handleCostcenterChange(selectedList, selectedItem) }} 
                                        onRemove={(selectedList, removedItem) => { this.deleteCostcenterChange(selectedList, removedItem) }} 
                                        displayValue="name" 
                                        showCheckbox={true}
                                        closeOnSelect={false}
                                        showArrow={true}
                                        style={{ chips: { display: "none" }, option: { fontSize: "14pt" } }}
                                        placeholder={`${costcenter_selected.length > 0 ? strings.selected + " " + costcenter_selected.length : strings.select_costcenter}`}
                                    />
                                </div>
                            </div>
                            <div className="show_div_filter_bbokings" style={{marginTop: "40px"}}>
                                <button 
                                    onClick={() => {
                                        this.props.filterBookings(checkbox_buildings, archive_booking, current_booking, costcenter_selected, dateStart, dateEnd, name_surname); 
                                        this.closeSidebarClick();
                                    }} 
                                    className="btn button_show_bookings"
                                >
                                    {strings.show}
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
        search:    state.search
    };
};

function mapDispatchToProps(dispatch) {
    return {
        searchAllCostcenters: () => dispatch(searchAllCostcenters()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(FilterSidebar);