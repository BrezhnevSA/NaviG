import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { connect } from "react-redux";
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { updateOffice, addOffice, getOffices } from '../../../actions/OfficesActions';

import LocalizedStrings from 'react-localization';
import { headerStyles, sortCaretStyle } from '../../../constants/Styles';

let strings = new LocalizedStrings({
    en:{
        offices:"Offices",
        edit:"Edit",
        add:"Add",
        officename:"Office Name",
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
        offices:"Офисы",
        edit:"Редактировать",
        add:"Добавить",
        officename:"Название Офиса",
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
        offices:"Büros",
        edit:"Bearbeiten",
        add:"Hinzufügen",
        officename:"Büroname",
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

class Offices extends Component {

    constructor(props) {
        super(props)

        this.state = {
            offices: this.props.offices,
        }
        
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        if (!!!this.props.offices)  {
            this.props.getOffices();
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
        const { offices } = this.props;

        const columns = [{
            dataField: 'name',
            text: strings.officename,
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
        }];

        if (offices && offices.length > 0 && offices[0].meta_info && offices[0].meta_info.length > 0) {
            offices[0].meta_info.map((el, index) => {
                if (el.show_in_management) {
                    columns.push({
                        dataField: '',
                        text:      el.metaname,
                        filter:    textFilter(),
                        sort:      true,
                        formatter: (cell, row, rowIndex, extraData) => {
                            return row.meta_info[extraData.index].metavalue;
                        },
                        formatExtraData: {
                            index: index
                        }
                    });
                }
            })
        }

        columns.push({
            dataField: 'id',
            text: strings.action,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles,
            formatter: (cell, row, rowIndex, extraData) => {
                
                return <Link to={"/offices/" + cell}>
                    <Button color="primary">
                        { extraData }
                    </Button>
                </Link>;
            },
            formatExtraData: strings.edit
        })

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
                text: strings.all, value: offices.length
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
                        <h1 id="page-title">{ strings.offices }</h1>
                    </div>
                    <div className="container neomorph-card mt-2">
                        <div className="default-table-style-container table_custom" >
                            <BootstrapTable
                                keyField='id'
                                data={ offices }
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
                    <Link to="/offices/new">
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
        offices: state.offices
    };
};

function mapDispatchToProps(dispatch) {
    return {
        updateOffice: offices => dispatch(updateOffice(offices)),
        addOffice: offices => dispatch(addOffice(offices)),
        getOffices: () => dispatch(getOffices()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Offices);