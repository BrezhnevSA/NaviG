import React, { Component }          from 'react';
import { toast }                     from 'react-toastify';
import { connect }                   from "react-redux";
import { Button }                    from 'reactstrap';
import { Link }                      from 'react-router-dom';
import BootstrapTable                from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory             from 'react-bootstrap-table2-paginator';

import { 
    updateCity, 
    addCity, 
    getCities 
}                         from '../../../actions/CitiesActions';

import LocalizedStrings from 'react-localization';
import { sortCaretStyle, headerStyles } from '../../../constants/Styles';

let strings = new LocalizedStrings({
    en:{
        cities:"Cities",
        edit:"Edit",
        add:"Add",
        cityname:"City Name",
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
        cities:"Города",
        edit:"Редактировать",
        add:"Добавить",
        cityname:"Название города",
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
        cities:"Städte",
        edit:"Bearbeiten",
        add:"Hinzufügen",
        cityname:"Stadtname",
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

class Cities extends Component {

    constructor(props) {
        super(props)

        this.state = {
            cities: this.props.cities,
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        
    }

    componentDidMount() {
        if (!!!this.props.cities)  {
            this.props.getCities();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.cities !== prevProps.cities) {
            this.setState({
                cities: this.props.cities
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
        const { cities } = this.state;

        const columns = [{
            dataField: 'name',
            text: strings.cityname,
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

        if (cities && cities.length > 0 && cities[0].meta_info && cities[0].meta_info.length > 0) {
            cities[0].meta_info.map((el, index) => {
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
            formatter: (cell, row, rowIndex, extraData) => {
                
                return <Link to={"/cities/" + cell}>
                    <Button color="primary">
                        { extraData }
                    </Button>
                </Link>;
            },
            formatExtraData: strings.edit,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles
        });
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
                text: strings.all, value: cities.length
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
                        <h1 id="page-title">{ strings.cities }</h1>
                    </div>
                    <div className="container neomorph-card">
                        <div className="default-table-style-container table_custom" >
                            <BootstrapTable
                                keyField='id'
                                data={ cities }
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
                    <Link to="/cities/new">
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
        cities: state.cities,
        user:   state.user
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getCities:      () => dispatch(getCities()),
        updateCity:     city => dispatch(updateCity(city)),
        addCity:        city => dispatch(addCity(city)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Cities);