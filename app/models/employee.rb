class Employee < ApplicationRecord

    belongs_to :city, optional: true
    belongs_to :office, optional: true
    belongs_to :position, optional: true

    has_many :sdmanagers_costcenters
    has_many :bookings
    has_many :employees_adds
    has_many :object_items
    has_many :roles, :as => :rolable
    has_many :employees_locations

    validates_presence_of :name
    validates_presence_of :surname

    validates :email, presence: true,
              uniqueness: {case_sensitive: false},
              format: {with: /@/}
    validates :login, presence: true,
              uniqueness: {case_sensitive: false},
              format: {with: /\A[a-zA-Z0-9]+\z/}
    validates :birthday, presence: true,
              format: {with: /\d{4}\-\d{2}\-\d{2}/}

    before_save :downcase_email

    def full_name
        "#{surname} #{name} #{patronymic}"
    end

    def downcase_email
        self.email = self.email.delete(' ').downcase
    end

end
