class Role < ApplicationRecord
    belongs_to :group
    belongs_to :rolable, polymorphic: true

    validates_presence_of :group, :rolable
end
