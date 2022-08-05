# implements rights: view_employees, view_one_employee, update_employee, update_own_employee

module Api
    module V1
    end
end
class Api::V1::EmployeesController < ApplicationController

    before_action :authenticate_request!

    after_action :set_headers

    def index
        if check_right('view_employees') && !check_right('for_test_user_only')
            employees = Employee.all

            render json: employees
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def show
        if check_right('view_one_employee') && !check_right('for_test_user_only') ||
           check_right('for_test_user_only') && params[:id].to_i == Rails.configuration.test_employee_id
            employee_data = get_full_employee_info(params[:id])

            if file_dir_or_symlink_exists?("public/img/userpics/#{params[:id]}.png")
                employee_data["img"] = "/img/userpics/#{params[:id]}.png"
            else
                employee_data["img"] = nil
            end

            render json: employee_data
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end
    
    # update additional info for current user
    def update_own_add(eid, data)
        EmployeesAddsController.new.update_own(eid, data)
    end

    def update
        if check_right('update_employee') || (check_right('update_own_adds') && (@current_user.id === params[:id].to_i))
            employee_add = EmployeesAdd.where('employee_id = (?)', params[:id]).first

            if params[:employee][:phone].present?
                phone = params[:employee][:phone]
            else
                phone = nil
            end

            if params[:employee][:mobile].present?
                mobile = params[:employee][:mobile]
            else
                mobile = nil
            end

            if params[:employee][:info].present?
                info = params[:employee][:info]
            else
                info = nil
            end

            if params[:employee][:education].present?
                education = params[:employee][:education]
            else
                education = nil
            end

            # save avatar
            if params[:image].blank? && params[:delete_image].to_s.downcase == 'true'
                id = params[:id]
                unless id.blank?
                    File.delete(Rails.root.join('public', 'img', 'userpics', "#{id}.png")) if File.exist?(Rails.root.join('public', 'img', 'userpics', "#{id}.png"))
                end
            elsif !params[:image].blank?
                id = params[:id]
                unless id.blank?
                    image_data = Base64.decode64(params[:image]['data:image/png;base64,'.length .. -1])
                    File.open(Rails.root.join('public', 'img', 'userpics', "#{id}.png"), 'wb') do |f|
                        f.write(image_data)
                    end
                end
            end

            employee_add_updated = EmployeesAdd.update(employee_add.id, {
                phone: phone,
                mobile: mobile,
                info: info,
                education: education
            })

            render json: get_full_employee_info(params[:id])
        else
            render json: {
                message: "Access denied!"
            }, status: :unauthorized
        end
    end

    def get_full_employee_info(id)
        # TODO: fix joins
        employee_data = Employee.joins(:employees_adds)
            .joins('LEFT OUTER JOIN object_items ON object_items.employee_id = employees.id ')
            .left_outer_joins(:position)
            .where('employees.id = (?)',
                id)
            .select("
                employees.id as employee_id,
                employees.*,
                employees_adds.phone,
                employees_adds.mobile,
                employees_adds.info,
                employees_adds.education,
                object_items.id as object_item_id,
                object_items.floor_id as floor_id,
                positions.name as position_name
            ").first

        # get projects by login
        if employee_data.login == 'chatbot'
            projects = []
        else
            projects = Api::V1::SearchController.new.get_projects_by_login(employee_data.login)
        end
        # projects = []

        # get CC name
        costcenters = ask_centra_for :costcenters, attributes: 'number,name,owner'
        cc_name = ''
        current_cc = costcenters.select {|cc| cc["attributes"]["number"] == employee_data.costcenter_num }.first

        unless current_cc.nil?
            cc_name = current_cc["attributes"]["name"]
        end
        unless employee_data.object_item_id.blank?
            floor = Floor.where(id: employee_data.floor_id).first
            building = Building.where(id: floor[:building_id]).first
            office = Office.where(id: building[:office_id]).first
            city = City.where(id: office[:city_id]).first
        end
        item = {}
        item["id"]              = employee_data.id
        item["name"]            = employee_data.name
        item["surname"]         = employee_data.surname
        item["patronymic"]      = employee_data.patronymic
        item["grade"]           = employee_data.grade
        item["login"]           = employee_data.login
        item["email"]           = employee_data.email
        item["birthday"]        = employee_data.birthday
        item["costcenter_num"]  = employee_data.costcenter_num
        item["work_type"]       = employee_data.work_type
        item["costcenter_name"] = cc_name
        item["status"]          = employee_data.status
        item["gender"]          = employee_data.gender
        item["unit"]            = employee_data.unit
        item["active"]          = employee_data.active
        item["city_id"]         = employee_data.city_id
        item["office_id"]       = employee_data.office_id
        item["object_item_id"]  = employee_data.object_item_id
        item["position_id"]     = employee_data.position_id
        item["created_at"]      = employee_data.created_at
        item["updated_at"]      = employee_data.updated_at
        item["employee_id"]     = employee_data.employee_id
        item["phone"]           = employee_data.phone
        item["mobile"]          = employee_data.mobile
        item["info"]            = employee_data.info
        item["education"]       = employee_data.education
        item["city_name"]       = city.blank? ? "" : city.name
        item["office_name"]     = office.blank? ? "" : office.name
        item["building_name"]   = building.blank? ? "" : building.name
        item["floor_name"]      = floor.blank? ? "" : floor.name
        item["position_name"]   = employee_data.position_name
        item["img_url"]         = "/img/userpics/default.png"
        item["projects"]        = projects
        item["place"]           = get_employee_place(employee_data.id)
        if file_dir_or_symlink_exists?("img/userpics/#{id}.png")
            item["img_url"] = "/img/userpics/#{id}.png"
        end
        item
    end

    def file_dir_or_symlink_exists?(path_to_file)
        File.exist?(Rails.root.join('public', path_to_file)) || File.symlink?(Rails.root.join('public', path_to_file))
    end

    def get_employee_place(id)
        booking = Booking.select('
            bookings.id             AS id,
            bookings.book_from      AS book_from,
            bookings.book_to        AS book_to,
            bookings.object_item_id AS object_item_id,
            bookings.comment        AS comment,
            employees.id            AS employee_id')
            .joins(:employee)
            .where('employee_id = ? AND book_from <= ? AND book_to >= ?',
                id, DateTime.now.end_of_day, DateTime.now.end_of_day).first

        if booking.nil?
            place = ObjectItem.select("object_items.*, offices.id as office_id ")
                .joins(:floor => {:building => {:office => :city}})
                .where(employee: id).first
        else
            place = ObjectItem.select("object_items.*, offices.id as office_id ")
                .joins(:floor => {:building => {:office => :city}})
                .where("object_items.id = #{booking.object_item_id}").first
        end
        
        place
    end

    def destroy
        if check_right('delete_employee')
            employee = Employee.find(params[:id])
            employee.destroy

            render json: {
              id: params[:id].to_i,
              message: "Employee removed"
            }, status: :ok
        else
            render json: {
              message: "Access denied!"
            }, status: :unauthorized
        end
    end

    protected

    def set_headers
        response.set_header('Access-Control-Allow-Origin','*')
    end

end