import React, { Component } from 'react';
import { connect }          from "react-redux";

import { Link }             from 'react-router-dom';

import { Col, Row, Button, Form, FormGroup, Label, Input, CustomInput, FormFeedback } from 'reactstrap';
import AvatarEditor           from 'react-avatar-editor';
import queryString            from 'query-string';
import { toast }              from 'react-toastify';
import { Accordion  }         from "react-bootstrap";
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { Multiselect } from 'multiselect-react-dropdown';
import { searchAllCostcenters } from '../../../actions/SearchActions';

import LocalizedStrings from 'react-localization';

// import './FilterSidebar.css';

let strings = new LocalizedStrings({
    en:{
        filter: "Filter",
        costcenter: "Costcenter",
        all: "All",
        show: "Show",
        selected: "Selected ",
        select_costcenter: "Select Costcenter",
        selectAll: "Select all",
        work_type: "Work type",
        flex: "Flex",
        hybrid: "Hybrid",
        notype: "Without type",
        status: "Status",
        maternity: "Decree",
        regular: "Regular",
        nocity: "Without city",
        city: "City",
        wiw: "Wiw",
        surnamename: "Surname and Name",
        placeholder_wiw: "Enter wiw",
        placeholder_snn: "Enter your last name, first name",
        reset: "Reset"
    },
    ru: {
        filter: "Фильтр",
        costcenter: "МВЗ",
        all: "Все",
        show: "Показать",
        selected: "Выбрано ",
        select_costcenter: "Выберите МВЗ",
        selectAll: "Выбрать все",
        work_type: "Формат работы",
        flex: "Flex",
        hybrid: "Hybrid",
        notype: "Без формата",
        status: "Статус",
        maternity: "Декрет",
        regular: "Регулярный",
        nocity: "Без города",
        city: "Город",
        wiw: "Wiw",
        surnamename: "Фамилия Имя",
        placeholder_wiw: "Введите wiw",
        placeholder_snn: "Введите фамилию, имя",
        reset: "Сбросить"
    },
    de: {
        filter: "Filter",
        costcenter: "Costcenter",
        all: "Alles",
        show: "Zeigen",
        selected: "Ausgewählt ",
        select_costcenter: "Costcenter auswählen",
        selectAll: "",
        work_type: "Arbeitstyp",
        flex: "Flex",
        hybrid: "Hybrid",
        notype: "Ohne Typ",
        status: "Status",
        maternity: "Dekret",
        regular: "Regelmäßig",
        nocity: "Ohne Stadt",
        city: "Stadt",
        wiw: "Wiw",
        surnamename: "Nachname und Vorname",
        placeholder_wiw: "Geben Sie wiw ein",
        placeholder_snn: "Geben Sie Ihren Nachnamen, Vornamen ein",
        reset: "Zurücksetzen"
    }
});


const Placeholder = props => {
    return <components.Placeholder {...props} />;
};

class EmployeesFilterSidebar extends Component {

