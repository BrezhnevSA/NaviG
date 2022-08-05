require 'rails_helper'

RSpec.describe CostcentersLocation, type: :model do

  it 'should be invalid without params' do
    expect(subject).not_to be_valid
  end

  it 'should be valid with location and costcenter_num' do
    subject[:location_id] = 1
    subject[:costcenter_num] = 111
    expect(subject).to be_valid
  end

end
