# implements rights: view_sdmanagers_costcenters, view_sdmanagers_costcenter, update_sdmanagers_costcenter,
#     create_sdmanagers_costcenter, delete_sdmanagers_costcenter, view_sd_locations_managments, delete_sd_locations_managment

module Api
  module V1
  end
end
class Api::V1::SdmanagersCostcentersController < ApplicationController

  before_action :authenticate_request!
  before_action :load_current_user!

  after_action :set_headers

  def index
    if check_right('view_sdmanagers_costcenters')
      sdmanagers_costcenters = SdmanagersCostcenter
       .joins(:employee)
       .select("
          employees.id                                    AS employee_id,
          CONCAT (employees.surname, ' ', employees.name) AS employee_label,
          sdmanagers_costcenters.costcenter_num           AS costcenter_num,
          sdmanagers_costcenters.id                       AS id
       ")
      render json: sdmanagers_costcenters
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def show
    if check_right('view_sdmanagers_costcenter')
      id                    = params[:id]
      sdmanagers_costcenter = SdmanagersCostcenter
        .joins(:employee)
        .select('
          employees.id                          AS employee_id,
          employees.name                        AS name,
          employees.surname                     AS surname,
          sdmanagers_costcenters.costcenter_num AS costcenter_num,
          sdmanagers_costcenters.id             AS id
       ').where(
          'sdmanagers_costcenters.id = ?',
          id
       )

      render json: sdmanagers_costcenter
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def update
    if check_right('update_sdmanagers_costcenter')
      id                    = params[:id]
      sdmanagers_costcenter = SdmanagersCostcenter.find(id)

      if sdmanagers_costcenter.update(sdmanagers_costcenter_params)
        employee = Employee.find_by_id(sdmanagers_costcenter[:employee_id])
        render json: {
          costcenter_num: sdmanagers_costcenter[:costcenter_num],
          employee_id:    sdmanagers_costcenter[:employee_id],
          id:             sdmanagers_costcenter[:id],
          employee_label: "#{employee[:surname]} #{employee[:name]}"
        }
      else
        render json: {
            message: "Not saved"
        }, status: :bad_request
      end
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def create
    if check_right('create_sdmanagers_costcenter')
      allCostcenters = params[:all].to_s.downcase == 'true'
      employee_id    = params[:employee_id].to_i
      if !allCostcenters
        sdmanagers_costcenter = SdmanagersCostcenter.new(sdmanagers_costcenter_params)
        sdmanagers_costcenter.save
      else
        costcenters = Api::V1::SearchController.new.get_all_costcenters()
        sdmanagers_costcenters = SdmanagersCostcenter.where(employee_id: employee_id)
        sdmanagers_costcenters.each do |sdmanagers_costcenter|
          sdmanagers_costcenter.destroy
        end
        costcenters.each do |costcenter_num|
          sc = SdmanagersCostcenter.create!(
              costcenter_num: costcenter_num,
              employee_id:    employee_id
          )
          sc.save
        end
        sdmanagers_costcenter = SdmanagersCostcenter
          .joins(:employee)
          .select("
            employees.id                                    AS employee_id,
            CONCAT (employees.surname, ' ', employees.name) AS employee_label,
            sdmanagers_costcenters.costcenter_num           AS costcenter_num,
            sdmanagers_costcenters.id                       AS id
          ")
          .where("sdmanagers_costcenters.employee_id = ?", employee_id)
      end
      render json: sdmanagers_costcenter
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def destroy
    if check_right('delete_sdmanagers_costcenter')
      employee_id    = params[:employee_id].to_i
      id             = params[:id].to_i
      allCostcenters = employee_id != 0
      if allCostcenters
        sdmanagers_costcenters = SdmanagersCostcenter.where(employee_id: employee_id)
        sdmanagers_costcenters.each do |sdmanagers_costcenter|
          sdmanagers_costcenter.destroy
        end
      else
        sdmanagers_costcenter = SdmanagersCostcenter.find(id)
        sdmanagers_costcenter.destroy
      end
      render json: {
          id:         allCostcenters ? employee_id : id,
          message:    "Sdmanagers_costcenter#{allCostcenters ? 's' : ''} removed"
      }, status: :ok
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def addObjectToLocation
    if check_right('create_sd_locations_managment')
      type        = params[:type].to_s.downcase
      object_id   = params[:object_id]
      location_id = params[:location_id]
      case type
      when 'costcenter'
        result = CostcentersLocation.create!({
          costcenter_num: object_id,
          location_id:    location_id
        })
      when 'employee'
        result = EmployeesLocation.create!({
          employee_id: object_id,
          location_id: location_id
        })
      when 'project'
        result = ProjectsLocation.create!({
          project_id:  object_id,
          location_id: location_id
        })
      else
        result = nil
      end
      if result && result.save
        render json: {
            object: result,
            type:   type
        }, status: :ok
      else
        render json: {
            message: "Not saved"
        }, status: :bad_request
      end
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def removeObjectFromLocation
    if check_right('delete_sd_locations_managment')
      type        = params[:type].to_s.downcase
      object_id   = params[:id].to_i
      location_id = params[:location_id].to_i
      case type
      when 'costcenter'
        object = CostcentersLocation.where('costcenter_num = ? AND location_id = ?', object_id, location_id).first
        unless object.blank?
          object.destroy
        end
      when 'employee'
        object = EmployeesLocation.where('employee_id = ? AND location_id = ?', object_id, location_id).first
        unless object.blank?
          object.destroy
        end
      when 'project'
        object = ProjectsLocation.where('project_id = ? AND location_id = ?', object_id, location_id).first
        unless object.blank?
          object.destroy
        end
      else
        object = nil
      end
      render json: {
          type:      type,
          object_id: object_id,
          message:   "Object removed"
      }, status: :ok
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def getLocationInfo
    if check_right('view_sd_locations_managment')
      location_id = params[:id].to_i
      employeeLocations    = EmployeesLocation.joins(:employee).where('location_id = ?', location_id)
        .select("
          employees.name                  AS name,
          employees.surname               AS surname,
          employees.login                 AS login,
          employees.id                    AS id,
          employees_locations.id          AS el_id,
          employees_locations.location_id AS location_id
        ")
      costcentersLocations = CostcentersLocation.where('location_id = ?', location_id)
      projectsLocations    = map_projects_to_locations(
          ProjectsLocation.select("
          projects_locations.project_id  AS id,
          projects_locations.location_id AS location_id
        ")
      )
      render json: {
        employeeLocations:    employeeLocations,
        costcentersLocations: costcentersLocations,
        projectsLocations:    projectsLocations
      }
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def getLocationsInfo
    if check_right('view_sd_locations_managments')
      locations_info = nil
      locations_info = Location.find_by_sql("
          WITH ds_places_allowed AS (
            SELECT COUNT(*)     AS count_all,
                   locations.id AS location_id,
                   concat_ws (', ', cities.name, offices.name, buildings.name, floors.name) AS address,
                   floors.id    AS floor_id
              FROM object_items
             INNER JOIN locations ON locations.id = object_items.location_id
              LEFT JOIN floors    ON floors.id    = object_items.floor_id
              LEFT JOIN buildings ON buildings.id = floors.building_id
              LEFT JOIN offices   ON offices.id   = buildings.office_id
              LEFT JOIN cities    ON cities.id    = offices.city_id
             WHERE object_items.status = 'SHARING' AND
                   object_items.costcenter_num IN (
                    SELECT sc.costcenter_num
                      FROM sdmanagers_costcenters sc
                     WHERE sc.employee_id = #{@current_user.id}
                   )
             GROUP BY object_items.location_id,
                      locations.id,
                      concat_ws (', ', cities.name, offices.name, buildings.name, floors.name),
                      floors.id
          )
        SELECT
               l1.id   AS id,
               l1.name AS name,
               (
                SELECT dpa.count_all
                  FROM ds_places_allowed dpa
                 WHERE dpa.location_id = l1.id
                 LIMIT 1
               )       AS number_ds_places,
               (
                SELECT dpa.address
                  FROM ds_places_allowed dpa
                 WHERE dpa.location_id = l1.id
                 LIMIT 1
               )       AS address,
               (
                SELECT dpa.floor_id
                  FROM ds_places_allowed dpa
                 WHERE dpa.location_id = l1.id
                 LIMIT 1
               )       AS floor_id
          FROM locations l1
         WHERE (
                SELECT dpa.count_all
                  FROM ds_places_allowed dpa
                 WHERE dpa.location_id = l1.id
                 LIMIT 1
               ) IS NOT NULL
      ")

      render json: locations_info
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def map_projects_to_locations(projects_locations)
    # projects = []
    # unless projects_locations.blank?
    #   uri = URI "tv/projects/"
    #   res = nil
    #   Net::HTTP.start(uri.host, uri.port,
    #                   :use_ssl => uri.scheme == 'https',
    #                   :verify_mode => OpenSSL::SSL::VERIFY_NONE) do |http|
    #     request = Net::HTTP::Get.new uri
    #     request['Authorization'] = "Bearer " + TV_TOKEN
    #     request['verify_mode'] = OpenSSL::SSL::VERIFY_NONE
    #     res = http.request request # Net::HTTPResponse object
    #   end
    #   begin
    #     response = JSON.parse(res.body)
    #     response.each do |item|
    #       number = item['id'].to_i
    #       name = item['name']
    #       projects_locations.each do |projects_location|
    #         if number == projects_location['id'].to_i
    #           projects.push({
    #             'name' => name,
    #             'id' => number,
    #             'location_id' => projects_location['location_id']
    #           })
    #         end
    #       end
    #     end
    #     projects
    #   rescue
    #     projects
    #   end
    # end
    Rails.configuration.project_locations
  end

  def sdmanagers_costcenter_params
    params.require(:sdmanagers_costcenter).permit(:costcenter_num, :employee_id)
  end

  protected

  def set_headers
    response.set_header('Access-Control-Allow-Origin','*')
  end

end