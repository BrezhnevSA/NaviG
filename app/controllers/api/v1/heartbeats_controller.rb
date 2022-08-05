# implements rights: view_cities, view_one_city, update_city, create_city, delete_city

module Api
  module V1
  end
end
class Api::V1::HeartbeatsController < ApplicationController

  before_action :authenticate_request!

  after_action :set_headers

  def index
    if check_right('view_heartbeats')
      sort_field   = params[:sorting].blank? ? '' : params[:sorting][:field]
      sort_order   = params[:sorting].blank? ? '' : params[:sorting][:order]
      filters      = params[:filters].blank? ? [] : params[:filters]
      page         = params[:page].to_i
      ppp          = params[:per_page].to_i
      query_filter = ""
      date_from    = ""
      date_to      = ""
      filters = filters.collect { |filter|
        case filter["field"]
        when "dateFrom"
          date_from = filter["value"].blank? ? "" : filter["value"]
          nil
        when "dateTo"
          date_to = filter["value"].blank? ? "" : filter["value"]
          nil
        else
          filter
        end
      }.select {|filter| !filter.blank? }

      filters.map.with_index { |filter, index|
        column = case filter["field"]
           when "hb_types"
             " heartbeats.hb_type IN (#{filter["value"].map { |i| "'" + i.to_s + "'" }.join(",")}) "
           else
             " #{filter["field"]} LIKE '%#{filter["value"]}%' "
           end
        if index < (filters.length - 1) && filters.length > 3 && !column.blank?
          query_filter += column + " AND "
        elsif index == filters.length - 1
          query_filter += column
        end
      }

      if !date_from.blank? && !date_to.blank?
        if filters.length > 0
          query_filter += " AND " + " ( heartbeats.created_at >= '#{date_from}' AND heartbeats.created_at <= '#{date_to}' ) "
        else
          query_filter += " ( heartbeats.created_at >= '#{date_from}' AND heartbeats.created_at <= '#{date_to}' ) "
        end
      elsif !date_from.blank? && date_to.blank?
        if filters.length > 0
          query_filter += " AND " + " ( heartbeats.created_at >= '#{date_from}' ) "
        else
          query_filter += " ( heartbeats.created_at >= '#{date_from}' ) "
        end
      elsif date_from.blank? && !date_to.blank?
        if filters.length > 0
          query_filter += " AND " + " ( heartbeats.created_at <= '#{date_to}' ) "
        else
          query_filter += " ( heartbeats.created_at <= '#{date_to}' ) "
        end
      end

      if page === 0 && ppp === 0
        heartbeats = Heartbeat.all
        count = heartbeats.to_a.count
      else
        count = Heartbeat.select("*").where(query_filter).to_a.count
        if sort_field && sort_order
          heartbeats = Heartbeat.select("*")
            .where(query_filter).order("#{sort_field} #{sort_order}")
            .limit(ppp).offset(ppp * (page - 1))
        else
          heartbeats = Heartbeat.select("*")
            .where(query_filter).limit(ppp).offset(ppp * (page - 1))
        end
      end
      render json: { heartbeats: heartbeats, count: count }
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  # add record to activity log
  def create (hb_type, employee_id, object_item_id, administrator_id, reservation = "")
    employee = nil
    if employee_id.to_i > 0
      employee = Employee.find(employee_id)
    end
    administrator = nil
    if administrator_id.to_i > 0
      administrator = Employee.find(administrator_id)
    end

    object_item = ObjectItem.joins(:floor => {:building => {:office => :city}}).select("
      offices.name      AS office_name,
      offices.id        AS office_id,
      buildings.name    AS building_name,
      buildings.id      AS building_id,
      cities.name       AS city_name,
      cities.id         AS city_id,
      floors.name       AS floor_name,
      floors.id         AS floor_id,
      object_items.name AS place_name,
      object_items.id   AS id
    ").find(object_item_id)
    # set full name of place with address
    object_item_name = "#{object_item.city_name}, #{object_item.building_name}, #{object_item.office_name}, #{object_item.floor_name}, #{object_item.place_name}"
    employee_name = nil
    login = nil
    unless employee.nil?
      employee_name = "#{employee.name} #{employee.surname}"
      login = employee.login
    else
      employee_name = reservation.to_s
    end
    administrator_name = 'System'
    unless administrator.nil?
      administrator_name = "#{administrator.name} #{administrator.surname}"
    end
    @heartbeat = Heartbeat.create!({
      'hb_type'        => hb_type,
      'employee'       => employee_name,
      'coord'          => object_item.place_name,
      'administrator'  => administrator_name,
      'bc_type'        => nil,
      'login'          => login,
      'city_id'        => object_item.city_id,
      'office_id'      => object_item.office_id,
      'building_id'    => object_item.building_id,
      'floor_id'       => object_item.floor_id,
      'object_item_id' => object_item.id
    })

    if @heartbeat.save
      @heartbeat
    else
      false
    end
  end

  def heartbeat_params
    params.require(:heartbeat).permit(:id, :hb_type, :administrator, :employee, :coord, :login, :bc_type)
  end

  protected

  def set_headers
    response.set_header('Access-Control-Allow-Origin','*')
  end

end