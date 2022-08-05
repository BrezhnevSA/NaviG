class MetaField < ApplicationRecord

    belongs_to :meta_type

    has_many :meta_maps
    has_many :meta_values

    validates_presence_of :name, :meta_type

end
