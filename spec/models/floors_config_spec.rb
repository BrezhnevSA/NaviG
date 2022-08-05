require 'rails_helper'

RSpec.describe FloorsConfig, type: :model do
  
  it 'should be invalid without params' do
    expect(subject).not_to be_valid
  end

  it 'should be valid with params' do
    subject[:floor_id] = 1
    expect(subject).to be_valid
  end

end
