data = {
  songs: []
}

/////////////////////////////////////////////// SETUP /////////////////////////////////////////////////////////

$(document).ready(function() {
  
  remove_facebook_redirect_hash();

  punchlist = new Punchlist();
  chordlib  = new Chordlib();
  
  modal     = new Modal();
  addvid    = new AddVid();

  userview    = new UserView(   id('userview_container')  );
  ytplayer    = new YTPlayer(   id('ytplayer_container')  );
  fretboard   = new Fretboard(  id('fretboard_container') );
  ctrlbar     = new Controlbar( id('ctrlbar_container')   );
  timeline    = new Timeline(   id('timeline_container')  );
  palette     = new Palette(    id('palette_container')   );
  picker      = new chordpicker();

  songlist  = new Songlist(null, 'api/v1/mysongs');

  //PunchEditorr = new PunchEditor( id('puncheditor_container') );

  //songlist.ev_sub('list_loaded', function()     { load_song( songlist.random ); } );
  songlist.ev_sub('selected',    function(song) { load_song( song ); modal.hide(); } );

  timeline.on_scrub  = function(time_s)      { ytplayer.current_time = time_s; } 
  timeline.get_color = function(chord_label) { return palette.get_color(chord_label); } 

  ytplayer.on_time_change( timeline.update_time   );
  ytplayer.on_time_change( punchlist.update_time  );
  ytplayer.on_time_change( ctrlbar.on_time_change );
  ytplayer.on_video_data( on_video_data ); 
  ytplayer.ev_sub( 'duration', timeline.set_duration );
  
  palette.ev_sub( 'selected', add_chord_now );
  palette.ev_sub( 'get_chord', picker.get_new_chord );

  punchlist.ev_sub( 'list_changed', timeline.load );
  punchlist.ev_sub( 'current_punch_changed', current_punch_changed );
  punchlist.ev_sub( 'current_punch_changed', ctrlbar.on_punch_change );
  //punchlist.ev_sub( 'current_punch_changed', puncheditor.on_punch_change );

  addvid.ev_sub( 'add_video', load_new_song );

  add_click_listeners();
  
});

/////////////////////////////////////////////// SETUP /////////////////////////////////////////////////////////

function remove_facebook_redirect_hash() {
  history.pushState("", document.title, window.location.pathname);
}

function load_new_song(url_or_id) {
  modal.hide();
  palette.clear();
  punchlist.clear();
  ytplayer.load(url_or_id);

}

function load_song(song) {
  fretboard.reset();
  var punches = [];
  for(var i=0; i<song.punches.length; i++) {
    punches.push( new Punch(song.punches[i].time, song.punches[i].chord) );
  }
  punchlist.load(punches);
  palette.load(punches);
  ytplayer.load(song.youtube_id);
}

function on_video_data() {
  punchlist.update_time(0);
}

function current_punch_changed(punch) {
  fretboard.load_chord(chordlib.get_chord(punch.chord));
  palette.highlight_chord(punch.chord);
}

function add_chord_now(chord) {
  console.log(chord);
  punchlist.add_punch( { time: ytplayer.current_time , chord: chord.label } );
} 


//////////////////////////////////////// CLICK LISTENERS ///////////////////////////////////////////////////////

function add_click_listeners() {
  id('create-btn').addEventListener('click', create_new_song );
  id('edit').addEventListener('click', edit_menu );
  id('save_work').addEventListener('click', save_work );
}

function to_player() {
  window.location = '/';
}

function edit_menu() {
  modal.show(songlist.dom);
}

function open_new() {
  addvid.reset();
  modal.show(addvid.dom)
}

function save_work() {
  var songdata = {
    youtube_id: ytplayer.videodata.id,
    title: ytplayer.videodata.title,
    chords: punchlist.to_models()
  }
  modal.show_loading();
  $.post('/api/v1/add.json', JSON.stringify(songdata) )
    .done( function()     { modal.show_toast('Upload Successful!', 'green', 1000); songlist.fetch(); } )
    .fail( function(resp) { modal.show_toast("Upload Failed! \n" + resp.responseText, 'red'); } );
}

function create_new_song() {
  addvid.reset();
  modal.show(addvid.dom)
}
//////////////////////////////////////// CLICK LISTENERS ///////////////////////////////////////////////////////