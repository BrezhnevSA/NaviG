class AddCompanyContracts < ActiveRecord::Migration[6.0]
  def change
    add_column :contracts, :company, :string
  end
end