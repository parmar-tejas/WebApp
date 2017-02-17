class AddPublishedInSongs < ActiveRecord::Migration[5.0]
  def change
    add_column :songs, :published, :boolean, default: false
  end
end
