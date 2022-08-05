import React, { Component } from 'react';
import { updateProfile } from '../../../actions/ProfileActions';
import { toast } from 'react-toastify';
import { connect } from "react-redux";
import { Button, CustomInput } from 'reactstrap';
import { Link } from 'react-router-dom';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { getMetaMaps, updateMetaField, removeMetaField, addMetaField } from '../../../actions/MetaMapsActions';
import { getLocationTypes } from '../../../actions/LocationTypesActions';
import { getObjectTypes } from '../../../actions/ObjectTypesActions';
import { getMetaFields } from '../../../actions/MetaFieldsActions';

import LocalizedStrings from 'react-localization';
import { sortCaretStyle, headerStyles } from '../../../constants/Styles';

let strings = new LocalizedStrings({
    en:{
        metamaps:"Meta Mapping",
        edit:"Edit",
        add:"Add",
        entity_type: 'Entity Type',
        entity_subtype: 'Entity Subtype',
        meta_field: 'Meta Field',
        type:"Type",
        action:"Action",
        showing:"Showing",
        from: "from",
        to:"to",
        of:"of",
        results:"Results",
        active: "Active",
        inactive: "Inactive",
        all: "All",
        show_in_management: "Show in managment"
    },
    ru: {
        metamaps:"Назначение Полей",
        edit:"Редактировать",
        add:"Добавить",
        entity_type: 'Тип Сущности',
        entity_subtype: 'Подтип Сущности',
        meta_field: 'Поле',
        type:"Тип",
        action:"Действие",
        showing:"Отображено",
        from: "с",
        to:"по",
        of:"из",
        results:"всего",
        active: "Активно",
        inactive: "Неактивно",
        all: "Все",
        show_in_management: "Показывать в управлении"
    },
    de: {
        metamaps:"Meta-Mapping",
        edit:"Bearbeiten",
        add:"Hinzufügen",
        entity_type: 'Entitätstyp',
        entity_subtype: 'Subtyp',
        meta_field: 'Meta-Feld',
        type:"Typ",
        action:"Aktion",
        showing:"Zeigen",
        from: "von",
        to:"zu",
        of:"von",
        results:"Ergebnisse",
        active: "Aktiv",
        inactive: "Inaktiv",
        all: "Alles",
        show_in_management: "Im Management anzeigen"
    }
});

class MetaMaps extends Component {

    constructor(props) {
        super(props)

        this.state = {
            meta_maps: this.props.meta_maps,
            location_types_available: null,
            object_types_available: null,
            meta_fields_available: null
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        if (!!this.props.meta_maps)  {
            this.props.getMetaMaps();
        }

        if (!!this.props.meta_fields)  {
            this.props.getMetaFields();
        }

        if (!!this.props.object_types)  {
            this.props.getObjectTypes();
        }

        if (!!this.props.location_types)  {
            this.props.getLocationTypes();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.meta_maps !== prevProps.meta_maps) {
            
            this.setState({
                meta_maps: this.props.meta_maps
            });
        }
        if (this.props.meta_fields != prevProps.meta_fields) {
            this.setState({
                meta_fields_available: this.props.meta_fields
            });
        }
        if (this.props.location_types != prevProps.location_types) {
            this.setState({
                location_types_available: this.props.location_types
            });
        }
        if (this.props.object_types != prevProps.object_types) {
            this.setState({
                object_types_available: this.props.object_types
            });
        }
    }

    componentWillReceiveProps() {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    notify = () => {
        toast.success("Changes Saved!", {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    render() {

        let columns = []

        if ( !!this.state.location_types_available &&
            !!this.state.object_types_available &&
            !!this.state.meta_fields_available ) {

            columns = [{
                dataField: 'entity_type',
                text: strings.entity_type,
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles
            }, {
                dataField: 'entity_subtype_id',
                text: strings.entity_subtype,
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    let subtype = {name: ''};

                    if (row['entity_type'] === 'Location') {
                        subtype = this.state.location_types_available.find(item => item.id == row['entity_subtype_id'])
                    }
                    if (row['entity_type'] === 'ObjectItem') {
                        subtype = this.state.object_types_available.find(item => item.id == row['entity_subtype_id'])
                    }
                    
                    return !!subtype ? subtype['name'] : '';
                }
            }, {
                dataField: 'meta_field_id',
                text: strings.meta_field,
                sort: true,
                sortCaret: sortCaretStyle,
                headerStyle: headerStyles,
                formatter: (cell, row, rowIndex, extraData) => {
                    const field = this.state.meta_fields_available.find(item => item.id == row['meta_field_id'])
                    if (!!field && !!field['name']) {
                        return field['name'];
                    }
                    else {
                        return '';
                    }
                }
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
                dataField: 'show_in_management',
                text: strings.show_in_management,
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
                    
                    return <Link to={"/metamaps/" + cell}>
                        <Button color="primary">
                            { strings.edit }
                        </Button>
                    </Link>;
                },
                formatExtraData: strings.edit
            }];

        }

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
                text: strings.all, value: this.state.meta_maps.length
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
                        <h1 id="page-title">{ strings.metamaps }</h1>
                    </div>
                    <div className="container neomorph-card mt-2">
                        <div className="default-table-style-container table_custom" >
                            { ( !!this.state.location_types_available &&
                                !!this.state.object_types_available &&
                                !!this.state.meta_fields_available ) ? 

                                        <BootstrapTable
                                            keyField='id'
                                            data={ this.state.meta_maps }
                                            columns={ columns }
                                            filter={ filterFactory() }
                                            pagination={ paginationFactory(options) }
                                            defaultSorted={ defaultSorted } 
                                            rowStyle={ (row, rowIndex) => {
                                                return { backgroundColor: rowIndex % 2 == 0 ? "#ededed" : "white" };
                                            } }
                                        />

                                : <></>
                            }
                            
                        </div>
                    </div>
                </div>
                <div id="bottom-actions-block">
                    <Link to="/metamaps/new">
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
        meta_maps: state.meta_maps,
        meta_fields: state.meta_fields,
        location_types: state.location_types,
        object_types: state.object_types
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getMetaMaps: () => dispatch(getMetaMaps()),
        getObjectTypes: () => dispatch(getObjectTypes()),
        getLocationTypes: () => dispatch(getLocationTypes()),
        getMetaFields: () => dispatch(getMetaFields())
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(MetaMaps);