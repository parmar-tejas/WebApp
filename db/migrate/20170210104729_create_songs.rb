class CreateSongs < ActiveRecord::Migration[5.0]
  def change
    create_table :songs do |t|
      t.string   :youtube_id
      t.string   :title
      t.json     :punches
      t.datetime :uploaded_on
      t.string   :artist
      t.string   :song_title
      t.integer  :uploaded_by
      t.timestamps
    end
  end
end
