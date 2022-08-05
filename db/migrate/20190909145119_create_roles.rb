class CreateRoles < ActiveRecord::Migration[6.0]
  def change
    create_table :roles do |t|

      t.references :group, index: true
      t.references :rolable, polymorphic: true

    end
  end
end
