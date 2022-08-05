require 'rake'

Rake::Task.clear # necessary to avoid tasks being loaded several times in dev mode
NaviBack::Application.load_tasks # providing your application name is 'sample'

# Entities types

puts 'Location and Object types'

LocationType.create!([
    {name: "Здание", bg: "/img/textures/corridors.jpg", active: true},
    {name: "Open Space", bg: "/img/textures/c_23e.jpg", active: true},
    {name: "Переговорка", bg: "/img/textures/conferenceroom.jpg", active: true},
    {name: "Туалет", bg: "/img/textures/c_20.jpg", active: true},
    {name: "Душевая", bg: "/img/textures/final_wc.jpg", active: true},
    {name: "Лифт", bg: "/img/textures/lift.jpg", active: true},
    {name: "Кухня", bg: "/img/textures/c_20c.jpg", active: true},
    {name: "Лестница", bg: "/img/textures/c_20.jpg", active: true},
    {name: "Балкон", bg: "/img/textures/workarea.jpg", active: true}
])

ObjectType.create!([
    {name: "Стол", icon: "/desk.svg", active: true, rotatable: true, resizable: false},
    {name: "Принтер", icon: "/object_type_2.png", active: true, rotatable: false, resizable: false},
    {name: "Кулер", icon: "/object_type_3.png", active: true, rotatable: false, resizable: false},
    {name: "Холодильник", icon: "/object_type_4.png", active: true, rotatable: false, resizable: false},
    {name: "Раковина", icon: "/object_type_5.png", active: true, rotatable: false, resizable: false},
    {name: "Посудомойка", icon: "/object_type_6.png", active: true, rotatable: false, resizable: false},
    {name: "Дверь", icon: "/object_type_7.png", active: true, rotatable: true, resizable: false},
    {name: "Дверь на замке", icon: "/object_type_8.png", active: true, rotatable: true, resizable: false},
    {name: "Кофеварка", icon: "/object_type_9.png", active: true, rotatable: false, resizable: false},
    {name: "Шкаф", icon: "/object_type_10.png", active: true, rotatable: false, resizable: false},
    {name: "Туалет МЖ", icon: "/object_type_11.png", active: true, rotatable: false, resizable: false},
    {name: "Туалет М", icon: "/object_type_12.png", active: true, rotatable: false, resizable: false},
    {name: "Туалет Ж", icon: "/object_type_13.png", active: true, rotatable: false, resizable: false},
    {name: "Проектор", icon: "/object_type_14.png", active: true, rotatable: false, resizable: false},
    {name: "Кондиционер", icon: "/object_type_15.png", active: true, rotatable: false, resizable: false},
    {name: "Шланг", icon: "/object_type_16.png", active: true, rotatable: false, resizable: false},
    {name: "Огнетушитель", icon: "/object_type_17.png", active: true, rotatable: false, resizable: false},
    {name: "Телефон", icon: "/object_type_18.png", active: true, rotatable: false, resizable: false},
    {name: "Душ", icon: "/object_type_19.png", active: true, rotatable: false, resizable: false},
    {name: "Аптечка", icon: "/object_type_20.png", active: true, rotatable: false, resizable: false},
    {name: "Структурный элемент", icon: "/object_type_21.png", active: true, rotatable: true, resizable: true},
    {name: "Микроволновка", icon: "/object_type_22.png", active: true, rotatable: false, resizable: false},
    {name: "Объект", icon: "/object_type_0.png", active: true, rotatable: false, resizable: false},
    {name: "Вендинговый автомат", icon: "/object_type_24.png", active: true, rotatable: false, resizable: false},
    {name: "Пункт раздельного сбора", icon: "/object_type_25.png", active: true, rotatable: false, resizable: false},
    {name: "АТМ", icon: "/object_type_26.png", active: true, rotatable: false, resizable: false},
    {name: "Лифт", icon: "/object_type_27.png", active: true, rotatable: false, resizable: false},
    {name: "Лестница", icon: "/object_type_28.png", active: true, rotatable: false, resizable: false},
    {name: "Серверная", icon: "/object_type_29.png", active: true, rotatable: false, resizable: false},
    {name: "Подсобное помещение", icon: "/object_type_30.png", active: true, rotatable: false, resizable: false},
    {name: "Релакс комната", icon: "/object_type_31.png", active: true, rotatable: false, resizable: false},
    {name: "Электрощитовая", icon: "/object_type_32.png", active: true, rotatable: false, resizable: false},
    {name: "Кофе станция", icon: "/object_type_33.png", active: true, rotatable: false, resizable: false},
    {name: "Спортивная комната", icon: "/object_type_34.png", active: true, rotatable: false, resizable: false},
    {name: "Мини-переговорная", icon: "/object_type_35.png", active: true, rotatable: false, resizable: false},
    {name: "Зона с диванами", icon: "/object_type_36.png", active: true, rotatable: false, resizable: false},
    {name: "Игровая консоль", icon: "/object_type_37.png", active: true, rotatable: false, resizable: false},
    {name: "Панорама", icon: "/object_type_38.png", active: true, rotatable: false, resizable: false},
    {name: "Переход", icon: "/object_type_39.png", active: true, rotatable: false, resizable: false},
])

