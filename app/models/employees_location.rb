class EmployeesLocation < ApplicationRecord

  belongs_to  :employee
  belongs_to  :location
  attr_reader :member_tokens

  validates :employee_id, :location_id, presence: true

  def member_tokens=(ids)
    self.employee_ids = ids.split(",")
  end
  
end

