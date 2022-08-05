require 'rails_helper'

RSpec.describe "SearchControllers", type: :request do

    it 'should search employees on place' do
        get "/api/v1/search/employees_on_place?query=''&employee_statuses=''&page=1&per_page=5", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end

    it 'should search employees with no place' do
        get "/api/v1/search/employees_with_no_place?query=''&employee_statuses=''&page=1&per_page=5", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end

    it 'should search rooms and locations' do
        get "/api/v1/search/rooms_and_locations?query=''&location_type_ids=''&page=1&per_page=5", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end

    it 'should search objects and desks on place' do
        get "/api/v1/search/objects_and_desks?query=''&object_type_ids=''&page=1&per_page=5", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end

    it 'should search employees for group' do
        get "/api/v1/search/employees_for_group?group_id=2", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end

    it 'should search employees' do
        get "/api/v1/search/employees", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end

    it 'should search places' do
        get "/api/v1/search/places", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end

    it 'should search costcenters' do
        get "/api/v1/search/costcenters", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end

    it 'should search all costcenters' do
        get "/api/v1/search/costcenters/all", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end

    it 'should search projects' do
        get "/api/v1/search/projects", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end

    it 'should search locations' do
        get "/api/v1/search/locations", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end

    it 'should search employees in costcenter' do
        get "/api/v1/search/employees_in_costcenter?costcenter_num=1140300", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end
end