# Floor and entities

puts 'Run floors creation'

puts 'Creation of City/Office/Building'

City.create!(name: 'Демо Сити', short_name: 'DEMO', ord: 1, active: true)
City.create!(name: 'Санкт-Петербург', short_name: 'S', ord: 0, active: true)
City.create!(name: 'Воронеж', short_name: 'V', ord: 0, active: true)
City.create!(name: 'Москва', short_name: 'M', ord: 0, active: true)

Rake::Task['floors_import'].reenable
Rake::Task['floors_import'].invoke

# Attributes

puts 'Creation of meta types'

MetaType.create!([
  {name: "Текстовое поле", metatype: "text"},
  {name: "Чекбокс", metatype: "checkbox"},
  {name: "Ссылка", metatype: "reference"},
  {name: "Площадь", metatype: "square"},
  {name: "Изображение", metatype: "image"},
  {name: "Панорама", metatype: "panorama"},
  {name: "Выбор этажа", metatype: "floor_reference"},
])

MetaField.create!([
  {name: "Ответственный", meta_type_id: 1},
  {name: "Цветной принтер", meta_type_id: 2},
  {name: "Contract ID", meta_type_id: 3},
  {name: "Площадь", meta_type_id: 4},
  {name: "Используемое", meta_type_id: 2},
  {name: "Панорама", meta_type_id: 6},
  {name: "Переход на этаж", meta_type_id: 7},
])

MetaMap.create!([
  {entity_type: "ObjectItem", entity_subtype_id: "17", meta_field_id: 1, active: true, show_in_management: false},
  {entity_type: "ObjectItem", entity_subtype_id: "2", meta_field_id: 2, active: true, show_in_management: false},
  {entity_type: "Location", entity_subtype_id: "1", meta_field_id: 3, active: true, show_in_management: false},
  {entity_type: "Location", entity_subtype_id: "1", meta_field_id: 4, active: true, show_in_management: false},
  {entity_type: "Location", entity_subtype_id: "1", meta_field_id: 5, active: true, show_in_management: false},
  {entity_type: "ObjectItem", entity_subtype_id: "38", meta_field_id: 6, active: true, show_in_management: false},
  {entity_type: "ObjectItem", entity_subtype_id: "39", meta_field_id: 7, active: true, show_in_management: false},
])

# Users and permissions

puts 'Setting rights and groups'

Right.create(name: 'View Cities', machine_name: "view_cities", description: "Descr goes here")
Right.create(name: 'View One City', machine_name: "view_one_city", description: "Descr goes here again")
Right.create(name: 'Update City', machine_name: "update_city", description: "Descr goes here again")
Right.create(name: 'Create City', machine_name: "create_city", description: "Descr goes here again")
Right.create(name: 'Delete City', machine_name: "delete_city", description: "Descr goes here again")

