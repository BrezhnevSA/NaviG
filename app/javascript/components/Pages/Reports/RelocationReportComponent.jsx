import React, { Component, forwardRef } from 'react';
import { connect }          from "react-redux";
import { 
    Row,
    Col, 
    Button, 
    Container
}                           from 'reactstrap';
import DatePicker, { registerLocale } from "react-datepicker";
import en from "date-fns/locale/en-GB";
import ru from "date-fns/locale/ru";
import de from "date-fns/locale/de";
import { Link }             from 'react-router-dom';

import BootstrapTable                from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory             from 'react-bootstrap-table2-paginator';

import { 
    downloadRelocationReport,
    getRelocationReport
} from '../../../actions/ReportsActions';

import Loading from '../Loading/LoadingComponent';

import LocalizedStrings from 'react-localization';
import { sortCaretStyle, headerStyles } from '../../../constants/Styles';

registerLocale("en", en);
registerLocale("de", de);
registerLocale("ru", ru);

const ExampleCustomInput = forwardRef(
    ({ value, onClick }, ref) => (
      <button className="custom-input-datepicker-l" onClick={onClick} ref={ref}>
        {value}
      </button>
    ),
);

let strings = new LocalizedStrings({
    en:{
        moving_reports:  "Reports of relocation",
        download:        "Download",
        update:          "Show",
        showing:         "Showing",
        from:            "from",
        to:              "to",
        of:              "of",
        results:         "Results",
        id:              "Employee number",
        fio:             "Name Surname",
        email:           "E-mail",
        before_moving:   "Before moving",
        after_moving:    "After moving",
        date:            "Date of moving",
        nodata:          "No data",
        all:             "All",
    },
    ru: {
        moving_reports:  "Отчеты по переездам",
        download:        "Скачать",
        update:          "Показать",
        showing:         "Отображено",
        from:            "с",
        to:              "по",
        of:              "из",
        results:         "всего",
        id:              "Табельный номер",
        fio:             "ФИО",
        email:           "Почта",
        before_moving:   "До переезда",
        after_moving:    "После переезда",
        date:            "Дата переезда",
        nodata:          "Нет данных",
        all:             "Все",
    },
    de: {
        moving_reports:  "Umzugsberichte",
        download:        "Herunterladen",
        update:          "Show",
        showing:         "Zeigen",
        from:            "von",
        to:              "zu",
        of:              "von",
        results:         "Ergebnisse",
        id:              "Personalnummer",
        fio:             "Vollständiger Name",
        email:           "Mail",
        before_moving:   "Vor dem Umzug",
        after_moving:    "Nach dem Umzug",
        date:            "Umzugsdatum",
        nodata:          "Keine Daten",
        all:             "Alles",
    }
});

const mapStateToProps = state => {
    return {
        reports: state.reports
    };
};

function mapDispatchToProps(dispatch) {
    return {
        downloadRelocationReport: (dateStart, dateEnd) => dispatch(downloadRelocationReport(dateStart, dateEnd)),
        getRelocationReport:      (dateStart, dateEnd) => dispatch(getRelocationReport(dateStart, dateEnd)),
    };
}

class RelocationReport extends Component {

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.state = {
            dateStart:    new Date(),
            dateEnd:      new Date(),
            datesChanged: false
        }
        
        this.onDateStartChange = this.onDateStartChange.bind(this);
        this.onDateEndChange   = this.onDateEndChange.bind(this);
        this.downloadReport    = this.downloadReport.bind(this);
        this.update            = this.update.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    onDateStartChange(dateStart) {
        let { dateEnd } = this.state;
        if (dateStart && dateEnd && dateStart.getTime() > dateEnd.getTime()) {
            let buf   = dateEnd;
            dateEnd   = dateStart;
            dateStart = buf;
        }
        this.setState({ 
            dateEnd:      dateEnd,
            dateStart:    dateStart,
            datesChanged: true
        });
    }

    onDateEndChange(dateEnd) {
        let { dateStart } = this.state;
        if (dateStart && dateEnd && dateStart.getTime() > dateEnd.getTime()) {
            let buf   = dateEnd;
            dateEnd   = dateStart;
            dateStart = buf;
        }
        this.setState({ 
            dateEnd:      dateEnd,
            dateStart:    dateStart,
            datesChanged: true
        });
    }

    _convertDateToBdString(date) {
        let bd_string = null;
        if (date !== null) {
            let localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
            bd_string = localISOTime.slice(0,10);
        }
        return bd_string;
    }

    downloadReport() {
        const dateEnd   = this._convertDateToBdString(this.state.dateEnd);
        const dateStart = this._convertDateToBdString(this.state.dateStart);
        if ( dateEnd && dateStart ) {
            downloadRelocationReport(dateStart, dateEnd);
        }
    }

    update() {
        const dateEnd   = this._convertDateToBdString(this.state.dateEnd);
        const dateStart = this._convertDateToBdString(this.state.dateStart);
        if ( dateEnd && dateStart ) {
            this.props.getRelocationReport(dateStart, dateEnd);
        }
        this.setState({ datesChanged: false });
    }

