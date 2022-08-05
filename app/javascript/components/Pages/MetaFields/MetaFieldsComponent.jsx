import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { connect } from "react-redux";
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { getMetaFields } from '../../../actions/MetaFieldsActions';
import { getMetaTypes } from '../../../actions/MetaTypesActions';

import LocalizedStrings from 'react-localization';
import { sortCaretStyle, headerStyles } from '../../../constants/Styles';

let strings = new LocalizedStrings({
    en:{
        metafields:"Data Fields",
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
        metafields:"Поля Данных",
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
        metafields:"Datenfelder",
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

class MetaFields extends Component {

    constructor(props) {
        super(props)

        this.state = {
            meta_fields: this.props.meta_fields,
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        if (!!this.props.meta_fields)  {
            this.props.getMetaFields();
        }
        if (!!this.props.meta_types)  {
            this.props.getMetaTypes();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.meta_fields !== prevProps.meta_fields) {
            
            this.setState({
                meta_fields: this.props.meta_fields
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
        const { meta_types, meta_fields } = this.props;
        let meta_fields_filtered = meta_types;

        if (!!meta_fields && !!meta_types) {
            meta_fields_filtered = meta_fields.map(mf => {
                const meta_type = meta_types.find(mt => mt.id === mf.meta_type_id);
                if (meta_type !== undefined) {
                    mf.metaname = meta_type.name;
                } 
                return mf;
            })
        }

        const columns = [{
            dataField: 'name',
            text: strings.metafields,
            filter: textFilter(),
            sort: true,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles
        }, {
            dataField: 'metaname',
            text: strings.type,
            sort: true,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles
        }, {
            dataField: 'active',
            text: strings.active,
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
                
                return <Link to={"/metafields/" + cell} >
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
                text: strings.all, value: this.state.meta_fields.length
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
                                data={ meta_fields_filtered }
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
                    <Link to="/metafields/new">
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
        meta_fields: state.meta_fields,
        meta_types:  state.meta_types
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getMetaFields: () => dispatch(getMetaFields()),
        getMetaTypes:  () => dispatch(getMetaTypes())
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(MetaFields);