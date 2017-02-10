class CreateChords < ActiveRecord::Migration[5.0]
  def change
    create_table :chords do |t|
      t.integer :root
      t.string  :quality
      t.integer :fingering
      t.timestamps
    end
  end
end
