class Song < ApplicationRecord

  #
  # Serialization
  #
  serialize :punches, Array

  #
  # Associations
  #
  belongs_to(
    :user,
    class_name: :User,
    foreign_key: :uploaded_by,
    required: false
  )

  belongs_to :genre

  belongs_to :difficulty

  attr_accessor :user_name, :fretx_id # for autocomplete

  def fretx_id
    "#{youtube_id}-#{id}"
  end

  def to_hash(punches = true)
    data =  {
              id: id,
              youtube_id: youtube_id,
              fretx_id: fretx_id,
              uploaded_on: uploaded_on,
              title: title,
              artist: artist,
              uploaded_by: uploaded_by,
              created_at: created_at,
              updated_at: updated_at,
              song_title: song_title,
              published: published,
              promotion: promotion,
              genre: self.genre.try(:name),
              difficulty: self.difficulty.try(:name)
            }
    data[:punches] = self.convert_punches if punches

    return data
  end

  def convert_punches
    punch = {}
    self.punches.each do |punch|
      punch[:time_ms] = ( punch['time'].to_f * 1000 ).round()
      punch[:chord] = { :name => punch['chord'] }
      punch.delete('time')
      punch.delete('disp_time')
      punch.delete('chord')

      if( punch[:chord][:name] == 'No Chord') then
        punch[:chord][:root]    = ""
        punch[:chord][:rootval] = 0
        punch[:chord][:quality] = ""
        punch[:chord][:fingering] = '{0}'
      else
        chord_obj = Chord.chord_from_name(punch[:chord][:name])
        punch[:chord][:root]    = chord_obj[:root]
        punch[:chord][:rootval] = chord_obj[:root_value]
        punch[:chord][:quality] = chord_obj[:quality]
        resp = Chord.where(
          root: chord_obj[:root_value],
          quality: chord_obj[:quality]
        ).first
        punch[:chord][:fingering] = resp.fingering
      end
    end
  end

  def self.promotional_song
    Song.where(promotion: true).order(:youtube_id, updated_at: :desc).first
  end

  def self.related_songs(song)
    return nil if song.blank?
    Song.where('id != ? and (genre_id = ? OR difficulty_id = ?)', song.id, song.genre_id, song.difficulty_id).limit(3)
  end
end
