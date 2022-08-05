import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { connect } from "react-redux";
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { updateLocationType, addLocationType, getLocationTypes } from '../../../actions/LocationTypesActions';

import LocalizedStrings from 'react-localization';
import { headerStyles, sortCaretStyle } from '../../../constants/Styles';

let strings = new LocalizedStrings({
    en:{
        locationtypes:"Location Types",
        edit:"Edit",
        add:"Add",
        locationtypename:"Location Type Name",
        type:"Type",
        action:"Action",
        showing:"Showing",
        from: "from",
        to:"to",
        of:"of",
        results:"Results",
        active: "Active",
        inactive: "Inactive",
        all: "All"
    },
    ru: {
        locationtypes:"Типы Помещений",
        edit:"Редактировать",
        add:"Добавить",
        locationtypename:"Название Типа Помещений",
        type:"Тип",
        action:"Действие",
        showing:"Отображено",
        from: "с",
        to:"по",
        of:"из",
        results:"всего",
        active: "Активно",
        inactive: "Неактивно",
        all: "Все"
    },
    de: {
        locationtypes:"Standorttypen",
        edit:"Bearbeiten",
        add:"Hinzufügen",
        locationtypename:"Standorttypen Name",
        type:"Typ",
        action:"Aktion",
        showing:"Zeigen",
        from: "von",
        to:"zu",
        of:"von",
        results:"Ergebnisse",
        active: "Aktiv",
        inactive: "Inaktiv",
        all: "Alles"
    }
});

class LocationTypes extends Component {

    constructor(props) {
        super(props)

        this.state = {
            location_types: this.props.location_types,
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        this.props.getLocationTypes();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location_types !== prevProps.location_types) {
            
            this.setState({
                location_types: this.props.location_types
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    notify = () => {
        toast.success("Changes Saved!", {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    render() {

        const columns = [{
            dataField: 'name',
            text: strings.locationtypename,
            filter: textFilter(),
            sort: true,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles
        }, {
            dataField: 'active',
            text: strings.type,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles,
            formatter: (cell, row, rowIndex, extraData) => {
                let out = extraData.inactive;
                if (cell === true) {
                    out = extraData.active;
                }
                return out;
            },
            formatExtraData: {
                inactive: strings.inactive,
                active: strings.active
            }
          }, {
            dataField: 'id',
            text: strings.action,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles,
            formatter: (cell, row, rowIndex, extraData) => {
                
                return <Link to={"/locationtypes/" + cell}>
                    <Button color="primary">
                        { strings.edit }
                    </Button>
                </Link>;
            },
            formatExtraData: strings.edit
          }];

        const customTotal = (from, to, size) => (
            <span className="react-bootstrap-table-pagination-total">
              { strings.showing } {strings.from} { from } { strings.to } { to } { strings.of } { size } { strings.results }
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
                text: strings.all, value: this.state.location_types.length
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
                        <h1 id="page-title">{ strings.locationtypes }</h1>
                    </div>
                    <div className="container neomorph-card mt-2">
                        <div className="default-table-style-container table_custom table_custom_with_tabs" >
                            <BootstrapTable
                                keyField='id'
                                data={ this.state.location_types }
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
                    <Link to="/locationtypes/new">
                        <Button color="primary">
                            { strings.add }
                        </Button>
                    </Link>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        location_types: state.location_types
    };
};

function mapDispatchToProps(dispatch) {
    return {
        updateLocationType: location_types => dispatch(updateLocationType(location_types)),
        addLocationType: location_types => dispatch(addLocationType(location_types)),
        getLocationTypes: () => dispatch(getLocationTypes())
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(LocationTypes);