Right.create(name: 'View Employees', machine_name: "view_employees", description: "Descr goes here again")
Right.create(name: 'View One Employee', machine_name: "view_one_employee", description: "Descr goes here again")
Right.create(name: 'Update Employee', machine_name: "update_employee", description: "Descr goes here again")

Right.create(name: 'View Employee Additional', machine_name: "view_employee_adds", description: "Descr goes here again")
Right.create(name: 'Update Employee Additional', machine_name: "update_employee_adds", description: "Descr goes here again")
Right.create(name: 'Update Own Additional', machine_name: "update_own_adds", description: "Descr goes here again")

Right.create(name: 'View Roles', machine_name: "view_roles", description: "Descr goes here again")
Right.create(name: 'View Role', machine_name: "view_role", description: "Descr goes here again")
Right.create(name: 'Update Role', machine_name: "update_role", description: "Descr goes here again")
Right.create(name: 'Create Role', machine_name: "create_role", description: "Descr goes here again")
Right.create(name: 'Delete Role', machine_name: "delete_role", description: "Descr goes here again")

Right.create(name: 'View Rights', machine_name: "view_rights", description: "Descr goes here again")
Right.create(name: 'View Right', machine_name: "view_right", description: "Descr goes here again")
Right.create(name: 'Update Right', machine_name: "update_right", description: "Descr goes here again")
Right.create(name: 'Create Right', machine_name: "create_right", description: "Descr goes here again")
Right.create(name: 'Delete Right', machine_name: "delete_right", description: "Descr goes here again")

Right.create(name: 'View Groups', machine_name: "view_groups", description: "Descr goes here again")
Right.create(name: 'View Group', machine_name: "view_group", description: "Descr goes here again")
Right.create(name: 'Update Group', machine_name: "update_group", description: "Descr goes here again")
Right.create(name: 'Create Group', machine_name: "create_group", description: "Descr goes here again")
Right.create(name: 'Delete Group', machine_name: "delete_group", description: "Descr goes here again")

Right.create(name: 'View Positions', machine_name: "view_position", description: "Descr goes here again")
Right.create(name: 'View Position', machine_name: "view_position", description: "Descr goes here again")
Right.create(name: 'Update Position', machine_name: "update_position", description: "Descr goes here again")
Right.create(name: 'Create Position', machine_name: "create_position", description: "Descr goes here again")
Right.create(name: 'Delete Position', machine_name: "delete_position", description: "Descr goes here again")

Right.create(name: 'View Groups Rights', machine_name: "view_grouprights", description: "Descr goes here again")
Right.create(name: 'View Groups Right', machine_name: "view_groupright", description: "Descr goes here again")
Right.create(name: 'Update Groups Right', machine_name: "update_groupright", description: "Descr goes here again")
Right.create(name: 'Create Groups Right', machine_name: "create_groupright", description: "Descr goes here again")
Right.create(name: 'Delete Groups Right', machine_name: "delete_groupright", description: "Descr goes here again")

Right.create(name: 'View Floors Configs', machine_name: "view_floors_configs", description: "Descr goes here again")
Right.create(name: 'View Floors Config', machine_name: "view_floors_config", description: "Descr goes here again")
Right.create(name: 'Update Floors Configs', machine_name: "update_floors_config", description: "Descr goes here again")
Right.create(name: 'Create Floors Configs', machine_name: "create_floors_config", description: "Descr goes here again")
Right.create(name: 'Delete Floors Configs', machine_name: "delete_floors_config", description: "Descr goes here again")

Right.create(name: 'View Employees Adds', machine_name: "view_employees_adds", description: "Descr goes here again")
Right.create(name: 'View Employees Adds', machine_name: "view_employees_add", description: "Descr goes here again")
Right.create(name: 'Update Employees Adds', machine_name: "update_employees_add", description: "Descr goes here again")
Right.create(name: 'Create Employees Adds', machine_name: "update_own_employees_add", description: "Descr goes here again")

