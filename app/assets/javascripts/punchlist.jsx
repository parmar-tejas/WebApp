function Punchlist() {
	this.punches = [];
	this.current_index = -1;
  this.current_time = 0;
  this.punch_callbacks = [];
  this.bind_listeners();
}

Punchlist.prototype = {
	constructor: Punchlist,

  get first_punch()   { return( this.punches[0] ); },
  get last_punch()    { return( this.punches[this.punches.length - 1] ); },
  get current_punch() { return( this.punches[this.current_index     ] ); },
  get next_punch()    { return( this.punches[this.current_index + 1 ] ); },
  get prev_punch()    { return( this.punches[this.current_index - 1 ] ); },

	add_punch(punch) {
    this.punches.push( new Punch(punch.time, punch.chord) );
    this.punches.sort( SortByTime );
    this._on_list_change();
	},

	add_punches(punches) {
    for(var i=0; i<punches.length; i++) { this.punches.push( new Punch(punches[i].time, punches[i].chord) ); }
    this.punches.sort( SortByTime );
    this._on_list_change();
	},

	del_punch(punch) {
		var i = typeof(punch) == 'number' ? punch : this.punches.indexOf(punch);
    this.punches.splice(i,1);
    this.link_list();
    this.set_current_punch()
      this._on_list_change();
    this._on_punch_change();
	},

  del_punch_from_rv(_rv) {
    punch = null;
    index = null;
    for(i = 0; i < punchlist.punches.length; i++){
      if(punchlist.punches[i]._rv == _rv) {
        punch = punchlist.punches[i];
        index = i
      }
    }
    if(punch!= null){
      punchlist.punches.splice(index,1);
      punchlist.link_list();
      punchlist.set_current_punch()
      punchlist._on_list_change();
      punchlist._on_punch_change();
    }
  },

	clear() { 
    this.punches = []; 
    this._on_list_change(); 
  },

	load(punches) {
		this.punches = [];
    this.add_punches(punches);
    this.current_index = -1;
    this.current_time = 0;
  },

}

Object.assign( Punchlist.prototype, ev_channel );

Object.assign( 
  Punchlist.prototype, {

    jog(offset_ms) {
      for(var i=0; i<this.punches.length; i++) this.punches[i].jog(offset_ms); 
    },

    link_list() {
      for(var i=0; i<this.punches.length; i++) {
        prev_punch = ( i!=0 ) ? this.punches[i-1] : null;
        next_punch = ( i==this.punches.length-1 ) ? null : this.punches[i+1];
        this.punches[i].link(prev_punch, next_punch);
        this.punches[i].on_change = this.on_punch_change;
        this.punches[i].on_delete = this.del_punch;
      }
    },

    on_punch_change() {
      this._on_list_change();
    },

    set_current_punch(time_s) {
      //console.log(`${time_s} ${this.current_index} ${this.punches[0].time}`);
      for(var i=0; i<this.punches.length; i++) {
        if(this.punches[i].occupies(time_s)) {
          this.current_index = i;
          this._on_punch_change();
          return;
        }
      }
    },

    to_models() {
      var punches = [];
      for(var i=0; i<this.punches.length; i++) {
        punches.push(this.punches[i].to_model());
      }
      return punches;
    }

  }
);

Object.assign(
  Punchlist.prototype, {
    bind_listeners() {
      this.update_time     = this.update_time.bind(this);
      this.on_punch_change = this.on_punch_change.bind(this);
      this.del_punch       = this.del_punch.bind(this);
    },

    update_time: function(time_s) {
      this.current_time = time_s;
      
      if(this.punches.length==0) {
        if(this.current_index==-1) return;
        this.current_index = -1;
        this._on_punch_change();
        return;
      }

      if( parseFloat(time_s) < parseFloat(this.punches[0].time) && this.current_index!=-1 ) {
        this.current_index=-1;
        this._on_punch_change();
        return;
      }

      if(this.current_index==-1) {
        if(parseFloat(time_s) < parseFloat(this.punches[0].time) ) return;
        this.set_current_punch(time_s);
        return;
      }
      if( empty(this.current_punch) ) return;
      if(this.current_punch.occupies(time_s)) return;
      this.set_current_punch(time_s);
    },

    _on_list_change: function() {
      this.link_list();
      this.ev_fire('list_changed', this.punches);
    },

    _on_punch_change: function() {
      var punch = this.current_index==-1 ? new Punch(0,'No Chord') : this.current_punch;
      this.ev_fire('current_punch_changed', punch );
    }

  }
);
