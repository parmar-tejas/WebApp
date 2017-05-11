function Timeline(parent,palette) {
  this.state = {
    punches: [ ],
    duration: 10,
    scale_factor: 15,
    elapsed_time: 0,
    zoom: 1
  };
  this.palette = palette;
  this.link_punches();
  this.setup_rivets();
  this.bind_handlers();
  this.build_dom(parent);
  this.get_dom_refs();
  this.bind_dom();
  this.load_styles();
  this.draw_scale();
  this.set_drag_handlers();
  this.set_resize_handlers();
}

Timeline.prototype = {
  
  load(punches) {
    this.state.punches = punches;
    this.link_punches();
    this.draw_chords();
    this.draw_scale();
  },

  link_punches() {
    this.state.punches.forEach(function(e,i,a) {
      e.next_node = ( i + 1 < this.state.punches.length ) ? this.state.punches[i+1] : new Punch(this.state.duration,'No Chord');
    }.bind(this));
  },

  build_dom(parent) { this.dom = render(this.HTML);  if(!empty(parent)) parent.appendChild(this.dom); },
  bind_dom()        { rivets.bind(this.dom, { data: this.state, obj: this }); },
  load_styles()     { load_css('timeline_styles', this.CSS); },

  get_dom_refs() {
    //this.indicator = this.dom.getElementsByClassName('indicator')[0];
    this.scale     = this.dom.getElementsByClassName('scale')[0];
    this.chordline = this.dom.getElementsByClassName('chords')[0];
  },
  
  bind_dom: function() {
    rivets.bind(this.dom, { data: this.state } );
  },

  setup_rivets: function() {
    rivets.formatters.em      = function(arg)       { return arg*2 + 'em'; }
    rivets.binders['style-*'] = function(el, value) { el.style.setProperty(this.args[0], value); };
  },

  set_duration(value) {
    console.log(`timeline duration set: ${value}`);
    this.state.duration = value;
    this.link_punches();
    this.draw_scale();
    this.draw_chords();
  },

  render() {
    this.update_font_size_px();
    this.draw_scale();
    this.draw_chords();
  },

  update_time(time_s) {
      if(this._scrubbing) return;
      this._update_time(time_s);
  },

  bind_handlers() {
    this.set_duration = this.set_duration.bind(this);
    this.update_time  = this.update_time.bind(this);
    this.load         = this.load.bind(this);
    this.render       = this.render.bind(this);
  },

  _update_time(time_s) {
    let width_px = this.s_to_px(time_s);
    $('#timeline .chords').width(width_px + $('#timeline').width()/2);
    // this.indicator.style.width = width_px + 'px';
    // this.indicator.style.minWidth = $('#timeline').width()/2 + 'px';
    this.dom.scrollLeft = width_px
  },

  s_to_ems(time_s) { return time_s * this.state.scale_factor * this.state.zoom; },
  ems_to_s(ems)    { return ems    / (this.state.scale_factor * this.state.zoom); },
  ems_to_px(ems)   { return ems * this.font_size_px; },
  px_to_ems(px)    { return px  / this.font_size_px; },
  s_to_px(time_s)  { return this.ems_to_px(this.s_to_ems(time_s)); },
  px_to_s(px)      { return this.ems_to_s( this.px_to_ems( px ) ); },

  
  get font_size_px()    { return this._font_size_px || this.update_font_size_px(); },
  update_font_size_px() { this._font_size_px = parseFloat( getComputedStyle(this.dom).fontSize ); return this._font_size_px; },

  set_resize_handlers() {
    window.onresize = this.render;
    window.addEventListener("orientationchange", this.render, false);
  }
}

//////////////////////////////////// RENDERING ////////////////////////////////////

Object.assign( Timeline.prototype, {

  draw_scale() {
    this.scale.innerHTML = '';
    var i=1;
    for(; i<this.state.duration; i++) {
      tick = this.generateTick(i,1);
      if(this.state.zoom == 0.75){
        i += 2
        tick = this.generateTick(i,3);
      }
      else if(this.state.zoom == 0.5){
        i += 3
        tick = this.generateTick(i,4);
      }
      else if(this.state.zoom == 0.25){
        i += 4
        tick = this.generateTick(i,5);
      }
      this.scale.appendChild(tick);
    }
    let tick = this.generateTick(null,this.state.duration-i+1);
    this.scale.appendChild(tick);
  },

  draw_chords() {
    this.chordline.innerHTML = '';
    for(var i=0; i<this.state.punches.length; i++) {
      let chord = this.generateChordElement(this.state.punches[i]);
      if(i==0) { chord.style.marginLeft = this.s_to_ems(this.state.punches[0].time) + 'em'; }
      this.chordline.appendChild(chord);
    }
  },

  generateTick(time,duration) {
    let width = `width: ${this.s_to_px(duration) + 'px'};`; 
    return render(`<div class='tick' style='${width}'>${display_time(time,{ no_hours: true, no_ms: true })}</div>`);
  },

  generateChordElement(punch,offset) { 
    var width = `width: ${ this.s_to_px(punch.duration_s) + 'px'}; `;
    var color = isFunction(this.get_color) ? `background: ${this.get_color(punch.chord)}; ` : '';
    return render(`
      <div id='${punch.time}' class='chord resize-drag' style='${width}${color}' >
        <div class='gloss'></div>
        <div class='chordname'>${punch.chord}</div>
        <div class='delete' onClick="Punchlist.prototype.del_punch_from_time('${punch._time}')" >X</div>
      </div>
    `.untab(6));
  }

});