    notify = () => {
        toast.success("Changes Saved!", {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        this.state= {
            checkbox_cities: [],
            format_work: [{ format: 'H', value: true }, { format: 'F', value: true }, { format: '-', value: true }],
            statuses: [{ status: 'REGULAR', value: true }, { status: 'MATERNITY', value: true }],
            firstLoad: true,
            wiw: "",
            surnamename: "",
            costcenter_selected: []
        }

        this.handleFormatTypeChange = this.handleFormatTypeChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleCostcenterChange = this.handleCostcenterChange.bind(this);
        this.deleteCostcenterChange = this.deleteCostcenterChange.bind(this);
        this.handleCityCheckboxChange = this.handleCityCheckboxChange.bind(this);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        this.props.searchAllCostcenters();
    }

    componentWillReceiveProps(nextProps) {
        const { cities } = this.props;
        const { firstLoad, checkbox_cities } = this.state;
        
        if (checkbox_cities.length === 0 && cities && cities.length > 0) {
            let checkbox_cities = [];
            cities.map(city => checkbox_cities.push({id: city.id, value: true }));
            checkbox_cities.push({id: -1, value: true});
            this.setState({ checkbox_cities: checkbox_cities, costcenter_selected: [] });
        }

        if (firstLoad && nextProps.search.costcenters_all && nextProps.search.costcenters_all.length > 0) {
            this.setState({
                costcenter_selected: this.props.costcenter_selected == null 
                    ? [
                        { id: -1, name: strings.selectAll },
                        ...nextProps.search.costcenters_all.filter(v => v['id'] !== 1).map(v => {
                            return { id: v['number'], name: `${v['name']} (${v['number']})` }
                        })
                      ]
                    : this.props.costcenter_selected
                ,
                firstLoad: false
            })
        }
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    closeSidebarClick() {
        this.props.closeSidebar();
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

    handleFormatTypeChange(format) {
        this.setState({
            format_work: this.state.format_work.map(f => {
                if (f.format == format) {
                    f.value = !f.value;
                }
                return f;
            })
        })
    }

    handleStatusChange(status) {
        this.setState({
            statuses: this.state.statuses.map(f => {
                if (f.status == status) {
                    f.value = !f.value;
                }
                return f;
            })
        })
    }

    handleCityCheckboxChange(id) {
        this.setState({
            checkbox_cities: this.state.checkbox_cities.map(e => {
                if (e.id === id) { 
                    e.value = !e.value;
                }
                return e;
            })
        })
    }

    reset() {
        const { checkbox_cities } = this.state;
        this.setState({
            format_work: [{ format: 'H', value: true }, { format: 'F', value: true }, { format: '-', value: true }],
            statuses: [{ status: 'REGULAR', value: true }, { status: 'MATERNITY', value: true }],
            checkbox_cities: checkbox_cities.map(c => { c.value = true; return c; }),
            wiw: "",
            surnamename: "",
            costcenter_selected: [
                { id: -1, name: strings.selectAll },
                ...this.props.search.costcenters_all.filter(v => v['id'] !== 1).map(v => {
                    return { id: v['number'], name: `${v['name']} (${v['number']})` }
                })
            ]
        })
    }

    show() {
        const { cities } = this.props;
        const { checkbox_cities, format_work, statuses, wiw, surnamename, costcenter_selected } = this.state;
        let statuses_filter = statuses.map(s => s.value ? s.status : null).filter(s => s).join(',');
        let format_filter = format_work.map(s => s.value ? s.format : null).filter(s => s);
        let filters = [
            format_filter.length == 3 
                ? null
                : { field: "work_type", value: format_filter.join(',')},
            cities.length == (checkbox_cities.filter(c => c.value).length - 1) 
                ? null
                : { field: "city_id", value: checkbox_cities.map(s => s.value ? s.id : null).filter(s => s).join(',')},
            costcenter_selected.length <= 0 
                ? null
                : { 
                    field: "costcenter_num", 
                    value: costcenter_selected.find(s => s.id == "-1") !== undefined
                        ? "-1"
                        : costcenter_selected.map(s => s.id).join(',')
                  },
            !!surnamename ? { field: "surname_name", value: surnamename} : null,
            !!wiw ? { field: "login", value: wiw} : null
        ].filter(f => f)
        this.props.filterEmployees(statuses_filter, filters, costcenter_selected); 
        this.closeSidebarClick();
    }

    render() {
        const { filter_sidebar_show, search, cities } = this.props;
        const { costcenter_selected, checkbox_cities, format_work, statuses, wiw, surnamename } = this.state;
        if (search.costcenters_all && search.costcenters_all.length > 0) {
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
                            <div style={{marginTop: "40px"}}>
                                <div id="secondHeaderSidebar"><span id="secondHeaderSidebar">{strings.work_type}</span></div>
                                <div style={{ marginBottom: '5px' }}>
                                    <img 
                                        id="archive_booking_checkbox"
                                        src={`/img/pics/checkbox_${format_work.find(f => f.format == "F").value}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleFormatTypeChange("F"); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleFormatTypeChange("F"); } }
                                    >{strings.flex}</span>
                                </div>   
                                <div style={{ marginBottom: '5px' }}>
                                    <img 
                                        id="archive_booking_checkbox"
                                        src={`/img/pics/checkbox_${format_work.find(f => f.format == "H").value}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleFormatTypeChange("H"); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleFormatTypeChange("H"); } }
                                    >{strings.hybrid}</span>
                                </div>                              
                                <div>
                                    <img 
                                        id="current_booking__checkbox"
                                        src={`/img/pics/checkbox_${format_work.find(f => f.format == "-").value}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleFormatTypeChange("-"); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleFormatTypeChange("-"); } }
                                    >{strings.notype}</span>
                                </div>
                            </div>
                            <div style={{marginTop: "40px"}}>
                                <div id="secondHeaderSidebar"><span id="secondHeaderSidebar">{strings.status}</span></div>
                                <div style={{ marginBottom: '5px' }}>
                                    <img 
                                        id="archive_booking_checkbox"
                                        src={`/img/pics/checkbox_${statuses.find(f => f.status == "REGULAR").value}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleStatusChange("REGULAR"); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleStatusChange("REGULAR"); } }
                                    >{strings.regular}</span>
                                </div>   
                                <div>
                                    <img 
                                        id="archive_booking_checkbox"
                                        src={`/img/pics/checkbox_${statuses.find(f => f.status == "MATERNITY").value}.svg`} 
                                        className="input_checkbox" 
                                        onClick={ (e) => { this.handleStatusChange("MATERNITY"); } }
                                    ></img>
                                    <span 
                                        className="building_item_a" 
                                        onClick={ (e) => { this.handleStatusChange("MATERNITY"); } }
                                    >{strings.maternity}</span>
                                </div>
                            </div>
                            <div style={{marginTop: "40px"}}>
                                <div id="secondHeaderSidebar"><span id="secondHeaderSidebar">{strings.city}</span></div>
                                    {cities.map(city => 
                                        <div style={{ marginBottom: '5px' }}>
                                            <img 
                                                id="archive_booking_checkbox"
                                                src={`/img/pics/checkbox_${checkbox_cities.find(f => f.id == city.id).value}.svg`} 
                                                className="input_checkbox" 
                                                onClick={ (e) => { this.handleCityCheckboxChange(city.id); } }
                                            ></img>
                                            <span 
                                                className="building_item_a" 
                                                onClick={ (e) => { this.handleCityCheckboxChange(city.id); } }
                                            >{city.name}</span>
                                        </div>
                                    )}
                                    <div>
                                        <img 
                                            id="archive_booking_checkbox"
                                            src={`/img/pics/checkbox_${checkbox_cities.find(f => f.id == -1).value}.svg`} 
                                            className="input_checkbox" 
                                            onClick={ (e) => { this.handleCityCheckboxChange(-1); } }
                                        ></img>
                                        <span 
                                            className="building_item_a" 
                                            onClick={ (e) => { this.handleCityCheckboxChange(-1); } }
                                        >{strings.nocity}</span>
                                    </div>
                            </div>
                            <div style={{marginTop: "40px"}}>
                                <div id="secondHeaderSidebar"><span id="secondHeaderSidebar">{strings.wiw}</span></div>
                                <div className="div-input-filter">
                                    <input type="text"
                                        name="wiw"
                                        id="wiw"
                                        value={wiw}
                                        className={`input-employee-not-in-app ${!!wiw ? "black_text" : ""} input-filter`}
                                        placeholder={strings.placeholder_wiw}
                                        onChange={(e) => { this.setState({ wiw: e.target.value })}} />
                                </div>
                            </div>
                            <div style={{marginTop: "40px"}}>
                                <div id="secondHeaderSidebar"><span id="secondHeaderSidebar">{strings.surnamename}</span></div>
                                <div className="div-input-filter">
                                    <input type="text"
                                        name="surnamename"
                                        id="surnamename"
                                        value={surnamename}
                                        className={`input-employee-not-in-app ${!!surnamename ? "black_text" : ""} input-filter`}
                                        placeholder={strings.placeholder_snn}
                                        onChange={(e) => { this.setState({ surnamename: e.target.value })}} />
                                </div>
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
                                        placeholder={`${costcenter_selected.length > 0 
                                            ? strings.selected + " " + costcenter_selected.length
                                            : strings.select_costcenter}`
                                        }
                                    />
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
        cities:   state.cities,
        search:   state.search
    };
};

function mapDispatchToProps(dispatch) {
    return {
        searchAllCostcenters: () => dispatch(searchAllCostcenters()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(EmployeesFilterSidebar);