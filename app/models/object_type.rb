class ObjectType < ApplicationRecord
    has_many :object_items

    validates_presence_of :name
end
