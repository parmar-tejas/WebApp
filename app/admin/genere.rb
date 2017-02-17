ActiveAdmin.register Genere do

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
    f.inputs "Genere" do
     f.input :name
    end
    f.actions
  end

  show do |genere|
    panel "Genere" do
      attributes_table_for genere do
        row :name
      end
    end
  end
end
