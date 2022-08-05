require 'rails_helper'

RSpec.describe MetaMap, type: :model do
  
  it 'should be invalid without params' do
    expect(subject).not_to be_valid
  end

  it 'should be valid with params' do
    subject[:meta_field_id] = 1
    expect(subject).to be_valid
  end

end
