require 'rails_helper'

RSpec.describe City, type: :model do
  
  it 'should be invalid without name' do
    expect(subject).not_to be_valid
  end

  it 'should be valid with name' do
    subject[:name] = 'Some name'
    expect(subject).to be_valid
  end

end
