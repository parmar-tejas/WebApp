class ChangeChordFingeringColumn < ActiveRecord::Migration[5.0]
  def change
    remove_column :chords, :fingering
    add_column :chords, :fingering, :integer, array:true
  end
end
