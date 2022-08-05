import React, { Component } from 'react';
import { toast }            from 'react-toastify';
import { connect }          from "react-redux";
import { Button }           from 'reactstrap';
import { Link }             from 'react-router-dom';
import queryString          from 'query-string';
import BootstrapTable       from 'react-bootstrap-table-next';
import filterFactory, { 
       dateFilter,
       textFilter
}                           from 'react-bootstrap-table2-filter';
import paginationFactory    from 'react-bootstrap-table2-paginator';
import moment               from 'moment';
import { 
    getAllEmployees
}                           from '../../../actions/EmployeesActions';
import * as tabs         from '../../../constants/EmployeesTabsTypes';
import * as rbac         from '../../../rbac/rbac';
import * as rights       from '../../../constants/Rights';
import * as emp_statuses from '../../../constants/EmployeeStatuses';
import axios from 'axios'; 
import * as config from '../../../config/config';

import LocalizedStrings from 'react-localization';

import Loading from '../Loading/LoadingComponent';
import EmployeeFilterSidebar from './EmployeesFilterSidebar';

import './EmployeesManagementComponent.css';

import { sortCaretStyle, headerStyles } from '../../../constants/Styles';

let strings = new LocalizedStrings({
    en:{
        employeesmgmnt: "Employees Management",
        noemployees:    "No data",
        surname:        "Surname and Name",
        place:          "Place",
        action:         "Action",
        login:          "Wiw",
        costcenter:     "Costcenter",
        showing:        "Showing",
        group_name:     "Group",
        from:           "from",
        to:             "to",
        of:             "of",
        results:        "Results",
        header:         "Delete employee",
        description:    "The employee will be deleted permanently.",
        yes:            "Yes",
        no:             "No",
        changessaved:   "Changes Saved!",
        all:            "All",
        comment:        "Comment",
        noresults:      "No results",
        head:           "Head",
        actions:        "Actions",
        regular:        "Regular",
        dekret:         "Decree",
        city_name:      "City",
        place_name:     "Address",
        work_type:      "Work type",
        status:         "Status",
        filter:         "Filter",
        download:       "Download",
    },
    ru: {
        employeesmgmnt: "Управление сотрудниками",
        noemployees:    "Данные отсутствуют",
        surname:        "Фамилия и Имя",
        place:          "Место",
        action:         "Действие",
        login:          "Wiw",
        costcenter:     "МВЗ",
        showing:        "Отображено", 
        group_name:     "Группа",       
        from:           "с",
        to:             "по",
        of:             "из",
        results:        "всего",
        header:         "Удалить сотрудника",
        description:    "Сотрудник будет удален навсегда.",
        yes:            "Да",
        no:             "Нет",
        changessaved:   "Изменения сохранены!",
        all:            "Все",
        comment:        "Комментарий",
        noresults:      "Нет результатов",
        head:           "Руководитель",
        actions:        "Действия",
        regular:        "Регулярный",
        dekret:         "Декрет",
        city_name:      "Город",
        place_name:     "Адрес",
        work_type:      "Формат работы",
        status:         "Статус",
        filter:         "Фильтр",
        download:       "Скачать",
    },
    de: {
        employeesmgmnt: "Mitarbeiterführung",
        noemployees:    "Keine Daten verfügbar",
        surname:        "Nachname und Name",
        place:          "Ort",
        action:         "Aktion",
        login:          "Wiw",
        costcenter:     "Costcenter",
        showing:        "Zeigen",    
        group_name:     "Gruppe",    
        from:           "von",
        to:             "zu",
        of:             "von",
        results:        "Ergebnisse",
        header:         "Mitarbeiter löschen",
        description:    "Der Mitarbeiter wird dauerhaft entfernt.",
        yes:            "Ja",
        no:             "Nein",
        changessaved:   "Änderungen gespeichert!",
        all:            "Alles",
        comment:        "Kommentar",
        noresults:      "Keine Ergebnisse",
        head:           "der Leiter",
        actions:        "Aktionen",
        regular:        "Regelmäßig",
        dekret:         "Erlass",
        city_name:      "Stadt",
        place_name:     "Adresse",
        work_type:      "Arbeitstyp",
        status:         "Status",
        filter:         "Filter",
        download:       "Download",
    }
});

class EmployeesManagement extends Component {

