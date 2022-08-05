require 'rails_helper'

RSpec.describe "GroupsRights", type: :request do

    it 'have CRUD functionality' do
        params = {
            groupright: {
                group_id: 2,
                right_id: 1,
            }
        }

        post '/api/v1/groups_rights', params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['id']).to be_an(Numeric)

        @gid = json_body['id']
        params[:groupright][:group_id] = 3

        put "/api/v1/groups_rights/#{@gid}", params: params, headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['group_id']).not_to eq(2)

        get "/api/v1/groups_rights/#{@gid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
        expect(json_body['group_id']).to eq(3)

        delete "/api/v1/groups_rights/#{@gid}", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)

        expect { get "/api/v1/groups_rights/#{@gid}", headers: { 'Authorization' => @auth_token } }.to raise_exception(ActiveRecord::RecordNotFound)
    end

    it 'should check user permissions' do
        # get right id for 'view_grouprights'
        view_grouprights = Right.where(machine_name: 'view_grouprights').first
        view_grouprights_id = view_grouprights['id']

        # get user group id
        user_gid = AuthHelper::GROUP_ID

        # get right id
        group_right = GroupsRight.select('id').where("group_id = :group_id and right_id = :right_id",
            { group_id: user_gid, right_id: view_grouprights_id }).first

        # take right from current user group
        GroupsRight.update(group_right['id'], :group_id => user_gid, :right_id => view_grouprights_id - 1)
        # try to get all group rights
        get "/api/v1/groups_rights", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(401)

        # give right back to user's group
        GroupsRight.update(group_right['id'], :group_id => user_gid, :right_id => view_grouprights_id)
        # try again
        get "/api/v1/groups_rights", headers: { 'Authorization' => @auth_token }
        expect(response).to have_http_status(:ok)
    end
end
