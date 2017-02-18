function PunchEditor(parent) {
  this.punch = new Punch(0, 'No Chord');
  this.build_dom(parent);
  this.bind_dom();
  this.load_styles();
}

PunchEditor.prototype = {
  constructor: PunchEditor,

  build_dom(parent) { this.dom = render(this.HTML);  if(!empty(parent)) parent.appendChild(this.dom); },
  bind_dom()        { rivets.bind(this.dom, { this: this }); },
  load_styles()     { load_css('puncheditor_styles', this.CSS); },

  on_punch_change(punch) { this.punch = punch; },
  jog_left()  { this.state.punch.jog(-100); },
  jog_right() { this.state.punch.jog(100);  },
  delete()    {  }

}

PunchEditor.prototype.HTML = `
  <div class='punch_editor'>
    <div>{this.punch.chord}</div>
    <span class='jog' rv-on-click='this.jog_left'>-</span>
    <span>{this.punch._display_time }</span>
    <span class='jog' rv-on-click='this.jog_right'>+</span>
    <br>
    <span rv-on-click='this.delete'>X</span>
  </div>
`.untab(2);

PunchEditor.prototype.CSS = `

`.untab(2);