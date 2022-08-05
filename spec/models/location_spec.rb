require 'rails_helper'

RSpec.describe Location, type: :model do
  
  # disabled after enabling logical locations
  # it 'should be invalid without params' do
  #   expect(subject).not_to be_valid
  # end

  it 'should be valid with params' do
    subject[:floor_id] = 1
    subject[:location_type_id] = 1
    expect(subject).to be_valid
  end

end
