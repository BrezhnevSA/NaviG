import React, { Component } from 'react';
import { connect }          from "react-redux";
import { 
    Col, 
    Button, 
    Form, 
    FormGroup, 
    Label, 
    Input,
    FormFeedback 
}                           from 'reactstrap';
import { Link }             from 'react-router-dom';
import { toast }            from 'react-toastify';
import { Redirect }         from 'react-router-dom';
import { Token }            from 'react-bootstrap-typeahead';

import { getLocations }                from '../../../actions/LocationsActions';
import { searchLocationsForContracts } from '../../../actions/SearchActions';
import { 
    getContracts, 
    getContract, 
    updateContract,
    addContract,
    deleteContract 
}                                  from '../../../actions/ContractActions';
import { getOffices }              from '../../../actions/OfficesActions';
import { getCities }               from '../../../actions/CitiesActions';
import { getLocationsNotInContract } from '../../../actions/LocationsActions';

import AsyncSearcher  from '../../Elements/AsyncSearcher';
import ModalWindow    from '../ModalWindow/ModalWindowComponent';

import LocalizedStrings from 'react-localization';

import Loading from '../Loading/LoadingComponent';

import * as meta from '../../../constants/MetaTypes';
import * as settings from '../../../constants/AppSettings';

import "./ContractsFormStyles.css";

let strings = new LocalizedStrings({
    en:{
        editbuilding:       "EDIT CONTRACT",
        addbuilding:        "ADD CONTRACT",
        searchingLocations: "Locations search",
        contractNumber:     "Contract number",
        search:             "Search",
        noresults:          "No results",
        save:               "Save",
        add:                "Add",
        order:              "Order",
        orderplaceholder:   "Enter number",
        isactive:           "Is Active",
        backtolist:         "Back",
        delete:             "Delete",
        office:             "BC",
        price:              "Price",
        contractName:       "Contract Name",
        changessaved:       "Changes saved!",
        // header:             "Delete contract with name",
        description:        "The object will be deleted permanently.",
        yes:                "Yes",
        no:                 "No",
        required:           "Field is required",
        fieldiscorrect:     "Field is correct",
        city:               "City",
        selectCity:         "Select city",
        selectOffice:       "Select Business Center",
        inputName:          "Enter name",
        inputPrice:         "Enter price",
        sumSquares:         "Sum of squares" ,
        meters:             "m",
        locations_not_in_contract: "Rooms not tied to contracts" ,
        company:            "Company"         
    },
    ru: {
        editbuilding:       "РЕДАКТИРОВАТЬ КОНТРАКТ",
        addbuilding:        "ДОБАВИТЬ КОНТРАКТ",
        searchingLocations: "Поиск помещений",
        contractNumber:     "Номер контракта",
        search:             "Найти",
        noresults:          "Нет результатов",
        save:               "Сохранить",
        add:                "Добавить",
        order:              "Порядок",
        orderplaceholder:   "Введите число",
        isactive:           "Активно",
        backtolist:         "Вернуться назад",
        delete:             "Удалить",
        office:             "БЦ",
        price:              "Цена",
        contractName:       "Имя контракта",
        changessaved:       "Изменения сохранены!",
        // header:             "Удалить контракт с названием",
        description:        "Объект будет удален навсегда.",
        yes:                "Да",
        no:                 "Нет",
        required:           "Поле, обязательное для заполнения",
        fieldiscorrect:     "Поле заполнено корректно",
        city:               "Город",
        selectCity:         "Выберите город",
        selectOffice:       "Выберите бизнес-центр",
        inputName:          "Введите имя",
        inputPrice:         "Введите цену",
        sumSquares:         "Сумма площадей",
        meters:             "м",
        locations_not_in_contract: "Помещения, не привязанные к контрактам",
        company:            "Компания"   
    },
    de: {
        editbuilding:       "VERTRAG BEARBEITEN",
        addbuilding:        "VERTRAG HINZUFÜGEN",
        searchingLocations: "Suche nach Räumlichkeiten",
        contractNumber:     "Vertragsnummer",
        search:             "Finden",
        noresults:          "Keine Ergebnisse",
        save:               "Speichern",
        add:                "Erstellen",
        order:              "Bestellung",
        orderplaceholder:   "Nummer eingeben",
        isactive:           "Ist aktiv",
        backtolist:         "Zurück",
        delete:             "Löschen",
        office:             "BZ",
        price:              "Preis",
        contractName:       "Vertragsname",
        changessaved:       "Änderungen gespeichert!",
        // header:             "Vertrag mit Namen löschen",
        description:        "Der Vertrag wird dauerhaft gelöscht.",
        yes:                "Ja",
        no:                 "Nein",
        required:           "Feld ist erforderlich",
        fieldiscorrect:     "Das Feld ist korrekt ausgefüllt",
        city:               "Stadt",
        selectCity:         "Stadt auswählen",
        selectOffice:       "Business Center auswählen",
        inputName:          "Namen eingeben",
        inputPrice:         "Preis eingeben",
        sumSquares:         "Summe der Flächen" ,
        meters:             "m",
        location_not_in_contract: "Räume nicht an Verträge gebunden",
        company:            "Gesellschaft"        
    }
});

