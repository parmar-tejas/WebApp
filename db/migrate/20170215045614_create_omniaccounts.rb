class CreateOmniaccounts < ActiveRecord::Migration[5.0]
  def change
    if !table_exists?(:omniaccounts)
      create_table :omniaccounts do |t|
        t.string :user_id
        t.string :provider
        t.string :provider_id
        t.string :photo_url
        t.timestamps
      end
    end
  end
end
