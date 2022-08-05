class ObjectItem < ApplicationRecord
    belongs_to :object_type
    belongs_to :floor
    belongs_to :location, optional: true
    belongs_to :employee, optional: true

    validates_presence_of :floor
    validates_presence_of :object_type
end
