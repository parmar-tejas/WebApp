function Chord(label) {
  this.label = label
}

Chord.prototype = {
  constructor: Chord,
  get label()  { return this._label || "No Chord"; },
  set label(l) { this._label = l; },

  get color()  { return this._color || this.generate_color(); },
  set color(c) { this._color = c; },

  // generate_color: function() {
  //   var letters = '0123456789ABCDEF';
  //   var color = '#';
  //   for (var i = 0; i < 6; i++ ) { color += letters[Math.floor(Math.random() * 16)]; }
  //   this.color = color;
  //   return color;
  // },

  generate_color: function() {
    if(Chord.color_codes){
      this.color = Chord.color_codes[this.label]
      return Chord.color_codes[this.label] || "#43DDBF"
    }
  },

  matches(label) { return this.label == label; }
}