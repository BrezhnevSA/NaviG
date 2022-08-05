import React, { Component, Children } from 'react';
import Radium               from 'radium';
import { Link }             from 'react-router-dom';
import { connect }          from "react-redux";
import { AsyncTypeahead }   from 'react-bootstrap-typeahead';
import { addDays, endOfToday, sub }     from 'date-fns';
import { 
    Calendar, 
    momentLocalizer 
}                           from 'react-big-calendar';
import BootstrapTable       from 'react-bootstrap-table-next';
import moment               from 'moment';
import queryString          from 'query-string';
import { toast }            from 'react-toastify';
import { searchEmployees }  from '../../../../actions/SearchActions';
import { getProfile }       from '../../../../actions/ProfileActions';
import Select, { createFilter, components } from 'react-select';
import makeAnimated         from 'react-select/animated';
import ReactTooltip         from 'react-tooltip';
import { Multiselect }      from 'multiselect-react-dropdown';
import {
    FormGroup,
    Label,
    Input,
    Form,
    Button,
}                          from 'reactstrap';
import {
    updateObject,
    getFloorDetails,
    selectNewElement,
    updateOneMetaValue
}                          from '../../../../actions/FloorActions';
import { 
    addBooking,
    getPageOfBookings,
    getPageOfBookingsForPlace
}                          from '../../../../actions/BookingsActions';
import {
    removeAvailableDates,
    addAvailableDates,
    updateAvailableDates
}                          from '../../../../actions/AvailableDatesForParkingActions';

import * as rbac   from '../../../../rbac/rbac';
import * as rights from '../../../../constants/Rights';
import * as settings from '../../../../constants/AppSettings';
import * as oi_statuses from '../../../../constants/ObjectItemsStatus';

import Loading from '../../Loading/LoadingComponent';
import ModalWindow from '../../ModalWindow/ModalWindowComponent';

import LocalizedStrings from 'react-localization';

import { MAX_AVAILABLE_DAYS_TO_BOOK } from '../../../../constants/AppSettings';

const animatedComponents = makeAnimated();

const Placeholder = props => {
    return <components.Placeholder {...props} />;
};

const localizer = momentLocalizer(moment);

let strings = new LocalizedStrings({
    en:{
        comment: "Comment",
        save: "Save",
        clear: "Clear",
        reservation: "Reservation",
        guest: "Guest",
        sharing: "Sharing",
        fixation: "Fixation",
        employee: "Employee",
        object: "Object",
        placeholder_name: "Enter employee name",
        placeholder_comment: "Enter comment",
        placeholder_mzv: "Select Costcenter",
        to_book: "To book",
        select_date_booking: "Select booking date",
        cant_book: "Place belongs to another cost center",
        select_range: "Select the booking period",
        setcostcenter: "Select Costcenter",
        confirmbooking: "Confirm booking",
        changessaved:     "Changes Saved!",
        bookingplace: "Booking place",
        bookingfrom: "from",
        bookingto: "to",
        bookingcompleted: "completed",        
        search: "Search",
        searching: "Searching",
        noresults: "No results found",
        dispaddresults: "Display additional results",
        today: "Today",
        previous: "Previous",
        next: "Next",
        youbooking: "Your booking",
        cancel: "Cancel",
        header: "Period",
        timetable: "Seat reservation",
        datebooking: "Booking dates",
        desk_status: "Desk Status",
        select_costcenter: "Select Costcenter",
        place_not_ready: "Place is not ready for booking",
        authorize: "Login required",
        cant_book_in_your_office: "You can book a place in another business center",
        youhavebooking: "You already have a reservation for the current period",
        cant_choose_this_dates: "Choosen dates are not available for booking",
        not_active: "Not active",
        not_safe: "Unsafe place",
        to_warehouse: "Transferred to warehouse",
        to_employee: "Transferred to Employee",
        to_junk: "Junk",
        select_not_active: "Select a write-off destination",
        header_notactive: "Confirm status change",
        description_notactive: "When you save a change to a table's status, it will be hidden from the map in view mode.",
        yes: "Yes",
        cancel: "Cancel",
        book_for_tommorow: "Book for tomorrow",
        select_dates: "Open dates for booking",
        actions: "Actions",
        available_sharing_dates: "Available dates for booking",
        opened_sharing_dates: "Open booking dates",
        apply_dates: "Allow parking space reservation",
        your_date: "Date",
        allow_booking_date: "Allow booking a seat"
    },
    ru: {
        comment: "Комментарий",
        save: "Сохранить",
        clear: "Очистить",
        reservation: "Резерв",
        guest: "Гостевое",
        sharing: "Sharing",
        fixation: "Фиксация",
        employee: "Сотрудник",
        object: "Объект",
        placeholder_name: "Введите имя и/или фамилию",
        placeholder_comment: "Введите комментарий",
        placeholder_mzv: "Выберите МВЗ",
        to_book: "Забронировать",
        select_date_booking: "Выбрать дату бронирования",
        cant_book: "Место принадлежит другому МВЗ.",
        select_range: "Выберите период бронирования",
        setcostcenter: "Выберите МВЗ",
        confirmbooking: "Подтверждение бронирования",
        changessaved:     "Изменения сохранены!",
        bookingplace: "Бронирование места",
        bookingfrom: "с",
        bookingto: "по",
        bookingcompleted: "выполнено",
        search: "Поиск",
        searching: "Идет поиск",
        noresults: "Не найдено ни одного совпадения",
        dispaddresults: "Показать ещё результаты",
        today: "Текущий",
        previous: "Предыдущий",
        next: "Следующий",
        youbooking: "Ваше бронирование",
        cancel: "Отменить",
        header:"Бронирование стола ",
        timetable: "Бронирование места",
        datebooking: "Период",
        desk_status: "Статус Стола",
        select_costcenter: "Выберите МВЗ",
        place_not_ready: "Место не готово для бронирования",
        authorize: "Необходимо авторизоваться",
        cant_book_in_your_office: "Вам доступно бронирование места в другом БЦ",
        youhavebooking: "У вас уже есть бронирование на текущий период",
        cant_choose_this_dates: "Выбранные даты недоступны для бронирования",
        not_active: "Неактивный",
        not_safe: "Небезопасное место",
        to_warehouse: "Передано на склад",
        to_employee: "Передано сотруднику",
        to_junk: "В утиль",
        select_not_active: "Выберете назначение списания",
        header_notactive: "Подтвердите изменение статуса",
        description_notactive: "При сохранении изменения статуса стола, он будет скрыт с карты в режиме просмотра.",
        yes: "Да",
        cancel: "Отмена",
        book_for_tommorow: "Забронировать на завтра",
        select_dates: "Открыть даты для бронирования",
        actions: "Действия",
        available_sharing_dates: "Доступные даты для бронирования",
        opened_sharing_dates: "Открытые даты бронирования",
        apply_dates: "Разрешить бронирование парковочного места",
        your_date: "Дата",
        allow_booking_date: "Разрешить бонирование места"
    },
    de: {
        comment: "Kommentar",
        save: "Speichern",
        clear: "klar",
        reservation: "Reservierung",
        guest: "Gast",
        sharing: "Teilen",
        fixation: "Fixierung",
        employee: "Mitarbeiterin",
        object: "Objekt",
        placeholder_name: "Geben Sie den Namen des Mitarbeiters ein",
        placeholder_comment: "Kommentar eingeben",
        placeholder_mzv: "Wählen Kostenstelle",
        to_book: "Buchen",
        select_date_booking: "Buchungsdatum auswählen",
        cant_book: "Platz gehört zu einer anderen Kostenstelle.",
        select_range: "Buchungszeitraum auswählen",
        setcostcenter: "Kostenstelle auswählen",
        confirmbooking: "Buchung bestätigen",
        changessaved:     "Änderungen gespeichert!",
        bookingplace: "Reservierung für Platz",
        bookingfrom: "von",
        bookingto: "bis",
        bookingcompleted: "ist abgeschlossen",
        search: "Suche",
        searching: "Suchen",
        noresults: "Keine Ergebnisse gefunden",
        dispaddresults: "Zusätzliche Ergebnisse anzeigen",
        today: "Aktuell",
        previous: "Zurück",
        next: "Weiter",
        youbooking: "Ihre Buchung",
        cancel: "Abbrechen",
        header:"Zeitraum",
        timetable:"Sitzplatzreservierung",
        datebooking: "Buchungstermine",
        desk_status: "Tabellenstatus",
        select_costcenter: "Costcenter auswählen",
        place_not_ready: "Platz ist noch nicht buchbar",
        authorize: "Anmeldung erforderlich",
        cant_book_in_your_office: "Sie können einen Platz in einem anderen Business Center buchen",
        youhavebooking: "Sie haben bereits eine Reservierung für den aktuellen Zeitraum",
        cant_choose_this_dates: "Ausgewählte Daten sind nicht buchbar",
        not_active: "Inaktiv",
        not_safe: "Unsicherer Ort",
        to_warehouse: "Übertragen ins Lager",
        to_employee: "auf Mitarbeiter übertragen",
        to_junk: "Müll",
        select_not_active: "Wählen Sie ein Abschreibungsziel aus",
        header_notactive: "Statusänderung bestätigen",
        description_notactive: "Wenn Sie eine Änderung am Status einer Tabelle speichern, wird sie im Ansichtsmodus aus der Karte ausgeblendet.",
        yes: "Ya",
        cancel: "Abbrechen",
        book_for_tommorow: "Buchen Sie für morgen",
        select_dates: "Offene Termine für die Buchung",
        actions: "Actionen",
        available_sharing_dates: "Verfügbare Daten zur Buchung",
        opened_sharing_dates: "Offene Buchungsdaten",
        apply_dates: "Parkplatzreservierung zulassen",
        your_date: "Datum",
        allow_booking_date: "Platzreservierung zulassen"
    }
});

