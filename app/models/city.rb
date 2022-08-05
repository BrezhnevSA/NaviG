class City < ApplicationRecord

    validates_presence_of :name

    has_many :contracts
    has_many :employees

    def self.not_exists?(ids)
        self.find(ids)
        false
    rescue
        true
    end
end
