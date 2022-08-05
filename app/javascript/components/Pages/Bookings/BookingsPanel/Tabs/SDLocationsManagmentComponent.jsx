import React, { Component }          from 'react';
import { connect }                   from "react-redux";
import { Button }                    from 'reactstrap';
import { Link }                      from 'react-router-dom';
import BootstrapTable                from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory             from 'react-bootstrap-table2-paginator';

import { getLocationsInfo } from '../../../../../actions/SDLocationsManagmentActions';

import LocalizedStrings from 'react-localization';

import Loading from '../../../Loading/LoadingComponent';
import * as styles from '../../../../../constants/Styles';
import { pageListRenderer } from '../../../../../constants/Styles';

let strings = new LocalizedStrings({
    en:{
        locations:        "Locations",
        address:          "Address",
        number_ds_places: "Number DS places",
        edit:             "Edit",
        action:           "Action",
        showing:          "Showing",
        from:             "from",
        to:               "to",
        of:               "of",
        results:          "Results",
        all:              "All",
        additional_info:  "Add. info",
        costcenter:       "Costcenters",
        sd_location_managment: "SD location management",
    },
    ru: {
        locations:        "Помещения",
        address:          "Адрес",
        number_ds_places: "Кол-во SD мест",
        edit:             "Редактировать",
        action:           "Действие",
        showing:          "Отображено",
        from:             "с",
        to:               "по",
        of:               "из",
        results:          "всего",
        all:              "Все",
        additional_info:  "Доп. информация",
        costcenter:       "МВЗ",
        sd_location_managment: "Управление SD помещениями",
    },
    de: {
        locations:        "Standorte",
        address:          "Adresse",
        number_ds_places: "Anzahl DS-Plätze",
        edit:             "Bearbeiten",
        action:           "Aktion",
        showing:          "Zeigen",
        from:             "von",
        to:               "zu",
        of:               "von",
        results:          "Ergebnisse",
        all:              "Alles",
        additional_info:  "Weitere Informationen",
        costcenter:       "Costcenter",
        sd_location_managment: "SD-Standortverwaltung",
    }
});

class SDLocationsManagment extends Component {

    constructor(props) {
        super(props)

        this.state = {
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        
    }

    componentDidMount() {
        // this.props.getLocationsInfo();
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    render() {
        const { sdLocationsManagment } = this.props;
        
        if (!sdLocationsManagment.isFetching) {
            const locationsInfo = sdLocationsManagment.locationsInfo;
            const columns = [{
                dataField: 'name',
                text:      strings.locations,
                filter:    textFilter(),
                sort:      true,
                headerStyle: styles.headerStyles,
                sortCaret: styles.sortCaretStyle
            }, {
                dataField: '_',
                text:      strings.address,
                sort:      true,
                formatter: (cell, row, rowIndex, extraData) => {                    
                    return <Link to={`/floors/${row.floor_id}?location_id=${row.id}&search=true`} className="place_link">
                                { row.address }
                           </Link>;
                },
                headerStyle: styles.headerStyles,
                sortCaret: styles.sortCaretStyle
            }, {
                dataField: 'number_ds_places',
                text:      strings.number_ds_places,
                sort:      true,
                headerStyle: styles.headerStyles,
                sortCaret: styles.sortCaretStyle
            }, {
                dataField: '___',
                text: strings.action,
                formatter: (cell, row, rowIndex, extraData) => {
                    return <Link to={`/sdlocation_access/${row.id}`}>
                        <img src={`/img/pics/edit_button.svg`} className="buttons_m"></img>
                    </Link>;
                },
                headerStyle: styles.headerStyles,
                sortCaret: styles.sortCaretStyle
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
                    text: strings.all, value: locationsInfo.length 
                }]
            };

            const defaultSorted = [{
                dataField: 'id',
                order: 'asc'
            }];

            return (
                <div id="content" className="container-fluid with_tabs overflow-auto with-actions">
                    {/* <h1 id="page-title-bookings">{ strings.sd_location_managment }</h1> */}
                        <div className="default-table-style-container table_custom table_custom_with_tabs"> 
                            <BootstrapTable
                                keyField='id'
                                data={ locationsInfo }
                                columns={ columns }
                                filter={ filterFactory() }
                                pagination={ paginationFactory(options) }
                                defaultSorted={ defaultSorted }
                                rowStyle={ (row, rowIndex) => {
                                    return { backgroundColor: rowIndex % 2 == 0 ? "#ededed" : "white" };
                                }} 
                            />
                        </div>
                </div>
            );
        } else {
            return (<Loading/>);
        }
    }
}

const mapStateToProps = state => {
    return {
        sdLocationsManagment: state.sdLocationsManagment,
        user:                 state.user,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getLocationsInfo:      () => dispatch(getLocationsInfo()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(SDLocationsManagment);