class Floor < ApplicationRecord

    belongs_to :building

    has_many :floors_configs
    has_many :locations
    has_many :object_items
    
end
