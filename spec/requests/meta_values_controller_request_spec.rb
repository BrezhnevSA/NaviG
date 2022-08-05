require 'rails_helper'

RSpec.describe "MetaValuesControllers", type: :request do

    it 'should return meta value by target id and value' do
        get "/api/v1/meta/object/4", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end

    it 'should update meta value' do
        params = { data: [
                {
                    metable_id: 4,
                    metafieldid: 2,
                    metavalue: "on",
                    metavalueid: 1
                }
            ].to_json }

        post "/api/v1/meta/object/4", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end
end