class ContractsForm extends Component {

    notify = () => {
        toast.success(strings.changessaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        let current_contract = {
            contract: {
                price: null,
                office_id: null,
                name: null,
                company: null
            },
            locations: []
        }

        this.state = {
            contract:     current_contract,
            redirect:     false,
            contract_num: null,
            firstLoad:    true,
            triggerModal: false,
            saveClicked:  false,
            city_selected: null,
            locations_excluded: []
        }
        
        this.searchLocationsForContracts = this.searchLocationsForContracts.bind(this);
        this.handleSelection         = this.handleSelection.bind(this);
        this.save                    = this.save.bind(this);
        this.handleContractNumchange = this.handleContractNumchange.bind(this);
        this.remove                  = this.remove.bind(this);
        this.handleOfficeChange      = this.handleOfficeChange.bind(this);
        this.handleCityChange        = this.handleCityChange.bind(this);
        this.handlePriceChange       = this.handlePriceChange.bind(this);
        this.handleCompanyChange     = this.handleCompanyChange.bind(this);
        this.handleNameChange        = this.handleNameChange.bind(this);
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        if (!!id && id !== 'new') {
            this.props.getContract(id);
            this.props.getLocationsNotInContract(1, 500, id);
        }
        this.props.getOffices();
        this.props.getCities();
    }

    componentWillReceiveProps(nextProps) {
        const { attributes } = this.props;
        const { firstLoad, contract } = this.state;
        const id = this.props.match.params.id;
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
        if (nextProps.contracts && nextProps.contracts.contract && nextProps.contracts.contract.contract && nextProps.offices && nextProps.offices.length > 0 &&
            !!id && id !== 'new' && firstLoad) {
            const contract_ = nextProps.contracts.contract;
            const office = nextProps.offices.find(o => o.id == contract_.contract.office_id)
            this.setState({
                contract: contract_,
                contract_num: contract_.contract.id,
                firstLoad: false,
                triggerModal: false,
                city_selected: office.city_id
            })
        }
    }

    searchLocationsForContracts(query, page) {
        this.props.searchLocationsForContracts(query, page, this.state.contract.contract.office_id);
    }

    handleSelection(item) {
        const { contract } = this.state;  
        contract.locations = item
        this.setState({
            contract: contract,            
        });
    }

    save() {
        const { contract } = this.state; 
        const id = this.props.match.params.id;
        if (!!!contract.contract.name || !!!contract.contract.office_id || !!!contract.contract.price || !!!contract.contract.company) {
            this.setState({
                saveClicked: true
            });
        } else {    
            if (!!id && id == 'new') {
                this.props.addContract(contract.contract);
                this.setState({
                    redirect: true,
                    saveClicked: true
                });
            }
            else {        
                this.props.updateContract(contract);
            }

            this.notify();

            this.props.history.push("/contracts");
        }
    }

    remove() {
        const { contract_num, contract } = this.state;
        this.props.deleteContract(contract_num, contract.info ? contract.info.map(el => { return el.metavalueid; }) : []);
        this.notify();
        this.props.history.push("/contracts");
    }

    removeLocation(id){ 
        const { contract } = this.state;   
        const selectedLocations = contract.locations.filter((l) => l.id !== id);
        this.setState({
            contract: {
                contract: contract.contract,
                locations: selectedLocations
            }
        }); 
    }

    addLocation(location) {
        let { contract } = this.state;  
        contract.locations.push(location);
        this.setState({
            contract: contract           
        });
    }

    langChange = (countryCode) => {
        this.props.langChange(countryCode);
    };

    handleContractNumchange(e) {
        this.setState({
            contract_num: e.target.value
        });
    }

    handleOfficeChange(e) {
        const { offices } = this.props;
        this.setState({
            contract: {
                contract: {
                    ...this.state.contract.contract,
                    office_id: e.target.value
                },
                locations: []                
            },
            city_selected: !!e.target.value ? offices.find(o => o.id == e.target.value).city_id : ''
        });
    }

    handleCityChange(e) {
        const { offices } = this.props;
        let contract = this.state.contract;
        contract.contract.office_id = offices.filter(o => o.city_id == e.target.value).find(o => o.id == contract.office_id) == undefined
            ? ''
            : contract.contract.office_id;
        contract.locations = [];
        this.setState({
            city_selected: e.target.value,
            contract: contract
        });
    }

    handlePriceChange(e) {
        this.setState({
            contract: {
                contract: {
                    ...this.state.contract.contract,
                    price: e.target.value
                },
                locations: this.state.contract.locations
            }
        });
    }

    handleCompanyChange(e) {
        this.setState({
            contract: {
                contract: {
                    ...this.state.contract.contract,
                    company: e.target.value
                },
                locations: this.state.contract.locations
            }
        });
    }

    handleNameChange(e) {
        this.setState({
            contract: {
                contract: {
                    ...this.state.contract.contract,
                    name: e.target.value
                },
                locations: this.state.contract.locations
            }
        });
    }

    render() {
        const { contract, contract_num, triggerModal, saveClicked, city_selected } = this.state;
        const { search, locations, offices, cities } = this.props;
        const id = this.props.match.params.id;
        let submit_text = strings.save;
        let offices_filtered = [];
        let square_count = 0.0;
        let office_name = "-";
        let locations_suggested = locations && locations.itemsNotInContract && contract && contract.locations
            ? locations.itemsNotInContract.filter(l => contract.locations.find(cl => cl.id == l.id) == undefined)
            : [];
        
        if (!!id && id == 'new') {
            submit_text = strings.add;
        } else {
            if (contract.locations && contract.locations.length > 0) {
                contract.locations.map(c => square_count += c.square)
            } else {
                square_count = 0.0;
            }
        }
        if (offices && cities && offices.length > 0 && cities.length > 0) {
            offices_filtered = !!city_selected
                ? offices.filter(o => o.city_id == parseInt(city_selected))
                : offices;
            let office = offices_filtered.find(of => of.id == contract.contract.office_id);
            office_name = office !== undefined ? office.name : '-';
        }
        if (contract && contract.contract && !locations.isFetching) {
            return (
                <>
                    {this.state.redirect ? (
                        <Redirect to="/contracts" />
                    ) : (
                        <>
                            <div className="container-fluid overflow-auto with-actions">
                                <div className="container page-title-wrapper" >
                                    {!!id && id !== 'new'? (
                                        <h1 id="page-title">{ strings.editbuilding }</h1>
                                    ) : (
                                        <h1 id="page-title">{ strings.addbuilding }</h1>
                                    )}
                                    
                                </div>

                                <div className="container neomorph-card mt-2 edit-page">                                    
                                    <div className="row neomorph-card-inside" >
                                    <Form className="entity-management-form contracts-form-container">
                                        <FormGroup row className="contracts-form-group-container">
                                                <Label>{strings.contractName}</Label>
                                            <Col>
                                                <Input type="text"
                                                    name="name"
                                                    id="fieldName"
                                                    className="contracts-form-input"
                                                    value={contract.contract.name}
                                                    onChange={this.handleNameChange} 
                                                    invalid={!!!contract.contract.name && saveClicked}
                                                    placeholder={strings.inputName}
                                                />
                                                {!!!contract.contract.name && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row className="contracts-form-group-container">
                                            <Label className="contracts-city-label" for="city_id">{strings.city}</Label> 
                                            <Input
                                                    type="select"
                                                    name="city_id"
                                                    id="city_id"
                                                    className={`contracts-form-input ${!!!city_selected ? "empty" : "not_empty"}`}
                                                    value={city_selected}
                                                    onChange={this.handleCityChange}
                                                    invalid={!!!city_selected && saveClicked}
                                                >
                                                    <option value="" key="none">{strings.selectCity}</option>
                                                    {cities.map(function(data, index) {
                                                        return <option key={index + 1} value={data.id}>{ data.name }</option>
                                                    })}
                                                    
                                                </Input>   
                                            <Label className="contracts-bc-city-label" for="office_id">{ strings.office }</Label> 
                                            <Input
                                                type="select"
                                                name="office_id"
                                                id="office_id"
                                                className={`contracts-form-input ${!!!contract.contract.office_id ? "empty" : "not_empty"}`}
                                                value={contract.contract.office_id}
                                                onChange={this.handleOfficeChange}
                                                invalid={!!!contract.contract.office_id && saveClicked}
                                            >
                                                <option value="" key="none">{strings.selectOffice}</option>
                                                {offices_filtered.map(function(data, index) {
                                                    return <option key={index + 1} value={data.id}>{ data.name }</option>
                                                })}
                                                
                                            </Input>   
                                            {!!!contract.contract.office_id && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}                                              
                                        </FormGroup>
                                        <FormGroup row className="contracts-form-group-container">
                                            <Label>{strings.price}</Label>
                                            <Col>
                                                <Input 
                                                    type='number'
                                                    step="0.1"
                                                    min='0'
                                                    name="name"
                                                    id="price"
                                                    className="contracts-form-input"
                                                    value={contract.contract.price}
                                                    onChange={this.handlePriceChange}
                                                    invalid={!!!contract.contract.price && saveClicked}
                                                    placeholder={strings.inputPrice}
                                                />
                                                {!!!contract.contract.price && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>}
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row className="contracts-form-group-container">
                                            <Label>{strings.company}</Label>
                                            <Col>
                                                <Input
                                                    type="select"
                                                    name="company_name"
                                                    id="company_name"
                                                    value={ contract.contract.company }
                                                    invalid={!!!contract.contract.company && saveClicked}
                                                    className={`contracts-form-input ${!!!contract.contract.company ? "empty" : "not_empty"}`}
                                                    onChange={ (e) => { this.handleCompanyChange(e) } } >
                                                        <option key={0} value=""> --- </option>
                                                        { settings.COMPANIES.length > 0 ?
                                                            settings.COMPANIES.map((data, index) => {
                                                                return <option key={index + 1} value={data}>
                                                                    { data }
                                                                </option>
                                                            })
                                                        : <></> }
                                                </Input>
                                                {!!!contract.contract.company && saveClicked ? <FormFeedback invalid tooltip>{strings.required}</FormFeedback> : <></>} 
                                            </Col>
                                        </FormGroup>
                                        {!!id && id !== 'new' ? ( 
                                            <FormGroup row className="contracts-form-group-container" id="src_locations">
                                                <Label className="contracts-city-label">{strings.searchingLocations}</Label>
                                                <AsyncSearcher
                                                    {...this.state}
                                                    objects={search.foundLocationsForContract}
                                                    searchObjects={this.searchLocationsForContracts}
                                                    per_page={5}
                                                    handleSelection={this.handleSelection}  
                                                    selected={contract.locations}
                                                    optionsRender={option => (
                                                        <div key={option.id} tabIndex="0" className="rbt-token rbt-token-removeable">
                                                            {option.preview}
                                                        </div>
                                                    )}
                                                    minLength={1}
                                                    labelKey={option => `${option.name}`}
                                                    textTranslation={{
                                                        searching:        strings.searchingLocations,
                                                        noresults:        strings.noresults,
                                                        placeholder_name: strings.placename
                                                    }}
                                                    multiple={true}
                                                    renderToken={(option, props, idx) => {
                                                        return (
                                                        <div {...props}></div>
                                                        );
                                                    }}
                                                /> 
                                                <Label className="contracts-bc-city-label">{strings.sumSquares}: {square_count}{strings.meters}&#178;
                                                </Label>
                                            </FormGroup>
                                        ) : (<></>)}
                                        {!!id && id !== 'new' && contract && contract.locations && contract.locations.map((cl, index) => index % 5 == 0 ? index : null)
                                            .filter(o => o || o == 0).map((offset) => {
                                            return (
                                                <FormGroup row className="fr-not-in-contract-locations">
                                                    {contract.locations.map((l, index) => {
                                                        if (index >= offset && index < offset + 5) {
                                                        return <div className="inlive-div location-chip">
                                                                    {l.preview}
                                                                    <img className="plus45" src="/img/pics/plus45.svg" onClick={() => {this.removeLocation(l.id);}} ></img>
                                                                </div>
                                                        } else {
                                                            return null;
                                                        }
                                                    }).filter(o => o)}
                                                </FormGroup>
                                            )
                                        })}      
                                        <FormGroup row className="contracts-form-group-container contracts-buttons-container">
                                            <Button className="button_back btn_150">
                                                <a href="/contracts" className="booking_link_text">
                                                    { strings.backtolist }
                                                </a>
                                            </Button>
                                            <Button className="button-magenta booking-button btn_150 button-save-contract" onClick={this.save}>
                                                {submit_text}
                                            </Button>
                                        </FormGroup>
                                        {!!id && id !== 'new' ?
                                            <Label className="label-not-in-contract-locations label-suggeted-locations">{strings.locations_not_in_contract}({office_name})</Label>
                                            : <></>
                                        }
                                        {!!id && id !== 'new' && [0, 5].map((offset) => {
                                            return (
                                                <FormGroup row className="fr-not-in-contract-locations">
                                                    {locations_suggested.map((l, index) => {
                                                        if (index >= offset && index < offset + 5) {
                                                        return <div className="inlive-div location-chip">
                                                                    {l.preview}
                                                                    <img  className="plus-pink" src="/img/pics/plusPink.svg" onClick={() => {this.addLocation(l);}}></img>
                                                                </div>
                                                        } else {
                                                            return null;
                                                        }
                                                    }).filter(o => o)}
                                                </FormGroup>
                                            )
                                        })}  
                                        <div style={{"marginBottom": "200px"}}></div>                            
                                    </Form>
                                    </div>
                                </div>
                            </div>  

                            {/* <div id="bottom-actions-block">
                                <Link to="/contracts">
                                    { strings.backtolist }
                                </Link>  
                                         
                                <Button color="success" onClick={this.save}>
                                    {submit_text}
                                </Button>
                                {contract && contract.id ? (
                                    <>
                                        <Button color="danger" onClick={() => { this.setState({triggerModal: true})}}>
                                            { strings.delete }
                                        </Button>
                                        <ModalWindow 
                                            modalIsOpen={triggerModal}
                                            header={
                                                <div className="modal-header-1">
                                                    <div className="close-modal" >
                                                        <img className="close-link" src="/img/pics/cross_black.svg" onClick={() => this.setState({ triggerModal: false})}></img>
                                                    </div>
                                                    <h2>{strings.header} {contract.name.length > 20 ? `${contract.name.substring(0, 19)}...` : contract.name}?</h2>
                                                </div>
                                            }
                                            body={
                                                <div className="modal-body-1">
                                                    <p>{strings.description}</p>
                                                    <div className="modal-buttons">
                                                        <Button 
                                                            className="button-magenta button_usual btn_small"
                                                            onClick={() => { this.remove(); this.setState({ triggerModal: false})}}
                                                        >{strings.yes}</Button>
                                                        <Button 
                                                            className="button_usual button_decline btn_small btn_right"
                                                            onClick={() => { this.setState({ triggerModal: false})}}
                                                        >{strings.ynoes}</Button>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}
                                
                            </div> */}
                        </>
                    )}
                </>
            )
        } else {
            return(<Loading/>);
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getLocations:            () => dispatch(getLocations()),
        getContract:             (id) => dispatch(getContract(id)),
        getContracts:            () => dispatch(getContracts()),
        getOffices:              () => dispatch(getOffices()),
        getCities:               () => dispatch(getCities()),
        searchLocationsForContracts: (query, page, contract_id) => dispatch(searchLocationsForContracts(query, page, contract_id)),
        updateContract:          (contract) => dispatch(updateContract(contract)),
        deleteContract:          (contract_id, mv_ids) => dispatch(deleteContract(contract_id, mv_ids)),
        addContract:             (contract) => dispatch(addContract(contract)),
        getLocationsNotInContract: (page, sizePerPage, contract_id, office_id) => dispatch(getLocationsNotInContract(page, sizePerPage, contract_id, office_id))
    };
}

const mapStateToProps = state => {
    
    return {
        locations:  state.locations,
        user:       state.user,
        search:     state.search,
        contracts:  state.contracts,
        offices:    state.offices,
        cities:     state.cities,
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(ContractsForm);