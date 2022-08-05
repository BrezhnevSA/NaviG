import React, { Component }          from 'react';
import { toast }                     from 'react-toastify';
import { connect }                   from "react-redux";
import { Button }                    from 'reactstrap';
import { Link }                      from 'react-router-dom';
import BootstrapTable                from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory             from 'react-bootstrap-table2-paginator';

import { 
    updateFloor, 
    addFloor, 
    getFloors 
}                         from '../../../actions/FloorsActions';

import LocalizedStrings from 'react-localization';
import { sortCaretStyle, headerStyles } from '../../../constants/Styles';

let strings = new LocalizedStrings({
    en:{
        floors:"Floors",
        edit:"Edit",
        add:"Add",
        floorname:"Floor Name",
        type:"Type",
        action:"Action",
        showing:"Showing",
        from:"from",
        to:"to",
        of:"of",
        results:"Results",
        active: "Active",
        inactive: "Inactive",
        all: "All",
        building_name: 'Building'
    },
    ru: {
        floors:"Этажи",
        edit:"Редактировать",
        add:"Добавить",
        floorname:"Название этажа",
        type:"Тип",
        action:"Действие",
        showing:"Отображено",
        from:"с",
        to:"по",
        of:"из",
        results:"всего",
        active: "Активно",
        inactive: "Неактивно",
        all: "Все",
        building_name: 'Корпус'
    },
    de: {
        floors:"Fußböden",
        edit:"Bearbeiten",
        add:"Hinzufügen",
        floorname:"Etage Name",
        type:"Typ",
        action:"Aktion",
        showing:"Zeigen",
        from:"von",
        to:"zu",
        of:"von",
        results:"Ergebnisse",
        active: "Aktiv",
        inactive: "Inaktiv",
        all: "Alles",
        building_name: 'Gebäude'
    }
});


class Floors extends Component {

    constructor(props) {
        super(props)

        this.state = {
            floors: this.props.floors,
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        if (!!!this.props.floors)  {
            this.props.getFloors();
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
        const { floors } = this.props;

        const columns = [{
            dataField: 'name',
            text: strings.floorname,
            filter: textFilter(),
            sort: true,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles
        }, {
            dataField: 'building_name',
            text: strings.building_name,
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

          if (floors && floors.length > 0 && floors[0].meta_info && floors[0].meta_info.length > 0) {
            floors[0].meta_info.map((el, index) => {
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
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles,
            formatter: (cell, row, rowIndex, extraData) => {
                
                return <Link to={"/floors/" + cell + "/details"}>
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
                text: strings.all, value: floors.length
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
                        <h1 id="page-title">{ strings.floors }</h1>
                    </div>
                    <div className="container neomorph-card mt-2">
                        <div className="default-table-style-container table_custom" >
                            <BootstrapTable
                                keyField='id'
                                data={ floors }
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
                    <Link to="/floors/new">
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
        floors: state.floors,
        user:   state.user
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getFloors:      () => dispatch(getFloors()),
        updateFloor:    floors => dispatch(updateFloor(floors)),
        addFloor:       floors => dispatch(addFloor(floors)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Floors);