import React, { Component } from 'react';
import { toast }            from 'react-toastify';
import { connect }          from "react-redux";
import BootstrapTable       from 'react-bootstrap-table-next';
import filterFactory        from 'react-bootstrap-table2-filter';
import paginationFactory    from 'react-bootstrap-table2-paginator';
import LocalizedStrings     from 'react-localization';
import Moment               from 'react-moment';
import Select               from "react-dropdown-select";
import styled               from '@emotion/styled';
import { Col, Form, FormGroup } from 'reactstrap';

import 'moment-timezone';

import { getHeartbeats }  from '../../../actions/HeartBeatsActions';

import * as hb_colors from '../../../constants/HeartbeatsColors';

import './HeartBeatsComponent.css';
import {headerStyles, sortCaretStyle} from "../../../../../app/javascript/constants/Styles";
import HeartBeatsFilterSidebarComponent from "./Components/HeartBeatsFilterSidebar/HeartBeatsFilterSidebarComponent";
import moment from 'moment';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { processTableData } from '../../../constants/TableUtils';

let strings = new LocalizedStrings({
    en:{
        dateAndTimeOfChange: "Date and time of change",
        admin:               "Administrator",
        placeIdentification: "Place identification",
        object:              "Object",
        showing:             "Showing",
        from:                "from",
        to:                  "to",
        of:                  "of",
        results:             "Results",
        all:                 "All",
        heartbeats:          "Activity log",
        booking_creating:    "Booking creating",
        booking_editing:     "Booking editing",
        booking_removing:    "Booking removing",
        moving:              "Moving",
        moving_to_ds:        "Moving to ds",
        moving_to_gt:        "Moving to guest",
        remove_reservation:  "Remove reservation",
        removing:            "Removing",
        removing_from_ds:    "Removing from DS",
        removing_from_gt:    "Removing from guest",
        reservation:         "Reservation",
        seat:                "Seat",
        log_types:           "Log types",
        hb_types_filter:     "Log type fitler",
        select_types:        "Select log types",
        of:                  "of",
        selected:            "selected",
        logtypes:            "Log types",
        selectAll:           "Select all",
        clearAll:            "Clear all",
        noresults:           "No results",
        filter:              "Filter"
    },
    ru: {
        dateAndTimeOfChange: "Дата и время изменения",
        admin:               "Администратор",
        placeIdentification: "Идентификация места",
        object:              "Объект",
        showing:             "Отображено",
        from:                "с",
        to:                  "по",
        of:                  "из",
        results:             "всего",
        all:                 "Все",
        heartbeats:          "Лог активности",
        booking_creating:    "Бронирование создано",
        booking_editing:     "Бронирование изменено",
        booking_removing:    "Бронирование удалено",
        moving:              "Переезд",
        moving_to_ds:        "Переезд на DS",
        moving_to_gt:        "Переезд на Guest",
        remove_reservation:  "Удаление резервации",
        removing:            "Удаление",
        removing_from_ds:    "Удаление из DS",
        removing_from_gt:    "Удаление из Guest",
        reservation:         "Резервация",
        seat:                "Посадка",
        log_types:           "Типы логов",
        hb_types_filter:     "Фильтр логов",
        select_types:        "Выберите типы логов",
        of:                  "из",
        selected:            "выбрано",
        logtypes:            "Типы логов",
        selectAll:           "Выбрать всё",
        clearAll:            "Очистить всё",
        noresults:           "Нет результатов",
        filter:              "Фильтр"
    },
    de: {
        dateAndTimeOfChange: "Zeit und Ort der Änderung",
        admin:               "Admin",
        placeIdentification: "Ortsidentifikation",
        object:              "Objekt",
        showing:             "Zeigen",
        from:                "von",
        to:                  "zu",
        of:                  "von",
        results:             "Ergebnisse",
        all:                 "Alles",
        heartbeats:          "Activity log",
        booking_creating:    "Buchung erstellt",
        booking_editing:     "Buchung bearbeitet",
        booking_removing:    "Buchung gelöscht",
        moving:              "Bewegen",
        moving_to_ds:        "Umzug nach DS",
        moving_to_gt:        "Moving to guest",
        remove_reservation:  "Reservierung entfernen",
        removing:            "Entfernen",
        removing_from_ds:    "Entfernen von DS",
        removing_from_gt:    "Removing from guest",
        reservation:         "Reservierung",
        seat:                "Landung",
        log_types:           "Protokolltypen",
        hb_types_filter:     "Protokolltypfilter",
        select_types:        "Typen auswählen",
        of:                  "von",
        selected:            "ausgewählt",
        logtypes:            "Protokolltypen",
        selectAll:           "Alle auswählen",
        clearAll:            "Alle löschen",
        noresults:           "Keine Ergebnisse",
        filter:              "Filter"
    }
});

