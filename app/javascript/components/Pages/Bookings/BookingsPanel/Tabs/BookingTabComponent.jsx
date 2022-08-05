import React, { Component } from 'react';
import { toast }            from 'react-toastify';
import { connect }          from "react-redux";
import { Button }           from 'reactstrap';
import { Link }             from 'react-router-dom';
import BootstrapTable       from 'react-bootstrap-table-next';
import filterFactory, { 
       dateFilter,
       textFilter
}                           from 'react-bootstrap-table2-filter';
import paginationFactory    from 'react-bootstrap-table2-paginator';
import moment               from 'moment';

import { 
    removeBooking, 
    getPageOfBookings
}                                         from '../../../../../actions/BookingsActions';
import { _convertDateToNormalViewString } from '../../../../../utils/functions';
import * as config from '../../../../../config/config';
import axios from 'axios'; 

import * as tabs   from '../../../../../constants/TabsTypes';
import * as rbac   from '../../../../../rbac/rbac';
import * as rights from '../../../../../constants/Rights';

import LocalizedStrings from 'react-localization';

import Loading from '../../../Loading/LoadingComponent';
import ModalWindow from '../../../ModalWindow/ModalWindowComponent';
import FilterSidebar from './FilterSidebar';

import './BookingTab.css';
import * as styles from '../../../../../constants/Styles';
import { pageListRenderer } from '../../../../../constants/Styles';
import { processTableData } from '../../../../../constants/TableUtils';

let strings = new LocalizedStrings({
    en:{
        bookings:       "Buildings",
        nobookings:     "No current bookings",
        edit:           "Edit",
        comment:        "Comment",
        delete:         "Delete",
        add:            "Add",
        book_from:      "Date from",
        book_to:        "Date to",
        place:          "Place",        
        status:         "Status",
        archive:        "Archive",
        current:        "Current",
        costcetner:     "Costcenter",
        action:         "Action",
        nameandsurname: "Surname Name",
        costcenter:     "Costcenter",
        showing:        "Showing",
        from:           "from",
        to:             "to",
        of:             "of",
        results:        "Results",
        delete:         "Delete",
        header:         "Delete booking",
        description:    "The booking will be deleted permanently.",
        yes:            "Yes",
        no:             "No",
        changessaved:   "Changes Saved!",
        all:            "ALL BOOKINGS",
        mybookings:     "MY BOOKINGS",
        filter:         "Filter",
        download:       "Download",
        bookingplace:   "Booking place",
        bookingfrom:    "from",
        bookingto:      "to",
        bookingcompleted: "completed",
        bookingnotcompleted: "not completed",
        changesnotsaved: "Changes not saved",
        location_name: "Room number",
        buildings_name: "Business Center",
        creation_date: "Creation date",
        no_data: "No data found"
    },
    ru: {
        bookings:       "Бронирования",
        nobookings:     "Текущие бронирования отсутсвуют",
        edit:           "Редактировать",
        comment:        "Комментарий",
        delete:         "Удалить",
        add:            "Добавить",
        book_from:      "Дата начала",
        book_to:        "Дата окончания",
        place:          "Место",
        status:         "Статус",
        archive:        "Архив",
        current:        "Текущее",
        costcetner:     "МВЗ",
        action:         "Действие",
        nameandsurname: "Фамилия и Имя",
        costcenter:     "МВЗ",
        showing:        "Отображено",        
        from:           "с",
        to:             "по",
        of:             "из",
        results:        "всего",
        header:         "Удалить бронирование",
        description:    "Бронирование будет удалено навсегда.",
        yes:            "Да",
        no:             "Нет",
        changessaved:   "Изменения сохранены!",
        all:            "ВСЕ БРОНИРОВАНИЯ",
        mybookings:     "МОИ БРОНИРОВАНИЯ",
        filter:         "Фильтр",
        download:       "Скачать",
        bookingplace:   "Бронирование места",
        bookingfrom:    "с",
        bookingto:      "по",
        bookingcompleted: "выполнено",
        bookingnotcompleted: "не выполнено",
        changesnotsaved: "Изменения не сохранены",
        location_name: "Номер помещения",
        buildings_name: "Бизнес-центр",
        creation_date: "Дата создания",
        no_data: "Данные не найдены"
    },
    de: {
        bookings:       "Gebäude",
        nobookings:     "Keine aktuellen Buchungen",
        edit:           "Bearbeiten",
        comment:        "Kommentar",
        delete:         "Löschen",
        add:            "Hinzufügen",
        book_from:      "Datum von",
        book_to:        "Datum bis",
        place:          "Ort",    
        status:         "Status",
        archive:        "Archiv",
        current:        "Strom",
        costcetner:     "Costcenter",
        action:         "Aktion",
        nameandsurname: "Nachname Vorname",
        costcenter:     "Costcenter",
        showing:        "Zeigen",        
        from:           "von",
        to:             "zu",
        of:             "von",
        results:        "Ergebnisse",
        header:         "Gebäude mit Namen löschen",
        description:    "Das Gebäude wird dauerhaft gelöscht.",
        yes:            "Ja",
        no:             "Nein",
        changessaved:   "Änderungen gespeichert!",
        all:            "ALLE BUCHUNGEN",
        mybookings:     "MEINE BUCHUNGEN",
        filter:         "Filter",
        download:       "Download",
        bookingplace:   "Reservierung für Platz",
        bookingfrom:    "von",
        bookingto:      "bis",
        bookingcompleted: "ist abgeschlossen",
        bookingnotcompleted: "nicht ausgeführt",
        changesnotsaved: "Änderungen nicht gespeichert",
        location_name: "Zimmernummer",
        buildings_name: "Business Center",
        creation_date: "Erstellungsdatumя",
        no_data: "Keine Daten gefunden"
    }
});

