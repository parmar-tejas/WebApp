function InputWithDefault(default_value) {

  this.default_value = default_value; 
  this.active_color  = 'black';
  this.default_color = 'grey';
  this.build_dom();
  this.set_handlers();
  this.set_default();
}

InputWithDefault.prototype = {
  constructor: InputWithDefault,

  get value()      { return this.input.value; },
  get is_default() { return this.input.value == this.default_value; },

  on_focus() {
    if(this.is_default) { this.clear_default(); }
    else { this.input.select(); }
  },

  on_blur() { if(this.input.value=='') { this.set_default(); } },

  set_default() {
    this.input.value       = this.default_value;
    this.input.style.color = this.default_color;
  },

  clear_default() {
  	this.input.value = ''; 
  	this.input.style.color = this.active_color;
  },

  set_handlers() {
    this.on_blur  = this.on_blur.bind(this);
    this.on_focus = this.on_focus.bind(this);
    this.input.addEventListener( 'blur',  this.on_blur.bind(this) );
    this.input.addEventListener( 'focus', this.on_focus.bind(this) );
  },

  build_dom() {
  	this.input  = document.createElement('input');
  	this.dom = document.createElement('div');
    this.dom.id = 'InputWithDefault';
  	this.dom.appendChild(this.input);
  	return this.dom;
  }

}

//Object.assign( InputWithDefault.prototype, ev_channel );