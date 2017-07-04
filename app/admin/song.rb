  ActiveAdmin.register Song do

  menu priority: 2
  permit_params(
    :youtube_id,
    :punches,
    :created_at,
    :updated_at,
    :artist,
    :song_title,
    :uploaded_by,
    :difficulty_id,
    :genre_id,
    :published,
    :promotion
  )

  index do
    selectable_column
    id_column
    column :artist
    column :song_title
    column 'Uploaded By' do |song|
      if song.uploaded_by
        link_to song.user.try(:name), admin_user_path(song.uploaded_by)
      end
    end
    column :genre
    column :difficulty
    column :created_at
    column :updated_at
    column :published
    column :promotion
    actions
  end

  filter :created_at
  filter :updated_at
  filter :artist
  filter :song_title
  filter :genre
  filter :difficulty
  filter :published
  filter :promotion
  filter :song_title
  filter(
    :user_name,
    as: :autocomplete,
    url: "/admin/users/autocomplete_user_name",
    input_html: {
      id_element: '#q_uploaded_by_eq',
      'data-auto-focus' => true
    }
  )
  filter :uploaded_by_eq, as: :hidden

  form do |f|
    f.inputs "Song" do
      f.input :youtube_id
      f.input :artist
      f.input :song_title
      f.input :genre
      f.input :difficulty
      f.input(
        :uploaded_by,
        label: 'Uploaded by',
        as: :select,
        collection: User.pluck(
                      :name,
                      :id
                    )
      )
      f.input :published
      f.input :promotion
    end
    f.actions
  end

  show do |song|
    panel "Song" do
      attributes_table_for song do
        row :youtube_id
        row :punches
        row :artist
        row :song_title
        row :created_at
        row :updated_at
        row :uploaded_by
        row :genre
        row :difficulty
        row :published
        row :promotion
      end
    end
  end
end