Right.create(name: 'View Buildings', machine_name: "view_buildings", description: "Descr goes here again")
Right.create(name: 'View Building', machine_name: "view_one_building", description: "Descr goes here again")
Right.create(name: 'Update Building', machine_name: "update_building", description: "Descr goes here again")
Right.create(name: 'Create Building', machine_name: "create_building", description: "Descr goes here again")
Right.create(name: 'Delete Building', machine_name: "delete_building", description: "Descr goes here again")

Right.create(name: 'View Floors', machine_name: "view_floors", description: "Descr goes here again")
Right.create(name: 'View Floor', machine_name: "view_floor", description: "Descr goes here again")
Right.create(name: 'Update Floor', machine_name: "update_floor", description: "Descr goes here again")
Right.create(name: 'Create Floor', machine_name: "create_floor", description: "Descr goes here again")
Right.create(name: 'Delete Floor', machine_name: "delete_floor", description: "Descr goes here again")

Right.create(name: 'View Offices', machine_name: "view_offices", description: "Descr goes here again")
Right.create(name: 'View Office', machine_name: "view_office", description: "Descr goes here again")
Right.create(name: 'Update Office', machine_name: "update_office", description: "Descr goes here again")
Right.create(name: 'Create Office', machine_name: "create_office", description: "Descr goes here again")
Right.create(name: 'Delete Office', machine_name: "delete_office", description: "Descr goes here again")

Right.create(name: 'View Object Types', machine_name: "view_object_types", description: "Descr goes here again")
Right.create(name: 'View Object Type', machine_name: "view_object_type", description: "Descr goes here again")
Right.create(name: 'Update Object Type', machine_name: "update_object_type", description: "Descr goes here again")
Right.create(name: 'Create Object Type', machine_name: "create_object_type", description: "Descr goes here again")
Right.create(name: 'Delete Object Type', machine_name: "delete_object_type", description: "Descr goes here again")

Right.create(name: 'View Location Types', machine_name: "view_location_types", description: "Descr goes here again")
Right.create(name: 'View Location Type', machine_name: "view_location_type", description: "Descr goes here again")
Right.create(name: 'Update Location Type', machine_name: "update_location_type", description: "Descr goes here again")
Right.create(name: 'Create Location Type', machine_name: "create_location_type", description: "Descr goes here again")
Right.create(name: 'Delete Location Type', machine_name: "delete_location_type", description: "Descr goes here again")

Right.create(name: 'View Meta Fields', machine_name: "view_meta_fields", description: "Descr goes here again")
Right.create(name: 'View Meta Field', machine_name: "view_meta_field", description: "Descr goes here again")
Right.create(name: 'Update Meta Field', machine_name: "update_meta_field", description: "Descr goes here again")
Right.create(name: 'Create Meta Field', machine_name: "create_meta_field", description: "Descr goes here again")
Right.create(name: 'Delete Meta Field', machine_name: "delete_meta_field", description: "Descr goes here again")

Right.create(name: 'View Meta Maps', machine_name: "view_meta_maps", description: "Descr goes here again")
Right.create(name: 'View Meta Map', machine_name: "view_meta_map", description: "Descr goes here again")
Right.create(name: 'Update Meta Map', machine_name: "update_meta_map", description: "Descr goes here again")
Right.create(name: 'Create Meta Map', machine_name: "create_meta_map", description: "Descr goes here again")
Right.create(name: 'Delete Meta Map', machine_name: "delete_meta_map", description: "Descr goes here again")

Right.create(name: 'View Meta Types', machine_name: "view_meta_types", description: "Descr goes here again")
Right.create(name: 'View Meta Type', machine_name: "view_meta_type", description: "Descr goes here again")
Right.create(name: 'Update Meta Type', machine_name: "update_meta_type", description: "Descr goes here again")
Right.create(name: 'Create Meta Type', machine_name: "create_meta_type", description: "Descr goes here again")
Right.create(name: 'Delete Meta Type', machine_name: "delete_meta_type", description: "Descr goes here again")

