function Songlist(parent,path) {
  this.state = {
  	songs: [],
  	filtered_songs: [],
  	search_text: '',
    path: path
  }

  this.bind_handlers();
  this.build_dom(parent);
  this.get_dom_refs();
  this.load_styles();
  this.bind_dom();
  this.fetch();
  // this.load_search_data();
}

Songlist.prototype = {
  constructor: Songlist,

  build_dom:   function(parent) { this.dom = render(this.HTML); this.mount(parent); },
  load_styles: function()       { load_css('timeline_styles', this.CSS); },
  bind_dom:    function()       {
    rivets.formatters.img_url = function(val) { return `//img.youtube.com/vi/${val}/1.jpg`; }
  	rivets.bind(this.dom, { data: this.state, this: this }); 
  },

  mount(parent) { if(!empty(parent)) { parent.innerHTML = ''; parent.appendChild(this.dom); } },

  fetch()        { /*$.get(this.state.path, this.on_song_list ).fail(this.on_load_failed);*/ },
  get_dom_refs() { this.input = this.dom.getElementsByTagName('input')[0]; },

  get length()  { return this.state.songs.length; },
  get random()  { return this.state.songs[ Math.floor( Math.random() * this.length ) ]; },

  reset_filter() {
    this.state.filtered_songs = this.state.songs;
    this.input.value = "Search";
    this.input.style.color = 'grey';
  }

  // load_search_data() {
  //   $.get({
  //     url: "/api/v1/autocompletes/get_select_data.json",
  //     beforeSend: function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")}
  //   }).done(function( data ) {
  //     if (data != null) {
  //       keys = Object.keys(data)
  //       keys.forEach(function(key, key_index){
  //         $('#'+key).empty();
  //         $('#'+key).append($('<option>', { text: 'Select '+key}))
  //         data[key].forEach(function(obj, id){
  //           $('#'+key).append($('<option>', { value: obj.id, text: obj.name }));
  //         })
  //       })
  //     }
  //   });
  // }

}

//////////////////////////////// HANDLERS //////////////////////////////////////////////

Object.assign( 
  Songlist.prototype, {

    bind_handlers() {
      this.on_click          = this.on_click.bind(this);
      this.on_song_list      = this.on_song_list.bind(this);
      this.on_search         = this.on_search.bind(this);
      this.on_input_focus    = this.on_input_focus.bind(this);
      this.on_input_blur     = this.on_input_blur.bind(this);
      this.on_load_failed    = this.on_load_failed.bind(this);
      this.get_searched_song = this.get_searched_song.bind(this);
      this.mount             = this.mount.bind(this);
    },

    on_click(e,m)      { this.select(m.index); },
    on_song_list(list) { this.state.songs = list; this.list_loaded(); },

    on_search(e)  { 
      if( e.target.value == '' || e.target.value == 'Search' ) { this.state.filtered_songs = this.state.songs; return; }
      var byNameFilter = function(song) { return song.title.toLowerCase().indexOf(e.target.value.toLowerCase())!=-1; }
      this.state.filtered_songs = this.state.songs.filter( byNameFilter );
    },

    get_searched_song() {
      data = {
        title:  $('#title').val(),
        genre: $('#genre').val(),
        difficulty: $('#difficulty').val()
      }
      $.get({
        url: "/api/v1/get_searched_song.json",
        data: data,
        beforeSend: function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")}
      })
      .done(function( data ) {
        if(data.length > 0)
          this.state.filtered_songs = data;
        else
          this.state.filtered_songs = [];
      }.bind(this));
    },

    on_input_focus(e,m) {
      e.target.style.color = 'black';
      if(e.target.value == "Search" ) { e.target.value = ''; }
      else { e.target.select(); }
    },

    on_input_blur(e,m) {
      if(this.state.filtered_songs.length == 0 ) { this.reset_filter(); return; }
      e.target.value = ( e.target.value == '' ? "Search" : e.target.value ); 
      if(e.target.value == 'Search' ) { e.target.style.color = 'grey'; }
    },

    on_load_failed(e) {
      console.log(e);
    }

  }
);


//////////////////////////////// HANDLERS //////////////////////////////////////////////


///////////////////////////////// EVENTS ///////////////////////////////////////////////

Object.assign( Songlist.prototype, ev_channel );

Object.assign(Songlist.prototype, {

  select(index) {
    this.ev_fire('selected', this.state.filtered_songs[index] );
    this.reset_filter();
  },

  list_loaded() {
    this.state.filtered_songs = this.state.songs;
    this.ev_fire('list_loaded');
  }

});

///////////////////////////////// EVENTS ///////////////////////////////////////////////


Songlist.prototype.HTML = `
  <div id="songlist">
    <div class="searchbar">
      <input id="title" rv-on-input='this.get_searched_song' rv-on-focus='this.on_input_focus' rv-on-blur='this.on_input_blur' value='Search' style='color: grey;'></input>\
      <div class="searchselect col-sm-12">
        <div class="col-sm-6">
          <select id="genre" rv-on-change='this.get_searched_song'></select>
        </div>
        <div class="col-sm-6">
          <select id="difficulty" rv-on-change='this.get_searched_song'></select>
        </div>
      </div>
    </div>
    <div class="searchlist">
      <div class="songitem" rv-each-song="data.filtered_songs" rv-on-click="this.on_click">
        <img rv-src="song.youtube_id | img_url"></img>
        <span rv-text="song.title"></span>
      </div>
    </div>
  </div>  
`.untab(2);

Songlist.prototype.CSS = `
  
  #songlist {
  	display: flex;
  	flex-direction: column;
  	border: 1px solid black;
  	height: 100%;
  	box-sizing: border-box;
    background-color: rgba(0,0,0,0.1);
  }

  .searchbar {
    padding: 1em;
    border-bottom: 1px solid black;
  }

  .searchlist {
  	padding: 0.7em;
  	overflow-y: scroll;
    height: 100%;
  }

  .songitem {
    cursor: pointer;
  	border: 1px solid black;
  	padding: 0.5em;
  	margin: 0.7em 0;
    text-align: left;
    white-space: nowrap;
    background-color: white;
  }

  .songitem:hover  { background-color: rgba(0,0,0,0.2); }
  .songitem:active { background-color: rgba(0,0,0,0.3); }

  .songitem * {
    vertical-align: middle;
  }

  .songitem img {
    width: 4em;
    max-width: 25%
  }

  .songitem span {
    font-size: 0.8em;
    width: 75%;
    padding: 0.2em;
    display: inline-block;
    white-space: normal;
  }

  .songitem:first-child {
    margin-top: 0;
  }


  input {
  	font-size: 1.3em;
    width: 100%;
    border-radius: 0.4em;
    border: 0;
    padding: 0 0.5em;
    border: 1px solid black;
  }

`.untab(2);