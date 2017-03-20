$(document).click(function(event) {
  if(!$(event.target).is('.gloss')){
   $('#chordpicker').hide();
  }
})

function chordpicker() {
  this.mainContainer = document.createElement('div')
  this.container = document.createElement('div');
  this.container.className = 'chordpicker dropdown-menu';
  this.container.id = 'chordpicker';
  this.mainContainer.className = 'dropup'
  this.rootlist = new rootlist();
  this.qualitylist = new qualitylist();
  
  this.rootlist.on_root_change = this.on_root_change.bind(this);
  this.qualitylist.on_quality_change = this.on_quality_change.bind(this);
  this.container.onclick = this.on_container_click.bind(this);

  this.bind_handlers();

  this.container.appendChild(this.qualitylist.dom);
  this.container.appendChild(this.rootlist.dom);
  this.mainContainer.appendChild(this.container)
  document.body.appendChild(this.mainContainer);
  this.load_styles();
}

chordpicker.prototype = {
  constructor: chordpicker,

  load_styles()     { load_css('chordpicker_styles', this.CSS); },

  show() { this.container.style.display = 'block'; },
  hide() { this.container.style.display = 'none'; },

  bind_handlers() {
    this.get_new_chord = this.get_new_chord.bind(this);
  },

  set_chord(name) {
  	if(name == 'No Chord') { 
  	  this.rootlist.set_root(name); 
      this.qualitylist.set_quality('Maj');
  	  this.qualitylist.hide();
  	  return;
  	}
  	var arr = name.split(' ');
    this.rootlist.set_root(arr[0]);
    this.qualitylist.set_quality(arr[1]);
    this.qualitylist.show();
  },

  get_chord(cb) {
  	this.show();
    this.callback = cb;
  },

  get_new_chord(cb) {
    this.set_chord('No Chord');
    this.get_chord(cb);
  },

  chordname() {
  	if(this.rootlist.label == 'No Chord') return 'No Chord'
  	return `${this.rootlist.label} ${this.qualitylist.label}`;
  }
}

//////////////////////////// CLICK HANDLERS ////////////////////////////////////

Object.assign(
  chordpicker.prototype, {

    on_root_change: function(rootitem) {
      this.rootitem = rootitem;
      if ( this.rootitem.label == 'No Chord' ) { this.close(); }
      else { this.qualitylist.dom.style.display = 'flex'; }
    },

    on_quality_change: function(qualitem) {
      this.qualitem = qualitem;
      this.close();
    },
  
    on_container_click: function() { 	  
  	  this.close();
    },

    close: function() {
      if( this.callback != undefined) { this.callback(this.chordname()); }
      this.hide();
    }	
  }
)

//////////////////////////// CLICK HANDLERS ////////////////////////////////////

//////////////////////////////// LISTS /////////////////////////////////////////

function rootlist() {
  this.value = 0;
  this.label = 'No Chord'
  this.dom   = this.build_list();
}

rootlist.prototype = {
  constructor: rootlist,

  build_list: function() {
    this.elements = [];
    var div_list = make('div', 'roots_div', null);
    var list = make('ul', 'roots', null);
    for(var i=0; i<this.roots.length; i++) {
      list.appendChild(this.build_root(this.roots[i]));
    }
    div_list.appendChild(list);
    return div_list;
  },

  build_root: function(obj) {
  	if( !(obj instanceof Array) ) return this.list_item(obj);
    item = document.createElement('li');
    item.appendChild( this.list_item(obj[0]) );
    item.appendChild( this.list_item(obj[1]) );
    return item;
  },

  list_item: function(obj) {
  	var item = render(`<li data-note="${obj.val}">${obj.label}</li>`);
  	this.elements.push(item);
  	item.onclick = this.on_click.bind(this);
    return item;
  },

  on_click: function(e) {
  	cancelEvent(e);
  	this.set_root.call(this,e.target.innerHTML);
	this.on_root_change({ value: this.value, label: this.label });
  },

  set_root: function(label) {
    for(var i=0; i<this.elements.length; i++) {
      if( this.elements[i].innerHTML != label ) { this.elements[i].className = ''; continue; }
      this.value = this.elements[i].getAttribute('data-note');
      this.label = this.elements[i].innerHTML;
      this.elements[i].className = 'sel';
      if(this.value == 0){
        this.elements[i].setAttribute("draggable", true);
        this.elements[i].setAttribute("id", this.elements[i].innerHTML);
        this.elements[i].addEventListener('dragstart', function() {drag(event, this)}, false);
      }
    }
  },

  roots: [
    { val:12, label:'B' }, [  
      { val:11, label:'A#' },
      { val:11, label:'Bb' }],
    { val:10, label:'A' }, [
      { val: 9, label:'G#' },
      { val: 9, label:'Ab' }],
    { val: 8, label:'G' }, [
      { val: 7, label:'F#' },
      { val: 7, label:'Gb' }],
    { val: 6, label:'F' },
    { val: 5, label:'E' }, [
      { val: 4, label:'D#' },
      { val: 4, label:'Eb' }],
    { val: 3, label:'D' }, [
      { val: 2, label:'C#' },
      { val: 2, label:'Db' }],
    { val: 1, label:'C' },
    { val: 0, label:'No Chord' }
  ]
}

