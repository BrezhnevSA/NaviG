class Position < ApplicationRecord
    has_many :roles, :as => :rolable
    has_many :employee

    validates_presence_of :name
end
