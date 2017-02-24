class Api::V1::YoutubeController < Api::ApiController

  require 'yt'

  Yt.configure do |config|
    config.api_key = ENV['YOUTUBE_API_KEY']
  end

  def videodata
    success_response(
      youtube_video_data(params[:id])
    )
  end

  def youtube_video_data(video_id)
    video = Yt::Video.new id:  video_id
    song = Song.find_by_youtube_id(video_id)
    { :id => video.id, :title => video.title, :description => video.description, :song => song ? song : {}}
  end
end