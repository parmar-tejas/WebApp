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

  root 'home#index'

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
    end
  end
end
