import React, { Component } from 'react';
import { updateProfile } from '../../../actions/ProfileActions';
import { toast } from 'react-toastify';
import { connect } from "react-redux";
import { Button, CustomInput } from 'reactstrap';
import { Link } from 'react-router-dom';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { getMetaTypes, updateMetaType, removeMetaType, addMetaType } from '../../../actions/MetaTypesActions';

import LocalizedStrings from 'react-localization';
import { headerStyles, sortCaretStyle } from '../../../constants/Styles';

let strings = new LocalizedStrings({
    en:{
        metatypes:"Data Types",
        edit:"Edit",
        add:"Add",
        metatypename:"Data Type Name",
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
        metatypes:"Типы Данных",
        edit:"Редактировать",
        add:"Добавить",
        metatypename:"Название Типа Помещений",
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
        metatypes:"Datentypen",
        edit:"Bearbeiten",
        add:"Hinzufügen",
        metatypename:"Datentypname",
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

class MetaTypes extends Component {

    constructor(props) {
        super(props)

        this.state = {
            meta_types: this.props.meta_types,
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        if (!!this.props.meta_types)  {
            this.props.getMetaTypes();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.meta_types !== prevProps.meta_types) {
            
            this.setState({
                meta_types: this.props.meta_types
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
            text: strings.metatypes,
            filter: textFilter(),
            sort: true,
            headerStyle: headerStyles,
            sortCaret: sortCaretStyle
        }, {
            dataField: 'metatype',
            text: strings.type,
            sort: true,
            headerStyle: headerStyles,
            sortCaret: sortCaretStyle
        }, {
            dataField: 'active',
            text: strings.active,
            headerStyle: headerStyles,
            sortCaret: sortCaretStyle,
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
            headerStyle: headerStyles,
            sortCaret: sortCaretStyle,
            formatter: (cell, row, rowIndex, extraData) => {
                
                return <Link to={"/metatypes/" + cell} >
                    <Button color="primary">
                        { strings.edit }
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
                text: strings.all, value: this.state.meta_types.length
            }]
        };

        const defaultSorted = [{
            dataField: 'id',
            order: 'asc'
        }];

        return (
            <>
                <div className="container-fluid metas-page-wrapper overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        <h1 id="page-title">{ strings.metatypes }</h1>
                    </div>
                    <div className="container neomorph-card mt-2">
                        <div className="default-table-style-container table_custom" >
                            <BootstrapTable
                                keyField='id'
                                data={ this.state.meta_types }
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
                    <Link to="/metatypes/new">
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
        meta_types: state.meta_types
    };
};

function mapDispatchToProps(dispatch) {
    return {
        updateMetaType: meta_types => dispatch(updateMetaType(meta_types)),
        addMetaType: meta_types => dispatch(addMetaType(meta_types)),
        getMetaTypes: () => dispatch(getMetaTypes())
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(MetaTypes);