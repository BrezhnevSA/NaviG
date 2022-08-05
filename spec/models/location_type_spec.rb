require 'rails_helper'

RSpec.describe LocationType, type: :model do
  
  it 'should be invalid without params' do
    expect(subject).not_to be_valid
  end

  it 'should be valid with params' do
    subject[:name] = 'Name'
    subject[:bg] = 'bg.jpg'
    expect(subject).to be_valid
  end

end
