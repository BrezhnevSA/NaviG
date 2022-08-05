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
import * as rbac   from '../../../rbac/rbac';
import * as rights from '../../../constants/Rights';

import LocalizedStrings from 'react-localization';

import './FilterWorkTypeSidebar.css';

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
        work_type: "Work type",
        flex: "Flex",
        hybrid: "Hybrid",
        no_work_type: "No work type",
        dekret: "Maternity",
        all_types: "All types",
        show: "Show",
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
        work_type: "Формат работы",
        flex: "Flex",
        hybrid: "Hybrid",
        no_work_type: "Не выбран",
        dekret: "Декрет",
        all_types: "Все форматы",
        show: "Показать",
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
        work_type: "Arbeitstyp",
        flex: "Flex",
        hybrid: "Hybrid",
        no_work_type: "Kein Arbeitstyp",
        dekret: "Mutterschaft",
        all_types: "Alle Typen",
        show: "Zeigen",
    }
});

class FilterWorkTypeSidebar extends Component {

    notify = () => {
        toast.success("Changes Saved!", {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        this.state= {
            all_types: true,
            flex: true,
            hybrid: true,
            no_work_type: true,
            dekret: true,
        }

        this.handleAlltypesChange = this.handleAlltypesChange.bind(this);
        this.handleDekretChange = this.handleDekretChange.bind(this);
        this.handleFlexChange = this.handleFlexChange.bind(this);
        this.handleHybridChange = this.handleHybridChange.bind(this);
        this.handleNoWorkTypeChange = this.handleNoWorkTypeChange.bind(this);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    closeSidebarClick() {
        this.props.closeSidebar();
    }

    handleFlexChange(){
        this.setState({ 
            flex: !this.state.flex,
            all_types: !this.state.flex == true && this.state.hybrid && this.state.no_work_type && this.state.dekret
        });
    }

    handleHybridChange(){
        this.setState({ 
            hybrid: !this.state.hybrid,
            all_types: !this.state.hybrid == true && this.state.flex && this.state.no_work_type && this.state.dekret 
        });
    }

    handleNoWorkTypeChange(){
        this.setState({ 
            no_work_type: !this.state.no_work_type,
            all_types: !this.state.no_work_type == true && this.state.hybrid && this.state.flex && this.state.dekret 
        });
    }

    handleDekretChange(){
        this.setState({ 
            dekret: !this.state.dekret,
            all_types: !this.state.dekret == true && this.state.hybrid && this.state.no_work_type && this.state.flex 
        });
    }

    handleAlltypesChange(){
        this.setState({ 
            all_types: !this.state.all_types,
            flex: !this.state.all_types,
            hybrid: !this.state.all_types,
            no_work_type: !this.state.all_types,
            dekret: !this.state.all_types,
        });
    }

    render() {
        const { filter_sidebar_show } = this.props;
        const { flex, hybrid, no_work_type, dekret, all_types } = this.state;
        return (            
            <div id="FilterWorkTypesSidebar"
                className={filter_sidebar_show ? "" : "d-none"}>
                
                {filter_sidebar_show ? 
                    <>
                        <div id="closeSidebar" onClick={() => this.closeSidebarClick()}>
                            <img id="close_icon" src="/img/pics/close_sidebar.svg"></img>
                        </div>  
                    </>
                : null }
                <h1 id="headerSidebar">{strings.filter}</h1>
                <div style={{marginTop: "20px"}}>
                    <div id="secondHeaderSidebar"><span>{strings.work_type}</span></div>
                </div>
                <div>
                    <img onClick={(e) => { this.handleAlltypesChange() }} src={`/img/pics/checkbox_${all_types}.svg`}></img>
                    <span className="building_item_a" onClick={(e) => { this.handleAlltypesChange() }}>
                        {strings.all_types}
                    </span>
                </div>
                <div>
                    <img onClick={(e) => { this.handleFlexChange() }} src={`/img/pics/checkbox_${flex}.svg`}></img>
                    <span className="building_item_a" onClick={(e) => { this.handleFlexChange() }}>
                        {strings.flex}
                    </span>
                </div>
                <div>
                    <img onClick={(e) => { this.handleHybridChange() }} src={`/img/pics/checkbox_${hybrid}.svg`}></img>
                    <span className="building_item_a" onClick={(e) => { this.handleHybridChange() }}>
                        {strings.hybrid}
                    </span>
                </div>
                <div>
                    <img onClick={(e) => { this.handleNoWorkTypeChange() }} src={`/img/pics/checkbox_${no_work_type}.svg`}></img>
                    <span className="building_item_a" onClick={(e) => { this.handleNoWorkTypeChange() }}>
                        {strings.no_work_type}
                    </span>
                </div>
                <div>
                    <img onClick={(e) => { this.handleDekretChange() }} src={`/img/pics/checkbox_${dekret}.svg`}></img>
                    <span className="building_item_a" onClick={(e) => { this.handleDekretChange() }}>
                        {strings.dekret}
                    </span>
                </div>
                <div className="show_div_filter_work_types" style={{marginTop: "24.5px"}}>
                    <button 
                        onClick={() => {
                            this.props.filterEmployees(flex, hybrid, no_work_type, dekret); 
                            this.closeSidebarClick();
                        }} 
                        className="btn button_show_bookings"
                    >
                        {strings.show}
                    </button>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(FilterWorkTypeSidebar);