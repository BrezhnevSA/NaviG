import React, { Component } from 'react';
import { toast }            from 'react-toastify';
import { connect }          from "react-redux";
import { Button }           from 'reactstrap';
import { Link }             from 'react-router-dom';
import BootstrapTable       from 'react-bootstrap-table-next';
import filterFactory, { 
    textFilter
}                           from 'react-bootstrap-table2-filter';
import paginationFactory    from 'react-bootstrap-table2-paginator';

import { 
    addSDManagers_costcenter, 
    removeSDManagers_costcenter,
    getSDManagers_costcenters,
    addAllCostcenters,
    removeAllCostcenters    
}                                 from '../../../../../actions/SDManagersCostcentersActions';
import { 
    searchCostcenters,
    searchEmployees,
    searchAllCostcenters
}                                 from '../../../../../actions/SearchActions';
import { _convertDateToBdString } from '../../../../../utils/functions';

import AsyncSearcher from '../../../../Elements/AsyncSearcher';

import LocalizedStrings from 'react-localization';

import './BookingTab.css';

import Loading from '../../../Loading/LoadingComponent';
import ModalWindow from '../../../ModalWindow/ModalWindowComponent';
import * as styles from '../../../../../constants/Styles';
import { pageListRenderer } from '../../../../../constants/Styles';

let strings = new LocalizedStrings({
    en:{
        addsdmanager:         "Add SD manager",
        bookings:             "Buildings",
        nosdmanagers:         "No SD managers exists",
        edit:                 "Edit",
        comment:              "Comment",
        delete:               "Delete",
        add:                  "Add",
        place:                "Place",
        allcostcenters:       "All costcenters",
        nameandsurname:       "Surname Name",
        costcenters:          "Costcenters",
        showing:              "Showing",
        from:                 "from",
        to:                   "to",
        of:                   "of",
        results:              "Results",
        searchingCostcenters: "Search costcenters",
        noresults:            "No results",
        placeholder_name:     "Type Costcenter",
        searchingEmployyes:   "Search employee",
        placeholder_name_e:   "Type Employee",
        changesSaved:         "Changes saved!",
        all:                  "All", 
        header:               "Delete SD manager with name",
        description:          "The SD manager will be deleted permanently.",
        yes:                  "Yes",
        no:                   "No",
        sd_managers:          "SD Managers",
        actions:              "Actions"
    },
    ru: {
        addsdmanager:         "Добавить SD менеджера",
        bookings:             "Бронирования",
        nosdmanagers:         "SD менеджеры отсутствуют",
        edit:                 "Редактировать",
        comment:              "Комментарий",
        delete:               "Удалить",
        add:                  "Добавить",
        place:                "Место",
        allcostcenters:       "Все МВЗ",
        nameandsurname:       "Фамилия Имя",
        costcenters:          "МВЗ",
        showing:              "Отображено",
        from:                 "с",
        to:                   "по",
        of:                   "из",
        results:              "всего",
        searchingCostcenters: "Поиск МВЗ",
        noresults:            "Нет результатов",
        placeholder_name:     "Введите МВЗ",
        searchingEmployyes:   "Поиск сотрудника",
        placeholder_name_e:    "Введите имя/фамилию",
        changesSaved:         "Изменения сохранены!",
        all:                  "Все", 
        header:               "Удалить SD менеджера с именем",
        description:          "SD менеджер будет удален перманентно.",
        yes:                  "Да",
        no:                   "Нет",
        sd_managers:          "SD Менеджеры",
        actions:              "Действия"
    },
    de: {
        addsdmanager:         "SD manager hinzufügen",
        bookings:             "Gebäude",
        nosdmanagers:         "Es sind keine SD-Manager vorhanden",
        edit:                 "Bearbeiten",
        comment:              "Kommentar",
        delete:               "Löschen",
        add:                  "Hinzufügen",
        place:                "Ort",
        allcostcenters:       "Alles Costcenters",
        nameandsurname:       "Nachname Vorname",
        costcenters:          "Costcenters",
        showing:              "Zeigen",
        from:                 "von",
        to:                   "zu",
        of:                   "von",
        results:              "Ergebnisse",
        searchingCostcenters: "Suche nach Kostenstellen",
        noresults:            "Keine Ergebnisse",
        placeholder_name:     "Geben Sie Kostenstelle ein",
        searchingEmployyes:   "Mitarbeiter suchen",
        placeholder_name_e:   "Typ Mitarbeiter",
        changesSaved:         "Änderungen gespeichert!",
        all:                  "Alles", 
        header:               "Benannten SD-Manager entfernen",
        description:          "SD-Manager wird dauerhaft entfernt.",
        yes:                  "Ja",
        no:                   "Nein",
        sd_managers:          "SD-Manager",
        actions:              "Aktionen"
    }
});