const StyledSelect = styled(Select)`
  background: #fff;
  border: #fff !important;
  color: #333;
  border: 1px solid #ccc !important;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
  .react-dropdown-select-clear,
  .react-dropdown-select-dropdown-handle {
    color: #000;
  }
  .react-dropdown-select-option {
    border: 1px solid #000;
  }
  .react-dropdown-select-item {
    color: #fff;
    font-size: small;
  }
  .react-dropdown-select-input {
    color: #000;
  }
  .react-dropdown-select-dropdown {
    position: absolute;
    left: 0;
    border: none;
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    max-height: 300px;
    overflow: auto;
    z-index: 9;
    background: #fff;
    box-shadow: none;
    color: #000 !important;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }
  .react-dropdown-select-type-multi {
    font-size: medium;
  }
  .react-dropdown-select-item {
    color: #000;
    border-bottom: 1px solid #fff;
       
    :hover {
       color: #00000080;
    }
  }
  .react-dropdown-select-item.react-dropdown-select-item-selected,
  .react-dropdown-select-item.react-dropdown-select-item-active {
    //background: #111;
    border-bottom: 1px solid #fff;
    color: #000;
    font-weight: bold;
  }
  .react-dropdown-select-item.react-dropdown-select-item-disabled {
    background: #777;
    color: #ccc;
  }
`;

const SearchAndToggle = styled.div`
  display: flex;
  flex-direction: column;
  input {
    margin: 5px 10px 0;
    line-height: 30px;
    padding: 0px 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    :focus {
      outline: none;
      border: 1px solid deepskyblue;
    }
  }
  margin-bottom: 5px;
`;

const Items = styled.div`
  overflow: auto;
  min-height: 10px;
  max-height: 200px;
`;

const Item = styled.div`
  display: flex;
  margin: 10px;
  align-items: baseline;
  border-radius: 4px;
  ${({ disabled }) => disabled && 'text-decoration: line-through;'}
`;

const ItemLabel = styled.div`
  margin: 5px 10px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  & div {
    margin: 5px 0 0 10px;
    font-weight: 600;
  }
`;

const Button_ = styled.button`
  background: none;
  border: 1px solid #555;
  color: #555;
  border-radius: 4px;
  margin: 5px 10px 0;
  padding: 3px 5px;
  font-size: 10px;
  text-transform: uppercase;
  cursor: pointer;
  outline: none;
  &.clear {
    color: tomato;
    border: 1px solid tomato;
  }
  :hover {
    border: 1px solid deepskyblue;
    color: deepskyblue;
  }
`;

const mapStateToProps = state => {
    return {
        heartbeats: state.heartbeats,
        user:       state.user
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getHeartbeats:  (page, sizePerPage, filters, sortField, sortOrder) => dispatch(getHeartbeats(page, sizePerPage, filters, sortField, sortOrder)),
    };
}

const DEFAULT_TABLE_PAGE_NUMBER = 1;


class HeartBeats extends Component {

