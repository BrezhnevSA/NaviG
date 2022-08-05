class MetaMap < ApplicationRecord
    belongs_to :meta_field

    validates_presence_of :meta_field
end
