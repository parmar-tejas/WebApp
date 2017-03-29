ActiveAdmin.register Chord do

  menu priority: 6
  config.clear_action_items!
  actions :all, except: :destroy

  permit_params(
    :color_code
  )

  index do
    selectable_column
    id_column
    column :root
    column :quality
    column :color_code
    actions
  end

  filter :root
  filter :quality

  form do |f|
    f.inputs "Chord" do
      f.input :root
      f.input :quality
      f.input :color_code
    end
    f.actions
  end

  show do |chord|
    panel "Chord" do
      attributes_table_for chord do
        row :root do
          Chord.note_name(chord.root)
        end
        row :quality
        row :fingering
        row :color_code
      end
    end
  end
end