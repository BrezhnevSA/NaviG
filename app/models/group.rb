class Group < ApplicationRecord
    has_many :groups_rights
    has_many :roles

    validates_presence_of :name
end
