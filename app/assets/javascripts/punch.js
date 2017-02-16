function Punch(time_s,chord) {
  this._time         = null;
  this._chord        = null;
  this._display_time = null;
  this._prev_node    = null;
  this._next_node    = null;
  this.linked        = false;
  this.time  = val_or_null(time_s);
  this.chord = val_or_null(chord);
}

Punch.prototype = {

  constructor: Punch,

  //////////////////////// PROPERTIES //////////////////////////////////

  get time()         { return val_or_null(this._time); },
  set time(s)        { this._time = s; this.generate_display_time(); },

  get disp_time()    { return val_or_default( this._display_time, this.generate_display_time() ); },
  get display_time() { return val_or_default( this._display_time, this.generate_display_time() ); },
  get short_disp()   { return this.disp_time.splice(3,this.disp_time.length-7); },

  get chord()        { return val_or_default( this._chord, 'No Chord' ); },
  set chord(c)       { this._chord = c; },

  set next_node(n)   { this._next_node = n; },
  get duration_s()   { 
  	return ( empty(this._next_node) ? null : this._next_node.time - this.time );
  },

  //////////////////////// PROPERTIES //////////////////////////////////

  generate_display_time: function() {
  	if( empty(this._time) ) return '';

  	ms   = ( this._time * 1000 ).toFixed();
    hrs  = Math.floor( ms / 3600000 );
    ms   = ms - hrs * 3600000;
    mins = Math.floor( ms / 60000 );
    ms   = ms - mins * 60000;
    secs = Math.floor( ms / 1000 );
    ms   = ms - secs * 1000;

    hrs  =  hrs.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    mins = mins.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    secs = secs.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    ms   =   ms.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false });

    this._display_time = ( hrs == '00' ? '' : hrs + ':') + mins + ':' + secs + '.' + ms;
    return this._display_time;
  },

  jog: function(offset_ms) {
    let t = parseFloat(this.time) + parseFloat( offset_ms / 1000 );
    this.time = (t < 0 ? 0 : t);
    this.generate_display_time();
    this._on_change();
    return this;
  },

  to_model: function() {
    return { time: this.time, disp_time: this.disp_time, chord: this.chord };
  },

  to_json: function() {
  	return JSON.stringify( this.to_model )
  },

  _on_change() {
    if( ! isFunction(this.on_change) ) return;
    this.on_change();
  },

  delete() {
    if(isFunction(this.on_delete)) {
      this.on_delete(this);
    }
  }

}

Object.assign( 
  Punch.prototype, {
    
    occupies: function(time_s) {
      if( ! this.linked ) return false;
      time_s = parseFloat(time_s);

      if( time_s <  parseFloat(this.time) )            { return false; }  // TOO LOW
      if( empty(this._next_node)          )            { return true;  }  // LAST NODE
      if( time_s >= parseFloat(this._next_node.time) ) { return false; }  // TOO HIGH
      return true;      
    },

    link: function(prev_node, next_node) {
      this._prev_node = prev_node;
      this._next_node = next_node;
      this.linked = true;
    }

  }
);

Object.assign(Punch.prototype, ev_channel);