class SDManagersTab extends Component {

    constructor(props) {
        super(props)

        this.state = {
            sdmanagers_costcenters_data: {},
            tabType:                     this.props.tabType,
            firstLoad:                   true,
            reload:                      false,
            selectedEmployee:            [],
            selectedCostcenters:         [],
            allCostcentersSelected:      [],
            triggerModal:                false
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.handleSelection            = this.handleSelection.bind(this);
        this.searchCostcenters_         = this.searchCostcenters_.bind(this);
        this.addCostcenter              = this.addCostcenter.bind(this);
        this.searchEmployees            = this.searchEmployees.bind(this);
        this.handleSelectionEmployee    = this.handleSelectionEmployee.bind(this);
        this.handleSelectionCostcenters = this.handleSelectionCostcenters.bind(this);
        this.handleAllCostcentersChange = this.handleAllCostcentersChange.bind(this);
    }

    componentDidMount() {
        this.props.getSDManagers_costcenters();
        this.props.searchAllCostcenters();
        this.setState({ 
            firstLoad: true,
            reload:    false,
        });
    }

    componentWillReceiveProps(nextProps) {
        const { 
            firstLoad,
            reload,
        } = this.state;
        const { 
            user, 
            sdmanagers_costcenters,
            search,
        } = nextProps;
        let filtered_sdmanagers_costcenters = [];

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        if (this.state.tabType !== nextProps.tabType) {
            this.setState({ tabType: nextProps.tabType, triggerModal: false });
        }

        sdmanagers_costcenters.items && sdmanagers_costcenters.items.length > 0 
            ? sdmanagers_costcenters.items.map(sc => {
                let res = filtered_sdmanagers_costcenters.find(e => e.employee_id === sc.employee_id);
                if (res !== undefined) {
                    filtered_sdmanagers_costcenters.map(e => {
                        if (e.employee_id === sc.employee_id) {
                            e.costcenter_nums.push({ costcenter_num: sc.costcenter_num, id: sc.id });
                        }
                        return e;
                    })
                } else {
                    filtered_sdmanagers_costcenters.push({
                        employee_label:  sc.employee_label,
                        employee_id:     sc.employee_id,
                        costcenter_nums: [ { costcenter_num: sc.costcenter_num, id: sc.id } ]
                    })
                }
              })
            : [];

        if (search.costcenters_all && !sdmanagers_costcenters.isFetching && user && user.loggingIn) {
            if (filtered_sdmanagers_costcenters.length > 0 ) {
                let checkbox_ = [];
                let selected_ = filtered_sdmanagers_costcenters.map(e => { 
                    checkbox_.push({ 
                        employee_id: e.employee_id, 
                        state:       e.costcenter_nums.length === search.costcenters_all.length
                    })
                    return {
                        employee_id:     e.employee_id,
                        costcenter_nums: e.costcenter_nums.map(cn => { return cn.costcenter_num; })
                    }; 
                });
                this.setState({
                    firstLoad:              false,
                    reload:                 false,
                    selected:               selected_,
                    allCostcentersSelected: checkbox_, 
                    triggerModal:           false
                })
            }
        }
    }

    notify = () => {
        toast.success(strings.changesSaved, {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    searchCostcenters_(query, page) {
        this.props.searchCostcenters(query, page);
    }

    handleSelection(item, employee_id) {
        let { selected } = this.state;
        const { sdmanagers_costcenters } = this.props;
        this.setState({
            selected: selected.map(e => {
                if (e.employee_id === employee_id) {
                    return {
                        employee_id:     e.employee_id,
                        costcenter_nums: item
                    };
                } else {
                    return e;
                }
            })
        })
        const sdmanager_info_selected = selected.find(e => e.employee_id === employee_id).costcenter_nums;
        const deleted_costcenter      = sdmanager_info_selected.filter(s => !item.includes(s));
        if (deleted_costcenter.length > 0) {
            this.props.removeAllCostcenters(sdmanagers_costcenters.items.find(e => 
                e.employee_id === employee_id && e.costcenter_num === deleted_costcenter[0]).id, 0);
        }
    }

    addCostcenter(costcenter_num, employee_id) {
        this.props.addSDManagers_costcenter(costcenter_num, employee_id);
    }

    searchEmployees(query, page) {
        this.props.searchEmployees(query, page);
    }

    handleSelectionEmployee(selectedEmployee) {
        this.setState({ selectedEmployee });
    }

    handleSelectionCostcenters(selectedCostcenters) {
        this.setState({ selectedCostcenters });
    }

    handleAllCostcentersChange(e, employee_id) {
        const { allCostcentersSelected } = this.state;
        this.setState({
            reload:                 true,
            allCostcentersSelected: allCostcentersSelected.map(e => {
                if (e.employee_id === employee_id) {
                    if (!e.state) {
                        this.props.addAllCostcenters(employee_id);
                    } else {
                        this.props.removeAllCostcenters(-1, employee_id);
                    }
                    this.notify();
                    return {
                        employee_id: e.employee_id,
                        state:       !e.state,
                    }
                } else {
                    return e;
                }
            })            
        });
    }

    render() {
        const { 
            selected,
            allCostcentersSelected,
            triggerModal,
            employee_id_to_remove,
            employee_name_to_remove
        } = this.state;
        const { 
            user, 
            sdmanagers_costcenters,
            search,
        } = this.props;
        let filtered_sdmanagers_costcenters = [];

        sdmanagers_costcenters.items && sdmanagers_costcenters.items.length > 0 
            ? sdmanagers_costcenters.items.map(sc => {
                let res = filtered_sdmanagers_costcenters.find(e => e.employee_id === sc.employee_id);
                if (res !== undefined) {
                    filtered_sdmanagers_costcenters.map(e => {
                        if (e.employee_id === sc.employee_id) {
                            e.costcenter_nums.push({ costcenter_num: sc.costcenter_num, id: sc.id });
                        }
                        return e;
                    })
                } else {
                    filtered_sdmanagers_costcenters.push({
                        employee_label:  sc.employee_label,
                        employee_id:     sc.employee_id,
                        costcenter_nums: [ { costcenter_num: sc.costcenter_num, id: sc.id } ]
                    })
                }
              })
            : [];

        if (search.costcenters_all && !sdmanagers_costcenters.isFetching && user && user.loggingIn) {
            const columns = [
                {
                    dataField: 'employee_label',
                    text:      strings.nameandsurname,
                    filter:    textFilter(),
                    sort:      true,
                    headerStyle: styles.headerStyles
                }, {
                    dataField: '__',
                    text:      strings.costcenters,
                    filter:    textFilter(),
                    sort:      true,
                    formatter: (cell, row, rowIndex, extraData) => { 
                        const selected = extraData.selected 
                            ? extraData.selected.find(e => e.employee_id === row.employee_id)
                            : [];
                        return  <AsyncSearcher
                                    objects={extraData.costcenters}
                                    searchObjects={extraData.searchCostcenters}
                                    handleSelection={extraData.handleSelection}
                                    selected={selected && selected.costcenter_nums  
                                        ? selected.costcenter_nums
                                        : []
                                    }
                                    object_id={row.employee_id}
                                    optionsRender={option => (
                                        <div 
                                            key={option}
                                            tabindex="0" 
                                            className="rbt-token rbt-token-removeable"
                                            onClick={() => {extraData.addCostcenter(option, row.employee_id)}}
                                        >
                                            {option}
                                        </div>
                                    )}
                                    labelKey={option => `${option}`}
                                    textTranslation={{
                                        searching:        extraData.searching,
                                        noresults:        extraData.noresults,
                                        placeholder_name: extraData.placeholder_name
                                    }}
                                    multiple={true}
                                />;
                    },
                    formatExtraData: {
                        state_:            this.state,
                        costcenters:       search.costcenters,
                        searchCostcenters: this.searchCostcenters_,
                        handleSelection:   this.handleSelection,
                        addCostcenter:     this.addCostcenter,
                        selected:          selected,
                        searching:         strings.searchingCostcenters,
                        noresults:         strings.noresults,
                        placeholder_name:  strings.placeholder_name,
                    },
                    headerStyle: styles.headerStyles
                }, {
                    dataField: '_',
                    text:      strings.allcostcenters,
                    formatter: (cell, row, rowIndex, extraData) => { 
                        const checkbox = extraData.allCostcentersSelected.find(e => e.employee_id === row.employee_id);
                        return <input 
                                    type="checkbox"
                                    name="active"
                                    id="fieldActive"
                                    checked={checkbox ? checkbox.state : false}
                                    value={checkbox ? checkbox.state : false}
                                    onChange={(e) => { this.handleAllCostcentersChange(e, row.employee_id); }} 
                                />;
                    },
                    formatExtraData: {
                        allCostcentersSelected: allCostcentersSelected
                    },
                    headerStyle: styles.headerStyles
                }, {
                    dataField: '___',
                    text:      strings.actions,
                    formatter: (cell, row, rowIndex, extraData) => { 
                        return <img 
                                onClick={() => {this.setState({ triggerModal: true, employee_id_to_remove: row.employee_id, employee_name_to_remove: row.employee_label})}} 
                                src={`/img/pics/delete_button.svg`}
                                className="buttons_m"
                               ></img>  
                    },
                    formatExtraData: {
                        delete_text: strings.delete,
                    },
                    headerStyle: styles.headerStyles
                }
            ];
    
            const customTotal = (from, to, size) => (
                <span className="react-bootstrap-table-pagination-total">
                  { strings.showing } { strings.from } { from } { strings.to } { to } { strings.of } { size } { strings.results }
                </span>
            );
    
            const options = {
                showTotal:               true,
                paginationTotalRenderer: customTotal,
                withFirstAndLast:        true,
                sizePerPageList:         [{
                    text: '10', value: 10
                }, {
                    text: '15', value: 15
                }, {
                    text: '30', value: 30
                }, {
                    text: strings.all, value: filtered_sdmanagers_costcenters.length
                }],
                pageListRenderer
            };
    
            const defaultSorted = [{
                dataField: 'id',
                order:     'asc'
            }];
            return (
                <div id="content" className="container-fluid with_tabs overflow-auto with-actions">
                    {/* <h1 id="page-title-bookings">{ strings.sd_managers }</h1> */}
                    <div style={{margin: '10px'}}>
                        <Link to="/sdmanagers" >
                            <img 
                                onClick={() => {this.setState({ triggerModal: true, employee_id_to_remove: row.employee_id, employee_name_to_remove: row.employee_label})}} 
                                src={`/img/pics/add_user_button.svg`}
                                className="buttons_m"
                            ></img>  
                        </Link>
                    </div>
                    { filtered_sdmanagers_costcenters.length === 0 ? (
                        <>{strings.nosdmanagers}</>                        
                    ) : (
                        <div className="default-table-style-container table_custom table_custom_with_tabs"> 
                            <BootstrapTable
                                keyField='id'
                                data={ filtered_sdmanagers_costcenters }
                                columns={ columns }
                                filter={ filterFactory() }
                                pagination={ paginationFactory(options) }
                                defaultSorted={ defaultSorted } 
                                rowStyle={ (row, rowIndex) => {
                                    return { backgroundColor: rowIndex % 2 == 0 ? "#ededed" : "white" };
                                }}
                            />
                        </div>
                    )}
                    <ModalWindow 
                        modalIsOpen={triggerModal}
                        header={
                            <div className="modal-header-1">
                                <div className="close-modal" >
                                    <img className="close-link" src="/img/pics/cross_black.svg" onClick={() => this.setState({ triggerModal: false})}></img>
                                </div>
                                <h2>{`${strings.header} ${employee_name_to_remove}`}?</h2>
                            </div>
                        }
                        body={
                            <div className="modal-body-1">
                                <p>{strings.description}</p>
                                <div className="modal-buttons">
                                    <Button 
                                        className="button-magenta button_usual btn_small"
                                        onClick={() => { this.props.removeAllCostcenters(-1, employee_id_to_remove); this.setState({ triggerModal: false})}}
                                    >{strings.yes}</Button>
                                    <Button 
                                        className="button_usual button_decline btn_small btn_right"
                                        onClick={() => { this.setState({ triggerModal: false})}}
                                    >{strings.no}</Button>
                                </div>
                            </div>
                        }
                    />
                </div> 
            );
        } else if (!sdmanagers_costcenters.isFetching && filtered_sdmanagers_costcenters.length === 0) {
            return(<>{strings.nosdmanagers}</>);
        } else {
            return(<Loading/>);
        }
    }
}

const mapStateToProps = state => {
    return {
        bookings:               state.bookings,
        user:                   state.user,
        sdmanagers_costcenters: state.sdmanagers_costcenters,
        search:                 state.search
    };
};

function mapDispatchToProps(dispatch) {
    return {
        addSDManagers_costcenter:    (costcenter_num, employee_id) => dispatch(addSDManagers_costcenter(costcenter_num, employee_id)),
        getSDManagers_costcenters:   () => dispatch(getSDManagers_costcenters()),
        removeSDManagers_costcenter: (id, employee_id) => dispatch(removeSDManagers_costcenter(id, employee_id)),
        searchCostcenters:           (query, page) => dispatch(searchCostcenters(query, page)),
        searchEmployees:             (query, page) => dispatch(searchEmployees(query, page)),
        addAllCostcenters:           (employee_id) => dispatch(addAllCostcenters(employee_id)),
        searchAllCostcenters:        () => dispatch(searchAllCostcenters()),
        removeAllCostcenters:        (id, employee_id) => dispatch(removeAllCostcenters(id, employee_id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(SDManagersTab);