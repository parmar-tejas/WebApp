class FretxController < ApplicationController
  before_action :authenticate_user!, only: :create_new_song

  def player
    if params[:id] && params[:youtube_id]
      @song =  Song.where(
                id: params[:id],
                youtube_id: params[:youtube_id]
              ).first
    end
    @song = Song.promotional_song if @song.blank?
    @my_songs = Song.where(
                  uploaded_by: current_user.id,
                  published: true
                )
    @related_songs = Song.related_songs(@song)
  end


  def list
  end

  def editor
    redirect_to root_path unless current_user
    if params[:id] && params[:youtube_id]
      @song =  Song.where(
                id: params[:id],
                youtube_id: params[:youtube_id]
              ).first
    end
    @my_songs = Song.where(
                  uploaded_by: current_user.id
                )

    redirect_to root_path, notice: 'you are not authorized to access the page' if @song.blank?
  end

  def create_new_song
    song = Song.new
    song.youtube_id  = params[:youtube_url]
    song.uploaded_by = current_user.id
    if song.save
      redirect_to controller: "fretx", action: "editor", id: song.id, youtube_id: song.youtube_id
    else
      redirect_to :back
    end
  end
end