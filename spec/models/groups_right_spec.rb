require 'rails_helper'

RSpec.describe GroupsRight, type: :model do
  
  it 'should be invalid without params' do
    expect(subject).not_to be_valid
  end

  it 'should be valid with params' do
    subject[:group_id] = 1
    subject[:right_id] = 1
    expect(subject).to be_valid
  end

end
