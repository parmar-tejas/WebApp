function Modal(content) {
  this.content = content || null;
  this.build_dom(document.body);
  this.bind_dom();
  this.bind_handlers();
  this.load_styles();
}

Modal.prototype = {
  constructor: Modal,
  
  build_dom(parent_element) { this.dom = render(this.HTML);  if( ! empty(parent_element) ) parent_element.appendChild(this.dom); },
  bind_dom()                { rivets.bind(this.dom, { this: this }); },
  load_styles()             { load_css('modal_styles', this.CSS); },

  show(content) {
    this.content = content || this.content;
    if( empty( this.content ) ) return;
    this.dom.children[0].innerHTML = '';
    this.dom.children[0].appendChild(this.content);
    this.dom.style.display = 'inline-block';
  },

  show_toast(text,color,time) {
    var dom = render(`<div class='toast' style='background-color:${color};'>${text}</div>`);
    this.show(dom);
    if(time) { setTimeout(this.hide, time); }
  },

  show_loading(msg, time) {
    var dom = render(`<div class='loading'></div>`);
    this.show(dom);
    if(time) { setTimeout(this.hide, time); }
  },

  hide() {
    this.dom.style.display = 'none';
  }

}

Object.assign(
  Modal.prototype, {
    
    bind_handlers() { 
      this.on_exit_click = this.on_exit_click.bind(this);
      this.on_content_click = this.on_content_click.bind(this);
      this.hide = this.hide.bind(this);
    },

    on_exit_click(e,m)    { this.hide(); this.ev_fire('exit'); },
    on_content_click(e,m) { cancelEvent(e); }
  }
);

Object.assign(Modal.prototype, ev_channel);

Modal.prototype.HTML = `

  <div id='modal' rv-on-click='this.on_exit_click'>
    <div class='modal_content' rv-on-click='this.on_content_click'></div>
  </div>

`.untab(2);

Modal.prototype.TOAST = `
  <div id='toast'>
    
  </div>
`.untab(2);

Modal.prototype.CSS = `
  
  #modal {
  	position: absolute;
  	top: 0; bottom: 0;
  	left: 0; right: 0;
  	background: rgba(0,0,0,0.8);
    display: none;
    text-align: center;
    cursor: pointer;
    z-index: 99;  
  }

  #modal:before {
  	content: '';
  	display: inline-block;
    vertical-align: middle;
    height: 100%; 
  }

  #modal .modal_content {
    max-width: 70vw;
    max-height: 70vh;
  }

  #modal .modal_content {
    vertical-align: middle;
    display: inline-block;
    background: white;
    box-shadow: 0 0 1em black;
    padding: 1em;
  }

  #modal .toast,
  #modal .loading {
    width: 10em;
    padding: 3em;
    font-size: 2.5em;
    font-family: monospace;
    box-shadow: 0 0 0.4em black, 0 0 2em black inset;
  }

  #modal .loading {
    background-image: url('loading.gif');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

`.untab(2);