    constructor(props) {
        super(props)

        this.state = {
            page:         1,
            sizePerPage:  10,
            sortField:    '',
            sortOrder:    '',
            filtersVal:   [],
            columns:      [],
            statuses:     `${emp_statuses.REGULAR},${emp_statuses.MATERNITY}`,
            afterFilter:  false,
            firstLoad:    false,
            data:         this.props.employees.items ? this.props.employees.items.slice(0, 10) : this.props.employees.slice(0, 10),
            totalSize:    this.props.employees.items ? this.props.employees.items.length : this.props.employees.length,
            filter_sidebar_show: false,
            costcenter_selected: null
        }

        this.handleTableChange = this.handleTableChange.bind(this);
        this.closeSidebar = this.closeSidebar.bind(this);
        this.openSidebar = this.openSidebar.bind(this);
        this.filterEmployees = this.filterEmployees.bind(this);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        const parsed_params = queryString.parse(this.props.location.search);
        if (!!this.props.employees && (parsed_params.filters !== 'true' || parsed_params.filters == undefined))  {
            this.props.getAllEmployees(
                this.state.statuses,
                1, 
                10, 
                [],
                ""
            );
            localStorage.setItem("objectItemsFilters", JSON.stringify({
                page: 1,
                sizePerPage: 10,
                key: -1,
                sortField: null,
                sortOrder: null,
                filtersVal: []
            }));
        } else {
            const objectItemsFilters = JSON.parse(localStorage.getItem("objectItemsFilters"));
            this.props.getAllEmployees(
                objectItemsFilters.statuses, 
                objectItemsFilters.page, 
                objectItemsFilters.sizePerPage, 
                objectItemsFilters.filtersVal.filter(e => e.value),
                { field: objectItemsFilters.sortField, order: objectItemsFilters.sortOrder }
            );
            this.setState({
                page: objectItemsFilters.page, 
                sizePerPage: objectItemsFilters.sizePerPage, 
                sortField: objectItemsFilters.sortField, 
                sortOrder: objectItemsFilters.sortOrder,
                filtersVal: objectItemsFilters.filtersVal,
                statuses: objectItemsFilters.statuses,
                afterFilter: true,
                firstLoad: true
            })
        }
    }

