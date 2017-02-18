ActiveAdmin.register Genre do

  menu priority: 4
  permit_params(
    :name
  )

  index do
    selectable_column
    id_column
    column :name
    actions
  end

  filter :name

  form do |f|
    f.inputs "Genre" do
     f.input :name
    end
    f.actions
  end

  show do |genre|
    panel "Genre" do
      attributes_table_for genre do
        row :name
      end
    end
  end
end
