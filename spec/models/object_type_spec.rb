require 'rails_helper'

RSpec.describe ObjectType, type: :model do
  
  it 'should be invalid without name' do
    expect(subject).not_to be_valid
  end

  it 'should be valid with name' do
    subject[:name] = 'Object type name'

    expect(subject).to be_valid
  end
  
end
