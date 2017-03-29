class AddColorCodeInChords < ActiveRecord::Migration[5.0]
  def change
    add_column :chords, :color_code, :string, limit: 7
  end
end
