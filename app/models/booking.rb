class Booking < ApplicationRecord

  validates_presence_of :object_item
  validates_presence_of :employee

  belongs_to :object_item
  belongs_to :employee

end