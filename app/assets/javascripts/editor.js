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
  ytplayer.on_video_data( show_published_or_unpublished );
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
  id('publish').addEventListener('click', show_drop_down );
  id('unpublish').addEventListener('click', publish_song );
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
  $.post('/api/v1/add.json', JSON.stringify(songdata) )
    .done( function()     { swal("Success!", "Upload Successful!", "success"); songlist.fetch(); } )
    .fail( function(resp) { swal("Upload Failed!", resp.responseText, "error"); } );
}

function create_new_song() {
  addvid.reset();
  modal.show(addvid.dom)
}

function show_drop_down() {
  $('#meta-data').empty();
  $('#meta-data').append('<li><input type="text" id="artist" placeholder="Artist" class="form-control form-group" required></input></li>' +
                         '<li><input type="text" id="title" placeholder="Title" class="form-control form-group" required></input></li>' +
                         '<li><select id="genre" class="form-control form-group selectpicker"></select></li>' +
                         '<li><select id="difficulty" class="form-control form-group selectpicker"></select></li>' +
                         '<li><a id="btn-publish" class="btn btn-white" onclick="publish_song()">Publish</a></li>');
  $.get({
    url: "/api/v1/autocompletes/get_select_data.json",
    beforeSend: function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")}
  }).done(function( data ) {
    if (data != null) {
      keys = Object.keys(data)
      keys.forEach(function(key, key_index){
        $('#'+key).empty();
        $('#'+key).append($('<option>', { text: 'Select '+key}))
        data[key].forEach(function(obj, id){
          $('#'+key).append($('<option>', { value: obj.id, text: obj.name }));
        })
      })
    }
  });
}

function publish_song() {
  var metaData = {
    youtube_id: ytplayer.videodata.id,
    title:      $('#title').val(),
    artist:     $('#artist').val(),
    genre:      $('#genre').val(),
    difficulty: $('#difficulty').val()
  }
  $.post('/api/v1/update_songs_metadata.json', JSON.stringify(metaData) )
    .done( function(resp)     { swal("Success!", resp['message'], "success"); $('#publish').toggle(); $('#unpublish').toggle(); } )
    .fail( function(resp) { swal("Published Failed!", resp.responseText, "error"); } );
}

function show_published_or_unpublished() {
  if(ytplayer.videodata.published) {
    $('#publish').hide();
    $('#unpublish').show();
  } else {
    $('#unpublish').hide();
    $('#publish').show();
  }
}
//////////////////////////////////////// CLICK LISTENERS ///////////////////////////////////////////////////////