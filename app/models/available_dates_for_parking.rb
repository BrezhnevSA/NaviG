class AvailableDatesForParking < ApplicationRecord

  validates_presence_of :object_item

  belongs_to :object_item

end