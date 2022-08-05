import React, { useEffect } from 'react';
import LocalizedStrings from 'react-localization';
import "./LegendSidebarComponent.css";


let strings = new LocalizedStrings({
    en: {
       sidebarTitle: "Legend",
       sharedDeskNotReady: "Unequiped shared-desk place",
       sharedDeskReady: "Equipped shared-desk place, ready to book",
       unsafeDesk: "Please keep your distance",
       costCenterReservedDesk: "Desk reserved on Cost Center",
       employeeReservedDesk: "Desk reserved by employee",
       sharedDeskBooked: "Shared-desk seat reserved for the current day"
    },
    ru: {
       sidebarTitle: "Легенда",
       sharedDeskNotReady: "Необорудованное shared-desk место",
       sharedDeskReady: "Оборудованное shared-desk место, доступно для брони",
       unsafeDesk: "Пожалуйста, соблюдайте дистанцию",
       costCenterReservedDesk: "Стол, зарезервированный на МВЗ",
       employeeReservedDesk: "Стол, зафиксированный за сотрудником",
       sharedDeskBooked: "Shared-desk место на текущий день забронировано"
    },
    de: {
       sidebarTitle: "Legende",
       sharedDeskNotReady: "Unausgestatteter gemeinsamer Schreibtisch",
       sharedDeskReady: "Ausgestatteter gemeinsamer Schreibtisch, bereit zum Buchen",
       unsafeDesk: "Bitte haltet Abstand",
       costCenterReservedDesk: "Schreibtisch auf der Kostenstelle reserviert",
       employeeReservedDesk: "Schreibtisch vom Mitarbeiter reserviert",
       sharedDeskBooked: "Shared-Desk-Sitzplatz für den aktuellen Tag gebucht"
    }
});

const LegendSidebar = ({isOpen, handleOpen}) => {
    let lang = localStorage.getItem('lang').toLowerCase();
    strings.setLanguage(localStorage.getItem('lang').toLowerCase());

    useEffect(() => {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }, [lang]);

    const closeSidebarClick = () => {
        handleOpen();
    };

    const renderLegendItem = (imgSrc, text) => {
        return ( 
            <div className="legend-sidebar-description-item-container">
                <img className="legend-sidebar-description-item-image" src={imgSrc}></img>
                <span className="legend-sidebar-description-item-text">
                    <div className="legend-sidebar-description-item-text-wrapper">
                        {text}
                    </div>
                </span>
            </div>
        );
    }

    if (isOpen) {
        return (
            <div id="InfoSidebar">
                <div id="closeSidebar" onClick={closeSidebarClick}>
                    <img id="close_icon" src="/img/pics/close_sidebar.svg"></img>
                </div>
                <h1 id="headerSidebar">{strings.sidebarTitle}</h1>
                <div>
                   {renderLegendItem("/img/pics/employee_reserved_desk.svg", strings.employeeReservedDesk)}
                   {renderLegendItem("/img/pics/cost_center_reserved_desk.svg", strings.costCenterReservedDesk)}
                   {renderLegendItem("/img/pics/unsafe_desk.svg", strings.unsafeDesk)}
                   {renderLegendItem("/img/pics/shared_desk_ready.svg", strings.sharedDeskReady)}
                   {renderLegendItem("/img/pics/shared_desk_booked.svg", strings.sharedDeskBooked)}
                   {renderLegendItem("/img/pics/shared_desk_not_ready.svg", strings.sharedDeskNotReady)}
                </div>
            </div>
        );
    } else {
        return <></>
    }


};

export default (LegendSidebar);