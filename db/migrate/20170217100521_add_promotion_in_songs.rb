class AddPromotionInSongs < ActiveRecord::Migration[5.0]
  def change
    add_column :songs, :promotion, :boolean, default: false
  end
end
