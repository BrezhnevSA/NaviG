class FixCityIdContracts < ActiveRecord::Migration[6.0]
  def change
    rename_column :contracts, :city_id, :office_id
  end
end