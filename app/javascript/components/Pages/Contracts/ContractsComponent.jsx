import React, { Component }          from 'react';
import { toast }                     from 'react-toastify';
import { connect }                   from "react-redux";
import { Button }                    from 'reactstrap';
import { Link }                      from 'react-router-dom';
import BootstrapTable                from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory             from 'react-bootstrap-table2-paginator';

import { 
    getAttributes, 
    updateAttributes,  
}                       from '../../../actions/AttributesActions';
import { getLocations } from '../../../actions/LocationsActions';
import { deleteContract, getPageOfContracts } from '../../../actions/ContractActions';
import { getOffices }    from '../../../actions/OfficesActions';

import * as meta from '../../../constants/MetaTypes';

import Loading from '../Loading/LoadingComponent';

import LocalizedStrings from 'react-localization';

import {sortCaretStyle, headerStyles} from '../../../../../app/javascript/constants/Styles';
import ModalWindow from '../../Pages/ModalWindow/ModalWindowComponent';
import { getShorterString } from '../../../utils/functions';
import "./ContractsStyles.css";
import ContractsFilterSidebarComponent from './Components/ContractsFilterSidebar/ContractsFilterSidebarComponent';
import { getCities } from '../../../actions/CitiesActions';

let strings = new LocalizedStrings({
    en:{
        buldings:       "CONTRACTS MANAGEMENT",
        edit:           "Edit",
        add:            "Add",
        contractID:     "Contract number",
        contractName:   "Contract name",
        price:          "Price",        
        office:         "business center",
        locations:      "Locations",
        action:         "Action",
        showing:        "Showing",
        from:           "from",
        to:             "to",
        of:             "of",
        results:        "Results",
        active:         "Active",
        inactive:       "Inactive",
        all:            "All",
        changessaved:   "Changes saved!",
        deleteContract: "Delete contract with name",
        yes:            "Yes",
        no:             "No",
        filter:         "Filter",
        city:           "City"
    },
    ru: {
        buldings:       "УПРАВЛЕНИЕ КОНТРАКТАМИ",
        edit:           "Редактировать",
        add:            "Добавить",
        contractID:     "Номер контракта",
        contractName:   "Название контракта",
        price:          "Цена",
        office:         "Бизнес-центр",
        locations:      "Помещения",
        action:         "Действие",
        showing:        "Отображено",
        from:           "с",
        to:             "по",
        of:             "из",
        results:        "всего",
        active:         "Активно",
        inactive:       "Неактивно",
        all:            "Все",
        changessaved:   "Изменения сохранены!",
        deleteContract: "Удалить контракт с названием",
        yes:            "Да",
        no:             "Нет",
        filter:         "Фильтр",
        city:           "Город"
    },
    de: {
        buldings:       "VERTRAGSMANAGEMENT",
        edit:           "Bearbeiten",
        add:            "Hinzufügen",
        contractID:     "Vertragsnummer",
        contractName:   "Vertragsname",
        price:          "Preis",
        office:         "Geschäftszentrum",
        locations:      "Zimmer",
        action:         "Aktion",
        showing:        "Zeigen",
        from:           "von",
        to:             "zu",
        of:             "von",
        results:        "Ergebnisse",
        active:         "Aktiv",
        inactive:       "Inaktiv",
        all:            "Alles",
        changessaved:   "Änderungen gespeichert!",
        deleteContract: "Vertrag mit Namen löschen",
        yes:            "Ja",
        no:             "Nein",
        filter:         "Filter",
        city:           "Stadt"
    }
});

const DEFAULT_TABLE_PAGE_NUMBER = 1;

class Contracts extends Component {

