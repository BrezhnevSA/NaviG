import React, { Component }          from 'react';
import { toast }                     from 'react-toastify';
import { connect }                   from "react-redux";
import { Button }                    from 'reactstrap';
import { Link }                      from 'react-router-dom';
import BootstrapTable                from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory             from 'react-bootstrap-table2-paginator';

import { 
    updateBuilding, 
    addBuilding, 
    getBuildings 
}                         from '../../../actions/BuildingsActions';

import LocalizedStrings from 'react-localization';
import { headerStyles, sortCaretStyle } from '../../../constants/Styles';

let strings = new LocalizedStrings({
    en:{
        buldings:"Buildings",
        edit:"Edit",
        add:"Add",
        buldingname:"Bulding Name",
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
        buldings:"Корпуса",
        edit:"Редактировать",
        add:"Добавить",
        buldingname:"Название корпуса",
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
        buldings:"Gebäude",
        edit:"Bearbeiten",
        add:"Hinzufügen",
        buldingname:"Bulding Name",
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

class Buildings extends Component {

    constructor(props) {
        super(props)

        this.state = {
            buildings: this.props.buildings,
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        
    }

    componentDidMount() {
        if (!!!this.props.buildings)  {
            this.props.getBuildings();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.buildings !== prevProps.buildings) {
            
            this.setState({
                buildings: this.props.buildings
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
        const { buildings } = this.state;

        const columns = [{
            dataField: 'name',
            text: strings.buldingname,
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

        if (buildings && buildings.length > 0 && buildings[0].meta_info && buildings[0].meta_info.length > 0) {
            buildings[0].meta_info.map((el, index) => {
                if (el.show_in_management) {
                    columns.push({
                        dataField: '',
                        text:      el.metaname,
                        filter:    textFilter(),
                        sort:      true,
                        sortCaret: sortCaretStyle,
                        headerStyle: headerStyles,
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
            formatter: (cell, row, rowIndex, extraData) => {
                
                return <Link to={"/buildings/" + cell}>
                    <Button color="primary">
                        { extraData }
                    </Button>
                </Link>;
            },
            formatExtraData: strings.edit,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles
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
                text: strings.all, value: buildings.length
            }]
        };

        const defaultSorted = [{
            dataField: 'id',
            order: 'asc'
        }];

        return (
            <>
                <div className="container-fluid overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        <h1 id="page-title">{ strings.buldings }</h1>
                    </div>
                    <div className="container neomorph-card mt-2">
                        <div className="default-table-style-container table_custom" >
                            <BootstrapTable
                                keyField='id'
                                data={ buildings }
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
                    <Link to="/buildings/new">
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
        buildings: state.buildings,
        user:      state.user
    };
};

function mapDispatchToProps(dispatch) {
    return {
        updateBuilding: building => dispatch(updateBuilding(building)),
        addBuilding:    building => dispatch(addBuilding(building)),
        getBuildings:   () => dispatch(getBuildings()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Buildings);