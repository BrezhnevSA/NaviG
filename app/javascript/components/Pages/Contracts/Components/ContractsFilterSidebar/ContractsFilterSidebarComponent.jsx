import React, {useEffect, useState} from 'react';
import LocalizedStrings from 'react-localization';
import { connect } from 'react-redux';
import { getCities } from '../../../../../actions/CitiesActions';
import { getLocations } from '../../../../../actions/LocationsActions';
import { getContracts } from '../../../../../actions/ContractActions';
import Dropdown from '../../../../Elements/Dropdown/DropdownComponent';
import {Multiselect} from "multiselect-react-dropdown";
import "./ContractsFilterSidebarStyles.css";

let strings = new LocalizedStrings({
    en: {
        filter: "Filter",
        city: "City",
        contractNumber: "Contract number",
        contractName: "Contract name",
        contractNumberPlaceholder: "Choose contract number",
        contractNamePlaceholder: "Choose contract name",
        locations: "Locations",
        locationsPlaceholder: "Choose locations",
        show: "Show",
        reset: "Reset",
        selectAll: "Select all",
        selected: "Selected: ",
        noLocation: "N.A."
    },
    ru: {
        filter: "Фильтр",
        city: "Город",
        contractNumber: "Номер контракта",
        contractName: "Имя контракта",
        contractNumberPlaceholder: "Выберите номер контракта",
        contractNamePlaceholder: "Выберите название контракта",
        locations: "Помещения",
        locationsPlaceholder: "Выберите помещения",
        show: "Показать",
        reset: "Сбросить",
        selectAll: "Выбрать все",
        selected: "Выбрано: ",
        noLocation: "Н/Д"
    },
    de: {
        filter: "Filter",
        city: "Stadt",
        contractNumber: "Vertragsnummer",
        contractName: "Vertragsname",
        contractNumberPlaceholder: "Vertragsnummer wählen",
        contractNamePlaceholder: "Vertragsnamen wählen",
        locations: "Standorte",
        locationsPlaceholder: "Standorte auswählen",
        show: "Zeigen",
        reset: "Zurücksetzen",
        selectAll: "Wählen Sie Alle",
        selected: "Ausgewählt: ",
        noLocation: "N/A"
    }
});

