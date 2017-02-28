class FretxController < ApplicationController
  def player
    if params[:id] && params[:youtube_id]
      @song =  Song.where(
                id: params[:id],
                youtube_id: params[:youtube_id]
              ).first
    end
    @song = Song.promotional_song if @song.blank?

    @related_songs = Song.related_songs(@song)
  end

  def list
  end

  def editor
    redirect_to root_path unless current_user
  end
end