class UpdateChordColorCode < ActiveRecord::Migration[5.0]
  def change
    Chord.all.each do |chord|
      chord.update(
        color_code: "#%06x" % (rand * 0xffffff)
      )
    end
  end
end
