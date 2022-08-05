import React, { Component } from 'react';
import { connect }          from "react-redux";
import { Button }           from 'reactstrap';
import { Link }             from 'react-router-dom';

import BootstrapTable                from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory             from 'react-bootstrap-table2-paginator';

import { 
    downloadNonSeatedEmployeesReport,
    getNonSeatedEmployeesReport,
 } from '../../../actions/ReportsActions';

import LocalizedStrings from 'react-localization';

import Loading from '../Loading/LoadingComponent';
import { sortCaretStyle, headerStyles } from '../../../constants/Styles';

let strings = new LocalizedStrings({
    en:{
        non_seated_employees_report: "Report of resevrations with comments",
        download:                    "Download",
        update:                      "Update",
        showing:                     "Showing",
        from:                        "from",
        to:                          "to",
        of:                          "of",
        results:                     "Results",
        city:                        "City",
        office:                      "Office",
        building:                    "Building",
        floor:                       "Floor",
        costcenter_name:             "Costcenter name",
        costcenter:                  "Costcetner",
        addr:                        "Place",
        comment:                     "Comment",
        nodata:                      "No data",
        all:                         "All",
    },
    ru: {
        non_seated_employees_report: "Отчет по резервам с комментариями",
        download:                    "Скачать",
        update:                      "Обновить",
        showing:                     "Отображено",
        from:                        "с",
        to:                          "по",
        of:                          "из",
        results:                     "всего",
        city:                        "Город",
        office:                      "Офис",
        building:                    "Корпус",
        floor:                       "Этаж",
        costcenter_name:             "Номер",
        costcenter:                  "МВЗ",
        addr:                        "Место",
        comment:                     "Комментарий",
        nodata:                      "Нет данных",
        all:                         "Все",
    },
    de: {
        non_seated_employees_report: "Report of resevrations with comments",
        download:                    "Herunterladen",
        update:                      "Aktualisieren",
        showing:                     "Zeigen",
        from:                        "von",
        to:                          "zu",
        of:                          "von",
        results:                     "Ergebnisse",
        city:                        "Stadt",
        office:                      "Büro",
        building:                    "Gebäude",
        floor:                       "Boden",
        costcenter_name:             "Costcenter name",
        costcenter:                  "Costcetner",
        addr:                        "Ort",
        comment:                     "Kommentar",
        nodata:                      "Keine Daten",
        all:                         "Alles",
    }
});

const mapStateToProps = state => {
    return {
        reports: state.reports
    };
};

function mapDispatchToProps(dispatch) {
    return {
        downloadNonSeatedEmployeesReport: () => dispatch(downloadNonSeatedEmployeesReport()),
        getNonSeatedEmployeesReport:      () => dispatch(getNonSeatedEmployeesReport()),
    };
}

class NonSeatedEmployeesReport extends Component {

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.state = {
        }
        
        this.downloadReport = this.downloadReport.bind(this);
        this.update         = this.update.bind(this);
    }

    componentDidMount(){
        this.props.getNonSeatedEmployeesReport();
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    downloadReport() {
        downloadNonSeatedEmployeesReport();
    }

    update(){
        this.props.getNonSeatedEmployeesReport();
    }

    render() {
        const { reports } = this.props; 
        
        if (!reports.isFetching && reports.non_seated_employees && reports.non_seated_employees.length > 0) {
            const columns = [{
                dataField: 'city',
                text: strings.city,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'office',
                text: strings.office,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'building',
                text: strings.building,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'floor',
                text: strings.floor,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            },{
                dataField: 'costcenter_name',
                text: strings.costcenter_name,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'costcenter',
                text: strings.costcenter,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'addr',
                text: strings.addr,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'comment',
                text: strings.comment,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }];

            const customTotal = (from, to, size) => (
                <span className="react-bootstrap-table-pagination-total">
                { strings.showing } { strings.from } { from } { strings.to } { to } { strings.of } { size } { strings.results }
                </span>
            );

            const options = {
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
                    text: strings.all, value: reports.non_seated_employees.length
                }]
            };

            const defaultSorted = [{
                dataField: 'id',
                order: 'asc'
            }];

            return (
                <>
                    <div className="container-fluid  overflow-auto with-actions">
                        <div className="container page-title-wrapper" >
                            <h1 id="page-title">{ strings.non_seated_employees_report }</h1>
                        </div>
                        <div className="container neomorph-card mt-2">
                            <div className="default-table-style-container table_custom table_custom_with_tabs">
                                <BootstrapTable
                                    keyField='id'
                                    data={ reports.non_seated_employees }
                                    columns={ columns }
                                    filter={ filterFactory() }
                                    pagination={ paginationFactory(options) }
                                    defaultSorted={ defaultSorted }
                                    rowStyle={ (row, rowIndex) => {
                                        return { backgroundColor: rowIndex % 2 == 0 ? "#ededed" : "white" };
                                    } }
                                />
                            </div>
                        </div>
                    </div>
                    <div id="bottom-actions-block">
                        <Link className="download_report_text" to='#' onClick={this.downloadReport}>
                            <Button className="download_button_report" color="success">
                                {strings.download}
                            </Button>
                        </Link>  
                        <Link className="download_report_text" to='#' onClick={this.update}>
                            <Button className="download_button_report" color="success">
                                {strings.update}
                            </Button>
                        </Link>   
                    </div>
                </>
            );
        } else if (!reports.isFetching && reports.non_seated_employees && reports.non_seated_employees.length === 0) {
            return(
                <div className="container-fluid  overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        <h1 id="page-title">{ strings.non_seated_employees_report }</h1>
                    </div>
                    {strings.nodata}
                </div>
            );
        } else {
            return(<Loading></Loading>);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(NonSeatedEmployeesReport);