    constructor(props) {
        super(props)

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        const sortOptions = [
            { label: strings.booking_creating,   value: "booking_creating", checked: true },
            { label: strings.booking_editing,    value: "booking_editing", checked: true },
            { label: strings.booking_removing,   value: "booking_removing", checked: true },
            { label: strings.moving,             value: "moving", checked: true },
            { label: strings.moving_to_ds,       value: "moving_to_ds", checked: true },
            { label: strings.moving_to_gt,       value: "moving_to_gt", checked: true },
            { label: strings.remove_reservation, value: "remove_reservation", checked: true },
            { label: strings.removing,           value: "removing", checked: true },
            { label: strings.removing_from_ds,   value: "removing_from_ds", checked: true },
            { label: strings.removing_from_gt,   value: "removing_from_gt", checked: true },
            { label: strings.reservation,        value: "reservation", checked: true },
            { label: strings.seat,               value: "seat", checked: true },
        ]

        this.state = {
            sortOptions: sortOptions,
            filterSidebarShow: false,
            allSortOptionsChecked: true,
            dateStart: '',
            dateEnd: '',
            page: DEFAULT_TABLE_PAGE_NUMBER,
            sizePerPage: 10,
            sortField: "created_at",
            sortOrder: "desc",
            totalSize: 0,
            filters: []
        }

        // this.customContentRendererTyps = this.customContentRendererTyps.bind(this);
        this.handleSideBarOpen = this.handleSideBarOpen.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
    }
    
    handleSortChange = (value, checked) => {
        let newSortOptions = this.state.sortOptions.map(option => {
            if (option.value === value) {
                return Object.assign({}, option, {checked: !checked});
            } else {
                return option;
            }
        });
        let new_hb_typeFilter = newSortOptions.filter(o => o.checked === true)
        this.setState({
            sortOptions: newSortOptions,
            allSortOptionsChecked: newSortOptions.length === new_hb_typeFilter.length
        });
    };

    handleAllSortOptionsCheck = (allChecked) => {
        if (allChecked) {
            let newSortOptions = this.state.sortOptions.map(option => {
                return Object.assign({}, option, {checked: true});
            });
            this.setState({
                sortOptions: newSortOptions,
                allSortOptionsChecked: allChecked
            });
        } else {
            let newSortOptions = this.state.sortOptions.map(option => {
                return Object.assign({}, option, {checked: false});
            });
            this.setState({
                sortOptions: newSortOptions,
                allSortOptionsChecked: allChecked
            });
        }
    };

    handleSideBarOpen = () => {
        this.setState({filterSidebarShow: !this.state.filterSidebarShow});
    };

    applyFilters = (dateStart, dateEnd) => {
        const {sortOptions, sizePerPage, sortField, sortOrder} = this.state;
        const {getHeartbeats} = this.props;

        //get array of enabled in filter heartbeats types
        const hb_typeFilterValues = sortOptions.reduce((p, c) => {
            if (c.checked === true) {
                p.push(c.value)
            }
            return p;
        }, [])


        const filters = [
            {
                field: "hb_types",
                value: hb_typeFilterValues
            },
            {
                field: "dateFrom",
                value: dateStart
            }, 
            {
                field: "dateTo",
                value: dateEnd
            }    
        ];

        getHeartbeats(DEFAULT_TABLE_PAGE_NUMBER, sizePerPage, filters, sortField, sortOrder).then(response => {
            this.setState({
                totalSize: heartbeats.count,
                sizePerPage: sizePerPage,
            });
        });
        
        
        this.setState({
            dateStart: dateStart,
            dateEnd: dateEnd,
            filters: filters
        });

    };

    // customContentRendererTyps = ({ props, state }) => (
    //     <div style={{ cursor: 'pointer' }}>
    //         { state.values.length === 0 
    //             ? strings.select_types
    //             : `${state.values.length} ${strings.of} ${props.options.length} ${strings.selected}`
    //         }
    //     </div>
    // );

    // customDropdownRenderer = ({ props, state, methods }) => {
    //     const regexp = new RegExp(state.search, 'i');
    
