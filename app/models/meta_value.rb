class MetaValue < ApplicationRecord
    belongs_to :meta_field
    # belongs_to :metable, polymorphic: true, optional: true

    validates_presence_of :meta_field
    validates_presence_of :metable_id
end
