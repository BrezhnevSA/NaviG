require 'rails_helper'

RSpec.describe Building, type: :model do

  it 'should be invalid without name or office' do
    expect(subject).not_to be_valid
  end

  it 'should be valid with name and office' do
    subject[:name] = 'Some name'
    subject[:office_id] = 1
    expect(subject).to be_valid
  end

end
