class Office < ApplicationRecord
    belongs_to :city

    has_many :buildings
    has_many :employees

    validates_presence_of :name
    validates_presence_of :city

    def self.not_exists?(ids)
        self.find(ids)
        false
    rescue
        true
    end
end
