class Api::V1::ChordsController < Api::ApiController

  def index
    chords = Chord.all
    success_response(chords)
  end

  def show
    chord = $CHORD_VALIDATION_REGEX.match(params[:chordname])
    chords = Chord.where(
      root: Chord.root_value(chord[:root]),
      quality: chord[:quality]
    ).first
    success_response(chords)
  end
end