# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_12_03_054567) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "available_dates_for_parkings", force: :cascade do |t|
    t.datetime "date_start", null: false
    t.datetime "date_end", null: false
    t.bigint "object_item_id"
    t.index ["object_item_id"], name: "index_available_dates_for_parkings_on_object_item_id"
  end

  create_table "bookings", force: :cascade do |t|
    t.datetime "book_from", null: false
    t.datetime "book_to", null: false
    t.string "comment"
    t.bigint "employee_id"
    t.bigint "object_item_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "parking"
    t.index ["employee_id"], name: "index_bookings_on_employee_id"
    t.index ["object_item_id"], name: "index_bookings_on_object_item_id"
  end

  create_table "buildings", force: :cascade do |t|
    t.string "name"
    t.string "short_name"
    t.string "coords"
    t.boolean "active", default: true
    t.float "ord"
    t.bigint "office_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["office_id"], name: "index_buildings_on_office_id"
  end

  create_table "cities", force: :cascade do |t|
    t.string "name"
    t.string "short_name"
    t.float "ord"
    t.boolean "active", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "contracts", force: :cascade do |t|
    t.integer "office_id"
    t.string "name"
    t.float "price"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "company"
  end

  create_table "costcenters_locations", force: :cascade do |t|
    t.bigint "costcenter_num", null: false
    t.bigint "location_id", null: false
    t.index ["location_id"], name: "index_costcenters_locations_on_location_id"
  end

  create_table "employees", force: :cascade do |t|
    t.string "name"
    t.string "surname"
    t.string "patronymic"
    t.string "grade"
    t.string "login", null: false
    t.string "email", null: false
    t.string "birthday"
    t.integer "costcenter_num"
    t.string "costcenter_name"
    t.string "status"
    t.string "gender", null: false
    t.string "unit"
    t.boolean "active", default: true
    t.bigint "city_id"
    t.bigint "office_id"
    t.bigint "position_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "work_type", limit: 1
    t.index ["city_id"], name: "index_employees_on_city_id"
    t.index ["office_id"], name: "index_employees_on_office_id"
    t.index ["position_id"], name: "index_employees_on_position_id"
  end

  create_table "employees_adds", force: :cascade do |t|
    t.string "phone"
    t.string "mobile"
    t.string "info"
    t.string "education"
    t.bigint "employee_id"
    t.index ["employee_id"], name: "index_employees_adds_on_employee_id"
  end

  create_table "employees_locations", force: :cascade do |t|
    t.bigint "employee_id", null: false
    t.bigint "location_id", null: false
    t.index ["location_id"], name: "index_employees_locations_on_location_id"
  end

  create_table "floor_blocks", force: :cascade do |t|
    t.bigint "floor_id"
    t.bigint "employee_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["employee_id"], name: "index_floor_blocks_on_employee_id"
    t.index ["floor_id"], name: "index_floor_blocks_on_floor_id"
  end

  create_table "floors", force: :cascade do |t|
    t.string "name"
    t.string "short_name"
    t.integer "ord"
    t.boolean "active", default: true
    t.bigint "building_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["building_id"], name: "index_floors_on_building_id"
  end

  create_table "floors_configs", force: :cascade do |t|
    t.string "plan"
    t.string "preview"
    t.string "parameters"
    t.bigint "floor_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["floor_id"], name: "index_floors_configs_on_floor_id"
  end

  create_table "groups", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "groups_rights", force: :cascade do |t|
    t.bigint "group_id"
    t.bigint "right_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["group_id"], name: "index_groups_rights_on_group_id"
    t.index ["right_id"], name: "index_groups_rights_on_right_id"
  end

  create_table "heartbeats", force: :cascade do |t|
    t.string "hb_type"
    t.string "administrator"
    t.string "employee"
    t.string "coord"
    t.string "login"
    t.integer "bc_type"
    t.bigint "city_id"
    t.bigint "office_id"
    t.bigint "building_id"
    t.bigint "floor_id"
    t.bigint "object_item_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["building_id"], name: "index_heartbeats_on_building_id"
    t.index ["city_id"], name: "index_heartbeats_on_city_id"
    t.index ["floor_id"], name: "index_heartbeats_on_floor_id"
    t.index ["object_item_id"], name: "index_heartbeats_on_object_item_id"
    t.index ["office_id"], name: "index_heartbeats_on_office_id"
  end

  create_table "location_types", force: :cascade do |t|
    t.string "name"
    t.string "bg"
    t.boolean "active", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "locations", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "costcenter"
    t.string "dots"
    t.integer "top"
    t.integer "left"
    t.integer "costcenter_num"
    t.string "is_real", default: "t", null: false
    t.bigint "floor_id"
    t.bigint "location_type_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name_position"
    t.index ["floor_id"], name: "index_locations_on_floor_id"
    t.index ["location_type_id"], name: "index_locations_on_location_type_id"
  end

  create_table "meta_fields", force: :cascade do |t|
    t.string "name"
    t.bigint "meta_type_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["meta_type_id"], name: "index_meta_fields_on_meta_type_id"
  end

  create_table "meta_maps", force: :cascade do |t|
    t.string "entity_type"
    t.string "entity_subtype_id"
    t.bigint "meta_field_id"
    t.boolean "active", default: true
    t.boolean "show_in_management", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["meta_field_id"], name: "index_meta_maps_on_meta_field_id"
  end

  create_table "meta_types", force: :cascade do |t|
    t.string "name"
    t.string "metatype"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "meta_values", force: :cascade do |t|
    t.text "value"
    t.bigint "meta_field_id"
    t.string "metable_type"
    t.bigint "metable_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["meta_field_id"], name: "index_meta_values_on_meta_field_id"
    t.index ["metable_type", "metable_id"], name: "index_meta_values_on_metable_type_and_metable_id"
  end

  create_table "object_items", force: :cascade do |t|
    t.string "name"
    t.string "comment"
    t.integer "angle"
    t.integer "top"
    t.integer "left"
    t.integer "width"
    t.integer "height"
    t.integer "scale", default: 100, null: false
    t.string "status"
    t.integer "costcenter_num"
    t.bigint "employee_id"
    t.bigint "floor_id"
    t.bigint "object_type_id"
    t.bigint "location_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["employee_id"], name: "index_object_items_on_employee_id"
    t.index ["floor_id"], name: "index_object_items_on_floor_id"
    t.index ["location_id"], name: "index_object_items_on_location_id"
    t.index ["object_type_id"], name: "index_object_items_on_object_type_id"
  end

  create_table "object_types", force: :cascade do |t|
    t.string "name"
    t.string "icon"
    t.boolean "active", default: true
    t.boolean "rotatable", default: false
    t.boolean "resizable", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "offices", force: :cascade do |t|
    t.string "name"
    t.string "short_name"
    t.string "address"
    t.string "image"
    t.float "ord"
    t.boolean "active", default: true
    t.bigint "city_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["city_id"], name: "index_offices_on_city_id"
  end

  create_table "positions", force: :cascade do |t|
    t.string "name"
  end

  create_table "projects_locations", force: :cascade do |t|
    t.bigint "project_id", null: false
    t.bigint "location_id", null: false
    t.index ["location_id"], name: "index_projects_locations_on_location_id"
  end

  create_table "rights", force: :cascade do |t|
    t.string "name"
    t.string "machine_name"
    t.string "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "roles", force: :cascade do |t|
    t.bigint "group_id"
    t.string "rolable_type"
    t.bigint "rolable_id"
    t.index ["group_id"], name: "index_roles_on_group_id"
    t.index ["rolable_type", "rolable_id"], name: "index_roles_on_rolable_type_and_rolable_id"
  end

  create_table "sdmanagers_costcenters", force: :cascade do |t|
    t.bigint "costcenter_num", null: false
    t.bigint "employee_id"
    t.index ["employee_id"], name: "index_sdmanagers_costcenters_on_employee_id"
  end

  add_foreign_key "object_items", "locations"
end
