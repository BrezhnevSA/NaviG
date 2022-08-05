require 'rails_helper'

RSpec.describe SdmanagersCostcenter, type: :model do
   
  it 'should be invalid without params' do
    expect(subject).not_to be_valid
  end

  it 'should be valid with params' do
    subject[:employee_id] = 1
    subject[:costcenter_num] = 111

    expect(subject).to be_valid
  end

end
