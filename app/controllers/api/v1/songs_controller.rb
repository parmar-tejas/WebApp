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
      punches'
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


end