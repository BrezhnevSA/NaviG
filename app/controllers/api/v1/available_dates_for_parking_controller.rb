# implements rights: view_all_bookings, set_booking_on_the_same_time, delete_all_bookings

module Api
  module V1
  end
end
class Api::V1::AvailableDatesForParkingController < ApplicationController

  before_action :authenticate_request!

  after_action :set_headers

  def index
    render json: {
      dates: AvailableDatesForParking.select('*')
       .where("
        available_dates_for_parkings.date_start >= current_date OR
        available_dates_for_parkings.date_end >= current_date
       ")
    }
  end

  def create
    if check_right('add_available_dates_for_parking')
      object_item_id = params[:object_item_id]
      date_start     = params[:date_start]
      date_end       = params[:date_end]
      if get_employee_id_from_meta(object_item_id)["id"].to_i == @current_user.id || check_right('share_dates_for_all_parking_places')
        if (Date.parse(date_end) - Date.parse(date_start)).to_i >= 0
        available_dates = AvailableDatesForParking.new(
            object_item_id: object_item_id,
            date_start:     date_start,
            date_end:       date_end
        )
        if available_dates.save
          employee_main = Employee.find(Api::V1::AvailableDatesForParkingController.new.get_employee_id_from_meta(object_item_id)["id"].to_i)
          parking_place = ObjectItem.find(object_item_id)
          send_notification(
            parking_place,
            "Доступны новые даты для бронирования парковочного места #{parking_place[:name]}",
            "Добрый день, #{employee_main[:surname]} #{employee_main[:name]} открыл#{employee_main[:gender] == 'ж' ? 'а' : '' } даты для бронирования парковочного места #{parking_place[:name]} на период дат #{Date.parse(date_start).strftime("%d.%m.%Y")} - #{Date.parse(date_end).strftime("%d.%m.%Y")}")
        else
          render json: {
            message: "can't save dates"
          }, status: 702
        end
        render json: available_dates
        else
          render json: {
            message: "date_start > date_end"
          }, status: 701
        end
      else
        render json: {
          message: "you can't manage dates for this place"
        }, status: 700
      end
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def update
    if check_right('update_available_dates_for_parking')
      object_item_id = params[:dates][:object_item_id]
      date_start     = params[:dates][:date_start]
      date_end       = params[:dates][:date_end]
      id             = params[:dates][:id]
      if get_employee_id_from_meta(object_item_id)["id"].to_i == @current_user.id || check_right('share_dates_for_all_parking_places')
        available_dates = AvailableDatesForParking.find(id.to_i)
        date_start_old = available_dates.date_start
        date_end_old = available_dates.date_end
        available_dates.date_start = date_start
        available_dates.date_end = date_end
        if available_dates.save
          delete_bookings(object_item_id, date_start, date_end, date_start_old, date_end_old)
          employee_main = Employee.find(Api::V1::AvailableDatesForParkingController.new.get_employee_id_from_meta(object_item_id)["id"].to_i)
          parking_place = ObjectItem.find(object_item_id)
          send_notification(
            parking_place,
            "Обновлены даты для бронирования парковочного места #{parking_place[:name]}",
            "Добрый день, #{employee_main[:surname]} #{employee_main[:name]} изменил#{employee_main[:gender] == 'ж' ? 'а' : '' } даты для бронирования парковочного места #{parking_place[:name]} с #{date_start_old.strftime("%d.%m.%Y")} - #{date_end_old.strftime("%d.%m.%Y")} на #{Date.parse(date_start).strftime("%d.%m.%Y")} - #{Date.parse(date_end).strftime("%d.%m.%Y")}")
        else
          render json: {
            message: "can't save dates"
          }, status: 702
        end
        render json: available_dates
      else
        render json: {
          message: "you can't manage dates for this place"
        }, status: 700
      end
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def show
    render json: AvailableDatesForParking.find(params[:id])
  end

  def destroy
    if check_right('delete_available_dates_for_parking')
      available_dates = AvailableDatesForParking.find(params[:id])
      object_item_id = available_dates.object_item_id
      date_start = available_dates.date_start
      date_end = available_dates.date_end
      if get_employee_id_from_meta(available_dates.object_item_id)["id"].to_i == @current_user.id || check_right('share_dates_for_all_parking_places')
        if available_dates.destroy
          parking_place = ObjectItem.find(object_item_id)
          delete_bookings(object_item_id, date_start, date_end)
          send_notification(
            parking_place,
            "Удалены даты для бронирования парковочного места #{parking_place[:name]}",
            "Добрый день, удалены даты для бронирования парковочного места #{parking_place[:name]} на период #{date_start.strftime("%d.%m.%Y")} - #{date_end.strftime("%d.%m.%Y")}")
        end
        render json: {
          message: "Available dates removed",
          id:      params[:id]
        }, status: :ok
      else
        render json: {
          message: "you can't manage dates for this place"
        }, status: 700
      end
    else
      render json: {
        message: "Access denied!"
      }, status: :unauthorized
    end
  end

  def get_employee_id_from_meta(object_item_id)
    ObjectItem.select("meta_values.value as id").joins("
      LEFT JOIN meta_values ON meta_values.meta_field_id = #{Rails.configuration.employee_sd_id}
                           AND metable_id = #{object_item_id}
                           AND metable_type = 'ObjectItem'
    ").where("object_items.id = #{object_item_id}").first
  end

  protected

  def delete_bookings(object_item_id, date_start_new, date_end_new, date_start_old=nil, date_end_old=nil)
    Booking.select("bookings.id as id")
      .where("
        bookings.object_item_id = (:oi_id) AND
        #{!date_start_old.blank? && !date_end_old.blank? ? "
        bookings.book_from >= (:start_old) AND
        bookings.book_from <= (:end_old)   AND
        bookings.book_to >= (:start_old)   AND
        bookings.book_to <= (:end_old)     AND " : ""}
        (bookings.book_from < (:start_new) OR
        bookings.book_from > (:end_new)    OR
        bookings.book_to < (:start_new)    OR
        bookings.book_to > (:end_new))",
        {
          oi_id: object_item_id,
          start_old: date_start_old,
          end_old: date_end_old,
          start_new: date_start_new,
          end_new: date_end_new
        })
     .destroy_all
  end

  def set_headers
    response.set_header('Access-Control-Allow-Origin','*')
  end

  def send_notification(parking_place, text_subject, text_body)
    # Employee.select("
    #     employees.email as email,
    #     employees.surname as surname,
    #     employees.name as name")
    #   .joins("LEFT JOIN employees_locations ON employees_locations.employee_id = employees.id")
    #   .where("employees_locations.location_id = #{parking_place[:location_id]}")
    #   .each do |employee|
    #   ActionMailer::Base.mail(
    #     from: "RU_navi_support@internal.telekom.com",
    #     to: employee[:email],
    #     subject: text_subject,
    #     body: text_body
    #   ).deliver
    # end
  end

end
