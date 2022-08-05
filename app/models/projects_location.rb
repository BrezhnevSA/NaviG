class ProjectsLocation< ApplicationRecord
  belongs_to  :location
  attr_reader :member_tokens

  validates :project_id, :location_id, presence: true

  def member_tokens=(ids)
    self.project_ids = ids.split(",")
  end
end

