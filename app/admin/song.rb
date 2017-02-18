  ActiveAdmin.register Song do

  menu priority: 2
  permit_params(
    :youtube_id,
    :title,
    :punches,
    :uploaded_on,
    :artist,
    :song_title,
    :uploaded_by,
    :difficulty_id,
    :genere_id,
    :published,
    :promotion
  )

  index do
    selectable_column
    id_column
    column :title
    column :uploaded_on
    column :artist
    column :song_title
    column 'Uploaded By' do |song|
      if song.uploaded_by
        link_to song.user.try(:name), admin_user_path(song.uploaded_by)
      end
    end
    column :genere
    column :difficulty
    column :published
    column :promotion
    actions
  end

  filter :title
  filter :uploaded_on
  filter :artist
  filter :genere
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
      f.input :title
      f.input :punches, as: 'text'
      f.input :artist
      f.input :song_title
      f.input :genere
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
        row :title
        row :punches
        row :uploaded_on
        row :artist
        row :song_title
        row :uploaded_by
        row :genere
        row :difficulty
        row :published
        row :promotion
      end
    end
  end
end