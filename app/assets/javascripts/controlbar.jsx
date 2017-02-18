function Controlbar(parent) {
  this.state = {
  	time_s: 0,
    punch: new Punch(0, 'No Chord'),
  	get clock() { return display_time(this.time_s, { tenths: true } ); }
  }
  this.build_dom(parent);
  this.bind_dom();
  this.load_styles();
  this.bind_handlers();
}

Controlbar.prototype = {
  constructor: Controlbar,

  build_dom(parent) { this.dom = render(this.HTML);  if(!empty(parent)) parent.appendChild(this.dom); },
  bind_dom()        { rivets.bind(this.dom, { data: this.state, this: this }); },
  load_styles()     { load_css('changespicker_styles', this.CSS); },

}

/////////////////////////////// HANDLERS /////////////////////////////////

Object.assign(
  Controlbar.prototype, {

    bind_handlers() {
      this.on_time_change  = this.on_time_change.bind(this);
      this.on_punch_change = this.on_punch_change.bind(this);
      this.jog_left        = this.jog_left.bind(this);
      this.jog_right       = this.jog_right.bind(this);
      this.delete          = this.delete.bind(this);
    },

    on_time_change(time_s) { this.state.time_s = time_s; },
    on_punch_change(punch) { console.log(punch); this.state.punch = punch; },
    jog_left()  { this.state.punch.jog(-100); },
    jog_right() { this.state.punch.jog(100);  },
    delete()    { this.state.punch.delete();  }
  }
);

/////////////////////////////// HANDLERS /////////////////////////////////

Controlbar.prototype.HTML = `
  <div id='controlbar'>
    <div class='clock'>{ data.clock < time_s }</div>
    <div class='group'>
      <div class='subgroup'>
        <div>Current Chord:<br>{data.punch.chord}</div>
      </div>
      <div class='subgroup'>
        <div>Start Time</div>
        <span class='jog' rv-on-click='this.jog_left'>Jog Left</span>
        <span>{data.punch._display_time}</span>
        <span class='jog' rv-on-click='this.jog_right'>Jog Right</span>
      </div>
      <div class='subgroup'>
        <span class='delete' rv-on-click='this.delete'>Delete<br>Chord</span>
      </div>
    </div>
  </div>
`;

Controlbar.prototype.CSS = `
  
#controlbar {
  display: inline-block;
  position: relative;
  height: 1.75em;
  padding: 0.3em;
}

#controlbar .clock {
  vertical-align: middle;
  display: inline-block;
  background: black;
  padding: 0.15em 0.4em;
  border-radius: 0.2em;
  color: rgb(0,128,0);
  box-shadow: 0 0 0.2em;
  font-family: 'ninepin';
  width: 9em;
  text-align: center;
  height: 2.5em;
  line-height: 2em;
  box-sizing: border-box;
  margin-right: 0.1em;
}

#controlbar .group {
  display: inline-block;
  background: rgb(50,50,50);
  color: rgb(100,255,100);
  border-radius: 0.2em;
  height: 2.5em;
  vertical-align: middle;
}

#controlbar .group::before {
  content: '';
  position: relative;
  height: 100%;
  vertical-align: middle;
  display: inline-block;
}

#controlbar .group button {
  color: rgb(100,255,100);
  background: rgb(50,50,50);
  cursor: pointer;
}

#controlbar .jog,
#controlbar .delete {
  display: inline-block;
  border: 1px solid rgb(100,255,100);
  width: 6em;
  cursor: pointer;
  margin: 0 1em;
  padding: 0.1em;
  font-size: 0.8em;
}

#controlbar .subgroup {
  display: inline-block;
  padding: 0 1em;
  font-size: 0.8em;
  vertical-align: middle;
}

`;