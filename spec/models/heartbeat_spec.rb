require 'rails_helper'

RSpec.describe Heartbeat, type: :model do
  
  it 'should be invalid without params' do
    expect(subject).not_to be_valid
  end

  it 'should be valid with params' do
    subject[:hb_type] = 'Type Name'
    expect(subject).to be_valid
  end

end
