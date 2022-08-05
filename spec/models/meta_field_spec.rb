require 'rails_helper'

RSpec.describe MetaField, type: :model do
  
  it 'should be invalid without params' do
    expect(subject).not_to be_valid
  end

  it 'should be valid with params' do
    subject[:meta_type_id] = 1
    subject[:name] = 'Field name'
    expect(subject).to be_valid
  end

end
