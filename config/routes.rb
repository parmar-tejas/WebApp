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
end
