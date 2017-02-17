class AddGenereIdAndDifficultyIdInSongs < ActiveRecord::Migration[5.0]
  def change
    add_column :songs, :genere_id,     :integer
    add_column :songs, :difficulty_id, :integer
  end
end
