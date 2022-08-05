require 'rails_helper'
require 'net-ldap'

RSpec.describe "AuthControllers", type: :request do

    it 'should have access by LDAP to auth server' do
        user = "T-SYSTEMS\\#{AuthHelper::USERNAME}"
        ldap = Net::LDAP.new host: 't-systems.ru',
            port: 389,
            auth: { method: :simple,
                    username: user,
                    password: AuthHelper::PASSWORD }

        expect(ldap.bind).to be_truthy
    end

    describe 'login functionality' do

        let(:params) {
            {
                email: AuthHelper::EMAIL,
                password: AuthHelper::PASSWORD
            }
        }

        it 'should login user' do
            post '/api/v1/login', params: params
            expect(response).to have_http_status(:ok)
            expect(json_body['auth_token']).to be_a(String)
        end

        it 'should return user data by token' do

            auth_token = JsonWebToken.encode({user_id: AuthHelper::UID})
            get '/api/v1/get_user_by_token', headers: { 'Authorization' => auth_token }
            expect(response).to have_http_status(:ok)
        end

    end

end
