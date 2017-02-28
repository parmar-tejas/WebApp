class Api::V1::SongsController < Api::ApiController

  before_action :authenticate_user!, only: [:mysongs, :add, :update_songs_metadata]

  def index
    songs = Song.select(
      'DISTINCT ON (youtube_id) id,
      youtube_id,
      title,
      artist,
      song_title,
      uploaded_on'
    ).order(
      :youtube_id,
      uploaded_on: :DESC
    )

    success_response(songs)
  end

  def show
    song = Song.select(
      'DISTINCT ON (youtube_id) youtube_id,
      uploaded_on,
      title,
      artist,
      song_title,
      punches,
      published'
    ).where(
      youtube_id: params[:youtube_id]
    ).order(
      :youtube_id,
      uploaded_on: :DESC
    ).first

    unless song.blank?
      song = song.to_hash
    end
    success_response(song)
  end

  def mysongs
    song = Song.select(
      'DISTINCT ON(youtube_id) id,
      uploaded_on,
      youtube_id,
      title,
      punches,
      published'
      ).where(
        uploaded_by: current_user.id
      ).order(
        :youtube_id,
        uploaded_on: :DESC
    )

    success_response(song.first)
  end

  def list
    songs = Song.select(
      'DISTINCT ON(youtube_id) id,
      uploaded_on,
      youtube_id,
      title,
      punches,
      genre_id,
      difficulty_id,
      published',
    ).order(
      :youtube_id,
      uploaded_on: :DESC
    ).first(10)

    success_response(songs)
  end

  def add
    data = JSON.parse(request.body.read)
    song = Song.find_or_initialize_by(
      uploaded_by: current_user.id,
      youtube_id: data['youtube_id']
    )
    song.title         = data['title']
    song.punches       = data['chords']
    song.artist        = data['artist']
    song.genre_id      = data['genre']
    song.difficulty_id = data['difficulty']
    song.published     = true
    song.save

    success_response(song)
  end

  def get_related_songs
    song = Song.find_by_youtube_id(params[:youtube_id])
    related_songs = Song.where.not(id: song.id).where('genre_id = ? OR difficulty_id = ?', song.genre_id, song.difficulty_id).limit(3) rescue []
    success_response(related_songs)
  end

  def get_searched_song
    conditions = []
    controller_params_options( params[:title], "title", conditions, "like" ) if params[:title]
    controller_params_options( params[:title], "artist", conditions, "like" ) if params[:title]
    controller_params_options( params[:genre], "genre_id", conditions, "=" ) unless params[:genre] == "Select genre"
    controller_params_options( params[:difficulty], "difficulty_id", conditions, "=" ) unless params[:difficulty] == "Select difficulty"
    controller_params_options( true, "published", conditions, "=" )
    songs = Song.select(
      'DISTINCT ON(youtube_id) id,
      uploaded_on,
      youtube_id,
      title,
      artist,
      punches'
      ).where(
        conditions
      ).order(
        :youtube_id,
        uploaded_on: :DESC
      ).first(10)

    success_response(songs)
  end

  def get_promotion_video
    data = {}
    song = Song.where(promotion: true).order(updated_at: :desc).first
    data[:video_id] = song ? song.youtube_id : Song.first.try(:youtube_id)
    success_response(data)
  end
end