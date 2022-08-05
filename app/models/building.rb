class Building < ApplicationRecord

    belongs_to :office

    validates_presence_of :name

    has_many :floors

    def self.not_exists?(ids)
        self.find(ids)
        false
    rescue
        true
    end
end
