class Location < ApplicationRecord

    belongs_to :floor, optional: true
    belongs_to :location_type, optional: true

    has_many :object_items
    has_many :costcenters_locations
    has_many :employees_locations
    has_many :projects_locations

end
