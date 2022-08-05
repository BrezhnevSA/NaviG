require 'rails_helper'

RSpec.describe Employee, type: :model do

  let(:dummy_data) {
    Employee.new({
      'name' => 'Totonio',
      'surname' => 'Vseznajkin',
      'email' => 'some@email.com',
      'login' => 'login',
      'birthday' => '1911-11-11'
    })
  }

  it 'should be invalid without params' do
    expect(subject).not_to be_valid
  end

  it 'should be valid with required params' do
    subject = dummy_data
    expect(subject).to be_valid
  end

  it 'should check email format' do

    subject = dummy_data

    subject[:email] = 'someemail.com'
    expect(subject).not_to be_valid

    subject[:email] = 'some@email.com'
    expect(subject).to be_valid
  end

  it 'should check birthday format' do

    subject = dummy_data

    subject[:birthday] = '05-99-1915'
    expect(subject).not_to be_valid

    subject[:birthday] = 10
    expect(subject).not_to be_valid

    subject[:birthday] = '1911-11-11'
    expect(subject).to be_valid
  end

end
