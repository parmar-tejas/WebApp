ActiveAdmin.register User do

  menu priority: 3
  actions :all, :except => [:new, :edit]

  index do
    selectable_column
    id_column
    column :name
    column :email
    column :current_sign_in_at
    column :last_sign_in_at
    actions do |user|
      link_to 'Songs', admin_songs_path(q: {uploaded_by_eq: user.id})
    end
  end

  show do |user|
    panel "User" do
      attributes_table_for user do
        row :name
        row :email
        row :encrypted_password
        row :remember_created_at
        row :sign_in_count
        row :current_sign_in_at
        row :last_sign_in_at
        row :current_sign_in_ip
        row :last_sign_in_ip
        row :created_at
        row :updated_at
      end
    end
    panel "Omniaccount" do
      attributes_table_for user.omniaccount do
        row :provider
        row :provider_id
        row :photo_url
      end
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