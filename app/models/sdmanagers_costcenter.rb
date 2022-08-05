class SdmanagersCostcenter < ApplicationRecord
  belongs_to  :employee
  attr_reader :member_tokens

  validates :costcenter_num, presence: true

  def member_tokens=(ids)
    self.employee_ids = ids.split(",")
  end
end