    //     return (
    //       <div>
    //         <SearchAndToggle color={props.color}>
    //           <Buttons>
    //             <div></div>
    //             {methods.areAllSelected() ? (
    //               <Button_ className="clear" onClick={methods.clearAll}>
    //                 {strings.clearAll}
    //               </Button_>
    //             ) : (
    //               <React.Fragment>
    //                 <Button_ onClick={methods.selectAll}>{strings.selectAll}</Button_>
    //               </React.Fragment>
    //             )}
    //           </Buttons>

    //         </SearchAndToggle>
    //         <Items>
    //           {props.options
    //             .filter((item) => regexp.test(item[props.searchBy] || item[props.labelField]))
    //             .map((option) => {
    //               if (!props.keepSelectedInList && methods.isSelected(option)) {
    //                 return null;
    //               }    
    //               return (
    //                 <Item
    //                     style={{'paddingLeft': '3px', 'background': `${hb_colors.items.find(e => e.type === option.value).color}`}}
    //                   key={option[props.valueField]}
    //                   onClick={() => {methods.addItem(option);}}>
    //                   <input
    //                     type="checkbox"
    //                     onChange={() => (option.disabled ? undefined : methods.addItem(option))}
    //                     checked={methods.isSelected(option)}
    //                   />
    //                   <ItemLabel>{option.label}</ItemLabel>
    //                 </Item>
    //               );
    //             })}
    //         </Items>
    //       </div>
    //     );
    //   };

    componentDidMount() {
        const {getHeartbeats, heartbeats} = this.props;
        const {sizePerPage, sortField, sortOrder, filters} = this.state;

        getHeartbeats(DEFAULT_TABLE_PAGE_NUMBER, sizePerPage, filters, sortField, sortOrder).then(response => {
            this.setState({
                totalSize: heartbeats.count,
                sizePerPage: sizePerPage,
                filters: filters
            });
        });
    }

    handleTableChange = (type, {page, sizePerPage, sortField, sortOrder}) => {
        const {getHeartbeats, heartbeats} = this.props;
        const {filters} = this.state
        
        let choosenPage = page;

        if (type === 'sort') {
            choosenPage = DEFAULT_TABLE_PAGE_NUMBER;
        }

        getHeartbeats(choosenPage, sizePerPage, filters, sortField, sortOrder).then(response => {
            this.setState({
                page: choosenPage,
                totalSize: heartbeats.count,
                filters: filters,
                sizePerPage: sizePerPage,
                sortField: sortField,
                sortOrder: sortOrder
            });
        });
    }

    componentWillReceiveProps(nextProps){
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        let newSortOptions = this.state.sortOptions.map(option => {
            switch (option.value) {
                case 'booking_creating':
                    return Object.assign({}, option, {label: strings.booking_creating});
                case 'booking_editing':
                    return Object.assign({}, option, {label: strings.booking_editing});
                case 'booking_removing':
                    return Object.assign({}, option, {label: strings.booking_removing});
                case 'moving':
                    return Object.assign({}, option, {label: strings.moving});
                case 'moving_to_ds':
                    return Object.assign({}, option, {label: strings.moving_to_ds});
                case 'moving_to_gt':
                    return Object.assign({}, option, {label: strings.moving_to_gt});
                case 'remove_reservation':
                    return Object.assign({}, option, {label: strings.remove_reservation});
                case 'removing':
                    return Object.assign({}, option, {label: strings.removing});
                case 'removing_from_ds':
                    return Object.assign({}, option, {label: strings.removing_from_ds});
                case 'removing_from_gt':
                    return Object.assign({}, option, {label: strings.removing_from_gt});
                case 'reservation':
                    return Object.assign({}, option, {label: strings.reservation});
                case 'seat':
                    return Object.assign({}, option, {label: strings.seat});
                default:
                    return option;
            }
        })

        this.setState({
            totalSize: nextProps.heartbeats.count,
            sortOptions: newSortOptions
        });
    }

