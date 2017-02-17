class Api::V1::SongsController < Api::ApiController

  before_action :authenticate_user!, only: [:mysongs, :add]

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
      punches'
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
      punches'
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
      genere_id,
      difficulty_id',
    ).order(
      :youtube_id,
      uploaded_on: :DESC
    )

    success_response(songs)
  end

  def add
    song = Song.create(
        uploaded_by: current_user.id,
        youtube_id: params[:youtube],
        title: params[:title],
        punches: params[:chords]
      )

    success_response(song)
  end

  def get_related_songs
    song = Song.find_by_youtube_id(params[:youtube_id])
    related_songs = Song.joins(:genere).where("artist like (?) OR generes.name like (?)", song.artist, song.try(:genere).try(:name))
    success_response(related_songs)
  end

end