Right.create(name: 'View Meta Values', machine_name: "view_meta_values", description: "Descr goes here again")
Right.create(name: 'View Meta Value', machine_name: "view_meta_value", description: "Descr goes here again")
Right.create(name: 'Update Meta Value', machine_name: "update_meta_value", description: "Descr goes here again")
Right.create(name: 'Create Meta Value', machine_name: "create_meta_value", description: "Descr goes here again")
Right.create(name: 'Delete Meta Value', machine_name: "delete_meta_value", description: "Descr goes here again")

Right.create(name: 'View Object Items', machine_name: "view_object_items", description: "Descr goes here again")
Right.create(name: 'View Object Item', machine_name: "view_object_item", description: "Descr goes here again")
Right.create(name: 'Update Object Item', machine_name: "update_object_item", description: "Descr goes here again")

Right.create(name: 'View Locations', machine_name: "view_locations", description: "Descr goes here again")
Right.create(name: 'View Location', machine_name: "view_location", description: "Descr goes here again")
Right.create(name: 'Update Location', machine_name: "update_location", description: "Descr goes here again")
Right.create(name: 'Create Location', machine_name: "create_location", description: "Descr goes here again")

Right.create(name: 'View Heartbeats', machine_name: "view_heartbeats", description: "Descr goes here again")

Right.create(name: 'View Reports', machine_name: "view_reports", description: "Descr goes here again")

Right.create(name: 'Set booking on the same time', machine_name: 'set_booking_on_the_same_time', description: "Descr goes here again")
Right.create(name: 'View All Bookings', machine_name: 'view_all_bookings', description: "Descr goes here again")
Right.create(name: 'Delete All Bookings', machine_name: 'delete_all_bookings', description: "Descr goes here again")
Right.create(name: 'Edit All Bookings', machine_name: 'edit_all_bookings', description: "Descr goes here again")

Right.create(name: 'View Sdmanagers Costcenters', machine_name: 'view_sdmanagers_costcenters', description: "Descr goes here again")
Right.create(name: 'View Sdmanagers Costcenter', machine_name: 'view_sdmanagers_costcenter', description: "Descr goes here again")
Right.create(name: 'Create Sdmanagers Costcenters', machine_name: 'create_sdmanagers_costcenter', description: "Descr goes here again")
Right.create(name: 'Delete Sdmanagers Costcenters', machine_name: 'delete_sdmanagers_costcenter', description: "Descr goes here again")

Right.create(name: 'View SD Locations Managments', machine_name: 'view_sd_locations_managments', description: "Descr goes here again")
Right.create(name: 'View SD Locations Managment', machine_name: 'view_sd_locations_managment', description: "Descr goes here again")
Right.create(name: 'Create SD Locations Managments', machine_name: 'create_sd_locations_managment', description: "Descr goes here again")
Right.create(name: 'Delete SD Locations Managments', machine_name: 'delete_sd_locations_managment', description: "Descr goes here again")

Group.create(name: 'Anonymous')
Right.create(name: 'Update Contract Reference', machine_name: 'update_contract_reference', description: "Descr goes here again")
Right.create(name: 'Add Contract Reference', machine_name: 'add_contract_reference', description: "Descr goes here again")
Right.create(name: 'Delete Contract Reference', machine_name: 'delete_contract_reference', description: "Descr goes here again")

Right.create(name: 'View Contracts', machine_name: "view_contracts", description: "Descr goes here")
Right.create(name: 'View One Contract', machine_name: "view_one_contract", description: "Descr goes here again")
Right.create(name: 'Update Contract', machine_name: 'update_contract', description: "Descr goes here again")
Right.create(name: 'Add Contract', machine_name: 'add_contract', description: "Descr goes here again")
Right.create(name: 'Delete Contract', machine_name: 'delete_contract', description: "Descr goes here again")

