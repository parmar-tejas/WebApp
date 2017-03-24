  function Palette(parent,chordpicker) {
    
  this.state = {
  	chords: []
  }

  this.chordpicker = chordpicker;
  this.build_dom(parent);
  this.setup_rivets();
  this.bind_handlers();
  this.load_styles();
  this.bind_dom();

}

Palette.prototype = {

  constructor: Palette,	

  build_dom(parent) { this.dom = render(this.HTML);  if(!empty(parent)) parent.appendChild(this.dom); },
  bind_dom()        { rivets.bind(this.dom, { data: this.state, obj: this }); },
  load_styles()     { load_css('changespicker_styles', this.CSS); },

  get_color(label)  {
    var ary = this.state.chords.filter(function(el) { return el.label == label; });
    if(ary.length==0) return(new Chord('No Chord').color);
    return ary[0]._color;
  },

  find_index(chord) { 
    var chord_matches_test = function(x) { return x.label == chord; };
    return this.state.chords.findIndex(chord_matches_test);
  },

  already_exists(chord) { return( this.find_index(chord) != -1 ) },

  setup_rivets() {
    rivets.binders['style-*'] = function(el, value) { el.style.setProperty(this.args[0], value); };
  },

  load(punches) {
    this.clear();
    this.state.chords.push(new Chord('No Chord'));
    for(var i=0; i<punches.length; i++) {                                 // For each punch
      if(this.state.chords.length==0) {                                   
        this.state.chords.push(new Chord(punches[i].chord)); continue;    // Add a new chord if the list is empty
      }
      for(var j=0; j<this.state.chords.length; j++) {                     // For each list item
        if(this.state.chords[j].matches(punches[i].chord))   break;       // Break if a match is found
        if(j != this.state.chords.length-1)                  continue;    // Keep checking until the end of the list
        this.state.chords.push(new Chord(punches[i].chord)); break;       // Add a new chord if no match has been found
      }
    }
  },

  highlight_chord(chord) {
    var idx = this.find_index(chord);
    var elems = this.dom.getElementsByClassName('chord');
    for(var i=0; i<elems.length; i++) {
      elems[i].style.boxShadow =  ( (i == idx) ? '.5em .5em .5em white, 0 0 .5em white' : '0 0 .1em white' );
      elems[i].style.textShadow =  ( (i == idx) ? '0 0 .1em white, 0 0 .5em white' : '' );
    }
  },

  bind_handlers: function() {
    this.get_chord = this.get_chord.bind(this);
    this.add_chord  = this.add_chord.bind(this);
    this.del_chord = this.del_chord.bind(this);
    this.sel_chord = this.sel_chord.bind(this);
  },

  get_chord(e,m) { this.ev_fire('get_chord', this.add_chord); },

  add_chord(chord) {
    if( this.already_exists(chord) ) return;
    this.state.chords.push( new Chord(chord) );
    this.highlight_chord(chord)
  },

  del_chord(e,m) {
    cancelEvent(e.originalEvent);
    this.state.chords.splice(m.index,1);
  },

  sel_chord(e,m) {
    this.ev_fire('selected', m.chord );
    if( ! isFunction(this.on_chord) ) return;
    this.on_chord(m.chord);
  },

  clear() {
    this.state.chords = [];
  }

}

Object.assign( Palette.prototype, ev_channel );

Palette.prototype.HTML = `

<div id='palette' class='chord-adder'>

  <div class='chords adder-holder adder-visible' ondrop="drop(event)" ondragover="allowDrop(event)">

    <div class='chord chord-added' rv-id="chord.color" draggable="true" ondragstart="drag(event, this)" rv-each-chord='data.chords' rv-on-click='obj.sel_chord'>
      <div class='color' rv-style-background-color='chord.color'></div>
      <div class='gloss'></div>
      <div class='delete delete-chord' rv-on-click='obj.del_chord'>X</div>
      <span class='label chord-name' rv-text='chord.label'></span>
    </div>

    <div class='chord addbtn add-chord-btn' rv-on-click='obj.get_chord'>
      <div class='gloss'></div>
      <span>+</span>
    </div>

  </div>

</div>

`;

Palette.prototype.CSS = `

  #palette {
    width: 80%;
    padding: 1em;
    overflow-x: auto;
    white-space: nowrap;
    margin: auto;
  }

  #palette .addbtn .label{
    font-size: 3em;
  }

  #palette .chord {
    /*display: inline-block;
    width: 5em;
    height: 6em;
    line-height: 6em;
    padding: 1em;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    margin: .5em;
    border: .01em solid black;
    font-weight: bold;
    border-radius: 0.5em;
    box-shadow: 0 0 .1em black;
    position: relative; */
  }

  #palette .delete {
    /*content: 'X';
    text-shadow: none;
    position: absolute;
    top: -.75em; left: -.75em;
    line-height: 1.5em;
    width: 1.5em; height: 1.5em;
    border: 0.1em solid black;
    border-radius: 0.75em;
    display: inline-block;
    font-family: sans-serif;
    box-shadow: 0 0 .1em black; */
  }

  #palette .color,
  #palette .gloss {
    diplay: inline-block;
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 0;
    border-radius: 28px;
  }

  #palette .gloss {
    z-index: 0;
  }
  
  #palette .label        { position: relative; z-index: 1; }

  #palette               { background-color: rgba(0,0,0,0.1);  }

  #palette .delete:hover { background-color: rgb(255,50,50);   }

  #palette .addbtn       { background-color: rgb(140,140,140); }

  #palette .chord:hover .gloss,
  #palette .addbtn:hover .gloss { background-color: rgba(255,255,255,0.3); }

  #palette .gloss {
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ffffff+0,ffffff+100&0.6+0,0+100;White+to+Transparent */
    /* background: -moz-linear-gradient(top,  rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%); /* FF3.6-15 */
    /* background: -webkit-linear-gradient(top,  rgba(255,255,255,0.6) 0%,rgba(255,255,255,0) 100%); /* Chrome10-25,Safari5.1-6 */
    /* background: linear-gradient(to bottom,  rgba(255,255,255,0.6) 0%,rgba(255,255,255,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    /* filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#99ffffff', endColorstr='#00ffffff',GradientType=0 ); /* IE6-9 */
  }

  #palette .delete {
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ff3019+0,cf0404+100;Red+3D */
    position: absolute;
    top: -8px;
    left: -7px;
    background: rgb(255,48,25); /* Old browsers */
    background: -moz-radial-gradient(center, ellipse cover,  rgba(255,48,25,1) 0%, rgba(207,4,4,1) 100%); /* FF3.6-15 */
    background: -webkit-radial-gradient(center, ellipse cover,  rgba(255,48,25,1) 0%,rgba(207,4,4,1) 100%); /* Chrome10-25,Safari5.1-6 */
    background: radial-gradient(ellipse at center,  rgba(255,48,25,1) 0%,rgba(207,4,4,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ff3019', endColorstr='#cf0404',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
  }

`;