    constructor(props) {
        super(props)

        this.state = {
            attributes: this.props.attributes,
            triggerModal: false,
            contractIdToRemove: null,
            filterSidebarIsOpen: false,
            page: DEFAULT_TABLE_PAGE_NUMBER,
            sizePerPage: 10,
            sortField: "id",
            sortOrder: "asc",
            totalSize: 0,
            filters: []
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        
    }

    componentDidMount() {
        const {getLocations, getPageOfContracts, getOffices, getAttributes, getCities, contracts} = this.props;
        const {sizePerPage, sortField, sortOrder, filters} = this.state;

        getLocations();
        getPageOfContracts(DEFAULT_TABLE_PAGE_NUMBER, sizePerPage, filters, sortField, sortOrder).then(response => {
            this.setState({
                totalSize: contracts.count,
                sizePerPage: sizePerPage,
                filters: filters
            });
        });
        getOffices();
        getAttributes(meta.META_MAINTYPE_LOCATION, meta.LOCATION_TYPE_ID_FOR_CONTRACTS);
        getCities();
    }

    componentDidUpdate(prevProps) {
        if (this.props.attributes !== prevProps.attributes) {
            
            this.setState({
                attributes: this.props.attributes
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    notify = () => {
        toast.success(strings.changessaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    removeContract = (contractId) =>  {
        const {attributes, deleteContract} = this.props;
        const metas = attributes.find(a => parseInt(a.metavalue) === parseInt(contractId));
        const metaValueIds = metas ?  metas.info.map(el => {return el.metavalueid}) : [];

        deleteContract(contractId, metaValueIds);
        this.notify();
    }

    handleSideBarOpen = () => {
        this.setState({filterSidebarIsOpen: !this.state.filterSidebarIsOpen});
    }

    applyContractsSidebarFilters = (cities, contractNumber, contractName, locations) => {
        const {offices, sizePerPage, sortField, sortOrder, getPageOfContracts} = this.props;
        let selectedOfficesId;
        let selectedLocationsId;

        if (cities) {
            selectedOfficesId = offices.reduce((p, c) => {
                
                if (cities.some(city => city.id === c.city_id)) {
                    p.push(c.id);
                }

                return p;
                
            }, []);
        }

        if (locations) {
            selectedLocationsId = locations.map(location => {
                return location.id
            });
        }

        const filters = [ 
            {
                field: "office_ids",
                value: selectedOfficesId
            },
            {
                field: "id",
                value: [parseInt(contractNumber) || null]
            },
            {
                field: "name",
                value: [contractName]
            },
            {
                field: "locations",
                value: selectedLocationsId
            }
        ];

        getPageOfContracts(DEFAULT_TABLE_PAGE_NUMBER, sizePerPage, filters, sortField, sortOrder).then(response => {
            this.setState({
                totalSize: contracts.count,
                sizePerPage: sizePerPage,
                filters: filters
            });
        })
    }

    handleTableChange = (type, {page, sizePerPage, sortField, sortOrder}) => {
        const {contracts, getPageOfContracts} = this.props;
        const {filters} = this.state;

        let choosenPage = page;

        if (type === 'sort') {
            choosenPage = DEFAULT_TABLE_PAGE_NUMBER;
        }

        getPageOfContracts(choosenPage, sizePerPage, filters, sortField, sortOrder).then(response => {
            this.setState({
                page: choosenPage,
                totalSize: contracts.count,
                filters: filters,
                sizePerPage: sizePerPage,
                sortField: sortField,
                sortOrder: sortOrder
            });
        });
    }

    render() {
        const { attributes, triggerModal, contractIdToRemove, contractNameToRemove, filterSidebarIsOpen } = this.state;
        const { locations, contracts, offices, cities } = this.props;
        let data = [];

        if (contracts && attributes && offices) {
            contracts.items.map(c => {
                let att_found = attributes.find(a => c.id === parseInt(a.metavalue)) 
                const office_info = offices.find(ct => ct.id === c.office_id);
                let city;
                if (office_info) {
                    city = cities.find(city => city.id === office_info.city_id)
                }
                if (att_found !== undefined) {
                    data.push({
                        info:      att_found.info,
                        metavalue: att_found.metavalue,
                        id:        c.id,
                        name:      c.name,
                        price:     c.price,
                        office:  office_info !== undefined
                            ? office_info.name
                            : null,
                        city:       city ? city.name : null
                    })
                } else {
                    data.push({
                        info:      [],
                        metavalue: null,
                        id:        c.id,
                        name:      c.name,
                        price:     c.price,
                        office:  office_info !== undefined
                            ? office_info.name
                            : null,
                        city:       city ? city.name : null
                    })
                } 
            })
        }
        if (data.length === 0 && contracts && contracts.count > 0) {
            data = contracts;
        }
        const columns = [{
            dataField: 'id',
            text: strings.contractID,
            sort: true,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles
        }, {
            dataField: 'name',
            text: strings.contractName,
            sort: true,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles
        }, {
            dataField: 'city',
            text: strings.city,
            sort: true,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles
        }, {
            dataField: 'office',
            text: strings.office,
            sort: true,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles
        }, {
            dataField: 'price',
            text: strings.price,
            sort: true,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles
        }, {
            dataField: '_',
            text: strings.locations,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles,
            formatter: (cell, row, rowIndex, extraData) => {
                return row.info 
                ? extraData.locations.filter(el => row.info.find(r => r.metable_id === el.id) !== undefined)
                    .map((el, index) => { 
                        if (el.name && index <= 5) { 
                            return el.name; 
                        } else if (index <= 5) { 
                            return `${el.floor_name} ${el.item_subtype}`; 
                        }
                    }).filter(o => o).join(', ')
                : '';
            },
            formatExtraData: {
                locations: this.props.locations.items
            }
        }, {
            dataField: '__',
            text: strings.action,
            sortCaret: sortCaretStyle,
            headerStyle: headerStyles,
            formatter: (cell, row, rowIndex, extraData) => {
                
                return <> 
                    <Link to={"/contracts/" + row.id}>
                        <img src={`/img/pics/edit_button.svg`} className="buttons_m"></img>
                    </Link>
                    <img 
                        onClick={() => {this.setState({ 
                            triggerModal: true, 
                            contractIdToRemove: row.id,
                            contractNameToRemove: row.name
                        })}} 
                        src={`/img/pics/delete_button.svg`}
                        className="buttons_m"
                    ></img>   
                </>                              
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
                text: strings.all, value: data.length
            }]
        };

        const defaultSorted = [{
            dataField: 'id',
            order: 'asc'
        }];
        if (!locations.isFetching) {
            return (
                <>
                    <div className="container-fluid overflow-auto with-actions">
                        <div className="container page-title-wrapper" >
                            <span className="contracts-page-title-container">
                                <h1 id="page-title">{ strings.buldings }</h1>
                            </span>
                            <span>
                                <Link to="/contracts/new">
                                    <button className="contracts-add-new-contract-button">
                                        {"+"}
                                    </button>
                                </Link>
                            </span>
                        </div>
                        <div className="container neomorph-card mt-2">
                            <div className="default-table-style-container table_custom" >
                                <BootstrapTable
                                    remote
                                    keyField='id'
                                    data={ data }
                                    columns={ columns }
                                    filter={ filterFactory() }
                                    pagination={ paginationFactory(options) }
                                    defaultSorted={ defaultSorted } 
                                    rowStyle={ (row, rowIndex) => {
                                        return { backgroundColor: rowIndex % 2 == 0 ? "#ededed" : "white" };
                                    } }
                                    onTableChange={this.handleTableChange}
                                />
                                
                            </div>
                        </div>
                    </div>
                    <div className="open_sidebar_button">
                        <button 
                            className="button-magenta button-simple" 
                            onClick={() => { this.setState({filterSidebarIsOpen: true})}}
                        >{strings.filter}</button>
                    </div>
                    <ContractsFilterSidebarComponent 
                        isOpen={filterSidebarIsOpen}
                        handleOpen={this.handleSideBarOpen}
                        applyFilters={this.applyContractsSidebarFilters}
                    />
                    <ModalWindow 
                        modalIsOpen={triggerModal}
                        header={
                            <div className="modal-header-1">
                                <div className="close-modal" >
                                    <img className="close-link" src="/img/pics/cross_black.svg" onClick={() => this.setState({ triggerModal: false})}></img>
                                </div>
                                <h2>{strings.deleteContract} {getShorterString(contractNameToRemove, 20)}?</h2>
                            </div>
                        }
                        body={
                            <div className="modal-body-1">
                                <p>{strings.description}</p>
                                <div className="modal-buttons">
                                    <Button 
                                        className="button-magenta button_usual btn_small"
                                        onClick={() => { this.removeContract(contractIdToRemove); 
                                            this.setState({ triggerModal: false});
                                        }}
                                    >{strings.yes}</Button>
                                    <Button 
                                        className="button_usual button_decline btn_small btn_right"
                                        onClick={() => { this.setState({ triggerModal: false})}}
                                    >{strings.no}</Button>
                                </div>
                            </div>
                        }
                    />
                </>
            );
        } else {
            return(<Loading/>);
        }
    }
}

const mapStateToProps = state => {
    return {
        attributes: state.attributes,
        locations:  state.locations,
        user:       state.user,
        contracts:  state.contracts,
        offices:    state.offices,
        cities:     state.cities
    };
};

function mapDispatchToProps(dispatch) {
    return {
        updateAttributes: (type, id, data) => dispatch(updateAttributes(type, id, data)),
        getLocations:    () => dispatch(getLocations()),
        getAttributes:   (type, id) => dispatch(getAttributes(type, id)),
        getPageOfContracts:    (page, sizePerPage, filters, sortField, sortOrder) => dispatch(getPageOfContracts(page, sizePerPage, filters, sortField, sortOrder)),
        getOffices:      () => dispatch(getOffices()),
        deleteContract:  (contract_id, mv_ids) => dispatch(deleteContract(contract_id, mv_ids)),
        getCities:       () => dispatch(getCities())
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Contracts);