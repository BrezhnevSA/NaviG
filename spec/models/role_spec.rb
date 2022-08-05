require 'rails_helper'

RSpec.describe Role, type: :model do
  
  it 'should be invalid without params' do
    expect(subject).not_to be_valid
  end

  # it 'should be valid with params' do
  #   subject[:group_id] = 1
  #   subject[:rolable_id] = 1

  #   subject.valid?
  #   puts subject.errors.messages

  #   expect(subject).to be_valid
  # end

end
