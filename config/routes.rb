Rails.application.routes.draw do
  devise_for(
    :admin_users,
    ActiveAdmin::Devise.config
  )
  ActiveAdmin.routes(self)
  devise_for(
    :users,
    controllers: {
      omniauth_callbacks: 'omniauth_callbacks'
    }
  )

  get(
    'index',
    to: 'home#index',
    as: 'home'
  )

  root 'fretx#player'

  #Api
  namespace :api do
    namespace :v1 do
      get(
        '/songs/index',
        to: 'songs#index'
      )
      get(
        '/songs/list',
        to: 'songs#list'
      )
      get(
        '/songs/:youtube_id',
        to: 'songs#show'
      )
      get(
        '/mysongs',
        to: 'songs#mysongs'
      )
      get(
        '/youtube/videodata/:id',
        to: 'youtube#videodata'
      )
      get(
        '/chords',
        to: 'chords#index'
      )
      get(
        '/chords/:chordname',
        to: 'chords#show'
        )
      get(
        '/autocompletes/get_select_data',
        to: 'autocompletes#get_select_data'
        )
      get(
        '/get_related_songs',
        to: 'songs#get_related_songs'
        )
      get(
        '/get_searched_song',
        to: 'songs#get_searched_song'
        )
      get(
        '/get_promotion_video',
        to: 'songs#get_promotion_video'
        )
    end
  end
  get "/player", to: "fretx#player"
  get "/list",   to: "fretx#list"
  get "/editor", to: "fretx#editor"
end
