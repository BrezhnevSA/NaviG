import * as rights from './Rights';
import * as app    from './AppSettings';

export const list = [
    {
        name: "LOCATIONS_RIGHTS",
        rights: [
            rights.VIEW_LOCATIONS,
            rights.VIEW_LOCATION,
            rights.UPDATE_LOCATION
        ],
        description: "Управление помещениями",
        urls: ["/locations/"]
    },{
        name: "LOCATION_FORM_RIGHTS",
        rights: [
            rights.VIEW_LOCATIONS,
            rights.VIEW_LOCATION,
            rights.UPDATE_LOCATION,
            rights.CREATE_LOCATION
        ],
        description: "Редактирование помещений",
        urls: ["/locations/:id/"]
    },{
        name: "OBJECT_ITEMS_RIGHTS",
        rights: [
            rights.VIEW_OBJECT_ITEMS,
            rights.VIEW_OBJECT_ITEM,
            rights.UPDATE_OBJECT_ITEM,
            rights.DELETE_OBJECT_ITEM
        ],
        description: "Управление объектами",
        urls: ["/objects/"]
    },{
        name: "OBJECT_ITEM_FORM_RIGHTS",
        rights: [
            rights.VIEW_OBJECT_ITEMS,
            rights.VIEW_OBJECT_ITEM,
            rights.UPDATE_OBJECT_ITEM
        ],
        description: "Редактирование объектов",
        urls: ["/objects/:id/"]
    },{
        name: "META_TYPES_RIGHTS",
        rights: [
            rights.VIEW_META_TYPE,
            rights.VIEW_META_TYPES,
            rights.CREATE_META_TYPE
        ],
        description: "Управление типами meta полей/Типы данных",
        urls: ["/metatypes/"]
    },{
        name: "META_TYPES_FORM_RIGHTS",
        rights: [
            rights.VIEW_META_TYPE,
            rights.VIEW_META_TYPES,
            rights.CREATE_META_TYPE,
            rights.UPDATE_META_TYPE,
            rights.DELETE_META_TYPE
        ],
        description: "Редактирование типов meta полей",
        urls: ["/metatypes/:id/"]
    },{
        name: "META_MAPS_RIGHTS",
        rights: [
            rights.VIEW_META_MAP,
            rights.VIEW_META_MAPS,
            rights.CREATE_META_MAP
        ],
        description: "Маппинг meta полей/Назначение meta полей",
        urls: ["/metamaps/"]
    },{
        name: "META_MAPS_FORM_RIGHTS",
        rights: [
            rights.VIEW_META_MAP,
            rights.VIEW_META_MAPS,
            rights.CREATE_META_MAP,
            rights.DELETE_META_MAP,
            rights.UPDATE_META_MAP
        ],
        description: "Редактирование маппинга meta полей",
        urls: ["/metamaps/:id/"]
    },{
        name: "META_FIELDS_RIGHTS",
        rights: [
            rights.VIEW_META_FIELD,
            rights.VIEW_META_FIELDS,
            rights.CREATE_META_FIELD,
        ],
        description: "Управление meta полями",
        urls: ["/metafields/"]
    },{
        name: "META_FIELDS_FORM_RIGHTS",
        rights: [
            rights.VIEW_META_FIELD,
            rights.VIEW_META_FIELDS,
            rights.CREATE_META_FIELD,
            rights.UPDATE_META_FIELD,
            rights.DELETE_META_FIELD
        ],
        description: "Редактирование meta полей",
        urls: ["/metafields/:id/"]
    },{
        name: "CITIES_RIGHTS",
        rights: [
            rights.CREATE_CITY,
            rights.UPDATE_CITY,
            rights.DELETE_CITY,
            rights.VIEW_CITIES
        ],
        description: "Управление городами",
        urls: ["/cities/"]
    },{
        name: "CITY_FORM_RIGHTS",
        rights: [
            rights.CREATE_CITY,
            rights.UPDATE_CITY,
            rights.DELETE_CITY,
            rights.VIEW_ONE_CITY,
            rights.VIEW_CITIES
        ],
        description: "Редактирование городов",
        urls: ["/cities/:id/"]
    },{
        name: "BULDINGS_RIGHTS",
        rights: [
            rights.CREATE_BUILDING,
            rights.UPDATE_BUILDING,
            rights.DELETE_BUILDING,
            rights.VIEW_BUILDINGS
        ],
        description: "Управление корпусами",
        urls: ["/buildings/"]
    },{
        name: "BULDINGS_FORM_RIGHTS",
        rights: [
            rights.CREATE_BUILDING,
            rights.UPDATE_BUILDING,
            rights.DELETE_BUILDING,
            rights.VIEW_ONE_BUILDING,
            rights.VIEW_BUILDINGS
        ],
        description: "Редактирование корпусов",
        urls: ["/buildings/:id/"]
    },{
        name: "LOCATION_TYPES_RIGHTS",
        rights: [
            rights.CREATE_LOCATION_TYPE,
            rights.UPDATE_LOCATION_TYPE,
            rights.DELETE_LOCATION_TYPE,
            rights.VIEW_LOCATION_TYPES
        ],
        description: "Управление типами помещений",
        urls: ["/locationtypes/"]
    },{
        name: "LOCATION_TYPE_FORM_RIGHTS",
        rights: [
            rights.CREATE_LOCATION_TYPE,
            rights.UPDATE_LOCATION_TYPE,
            rights.DELETE_LOCATION_TYPE,
            rights.VIEW_LOCATION_TYPES,
            rights.VIEW_LOCATION_TYPE
        ],
        description: "Редактирование типов помещений",
        urls: ["/locationtypes/:id/"]
    },{
        name: "OBJECT_TYPES_RIGHTS",
        rights: [
            rights.CREATE_OBJECT_TYPE,
            rights.UPDATE_OBJECT_TYPE,
            rights.DELETE_OBJECT_TYPE,
            rights.VIEW_OBJECT_TYPES
        ],
        description: "Управление типами объектов",
        urls: ["/objecttypes/"]
    },{
        name: "OBJECT_TYPE_FORM_RIGHTS",
        rights: [
            rights.CREATE_OBJECT_TYPE,
            rights.UPDATE_OBJECT_TYPE,
            rights.DELETE_OBJECT_TYPE,
            rights.VIEW_OBJECT_TYPES,
            rights.VIEW_OBJECT_TYPE
        ],
        description: "Редактирование типов объектов",
        urls: ["/objecttypes/:id/"]
    },{
        name: "OFFICES_RIGHTS",
        rights: [
            rights.CREATE_OFFICE,
            rights.UPDATE_OFFICE,
            rights.DELETE_OFFICE,
            rights.VIEW_OFFICES
        ],
        description: "Управление офисами",
        urls: ["/offices/"]
    },{
        name: "OFFICE_FORM_RIGHTS",
        rights: [
            rights.CREATE_OFFICE,
            rights.UPDATE_OFFICE,
            rights.DELETE_OFFICE,
            rights.VIEW_OFFICES,
            rights.VIEW_OFFICE
        ],
        description: "Редактирование офисов",
        urls: ["/offices/:id/"]
    },{
        name: "GROUPRIGHTS_RIGHTS",
        rights: [
            rights.VIEW_GROUP,
            rights.VIEW_GROUPRIGHTS,
            rights.VIEW_RIGHTS,
            rights.UPDATE_GROUP,
            rights.CREATE_ROLE,
            rights.UPDATE_ROLE,
        ],
        description: "Управление доступом/ Просмотр прав доступа",
        urls: ["/grouprights/"]
    },{
        name: "GROUPRIGHTS_RIGHTS_FOR_PAGES",
        rights: [
            rights.VIEW_GROUP,
            rights.VIEW_GROUPRIGHTS,
            rights.UPDATE_GROUP,
            rights.CREATE_ROLE,
            rights.UPDATE_ROLE,
            rights.VIEW_RIGHTS,
        ],
        description: "Управление доступом к страницам",
        urls: ["/rights_for_pages/"]
    },{
        name: "GROUP_FORM_RIGHTS",
        rights: [
            rights.VIEW_GROUP,
            rights.VIEW_GROUPRIGHTS,
            rights.VIEW_RIGHTS,
            rights.UPDATE_GROUP,
            rights.CREATE_ROLE,
            rights.UPDATE_ROLE,
            rights.CREATE_GROUP,
            rights.DELETE_GROUP,
            rights.DELETE_ROLE
        ],
        description: "Редактирование прав группы",
        urls: ["/groups/:id"]
    },{
        name: "MAPEDITOR_RIGHTS",
        rights: [
            rights.VIEW_FLOOR,
            rights.VIEW_FLOORS,
            rights.UPDATE_FLOOR,
            rights.UPDATE_FLOORS_CONFIG,
        ],
        description: "Редактор карт этажей",
        urls: ["/floor/:id/edit/"]
    },{
        name: "MAPVIEWER_RIGHTS",
        rights: [
            rights.VIEW_FLOOR,
            rights.VIEW_FLOORS,
        ],
        description: "Просмотр карт этажей",
        urls: ["/floor/:id/", "/floors/:id/"]
    },{
        name: "FLOORS_RIGHTS",
        rights: [
            rights.CREATE_FLOOR,
            rights.UPDATE_FLOOR,
            rights.DELETE_FLOOR,
            rights.VIEW_FLOORS
        ],
        description: "Управление этажами",
        urls: ["/floors/"]
    },{
        name: "FLOOR_FORM_RIGHTS",
        rights: [
            rights.CREATE_FLOOR,
            rights.UPDATE_FLOOR,
            rights.DELETE_FLOOR,
            rights.VIEW_FLOORS,
            rights.VIEW_FLOOR
        ],
        description: "Редактирование информации об этажах",
        urls: ["/floors/:id/details", "/floors/new"]
    },{
        name: "HEARTBEATS_RIGHTS",
        rights: [
            rights.VIEW_HEARTBEATS
        ],
        description: "Лог активности",
        urls: ["/heartbeats/"]
    },{
        name: "REPORTS_RIGHTS",
        rights: [
            rights.VIEW_REPORTS
        ],
        description: "Отчеты",
        urls: ["/relocation_reports", "/reservations_with_comments_report", "/reservations_report", "/costcenter_places_report", "/meterage_report/:id"]
    },{
        name: "ALL_BOOKING_TAB_RIGHTS",
        rights: [
            rights.EDIT_ALL_BOOKINGS,
            rights.DELETE_ALL_BOOKINGS,
            rights.VIEW_ALL_BOOKINGS
        ],
        description: "Вкладка Все в Управление бронированиями",
        urls: ["/bookings?key=ALL"]
    },{
        name: "SDMANAGERS_COSTCENTERS_TAB_RIGHTS",
        rights: [
            rights.VIEW_SDMANAGERS_COSTCENTER,
            rights.VIEW_SDMANAGERS_COSTCENTERS,
            rights.CREATE_SDMANAGERS_COSTCENTERS,
            rights.DELETE_SDMANAGERS_COSTCENTERS
        ],
        description: "Вкладка SD Менеджеры в Управление бронированиями",
        urls: ["bookings?key=SD_MANAGERS"]
    },{
        name: "SDMANAGERS_CREATE_TAB_RIGHTS",
        rights: [
            rights.VIEW_SDMANAGERS_COSTCENTERS,
            rights.CREATE_SDMANAGERS_COSTCENTERS,
        ],
        description: "Страница добавления SD менеджера",
        urls: ["/sdmanagers"]
    },{
        name: "SD_LOCATIONS_MANAGMENT_TAB_RIGHTS",
        rights: [
            rights.VIEW_SD_LOCATIONS_MANAGMENTS,
            rights.CREATE_SD_LOCATIONS_MANAGMENTS,
            rights.DELETE_SD_LOCATIONS_MANAGMENTS,
        ],
        description: "Вкладка управление SD помещениями в Управление бронированиями",
        urls: ["/bookings?key=SD_LOCATIONS_MANAGMENT"]
    },{
        name: "ACCESS_TO_SD_LOCATIONS_CREATE_RIGHTS",
        rights: [
            rights.VIEW_SD_LOCATIONS_MANAGMENT,
            rights.CREATE_SD_LOCATIONS_MANAGMENTS,
            rights.DELETE_SD_LOCATIONS_MANAGMENTS,
        ],
        description: "Редактирование доступа к SD помещению",
        urls: ["/sdlocation_access/:id"]
    },{
        name: "CONTRACTS_RIGHTS",
        rights: [
            rights.VIEW_META_VALUES,
            rights.VIEW_META_VALUE,
            rights.VIEW_LOCATIONS,
            rights.VIEW_CONTRACTS
        ],
        description: "Управление контрактами",
        urls: ["/contracts"]
    },{
        name: "CONTRACTS_FORM_RIGHTS",
        rights: [
            rights.VIEW_META_VALUES,
            rights.VIEW_META_VALUE,
            rights.ADD_CONTRACT_REFERENCE,
            rights.UPDATE_CONTRACT_REFERENCE,
            rights.DELETE_CONTRACT_REFERENCE,
            rights.VIEW_LOCATIONS,
            rights.VIEW_CONTRACTS,
            rights.VIEW_ONE_CONTRACT,
            rights.DELETE_CONTRACT,
            rights.UPDATE_CONTRACT,
            rights.ADD_CONTRACT,
        ],
        description: "Редактирование контракта",
        urls: ["/contracts/:id"]
    }, {
        name: "EMPLOYEES_PANEL_RIGHTS",
        rights: [
            rights.VIEW_EMPLOYEES,
            rights.DELETE_EMPLOYEE
        ],
        description: "Управление сотрудниками",
        urls: ["/employees"]
    },{
        name: "INVENTORY_RIGHTS",
        rights: [
            rights.VIEW_OBJECT_ITEMS,
            rights.VIEW_OBJECT_ITEM,
            rights.UPDATE_OBJECT_ITEM,
            rights.VIEW_INVENTORY,
        ],
        description: "Инвентаризация",
        urls: [`/${app.INVENTORY_PATH}/`]
    },{
        name: "INVENTORY_FORM_RIGHTS",
        rights: [
            rights.VIEW_OBJECT_ITEMS,
            rights.VIEW_OBJECT_ITEM,
            rights.UPDATE_OBJECT_ITEM,
            rights.VIEW_INVENTORY,
        ],
        description: "Редактирование места (инвентаризация)",
        urls: [`/${app.INVENTORY_PATH}/:id/`]
    }
];