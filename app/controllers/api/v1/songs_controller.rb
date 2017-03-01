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
    response = {}
    data = JSON.parse(request.body.read)
    song = Song.find_or_initialize_by(
      uploaded_by: current_user.id,
      youtube_id: data['youtube_id']
    )
    unless song.published
      song.title         = data['title']
      song.punches       = data['chords']
      song.artist        = data['artist']
      song.genre_id      = data['genre']
      song.difficulty_id = data['difficulty']
      song.published     = true
      response[:message] = "Song Published!"
    else
      song.published = false
      response[:message] = "Song Unpublished!"
    end

    response[:message] = song.save ? response[:message] : song.errors.full_messages

    success_response(response)
  end

  def get_related_songs
    song = Song.find_by_youtube_id(params[:youtube_id])
    related_songs = Song.where.not(id: song.id).where('genre_id = ? OR difficulty_id = ?', song.genre_id, song.difficulty_id) rescue []
    success_response(related_songs)
  end

  def get_searched_song
    conditions = []
    if params[:title]
      conditions[0] = "published = ?"
      conditions << true
      conditions[0] = conditions[0] + ' and (lower(title) like ? or lower(artist) like ?)'
      conditions << "%#{params[:title].downcase}%"
      conditions << "%#{params[:title].downcase}%"
      if params[:genre].to_i > 0
        conditions[0] = conditions[0] + ' and genre_id = ?'
        conditions << params[:genre]
      end
      if params[:difficulty].to_i > 0
        conditions[0] = conditions[0] + ' and difficulty_id = ?'
        conditions << params[:difficulty]
      end
    end
    songs = Song.select(
              :id,
              :youtube_id,
              :uploaded_on,
              :youtube_id,
              :title,
              :artist,
              :punches
            ).where(
              conditions
            ).order(
              uploaded_on: :DESC
            ).first(10)

    success_response(songs)
  end

  def get_promotion_video
    data = {}
    song = Song.select(
      'DISTINCT ON(youtube_id) id,
      uploaded_on,
      youtube_id,
      title,
      artist,
      punches'
    ).where(promotion: true).order(:youtube_id, updated_at: :desc).first
    data[:video_id] = song ? song.youtube_id : Song.first.try(:youtube_id)
    success_response(data)
  end
end