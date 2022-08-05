class CostcentersLocation < ApplicationRecord

  belongs_to  :location
  attr_reader :member_tokens

  validates :costcenter_num, :location_id, presence: true

  def member_tokens=(ids)
    self.costcenter_num_ids = ids.split(",")
  end
  
end