    componentDidUpdate(prevProps) {
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    notify = () => {
        toast.success(strings.chagessaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    handleTableChange = (type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit }) => {
        const filtersActive = this.state.filtersVal.filter(e => e.value)
        const currentIndex = (page - 1) * sizePerPage;
        if (type === 'pagination') {
            this.props.getAllEmployees(
                this.state.statuses, 
                page, 
                sizePerPage, 
                filtersActive,
                { field: sortField, order: sortOrder }
            );
            let result = this.props.employees.items;
            this.setState({
                page: page,
                data: result.slice(currentIndex, currentIndex + sizePerPage),
                totalSize: this.props.employees.count,
                sizePerPage,
                afterFilter: true
            });
        } else if (type === 'sort' && (sortField !== this.state.sortField || sortOrder !== this.state.sortOrder) && 
                !this.props.employees.isFetching) {
            // this.props.getObjectItems(
            //     page, 
            //     sizePerPage, 
            //     this.state.key, 
            //     sortField, 
            //     sortOrder, 
            //     sortField ? sortField.split('-').length > 0 : false,
            //     filtersActive);
            this.props.getAllEmployees(
                this.state.statuses, 
                page, 
                sizePerPage, 
                filtersActive,
                { field: sortField, order: sortOrder }
            );
            this.setState({
                sortField: sortField,
                sortOrder: sortOrder,
                afterFilter: true
            });
        } else if (type === 'filter') {
            this.props.getAllEmployees(
                this.state.statuses, 
                page, 
                sizePerPage, 
                Object.entries(filters).map(el => { return { field: el[0], value: el[1].filterVal }; }),
                { field: sortField, order: sortOrder }
            );
            this.setState({
                filters: filters
            })
        }     
    }

    _setTableOption(){ 
        if(!this.props.employees.isFetching){
          return "No expenses found";
        }else{
          return(
            <>loading</>
          );
        }
    }

    closeSidebar() { this.setState({ filter_sidebar_show: false }); }

    openSidebar() { this.setState({ filter_sidebar_show: true }); }

    filterEmployees(statuses, filters, costcenter_selected) {
        this.props.getAllEmployees(
            statuses, 
            this.state.page, 
            this.state.sizePerPage, 
            filters,
            { field: this.state.sortField, order: this.state.sortOrder }
        );
        this.setState({
            filtersVal: filters,
            statuses_filtered: statuses,
            costcenter_selected: costcenter_selected
        })
    }

    render() {
        const { sizePerPage, page, sortField, sortOrder, filter_sidebar_show, statuses_filtered, filtersVal } = this.state;
        const { user, employees } = this.props;
        const today = moment();
        const filtered_employees = employees.items && employees.items.length > 0
            ? employees.items
            : [];

        const columns = [
            {
                dataField: 'surname',
                text:      strings.surname,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    return <a className="place_link" href={`/profile/${row.id}`}>{cell}</a>;
                }  
            }, {
                dataField: 'login',
                text:      strings.login,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'city_name',
                text:      strings.city_name,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    return <span>{!!cell ? cell : "-" }</span>;
                }  
            }, {
                dataField: 'place_name',
                text:      strings.place_name,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    return row.floor_id && row.place_id 
                        ? <a className="place_link" href={`/floors/${row.floor_id}?object_id=${row.place_id}&search=true`}>{!!cell ? cell : "-" }</a>
                        : <span>{!!cell ? cell : "-" }</span>;
                }  
            }, {
                dataField: 'work_type',
                text:      strings.work_type,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    return <span>{cell == "H" ? "Hybrid" : cell == "F" ? "Flex" : "-" }</span>;
                }  
            }, {
                dataField: 'status',
                text:      strings.status,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    return <span>{cell == "REGULAR" ? strings.regular : cell == "MATERNITY" ? strings.dekret : "-" }</span>;
                }  
            }, {
                dataField: 'costcenter_number',
                text:      strings.costcenter,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            },  {
                dataField: 'head',
                text:      strings.head,
                headerStyle: headerStyles
            }, {
                dataField: 'comment',
                text:      strings.comment,
                sort:      true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    return <span>{!!cell ? cell : "-" }</span>;
                }  
            }, {
                dataField: '_',
                text:      strings.actions,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    return <div>
                            <a href={`mailto:${row.email}`}><img src="/img/pics/mail_big.svg"></img></a>
                            <a href={`webexteams://im?email=${row.email}`} style={{marginLeft: '15px'}} onClick={() => { }}><img src="/img/pics/webex_big.svg"></img></a>
                        </div>;
                }  
            }
        ];

        if (!employees.isFetching && user && user.loggingIn) {
            const customTotal = (from, to, size) => (
                <span className="react-bootstrap-table-pagination-total">
                  { strings.showing } { strings.from } { from } { strings.to } { to } { strings.of } { size } { strings.results }
                </span>
            );
              
            const RemoteAll = ({ data, page, sizePerPage, onTableChange, totalSize, columns }) => (
                <div className="default-table-style-container table_custom table_custom_with_tabs" >
                    <BootstrapTable
                        remote
                        keyField='id'
                        data={ data }
                        columns={ columns }
                        filter={ filterFactory() }
                        rowStyle={ (row, rowIndex) => {
                            return { backgroundColor: rowIndex % 2 == 0 ? "#ededed" : "white" };
                        } }
                        pagination={ paginationFactory({ 
                            page, 
                            sizePerPage, 
                            totalSize,
                            noDataText: this._setTableOption(),
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
                                text: '50', value: 50
                            }] 
                        })}
                        onTableChange={ onTableChange }
                        sort={ { dataField: sortField, order: sortOrder }}
                        noDataIndication={ () => <>{strings.noresults}</> }
                    />
                </div>
            );
            
            return (
                <>
                    <div className="container-fluid  overflow-auto with-actions">
                        <div className="container page-title-wrapper" >
                            <h1 id="page-title">{ strings.employeesmgmnt }</h1>
                        </div>
                        <div className="open_filter_employees_management_sidebar_button">
                            <button 
                                className="button-magenta button-simple" 
                                onClick={() => { this.openSidebar(); }}
                            >{strings.filter}</button>
                            <button 
                                className="button-magenta button-simple"
                                onClick={() => {  
                                    return axios.post(
                                        `${config.baseUrl}/search/employees/all`,
                                        { 
                                            per_page: 0,
                                            page: 0,
                                            sorting: {field: sortField, order: sortOrder},
                                            as_file: true,
                                            statuses: statuses_filtered,
                                            filters: filtersVal,
                                        }, { headers: { Authorization: localStorage.getItem('auth_token') }, responseType: 'blob' },)                               
                                        .then(response => {
                                            if (!window.navigator.msSaveOrOpenBlob) {
                                                // BLOB NAVIGATOR
                                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                                const link = document.createElement('a');
                                                link.href = url;
                                                link.setAttribute('download', "employees.xls");
                                                document.body.appendChild(link);
                                                link.click();
                                            } else {
                                                // BLOB FOR EXPLORER 11
                                                const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]), "employees.xls");
                                            }
                                        }).catch(error => { throw(error); });
                                }}
                            >{strings.download}</button>
                        </div>  
                        <div className="container neomorph-card mt-2">
                            <RemoteAll
                                data={ filtered_employees }
                                page={ page }
                                sizePerPage={ sizePerPage }
                                totalSize={ this.props.employees ? this.props.employees.count : 0 }
                                onTableChange={ this.handleTableChange }
                                columns={columns}
                            /> 
                        </div>   
                        <EmployeeFilterSidebar 
                            {...this.props} 
                            lang={this.props.lang} 
                            filter_sidebar_show={filter_sidebar_show} 
                            filterEmployees={this.filterEmployees}
                            closeSidebar={this.closeSidebar} 
                            costcenter_selected={this.state.costcenter_selected}
                        />                   
                    </div>
                </>
            );
        } else if (employees.isFetching){
            return(<Loading/>);
        } else {
            return(<></>);
        }
    }
}

const mapStateToProps = state => {
    return {
        employees: state.employees,
        user:   state.user,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getAllEmployees: (statuses, page, ppp, filters, sorting) => dispatch(getAllEmployees(statuses, page, ppp, filters, sorting)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(EmployeesManagement);