const DEFAULT_TABLE_PAGE_NUMBER = 1;
const EMPLOYEE_ID = "employee_id";

class BookingTab extends Component {

    notify = (success, text) => {
        success 
            ? toast.success(text, {
                position: toast.POSITION.TOP_RIGHT
            })
            : toast.error(text, {
                position: toast.POSITION.TOP_RIGHT
            })
    }

    constructor(props) {
        super(props)

        this.state = {
            page: DEFAULT_TABLE_PAGE_NUMBER,
            sizePerPage: 10,
            totalSize: 0,
            sortField: "created_at",
            sortOrder: "desc",
            filters: [],
            triggerModal: false,
            booking_id_to_remove: null,
            filter_sidebar_show: false,
            selected_buidings: [],
            archive_booking: true,
            current_booking: true,
            costcenter_selected: [],
            message_shown: false,
            firstLoad: true
        }

        this.closeSidebar = this.closeSidebar.bind(this);
        this.openSidebar = this.openSidebar.bind(this);
        this.filterBookings = this.filterBookings.bind(this);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        // this.props.history.push(`/bookings?key=${this.props.tabType}`)
    }

    componentDidMount() {
    };

    componentDidUpdate(prevProps) {
        const info_list_add = localStorage.getItem('show_add_booking_info') ? localStorage.getItem('show_add_booking_info').split('_') : [];
        const info_list_update = localStorage.getItem('show_update_booking_info');
        const {bookings} = this.props;

        if (this.props.bookings !== prevProps.bookings) {
            this.setState({
                totalSize: bookings.count,
                triggerModal: false,
                booking_id_to_remove: null
            })
        }

        if(!this.props.bookings.isFetchingAdd && !this.props.bookings.error && info_list_add.length > 0) {
            localStorage.removeItem('show_add_booking_info');
            this.notify(true, `${strings.bookingplace} ${info_list_add[0]} ${strings.bookingfrom} ${info_list_add[1]} ${strings.bookingto} ${info_list_add[2]} ${strings.bookingcompleted}`);
        } else if (!this.props.bookings.isFetchingAdd && this.props.bookings.error && info_list_add.length > 0) {
            localStorage.removeItem('show_add_booking_info');
            this.notify(false, this.props.bookings.msg);
        }

        if(!this.props.bookings.isFetchingUpdate && !this.props.bookings.error && info_list_update) {
            localStorage.removeItem('show_update_booking_info');
            this.notify(true, info_list_update);
        } else if (!this.props.bookings.isFetchingUpdate && this.props.bookings.error && info_list_update) {
            localStorage.removeItem('show_update_booking_info');
            this.notify(false, this.props.bookings.msg);
        }

        if (this.state.firstLoad && this.props.search.costcenters_all && this.props.search.costcenters_all.length > 0) {
            this.setState({
                costcenter_selected: [
                    { id: -1, name: strings.selectAll },
                    ...this.props.search.costcenters_all.filter(v => v['id'] !== 1).map(v => {
                        return { id: v['number'], name: `${v['name']} (${v['number']})` }
                    })
                ],
                firstLoad: false
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        if (this.props.tabType !== nextProps.tabType) {
            this.setState({ triggerModal: false });
        }
    }

    loadBookings = (page, sizePerPage, sortField, sortOrder, filters) => {
        const {getPageOfBookings, tabType, user} = this.props;

        if (tabType === tabs.ALL) {
            const allFilters = filters.filter(filter => filter.field !== EMPLOYEE_ID);


            getPageOfBookings(page, sizePerPage, allFilters, sortField, sortOrder).then(response => {
                this.setState({
                    page: page,
                    sizePerPage: sizePerPage,
                    filters: filters,
                    sortField: sortField,
                    sortOrder: sortOrder
                });
            });
        } else if (tabType === tabs.MY_BOOKINGS) {

            if (!filters.some(filter => filter.field == EMPLOYEE_ID)) {
                filters.push({field: EMPLOYEE_ID, value: user.user.data.id});
            }

            getPageOfBookings(page, sizePerPage, filters, sortField, sortOrder).then(response => {
                this.setState({
                    page: page,
                    sizePerPage: sizePerPage,
                    filters: filters,
                    sizePerPage: sizePerPage,
                    sortField: sortField,
                    sortOrder: sortOrder
                });
            });
        }
    };

    handleTableChange = (type, {page, sizePerPage, sortField, sortOrder}) => {
        const filters = [];
        let choosenPage = page;

        if (type === 'sort') {
            choosenPage = DEFAULT_TABLE_PAGE_NUMBER;
        }

        this.loadBookings(choosenPage, sizePerPage, sortField, sortOrder, filters);
    }

    closeSidebar() { this.setState({ filter_sidebar_show: false }); }

    openSidebar() { this.setState({ filter_sidebar_show: true }); }

    filterBookings(checkbox_buildings, archive_booking, current_booking, costcenter_selected, dateStart, dateEnd, name_surname) {
        const {sizePerPage, sortField, sortOrder } = this.state;
        
        const buildingIds = checkbox_buildings.reduce((p, c) => {
            if (c.value) {
                p.push(c.id);
            }
            return p;
        }, []);

        const costCentersIds = costcenter_selected.reduce((p, c) => {
            if (c.id != -1) {
                p.push(c.id);
            }
            return p;
        }, []);

        const filters = [
            {
                field: "buildings",
                value: buildingIds.toString()
            },
            {
                field: "archive_bookings",
                value: archive_booking
            },
            {
                field: "current_booking",
                value: current_booking
            },
            {
                field: "costcenter_selected",
                value: costCentersIds.toString()
            },
            {
                field: "dateFrom",
                value: dateStart
            },
            {
                field: "dateTo",
                value: dateEnd
            },
            {
                field: "employee_label",
                value: name_surname
            },

        ];

        this.loadBookings(DEFAULT_TABLE_PAGE_NUMBER, sizePerPage, sortField, sortOrder, filters);
    }

    setUpColumns = () => {
        const {tabType, user} = this.props;
        const today = moment();

        const columns = [
            {
                dataField: 'employee_label',
                text:      strings.nameandsurname,
                sort:      true,
                sortCaret: styles.sortCaretStyle,
                formatter: (cell, row, rowIndex) => {  
                    return <div>{!!cell ? cell : "-"}</div>;
                },
                headerStyle: styles.headerStyles
            }, {
                dataField: 'created_at',
                text:      strings.creation_date,
                sort:      true,
                sortCaret: styles.sortCaretStyle,
                formatter: (cell, row, rowIndex) => {  
                    return <div>
                            {_convertDateToNormalViewString(cell)}
                        </div>;
                },
                headerStyle: styles.headerStyles
            }, {
                dataField: 'book_from',
                text:      strings.book_from,
                sort:      true,
                sortCaret: styles.sortCaretStyle,
                formatter: (cell, row, rowIndex) => {  
                    return <div>
                            {_convertDateToNormalViewString(cell)}
                        </div>;
                },
                headerStyle: styles.headerStyles
            }, {
                dataField: 'book_to',
                text:      strings.book_to,
                sort:      true,
                sortCaret: styles.sortCaretStyle,
                formatter: (cell, row, rowIndex) => {  
                    return <div>
                            {_convertDateToNormalViewString(cell)}
                        </div>;
                },
                headerStyle: styles.headerStyles
            }, {
                dataField: 'object_item.buildings_name',
                text:      strings.buildings_name,
                sort:      true,
                headerStyle: styles.headerStyles,
                sortCaret: styles.sortCaretStyle,
            }, {
                dataField: 'object_item.location_name',
                text:      strings.location_name,
                sort:      true,
                headerStyle: styles.headerStyles,
                sortCaret: styles.sortCaretStyle,
            }, {
                dataField: 'place_path',
                text:      strings.place,
                sort:      true,
                formatter: (cell, row, rowIndex) => {  
                    return <a className="place_link" href={`/floors/${row.object_item.floor_id}?object_id=${row.object_item.id}&search=true`}>{cell}</a>;
                },
                headerStyle: styles.headerStyles,
                sortCaret: styles.sortCaretStyle,
            }, {
                dataField: 'status',
                text:      strings.status,
                sort:      true,
                headerStyle: styles.headerStyles,
                sortCaret: styles.sortCaretStyle,
                formatter: (cell, row, rowIndex) => {
                    const status = (moment(row.book_from).diff(today, 'days') >= 0 || moment(row.book_to).diff(today, 'days') >= 0)
                        ? strings.current  
                        : strings.archive;
                    
                    return status;
                }
            }, {
                dataField: 'object_item.costcenter_num',
                text:      strings.costcenter,
                sort:      true,
                headerStyle: styles.headerStyles,
                sortCaret: styles.sortCaretStyle,
            }
        ];

        const actionsColumn = {
            dataField: '_',
            text:      strings.action,
            sortCaret: styles.sortCaretStyle,
            formatter: (cell, row, rowIndex, extraData) => { 
                const book_from_                   = moment(row.book_from);
                const book_to_                     = moment(row.book_to); 
                const today                        = moment(); 
                const bookingStarted_with_today    = (book_from_.diff(today, 'days') >= 0 || book_to_.diff(today, 'days') > 0);
                const bookingStarted_without_today = (book_from_.diff(today, 'days') > 0 || book_to_.diff(today, 'days') > 0);
                const bookingIsCurrent             = (book_from_.diff(today, 'days') >= 0 || book_to_.diff(today, 'days') >= 0);
                const buttons                      = 
                    <>
                        {bookingStarted_with_today && (bookingIsCurrent || (extraData.allTab && extraData.canEditAllBokings)) ? (
                            <Link to={`/bookings/${row.id}/edit?previous_page=${tabType}`}>
                                <img src={`/img/pics/edit_button.svg`} className="buttons_m"></img>
                            </Link>
                        ) : (<></>)}
                        {(bookingIsCurrent && bookingStarted_with_today) || extraData.canDeleteAllBokings ? (
                            <> 
                                <img 
                                    onClick={() => {this.setState({ triggerModal: true, booking_id_to_remove: row.id})}} 
                                    src={`/img/pics/delete_button.svg`}
                                    className="buttons_m"
                                ></img>                                 
                            </>
                        ) : (<></>)}
                    </>;
                return buttons;
            },
            formatExtraData: {
                delete_text:         strings.delete,
                edit_text:           strings.edit,
                allTab:              tabType === tabs.ALL,
                canDeleteAllBokings: user && user.loggingIn && user.user.rights && rbac.isSatisfied([rights.DELETE_ALL_BOOKINGS], user.user.rights),
                canEditAllBokings:   user && user.loggingIn && user.user.rights && rbac.isSatisfied([rights.EDIT_ALL_BOOKINGS], user.user.rights),
            },
            headerStyle: styles.headerStyles
        };

        const commentColumn = {
            dataField:   'comment',
            text:        strings.comment,
            sort:        true,
            headerStyle: styles.headerStyles,
            sortCaret: styles.sortCaretStyle,
        }; 
        

        if (tabType === tabs.ALL) {
            columns.push(commentColumn);
        }

        columns.push(actionsColumn);

        return columns;
    };

    render() {
        const { 
            triggerModal, 
            booking_id_to_remove, 
            filter_sidebar_show, 
            page,
            sizePerPage,
            totalSize,
            filters,
            sortField,
            sortOrder
        } = this.state;
        const { user, bookings, tabType} = this.props;
        const {tableData, noDataIndicator} = processTableData(bookings, strings.no_data);

        const columns = this.setUpColumns();
        
        if (user && user.loggingIn) {
            const customTotal = (from, to, size) => (
                <span className="react-bootstrap-table-pagination-total">
                  { strings.showing } { strings.from } { from } { strings.to } { to } { strings.of } { size } { strings.results }
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
                    <div id="content" className="container-fluid with_tabs overflow-auto with-actions">
                        {/* {tabType !== tabs.ALL? (
                            <h1 id="page-title-bookings">{ strings.mybookings }</h1>
                        ) : (
                            <h1 id="page-title-bookings">{ strings.all}</h1>
                        )}   */}
                        <div className="open_filter_sidebar_button">
                            <button 
                                className="button-magenta button-simple" 
                                onClick={() => { this.openSidebar(); }}
                            >{strings.filter}</button>
                            <button 
                                className="button-magenta button-simple"
                                onClick={() => { 
                                    let filters_buf = filters;
                                    let user_id = tabType === tabs.ALL 
                                        ? ''
                                        : user && user.loggingIn 
                                            ? user.user.data.id 
                                            : '';
                                    if (!!user_id) { filters_buf.push({ field: 'employee_id', value: user_id}) }      
                                    return axios.post(
                                        `${config.baseUrl}/get_bookings`,
                                        { 
                                            per_page: 0,
                                            page: 0,
                                            filters: filters_buf,
                                            sorting: {field: sortField, order: sortOrder},
                                            user_id: user_id,
                                            as_file: true
                                        }, { headers: { Authorization: localStorage.getItem('auth_token') }, responseType: 'blob' },)                               
                                        .then(response => {
                                            if (!window.navigator.msSaveOrOpenBlob) {
                                                // BLOB NAVIGATOR
                                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                                const link = document.createElement('a');
                                                link.href = url;
                                                link.setAttribute('download', `bookings_${!!!user_id ? 'all' : 'my'}}.xls`);
                                                document.body.appendChild(link);
                                                link.click();
                                            } else {
                                                // BLOB FOR EXPLORER 11
                                                const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]), `bookings_${all_bookings ? 'all' : 'my'}}.xls`);
                                            }
                                        }).catch(error => { throw(error); });
                                }}
                            >{strings.download}</button>
                        </div>  
                        <div className="default-table-style-container table_custom table_custom_with_tabs">                    
                            <BootstrapTable
                                remote
                                className="table_booking"
                                keyField='id'
                                data={ tableData }
                                columns={ columns }
                                filter={ filterFactory() }
                                pagination={ paginationFactory(options) }
                                bordered={false}
                                rowStyle={ (row, rowIndex) => {
                                    return { backgroundColor: rowIndex % 2 == 0 ? "#ededed" : "white" };
                                } }
                                noDataIndication={noDataIndicator}   
                                onTableChange={this.handleTableChange}
                            />
                        </div>
                    </div>
                    <ModalWindow 
                        modalIsOpen={triggerModal}
                        header={
                            <div className="modal-header-1">
                                <div className="close-modal" >
                                    <img className="close-link" src="/img/pics/cross_black.svg" onClick={() => this.setState({ triggerModal: false})}></img>
                                </div>
                                <h2>{strings.header}?</h2>
                            </div>
                        }
                        body={
                            <div className="modal-body-1">
                                <p>{strings.description}</p>
                                <div className="modal-buttons">
                                    <Button 
                                        className="button-magenta button_usual btn_small"
                                        onClick={() => { this.props.removeBooking(booking_id_to_remove); 
                                            const {sizePerPage, filters, sortField, sortOrder, page} = this.state;
                                            this.setState({ triggerModal: false});
                                            this.loadBookings(page, sizePerPage, sortField, sortOrder, filters);
                                        }}
                                    >{strings.yes}</Button>
                                    <Button 
                                        className="button_usual button_decline btn_small btn_right"
                                        onClick={() => { this.setState({ triggerModal: false})}}
                                    >{strings.no}</Button>
                                </div>
                            </div>
                        }
                    />
                    <FilterSidebar 
                        {...this.props} 
                        lang={this.props.lang} 
                        filter_sidebar_show={filter_sidebar_show} 
                        filterBookings={this.filterBookings}
                        closeSidebar={this.closeSidebar} 
                    />
                </>
            );
        } else {
            return(<Loading/>);
        }
    }
}

const mapStateToProps = state => {
    return {
        bookings: state.bookings,
        user:     state.user,
        search:   state.search,
        getPageOfBookings: state.getPageOfBookings,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        removeBooking:     (id) => dispatch(removeBooking(id)),
        getPageOfBookings: (page, sizePerPage, filters, sortField, sortOrder, allBookings) => dispatch(getPageOfBookings(page, sizePerPage, filters, sortField, sortOrder, allBookings))
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(BookingTab);