    render() {
        const { dateStart, dateEnd, datesChanged } = this.state;
        const { reports }            = this.props; 
        let columns                  = [];
        let customTotal              = null;
        let options                  = null;
        let defaultSorted            = null;

        if (!reports.isFetching && reports.relocation && reports.relocation.length > 0) {
            columns = [{
                dataField: 'id',
                text: strings.id,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'fio',
                text: strings.fio,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'email',
                text: strings.email,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'before_moving',
                text: strings.before_moving,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'after_moving',
                text: strings.after_moving,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'date',
                text: strings.date,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }];

            customTotal = (from, to, size) => (
                <span className="react-bootstrap-table-pagination-total">
                { strings.showing } { strings.from } { from } { strings.to } { to } { strings.of } { size } { strings.results }
                </span>
            );

            options = {
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
                    text: strings.all, value: reports.relocation.length
                }]
            };

            defaultSorted = [{
                dataField: 'id',
                order: 'asc'
            }];
        }
        return (
            <>
                <div className="container-fluid  overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        <h1 id="page-title">{ strings.moving_reports }</h1>
                    </div>
                    <Container className="search_relocations">
                        <Row>
                                {/* <DatePicker
                                    onChange={this.onDateStartChange}
                                    value={dateStart}
                                    locale={localStorage.getItem('lang') === 'RU'
                                        ? 'ru-RU'
                                        : localStorage.getItem('lang') === 'US'
                                            ? 'en-US'
                                            : localStorage.getItem('lang') === 'DE'
                                                ? 'de-DE'
                                                : 'ru-RU'
                                    }
                                /> */}
                                <div className="filter-label-from">{strings.from}</div>
                                <DatePicker
                                    dateFormat="dd.MM.yyyy"
                                    selected={dateStart}
                                    onChange={date => this.onDateStartChange(date)}
                                    selectsStart
                                    startDate={dateStart}
                                    endDate={dateEnd}
                                    locale={localStorage.getItem('lang') === 'RU'
                                        ? 'ru'
                                        : localStorage.getItem('lang') === 'US'
                                            ? 'en'
                                            : localStorage.getItem('lang') === 'DE'
                                                ? 'de'
                                                : 'ru'
                                    }
                                    customInput={<ExampleCustomInput/>}
                                />
                                <div className="filter-label-to">{strings.to}</div>
                                {/* <DatePicker
                                    onChange={this.onDateEndChange}
                                    value={dateEnd}
                                    locale={localStorage.getItem('lang') === 'RU'
                                        ? 'ru-RU'
                                        : localStorage.getItem('lang') === 'US'
                                            ? 'en-US'
                                            : localStorage.getItem('lang') === 'DE'
                                                ? 'de-DE'
                                                : 'ru-RU'
                                    }
                                /> */}
                                <DatePicker
                                    dateFormat="dd.MM.yyyy"
                                    selected={dateEnd}
                                    onChange={date => this.onDateEndChange(date)}
                                    selectsEnd
                                    startDate={dateStart}
                                    endDate={dateEnd}
                                    locale={localStorage.getItem('lang') === 'RU'
                                        ? 'ru'
                                        : localStorage.getItem('lang') === 'US'
                                            ? 'en'
                                            : localStorage.getItem('lang') === 'DE'
                                                ? 'de'
                                                : 'ru'
                                    }
                                    customInput={<ExampleCustomInput/>}
                                />
                                <Button 
                                    className="download_button_report search-button-booking" 
                                    color="primary" 
                                    disabled={!dateStart || !dateEnd}
                                >
                                    {!dateStart || !dateEnd ? (
                                        <span>{strings.download}</span>
                                    ) : (
                                        <Link 
                                            className="download_report_text" 
                                            to='#' 
                                            onClick={this.downloadReport}
                                        >
                                            {strings.download}
                                        </Link>
                                    )}
                                </Button>
                                <Button 
                                    className="download_button_report search-button-booking" 
                                    color="primary" 
                                    disabled={!dateStart || !dateEnd}
                                >
                                    {!dateStart || !dateEnd ? (
                                        <span>{strings.update}</span>
                                    ) : (
                                        <Link 
                                            className="download_report_text" 
                                            to='#' 
                                            onClick={this.update}
                                        >
                                            {strings.update}
                                        </Link>
                                    )}
                                </Button>
                        </Row>
                        <Row>
                            { !reports.isFetching && reports.relocation && reports.relocation.length > 0 ? (
                                <div className="default-table-style-container table_custom">
                                    <BootstrapTable
                                        keyField='id'
                                        data={ reports.relocation }
                                        columns={ columns }
                                        filter={ filterFactory() }
                                        pagination={ paginationFactory(options) }
                                        defaultSorted={ defaultSorted }
                                        rowStyle={ (row, rowIndex) => {
                                            return { backgroundColor: rowIndex % 2 == 0 ? "#ededed" : "white" };
                                        } }
                                    />
                                </div>
                            ) : reports.isFetching && reports.relocation ? (
                                <><Col sm={2}></Col><Col><Loading></Loading></Col></>
                            ) : !reports.isFetching && reports.relocation && reports.relocation.length === 0 && !datesChanged ? (
                                <>{strings.nodata}</>
                            ) : <></>}
                        </Row>
                    </Container>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(RelocationReport);