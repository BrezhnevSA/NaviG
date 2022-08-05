import React, { Component, Children, forwardRef } from 'react';
import Radium               from 'radium';
import { toast }            from 'react-toastify';
import { connect }          from "react-redux";
import queryString          from 'query-string';
import DatePicker, { registerLocale } from "react-datepicker";
import en from "date-fns/locale/en-GB";
import ru from "date-fns/locale/ru";
import de from "date-fns/locale/de";
import {     
    Col, 
    Button, 
    Form, 
    FormGroup, 
    Label, 
    Input  
}                           from 'reactstrap';
import { 
    Link,
    Redirect
 }                          from 'react-router-dom';
import { addDays, sub }          from 'date-fns';
import moment               from 'moment';
import { 
    Calendar, 
    momentLocalizer 
}                           from 'react-big-calendar';

import { 
    updateBooking,
    getPageOfBookings
}                                 from '../../../actions/BookingsActions';
import { 
    searchDSPlaces,
    searchDSPlaceById
 }                                from '../../../actions/SearchActions';
import { _convertDateToBdString } from '../../../utils/functions';
import Loading                    from '../Loading/LoadingComponent';

import './BookingEdit.css';

import LocalizedStrings from 'react-localization';

import * as rbac from '../../../rbac/rbac';
import * as rights from '../../../constants/Rights';
import * as appSettings from '../../../constants/AppSettings';

registerLocale("en", en);
registerLocale("de", de);
registerLocale("ru", ru);

const localizer = momentLocalizer(moment);

let strings = new LocalizedStrings({
    en:{
        searchingPlace:   "Place search",
        noresults:        "No results",
        editbooking:      "EDITING A BOOKING",
        bookings:         "Buildings",
        nobookings:       "No current bookings",
        save:             "Save",
        add:              "Add",
        backtolist:       "Back to list",
        datestart:        "Start date",
        dateend:          "End date",
        placename:        "Place",
        changessaved:     "Changes Saved!",
        today:            "Today",
        previous:         "Previous",
        next:             "Next",
        youbooking:       "Current",
        cant_choose_this_dates: "Choosen dates are not available for booking"
    },
    ru: {
        searchingPlace:   "Поиск места",
        noresults:        "Нет результатов",
        editbooking:      "РЕДАКТИРОВАНИЕ БРОНИРОВАНИЯ",
        bookings:         "Бронирования",
        nobookings:       "Бронирования отсутсвуют",
        save:             "Сохранить",
        add:              "Добавить",
        backtolist:       "Назад к списку",
        datestart:        "Дата начала",
        dateend:          "Дата конца",
        placename:        "Место",
        changessaved:     "Изменения сохранены!",
        today:            "Текущий",
        previous:         "Предыдущий",
        next:             "Следующий",
        youbooking:       "Текущее",
        cant_choose_this_dates: "Выбранные даты недоступны для бронирования"
    },
    de: {
        searchingPlace:   "Suche",
        noresults:        "Keine Ergebnisse",
        editbooking:      "BEARBEITEN EINER BUCHUNG",
        bookings:         "Gebäude",
        nobookings:       "Keine Buchungen",
        save:             "Speichern",
        add:              "Hinzufügen",        
        backtolist:       "Zurück zur Liste",
        datestart:        "Startdatum",
        dateend:          "Enddatum",
        placename:        "Ort",
        changessaved:     "Änderungen gespeichert!",
        today:            "Aktuell",
        previous:         "Zurück",
        next:             "Weiter",
        youbooking:       "Strom",
        cant_choose_this_dates: "Ausgewählte Daten sind nicht buchbar"
    }
});

class BookingEdit extends Component {

