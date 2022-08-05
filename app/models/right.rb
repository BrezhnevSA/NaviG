class Right < ApplicationRecord
    has_many :groups_rights

    validates_presence_of :name

    validates :machine_name, presence: true,
              uniqueness: {case_sensitive: false},
              format: {with: /[\w \.\-@]+/}
end
