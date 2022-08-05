import React, { Component } from 'react';
import { connect }          from "react-redux";
import { Button }           from 'reactstrap';
import { Link }             from 'react-router-dom';

import BootstrapTable                from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory             from 'react-bootstrap-table2-paginator';

import { 
    downloadMeterageReport,
    getMeterageReport,
 } from '../../../actions/ReportsActions';

import LocalizedStrings from 'react-localization';

import Loading from '../Loading/LoadingComponent';

import {sortCaretStyle, headerStyles} from "../../../constants/Styles";

let strings = new LocalizedStrings({
    en:{
        meterage_report:                "Meterage report",
        download:                       "Download",
        update:                         "Update",
        showing:                        "Showing",
        from:                           "from",
        to:                             "to",
        of:                             "of",
        results:                        "Results",
        city:                           "City",
        office:                         "Office",
        building:                       "Building",
        floor:                          "Floor",
        contract_num:                   "Contract umber",
        location_num:                   "Location number",
        project_location:               "Project location",
        places_on_costcenter:           "Places on costcenter",
        costcenter_name:                "Costcenter name",
        costcenter:                     "Costcetner",
        number_of_meters:               "Number of meters",
        number_of_places:               "Number of places",
        numver_of_meters_on_place:      "Number of meters on place",
        number_of_meters_om_costcenter: "Number of meters on costcenter",
        cost_for_meter:                 "Cost for meter",
        cost_for_costcenter:            "Cost for costcenter",
        nodata:                         "No data",
        all:                            "All",
    },
    ru: {
        meterage_report:                "Отчет по метражам",
        download:                       "Скачать",
        update:                         "Обновить",
        showing:                        "Отображено",
        from:                           "с",
        to:                             "по",
        of:                             "из",
        results:                        "всего",
        city:                           "Город",
        office:                         "Офис",
        building:                       "Корпус",
        floor:                          "Этаж",
        contract_num:                   "Номер контракта",
        location_num:                   "Номер помещения",
        project_location:               "Проект/помещение",
        places_on_costcenter:           "Количество мест на МВЗ",
        costcenter_name:                "Название МВЗ",
        costcenter:                     "Номер МВЗ",
        number_of_meters:               "Количество метров",
        number_of_places:               "Количество мест",
        numver_of_meters_on_place:      "Количество метров на место",
        number_of_meters_om_costcenter: "Количество метров на МВЗ",
        cost_for_meter:                 "Стоимость за метр",
        cost_for_costcenter:            "Стоимость проекта",
        nodata:                         "Нет данных",
        all:                            "Все",
    },
    de: {
        meterage_report:                "Meterage report",
        download:                       "Herunterladen",
        update:                         "Aktualisieren",
        showing:                        "Zeigen",
        from:                           "von",
        to:                             "zu",
        of:                             "von",
        results:                        "Ergebnisse",
        city:                           "Stadt",
        office:                         "Büro",
        building:                       "Gebäude",
        floor:                          "Boden",
        contract_num:                   "Vertragsnummer",
        location_num:                   "Zimmernummer",
        project_location:               "Projekt / Raum",
        places_on_costcenter:           "Anzahl der Plätze auf der Kostenstelle",
        costcenter_name:                "Costcenter name",
        costcenter:                     "Costcetner",
        number_of_meters:               "Anzahl der Meter",
        number_of_places:               "Anzahl der Orte",
        numver_of_meters_on_place:      "Anzahl der Meter pro Ort",
        number_of_meters_om_costcenter: "Anzahl der Zähler pro Kostenstelle",
        cost_for_meter:                 "Kosten pro Meter",
        cost_for_costcenter:            "Projektkosten",
        nodata:                         "Keine Daten",
        all:                            "Alles",
    }
});

const mapStateToProps = state => {
    return {
        reports: state.reports
    };
};

function mapDispatchToProps(dispatch) {
    return {
        downloadMeterageReport: (id) => dispatch(downloadMeterageReport(id)),
        getMeterageReport:      (id) => dispatch(getMeterageReport(id)),
    };
}

class MeterageReport extends Component {

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.state = {
        }
        
        this.downloadReport = this.downloadReport.bind(this);
        this.update         = this.update.bind(this);
    }

    componentDidMount(){
        this.props.getMeterageReport(this.props.match.params.id);
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        if (this.props.match.params.id != nextProps.match.params.id) {
            this.props.getMeterageReport(nextProps.match.params.id);
        }
    }

    downloadReport() {
        downloadMeterageReport(this.props.match.params.id);
    }

    update(){
        this.props.getMeterageReport(this.props.match.params.id);
    }

    render() {
        const { reports } = this.props; 
        
        if (!reports.isFetching && reports.meterage && reports.meterage.length > 0) {
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
            }, {
                dataField: 'contract_num',
                text: strings.contract_num,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'location_num',
                text: strings.location_num,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'project_location',
                text: strings.project_location,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'places_on_costcenter',
                text: strings.places_on_costcenter,
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
            },{
                dataField: 'costcenter_name',
                text: strings.costcenter_name,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'number_of_meters',
                text: strings.number_of_meters,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'number_of_places',
                text: strings.number_of_places,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'numver_of_meters_on_place',
                text: strings.numver_of_meters_on_place,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'number_of_meters_om_costcenter',
                text: strings.number_of_meters_om_costcenter,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'cost_for_meter',
                text: strings.cost_for_meter,
                filter: textFilter(),
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'cost_for_costcenter',
                text: strings.cost_for_costcenter,
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
                    text: strings.all, value: reports.meterage.length
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
                            <h1 id="page-title">{ strings.meterage_report }</h1>
                        </div>
                        <div className="container neomorph-card mt-2">
                            <div className="default-table-style-container table_custom">
                                <BootstrapTable
                                    keyField='id'
                                    data={ reports.meterage }
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
        } else if (!reports.isFetching && reports.meterage && reports.meterage.length === 0) {
            return(
                <div className="container-fluid  overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        <h1 id="page-title">{ strings.meterage_report}</h1>
                    </div>
                    {strings.nodata}
                </div>
            );
        } else {
            return(<Loading></Loading>);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(MeterageReport);