function AddVid(parent) {
  this.build_dom(parent);
  this.get_dom_refs();
  this.load_styles();
  this.bind_handlers();
}

AddVid.prototype = {
  constructor: AddVid,

  build_dom(parent) { this.dom = render(this.HTML);  if(!empty(parent)) parent.appendChild(this.dom); },
  load_styles()     { load_css('addvid_styles', this.CSS); },

  get_dom_refs() {
    this.input = new InputWithDefault('Paste the link to your YouTube video here...');
    this.button = this.dom.getElementsByTagName('button')[0];
    this.dom.insertBefore(this.input.dom, this.button);
  },

  bind_handlers() {
    this.reset = this.reset.bind(this);
    this.on_submit = this.on_submit.bind(this);
    this.button.addEventListener('click', this.on_submit );
  },

  reset() {
    this.input.set_default();
  }
}

Object.assign( AddVid.prototype, ev_channel );

Object.assign(
  AddVid.prototype, {
    on_submit() {
      this.ev_fire('add_video', this.input.value);
    }
  }
)

AddVid.prototype.HTML = `
  <div id='addvid'>
    <button>Add</button>
  </div>
`.untab(2);

AddVid.prototype.CSS = `

  #addvid {
    display: inline-block;
    word-break: keep-all;
    padding: 0.5em;
  }

  #addvid input {
    display: inline-block;
    width: 25em;
    font-size: 1.5em;
    padding: 0.5em 1em;
    border-radius: 1em 0 0 1em;
  } 

  #addvid button {
    display: inline-block;
    font-size: 1.5em;
    padding: 0.5em 1em;
    border-radius: 0 1em 1em 0;
    cursor: pointer;
  }

  #addvid #InputWithDefault {
    display: inline-block;
  }

`.untab(2);