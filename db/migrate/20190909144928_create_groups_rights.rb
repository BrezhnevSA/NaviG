class CreateGroupsRights < ActiveRecord::Migration[6.0]
  def change
    create_table :groups_rights do |t|
      t.references :group, index: true
      t.references :right, index: true

      t.timestamps
    end
  end
end
