require 'rails_helper'

RSpec.describe MetaType, type: :model do
  
  it 'should be invalid without params' do
    expect(subject).not_to be_valid
  end

  it 'should be valid with params' do
    subject[:metatype] = 'Type'
    subject[:name] = 'Name'
    expect(subject).to be_valid
  end
  
end
