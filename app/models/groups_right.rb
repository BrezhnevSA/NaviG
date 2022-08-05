class GroupsRight < ApplicationRecord
    belongs_to :group
    belongs_to :right

    validates_presence_of :group
    validates_presence_of :right
end
