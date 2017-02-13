class Chord < ApplicationRecord


  def self.chord_from_name(name)
     chord = $CHORD_VALIDATION_REGEX.match(name)
     return { :root => '', :quality => '', :root_value => 0 } if chord.nil?
     { :root => chord[:root], :quality => chord[:quality], :root_value => Chord.root_value(chord[:root]) }
  end

  def self.root_value(note_name)
    case note_name
    when 'C'       then 1
    when 'C#','Db' then 2
    when 'D'       then 3
    when 'D#','Eb' then 4
    when 'E'       then 5
    when 'F'       then 6
    when 'F#','Gb' then 7
    when 'G'       then 8
    when 'G#','Ab' then 9
    when 'A'       then 10
    when 'A#','Bb' then 11
    when 'B'       then 12
    else nil
    end
  end
end
