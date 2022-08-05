import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { connect } from "react-redux";
import { Button } from 'reactstrap';

import { Link } from 'react-router-dom';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { updateObjectType, addObjectType, getObjectTypes } from '../../../actions/ObjectTypesActions';

import LocalizedStrings from 'react-localization';

import * as utils from '../../../utils/functions';
import { sortCaretStyle, headerStyles } from '../../../constants/Styles';

let strings = new LocalizedStrings({
    en:{
        objecttypes:"Object Types",
        edit:"Edit",
        add:"Add",
        objecttypename:"Object Type Name",
        objecttypeicon:"Icon",
        type:"Type",
        action:"Action",
        showing:"Showing",
        from:"from",
        to:"to",
        of:"of",
        results:"Results",
        active: "Active",
        inactive: "Inactive",
        all: "All"
    },
    ru: {
        objecttypes:"Типы Объектов",
        edit:"Редактировать",
        add:"Добавить",
        objecttypename:"Название Типа Объектов",
        objecttypeicon:"Иконка",
        type:"Тип",
        action:"Действие",
        showing:"Отображено",
        from:"с",
        to:"по",
        of:"из",
        results:"всего",
        active: "Активно",
        inactive: "Неактивно",
        all: "Все"
    },
    de: {
        objecttypes:"Objekttypen",
        edit:"Bearbeiten",
        add:"Hinzufügen",
        objecttypename:"Objekttypname",
        objecttypeicon:"Icon",
        type:"Typ",
        action:"Aktion",
        showing:"Zeigen",
        from:"von",
        to:"zu",
        of:"von",
        results:"Ergebnisse",
        active: "Aktiv",
        inactive: "Inaktiv",
        all: "Alles"
    }
});

class ObjectTypes extends Component {

    constructor(props) {
        super(props)

        this.state = {
            object_types: this.props.object_types,
        }
        
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        if (!!this.props.object_types || this.props.object_types.length === 0)  {
            this.props.getObjectTypes();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.object_types !== prevProps.object_types) {
            
            this.setState({
                object_types: this.props.object_types
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
            text: strings.objecttypename,
            filter: textFilter(),
            sort: true,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles
        }, {
            dataField: 'icon',
            text: strings.objecttypeicon,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles,
            formatter: (cell, row, rowIndex) => {
                return <img src={`/img/editor-icons/objects/${cell}?${utils.getRandomInt(500)}`} alt="Object type icon" width="100" />
            }
        },{
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
                
                return <Link to={"/objecttypes/" + cell}>
                    <Button color="primary">
                        { extraData }
                    </Button>
                </Link>;
            },
            formatExtraData: strings.edit
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
                text: strings.all, value: this.state.object_types.length
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
                        <h1 id="page-title">{ strings.objecttypes}</h1>
                    </div>
                    <div className="container neomorph-card mt-2">
                        <div className="default-table-style-container table_custom table_custom_with_tabs" >
                            <BootstrapTable
                                keyField='id'
                                data={ this.state.object_types }
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
                    <Link to="/objecttypes/new">
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
        object_types: state.object_types
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getObjectTypes: () => dispatch(getObjectTypes()),
        updateObjectType: object_type => dispatch(updateObjectType(object_type)),
        addObjectType: object_type => dispatch(addObjectType(object_type)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(ObjectTypes);