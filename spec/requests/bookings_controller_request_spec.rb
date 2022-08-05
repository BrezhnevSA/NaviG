require 'rails_helper'

RSpec.describe "BookingsControllers", type: :request do

    it 'have CRUD functionality' do
        params = {
            object_item_id: 1,
            employee_id: AuthHelper::UID,
            book_from: Date.today.strftime("%Y-%m-%d"),
            book_to: Date.tomorrow.strftime("%Y-%m-%d"),
            comment: 'Old Comment',
            object_item: {
                name: "A7",
                id: 34
            }
        }

        post '/api/v1/bookings', params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['id']).to be_an(Numeric)

        @bid = json_body['id']
        
        params = {
            booking_data: {
                object_item_prev: {
                    name: "A7",
                    id: 34
                },
                object_item_new: {
                    name: "A7",
                    id: 34
                },
                id: @bid,
                employee_id: AuthHelper::UID,
                book_from: Date.today.strftime("%Y-%m-%d"),
                book_to: Date.tomorrow.strftime("%Y-%m-%d"),
                comment: 'New Comment',
                object_item: {
                    name: "A7",
                    id: 34
                }
            }
        }

        put "/api/v1/bookings/#{@bid}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        expect(json_body['comment']).not_to eq('Old Comment')

        get "/api/v1/bookings/#{@bid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['comment']).to eq('New Comment')

        delete "/api/v1/bookings/#{@bid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        expect { get "/api/v1/bookings/#{@bid}", headers: { 'Authorization' => @auth_token } }.to raise_exception(ActiveRecord::RecordNotFound)
    end

    it 'should search for available places' do
        get "/api/v1/bookings/search_available_places?book_from=#{Date.today.strftime("%Y-%m-%d")}&book_to=#{Date.tomorrow.strftime("%Y-%m-%d")}&employee=#{AuthHelper::UID}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end
end
