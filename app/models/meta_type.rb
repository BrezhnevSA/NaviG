class MetaType < ApplicationRecord
    has_many :meta_fields

    validates_presence_of :metatype, :name
end