//////////////////////////////////// RENDERING ////////////////////////////////////


////////////////////////// MANUAL SCROLLING //////////////////////////////////////

Object.assign( Timeline.prototype, {
  
  set_drag_handlers() {
    this._scrubbing = false;
    this._lastPosition = null;
    this._delta = null;
    this.dom.addEventListener('touchstart',  this.on_mouse_down.bind(this)  );
    this.dom.addEventListener('mousedown',   this.on_mouse_down.bind(this)  );
    this.dom.addEventListener('touchmove',   this.on_mouse_move.bind(this)  );
    this.dom.addEventListener('mousemove',   this.on_mouse_move.bind(this)  );
    this.dom.addEventListener('touchend',    this.on_mouse_up.bind(this)    );
    this.dom.addEventListener('mouseup',     this.on_mouse_up.bind(this)    );
    this.dom.addEventListener('mouseenter',  this.on_mouse_enter.bind(this) );
  },

  on_mouse_down(e) {
    this._scrubbing = true;
    this._lastPosition = e.clientX;
  },

  on_mouse_move(e) {
    if( ! this._scrubbing ) return;
    let delta = e.clientX - this._lastPosition;
    if( Math.abs(delta) < 50 ) return;
    //console.log(delta);
    this.dom.scrollLeft = this.dom.scrollLeft - delta;
    this._lastPosition = e.clientX;
    this._on_scrub(this.dom.scrollLeft);  
  },

  on_mouse_up() {
    this._scrubbing = false;
  },

  on_mouse_enter(e) {
    if(e.buttons==0) this._scrubbing = false;
  },

  _on_scrub(px) {
    if( ! isFunction(this.on_scrub) ) return;
    let elapsed_px = px
    let elapsed_s  = this.px_to_s(elapsed_px);
    //console.log(elapsed_px);
    //console.log(elapsed_s);
    this._update_time(elapsed_s);
    this.on_scrub(elapsed_s);
  }

});

////////////////////////// MANUAL SCROLLING //////////////////////////////////////



Timeline.prototype.HTML = `
  <div id='timeline' class="chord-holder">
    <div class='chords' ondrop="drop(event)" ondragover="allowDrop(event)"></div>
    <div class='scale'></div>
  </div>
`.untab(2);

Timeline.prototype.CSS = `

#timeline {
  overflow: hidden;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

#timeline:active {
  cursor: grabbing;
  cursor: -moz-grabbing
  cursor: -webkit-grabbing;
}

#timeline .chords {
  display: table;
  padding-bottom: 0.5em;
  white-space: nowrap;
  position: relative;
  z-index: 1;
  height: 73px;
  width: 100%;
  vertical-align: middle;
  margin-left: 50%;
}


#timeline .chord {
  position: relative;
  display: inline-block;
  padding: 0.5em 1em;
  text-align: left;
  border-radius: 100px;
  /* border: 0.1em solid black;
  box-shadow: 0 0 0.1em black; */
  box-sizing: border-box;
  overflow: hidden;
  font-family: sans-serif;
  font-weight: bold;
  font-family: 'CamptonSB';
  text-shadow: 0 2px 4px rgba(0,0,0,0.28);
}

#timeline .chord::before {
  content: '';
  display: inline-block;
  vertical-align: middle;
  height: 100%;
}

#timeline .chord .chordname {
  position: relative;
  z-index: 1;
  display: inline-block;
  vertical-align: middle;
  color: white;
  font-family: 'CamptonSB';
  font-size: 21pt;
  text-shadow: 0 2px 4px rgba(0,0,0,0.28);
}

#timeline .scale {
  cursor: move;
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
  height: 30px;
  white-space: nowrap;
  position: relative;
  z-index: 1;
  margin-top: -4px;
  margin-left: 50%;
}

#timeline .scale .tick {
  vertical-align: top;
  display: inline-block;
  width: 1px;
  height: 1.2em;
  text-align: right;
  padding-right: 0.1em;
  color: white;
  font-family: 'CamptonSB';
  font-size: 12pt;
}

#timeline .indicator {
  background: rgba(0,0,0,0);
  z-index: 1;
  position: absolute;
  display: inline-block;
  left: 0;
  top: 0;
  bottom: 0;
}

#timeline .chord .gloss {
  display: none;
  position: absolute;
  top: 0; bottom: 0;
  left: 0; right: 0;
  border-radius: 1em;
}

#timeline .gloss {
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ffffff+0,ffffff+100&0.6+0,0+100;White+to+Transparent */
  background: -moz-linear-gradient(top,  rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top,  rgba(255,255,255,0.6) 0%,rgba(255,255,255,0) 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom,  rgba(255,255,255,0.6) 0%,rgba(255,255,255,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#99ffffff', endColorstr='#00ffffff',GradientType=0 ); /* IE6-9 */
}

.chord .delete {
  height: 1.5em;
  width: 1.5em;
  border: 0.1em solid white;
  border-radius: 1em;
  box-shadow: 0 0 .1em black;
  text-align: center;
  background-color: rgb(255,50,50);
  position: absolute;
  color: white;
  cursor: pointer;
  right: 10px;
  top: 19px;
  z-index: 1;
  font-size: 11pt;
}

`;