    constructor(props) {
        super(props)

        this.state = {
            bookings:       this.props.bookings,
            booking_id:     parseInt(this.props.match.params.id),
            booking_data:   {},
            selectionRange: {
                startDate: null,
                endDate:   null,
                key:       'selection'
            },
            firstLoad: true,
            locale:    this.props.lang.toLowerCase() === 'es' 
                ? 'enUS' 
                : this.props.lang.toLowerCase(),
            options:        [],
            datePickerNotClicked: true,
            query:          '',
            selected:       [],
            date:           new Date(),
            redirect:       false,
            end_m_changed:  false,
            range_changed:  false,
            cant_book:      false         
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.handleSelection = this.handleSelection.bind(this);
        this.handleSlotSelection = this.handleSlotSelection.bind(this);
        this.eventStyleGetter = this.eventStyleGetter.bind(this);
        this.onDateStartChange = this.onDateStartChange.bind(this);
        this.onDateEndChange = this.onDateEndChange.bind(this);
    }

    componentDidMount() {
        this.props.getPageOfBookings(0, 0, [], "", "");
        this.setState({ redirect: false });
    }

    componentDidUpdate(prevProps) {
        if (this.props.bookings !== prevProps.bookings) {
            this.setState({
                bookings: this.props.bookings
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const { 
            bookings, 
            booking_id, 
            firstLoad, 
        }                       = this.state;
        const { user }          = nextProps;
        const today             = moment();
        const filtered_bookings = !bookings.isFetching && bookings.items && bookings.items.length > 0
            ? bookings.items.filter(
                e => moment(e.book_from).diff(today, 'days') >= 0 || 
                     moment(e.book_to).diff(today, 'days') >= 0
              )
            : [];
        const cur_booking       = filtered_bookings.find(e => e.id === booking_id);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        if (this.state.tabType !== nextProps.tabType) {
            this.setState({ tabType: nextProps.tabType });
        }

        if (!bookings.isFetching && filtered_bookings.length > 0 && user && user.loggingIn && firstLoad && cur_booking) {
            this.setState({
                selectionRange:  {
                    startDate: new Date(cur_booking.book_from),
                    endDate:   new Date(cur_booking.book_to),
                    key:       'selection'
                },
                firstLoad:       false,
                selected:        [cur_booking.object_item],
                cant_book:       false
            })
            this.props.searchDSPlaces("", -1, cur_booking.employee_id);
        }
    }
    handleSelection(e) {
        const selectedDesk = this.props.search.object_items.find(p => p.id === parseInt(e.target.value));
        searchDSPlaceById(selectedDesk.id);
        let date = null;
        
        this.setState({
            selected:       [selectedDesk],
            selectionRange: {
                startDate: date,
                endDate:   date,
                key:       'select'
            },
            date:           date,
            range_changed: false,
            cant_book: true
        });
    }

    notify = (text, options = {notifyError: false}) => {
        const {notifyError} = options;

        if (notifyError) {
            toast.error(text, {position: toast.POSITION.TOP_RIGHT});
        } else {
            toast.success(text, {position: toast.POSITION.TOP_RIGHT});
        }
    }
    handleSlotSelection = ({start, end, action}) => {
        const { bookings, user } = this.props;
        const { booking_id, selected } = this.state;
        const today = new Date(new Date().toDateString());
        const user_rights = user && user.user && user.user.rights ? user.user.rights : null;
        const currentBooking = bookings.items.find(booking => booking.id === booking_id)
        const lastAvailableDayToBook = addDays(today, 
            user_rights && rbac.isSatisfied([rights.BOOK_WITN_NO_DATE_LIMITS], user_rights) 
            ? 2000 
            : currentBooking.parking == appSettings.META_CHECKBOX_CHECKED
                ? appSettings.MAX_AVAILABLE_DAYS_TO_BOOK_PARKING
                : appSettings.MAX_AVAILABLE_DAYS_TO_BOOK);

        const existingBookings = bookings.items.filter(
            booking => ( booking.object_item.id === selected[0].id &&
                currentBooking.id !== booking.id
            ));
    
        const selectedRangeOutOfAvaialableDatesRange = start < today || start > lastAvailableDayToBook || 
            end > lastAvailableDayToBook || end < today;

        const crossBookingDetected = existingBookings.filter(
            booking => start >= new Date(new Date(booking.book_from).toDateString()) && 
                end <= new Date(new Date(booking.book_to).toDateString()) ||
                start <= new Date(new Date(booking.book_from).toDateString()) &&
                end >= new Date(new Date(booking.book_to).toDateString())
        );

        if (selectedRangeOutOfAvaialableDatesRange || crossBookingDetected.length > 0) {
            this.setState({
                selectionRange: {
                    startDate: null,
                    endDate:   null,
                    key:       'select'
                },
                range_changed: false,
                cant_book: true
            });
            this.notify(strings.cant_choose_this_dates, {notifyError: true});
        } else {
            this.setState({
                selectionRange: {
                    startDate: start,
                    endDate:   addDays(end, 1),
                    key:       'select'
                },
                range_changed: true,
                datePickerNotClicked: false,
                cant_book: false
            });
        }
    };

    eventStyleGetter(event, start, end, isSelected) {
        const { selectionRange } = this.state; 
        var backgroundColor = '#' + event.hexColor;

        var style = {
            backgroundColor: selectionRange.startDate === start && 
                             selectionRange.endDate === end ? '#5aa0a0' : '#4b4b4b',
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

    onDateStartChange(dateStart) {
        let selectionRange = this.state.selectionRange;
        if (dateStart && selectionRange.endDate && dateStart.getTime() > selectionRange.endDate.getTime()) {
            selectionRange.endDate = dateStart;
        }
        selectionRange.startDate = dateStart;
        this.setState({ datePickerNotClicked: false });
        if (this.state.range_changed && this.state.datePickerNotClicked) {
            this.handleSlotSelection({ start: moment(selectionRange.startDate).toDate(), end: moment(selectionRange.endDate).toDate(), action: 'select'});
        } else {
            this.handleSlotSelection({ start: moment(selectionRange.startDate).toDate(), end: moment(selectionRange.endDate).subtract(1, "days").toDate(), action: 'select'});
        }
    }

    onDateEndChange(dateEnd) {
        let selectionRange = this.state.selectionRange;
        if (selectionRange.startDate && dateEnd && selectionRange.startDate.getTime() > dateEnd.getTime()) {
            selectionRange.startDate = dateEnd;
        }
        selectionRange.endDate = dateEnd;
        this.setState({ datePickerNotClicked: false });
       
        if (this.state.range_changed && this.state.datePickerNotClicked) {
            this.handleSlotSelection({ start: moment(selectionRange.startDate).toDate(), end: moment(selectionRange.endDate).toDate(), action: 'select'});
        } else {
            this.handleSlotSelection({ start: moment(selectionRange.startDate).toDate(), end: moment(selectionRange.endDate).subtract(1, "days").toDate(), action: 'select'});
        }
    }

    render() {
        const { 
            bookings, 
            booking_id, 
            selectionRange, 
            firstLoad, 
            locale,
            selected,
            date,
            redirect,
            end_m_changed,
            range_changed,
            cant_book,
            datePickerNotClicked  
        }                       = this.state;
        const { user, search }          = this.props;
        const today             = moment();
        const parsed_params     = queryString.parse(this.props.location.search);
        let object_items_filtered = [];

        if (redirect) { return(<Redirect to={`/bookings?key=${parsed_params.previous_page}`}/>); }

        const filtered_bookings = !bookings.isFetching && bookings.items && bookings.items.length > 0
            ? bookings.items
            : [];
        const cur_booking     = filtered_bookings.find(e => e.id === booking_id);
        let another_bookings  = selected && selected.length > 0 && cur_booking && cur_booking.object_item.id !== selected[0].id
            ? filtered_bookings.filter(e => e.object_item.id === selected[0].id)
            : cur_booking
                ? filtered_bookings.filter(e => e.object_item.id === cur_booking.object_item.id && e.id !== cur_booking.id)
                : [];

        another_bookings = another_bookings.map(item => {
            item.title = item.employee_label;
            item.start = moment(item.book_from).toDate();
            item.end = moment(item.book_to).toDate();
            return item;
        }).filter(o => o);


        if (!!selectionRange.startDate && !!selectionRange.endDate) {
            another_bookings.push({
                title: strings.youbooking,
                start: selectionRange.startDate,
                end: selectionRange.endDate
            })
        }

        if (search && search.object_items && cur_booking) {
            object_items_filtered = search.object_items.filter(oi => 
                cur_booking.parking == appSettings.META_CHECKBOX_CHECKED 
                    ? oi.parking == appSettings.META_CHECKBOX_CHECKED
                    : oi.parking == appSettings.META_CHECKBOX_UNCHECKED || oi.parking == 'null' || !!!oi.parking)
        }

        if (!bookings.isFetching && filtered_bookings.length > 0 && user && user.loggingIn && firstLoad && cur_booking) {
            return(<Loading></Loading>);
        } else if (!bookings.isFetching && filtered_bookings.length > 0 && user && user.loggingIn) {
            // const ExampleCustomInputStart = forwardRef(
            //     ({ value, onClick }, ref) => (
            //         <div>
            //             <button className={`custom-input-datepicker-l ${!!value ? "black_text" : ""} ${ !selectionRange.startDate ? "invalid_date" : " "}`} onClick={onClick} ref={ref}>
            //                 {!!value ? value : strings.date_start}
            //             </button>
            //             <label className={`${ !selectionRange.startDate ? "required_field" : "required_field_hidden"}`}>{strings.rquired_field}</label>
            //         </div>
            //     ),
            // );
            
            // const ExampleCustomInputEnd = forwardRef(
            //     ({ value, onClick }, ref) => (
            //         <div>
            //             <button className={`custom-input-datepicker-l ${!!value ? "black_text" : ""} ${ !end_m_changed ? selectionRange.endDate : moment(selectionRange.endDate).subtract(1, "days").toDate() ? "invalid_date" : " "}`} onClick={onClick} ref={ref}>
            //                 {!!value ? value : strings.date_end}
            //             </button>
            //             <label className={`${ !end_m_changed ? selectionRange.endDate : moment(selectionRange.endDate).subtract(1, "days").toDate() ? "required_field" : "required_field_hidden"}`}>{strings.rquired_field}</label>
            //         </div>
            //     ),
            // );
            const user_rights = user && user.user && user.user.rights ? user.user.rights : null;
            const DateCell = Radium((props) => {
                return React.cloneElement(Children.only(props.children), {
                    style: {
                        ...props.children.style,
                        backgroundColor: moment(props.value).diff(moment(), 'days') < 0 ||
                                         moment(moment().add(user_rights && rbac.isSatisfied([rights.BOOK_WITN_NO_DATE_LIMITS], user_rights) 
                                            ? 1999 
                                            : currentBooking.parking == appSettings.META_CHECKBOX_CHECKED
                                                ? appSettings.MAX_AVAILABLE_DAYS_TO_BOOK_PARKING - 1
                                                : appSettings.MAX_AVAILABLE_DAYS_TO_BOOK - 1, 'd')
                                         ).diff(props.value, 'days') < 0 
                                            ? '#EDEDED' 
                                            : 'white',
                        ':hover': {
                            backgroundColor: moment(props.value).diff(moment(), 'days') < 0 || 
                                             moment(moment().add(user_rights && rbac.isSatisfied([rights.BOOK_WITN_NO_DATE_LIMITS], user_rights) 
                                                ? 1999 
                                                : currentBooking.parking == appSettings.META_CHECKBOX_CHECKED
                                                    ? appSettings.MAX_AVAILABLE_DAYS_TO_BOOK_PARKING - 1
                                                    : appSettings.MAX_AVAILABLE_DAYS_TO_BOOK - 1, 'd')
                                             ).diff(props.value, 'days') < 0 
                                                ? '#EDEDED' 
                                                : '#DCDCDC',
                        }
                    },
                });
            });

            return (
                <>
                    <div className="container-fluid overflow-auto with-actions">
                        <div className="container page-title-wrapper" >
                            <h1 id="page-title-bookings" style={{ marginLeft: '100px' }}>{ strings.editbooking }</h1>
                        </div>
                        <div className="container neomorph-card mt-2">
                            <div className="row neomorph-card-inside" >
                                <Form className="entity-management-form">
                                    <FormGroup row>
                                        <div className="before-calendar-padding"></div>
                                        <Col sm={2}>
                                            <div id="datepicker-booking-edit">
                                                <DatePicker
                                                    dateFormat="dd.MM.yyyy"
                                                    disabled={true}
                                                    selected={selectionRange.startDate}
                                                    onChange={(date) => {this.onDateStartChange(date)}}
                                                    selectsStart
                                                    locale={localStorage.getItem('lang') === 'RU'
                                                        ? 'ru'
                                                        : localStorage.getItem('lang') === 'US'
                                                            ? 'en'
                                                            : localStorage.getItem('lang') === 'DE'
                                                                ? 'de'
                                                                : 'ru'
                                                    }
                                                    // customInput={<ExampleCustomInputStart/>}                                                
                                                    placeholder="Please select a date"
                                                />
                                            </div>
                                        </Col>
                                        <Col sm={2}>
                                            <div id="datepicker-booking-edit">
                                                <DatePicker
                                                    dateFormat="dd.MM.yyyy"
                                                    disabled={true}
                                                    selected={range_changed ? sub(selectionRange.endDate, {days: 1}) : selectionRange.endDate}
                                                    onChange={(date) => {this.onDateEndChange(date)}}
                                                    selectsEnd
                                                    locale={localStorage.getItem('lang') === 'RU'
                                                        ? 'ru'
                                                        : localStorage.getItem('lang') === 'US'
                                                            ? 'en'
                                                            : localStorage.getItem('lang') === 'DE'
                                                                ? 'de'
                                                                : 'ru'
                                                    }
                                                    // customInput={<ExampleCustomInputEnd/>}
                                                    placeholderText={strings.date_end}
                                                />
                                            </div>
                                        </Col>
                                        <Col sm={2}>
                                            <Input
                                                type="select"
                                                name="place_id"
                                                id="place_id"
                                                className="select_element "
                                                value={this.state.selected[0].id}
                                                onChange={this.handleSelection}>
                                                {search && search.object_items ?
                                                    object_items_filtered.map(function(data, index) {
                                                        return data.ready 
                                                            ? <option key={index + 1} value={data.id}>{ data.name }</option>
                                                            : null
                                                    }).filter(o => o)
                                                    : <></>
                                                }
                                            </Input>
                                        </Col>
                                        <Col sm={2}>
                                            <Button 
                                                className="button-magenta button_usual"
                                                style={{height: '40px'}}
                                                disabled={cant_book}
                                                onClick={() => {
                                                    this.props.updateBooking({
                                                        object_item_prev: cur_booking.object_item,
                                                        book_from:        selectionRange.startDate.toDateString(),
                                                        book_to:          !range_changed ? selectionRange.endDate.toDateString() : sub(selectionRange.endDate, {days: 1}).toDateString(),
                                                        id:               cur_booking.id,
                                                        comment:          cur_booking.comment,
                                                        employee:         cur_booking.employee_id,
                                                        object_item_new:  selected[0] ? selected[0] : cur_booking.object_item
                                                    });
                                                    // this.notify();
                                                    localStorage.setItem("show_update_booking_info", strings.changessaved);
                                                    this.setState({ redirect: true });
                                                }}
                                            >
                                                { strings.save }
                                            </Button>
                                        </Col>
                                        <Col sm={2}>
                                            <Button className="button_decline" style={{height: '40px'}}>
                                                <a className="white_link" href={`/bookings?key=${parsed_params.previous_page}`}>
                                                    { strings.backtolist }
                                                </a>
                                            </Button>
                                        </Col>
                                    </FormGroup> 
                                    {selected && selected.length > 0 ? (
                                        <FormGroup row>
                                            <div className="before-calendar-padding"></div>
                                            <Col sm={8}>
                                                <Calendar
                                                    localizer={localizer}
                                                    events={another_bookings}
                                                    startAccessor="start"
                                                    endAccessor="end"
                                                    selectable={true}
                                                    style={{ height: 500, width: 500 }}
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
                                            </Col>
                                        </FormGroup>  
                                    ) : (
                                        <></>
                                    )}
                                </Form>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (!bookings.isFetching && filtered_bookings.length === 0) {
            return(<>{strings.nobookings}</>);
        } else {
            return(<Loading></Loading>);
        }
    }
}

const mapStateToProps = state => {
    return {
        bookings: state.bookings,
        user:     state.user,
        search:   state.search
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getPageOfBookings: (page, per_page, filters, sortField, sortOrder) => dispatch(getPageOfBookings(page, per_page, filters, sortField, sortOrder)), 
        updateBooking:     (booking_data) => dispatch(updateBooking(booking_data)),
        searchDSPlaces:    (query, page, id) => dispatch(searchDSPlaces(query, page, id)),
        searchDSPlaceById: (id) => dispatch(searchDSPlaceById(id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(BookingEdit);