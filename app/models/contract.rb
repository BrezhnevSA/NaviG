class Contract < ApplicationRecord

  has_many :cities

  validates :name, presence: true
  validates :company, presence: true
  validates :name, uniqueness: true
  validates :price, numericality: {greater_than_or_equal_to: 0}

end