const ContractsFilterSidebar = ({isOpen, handleOpen, applyFilters, cities, contracts, locations}) => {

    let lang = localStorage.getItem('lang').toLowerCase();
    strings.setLanguage(localStorage.getItem('lang').toLowerCase());

    const [citiesOptions, setCitiesOptions] = useState([]);
    const [contractsNumbers, setContractsNumbers] = useState([]);
    const [selectedContractNumber, setSelectedContractNumber] = useState("");
    const [contractsNames, setContractsNames] = useState([]);
    const [selectedContractName, setSelectedContractName] = useState("");
    const [locationsOptions, setLocationsOptions] = useState([]);
    const [locationsSelected, setLocationsSelected] = useState([]);

    useEffect(() => {
        init();
    }, []);

    const handleResetButton = () => {
        setSelectedContractNumber("");
        setSelectedContractName("");
        setLocationsSelected([]);
        setCitiesOptions(citiesOptions.map(city => {
            const checked = city.checked;
            
            if (!checked) {
                return Object.assign({}, city, {checked: !checked})
            } else {
                return city;
            }
        }));
    }

    const init = () => {
        //build up data for dropdowns
        let citiesData = cities.map(city => {
            return {
                id: city.id,
                name: city.name,
                checked: true
            }
        });
        setCitiesOptions(citiesData);
         
        if (locations.items && !locations.isFetching) {
            const locationsOptionsData = [{id: -1, name: strings.selectAll}];
            Array.prototype.push.apply(locationsOptionsData, locations.items.map(location => {
                return {
                    id: location.id,
                    name: generateLocationName(location)
                }
            }));
            setLocationsOptions(locationsOptionsData);
        }

        const contractsNamesData = contracts.items.map(contract => {
            return {
                text: contract.name,
                value: contract.name
            }
        });
        const contractsNumbersData = contracts.items.map(contract => {
            return {
                text: contract.id,
                value: contract.id
            }
        });
        setContractsNames(contractsNamesData);
        setContractsNumbers(contractsNumbersData);
        
    };

    const generateLocationName = (location) => {
        if (location.name) {
            return location.name + ` (${location.preview})`;
        } else if (location.preview) {
            let locationTextArray = location.preview.split(",");
            return strings.noLocation + " (" + locationTextArray.slice(1).toString() + ")";
        }
    }
    
    useEffect(() => {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }, [lang]);

    const handleDataChange = (name, value) => {
        switch (name) {
            case "contractNumber": {
                setSelectedContractNumber(value);
                break;
            }
            case "contractName": {
                setSelectedContractName(value);
                break;
            }
        }
    };

    const handleCitySelect = (id, checked) => {
        let changedCitiesOptions = citiesOptions.map(city => {
            if (city.id === id) {
                return Object.assign({}, city, {checked: !checked})
            } else {
                return city;
            }
        });

        setCitiesOptions(changedCitiesOptions);
    };

    const closeSidebarClick = () => {
        handleOpen();
    };

    const handleLocationsChange = (selectedList, selectedItem) => {
        if (selectedItem.id === -1) {
            setLocationsSelected(locationsOptions)
        } else {
            setLocationsSelected(selectedList);
        }
    };

    const handleRemoveLocationsChange = (selectedList, removedItem) => {
        if (removedItem.id === -1) {
            setLocationsSelected([])
        } else {
            setLocationsSelected(selectedList);
        }
    };

    const renderCitySelectionSection = () => {
        if(citiesOptions.length > 0) {
            return citiesOptions.map(city => {
                const id = city.id;
                const checked = city.checked;
                return (
                    <div id={city.id + "_checkbox"} onClick={(e) => handleCitySelect(id, checked)}>
                        <img  src={`/img/pics/checkbox_${city.checked}.svg`}/>                                    
                        <span className="building_item_a">                                        
                            {city.name}                                    
                        </span>                                
                    </div>
                )
            })
        }
    };

    const filterUncheckedCities = () => {
        if (citiesOptions) {
            return citiesOptions.filter(city => {
                if (city.checked) {
                    return city;
                }
            });
        } else {
            return [];
        }
    };

    if (isOpen) {
        return (
            <div id="InfoSidebar">
                <div id="closeSidebar" onClick={closeSidebarClick}>
                    <img id="close_icon" src="/img/pics/close_sidebar.svg"></img>
                </div>

                <h1 id="headerSidebar">{strings.filter}</h1>

                <h2 className="contracts-first-element-header-container">{strings.city}</h2>
                <div>
                    {renderCitySelectionSection()}
                </div>

                <h2 className="contracts-sidebar-header-container">{strings.contractNumber}</h2>
                    <Dropdown name="contractNumber" 
                              options={contractsNumbers} 
                              handleChange={handleDataChange}
                              selectedValue={selectedContractNumber}
                              placeHolder={strings.contractNumberPlaceholder}/>
                <div>

                </div>


                <h2 className="contracts-sidebar-header-container">{strings.contractName}</h2>
                    <Dropdown name="contractName" 
                              options={contractsNames} 
                              handleChange={handleDataChange}
                              selectedValue={selectedContractName}
                              placeHolder={strings.contractNamePlaceholder}/>
                <div>

                </div>

                <h2 className="contracts-sidebar-header-container">{strings.locations}</h2>
                <div className="select_custom_">
                    <Multiselect
                        options={locationsOptions} 
                        selectedValues={locationsSelected} 
                        onSelect={(selectedList, selectedItem) => { handleLocationsChange(selectedList, selectedItem) }} 
                        onRemove={(selectedList, removedItem) => { handleRemoveLocationsChange(selectedList, removedItem) }} 
                        displayValue="name" 
                        showCheckbox={true}
                        closeOnSelect={false}
                        showArrow={true}
                        style={{ chips: { display: "none" }, option: { fontSize: "14pt" } }}
                        placeholder={locationsSelected.length > 0 
                                     ? strings.selected + locationsSelected.length
                                     : strings.locationsPlaceholder
                        }
                    />
                </div>


                <div className="contracts-sidebar-show-button-container">
                    <button 
                        className="btn contracts-sidebar-button-show-bookings button-filter"
                        onClick={() => { applyFilters(filterUncheckedCities(), selectedContractNumber, 
                                                      selectedContractName, locationsSelected); 
                        }}
                    >
                    {strings.show}
                    </button>
                    <button className="btn contracts-sidebar-button-decline button-filter right_button" onClick={handleResetButton}>
                        {strings.reset}
                    </button>
                </div>
            </div>
        );
    }

    //if not open => render nothing
    return<></>

};

const mapStateToProps = state => {
    return {
        cities: state.cities,
        contracts: state.contracts,
        locations: state.locations
    };
};

export default connect(mapStateToProps, null, null, {pure: false})(ContractsFilterSidebar)