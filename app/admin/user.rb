ActiveAdmin.register User do
  actions :all, :except => [:new]

  index do
    selectable_column
    id_column
    column :name
    column :email
    column :provider
    column :uid
    column :current_sign_in_at
    column :last_sign_in_at
    actions do |user|
      link_to 'Songs', admin_songs_path(q: {uploaded_by_eq: user.id})
    end
  end

  filter :email
  filter :name

  # Autocomplete
  collection_action :autocomplete_user_name, method: :get

  controller do
    autocomplete :user, :name, full: true
  end
end