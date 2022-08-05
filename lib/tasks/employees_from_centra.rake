
desc 'Import employees from centra'

require 'net/http'
require 'json'
require 'openssl'

namespace :employees_from_centra do
  task run: :environment do
    error_create_emp_counter = 0
    error_create_emp_add_new = 0
    error_update_emp_counter = 0
    error_create_emp_add_existed = 0
    puts "getting employees from centra"
    employees_new = JSON.parse(employees_centra)['data']
    puts "successfully get employees from centra"
    puts "getting work types from t-vac"
    employees_wt = JSON.parse(employees_work_type)
    puts "successfully get work types from t-vac"
    employees_old = Employee.all
    employees_old.each do |emp|
      emp_not_need_to_delete = employees_new.detect {|e| e['id'].to_i == emp['id'].to_i}
      # delete dismissed employee or employee that not exists in centra
      if emp_not_need_to_delete.blank? || emp_not_need_to_delete['attributes']['status'].to_i == 0
        puts "delete employee with full name = #{emp['surname']} #{emp['name']} #{emp['patronymic']} and id = #{emp['id']}"
        emp_del = Employee.find(emp['id'].to_i)
        role_del = Role.where("roles.rolable_id = #{emp['id'].to_i}")
        # set desk to reserved
        place = ObjectItem.where(employee: emp_del.id).first
        unless place.nil?
          four_nums = emp_del.costcenter_num / 1000
          costcenter_new = four_nums == 3581 ? 3581000 : four_nums == 2583 ? 2583000 : emp_del.costcenter_num
          ObjectItem.update(place.id, {
            :status         => 'RESERVED',
            :costcenter_num => costcenter_new,
            :employee_id    => nil,
          })
          Api::V1::HeartbeatsController.new.create('removing', emp['id'].to_i, place.id, nil)
        end
        role_del.each do |item|
          item.destroy
        end
        emp_del.destroy
      end
    end
    employees_new.each do |emp|
      if emp['attributes']['status'].to_i != 0 # without status 0 - dismissed
        emp_old = employees_old.detect {|e| e['id'].to_i == emp['id'].to_i}
        emp_wt = employees_wt.detect {|e| e['email'] == emp['attributes']['email']}
        emp_tmp = {
          id:              emp['id'],
          name:            emp['attributes']['name'],
          surname:         emp['attributes']['surname'],
          patronymic:      emp['attributes']['patronymic'],
          grade:           emp['attributes']['grade'],
          login:           emp['attributes']['login'],
          email:           emp['attributes']['email'],
          birthday:        emp['attributes']['birthday'],
          costcenter_num:  emp['relationships']['costcenter']['data']['number'],
          costcenter_name: emp['relationships']['costcenter']['data']['name'],
          status:          emp['attributes']['status'] == 3 ? 'REGULAR' : emp['attributes']['status'] == 1 ? 'MATERNITY' : nil,
                           # status 3 - regular, 1 - maternity
          gender:          emp['attributes']['gender'],
          unit:            emp['relationships']['unit']['data']['name'],
          active:          true,
          city_id:         emp['relationships']['city']['data']['id'],
          office_id:       emp['relationships']['building']['data']['id'],
          position_id:     emp['relationships']['position']['data']['id'],
          work_type:       emp_wt.blank? ? nil : emp_wt['workFormatType'].chars.first
        }
        if emp_tmp[:email].blank?
          puts "couldn't make actions withs employee - email is null for employee with full name = #{emp['attributes']['full-name']} and id = #{emp['id']}"
        elsif emp_old.blank? # create new employee
          emp_new = Employee.create!(emp_tmp)
          if emp_new.save
            puts "create employee with full name = #{emp['attributes']['full-name']} and id = #{emp['id']}"
            emp_add = EmployeesAdd.create!({
               phone: nil,
               mobile: nil,
               info: nil,
               education: nil,
               employee_id: emp_new[:id]
            })
            if emp_add.save
              puts "add employee_add for employee with full name = #{emp['attributes']['full-name']} and id = #{emp['id']}"
            else
              puts "couldn't create employee_add for employee with full name = #{emp['attributes']['full-name']} and id = #{emp['id']}"
              error_create_emp_add_new_counter+= 1
            end
          else
            puts "couldn't create employee with full name = #{emp['attributes']['full-name']} and id = #{emp['id']}"
            error_create_emp_counter+= 1
          end
        else # update existing employee
          emp_updated = Employee.find(emp['id'])
          if emp_updated.update(emp_tmp)
            puts "update employee with full name = #{emp['attributes']['full-name']} and id = #{emp['id']}"
            emp_add = EmployeesAdd.find_by(employee_id: emp_tmp[:id])
            if emp_add.blank?
              emp_add = EmployeesAdd.create!({
                 phone: nil,
                 mobile: nil,
                 info: nil,
                 education: nil,
                 employee_id: emp_tmp[:id]
              })
              if emp_add.save
                puts "add employee_add for employee with full name = #{emp['attributes']['full-name']} and id = #{emp['id']}"
              else
                puts "couldn't create employee_add for employee with full name = #{emp['attributes']['full-name']} and id = #{emp['id']}"
                error_create_emp_add_employee_counter+= 1
              end
            end
            if emp_old.work_type == 'F' && emp_updated.work_type == 'H' || emp_old.status != 'MATERNITY' && emp_updated.status == 'MATERNITY'
              place = ObjectItem.where(employee: emp_updated.id).first
              unless place.nil?
                four_nums = emp_updated.costcenter_num / 1000
                costcenter_new = four_nums == 3581 ? 3581000 : four_nums == 2583 ? 2583000 : emp_updated.costcenter_num
                fio = "#{emp_updated.surname emp_updated.name emp_updated.patronymic}"
                ObjectItem.update(place.id, {
                  :status         => 'RESERVED',
                  :costcenter_num => costcenter_new,
                  :employee_id    => nil,
                })
                Api::V1::HeartbeatsController.new.create('removing', emp['id'].to_i, place.id, nil)
                text_subject = emp_old.status != 'MATERNITY' && emp_updated.status == 'MATERNITY' ? "Резерв мест декретных работников" : "Резерв смены режима работы"
                text_body = emp_old.status != 'MATERNITY' && emp_updated.status == 'MATERNITY' ? "Добрый день #{fio}, \nВаше фиксированное место в офисе #{place.name} переведено в резерв на МВЗ #{costcenter_new} так как режим работы сменился на декретный отпуск." : "Добрый день #{fio}, \nВаше фиксированное место в офисе #{place.name} переведено в резерв на МВЗ #{costcenter_new} так как режим работы сменился с флекс на гибрид."
                send_mails(emp_updated, text_subject, text_body)
              end
            end
          else
            puts "couldn't update employee with full name = #{emp['attributes']['full-name']} and id = #{emp['id']}"
            error_update_emp_counter+= 1
          end
        end
      end
    end

    create_user(Rails.configuration.chatbot_employee_id, 'Chatbot', 'Chatbotov', 'Chatbotovich', 'chatbot',
                'chatbot@t-systems.com', 2583112, 'Tel-IT TSO EW2', 2)
    create_user(Rails.configuration.test_employee_id, 'Test', 'Testov', 'Testovich', 'test',
                'test@t-systems.com', 0000000, 'Test Costcenter', 11)

    puts "Errors count when creating employees: #{error_create_emp_counter}"
    puts "Errors count when creating employees adds for new employees: #{error_create_emp_add_new}"
    puts "Errors count when creating employees adds for existed employees: #{error_create_emp_add_existed}"
    puts "Errors count when updating employees: #{error_update_emp_counter}"
  end

  def employees_centra
    uri = URI 'https://centra.t-systems.ru/employees?status=all'
    req = Net::HTTP::Get.new(uri)
    token = 'c57cc9d025edec041b58e93645c91cb9770b2d0b5b0c9ad6c65a787247c53126'
    version = '1'
    req['Authorization'] = "Token token=\"#{token}\""
    req['Accept'] = "application/vnd.api+json; version=#{version}"
    res = Net::HTTP.start(uri.host,
                          uri.port,
                          use_ssl: uri.scheme == 'https',
                          verify_mode: OpenSSL::SSL::VERIFY_NONE) do |http|
      http.request(req)
    end
    res.body
  end

  def employees_work_type
    uri = URI 'https://vacations.t-systems.ru/new-normal/work-format'
    req = Net::HTTP::Get.new(uri)
    req['Accept'] = "application/json"
    res = Net::HTTP.start(uri.host,
                          uri.port,
                          use_ssl: uri.scheme == 'https',
                          verify_mode: OpenSSL::SSL::VERIFY_NONE) do |http|
      http.request(req)
    end
    res.body
  end

  def send_mails(employee, text_subject, text_body)
    costcenters_json = ask_centra_for :costcenters, attributes: 'number,name,owner'
    cc_owner_id      = nil
    costcenters_json.each do |item|
      if item["attributes"]["number"] == employee.costcenter_num
        cc_owner_id = item["relationships"]["owner"]["data"]["id"]
        break
      end
    end
    employees_data = Employee.select("employees.id AS employee_id, employees.email AS email")
                             .where('employees.id = (?)', cc_owner_id)
    head_email = employees_data[0]["email"]
    ActionMailer::Base.mail(
      from: "RU_navi_support@internal.telekom.com",
      to: employee[:email],
      subject: text_subject,
      body: text_body
    ).deliver
    ActionMailer::Base.mail(
      from: "RU_navi_support@internal.telekom.com",
      to: head_email,
      subject: text_subject,
      body: text_body
    ).deliver
    ActionMailer::Base.mail(
      from: "RU_navi_support@internal.telekom.com",
      to: "facility4you@t-systems.ru",
      subject: text_subject,
      body: text_body
    ).deliver
    ActionMailer::Base.mail(
      from: "RU_navi_support@internal.telekom.com",
      to: "sergei.brezhnev@t-systems.com",
      subject: text_subject,
      body: text_body
    ).deliver
  end

  def create_user(tech_id, name, surname, patronymic, login, email, costcenter_num, costcenter_name, group_id)
    emp_tech = Employee.create!({
      id:              tech_id,
      name:            name,
      surname:         surname,
      patronymic:      patronymic,
      grade:           nil,
      login:           login,
      email:           email,
      birthday:        "1970-03-04",
      costcenter_num:  costcenter_num,
      costcenter_name: costcenter_name,
      status:          nil,
      gender:          "м",
      unit:            nil,
      active:          true,
      city_id:         nil,
      office_id:       nil,
      position_id:     nil
    })
    if emp_tech.save
      puts "create employee with full name = #{name}"
    else
      puts "couldn't create employee with full name = #{name}"
    end
    role_ = Role.create!({
      group_id: group_id,
      rolable_type: 'Employee',
      rolable_id: tech_id
    })
    if role_.save
      puts "create role for employee with full name = #{name} and id = #{tech_id}"
    else
      puts "couldn't role for employee with full name = #{name} and id = #{tech_id}"
    end
    emp_add_tech = EmployeesAdd.create!({
      phone: nil,
      mobile: nil,
      info: nil,
      education: nil,
      employee_id: tech_id
    })
    if emp_add_tech.save
      puts "create employee_add for employee with full name = #{name} and id = #{tech_id}"
    else
      puts "couldn't employee_add for employee with full name = #{name} and id = #{tech_id}"
    end
  end

end
