import React, { useEffect, forwardRef, useState } from 'react';
import LocalizedStrings from 'react-localization';
import DatePicker from "react-datepicker";
import "./HeartBeatsFilterSidebarComponent.css";


let strings = new LocalizedStrings({
    en: {
        filter: "Filter",
        checkAll: "Check all",
        dateStart: "Start date",
        dateEnd: "End date",
        applyFilters: "Show",
        logTypes: "Log types",
        changeDate: "Date of changes"
    },
    ru: {
        filter: "Фильтр",
        checkAll: "Выбрать всё",
        dateStart: "Дата начала",
        dateEnd: "Дата окончания",
        applyFilters: "Показать",
        logTypes: "Типы логов",
        changeDate: "Дата изменений"

    },
    de: {
        filter: "Filter",
        checkAll: "Alles auswählen",
        dateStart: "Anfangsdatum",
        dateEnd: "Endtermin",
        applyFilters: "Zeigen",
        logTypes: "Protokolltypen",
        changeDate: "Datum der Änderungen"
    }

});

const HeartBeatsFilterSidebar = ({isOpen, handleOpen, sortOptions, handleSortChange, 
                                allSortOptionsChecked, handleAllSortOptionsCheck, applyFilters}) => {

    let lang = localStorage.getItem('lang').toLowerCase();
    strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    
    useEffect(() => {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }, [lang]);

    const closeSidebarClick = () => {
        handleOpen();
    };

    const [dateStart, setDateStart] = useState('')
    const [dateEnd, setDateEnd] = useState('')

    const onDateStartChange = (date) => {
        setDateStart(date);
    }

    const onDateEndChange = (date) => {
        setDateEnd(date);
    }

    if (isOpen) {
        return (
            <div id="InfoSidebar">
                <div id="closeSidebar" onClick={closeSidebarClick}>
                    <img id="close_icon" src="/img/pics/close_sidebar.svg"></img>
                </div>
                <h1 id="headerSidebar">{strings.filter}</h1>
                <h2 className="heart-beats-filter-sidebar-second-header">{strings.logTypes}</h2>
                <div onClick={(e) => {handleAllSortOptionsCheck(!allSortOptionsChecked)}}>
                    <img  src={`/img/pics/checkbox_${allSortOptionsChecked}.svg`}/>                                    
                    <span className="building_item_a">                                        
                        {strings.checkAll}                                    
                    </span>          
                </div>
                <div className="heart-beats-filter-sidebar-filters-container">
                    {sortOptions && sortOptions.map(option => {
                        const value = option.value;
                        const checked = option.checked;
                        return (
                            <div id={option.value + "_checkbox"} onClick={(e) => {handleSortChange(value, checked)}}>
                                <img  src={`/img/pics/checkbox_${option.checked}.svg`}/>                                    
                                <span className="building_item_a">                                        
                                    {option.label}                                    
                                </span>                                
                            </div>
                        )})
                    }
                </div>
                <h2 className="heart-beats-filter-sidebar-second-header">{strings.changeDate}</h2>
                <span className="heart-beats-filter-sidebar-date-container">
                    <DatePicker
                        dateFormat="dd.MM.yyyy"
                        selected={dateStart}
                        onChange={date => onDateStartChange(date)}
                        popper
                        selectsStart
                        startDate={dateStart}
                        isClearable
                        locale={localStorage.getItem('lang') === 'RU'
                            ? 'ru'
                            : localStorage.getItem('lang') === 'US'
                                ? 'en'
                                : localStorage.getItem('lang') === 'DE'
                                    ? 'de'
                                    : 'ru'
                        }
                        placeholderText={strings.dateStart}
                    />
                <span className="heart-beats-filter-sidebar-date-container-end">
                    <DatePicker
                        dateFormat="dd.MM.yyyy"
                        selected={dateEnd}
                        onChange={date => onDateEndChange(date)}
                        popperPlacement="left-start"
                        popperModifiers={{
                            offset:{
                                enabled: true,
                                offset: "35px, -5px"
                            }
                        }}
                        selectsEnd
                        startDate={dateStart}
                        isClearable
                        locale={localStorage.getItem('lang') === 'RU'
                            ? 'ru'
                            : localStorage.getItem('lang') === 'US'
                                ? 'en'
                                : localStorage.getItem('lang') === 'DE'
                                    ? 'de'
                                    : 'ru'
                        }
                        placeholderText={strings.dateEnd}
                    />
                </span>
                </span>
                <div className="heart-beats-filter-sidebar-show-button-container">
                    <button 
                        className="button-magenta heart-beats-filter-sidebar-show-button"
                        onClick={() => { applyFilters(dateStart, dateEnd) }}
                    >
                    {strings.applyFilters}
                    </button>
                </div>
            </div>
        );
    } else {
        return <></>
    }
};

export default (HeartBeatsFilterSidebar);