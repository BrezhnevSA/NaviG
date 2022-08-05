require 'rails_helper'

RSpec.describe "HeartbeatsRights", type: :request do

    it 'should give all heartbeats' do
        get "/api/v1/heartbeats", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end
end
