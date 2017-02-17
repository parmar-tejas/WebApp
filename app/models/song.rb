class Song < ApplicationRecord

  #
  # Associations
  #
  belongs_to(
    :user,
    class_name: :User,
    foreign_key: :uploaded_by,
    required: false
  )

  belongs_to :genere
  belongs_to :difficulty

  attr_accessor :user_name # for autocomplete

  def to_hash
    {
      youtube_id: youtube_id,
      uploaded_on: uploaded_on,
      title: title,
      artist: artist,
      song_title: song_title,
      punches: self.convert_punches
    }
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


end
