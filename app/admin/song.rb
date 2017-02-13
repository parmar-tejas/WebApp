ActiveAdmin.register Song do
  permit_params(
    :youtube_id,
    :title,
    :punches,
    :uploaded_on,
    :artist,
    :song_title,
    :uploaded_by,
  )

  index do
    selectable_column
    id_column
    column :title
    column :uploaded_on
    column :artist
    column :song_title
    column 'Uploaded By' do |song|
     link_to song.user.try(:name), admin_user_path(song.uploaded_by)
    end
    actions
  end

  filter :title
  filter :uploaded_on
  filter :artist
  filter :song_title

  form do |f|
    f.inputs "Song" do
     f.input :youtube_id
     f.input :title
     f.input :punches, as: 'text'
     f.input :artist
     f.input :song_title
     f.input(
        :uploaded_by,
        label: 'Uploaded by',
        as: :select,
        collection: User.pluck(
                      :name,
                      :id
                    )
      )
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
      end
    end
  end
end