function qualitylist() { 
  this.label = 'Maj';
  this.dom = this.build_list();
}

qualitylist.prototype = {
  constructor: qualitylist,

  show: function() { this.dom.style.display = 'inline-flex'; },
  hide: function() { this.dom.style.display = 'none';    },

  build_list: function() {
  	this.elements = [];
    var div_list = make('div', 'qualities_div', null);
  	var list = make('ul', 'qualities', null);
    for(var i=0; i<this.qualities.length; i++) {
      list.appendChild( this.list_item( this.qualities[i] ) );
    }
    div_list.appendChild(list);
    return div_list;
  },

  list_item: function(obj) {
  	var item = render(`<li>${obj.label}</li>`);
  	this.elements.push(item);
  	item.onclick = this.on_click.bind(this);
  	return item;
  },

  on_click: function(e) {
    cancelEvent(e);
    for(var i=0; i<this.elements.length; i++) this.elements[i].className = '';
    this.label = e.target.innerHTML;
    e.target.className = 'sel';
    this.on_quality_change( { label: this.label } );
  },

  set_quality: function(label) {
    for(var i=0; i<this.elements.length; i++) {
      this.elements[i].setAttribute("draggable", true);
      this.elements[i].setAttribute("id", this.elements[i].innerHTML);
      this.elements[i].addEventListener('dragstart', function() {drag(event, this)}, false);
      if( this.elements[i].innerHTML != label ) { this.elements[i].className = ''; continue; }
      this.label = this.elements[i].innerHTML;
      this.elements[i].className = 'sel';
    }
  },

  qualities: [
    { label: 'Maj'   },
    { label: 'min'   },
    { label: '5'     },
    { label: '7'     },
    { label: 'Maj7'  },
    { label: 'm7'    },
    { label: 'sus4'  },
    { label: 'add9'  },
    { label: 'sus2'  },
    { label: '7sus4' },
    { label: '7#9'   },
    { label: '9'     }
  ]
}

//////////////////////////////// LISTS /////////////////////////////////////////

chordpicker.prototype.CSS = `

  .chordpicker {
    max-width: 960px !important;
    overflow: auto;
    background: none;
    box-shadow: none;
    border: none;
  }
  .chordpicker div {
    max-width: 960px !important;
    overflow: auto;
  }
  .chordpicker ul {
    display: inline-flex;
    list-style: none;
    padding: 15px;
    margin: 0;
    vertical-align: middle;
    background: white;
    margin-bottom: 10px;
  }

  .chordpicker li {
    cursor: pointer;
    box-sizing: border-box;
  }

  .chordpicker li.sel {
    box-shadow: 0 0 10px white inset;
    background-color: rgba(230,130,130,1);
  }

  .chordpicker .roots li:not([data-note]) {
    position: relative;
    display: flex;
  }

  .chordpicker .roots li[data-note],
  .chordpicker .qualities li {
    background-color: rgba(200,100,100,1);
    padding: 20px 4px !important;
    margin: 4px;
    width: 65px;
    height: 65px;
    border-radius: 20px;
    color: #fff;
    font-family: 'GothamRM';
    color: #FFFFFF;
    top: 50%;
    text-align: center;
    padding: 25px 0;
    background-image: linear-gradient(-180deg, #393939 3%, #191919 100%);
    border: 2px solid #FCFCFC;
    box-shadow: 0 1px 3px 0 rgba(255,255,255,0.47);
    cursor: pointer;
  }

  .chordpicker .roots li[data-note]:hover,
  .chordpicker .qualities li:hover {
    background-color: rgba(250,150,150,1);
  }

  .chordpicker .roots li li[data-note] {
    width: 65px;
    height: 65px;
    border-radius: 20px;
    color: #fff;
    font-family: 'GothamRM';
    color: #FFFFFF;
    top: 50%;
    text-align: center;
    padding: 20px 4px !important;
    background-image: linear-gradient(-180deg, #393939 3%, #191919 100%);
    border: 2px solid #FCFCFC;
    box-shadow: 0 1px 3px 0 rgba(255,255,255,0.47);
    cursor: pointer;
  }

  .chordpicker .qualities_div {
    display: none;
  }

  .dropdown-menu:before {
    position: absolute;
    left: 50%;
    content: '';
    background: -webkit-linear-gradient(-90deg, #edeceb 0%, #edeceb 100%);
    -webkit-border-radius:6px;
  }

  .dropdown-menu:after {
    position: absolute;
    left: 50%;
    content: '';
    background: -webkit-linear-gradient(-90deg, #edeceb 0%, #edeceb 100%);
    -webkit-border-radius:6px;
  }

  .dropup {
    margin-left: 240px;
    margin-top: -100px;
  }

`.untab(2);