const PER_PAGE = 10;

class SidebarObjectForm extends Component {

    _cache = {};
    cachedQuery = { options: [], page: 1 };

    
    notify = (success, text, static_text = false) => {
        success || static_text
            ? toast.success(text, {
                position: toast.POSITION.TOP_RIGHT
            })
            : toast.error(text, {
                position: toast.POSITION.TOP_RIGHT
            })
    }

    constructor(props) {
        super(props);
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        let costcenters = [];
        let costcenters_options = [];
        let costcenter_selected = { value: "", label: strings.setcostcenter };
        if (!!this.props.floor.costcenters) {
            costcenters = this.props.floor.costcenters.filter(с => !!с['attributes']['name']);

            costcenters = costcenters.sort(function(a, b) {
                const textA = a.attributes.name.toUpperCase();
                const textB = b.attributes.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });

            costcenters_options = [
                { value: "", label: strings.setcostcenter},
                ...costcenters.filter(v => v['id'] !== 1)
                .map(v => {
                    return{ value: v['attributes']['number'], label: `${v['attributes']['name']} (${v['attributes']['number']})` }
                })
            ];

            let costcenter_found = costcenters_options.find(e => e.value  === this.props.floor.selected_item.costcenter_num);
            costcenter_selected = costcenter_found !== undefined 
                ? costcenter_found 
                : { value: "", label: strings.setcostcenter };

        }

        const attribute_notactive = this.props.floor.attributes.find(a => a.metable_id == this.props.floor.selected_item.id && a.meta_field_id == settings.NOTACTIVE_DESK_ID && !!a.value)
        const notactive_options = [ 
            { id: 0, name: strings.not_safe }, 
            { id: 1, name: strings.to_warehouse },
            { id: 2, name: strings.to_employee },
            { id: 3, name: strings.to_junk }
        ];
        this.state = {
            selected_subtype: this.props.floor.selected_subtype,
            desk_fix_type: this.props.floor.selected_item.status,
            costcenter: this.props.floor.selected_item.costcenter_num,
            costcenters: costcenters,
            costcenters_options: costcenters_options,
            costcenter_selected: costcenter_selected,
            employee: this.props.floor.selected_item.employee_id,
            comment: this.props.floor.selected_item.comment,
            isLoading: false,
            options: [],
            query: '',
            selected: null,
            selectionRange: {
                startDate: null,
                endDate:   null,
                key:       'select'
            },
            firstLoad: true,
            locale:    this.props.lang.toLowerCase() === 'es' 
                ? 'enUS' 
                : this.props.lang.toLowerCase(),
            bookings_got: false,
            triggerModal: false,
            changed:      false,
            cant_book:    false,
            notactive_selected: !!attribute_notactive ? [ {id: parseInt(attribute_notactive.value), name: notactive_options.find(no => no.id == parseInt(attribute_notactive.value)).name} ] : [],
            notactive_options: notactive_options,
            triggerModalDelete: false,
            selectionRange2: {
                date_start: null,
                date_end:   null,
                key:       'select'
            },
            excluded_range: {
                date_start: null,
                date_end: null,
                changed: false,
                id: null
            },
            updated_object: null,
            available_dates_filtered_for_calendar: [],
            available_dates_filtered: [],
            bookings_preview: [],
            filtered_bookings: []
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.onChangedValueHandler = this.onChangedValueHandler.bind(this);
        this.updateEmployees = this.updateEmployees.bind(this);
        this.sidebarDeskSubmit = this.sidebarDeskSubmit.bind(this);
        this.sidebarDeskSubmitForNotAcive = this.sidebarDeskSubmitForNotAcive.bind(this);
        this.addBooking_ = this.addBooking_.bind(this);
        this.handleSlotSelection = this.handleSlotSelection.bind(this);
        this.eventStyleGetter = this.eventStyleGetter.bind(this);
        this.handleSlotSelection2 = this.handleSlotSelection2.bind(this);
        this.eventStyleGetter2 = this.eventStyleGetter2.bind(this);
    }

    componentDidMount() {
        
        if (Number.isInteger(this.props.floor.selected_item.employee_id)) {
            this.props.getProfile(this.props.floor.selected_item.employee_id);
        }
    }

    componentDidUpdate(prevProps) {
        const { user, floor, search, profile } = this.props;
        const { bookings_got, costcenters_options } = this.state;
        const info_list_add = localStorage.getItem('show_add_booking_info') ? localStorage.getItem('show_add_booking_info').split('_') : [];
        const attribute_notactive = this.props.floor.attributes.find(a => a.metable_id == this.props.floor.selected_item.id && a.meta_field_id == settings.NOTACTIVE_DESK_ID && !!a.value)

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        if (floor.selected_item.employee_id &&
            floor.selected_item.employee_id !== this.state.employee) {
            this.setState({
                employee: floor.selected_item.employee_id,
                selected: null,
                costcenter: 0,
                costcenter_selected: { value: "", label: strings.setcostcenter },
                triggerModal: false,
                triggerModalDelete : false,
                cant_book:    false,
                available_dates_filtered_for_calendar: [],
                available_dates_filtered: [],
                bookings_preview: [],
                filtered_bookings: []
            });
            this.props.getProfile(floor.selected_item.employee_id);
        }

        if (floor.selected_subtype !== prevProps.floor.selected_subtype) {
            this.setState({
                selected_subtype: floor.selected_subtype,
                selected: null,
                costcenter: 0,
                costcenter_selected: { value: "", label: strings.setcostcenter },
                triggerModal: false,
                cant_book:    false,
                triggerModalDelete : false,
                available_dates_filtered_for_calendar: [],
                available_dates_filtered: [],
                bookings_preview: [],
                filtered_bookings: []
            });
        }
        if (floor.selected_item !== prevProps.floor.selected_item) {
            this.setState({
                comment: floor.selected_item.comment,
                selected_subtype: floor.selected_subtype,
                desk_fix_type: floor.selected_item.status,
                costcenter: !!floor.selected_item.costcenter_num ? floor.selected_item.costcenter_num : 0,
                selected: null,
                costcenter_selected: !!floor.selected_item.costcenter_num
                    ? costcenters_options.find(e => e.value === floor.selected_item.costcenter_num || e.value === floor.selected_item.employee_costcenter_num)
                    : { value: "", label: strings.setcostcenter },
                triggerModal: false,
                cant_book:    false,
                triggerModalDelete : false,
                notactive_selected: !!attribute_notactive ? [ {id: parseInt(attribute_notactive.value), name: this.state.notactive_options.find(no => no.id == parseInt(attribute_notactive.value)).name} ] : [],
                available_dates_filtered_for_calendar: [],
                available_dates_filtered: [],
                bookings_preview: [],
                filtered_bookings: []
            });
        }
        if (search.employees !== prevProps.search.employees) {
            this.setState({
                isLoading: false,
                options: search.employees,
                costcenter: 0,
                costcenter_selected: { value: "", label: strings.setcostcenter },
                triggerModal: false,
                cant_book:    false,
                triggerModalDelete : false,
                available_dates_filtered_for_calendar: [],
                available_dates_filtered: [],
                bookings_preview: [],
                filtered_bookings: []
            }, () => {
                this.updateEmployees();
            });
        }
        if (profile !== prevProps.profile && !!profile.item) {
            this.setState({
                selected: [profile.item],
                costcenter: 0,
                costcenter_selected: !!floor.selected_item.costcenter_num
                ? costcenters_options.find(e => e.value === floor.selected_item.costcenter_num || e.value === floor.selected_item.employee_costcenter_num)
                : { value: "", label: strings.setcostcenter },
                triggerModal: false,
                cant_book:    false,
                triggerModalDelete : false,
                available_dates_filtered_for_calendar: [],
                available_dates_filtered: [],
                bookings_preview: [],
                filtered_bookings: []
            });
        }
        if (floor.selected_item.status === 'SHARING' && user && user.loggingIn && user.user.data &&
            !floor.is_Fetching && !bookings_got) {
            this.props.getPageOfBookingsForPlace(0, 0, [
                { field: "floor_id",    value: floor.floor.id }, 
                { field: "place_id",    value: floor.selected_item.id } 
            ], "", "", user.user.data.id, true);
            this.setState({ bookings_got: true, triggerModal: false, triggerModalDelete : false, });
        }

        if(!this.props.bookings.isFetchingAdd && !this.props.bookings.error && info_list_add.length > 0) {
            localStorage.removeItem('show_add_booking_info');
            this.notify(true, `${strings.bookingplace} ${info_list_add[0]} ${strings.bookingfrom} ${info_list_add[1]} ${strings.bookingto} ${info_list_add[2]} ${strings.bookingcompleted}`);
        } else if (!this.props.bookings.isFetchingAdd && this.props.bookings.error && info_list_add.length > 0) {
            localStorage.removeItem('show_add_booking_info');
            this.notify(false, strings.youhavebooking);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { firstLoad, excluded_range, selectionRange, selectionRange2 } = this.state;
        const { floor, bookings, employee_parking_id } = this.props;
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        if (firstLoad) {
            this.setState({
                selectionRange:  {
                    startDate: null,
                    endDate:   null,
                    key:       'select'
                },
                selectionRange2:  {
                    date_start: null,
                    date_end:   null,
                    key:       'select'
                },
                excluded_range: {
                    date_start: null,
                    date_end: null,
                    changed: false,
                    id: null
                },
                firstLoad:    false,
                triggerModal: false,
                cant_book:    false
            })
        }

        if (!nextProps.floor.is_Fetching && !floor.is_Fetching && nextProps.floor.selected_item && 
            nextProps.floor.selected_item.status && nextProps.floor.selected_item.status === oi_statuses.SHARING && 
            floor.selected_item && floor.selected_item.status && 
            floor.selected_item.status === oi_statuses.SHARING && nextProps.floor.selected_item.id != floor.selected_item.id && 
            nextProps.user && nextProps.user.loggingIn && nextProps.user.user.data) {
            this.props.getPageOfBookingsForPlace(0, 0, [
                { field: "floor_id",    value: nextProps.floor.floor.id }, 
                { field: "place_id",    value: nextProps.floor.selected_item.id }
            ], "", "", nextProps.user.user.data.id, true);
            this.setState({
                selectionRange:  {
                    startDate:    null,
                    endDate:      null,
                    key:          'select',
                }, 
                triggerModal: false,
                available_dates_filtered_for_calendar: [],
                available_dates_filtered: [],
                bookings_preview: [],
                filtered_bookings: []
            })
        }

        if (!nextProps.floor.is_Fetching && !floor.is_Fetching && nextProps.floor.selected_item && 
            nextProps.floor.selected_item.status === oi_statuses.SHARING && employee_parking_id) {
            this.setState({
                selectionRange2:  {
                    date_start:    null,
                    date_end:      null,
                    key:          'select',
                },
                excluded_range: {
                    date_start: null,
                    date_end: null,
                    changed: false,
                    id: null
                },
                triggerModal: false,
                available_dates_filtered_for_calendar: [],
                available_dates_filtered: [],
                bookings_preview: [],
                filtered_bookings: []
            })
        }

        if (!nextProps.bookings.isFetchingAdd && !nextProps.bookings.hasOwnProperty('error') && !!this.state.updated_object) {
            this.props.updateObject(this.state.updated_object)
            this.setState({ updated_object: null })
        }

        if (nextProps.parking && nextProps.employee_parking_id && !nextProps.available_dates_for_parking.isFetching) {
            let available_dates_filtered_for_calendar = []
            let available_dates_filtered = nextProps.available_dates_for_parking.items.filter(adfp => adfp.object_item_id == nextProps.floor.selected_item.id)
            available_dates_filtered = excluded_range.changed && !!excluded_range.date_start && !!excluded_range.date_end
                ? available_dates_filtered.filter(adfp => adfp.date_start != excluded_range.date_start && adfp.date_end != excluded_range.date_end)
                    .map(adfp => { 
                        if (adfp.date_start == selectionRange2.date_start && adfp.date_end == selectionRange2.date_end) {
                            adfp.key = 'select';
                        }
                        return adfp;
                    })
                : available_dates_filtered
            if (selectionRange2.date_end && selectionRange2.date_start && excluded_range.changed) { 
                let selectionBuffer = selectionRange2;
                selectionBuffer.date_end = moment(selectionRange2.date_end).subtract(1, 'days').toDate().toDateString();
                selectionBuffer.title = strings.your_date;
                available_dates_filtered.push(selectionBuffer) 
            }
            available_dates_filtered.map(adfp => {
                const date_start = new Date(new Date(adfp.date_start).toDateString())
                const date_end = new Date(new Date(adfp.date_end).toDateString())
                available_dates_filtered_for_calendar.push({
                    title: moment(adfp.date_end).diff(moment(selectionRange2.date_end).subtract(1, 'days'), 'days') == 0 && moment(adfp.date_start).diff(moment(selectionRange2.date_start), 'days') == 0
                        ? strings.your_date 
                        : '⠀', //invisible char
                    start: date_start,
                    end: date_end
                })
            })     
            this.setState({
                available_dates_filtered_for_calendar: available_dates_filtered_for_calendar,
                available_dates_filtered: available_dates_filtered
            })  
        }

        if (!nextProps.floor.is_Fetching && !nextProps.bookings.isFetching_for_place && nextProps.bookings.items_for_place && 
            nextProps.bookings.items_for_place.length > 0 && nextProps.floor.selected_item.status === oi_statuses.SHARING) {
            const today = moment();
            let filtered_bookings = nextProps.bookings.items_for_place.map(item => {
                if (parseInt(item.object_item.id) === parseInt(nextProps.floor.selected_item.id)) {
                    item.title = item.employee_label;
                    item.start = moment(item.book_from).toDate();
                    item.end = moment(item.book_to).toDate();
                    return item;
                } else {
                    return null;
                }
            }).filter(o => o);

            let bookings_preview = filtered_bookings.map(item => {
                if (moment(item.book_from).diff(today, 'days') >= 0 || moment(item.book_to).diff(today, 'days') >= 0) {
                    return item;
                } else {
                    return null;
                }
            }).filter(o => o);

            bookings_preview = bookings_preview.length === 0 ? [{ book_from: null, boot_to: null, employee_label: "-"}] : bookings_preview;

            if (!!selectionRange.startDate && !!selectionRange.endDate) {
                filtered_bookings.push({
                    title: strings.youbooking,
                    start: selectionRange.startDate,
                    end: selectionRange.endDate
                })
            }
            this.setState({
                filtered_bookings: filtered_bookings,
                bookings_preview: bookings_preview
            })
        }
    }

    onChangedValueHandler(e) {
        this.setState({
            costcenter_selected: e
        });
    }

    updateEmployees() {
        
        const { query } = this.state;
        const options = this.cachedQuery.options.concat(this.props.search.employees);
        const page = this.cachedQuery.page;
        this._cache[query] = { ...this.cachedQuery, options, page };

        this.setState({
            isLoading: false,
            options: options,
        });
    }

    closeSidebarClick() {
        this.props.selectNewElement({data: { type: null, data: { id: -1 } } });
    }

    changeReservationType(val) {
        this.setState({
            desk_fix_type: val
        });
    }

    _handleSelection(item) {
        this.setState({
            selected: item
        });
    }

    _handleInputChange = query => {
        this.setState({ query });
    };
    
    _handlePagination = (e, shownResults) => {
        const { query } = this.state;
        this.cachedQuery = this._cache[query];
    
        // Don't make another request if:
        // - the cached results exceed the shown results
        // - we've already fetched all possible results
        if (
            this.cachedQuery.options.length > shownResults ||
            this.cachedQuery.options.length === this.cachedQuery.total_count
        ) {
          return;
        }
    
        this.setState({ isLoading: true });
    
        const page = this.cachedQuery.page + 1;

        this.props.searchEmployees(query, page)
    };
    
    _handleSearch = query => {
        if (this._cache[query]) {
          this.setState({ options: this._cache[query].options });
          return;
        }
    
        this.setState({ isLoading: true });

        this.props.searchEmployees(query, 1)
    };

    handleCommentChange(e) {
        this.setState({
            comment: e.target.value
        });
    }

    sidebarDeskSubmit() {
        const { notactive_selected } = this.state;
        // submit when status of desk not notactive or it's notactive, but attribute 'неактивный стол' have value 0
        if ((!notactive_selected || notactive_selected.length == 0) || (notactive_selected && notactive_selected.length > 0 && notactive_selected[0].id == 0)) { 
            let object = this.props.floor.selected_item;
            object['status'] = this.state.desk_fix_type;

            if (this.state.desk_fix_type !== 'EMPLOYEE') {
                object['costcenter_num'] = this.state.costcenter_selected.value;
            }
            else {
                object['costcenter_num'] = this.props.profile.item ? this.props.profile.item.costcenter_num : null;
            }

            if (this.state.desk_fix_type === 'EMPLOYEE') {
                object['employee_id'] = this.state.selected[0]['id'];
            }
            else {
                object['employee_id'] = null;
            }
            
            object['comment'] = this.state.comment;

            this.props.updateObject(object, true);
            if (notactive_selected && notactive_selected.length > 0) { 
                let attribute = this.props.floor.attributes.find(a => a.metable_id == this.props.floor.selected_item.id && a.meta_field_id == settings.NOTACTIVE_DESK_ID)
                this.props.updateOneMetaValue({ 
                    id: !!attribute ? attribute.id : null, 
                    value: notactive_selected[0].id,
                    meta_field_id: !!attribute ? null: settings.NOTACTIVE_DESK_ID,
                    metable_id: !!attribute ? null: this.props.floor.selected_item.id,
                    metable_type: !!attribute ? null: 'ObjectItem'
                }) 
            }
            this.props.saveAttributes();
            this.notify(false, strings.changessaved, true);
        // submit when status of desk notactive and attribute 'неактивный стол' have value !== 0
        } else if (notactive_selected && notactive_selected.length > 0 && notactive_selected[0].id !== 0) {
            this.setState({ triggerModalDelete: true })
        }
    }

    sidebarDeskSubmitForNotAcive() {
        
        const { notactive_selected } = this.state;

        let object = this.props.floor.selected_item;
        object['status'] = this.state.desk_fix_type;

        if (this.state.desk_fix_type !== 'EMPLOYEE') {
            object['costcenter_num'] = this.state.costcenter_selected.value;
        }
        else {
            object['costcenter_num'] = this.props.profile.item ? this.props.profile.item.costcenter_num : null;
        }

        if (this.state.desk_fix_type === 'EMPLOYEE') {
            object['employee_id'] = this.state.selected[0]['id'];
        }
        else {
            object['employee_id'] = null;
        }
        
        object['comment'] = this.state.comment;

        this.props.updateObject(object, true);
        if (notactive_selected && notactive_selected.length > 0) { 
            let attribute = this.props.floor.attributes.find(a => a.metable_id == this.props.floor.selected_item.id && a.meta_field_id == settings.NOTACTIVE_DESK_ID)
            this.props.updateOneMetaValue({ 
                id: !!attribute ? attribute.id : null, 
                value: notactive_selected[0].id,
                meta_field_id: !!attribute ? null: settings.NOTACTIVE_DESK_ID,
                metable_id: !!attribute ? null: this.props.floor.selected_item.id,
                metable_type: !!attribute ? null: 'ObjectItem'
            }) 
        }
        this.props.saveAttributes();
        this.notify(false, strings.changessaved, true);
    }

    addBooking_() {
        const { selectionRange, changed } = this.state;
        const { floor, user } = this.props;
        this.setState({
            selectionRange:  {
                startDate: null,
                endDate:   null,
                key:       'select'
            } 
        })
        let date_start = selectionRange.startDate.toDateString();
        let date_end = !changed ? sub(selectionRange.endDate, {days: 1}).toDateString() : selectionRange.endDate.toDateString()
        let updated_object = floor.selected_item
        let comparing_date = !!updated_object.parking ? moment().add(1, 'days') : moment()
        let compare_result = Math.ceil(comparing_date.diff(moment(date_start), 'days', true)) >= 1 && Math.ceil(comparing_date.diff(moment(date_end), 'days', true))<= 1
        if (compare_result) { 
            updated_object.occupied = 't' 
            this.setState({updated_object})
        }

        localStorage.setItem('show_add_booking_info', `${floor.selected_item.name}_${moment(selectionRange.startDate).format("DD.MM.YYYY")}_${!changed ? moment(selectionRange.endDate).subtract(1, 'days').format('DD.MM.YYYY') : moment(selectionRange.endDate).format('DD.MM.YYYY')}`);
        this.props.addBooking(date_start, date_end, user.user.data.id, false, floor.selected_item);

        // this.notify(2, floor.selected_item.name, moment(selectionRange.startDate).format("DD.MM.YYYY"), !changed ? moment(selectionRange.endDate).subtract(1, 'days').format("DD.MM.YYYY") : moment(selectionRange.endDate).format("DD.MM.YYYY"));
    }

    handleSlotSelection = ({start, end, action}) => {
        const { bookings, floor, user } = this.props;
        const { available_dates_filtered_for_calendar, filtered_bookings } = this.state;
        let enabled_by_available_dates = false;
        let new_available_dates = available_dates_filtered_for_calendar;
        let new_bookings = filtered_bookings;
        //reset dateTime for only dates comparison
        const today = new Date(new Date().toDateString());
        const user_rights = user && user.user && user.user.rights ? user.user.rights : null;
        const lastAvailableDayToBook = addDays(today, user_rights && rbac.isSatisfied([rights.BOOK_WITN_NO_DATE_LIMITS], user_rights) ? 2000 : MAX_AVAILABLE_DAYS_TO_BOOK);

        const filteredBookingsByPlaceIdAndAvailableToBookRange = bookings.items_for_place
            .filter(booking => parseInt(booking.object_item.id) === parseInt(floor.selected_item.id));

        // check if selected dates in range of available dates for sharing for parking place
        if (available_dates_filtered_for_calendar.length > 0) {
            available_dates_filtered_for_calendar.map(adffc => {
                if (!enabled_by_available_dates) {
                    enabled_by_available_dates = moment(start).isBetween(moment(adffc.start), moment(adffc.end), 'day', '[]') &&
                        moment(end).isBetween(moment(adffc.start), moment(adffc.end), 'day', '[]') 
                }
            })
            new_available_dates = new_available_dates.filter(nad => nad.id_custom == undefined);
            new_available_dates.push({id_custom: "new", title: strings.your_date, start: start, end: addDays(end, 1)});
        }
        new_bookings = new_bookings.filter(nad => nad.id_custom == undefined);
        new_bookings.push({id_custom: "new", title: strings.your_date, start: start, end: addDays(end, 1)});
        const selectedRangeOutOfAvaialableDatesRange = start < today || start > lastAvailableDayToBook || 
            end > lastAvailableDayToBook || end < today || available_dates_filtered_for_calendar.length > 0 && !enabled_by_available_dates;

        const crossBookingDetected = filteredBookingsByPlaceIdAndAvailableToBookRange
            .filter(booking => start >= new Date(new Date(booking.book_from).toDateString()) && 
                end <= new Date(new Date(booking.book_to).toDateString()) ||
                start <= new Date(new Date(booking.book_from).toDateString()) &&
                end >= new Date(new Date(booking.book_to).toDateString())
            );

        if (selectedRangeOutOfAvaialableDatesRange || crossBookingDetected.length > 0 ) {
            this.setState({
                selectionRange: {
                    startDate: null,
                    endDate: null,
                    key: 'select'        
                }
            });
            this.notify(false, strings.cant_choose_this_dates);
        } else {
            this.setState({
                selectionRange: {
                    startDate: start,
                    endDate:   addDays(end, 1),
                    key:       'select'
                },
                available_dates_filtered_for_calendar: new_available_dates,
                filtered_bookings: new_bookings
            })
        } 
    };

    handleSlotSelection2 = ({start, end, action}) => {
        const { available_dates_filtered_for_calendar, excluded_range } = this.state;
        const today = new Date(new Date().toDateString());
        let new_available_dates = available_dates_filtered_for_calendar;
        const selectedRangeOutOfAvaialableDatesRange = start < today || end < today;

        // const crossBookingDetected = available_dates_filtered
        //     .filter(date_ => start >= new Date(new Date(date_.date_start).toDateString()) && 
        //         end <= new Date(new Date(date_.date_end).toDateString()) ||
        //         start <= new Date(new Date(date_.date_start).toDateString()) &&
        //         end >= new Date(new Date(date_.date_end).toDateString())
        //     );

        new_available_dates = new_available_dates.filter(nad => nad.id == undefined && 
            (moment(excluded_range.date_start).diff(nad.start, 'days') != 0 && 
             moment(excluded_range.date_end).diff(nad.end, 'days') != 0));
        new_available_dates.push({id: "new", title: strings.your_date, start: start, end: addDays(end, 1)});

        if (selectedRangeOutOfAvaialableDatesRange 
            // || crossBookingDetected.length > 0 
            ) {
            this.setState({
                selectionRange2: {
                    date_start: null,
                    date_end: null,
                    key: 'select'        
                }
            });
            this.notify(false, strings.cant_choose_this_dates);
        } else {
            this.setState({
                selectionRange2: {
                    date_start: start,
                    date_end:   addDays(end, 1),
                    key:       'select'
                },                
                excluded_range: {
                    date_start: this.state.excluded_range.date_start,
                    date_end: this.state.excluded_range.date_end,
                    changed: true,
                    id: this.state.excluded_range.id
                },
                available_dates_filtered_for_calendar: new_available_dates
            })
            return { style: { backgroundColor: 'red' } }
        } 
    };

    eventStyleGetter(event, start, end, isSelected) {
        const { selectionRange } = this.state; 

        var style = {
            backgroundColor: event.id_custom !== undefined ? '#5aa0a0' : '#4b4b4b',
            borderRadius: '5px',
            // opacity: 0.5,
            color: 'black',
            border: '0px',
            display: 'block',
            color: 'white',
            fontWeight: '300' 
        };
        return {
            style: style
        };
    }

    eventStyleGetter2(event, start, end, isSelected) {
        const { selectionRange2, excluded_range } = this.state; 
        const initial_selection = moment(end).diff(moment(selectionRange2.date_end), 'days') == 0 && 
            moment(start).diff(moment(selectionRange2.date_start), 'days') == 0
        const on_going_selection = excluded_range.changed && 
            moment(end).subtract(1, 'days').diff(moment(selectionRange2.date_end), 'days') == 0 && 
            moment(start).diff(moment(selectionRange2.date_start), 'days') == 0 
        var style = {
            backgroundColor: initial_selection || on_going_selection ? '#5aa0a0' : '#4b4b4b',
            borderRadius: '5px',
            // opacity: 0.5,
            color: 'black',
            border: '0px',
            display: 'block',
            color: 'white',
            fontWeight: '300' 
        };
        return {
            style: style
        };
    }
    handleNotActiveChange(selectedList, selectedItem, id) {
        this.setState({ notactive_selected: selectedList });
    }

    deleteNotActiveChange(selectedList, removedItem, id) {
        this.setState({ notactive_selected: selectedList });
    }

    render() {
        let { 
            user, 
            bookings, 
            floor, 
            selections, 
            parking,  
            checked, 
            employee_parking_id, 
            available_dates_for_parking,
        } = this.props;
        const { 
            selectionRange, 
            locale, 
            selected_subtype, 
            desk_fix_type, 
            costcenters_options,
            selected, 
            options, 
            comment,
            costcenter_selected,
            triggerModal, 
            cant_book,
            notactive_selected,
            notactive_options,
            triggerModalDelete,
            selectionRange2,  
            excluded_range,
            available_dates_filtered,
            available_dates_filtered_for_calendar,
            filtered_bookings,
            bookings_preview 
        } = this.state;
        let user_rights = [];
        if (user && user.loggingIn && user.user.rights) {
            user_rights = user.user.rights;
        }
        let parsed_params = queryString.parse(this.props.location.search);
        let disabledDates = [];
        // let filtered_bookings = [];
        // let bookings_preview = [];
        // if (!floor.is_Fetching && !bookings.isFetching_for_place && bookings.items_for_place && bookings.items_for_place.length > 0 && floor.selected_item.status === oi_statuses.SHARING) {

        //     filtered_bookings = bookings.items_for_place.map(item => {
        //         if (parseInt(item.object_item.id) === parseInt(floor.selected_item.id)) {
        //             item.title = item.employee_label;
        //             item.start = moment(item.book_from).toDate();
        //             item.end = moment(item.book_to).toDate();
        //             return item;
        //         } else {
        //             return null;
        //         }
        //     }).filter(o => o);

        //     bookings_preview = filtered_bookings.map(item => {
        //         if (moment(item.book_from).diff(today, 'days') >= 0 || moment(item.book_to).diff(today, 'days') >= 0) {
        //             return item;
        //         } else {
        //             return null;
        //         }
        //     }).filter(o => o);

        //     bookings_preview = bookings_preview.length === 0 ? [{ book_from: null, boot_to: null, employee_label: "-"}] : bookings_preview;

        //     if (!!selectionRange.startDate && !!selectionRange.endDate) {
        //         filtered_bookings.push({
        //             title: strings.youbooking,
        //             start: selectionRange.startDate,
        //             end: selectionRange.endDate
        //         })
        //     }

        // }
        let place_not_ready = true;
        if (selected_subtype === 1 && !floor.is_Fetching && floor.selected_item.status === oi_statuses.SHARING && 
            !!!parsed_params.book_from && !!!parsed_params.book_to) {
            floor.attributes.map(a => {
                if (a.metable_id == floor.selected_item.id && a.meta_field_id == settings.DS_READY_ID && a.value == "on") {
                    place_not_ready = false;
                }
            })    
        }
        
        const DateCell = Radium((props) => {
            let enabled_by_available_dates = false
            if (available_dates_filtered.length > 0) {
                available_dates_filtered.map(adf => {
                    if (!enabled_by_available_dates) {
                        enabled_by_available_dates = moment(props.value).isBetween(adf.date_start, moment(adf.date_end), 'day', '[]')
                    }
                })
            }
            return React.cloneElement(Children.only(props.children), {
                style: {
                    ...props.children.style,
                    backgroundColor: moment(props.value).diff(moment(), 'days') < 0 || 
                        moment(moment().add(
                            user_rights.length > 0 && rbac.isSatisfied([rights.BOOK_WITN_NO_DATE_LIMITS], user_rights) 
                            ? 1999 
                            : MAX_AVAILABLE_DAYS_TO_BOOK - 1, 'd'
                        )).diff(props.value, 'days') < 0 
                            ? '#EDEDED' 
                            : available_dates_filtered.length > 0
                                ? enabled_by_available_dates
                                    ? 'white'
                                    : '#EDEDED'
                                : 'white',
                    ':hover': {
                        backgroundColor: moment(props.value).diff(moment(), 'days') < 0 || 
                            moment(moment().add(
                                user_rights.length > 0 && rbac.isSatisfied([rights.BOOK_WITN_NO_DATE_LIMITS], user_rights) 
                                    ? 1999 
                                    : MAX_AVAILABLE_DAYS_TO_BOOK - 1, 'd'
                            )).diff(props.value, 'days') < 0 
                                ? '#EDEDED' 
                                : '#DCDCDC',
                    }
                },
            });
        });
        
        const DateCell2 = Radium((props) => {
            return React.cloneElement(Children.only(props.children), {
                style: {
                    ...props.children.style,
                    backgroundColor: moment(props.value).diff(moment(), 'days') < 0 || moment(moment().add(1999, 'd')).diff(props.value, 'days') < 0 ? '#EDEDED' : 'white',
                    ':hover': {
                        backgroundColor: moment(props.value).diff(moment(), 'days') < 0 || moment(moment().add(1999, 'd')).diff(props.value, 'days') < 0 ? '#EDEDED' : '#DCDCDC',
                    }
                },
            });
        });

          return (
            <>
             <Form> 
                { selected_subtype === 1 && !floor.is_Fetching && floor.selected_item.status === oi_statuses.SHARING && parking &&
                    user.user && user.user.data && (user.user.data.id == employee_parking_id || rbac.isSatisfied([rights.SHARE_DATES_FOR_ALL_PARKING_PLACES], user_rights)) && !available_dates_for_parking.isFetching ? 
                        <div data-tip data-for="book_desk_tooltip">
                            { parking && employee_parking_id && !available_dates_for_parking.isFetching ?
                                <FormGroup booking_sidebar style={{textAlign: "center"}} className="booking_table">
                                    <p className="title_desk_type3">{strings.opened_sharing_dates}</p>
                                    {!available_dates_for_parking.isFetching ? 
                                        <BootstrapTable
                                            keyField='id'
                                            data={ available_dates_filtered }
                                            columns={[
                                                {
                                                    dataField: '_',
                                                    text: strings.datebooking,
                                                    headerStyle: { fontSize: 'small' },
                                                    formatter: (cell, row, rowIndex, extraData) => {
                                                        return <p style={{fontSize: 'small'}}>{`${row.date_start ? moment(row.date_start).format('DD.MM') : ""}-${row.date_end ? moment(row.date_end).format('DD.MM') : ""}`}</p>;
                                                    }
                                                }, {
                                                    dataField: '__',
                                                    text: strings.actions,
                                                    headerStyle: { fontSize: 'small' },
                                                    formatter: (cell, row, rowIndex, extraData) => {
                                                        return <>
                                                                <>
                                                                    <img 
                                                                        onClick={() => { 
                                                                            this.setState({ 
                                                                                triggerModal: true,  
                                                                                selectionRange2: {
                                                                                    date_start: row.date_start,
                                                                                    date_end:   addDays(new Date(row.date_end), 1).toDateString(),
                                                                                    key:       'select'
                                                                                },
                                                                                excluded_range: {
                                                                                    date_start: row.date_start,
                                                                                    date_end: row.date_end,
                                                                                    changed: false,
                                                                                    id: row.id
                                                                                }
                                                                            })
                                                                        }} 
                                                                        src={`/img/pics/edit_sidebar.svg`} 
                                                                        className="buttons_m"
                                                                    ></img>
                                                                </>
                                                                <> 
                                                                    <img 
                                                                        onClick={() => {this.props.removeAvailableDates(row.id); }} 
                                                                        src={`/img/pics/remove_sidebar.svg`}
                                                                        className="buttons_m remove_sidebar"
                                                                    ></img>                                 
                                                                </>
                                                            </>;
                                                    }
                                                }
                                            ] }
                                        />
                                    : available_dates_for_parking.isFetching ? <Loading/> : <></> }   
                                    { !available_dates_for_parking.isFetching ?
                                        <ModalWindow 
                                            modalIsOpen={triggerModal}
                                            className={'modal-booking'}
                                            header={
                                                <div className="modal-header-1">
                                                    <div className="close-modal" >
                                                        <img className="close-link" src="/img/pics/cross_black.svg" onClick={() => this.setState({ triggerModal: false})}></img>
                                                    </div>
                                                    <h2>{`${strings.apply_dates} ${floor.selected_item.name}`}</h2>
                                                </div>
                                            }
                                            body={
                                                <div className="modal-body-1">
                                                    <p>
                                                        <Calendar
                                                            localizer={localizer}
                                                            events={available_dates_filtered_for_calendar}
                                                            startAccessor="start"
                                                            endAccessor="end"
                                                            selectable={true}
                                                            style={{ height: 400, width: 600 }}
                                                            views={['month']}
                                                            culture={localStorage.getItem("lang").toLowerCase()}
                                                            messages={{ 'today': strings.today, "previous": strings.previous, "next": strings.next }}
                                                            components={{
                                                                dateCellWrapper: DateCell2,
                                                                event: ((props) => {
                                                                    return (
                                                                    <div>
                                                                        {props.title}
                                                                    </div>
                                                                    );
                                                                }),
                                                            }}
                                                            onSelectSlot={ this.handleSlotSelection2 }
                                                            eventPropGetter={ this.eventStyleGetter2 }
                                                        />
                                                    </p>
                                                    <div style={{display: "inline-block", textAlign: "end"}}>
                                                        <Button 
                                                            className="button-magenta button_usual btn_small"   
                                                            onClick={() => { 
                                                                this.setState({ triggerModal: false})
                                                                selectionRange2.date_start = moment(selectionRange2.date_start).toDate().toDateString()
                                                                selectionRange2.date_end = moment(selectionRange2.date_end).subtract(1, 'days').toDate().toDateString()
                                                                if (excluded_range.date_start && excluded_range.date_end) {
                                                                    selectionRange2.object_item_id = floor.selected_item.id
                                                                    selectionRange2.id = excluded_range.id;
                                                                    this.props.updateAvailableDates(selectionRange2);
                                                                } else {
                                                                    this.props.addAvailableDates(selectionRange2, floor.selected_item.id);
                                                                }
                                                            }}
                                                            disabled={ 
                                                                !!!selectionRange2.date_start ||
                                                                !!!selectionRange2.date_end
                                                            }
                                                            style={{width: "263px"}}
                                                        >{strings.allow_booking_date}</Button>
                                                        <Button 
                                                            className="button_usual button_decline btn_small btn_right"   
                                                            onClick={() => { 
                                                                this.setState({ 
                                                                    triggerModal: false, 
                                                                    selectionRange2: {
                                                                        date_start: null,
                                                                        date_end:   null,
                                                                        key:       'select'
                                                                    },
                                                                    excluded_range: {
                                                                        date_start: null,
                                                                        date_end: null,
                                                                        changed: false,
                                                                        id: null
                                                                    },
                                                                    available_dates_filtered_for_calendar: 
                                                                        available_dates_filtered_for_calendar.filter(nad => nad.id == undefined && 
                                                                            (moment(excluded_range.date_start).diff(nad.start, 'days') != 0 && 
                                                                            moment(excluded_range.date_end).diff(nad.end, 'days') != 0))
                                                                })
                                                            }}
                                                        >{strings.cancel}</Button>                                            
                                                    </div>
                                                </div>
                                            }
                                        />
                                        : <></>
                                    }          
                                </FormGroup>
                                : <></>
                            }
                            <Button 
                                className="button-magenta button_usual button_bottom" 
                                onClick={() => { 
                                    this.setState({ 
                                        triggerModal: true,
                                        excluded_range: {
                                            date_start: null,
                                            date_end: null,
                                            changed: false,
                                            id: null
                                        }
                                    })
                                }}
                                disabled={!checked}
                            >
                                {strings.select_dates}
                            </Button>    
                        </div> 
                    : <></>
                }                  
                {selected_subtype === 1 && !floor.is_Fetching && floor.selected_item.status === oi_statuses.SHARING ? 
                        <div>
                            <ModalWindow 
                                modalIsOpen={triggerModal}
                                className={'modal-booking'}
                                header={
                                    <div className="modal-header-1">
                                        <div className="close-modal" >
                                            <img className="close-link" src="/img/pics/cross_black.svg" onClick={() => this.setState({ triggerModal: false})}></img>
                                        </div>
                                        <h2>{`${strings.header} ${floor.selected_item.name}`}</h2>
                                    </div>
                                }
                                body={
                                    <div className="modal-body-1">
                                        <p>
                                            {!bookings.isFetching_for_place && floor.selected_item.status === oi_statuses.SHARING && 
                                                !!!parsed_params.book_from && !!!parsed_params.book_to ? 
                                                <Calendar
                                                    localizer={localizer}
                                                    events={filtered_bookings}
                                                    startAccessor="start"
                                                    endAccessor="end"
                                                    selectable={true}
                                                    style={{ height: 400, width: 600 }}
                                                    views={['month']}
                                                    culture={localStorage.getItem("lang").toLowerCase()}
                                                    messages={{ 'today': strings.today, "previous": strings.previous, "next": strings.next }}
                                                    components={{
                                                        dateCellWrapper: DateCell,
                                                        event: ((props) => {
                                                            return (
                                                            <div>
                                                                {props.title}
                                                            </div>
                                                            );
                                                        }),
                                                    }}
                                                    onSelectSlot={ this.handleSlotSelection }
                                                    eventPropGetter={ this.eventStyleGetter }
                                                />
                                                : bookings.isFetching_for_place && floor.selected_item.status === oi_statuses.SHARING ? <Loading/> : <></> }
                                        </p>
                                        <div style={{display: "inline-block", textAlign: "end"}}>
                                            <Button 
                                                className="button-magenta button_usual btn_small"   
                                                onClick={() => { this.addBooking_(); this.setState({ triggerModal: false})}}
                                                disabled={ 
                                                    !!!selectionRange.startDate ||
                                                    !!!selectionRange.endDate ||
                                                    !bookings.can_book ||
                                                    cant_book
                                                }
                                            >{strings.to_book}</Button>
                                            <Button 
                                                className="button_usual button_decline btn_small btn_right"   
                                                onClick={() => { 
                                                    this.setState({ 
                                                        triggerModal: false, 
                                                        selectionRange: {
                                                            startDate: null,
                                                            endDate:   null,
                                                            key:       'select'
                                                        }
                                                    })
                                                }}
                                            >{strings.cancel}</Button>                                            
                                        </div>
                                    </div>
                                }
                            />
                            {!!!parsed_params.book_from && !!!parsed_params.book_to &&
                             (!parking || parking && user && user.user && user.user.data && user.user.data.id == employee_parking_id)?
                                    <FormGroup booking_sidebar style={{textAlign: "center"}} className="booking_table">
                                            <p className={`title_desk_type ${parking && user && user.user && user.user.data && user.user.data.id == employee_parking_id ? 'title_no_margin_top' : ''}`}>
                                                {strings.timetable}
                                            </p>
                                            {!bookings.isFetching_for_place && floor.selected_item.status === oi_statuses.SHARING && 
                                            !!!parsed_params.book_from && !!!parsed_params.book_to ? 
                                                <BootstrapTable
                                                    keyField='-_-'
                                                    data={ bookings_preview }
                                                    columns={[
                                                        {
                                                            dataField: 'name',
                                                            text: strings.datebooking,
                                                            headerStyle: { fontSize: 'small' },
                                                            formatter: (cell, row, rowIndex, extraData) => {
                                                                return <p style={{fontSize: 'small'}}>{`${row.book_from ? moment(row.book_from).format('DD.MM') : ""}-${row.book_to ? moment(row.book_to).format('DD.MM') : ""}`}</p>;
                                                            }
                                                        }, {
                                                            dataField: 'employee_label',
                                                            text: strings.employee,
                                                            headerStyle: { fontSize: 'small' },
                                                            formatter: (cell, row, rowIndex, extraData) => {
                                                                return row['employee_id'] 
                                                                    ? <Link className="link_with_underline" to={`/profile/${row['employee_id']}`}><span style={{fontSize: 'small'}}>{cell}</span></Link>
                                                                    : <>{cell}</>;
                                                            }
                                                        }
                                                    ] }
                                                />
                                            : bookings.isFetching_for_place && floor.selected_item.status === oi_statuses.SHARING ? <Loading/> : <></> }
                                            {!parking || parking && user.user && user.user.data && user.user.data.id !== employee_parking_id ?
                                                <div data-tip data-for="book_desk_tooltip">
                                                    <Button 
                                                        className="button-magenta button_usual" 
                                                        onClick={() => { this.setState({ triggerModal: true})}}
                                                        disabled={!bookings.can_book}
                                                    >
                                                        {strings.select_date_booking}
                                                    </Button>    
                                                </div> 
                                                : <></>}
                                            { place_not_ready || !bookings.can_book ? 
                                                <ReactTooltip id='book_desk_tooltip' place='top' effect='solid'>
                                                    <span>{
                                                        place_not_ready 
                                                            ? strings.place_not_ready
                                                            : !user.loggingIn 
                                                                ? strings.authorize
                                                                : !bookings.can_book 
                                                                    ? strings.cant_book
                                                                    : user.user.place && user.user.place.office_id == selections.office.id
                                                                        ? strings.cant_book_in_your_office
                                                                        : ''
                                                    }</span>
                                                </ReactTooltip>     
                                            : <></>}                
                                    </FormGroup>   
                                :   <></> 
                            }                     
                        </div>
                    : <></> }      
                { selected_subtype === 1 && !floor.is_Fetching && floor.selected_item.status === oi_statuses.SHARING && parking &&
                  user.user && user.user.data && user.user.data.id !== employee_parking_id  ?
                    <div data-tip data-for="book_desk_tooltip">
                        <p className="title_desk_type">
                            {strings.available_sharing_dates}
                        </p>
                        <div className='available_dates'>
                            {available_dates_filtered_for_calendar.map(adffc => {
                                return <div>
                                    {`${moment(adffc.start).format('DD.MM.YYYY')}-${moment(adffc.end).format('DD.MM.YYYY')}`}
                                </div>
                            })}
                        </div>
                        <Button 
                            className="button-magenta button_usual" 
                            onClick={() => { this.setState({ triggerModal: true})}}
                            disabled={!(bookings.can_book && checked)}
                        >
                            {strings.select_date_booking}
                        </Button>    
                    </div> 
                    : <></>
                }                            
                { selected_subtype === 1 && !floor.is_Fetching && rbac.isSatisfied([rights.UPDATE_OBJECT_ITEM], user_rights) ?
                    <div className="select_desk_type">
                        <div className="title_desk_type_2">
                            <div>{strings.desk_status}</div>
                        </div>
                        <div className="type-selection">
                            <FormGroup check>
                                <Label check onClick={() => this.changeReservationType(oi_statuses.RESERVED)}>
                                    <img src={`/img/pics/radio_${desk_fix_type === oi_statuses.RESERVED}.svg`}></img>
                                    <span>{ strings.reservation }</span>
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check onClick={() => this.changeReservationType(oi_statuses.GUEST)}>
                                    <img src={`/img/pics/radio_${desk_fix_type === oi_statuses.GUEST}.svg`} ></img>
                                    <span>{ strings.guest }</span>
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check onClick={() => this.changeReservationType(oi_statuses.SHARING)}>
                                    <img src={`/img/pics/radio_${desk_fix_type === oi_statuses.SHARING}.svg`} ></img>
                                    <span>{ strings.sharing }</span>
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check onClick={() => this.changeReservationType(oi_statuses.EMPLOYEE)}>
                                    <img src={`/img/pics/radio_${desk_fix_type === oi_statuses.EMPLOYEE}.svg`} ></img>
                                    <span>{ strings.employee }</span>
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check onClick={() => this.changeReservationType(oi_statuses.NOT_ACTIVE)}>
                                    <img src={`/img/pics/radio_${desk_fix_type === oi_statuses.NOT_ACTIVE}.svg`} ></img>
                                    <span>{ strings.not_active }</span>
                                </Label>
                            </FormGroup>
                        </div>
                        <div className="options-wrapper">
                            { !!desk_fix_type && (desk_fix_type !== oi_statuses.EMPLOYEE && desk_fix_type !== oi_statuses.NOT_ACTIVE) ?
                                <FormGroup>
                                    <div className="select_costcenter_signle">
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            defaultValue={costcenter_selected}
                                            value={costcenter_selected}
                                            isClearable
                                            isSearchable
                                            filterOption={createFilter({
                                                ignoreCase: true,
                                                ignoreAccents: true,
                                                trim: true,
                                                matchFrom: 'any',
                                            })}
                                            name="color"
                                            options={costcenters_options}
                                            onChange={(e) => this.onChangedValueHandler(e)}
                                            components={animatedComponents, Placeholder}
                                            placeholder={strings.setcostcenter}
                                            styles={{
                                                placeholder: base => ({
                                                    ...base,
                                                    fontSize: '0.9em',
                                                }),
                                                option: base => ({
                                                    ...base,
                                                    fontSize: '0.8em',
                                                }),
                                                valueContainer: base => ({
                                                    ...base,
                                                    fontSize: '0.8em',
                                                }),
                                            }}

                                        />
                                    </div>
                                </FormGroup>
                                : !!desk_fix_type && desk_fix_type !== oi_statuses.NOT_ACTIVE ?
                                    <FormGroup>
                                        <AsyncTypeahead
                                            {...this.state}
                                            selected={selected}
                                            maxResults={PER_PAGE - 1}
                                            minLength={2}
                                            labelKey={option => `${option.surname} ${option.name} ${option.patronymic} (${option.login})`}
                                            id="fieldName"
                                            options={options}
                                            emptyLabel={ strings.noresults }
                                            promptText={ strings.searching }
                                            searchText={ strings.searching }
                                            paginationText={ strings.dispaddresults }
                                            placeholder={ strings.placeholder_name }
                                            onInputChange={ this._handleInputChange }
                                            onPaginate={ this._handlePagination }
                                            onSearch={ this._handleSearch }
                                            onChange={(selected) => this._handleSelection(selected)}
                                            renderMenuItemChildren={option => {return(
                                                    <div key={option.id}>
                                                        <span>{option.surname} {option.name} {option.patronymic} ({option.login})</span>
                                                    </div>
                                                )}}
                                            useCache={false}
                                        />
                                    </FormGroup>
                                : !!desk_fix_type && desk_fix_type == oi_statuses.NOT_ACTIVE ?
                                    <FormGroup>
                                        <div className="select_custom_">
                                            <Multiselect
                                                options={notactive_options} 
                                                selectedValues={notactive_selected} 
                                                onSelect={(selectedList, selectedItem) => { this.handleNotActiveChange(selectedList, selectedItem, floor.selected_item.id) }} 
                                                onRemove={(selectedList, removedItem) => { this.deleteNotActiveChange(selectedList, removedItem, floor.selected_item.id) }} 
                                                displayValue="name" 
                                                singleSelect={true}
                                                showCheckbox={true}
                                                showArrow={true}
                                                style={{ chips: { fontWeight: "300", fontSize: "14pt", marginTop: "-20px", color: `${notactive_selected.length > 0 ? "#000000" : "#B2B2B2"}` }, option: { fontSize: "16pt" } }}
                                                placeholder={`${notactive_selected.length > 0 ? notactive_selected.name : strings.select_not_active}`}
                                            />
                                        </div>
                                        <ModalWindow 
                                            modalIsOpen={triggerModalDelete}
                                            header={
                                                <div className="modal-header-1">
                                                    <div className="close-modal" >
                                                        <img className="close-link" src="/img/pics/cross_black.svg" onClick={() => this.setState({ triggerModalDelete: false})}></img>
                                                    </div>
                                                    <h2>{strings.header_notactive}?</h2>
                                                </div>
                                            }
                                            body={
                                                <div className="modal-body-1">
                                                    <p>{strings.description_notactive}</p>
                                                    <div className="modal-buttons">
                                                        <Button 
                                                            className="button-magenta button_usual btn_small"
                                                            onClick={() => { this.sidebarDeskSubmitForNotAcive(); this.setState({ triggerModalDelete: false})}}
                                                        >{strings.yes}</Button>
                                                        <Button 
                                                            className="button_usual button_decline btn_small btn_right"
                                                            onClick={() => { this.setState({ triggerModalDelete: false})}}
                                                        >{strings.cancel}</Button>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </FormGroup>
                                : <></> 
                            }
                            <FormGroup>
                                <textarea type="text"
                                    name="comment"
                                    id="fieldComment"
                                    placeholder={ strings.placeholder_comment }
                                    value={ comment }
                                    onChange={ (e) => this.handleCommentChange(e) } />
                            </FormGroup>
                        </div>
                        <FormGroup className="actions-wrapper">
                            <Button className="button-magenta button_usual" onClick={this.sidebarDeskSubmit}
                                disabled={ !((!!costcenter_selected && costcenter_selected.value !== "" && desk_fix_type !== oi_statuses.EMPLOYEE) ||
                                    (!!selected && JSON.stringify(selected) != '[]' && desk_fix_type === oi_statuses.EMPLOYEE) ||
                                    (/**/ desk_fix_type == oi_statuses.NOT_ACTIVE) ) }
                                    >
                                { strings.save }
                            </Button>
                        </FormGroup>
                    </div>
                : <></> }
                { selected_subtype !== 1 && !floor.is_Fetching && rbac.isSatisfied([rights.UPDATE_OBJECT_ITEM], user_rights) ?
                    <div className="select_desk_type">
                        <FormGroup className="actions-wrapper">
                            <Button className="button-magenta button_usual" onClick={this.sidebarDeskSubmit}>
                                { strings.save }
                            </Button>
                        </FormGroup>
                    </div>
                : <></> }
                {!!comment && (!rbac.isSatisfied([rights.UPDATE_OBJECT_ITEM], user_rights) ||
                 (rbac.isSatisfied([rights.UPDATE_OBJECT_ITEM], user_rights) && selected_subtype !== 1)) ?
                    <FormGroup>                            
                        <span style={{whiteSpace: 'pre-line'}}>{`${strings.comment}: ${comment}`}</span>
                    </FormGroup>
                : <></> }
                </Form>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        floor:          state.floor,
        object_types:   state.object_types,
        location_types: state.location_types,
        search:         state.search,
        profile:        state.profile,
        user:           state.user,
        bookings:       state.bookings,
        selections:     state.selections,
        available_dates_for_parking: state.available_dates_for_parking
    };
};

function mapDispatchToProps(dispatch) {
    return {
        selectNewElement:  (object) => dispatch(selectNewElement(object)),
        searchEmployees:   (query, page) => dispatch(searchEmployees(query, page)),
        updateObject:      (object, save) => dispatch(updateObject(object, save)),
        getProfile:        (id) => dispatch(getProfile(id)),
        getFloorDetails:   id => dispatch(getFloorDetails(id)),
        getPageOfBookings: (page, per_page, filters, sortField, sortOrder) => dispatch(getPageOfBookings(page, per_page, filters, sortField, sortOrder)), 
        getPageOfBookingsForPlace: (page, per_page, filters, sortField, sortOrder, user_id, no_current_date) => dispatch(getPageOfBookingsForPlace(page, per_page, filters, sortField, sortOrder, user_id, no_current_date)), 
        addBooking:        (book_from, book_to, employee, switchState, object_item) => dispatch(addBooking(book_from, book_to, employee, switchState, object_item)), 
        updateOneMetaValue: (data) => dispatch(updateOneMetaValue(data)),
        removeAvailableDates: (id) => dispatch(removeAvailableDates(id)),
        addAvailableDates:    (dates, object_item_id) => dispatch(addAvailableDates(dates, object_item_id)),
        updateAvailableDates: (dates) => dispatch(updateAvailableDates(dates)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(SidebarObjectForm);