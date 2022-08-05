require 'rails_helper'

RSpec.describe Booking, type: :model do
  
  it 'should be invalid without object_item and employee' do
    expect(subject).not_to be_valid
  end

  it 'should be valid with object_item and employee' do
    subject[:employee_id] = 1
    subject[:object_item_id] = 1
    expect(subject).to be_valid
  end

end