Right.create(name: 'Delete Employee', machine_name: 'delete_employee', description: "Descr goes here again")

Group.create(name: 'Admins')
Group.create(name: 'Managers')
Group.create(name: 'Managers 2')
Group.create(name: 'Desk sharing')
Group.create(name: 'Testers')

# Give all rights

GroupsRight.create!([
  {group_id: 2, right_id: 1},
  {group_id: 5, right_id: 1},
  {group_id: 6, right_id: 1},
  {group_id: 2, right_id: 2},
  {group_id: 5, right_id: 2},
  {group_id: 6, right_id: 2},
  {group_id: 2, right_id: 3},
  {group_id: 5, right_id: 3},
  {group_id: 6, right_id: 3},
  {group_id: 2, right_id: 4},
  {group_id: 5, right_id: 4},
  {group_id: 6, right_id: 4},
  {group_id: 2, right_id: 5},
  {group_id: 5, right_id: 5},
  {group_id: 6, right_id: 5},
  {group_id: 2, right_id: 6},
  {group_id: 5, right_id: 6},
  {group_id: 6, right_id: 6},
  {group_id: 2, right_id: 7},
  {group_id: 5, right_id: 7},
  {group_id: 6, right_id: 7},
  {group_id: 2, right_id: 8},
  {group_id: 5, right_id: 8},
  {group_id: 6, right_id: 8},
  {group_id: 2, right_id: 9},
  {group_id: 5, right_id: 9},
  {group_id: 6, right_id: 9},
  {group_id: 2, right_id: 10},
  {group_id: 5, right_id: 10},
  {group_id: 6, right_id: 10},
  {group_id: 2, right_id: 11},
  {group_id: 5, right_id: 11},
  {group_id: 6, right_id: 11},
  {group_id: 2, right_id: 12},
  {group_id: 5, right_id: 12},
  {group_id: 6, right_id: 12},
  {group_id: 2, right_id: 13},
  {group_id: 5, right_id: 13},
  {group_id: 6, right_id: 13},
  {group_id: 2, right_id: 14},
  {group_id: 5, right_id: 14},
  {group_id: 6, right_id: 14},
  {group_id: 2, right_id: 15},
  {group_id: 5, right_id: 15},
  {group_id: 6, right_id: 15},
  {group_id: 2, right_id: 16},
  {group_id: 5, right_id: 16},
  {group_id: 6, right_id: 16},
  {group_id: 2, right_id: 17},
  {group_id: 5, right_id: 17},
  {group_id: 6, right_id: 17},
  {group_id: 2, right_id: 18},
  {group_id: 5, right_id: 18},
  {group_id: 6, right_id: 18},
  {group_id: 2, right_id: 19},
  {group_id: 5, right_id: 19},
  {group_id: 6, right_id: 19},
  {group_id: 2, right_id: 20},
  {group_id: 5, right_id: 20},
  {group_id: 6, right_id: 20},
  {group_id: 2, right_id: 21},
  {group_id: 5, right_id: 21},
  {group_id: 6, right_id: 21},
  {group_id: 2, right_id: 22},
  {group_id: 5, right_id: 22},
  {group_id: 6, right_id: 22},
  {group_id: 2, right_id: 23},
  {group_id: 5, right_id: 23},
  {group_id: 6, right_id: 23},
  {group_id: 2, right_id: 24},
  {group_id: 5, right_id: 24},
  {group_id: 6, right_id: 24},
  {group_id: 2, right_id: 25},
  {group_id: 5, right_id: 25},
  {group_id: 6, right_id: 25},
  {group_id: 2, right_id: 26},
  {group_id: 5, right_id: 26},
  {group_id: 6, right_id: 26},
  {group_id: 2, right_id: 27},
  {group_id: 5, right_id: 27},
  {group_id: 6, right_id: 27},
  {group_id: 2, right_id: 28},
  {group_id: 5, right_id: 28},
  {group_id: 6, right_id: 28},
  {group_id: 2, right_id: 29},
  {group_id: 5, right_id: 29},
  {group_id: 6, right_id: 29},
  {group_id: 2, right_id: 30},
  {group_id: 6, right_id: 30},
  {group_id: 2, right_id: 31},
  {group_id: 6, right_id: 31},
  {group_id: 2, right_id: 32},
  {group_id: 6, right_id: 32},
  {group_id: 2, right_id: 33},
  {group_id: 6, right_id: 33},
  {group_id: 2, right_id: 34},
  {group_id: 6, right_id: 34},
  {group_id: 2, right_id: 35},
  {group_id: 6, right_id: 35},
  {group_id: 2, right_id: 36},
  {group_id: 6, right_id: 36},
  {group_id: 2, right_id: 37},
  {group_id: 6, right_id: 37},
  {group_id: 2, right_id: 38},
  {group_id: 6, right_id: 38},
  {group_id: 2, right_id: 39},
  {group_id: 6, right_id: 39},
  {group_id: 2, right_id: 40},
  {group_id: 6, right_id: 40},
  {group_id: 2, right_id: 41},
  {group_id: 6, right_id: 41},
  {group_id: 2, right_id: 42},
  {group_id: 6, right_id: 42},
  {group_id: 2, right_id: 43},
  {group_id: 6, right_id: 43},
  {group_id: 2, right_id: 44},
  {group_id: 6, right_id: 44},
  {group_id: 2, right_id: 45},
  {group_id: 6, right_id: 45},
  {group_id: 2, right_id: 46},
  {group_id: 6, right_id: 46},
  {group_id: 2, right_id: 47},
  {group_id: 6, right_id: 47},
  {group_id: 2, right_id: 48},
  {group_id: 6, right_id: 48},
  {group_id: 2, right_id: 49},
  {group_id: 6, right_id: 49},
  {group_id: 2, right_id: 50},
  {group_id: 6, right_id: 50},
  {group_id: 2, right_id: 51},
  {group_id: 6, right_id: 51},
  {group_id: 2, right_id: 52},
  {group_id: 6, right_id: 52},
  {group_id: 2, right_id: 53},
  {group_id: 6, right_id: 53},
  {group_id: 2, right_id: 54},
  {group_id: 6, right_id: 54},
  {group_id: 2, right_id: 55},
  {group_id: 6, right_id: 55},
  {group_id: 2, right_id: 56},
  {group_id: 6, right_id: 56},
  {group_id: 2, right_id: 57},
  {group_id: 6, right_id: 57},
  {group_id: 2, right_id: 58},
  {group_id: 6, right_id: 58},
  {group_id: 2, right_id: 59},
  {group_id: 6, right_id: 59},
  {group_id: 2, right_id: 60},
  {group_id: 6, right_id: 60},
  {group_id: 2, right_id: 61},
  {group_id: 6, right_id: 61},
  {group_id: 2, right_id: 62},
  {group_id: 6, right_id: 62},
  {group_id: 2, right_id: 63},
  {group_id: 6, right_id: 63},
  {group_id: 2, right_id: 64},
  {group_id: 6, right_id: 64},
  {group_id: 2, right_id: 65},
  {group_id: 6, right_id: 65},
  {group_id: 2, right_id: 66},
  {group_id: 6, right_id: 66},
  {group_id: 2, right_id: 67},
  {group_id: 6, right_id: 67},
  {group_id: 2, right_id: 68},
  {group_id: 6, right_id: 68},
  {group_id: 2, right_id: 69},
  {group_id: 6, right_id: 69},
  {group_id: 2, right_id: 70},
  {group_id: 2, right_id: 71},
  {group_id: 2, right_id: 72},
  {group_id: 2, right_id: 73},
  {group_id: 2, right_id: 74},
  {group_id: 2, right_id: 75},
  {group_id: 2, right_id: 76},
  {group_id: 2, right_id: 77},
  {group_id: 2, right_id: 78},
  {group_id: 2, right_id: 79},
  {group_id: 2, right_id: 80},
  {group_id: 2, right_id: 81},
  {group_id: 2, right_id: 82},
  {group_id: 2, right_id: 83},
  {group_id: 2, right_id: 84},
  {group_id: 2, right_id: 85},
  {group_id: 2, right_id: 86},
  {group_id: 2, right_id: 87},
  {group_id: 2, right_id: 88},
  {group_id: 2, right_id: 89},
  {group_id: 2, right_id: 90},
  {group_id: 2, right_id: 91},
  {group_id: 2, right_id: 92},
  {group_id: 2, right_id: 93},
  {group_id: 2, right_id: 94},
  {group_id: 2, right_id: 95},
  {group_id: 2, right_id: 96},
  {group_id: 2, right_id: 97},
  {group_id: 2, right_id: 98},
  {group_id: 2, right_id: 99},
  {group_id: 2, right_id: 100},
  {group_id: 2, right_id: 101},
  {group_id: 2, right_id: 102},
  {group_id: 2, right_id: 103},
  {group_id: 2, right_id: 104},
  {group_id: 2, right_id: 105},
  {group_id: 2, right_id: 106},
  {group_id: 2, right_id: 107},
  {group_id: 2, right_id: 108},
  {group_id: 2, right_id: 109},
  {group_id: 3, right_id: 6},
  {group_id: 3, right_id: 7},
  {group_id: 3, right_id: 9},
  {group_id: 3, right_id: 13},
  {group_id: 3, right_id: 27},
  {group_id: 3, right_id: 28},
  {group_id: 4, right_id: 6},
  {group_id: 4, right_id: 7},
  {group_id: 4, right_id: 9},
  {group_id: 4, right_id: 13},
  {group_id: 4, right_id: 27},
  {group_id: 4, right_id: 28},
  {group_id: 4, right_id: 66},
  {group_id: 4, right_id: 61},
  {group_id: 4, right_id: 50},
  {group_id: 4, right_id: 51},
  {group_id: 1, right_id: 1},
  {group_id: 1, right_id: 2},
  {group_id: 1, right_id: 6},
  {group_id: 1, right_id: 7},
  {group_id: 1, right_id: 9},
  {group_id: 1, right_id: 41},
  {group_id: 1, right_id: 42},
  {group_id: 1, right_id: 45},
  {group_id: 1, right_id: 46},
  {group_id: 1, right_id: 50},
  {group_id: 1, right_id: 51},
  {group_id: 1, right_id: 55},
  {group_id: 1, right_id: 56},
  {group_id: 1, right_id: 90},
  {group_id: 1, right_id: 93},
  {group_id: 1, right_id: 94},
  {group_id: 1, right_id: 91},
  {group_id: 1, right_id: 36},
  {group_id: 1, right_id: 37},
  {group_id: 1, right_id: 60},
  {group_id: 1, right_id: 61},
  {group_id: 1, right_id: 65},
  {group_id: 1, right_id: 66}
])

Position.create(name: 'Developer')

puts 'Running employees_import'

Rake::Task['employees_import'].reenable
Rake::Task['employees_import'].invoke

puts 'Running employees_adds_import'

Rake::Task['employees_adds_import'].reenable
Rake::Task['employees_adds_import'].invoke

# puts 'Running heartbeats_import'
#
# Rake::Task['heartbeats_import'].reenable
# Rake::Task['heartbeats_import'].invoke

puts 'Setting users to role'

Role.create(group_id: 2, rolable_id: 1356, rolable_type: 'Employee')
Role.create(group_id: 2, rolable_id: 2059, rolable_type: 'Employee')
Role.create(group_id: 2, rolable_id: 1236, rolable_type: 'Employee')
Role.create(group_id: 2, rolable_id: 167, rolable_type: 'Employee')
Role.create(group_id: 2, rolable_id: 1130, rolable_type: 'Employee')
Role.create(group_id: 2, rolable_id: 2146, rolable_type: 'Employee')