    notify = () => {
        toast.success(strings.changesSaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    render() {
        const { heartbeats } = this.props;
        let {sortOptions, filterSidebarShow, allSortOptionsChecked, 
                totalSize, sizePerPage, page } = this.state;
        const {tableData, noDataIndicator} = processTableData(heartbeats, strings.noresults)

        const columns = [
            {
                dataField: 'id',
                text: "id",
                hidden: true
            }, {
                dataField: 'administrator',
                text: strings.admin,
                sort: true,
                headerStyle: headerStyles,
                sortCaret: sortCaretStyle
            }, {
                dataField: 'created_at',
                text: strings.dateAndTimeOfChange,
                sort: true,
                formatter: (cell, row, rowIndex, extraData) => {
                    return <Moment format="DD.MM.YYYY HH:mm:ss">{ cell }</Moment>;
                },
                headerStyle: headerStyles,
                sortCaret: sortCaretStyle
            }, {
                dataField: 'coord',
                text: strings.placeIdentification,
                sort: true,
                headerStyle: headerStyles,
                sortCaret: sortCaretStyle
            }, {
                dataField: 'employee',
                text: strings.object,
                sort: true,
                headerStyle: headerStyles,
                sortCaret: sortCaretStyle
            }, {
                dataField: 'hb_type',
                text: strings.log_types,
                sort: true,
                formatter: (cell, row, rowIndex, extraData) => {
                    let so = sortOptions.find(o => o.value === cell);
                    return !!so ? so.label : '-';
                },
                headerStyle: headerStyles,
                sortCaret: sortCaretStyle
            }
        ];

        const customTotal = (from, to, size) => (
            <span className="react-bootstrap-table-pagination-total">
            { strings.showing } {strings.from} { from } { strings.to } { to } { strings.of } { size } { strings.results }
            </span>
        );

        const options = {
            page: page,
            sizePerPage: sizePerPage,
            totalSize: totalSize,
            showTotal: true,
            paginationTotalRenderer: customTotal,
            withFirstAndLast: true,
            sizePerPageList: [{
                    text: '10', value: 10
                }, {
                    text: '15', value: 15
                }, {
                    text: '30', value: 30
                }, {
                    text: strings.all, value: totalSize
                }]
        };

        return (
            <>
                <div className="container-fluid overflow-auto with-actions heartbeats">
                    <div className="container page-title-wrapper" >
                        <div className="heart-beats-component-page-title">
                            <h1 className="title_element">{ strings.heartbeats }</h1>                                
                        </div>
                    </div>                        
                    <div className="container neomorph-card mt-2">
                        <div className="row neomorph-card-inside" >
                        <Form className="entity-management-form">
                                <FormGroup row>
                                    <Col sm={12}>
                                        <div className="heart-beats-component-table-container table_custom table_custom_logs">
                                            <BootstrapTable
                                                remote
                                                keyField='id'
                                                data={ tableData }
                                                columns={ columns }
                                                filter={ filterFactory() }
                                                pagination={ paginationFactory(options) }
                                                rowStyle={ (row, rowIndex) => {
                                                    return { backgroundColor: rowIndex % 2 == 0 ? "#ededed" : "white" };
                                                } }
                                                noDataIndication={noDataIndicator}
                                                onTableChange={this.handleTableChange}
                                            />
                                        </div>
                                    </Col>
                                </FormGroup>
                            </Form>
                            
                            <div className="heart-beats-component-sidebar-button open_sidebar_button">
                                <button 
                                    className="button-magenta button-simple" 
                                    onClick={() => { this.setState({filterSidebarShow: true})}}
                                >{strings.filter}</button>
                            </div>
                            <HeartBeatsFilterSidebarComponent
                                isOpen={filterSidebarShow}
                                handleOpen={this.handleSideBarOpen}
                                sortOptions={sortOptions}
                                handleSortChange={this.handleSortChange}
                                allSortOptionsChecked={allSortOptionsChecked}
                                handleAllSortOptionsCheck={this.handleAllSortOptionsCheck}
                                applyFilters={this.applyFilters}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(HeartBeats);