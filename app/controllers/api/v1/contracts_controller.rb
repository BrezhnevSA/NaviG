# implements rights: view_contracts, view_one_contract, update_contract, add_contract, delete_contract

module Api
  module V1
  end
end
class Api::V1::ContractsController < ApplicationController

  before_action :authenticate_request!

  after_action :set_headers

  def index
    if check_right('view_contracts')
      sort_field   = params[:sorting].blank? ? '' : params[:sorting][:field]
      sort_order   = params[:sorting].blank? ? '' : params[:sorting][:order]
      filters      = params[:filters].blank? ? [] : params[:filters]
      page         = params[:page].to_i
      ppp          = params[:per_page].to_i
      query_filter = ""
      locations_filter_values = nil

      filters = filters.collect { |filter|
        case filter["field"]
        when "locations"
          locations_filter_values = filter["value"].blank? ? "" : filter["value"]
          nil
        else
          filter
        end
      }.select {|filter| !filter.blank? }

      filters.map.with_index { |filter, index|
        column = case filter["field"]
                 when "id"
                   " contracts.id IN (#{filter["value"].map { |i| "'" + i.to_s + "'" }.join(",")}) "
                 when "name"
                   " contracts.name IN (#{filter["value"].map { |i| "'" + i.to_s + "'" }.join(",")}) "
                 when 'office_ids'
                   query = " contracts.office_id IN (#{filter["value"].map { |i| "'" + i.to_s + "'" }.join(",")}) "
                 else
                   " #{filter["field"]} LIKE '%#{filter["value"]}%' "
                 end
        if index < (filters.length - 1) && filters.length > 3 && !column.blank?
          query_filter += column + " AND "
        elsif index == filters.length - 1
          query_filter += column
        end
      }

      unless locations_filter_values.blank?
        where_clause = ""
        locations_filter_values.each do |locations_filter_value|
          last_element = locations_filter_value == locations_filter_values.last
          where_clause += " (#{locations_filter_value} IN (
            SELECT locations.id
              FROM locations
              lEFT JOIN meta_values ON meta_values.metable_id = locations.id
                                   AND meta_values.metable_type = 'Location'
                                   AND meta_values.meta_field_id = #{Rails.configuration.contract_id}
             WHERE meta_values.value IS NOT NULL
               AND meta_values.value = contracts.id::varchar
          )) #{last_element ? "" : " OR "} "
        end
        query_filter += "#{filters.length > 0 ? " AND " : ""} (#{where_clause}) "
      end

      select_query = "
        contracts.*,
        (
          SELECT string_agg(locations.name, ',') AS locations_names
            FROM locations
            lEFT JOIN meta_values ON meta_values.metable_id = locations.id
                                 AND meta_values.metable_type = 'Location'
                                 AND meta_values.meta_field_id = #{Rails.configuration.contract_id}
           WHERE meta_values.value IS NOT NULL
             AND meta_values.value = contracts.id::varchar
        )
      "

      if page === 0 && ppp === 0
        contracts = Contract.select(select_query).where(query_filter)
        count = contracts.to_a.count
      else
        count = Contract.select(select_query).where(query_filter).to_a.count
        if sort_field && sort_order
          contracts = Contract.select(select_query)
                              .where(query_filter).order("#{sort_field} #{sort_order}")
                              .limit(ppp).offset(ppp * (page - 1))
        else
          contracts = Contract.select(select_query)
                              .where(query_filter).limit(ppp).offset(ppp * (page - 1))
        end
      end
      render json: { contracts: contracts, count: count }
    else
      render json: {
          message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def show
    if check_right('view_one_contract')
      contract = Contract.find(params[:id])
      locations = Location.select("
      locations.id as id,
      locations.*,
      (
        SELECT meta_values.value::double precision
          FROM meta_values
         INNER JOIN locations l2 ON l2.id = meta_values.metable_id
                                AND meta_values.metable_type = 'Location'
                                AND meta_values.meta_field_id = #{Rails.configuration.square_id}
         WHERE l2.id = locations.id
      ) AS square,
      locations.name || ', ' || floors.name AS preview
      ").joins("
        LEFT JOIN meta_values ON meta_values.metable_id = locations.id
         AND meta_values.metable_type = 'Location'
         AND meta_values.meta_field_id = #{Rails.configuration.contract_id}
        LEFT JOIN floors ON floors.id = locations.floor_id
      ").where(" meta_values.value IS NOT NULL AND meta_values.value = #{contract.id}::varchar")
      render json: {contract: contract, locations: locations}
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def update
    if check_right('update_contract') && check_right('update_contract_reference')
      contract = Contract.find(params[:id])
      locations = params[:locations]
      if contract.update(contract_params)
        render json: {contract: contract, locations: Api::V1::MetaValuesController.new.update_contract_meta(contract.id, locations, params[:contract][:company])}
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
    if check_right('add_contract')
      contract = Contract.new(contract_params)

      if contract.save
        render json: contract
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

  def destroy
    if check_right('delete_contract')
      Api::V1::MetaValuesController.new.delete_contract_reference(params[:id])
      contract = Contract.find(params[:id])
      MetaValue.where("
            meta_values.metable_type = 'Location'
        AND meta_values.meta_field_id = '#{Rails.configuration.company_id}'
      ").each do |meta|
        meta.destroy
      end
      contract.destroy

      render json: {
        id: params[:id],
        message: "Contract removed"
      }, status: :ok
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def contract_params
    params.require(:contract).permit(:office_id, :name, :price, :company)
  end

  protected

  def set_headers
    response.set_header('Access-Control-Allow-Origin','*')
  end

end