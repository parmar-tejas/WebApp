data = {
  songs: []
}

/////////////////////////////////////////////// SETUP /////////////////////////////////////////////////////////

$(document).ready(function() {

  window.scrollTo(0,1);

  modal     = new Modal();
  feedback  = new FeedbackForm();
  punchlist = new Punchlist();
  chordlib  = new Chordlib();
  songlist  = new Songlist();

  load_promotion_video()

  userview  = new UserView(  id('userview_container')  );
  ytplayer  = new YTPlayer(  id('ytplayer_container')  );
  fretboard = new Fretboard( id('fretboard_container') );
  timeline  = new Timeline(  id('timeline_container')  );
  palette   = new Palette();

  songlist  = new Songlist( id('songlist_container'), 'api/v1/songs/list.json');

  feedback.ev_sub('done', modal.hide );
  modal.ev_sub('exit', function() { songlist.mount(id('songlist_container')); });

  //songlist.ev_sub('list_loaded', function()     { load_song( songlist.random ); } );
  songlist.ev_sub('selected',    function(song) { load_song( song ); modal.hide(); songlist.mount(id('songlist_container')); load_related_songs(song); } );

  timeline.on_scrub  = function(time_s) { ytplayer.current_time = time_s; } 
  timeline.get_color = function(chord_label) { return palette.get_color(chord_label); } 

  ytplayer.on_time_change( timeline.update_time  );
  ytplayer.on_time_change( punchlist.update_time );

  ytplayer.on_video_data(on_video_data); 

  ytplayer.ev_sub('duration', function(duration) { timeline.set_duration(duration); })
  ytplayer.ev_sub('ended', function() { timeline.update_time(); } )

  punchlist.ev_sub( 'current_punch_changed', function(punch) {
    fretboard.load_chord(chordlib.get_chord(punch.chord));
    set_ambient_color(palette.get_color(punch.chord));
  });

  add_click_listeners();
});

/////////////////////////////////////////////// SETUP /////////////////////////////////////////////////////////

function load_song(song) {
  fretboard.reset();
  var punches = [];
  for(var i=0; i<song.punches.length; i++) {
    punches.push( new Punch(song.punches[i].time, song.punches[i].chord) );
  }
  punchlist.load(punches);
  palette.load(punches);
  timeline.load(punches);
  ytplayer.load(song.youtube_id);
}

function on_video_data() {
  punchlist.update_time(0);
}

function load_related_songs(song) {
  var data = {
    youtube_id: song.youtube_id
  }
  $.get({
    url: "/api/v1/get_related_songs.json",
    data: data,
    beforeSend: function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")}
  }).done(function( data ) {
    $('#related_songs_container').empty();
    if (data.length > 0) {
      data.forEach(function(obj){
        $('#related_songs_container').append('<div class="col-sm-3"><img src="http://img.youtube.com/vi/'+ obj.youtube_id +'/1.jpg"></img></div>');
      })
    }
  });
}

function load_promotion_video() {
  $.get({
    url: "/api/v1/get_promotion_video.json",
    beforeSend: function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")}
  }).done(function( data ) {
      ytplayer.load(data['video_id'])
      video_id = data['video_id'];
  });
}

////////////////////////////////////////// CLICK LISTENERS ///////////////////////////////////////////////////

function add_click_listeners() {
  //id('get_fretx').addEventListener('click', goto_indiegogo );
  id('share').addEventListener('click', share_on_fb );
  id('view_songs').addEventListener('click', open_new_song );

  //var menuitems = id('appmenu').children;
  //menuitems[0].addEventListener('click', open_new_song  );
  //menuitems[1].addEventListener('click', goto_indiegogo );
  //menuitems[2].addEventListener('click', get_feedback   );
}

function open_new_song(e) {
  modal.show(songlist.dom);
  cancelEvent(e)
}

function to_editor(e) {
  window.location = '/editor';
}

function goto_indiegogo(e) { 
  window.location.href = "http://fretx.rocks";
  cancelEvent(e);
}

function share_on_fb(e) {
  window.location.href = "http://facebook.com/sharer/sharer.php?u=http%3A%2F%2Fplayer.fretx.rocks?id=" + ytplayer.video_id;
  cancelEvent(e);
}

function get_feedback(e) {
  modal.show(feedback.dom);
  cancelEvent(e);
}

////////////////////////////////////////// CLICK LISTENERS ///////////////////////////////////////////////////


////////////////////////////////////////// COLOR EFFECTS /////////////////////////////////////////////////////

function set_ambient_color(color) {
  //id('fretboard_container').style.boxShadow = `0 0 0.2em ${color} inset, 0 0 0.5em black`;
 // document.body.style.boxShadow = `0 0 1vw ${color} inset`;
  // = build_header_gradient(color);
}

function build_header_gradient(color) {
  return `
    background: white; /* Old browsers */
    background: -moz-linear-gradient(    top,       white 0%, rgba(221,241,249,1) 35%, ${color} 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient( top,       white 0%, rgba(221,241,249,1) 35%, ${color} 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(         to bottom, white 0%, rgba(221,241,249,1) 35%, ${color} 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  `.untab(2);
}