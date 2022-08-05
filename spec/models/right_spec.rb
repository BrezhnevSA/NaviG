require 'rails_helper'

RSpec.describe Right, type: :model do
  
  it 'should be invalid without params' do
    expect(subject).not_to be_valid
  end

  it 'should be valid with params' do
    subject[:name] = 'Right name'
    subject[:machine_name] = 'right_name'

    expect(subject).to be_valid
  end

end
