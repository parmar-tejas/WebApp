function Chordlib() {
  this.chords = [];
  this.bind_handlers();	
  this.get_data();
}

Chordlib.prototype = {
  constructor: Chordlib,

  get_data: function() { $.get('/api/v1/chords', this.on_chords ); },

  get_chord: function(name) {
    var chord = this.CHORD_REGEX.exec(name);
    if(empty(chord)) {  return({ name: 'No Chord', root: '', quality: '', root_value: 0, fingering: [0] }); } 
    root_val = this.root_value(chord[1]);
    fingering = this.get_fingering(root_val,chord[5]);
    return({ name: chord[1] + ' ' + chord[5], root: chord[1], quality: chord[5], root_value: root_val, fingering: fingering });
  },

  get_fingering: function(root_val, quality) {
    var result = $.grep(this.chords, function(el,i) { return( el['root'] == root_val && el['quality'] == quality ); } );
    if(result.length == 1) { return result[0]['fingering']; }
    return [0];	
  },

  root_value: function(note_name) {
    switch(note_name) {
      case 'C':  return 1
      case 'C#':
      case 'Db': return 2
      case 'D':  return 3
      case 'D#':
      case 'Eb': return 4
      case 'E':  return 5
      case 'F':  return 6
      case 'F#':
      case 'Gb': return 7
      case 'G':  return 8
      case 'G#':
      case 'Ab': return 9
      case 'A':  return 10
      case 'A#':
      case 'Bb': return 11
      case 'B':  return 12
      default: return 0
    }
  },

  CHORD_REGEX: /(([A,D,G][b|#]?)|([B,E]b?)|([C,F]#?)) (Maj|min|5|7|Maj7|m7|sus4|add9|sus2|7sus4|7#9|9)/,

  bind_handlers: function() {
  	this.on_chords = function(data) { this.chords = data; }.bind(this);
  }

}