var youtube_api_ready = false;
load_youtube_api();

function load_youtube_api(callback) {
  youtube_api_ready = callback;
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
  youtube_api_ready = true;
  if(isFunction(youtube_api_ready)) { youtube_api_ready(); }
}

function wait_for_youtube_api(callback) {
  var timer = setInterval( function() {
    if(youtube_api_ready) {
      callback();
      clearInterval(timer);
    }
  }, 100);
}

function YTPlayer(parent, video_id) {
  this.timer = false;
  this.video_id = 'eihus-1PN7o';
  this._duration = 0;
  this._current_time = 0;
  this.on_deck = false; 
  this.videodata = {};
  this.timechange_callbacks = [];
  this.bind_handlers();
  wait_for_youtube_api( function(video_id) {
    this.player = this.build_player(parent, video_id);
  }.bind(this,video_id));
}


YTPlayer.prototype = {
  constructor: YTPlayer,
  bind_handlers() {
    this.load = this.load.bind(this);
  },
  url_regex: /https:\/\/www.youtube.com\/watch\?v=(.{11})/,

  set current_time(time_s) {
    this.player.seekTo(time_s,true);
    this.update_time(time_s);
  },

  get current_time() { 
    var t = this.player.getCurrentTime();
    return typeof(t) == 'undefined' ? 0 : t.toFixed(3); 
  },

  get duration() {
    if(this._duration != this.player.getDuration) {
      this._duration = this.player.getDuration();
      this.ev_fire( 'duration', this._duration );
    }
    return this._duration;
  },

  build_player(parent_id,vid_id) {
    this.video_id = vid_id || this.video_id;
    return new YT.Player(parent_id, {
      height: '390', 
      width: '640',
      videoId: this.video_id,
      events: {
        'onReady': this.onPlayerReady.bind(this),
        'onStateChange': this.onPlayerStateChange.bind(this)
      }
    });
  },

  onPlayerReady(event) {
    if(this.on_deck) { 
      this.on_deck = false;
      console.log( `loading on deck video ${this.video_id}` );
      //this.load(this.video_id); return; 
    }
    //event.target.playVideo();
    this.get_video_data();
  },

  update_time(time_s) {
    time_s = time_s || this.player.getCurrentTime();
    this._current_time = typeof(time_s) == 'undefined' ? 0 : time_s.toFixed(3);
    for(var i=0; i < this.timechange_callbacks.length; i++) {
      if( ! isFunction(this.timechange_callbacks[i]) ) continue;
      this.timechange_callbacks[i](this._current_time);
    }
  },

  onPlayerStateChange(event) {
    if(this.timer)  { clearInterval(this.timer); this.timer = false; }
    switch(event.data) {
      case YT.PlayerState.ENDED:
        this.ev_fire('ended',null);
        this.update_time();
        //console.log('ENDED');
        break;
      case YT.PlayerState.PLAYING:
        this.duration;
        this.timer = setInterval( this.update_time.bind(this), 70 );
        break;
      case YT.PlayerState.PAUSED:
        //console.log('PAUSED');
        break;
      case YT.PlayerState.BUFFERING:
        //console.log('BUFFERING');
        break;
      case YT.PlayerState.CUED:
        //console.log('CUED');
        break;
    }
    
    //else { this.timer = setInterval( this.update_time.bind(this), 500 ); }
  },

  onVideoData(data) {
    this.videodata = data;
    if(isFunction(this.videodata_callback)) {
      this.videodata_callback(data);
    }
  },

  on_time_change(callback) {
    this.timechange_callbacks.push(callback);
  },

  on_video_data(callback) {
    this.videodata_callback = callback
  },

  load(url) {
    if( empty(url) ) { return; }
    var match = this.url_regex.exec(url);
    if(!match && url.length != 11) { alert('invalid syntax'); return; }
    this.video_id = url.length == 11 ? url : match[1];
    if( empty(this.player) ) {
      console.log(`tried to load video before player was ready: ${this.video_id}`);
      this.on_deck = true;
      return;
    }
    if( isFunction(this.player.loadVideoById) ) {
      this.player.loadVideoById(this.video_id, 0, "large");
      this.get_video_data();
    }
    else { this.on_deck = true; }
  },

  stop() {
    this.player.stopVideo();
  },

  get_video_data() {
    $.get('api/v1/youtube/videodata/' + this.video_id, this.onVideoData.bind(this));
  }

}

Object.assign( YTPlayer.prototype, ev_channel );